import { supabase } from "./supabase";

export type Category = "Furniture" | "Electronics" | "Kitchen" | "Clothing" | "Other";
export type Condition = "New" | "Used" | "Refurbished" | "Special Deal";
export type City = "Tel Aviv" | "Jerusalem" | "Haifa" | "Eilat";

export interface Seller {
  id: string;
  name: string;
  avatar: string | null;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: Category;
  condition: Condition;
  city: City;
  originalPrice: number;
  sellPrice: number;
  images: string[];
  status: string;
  createdAt: string;
  seller: Seller;
  isWatchlisted: boolean;
}

export interface ListingFilters {
  category?: string;
  condition?: string;
  city?: string;
  sort?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

// Helper: get the current user's profile row ID
async function getMyUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();
  return data?.id ?? null;
}

// Transform a raw DB row + joined user into our Listing shape
function toListing(row: any, watchlistedIds?: Set<string>): Listing {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    condition: row.condition,
    city: row.city,
    originalPrice: row.original_price,
    sellPrice: row.sell_price,
    images: row.images ?? [],
    status: row.status,
    createdAt: row.created_at,
    seller: {
      id: row.users?.id ?? row.seller_id,
      name: row.users?.full_name ?? "Unknown",
      avatar: row.users?.avatar_url ?? null,
    },
    isWatchlisted: watchlistedIds ? watchlistedIds.has(row.id) : false,
  };
}

