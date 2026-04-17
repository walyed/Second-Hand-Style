import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { listingsTable, usersTable, watchlistTable } from "@workspace/db/schema";
import { eq, desc, and, ilike, inArray, SQL, asc, sql } from "drizzle-orm";
import {
  requireAuth,
  optionalAuth,
  type AuthenticatedRequest,
} from "../middlewares/auth";

const router: IRouter = Router();

// GET /listings - List all active listings with optional filters
router.get("/listings", optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      category,
      condition,
      city,
      sort,
      search,
      limit: limitStr,
      offset: offsetStr,
    } = req.query as Record<string, string | undefined>;

    const conditions: SQL[] = [eq(listingsTable.status, "active")];

    if (category) {
      const cats = category.split(",") as any[];
      conditions.push(inArray(listingsTable.category, cats));
    }
    if (condition) {
      const conds = condition.split(",") as any[];
      conditions.push(inArray(listingsTable.condition, conds));
    }
    if (city) {
      const cities = city.split(",") as any[];
      conditions.push(inArray(listingsTable.city, cities));
    }
    if (search) {
      conditions.push(ilike(listingsTable.title, `%${search}%`));
    }

    let orderBy;
    switch (sort) {
      case "price_asc":
        orderBy = asc(listingsTable.sellPrice);
        break;
      case "price_desc":
        orderBy = desc(listingsTable.sellPrice);
        break;
      default:
        orderBy = desc(listingsTable.createdAt);
    }

    const limit = Math.min(Number(limitStr) || 50, 100);
    const offset = Number(offsetStr) || 0;

    const listings = await db
      .select({
        id: listingsTable.id,
        title: listingsTable.title,
        description: listingsTable.description,
        category: listingsTable.category,
        condition: listingsTable.condition,
        city: listingsTable.city,
        originalPrice: listingsTable.originalPrice,
        sellPrice: listingsTable.sellPrice,
        images: listingsTable.images,
        status: listingsTable.status,
        createdAt: listingsTable.createdAt,
        sellerName: usersTable.fullName,
        sellerAvatar: usersTable.avatarUrl,
        sellerId: usersTable.id,
      })
      .from(listingsTable)
      .innerJoin(usersTable, eq(listingsTable.sellerId, usersTable.id))
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get watchlist status for authenticated users
    let watchlistedIds: Set<string> = new Set();
    if (req.userId) {
      const userRecord = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.authId, req.userId))
        .limit(1);

      if (userRecord.length > 0) {
        const watchlisted = await db
          .select({ listingId: watchlistTable.listingId })
          .from(watchlistTable)
          .where(eq(watchlistTable.userId, userRecord[0].id));
        watchlistedIds = new Set(watchlisted.map((w) => w.listingId));
      }
    }

    const result = listings.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      category: l.category,
      condition: l.condition,
      city: l.city,
      originalPrice: l.originalPrice,
      sellPrice: l.sellPrice,
      images: l.images,
      status: l.status,
      createdAt: l.createdAt,
      seller: {
        id: l.sellerId,
        name: l.sellerName,
        avatar: l.sellerAvatar,
        rating: 4.8, // placeholder until reviews are implemented
      },
      isWatchlisted: watchlistedIds.has(l.id),
    }));

    res.json(result);
  } catch (err) {
    req.log?.error({ err }, "Failed to fetch listings");
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// GET /listings/:id - Get single listing
router.get("/listings/:id", optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const rows = await db
      .select({
        id: listingsTable.id,
        title: listingsTable.title,
        description: listingsTable.description,
        category: listingsTable.category,
        condition: listingsTable.condition,
        city: listingsTable.city,
        originalPrice: listingsTable.originalPrice,
        sellPrice: listingsTable.sellPrice,
        images: listingsTable.images,
        status: listingsTable.status,
        createdAt: listingsTable.createdAt,
        sellerName: usersTable.fullName,
        sellerAvatar: usersTable.avatarUrl,
        sellerId: usersTable.id,
      })
      .from(listingsTable)
      .innerJoin(usersTable, eq(listingsTable.sellerId, usersTable.id))
      .where(eq(listingsTable.id, id))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    const l = rows[0];
    let isWatchlisted = false;

    if (req.userId) {
      const userRecord = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.authId, req.userId))
        .limit(1);
      if (userRecord.length > 0) {
        const w = await db
          .select()
          .from(watchlistTable)
          .where(
            and(
              eq(watchlistTable.userId, userRecord[0].id),
              eq(watchlistTable.listingId, id),
            ),
          )
          .limit(1);
        isWatchlisted = w.length > 0;
      }
    }

    res.json({
      id: l.id,
      title: l.title,
      description: l.description,
      category: l.category,
      condition: l.condition,
      city: l.city,
      originalPrice: l.originalPrice,
      sellPrice: l.sellPrice,
      images: l.images,
      status: l.status,
      createdAt: l.createdAt,
      seller: {
        id: l.sellerId,
        name: l.sellerName,
        avatar: l.sellerAvatar,
        rating: 4.8,
      },
      isWatchlisted,
    });
  } catch (err) {
    req.log?.error({ err }, "Failed to fetch listing");
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

// POST /listings - Create a new listing
router.post("/listings", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userRecord = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.authId, req.userId!))
      .limit(1);

    if (userRecord.length === 0) {
      res.status(403).json({ error: "User profile not found" });
      return;
    }

    const { title, description, category, condition, city, originalPrice, sellPrice, images } =
      req.body;

    const [listing] = await db
      .insert(listingsTable)
      .values({
        sellerId: userRecord[0].id,
        title,
        description,
        category,
        condition,
        city,
        originalPrice: Number(originalPrice),
        sellPrice: Number(sellPrice),
        images: images || [],
      })
      .returning();

    res.status(201).json(listing);
  } catch (err) {
    req.log?.error({ err }, "Failed to create listing");
    res.status(500).json({ error: "Failed to create listing" });
  }
});

