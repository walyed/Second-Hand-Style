import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router: IRouter = Router();

// GET /users/me - Get current user profile
router.get("/users/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.authId, req.userId!))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Failed to fetch profile");
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// POST /users/me - Create user profile (called after signup)
router.post("/users/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    // Check if profile already exists
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.authId, req.userId!))
      .limit(1);

    if (existing.length > 0) {
      res.json(existing[0]);
      return;
    }

    const { fullName, phone } = req.body;

    if (!fullName || !phone) {
      res.status(400).json({ error: "fullName and phone are required" });
      return;
    }

    const [user] = await db
      .insert(usersTable)
      .values({
        authId: req.userId!,
        fullName,
        phone,
      })
      .returning();

    res.status(201).json(user);
  } catch (err) {
    req.log?.error({ err }, "Failed to create profile");
    res.status(500).json({ error: "Failed to create profile" });
  }
});

// PATCH /users/me - Update user profile
router.patch("/users/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { fullName, avatarUrl } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (fullName !== undefined) updates.fullName = fullName;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.authId, req.userId!))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    req.log?.error({ err }, "Failed to update profile");
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