export const api = {
  // ─── Listings ─────────────────────────────────────────────
  getListings: async (filters: ListingFilters = {}): Promise<Listing[]> => {
    let query = supabase
      .from("listings")
      .select("*, users!listings_seller_id_fkey(id, full_name, avatar_url)")
      .eq("status", "active");

    if (filters.category) {
      const cats = filters.category.split(",").map((s) => s.trim()).filter(Boolean);
      if (cats.length === 1) query = query.eq("category", cats[0]);
      else if (cats.length > 1) query = query.in("category", cats);
    }
    if (filters.condition) {
      const conds = filters.condition.split(",").map((s) => s.trim()).filter(Boolean);
      if (conds.length === 1) query = query.eq("condition", conds[0]);
      else if (conds.length > 1) query = query.in("condition", conds);
    }
    if (filters.city) query = query.eq("city", filters.city);
    if (filters.search) query = query.ilike("title", `%${filters.search}%`);

    // Sort
    if (filters.sort === "price_asc") {
      query = query.order("sell_price", { ascending: true });
    } else if (filters.sort === "price_desc") {
      query = query.order("sell_price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (filters.limit) query = query.limit(filters.limit);
    if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 12) - 1);

    const { data, error } = await query;
    if (error) throw error;

    // Check watchlist for current user
    let watchlistedIds = new Set<string>();
    const userId = await getMyUserId();
    if (userId && data && data.length > 0) {
      const { data: wl } = await supabase
        .from("watchlist")
        .select("listing_id")
        .eq("user_id", userId)
        .in("listing_id", data.map((r: any) => r.id));
      if (wl) watchlistedIds = new Set(wl.map((w: any) => w.listing_id));
    }

    return (data ?? []).map((row: any) => toListing(row, watchlistedIds));
  },

  getListing: async (id: string): Promise<Listing> => {
    const { data, error } = await supabase
      .from("listings")
      .select("*, users!listings_seller_id_fkey(id, full_name, avatar_url)")
      .eq("id", id)
      .single();
    if (error) throw error;

    let isWatchlisted = false;
    const userId = await getMyUserId();
    if (userId) {
      const { data: wl } = await supabase
        .from("watchlist")
        .select("listing_id")
        .eq("user_id", userId)
        .eq("listing_id", id)
        .maybeSingle();
      isWatchlisted = !!wl;
    }

    return toListing(data, isWatchlisted ? new Set([id]) : new Set());
  },

  createListing: async (input: {
    title: string;
    description: string;
    category: string;
    condition: string;
    city: string;
    originalPrice: number;
    sellPrice: number;
    images: string[];
  }) => {
    const userId = await getMyUserId();
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("listings")
      .insert({
        seller_id: userId,
        title: input.title,
        description: input.description,
        category: input.category,
        condition: input.condition,
        city: input.city || undefined,
        original_price: input.originalPrice,
        sell_price: input.sellPrice,
        images: input.images,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateListing: async (id: string, updates: Record<string, unknown>) => {
    const mapped: Record<string, unknown> = {};
    if (updates.title !== undefined) mapped.title = updates.title;
    if (updates.description !== undefined) mapped.description = updates.description;
    if (updates.category !== undefined) mapped.category = updates.category;
    if (updates.condition !== undefined) mapped.condition = updates.condition;
    if (updates.city !== undefined) mapped.city = updates.city;
    if (updates.originalPrice !== undefined) mapped.original_price = updates.originalPrice;
    if (updates.sellPrice !== undefined) mapped.sell_price = updates.sellPrice;
    if (updates.images !== undefined) mapped.images = updates.images;
    if (updates.status !== undefined) mapped.status = updates.status;
    mapped.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("listings")
      .update(mapped)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteListing: async (id: string) => {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) throw error;
  },

  // ─── My Listings ──────────────────────────────────────────
  getMyListings: async (): Promise<Listing[]> => {
    const userId = await getMyUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from("listings")
      .select("*, users!listings_seller_id_fkey(id, full_name, avatar_url)")
      .eq("seller_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: any) => toListing(row));
  },

  // ─── Watchlist ────────────────────────────────────────────
  getWatchlist: async (): Promise<Listing[]> => {
    const userId = await getMyUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from("watchlist")
      .select("listing_id, listings(*, users!listings_seller_id_fkey(id, full_name, avatar_url))")
      .eq("user_id", userId);
    if (error) throw error;

    return (data ?? [])
      .filter((w: any) => w.listings)
      .map((w: any) => toListing(w.listings, new Set([w.listing_id])));
  },

  addToWatchlist: async (listingId: string) => {
    const userId = await getMyUserId();
    if (!userId) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("watchlist")
      .upsert({ user_id: userId, listing_id: listingId });
    if (error) throw error;
  },

  removeFromWatchlist: async (listingId: string) => {
    const userId = await getMyUserId();
    if (!userId) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", userId)
      .eq("listing_id", listingId);
    if (error) throw error;
  },

  // ─── Users / Profile ─────────────────────────────────────
  getProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  createProfile: async (input: { fullName: string; phone: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("users")
      .upsert({
        auth_id: user.id,
        full_name: input.fullName,
        phone: input.phone,
      }, { onConflict: "auth_id" })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateProfile: async (updates: Record<string, unknown>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const mapped: Record<string, unknown> = {};
    if (updates.fullName !== undefined) mapped.full_name = updates.fullName;
    if (updates.phone !== undefined) mapped.phone = updates.phone;
    if (updates.avatarUrl !== undefined) mapped.avatar_url = updates.avatarUrl;
    mapped.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("users")
      .update(mapped)
      .eq("auth_id", user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ─── Admin ────────────────────────────────────────────────
  getAdminStats: async () => {
    const [
      { count: total },
      { count: active },
      { count: inProcess },
      { count: sold },
      { count: totalUsers },
    ] = await Promise.all([
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "in_process"),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "sold"),
      supabase.from("users").select("*", { count: "exact", head: true }),
    ]);
    return { total: total ?? 0, active: active ?? 0, inProcess: inProcess ?? 0, sold: sold ?? 0, totalUsers: totalUsers ?? 0 };
  },

  getAdminUsers: async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: any) => ({
      id: row.id,
      fullName: row.full_name,
      phone: row.phone,
      isAdmin: row.is_admin,
      createdAt: row.created_at,
    }));
  },

  updateListingStatus: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from("listings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ─── My Purchases (items where I am the buyer) ───────────
  getMyPurchases: async (): Promise<Listing[]> => {
    const userId = await getMyUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from("listings")
      .select("*, users!listings_seller_id_fkey(id, full_name, avatar_url)")
      .eq("buyer_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: any) => toListing(row));
  },

  // ─── Deal Requests ───────────────────────────────────────
  requestDeal: async (listingId: string) => {
    const userId = await getMyUserId();
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase.rpc("request_deal", {
      p_listing_id: listingId,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  getAdminListings: async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*, users!listings_seller_id_fkey(id, full_name, phone), buyer:users!listings_buyer_id_fkey(id, full_name, phone)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: any) => ({
      ...row,
      originalPrice: row.original_price,
      sellPrice: row.sell_price,
      createdAt: row.created_at,
      sellerName: row.users?.full_name ?? "Unknown",
      sellerPhone: row.users?.phone ?? null,
      buyerName: row.buyer?.full_name ?? null,
      buyerPhone: row.buyer?.phone ?? null,
    }));
  },

  // ─── Contact Requests ────────────────────────────────────
  submitContactRequest: async (input: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) => {
    const { error } = await supabase.from("contact_requests").insert({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || null,
      message: input.message.trim(),
    });
    if (error) throw error;
  },

  getContactRequests: async () => {
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  markContactRead: async (id: string, is_read: boolean) => {
    const { error } = await supabase
      .from("contact_requests")
      .update({ is_read })
      .eq("id", id);
    if (error) throw error;
  },
};