// PATCH /listings/:id - Update a listing
router.patch("/listings/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const userRecord = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.authId, req.userId!))
      .limit(1);

    if (userRecord.length === 0) {
      res.status(403).json({ error: "User profile not found" });
      return;
    }

    // Check ownership
    const existing = await db
      .select()
      .from(listingsTable)
      .where(and(eq(listingsTable.id, id), eq(listingsTable.sellerId, userRecord[0].id)))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({ error: "Listing not found or not owned by you" });
      return;
    }

    const { title, description, category, condition, city, originalPrice, sellPrice, images, status } =
      req.body;

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (condition !== undefined) updates.condition = condition;
    if (city !== undefined) updates.city = city;
    if (originalPrice !== undefined) updates.originalPrice = Number(originalPrice);
    if (sellPrice !== undefined) updates.sellPrice = Number(sellPrice);
    if (images !== undefined) updates.images = images;
    if (status !== undefined) updates.status = status;

    const [updated] = await db
      .update(listingsTable)
      .set(updates)
      .where(eq(listingsTable.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log?.error({ err }, "Failed to update listing");
    res.status(500).json({ error: "Failed to update listing" });
  }
});

// DELETE /listings/:id - Delete a listing
router.delete("/listings/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const userRecord = await db
      .select({ id: usersTable.id, isAdmin: usersTable.isAdmin })
      .from(usersTable)
      .where(eq(usersTable.authId, req.userId!))
      .limit(1);

    if (userRecord.length === 0) {
      res.status(403).json({ error: "User profile not found" });
      return;
    }

    // Check ownership or admin
    const existing = await db
      .select()
      .from(listingsTable)
      .where(eq(listingsTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    if (existing[0].sellerId !== userRecord[0].id && !userRecord[0].isAdmin) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    await db.delete(listingsTable).where(eq(listingsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log?.error({ err }, "Failed to delete listing");
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

export default router;
