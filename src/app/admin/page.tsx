"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
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
  Upload,
  Loader2,
  Pencil,
  MessageSquare,
  Mail,
  Phone,
  CheckCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "dashboard" | "items" | "users" | "contacts";

export default function Admin() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allContacts, setAllContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      api.getAdminStats().catch(() => null),
      api.getAdminListings().catch(() => []),
      api.getAdminUsers().catch(() => []),
      api.getContactRequests().catch(() => []),
    ]).then(([s, l, u, c]) => {
      setStats(s);
      setAllListings(l);
      setAllUsers(u);
      setAllContacts(c);
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
    { id: "contacts", label: "Contact Requests", icon: <MessageSquare className="w-5 h-5" /> },
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
            {activeTab === "contacts" && <ContactsView contacts={allContacts} onRefresh={loadData} />}
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
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({ title: "", description: "", category: "Furniture", condition: "New", city: "Tel Aviv" });
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);
  const [addFormData, setAddFormData] = useState({
    title: "",
    description: "",
    category: "Furniture",
    condition: "New",
    city: "Tel Aviv",
  });
  const [addImages, setAddImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const openEdit = (item: any) => {
    setEditingItem(item);
    setEditFormData({ title: item.title, description: item.description || "", category: item.category, condition: item.condition, city: item.city || "Tel Aviv" });
    setEditImages(item.images ?? []);
  };

  const handleEditImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from("listing-images").upload(fileName, file, { upsert: false });
      if (!error && data) {
        const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(data.path);
        setEditImages((p) => [...p, urlData.publicUrl]);
      } else {
        setEditImages((p) => [...p, URL.createObjectURL(file)]);
      }
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.title.trim() || !editingItem) return;
    setEditLoading(true);
    try {
      await api.updateListing(editingItem.id, {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        category: editFormData.category,
        condition: editFormData.condition,
        city: editFormData.city,
        images: editImages,
        originalPrice: 0,
        sellPrice: 0,
      });
      toast.success("Item updated!");
      setEditingItem(null);
      onStatusChange();
    } catch (err: any) {
      toast.error(err.message || "Failed to update item");
    }
    setEditLoading(false);
  };

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
        images: addImages.length > 0
          ? addImages
          : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
      });
      setShowAddForm(false);
      setAddFormData({ title: "", description: "", category: "Furniture", condition: "New", city: "Tel Aviv" });
      setAddImages([]);
      onStatusChange();
    } catch (err: any) {
      setAddError(err.message || "Failed to create item");
    }
    setAddLoading(false);
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from("listing-images").upload(fileName, file, { upsert: false });
      if (!error && data) {
        const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(data.path);
        setAddImages((p) => [...p, urlData.publicUrl]);
      } else {
        setAddImages((p) => [...p, URL.createObjectURL(file)]);
      }
    }
    setUploadingImage(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await api.updateListingStatus(id, status);
      toast.success("Status updated");
      onStatusChange();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setActionLoading(`del-${id}`);
    try {
      await api.deleteListing(id);
      toast.success("Item deleted");
      onStatusChange();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete item");
    }
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
      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingItem(null)}>
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onSubmit={handleSaveEdit}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                <h2 className="font-serif text-xl font-bold text-purple-900">Edit Item</h2>
                <button type="button" onClick={() => setEditingItem(null)} className="p-2 rounded-xl hover:bg-purple-50 text-purple-400"><X className="w-5 h-5" /></button>
              </div>

              {/* Photos */}
              <div>
                <label className="text-sm font-medium text-purple-700 block mb-2">Photos</label>
                <div className="flex flex-wrap gap-2">
                  {editImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-purple-100">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => setEditImages((p) => p.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => editFileRef.current?.click()}
                    className="w-16 h-16 border-2 border-dashed border-purple-200 rounded-lg flex flex-col items-center justify-center text-purple-400 hover:border-purple-400 hover:text-purple-600 transition-colors">
                    <Upload className="w-4 h-4" /><span className="text-xs mt-0.5">Add</span>
                  </button>
                </div>
                <input ref={editFileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleEditImageFiles(e.target.files)} />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Title *</label>
                <input value={editFormData.title} onChange={(e) => setEditFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-purple-700">Description</label>
                <textarea value={editFormData.description} onChange={(e) => setEditFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={3} className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-purple-700">Category</label>
                  <select value={editFormData.category} onChange={(e) => setEditFormData((p) => ({ ...p, category: e.target.value }))}
                    className="w-full border border-purple-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400 bg-white">
                    {["Furniture", "Electronics", "Kitchen", "Other"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-purple-700">Condition</label>
                  <select value={editFormData.condition} onChange={(e) => setEditFormData((p) => ({ ...p, condition: e.target.value }))}
                    className="w-full border border-purple-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400 bg-white">
                    {["New", "Used", "Refurbished"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-purple-700">City</label>
                  <select value={editFormData.city} onChange={(e) => setEditFormData((p) => ({ ...p, city: e.target.value }))}
                    className="w-full border border-purple-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400 bg-white">
                    {["Tel Aviv", "Jerusalem", "Haifa", "Eilat"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)} className="flex-1 rounded-full border-purple-200">Cancel</Button>
                <Button type="submit" disabled={editLoading} className="flex-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white">
                  {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
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
                <label className="text-sm font-medium text-purple-700">Photos</label>
                <div className="flex flex-wrap gap-2">
                  {addImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-purple-100">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => setAddImages((p) => p.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
                    className="w-16 h-16 border-2 border-dashed border-purple-200 rounded-lg flex flex-col items-center justify-center text-purple-400 hover:border-purple-400 hover:text-purple-600 transition-colors disabled:opacity-50">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span className="text-xs mt-0.5">Add</span>
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageFiles(e.target.files)} />
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
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-purple-400 hover:text-purple-700 hover:bg-purple-50 transition-colors disabled:opacity-40"
                      title="Edit item"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      disabled={actionLoading === item.id || actionLoading === `del-${item.id}`}
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                      title="Delete listing"
                    >
                      {actionLoading === `del-${item.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

/* ─── Contacts Tab ─── */
function ContactsView({ contacts, onRefresh }: { contacts: any[]; onRefresh: () => void }) {
  const [marking, setMarking] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filtered = contacts.filter((c) => {
    if (filter === "unread") return !c.is_read;
    if (filter === "read") return c.is_read;
    return true;
  });

  const handleToggleRead = async (id: string, current: boolean) => {
    setMarking(id);
    try {
      await api.markContactRead(id, !current);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    }
    setMarking(null);
  };

  return (
    <motion.div
      key="contacts"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold font-serif">Contact Requests</h1>
        <div className="flex items-center gap-2 text-sm">
          {(["all", "unread", "read"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full border transition-colors capitalize ${filter === f ? "bg-purple-600 text-white border-purple-600" : "border-purple-200 text-purple-700 hover:bg-purple-50"}`}>
              {f} {f === "unread" && contacts.filter((c) => !c.is_read).length > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">{contacts.filter((c) => !c.is_read).length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-purple-100 border-dashed">
          <MessageSquare className="w-12 h-12 text-purple-300 mx-auto mb-4" />
          <p className="text-purple-500 font-medium">No contact requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((contact, i) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-white border rounded-2xl p-5 shadow-sm transition-colors ${contact.is_read ? "border-purple-100" : "border-purple-300 bg-purple-50/40"}`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-900 text-lg">{contact.name}</span>
                    {!contact.is_read && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">New</span>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-purple-500 flex-wrap">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{contact.email}</span>
                    {contact.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{contact.phone}</span>}
                    <span className="text-xs text-purple-400">{new Date(contact.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  disabled={marking === contact.id}
                  onClick={() => handleToggleRead(contact.id, contact.is_read)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-50 ${contact.is_read ? "border-purple-200 text-purple-500 hover:bg-purple-50" : "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"}`}
                >
                  {marking === contact.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCheck className="w-3 h-3" />}
                  {contact.is_read ? "Mark Unread" : "Mark Read"}
                </button>
              </div>
              <div className="mt-4 bg-purple-50 rounded-xl p-4 text-sm text-purple-800 leading-relaxed border border-purple-100">
                {contact.message}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
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


