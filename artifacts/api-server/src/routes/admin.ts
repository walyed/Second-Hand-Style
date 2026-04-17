import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { listingsTable, usersTable } from "@workspace/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router: IRouter = Router();

// Admin middleware
async function requireAdmin(
  req: AuthenticatedRequest,
  res: import("express").Response,
  next: import("express").NextFunction,
) {
  const userRecord = await db
    .select({ isAdmin: usersTable.isAdmin })
    .from(usersTable)
    .where(eq(usersTable.authId, req.userId!))
    .limit(1);

  if (userRecord.length === 0 || !userRecord[0].isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

// GET /admin/stats - Dashboard stats
router.get("/admin/stats", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const [itemStats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where ${listingsTable.status} = 'active')::int`,
        inProcess: sql<number>`count(*) filter (where ${listingsTable.status} = 'in_process')::int`,
        sold: sql<number>`count(*) filter (where ${listingsTable.status} = 'sold')::int`,
      })
      .from(listingsTable);

    const [userStats] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(usersTable);

    res.json({
      totalItems: itemStats.total,
      activeListings: itemStats.active,
      inProcess: itemStats.inProcess,
      sold: itemStats.sold,
      totalUsers: userStats.total,
    });
  } catch (err) {
    req.log?.error({ err }, "Failed to fetch admin stats");
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// GET /admin/listings - All listings (admin view)
router.get("/admin/listings", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const listings = await db
      .select({
        id: listingsTable.id,
        title: listingsTable.title,
        category: listingsTable.category,
        condition: listingsTable.condition,
        city: listingsTable.city,
        sellPrice: listingsTable.sellPrice,
        images: listingsTable.images,
        status: listingsTable.status,
        createdAt: listingsTable.createdAt,
        sellerName: usersTable.fullName,
        sellerId: usersTable.id,
      })
      .from(listingsTable)
      .innerJoin(usersTable, eq(listingsTable.sellerId, usersTable.id))
      .orderBy(listingsTable.createdAt);

    res.json(listings);
  } catch (err) {
    req.log?.error({ err }, "Failed to fetch admin listings");
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// GET /admin/users - All users
router.get("/admin/users", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
    res.json(users);
  } catch (err) {
    req.log?.error({ err }, "Failed to fetch users");
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// PATCH /admin/listings/:id/status - Update listing status
router.patch(
  "/admin/listings/:id/status",
  requireAuth,
  requireAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const [updated] = await db
        .update(listingsTable)
        .set({ status, updatedAt: new Date() })
        .where(eq(listingsTable.id, id))
        .returning();

      if (!updated) {
        res.status(404).json({ error: "Listing not found" });
        return;
      }

      res.json(updated);
    } catch (err) {
      req.log?.error({ err }, "Failed to update listing status");
      res.status(500).json({ error: "Failed to update status" });
    }
  },
);

export default router;
