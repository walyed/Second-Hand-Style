import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { watchlistTable, usersTable, listingsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router: IRouter = Router();

// GET /watchlist - Get user's watchlist
router.get("/watchlist", requireAuth, async (req: AuthenticatedRequest, res) => {
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

    const items = await db
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
      .from(watchlistTable)
      .innerJoin(listingsTable, eq(watchlistTable.listingId, listingsTable.id))
      .innerJoin(usersTable, eq(listingsTable.sellerId, usersTable.id))
      .where(eq(watchlistTable.userId, userRecord[0].id));

    const result = items.map((l) => ({
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
      isWatchlisted: true,
    }));

    res.json(result);
  } catch (err) {
    req.log?.error({ err }, "Failed to fetch watchlist");
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

// POST /watchlist/:listingId - Add to watchlist
router.post("/watchlist/:listingId", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { listingId } = req.params;

    const userRecord = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.authId, req.userId!))
      .limit(1);

    if (userRecord.length === 0) {
      res.status(403).json({ error: "User profile not found" });
      return;
    }

    await db
      .insert(watchlistTable)
      .values({ userId: userRecord[0].id, listingId })
      .onConflictDoNothing();

    res.status(201).json({ success: true });
  } catch (err) {
    req.log?.error({ err }, "Failed to add to watchlist");
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
});

// DELETE /watchlist/:listingId - Remove from watchlist
router.delete("/watchlist/:listingId", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { listingId } = req.params;

    const userRecord = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.authId, req.userId!))
      .limit(1);

    if (userRecord.length === 0) {
      res.status(403).json({ error: "User profile not found" });
      return;
    }

    await db
      .delete(watchlistTable)
      .where(
        and(
          eq(watchlistTable.userId, userRecord[0].id),
          eq(watchlistTable.listingId, listingId),
        ),
      );

    res.status(204).send();
  } catch (err) {
    req.log?.error({ err }, "Failed to remove from watchlist");
    res.status(500).json({ error: "Failed to remove from watchlist" });
  }
});

export default router;
