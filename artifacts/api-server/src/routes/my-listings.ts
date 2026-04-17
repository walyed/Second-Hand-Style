import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { listingsTable, usersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router: IRouter = Router();

// GET /my-listings - Get current user's listings
router.get("/my-listings", requireAuth, async (req: AuthenticatedRequest, res) => {
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

    const listings = await db
      .select()
      .from(listingsTable)
      .where(eq(listingsTable.sellerId, userRecord[0].id))
      .orderBy(listingsTable.createdAt);

    res.json(listings);
  } catch (err) {
    req.log?.error({ err }, "Failed to fetch my listings");
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

export default router;
