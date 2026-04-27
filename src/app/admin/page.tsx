"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  Activity,
  AlertCircle,
  CheckCircle2,
  Search,
  LayoutDashboard,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Tab = "dashboard" | "items" | "users";

export default function Admin() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      api.getAdminStats().catch(() => null),
      api.getAdminListings().catch(() => []),
      api.getAdminUsers().catch(() => []),
    ]).then(([s, l, u]) => {
      setStats(s);
      setAllListings(l);
      setAllUsers(u);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (authLoading) return;
    if (!profile || !profile.isAdmin) {
      router.replace("/");
      return;
    }
    loadData();
  }, [profile, authLoading, router]);

  // Show loading spinner while auth is resolving
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!profile?.isAdmin) return null;

  const inProcessListings = allListings.filter((l: any) => l.status === "in_process");
  const soldListings = allListings.filter((l: any) => l.status === "sold");

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "items", label: "Items", icon: <Package className="w-5 h-5" /> },
    { id: "users", label: "Users", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden font-sans">
      {/* Admin Sidebar — stays dark */}
      <aside className="w-64 border-r border-purple-800 bg-purple-950 text-white flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-purple-800">
          <div className="font-serif text-2xl font-bold text-purple-300 flex items-center gap-2">
            <span className="text-gold">✦</span> Admin
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                activeTab === item.id
                  ? "bg-purple-800/60 text-purple-200 font-medium"
                  : "text-purple-400 hover:bg-purple-800/30 hover:text-purple-200"
              }`}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="admin-nav-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400 rounded-r-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content — cream background */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-cream-50 text-purple-900">
        <div className="max-w-6xl mx-auto space-y-10">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && <DashboardView inProcessListings={inProcessListings} soldListings={soldListings} stats={stats} recentUsers={allUsers.slice(0, 5)} onStatusChange={loadData} />}
            {activeTab === "items" && <ItemsView listings={allListings} onStatusChange={loadData} />}
            {activeTab === "users" && <UsersView users={allUsers} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ─── Dashboard Tab ─── */
function DashboardView({ inProcessListings, soldListings, stats, recentUsers, onStatusChange }: { inProcessListings: any[]; soldListings: any[]; stats: any; recentUsers: any[]; onStatusChange: () => void }) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleMarkSold = async (listingId: string) => {
    setActionLoading(listingId);
    try {
      await api.updateListingStatus(listingId, "sold");
      onStatusChange();
    } catch { /* ignore */ }
    setActionLoading(null);
  };

  const handleRejectDeal = async (listingId: string) => {
    setActionLoading(listingId);
    try {
      await api.updateListingStatus(listingId, "active");
      onStatusChange();
    } catch { /* ignore */ }
    setActionLoading(null);
  };

  const handleRestore = async (listingId: string) => {
    setActionLoading(listingId);
    try {
      await api.updateListingStatus(listingId, "active");
      onStatusChange();
    } catch { /* ignore */ }
    setActionLoading(null);
  };

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-10"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Platform Overview</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-white border border-purple-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Items", value: String(stats?.total ?? 0), icon: <Package className="w-5 h-5 text-blue-600" /> },
          { label: "Active Listings", value: String(stats?.active ?? 0), icon: <Activity className="w-5 h-5 text-green-600" /> },
          { label: "Deals in Process", value: String(stats?.inProcess ?? 0), icon: <AlertCircle className="w-5 h-5 text-amber-600" /> },
          { label: "Sold", value: String(stats?.sold ?? 0), icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" /> },
          { label: "Total Users", value: String(stats?.totalUsers ?? 0), icon: <Users className="w-5 h-5 text-purple-600" /> },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-purple-100 p-6 rounded-2xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">{stat.icon}</div>
            </div>
            <div className="text-3xl font-bold mb-1 text-purple-900">{stat.value}</div>
            <div className="text-sm text-purple-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tables Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold font-serif flex items-center gap-2">
            Action Required{" "}
            <Badge className="bg-amber-100 text-amber-700 border-amber-300">
              {inProcessListings.length} Pending
            </Badge>
          </h2>

          <div className="bg-white border border-purple-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-purple-50 border-b border-purple-100 text-purple-500">
                <tr>
                  <th className="p-4 font-medium">Item</th>
                  <th className="p-4 font-medium">Seller</th>
                  <th className="p-4 font-medium">Buyer</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {inProcessListings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-purple-400">
                      No pending actions
                    </td>
                  </tr>
                ) : (
                  inProcessListings.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b border-purple-50 hover:bg-purple-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-purple-900">{item.title}</div>
                      <div className="text-purple-400 text-xs">{item.category}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">
                          {(item.sellerName || "?").charAt(0)}
                        </div>
                        <div>
                          <div>{item.sellerName || "Unknown"}</div>
                          {item.sellerPhone && <div className="text-xs text-purple-400">{item.sellerPhone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {item.buyerName ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                              {item.buyerName.charAt(0)}
                            </div>
                            <div>
                              <div>{item.buyerName}</div>
                              {item.buyerPhone && <div className="text-xs text-purple-400">{item.buyerPhone}</div>}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-purple-300 text-xs">No buyer info</span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-purple-700">
                      ₪{item.sellPrice}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        size="sm"
                        disabled={actionLoading === item.id}
                        onClick={() => handleMarkSold(item.id)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                      >
                        {actionLoading === item.id ? "..." : "Mark Sold"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === item.id}
                        onClick={() => handleRejectDeal(item.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        Reject
                      </Button>
                    </td>
                  </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif">Recent Users</h2>
          <div className="bg-white border border-purple-100 rounded-2xl p-4 space-y-4">
            {recentUsers.length === 0 ? (
              <p className="text-purple-400 text-sm">No users yet</p>
            ) : (
              recentUsers.map((user: any, i: number) => (
                <div
                  key={user.id || i}
                  className="flex items-center justify-between pb-4 border-b border-purple-50 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">
                      {(user.fullName || "?").charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-xs text-purple-400">{user.phone}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    user.isAdmin ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-purple-50 text-purple-600 border-purple-200"
                  }>
                    {user.isAdmin ? "Admin" : "User"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sold Items Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-serif flex items-center gap-2">
          Sold Items{" "}
          <Badge className="bg-green-100 text-green-700 border-green-300">
            {soldListings.length} Sold
          </Badge>
        </h2>

        <div className="bg-white border border-purple-100 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-purple-50 border-b border-purple-100 text-purple-500">
              <tr>
                <th className="p-4 font-medium">Item</th>
                <th className="p-4 font-medium">Seller</th>
                <th className="p-4 font-medium">Buyer</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {soldListings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-purple-400">
                    No sold items yet
                  </td>
                </tr>
              ) : (
                soldListings.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b border-purple-50 hover:bg-purple-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-purple-900">{item.title}</div>
                      <div className="text-purple-400 text-xs">{item.category}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">
                          {(item.sellerName || "?").charAt(0)}
                        </div>
                        <div>
                          <div>{item.sellerName || "Unknown"}</div>
                          {item.sellerPhone && <div className="text-xs text-purple-400">{item.sellerPhone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {item.buyerName ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                              {item.buyerName.charAt(0)}
                            </div>
                            <div>
                              <div>{item.buyerName}</div>
                              {item.buyerPhone && <div className="text-xs text-purple-400">{item.buyerPhone}</div>}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-purple-300 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-green-700">
                      ₪{item.sellPrice}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === item.id}
                        onClick={() => handleRestore(item.id)}
                        className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full"
                      >
                        {actionLoading === item.id ? "..." : "Restore to Active"}
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Items Tab ─── */
function ItemsView({ listings, onStatusChange }: { listings: any[]; onStatusChange: () => void }) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({
    title: "",
    description: "",
    category: "Furniture",
    condition: "New",
    city: "Tel Aviv",
    imageUrl: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.title.trim()) { setAddError("Title is required"); return; }
    setAddError("");
    setAddLoading(true);
    try {
      await api.createListing({
        title: addFormData.title.trim(),
        description: addFormData.description.trim(),
        category: addFormData.category,
        condition: addFormData.condition,
        city: addFormData.city,
        originalPrice: 0,
        sellPrice: 0,
        images: addFormData.imageUrl.trim()
          ? [addFormData.imageUrl.trim()]
          : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
      });
      setShowAddForm(false);
      setAddFormData({ title: "", description: "", category: "Furniture", condition: "New", city: "Tel Aviv", imageUrl: "" });
      onStatusChange();
    } catch (err: any) {
      setAddError(err.message || "Failed to create item");
    }
    setAddLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await api.updateListingStatus(id, status);
      onStatusChange();
    } catch { /* ignore */ }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(`del-${id}`);
    try {
      await api.deleteListing(id);
      onStatusChange();
    } catch { /* ignore */ }
    setActionLoading(null);
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 border-green-200",
    in_process: "bg-amber-100 text-amber-800 border-amber-200",
    sold: "bg-blue-100 text-blue-800 border-blue-200",
    removed: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <motion.div
      key="items"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">All Items</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Search items..."
              className="bg-white border border-purple-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400"
            />
          </div>
          <Button
            onClick={() => setShowAddForm((v) => !v)}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 py-2 text-sm flex items-center gap-2"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? "Cancel" : "Add Item"}
          </Button>
        </div>
      </div>

      {/* Add Item Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            key="add-form"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleCreateItem}
            className="bg-white border border-purple-200 rounded-2xl p-6 space-y-4"
          >
            <h2 className="font-bold text-lg text-purple-900">Add New Item</h2>
            {addError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{addError}</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-sm font-medium text-purple-700">Title *</label>
                <input
                  type="text"
                  value={addFormData.title}
                  onChange={(e) => setAddFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Item title"
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-sm font-medium text-purple-700">Description</label>
                <textarea
                  value={addFormData.description}
                  onChange={(e) => setAddFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Item description"
                  rows={3}
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400 resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Category</label>
                <select
                  value={addFormData.category}
                  onChange={(e) => setAddFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400 bg-white"
                >
                  {["Furniture", "Electronics", "Kitchen", "Other"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Condition</label>
                <select
                  value={addFormData.condition}
                  onChange={(e) => setAddFormData((p) => ({ ...p, condition: e.target.value }))}
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400 bg-white"
                >
                  {["New", "Used", "Refurbished"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">City</label>
                <select
                  value={addFormData.city}
                  onChange={(e) => setAddFormData((p) => ({ ...p, city: e.target.value }))}
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400 bg-white"
                >
                  {["Tel Aviv", "Jerusalem", "Haifa", "Eilat"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Image URL (optional)</label>
                <input
                  type="url"
                  value={addFormData.imageUrl}
                  onChange={(e) => setAddFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="rounded-full px-6 border-purple-200 text-purple-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addLoading}
                className="rounded-full px-6 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {addLoading ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="bg-white border border-purple-100 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-purple-50 border-b border-purple-100 text-purple-500">
            <tr>
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item, i) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-purple-50 hover:bg-purple-50/50 transition-colors"
              >
                <td className="p-4">
                  <img src={item.images?.[0] || ""} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                </td>
                <td className="p-4 font-bold text-purple-900">{item.title}</td>
                <td className="p-4 text-purple-600">{item.category}</td>
                <td className="p-4">
                  <Badge variant="outline" className={`text-xs ${statusColors[item.status] || ""}`}>
                    {item.status === "in_process" ? "In Process" : item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                  </Badge>
                </td>
                <td className="p-4 font-mono font-bold text-purple-700">₪{item.sellPrice}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <select
                      disabled={actionLoading === item.id || actionLoading === `del-${item.id}`}
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="text-xs border border-purple-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 ring-purple-400"
                    >
                      <option value="active">Active</option>
                      <option value="in_process">In Process</option>
                      <option value="sold">Sold</option>
                      <option value="removed">Removed</option>
                    </select>
                    <button
                      disabled={actionLoading === item.id || actionLoading === `del-${item.id}`}
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ─── Users Tab ─── */
function UsersView({ users }: { users: any[] }) {

  return (
    <motion.div
      key="users"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">User Management</h1>
      </div>

      <div className="bg-white border border-purple-100 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-purple-50 border-b border-purple-100 text-purple-500">
            <tr>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, i: number) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-purple-50 hover:bg-purple-50/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700">
                      {user.fullName?.charAt(0) || "?"}
                    </div>
                    <span className="font-medium text-purple-900">{user.fullName}</span>
                  </div>
                </td>
                <td className="p-4 text-purple-500">{user.phone}</td>
                <td className="p-4">
                  <Badge variant="outline" className={
                    user.isAdmin ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-purple-50 text-purple-600 border-purple-200"
                  }>{user.isAdmin ? "Admin" : "User"}</Badge>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Active
                  </span>
                </td>
                <td className="p-4 text-purple-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}


