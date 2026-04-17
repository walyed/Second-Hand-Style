import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";

export const categoryEnum = pgEnum("category", [
  "Furniture",
  "Electronics",
  "Kitchen",
  "Clothing",
  "Other",
]);

export const conditionEnum = pgEnum("condition", [
  "New",
  "Used",
  "Refurbished",
  "Special Deal",
]);

export const cityEnum = pgEnum("city", [
  "Tel Aviv",
  "Jerusalem",
  "Haifa",
  "Eilat",
]);

export const listingStatusEnum = pgEnum("listing_status", [
  "active",
  "in_process",
  "sold",
  "removed",
]);

export const listingsTable = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: categoryEnum("category").notNull(),
  condition: conditionEnum("condition").notNull(),
  city: cityEnum("city").notNull(),
  originalPrice: integer("original_price").notNull(),
  sellPrice: integer("sell_price").notNull(),
  images: text("images").array().notNull().default([]),
  status: listingStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
