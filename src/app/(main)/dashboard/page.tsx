"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Package,
  Heart,
  Clock,
  CheckCircle2,
  ShoppingBag,
  User,
  Settings,
  LogOut,
  Loader2,
  Pencil,
  X,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api, type Listing } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/* ─── Edit Modal ─── */
function EditModal({ listing, onClose, onSaved }: { listing: Listing; onClose: () => void; onSaved: () => void }) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: listing.title,
    description: listing.description || "",
    category: listing.category,
    condition: listing.condition,
    city: listing.city || "",
    images: listing.images as string[],
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from("listing-images").upload(fileName, file, { upsert: false });
      if (!error && data) {
        const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(data.path);
        newUrls.push(urlData.publicUrl);
      } else {
        newUrls.push(URL.createObjectURL(file));
      }
    }
    setForm((p) => ({ ...p, images: [...p.images, ...newUrls] }));
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      await api.updateListing(listing.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        condition: form.condition,
        city: form.city || undefined,
        images: form.images,
        originalPrice: 0,
        sellPrice: 0,
      });
      toast.success("Item updated!");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-purple-100">
          <h2 className="font-serif text-xl font-bold text-purple-900">Edit Item</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-purple-50 text-purple-400 hover:text-purple-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Images */}
          <div>
            <Label className="text-purple-900 font-bold mb-2 block">Photos</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-purple-100">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 border-2 border-dashed border-purple-200 rounded-xl flex flex-col items-center justify-center text-purple-400 hover:border-purple-400 hover:text-purple-600 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-xs mt-1">Add</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </div>

          {/* Title */}
          <div className="space-y-1">
            <Label className="text-purple-900 font-bold">Title *</Label>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Item title"
              className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-purple-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label className="text-purple-900 font-bold">Description</Label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-purple-400 resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label className="text-purple-900 font-bold">{t('post.categoryLabel')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Furniture", "Electronics", "Kitchen", "Other"].map((cat) => (
                <button key={cat} type="button" onClick={() => setForm((p) => ({ ...p, category: cat }))}
                  className={`p-3 rounded-xl border text-sm text-center transition-all ${form.category === cat ? "bg-purple-100 border-purple-500 text-purple-900 font-bold" : "bg-white border-purple-100 text-purple-700 hover:border-purple-300"}`}>
                  {t(`cat.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-1">
            <Label className="text-purple-900 font-bold">{t('post.conditionLabel')}</Label>
            <div className="grid grid-cols-3 gap-2">
              {["New", "Used", "Refurbished"].map((cond) => (
                <button key={cond} type="button" onClick={() => setForm((p) => ({ ...p, condition: cond }))}
                  className={`p-3 rounded-xl border text-sm text-center transition-all ${form.condition === cond ? "bg-purple-100 border-purple-500 text-purple-900 font-bold" : "bg-white border-purple-100 text-purple-700 hover:border-purple-300"}`}>
                  {t(`cond.${cond}`)}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div className="space-y-1">
            <Label className="text-purple-900 font-bold">{t('post.cityLabel')}</Label>
            <input
              list="edit-city-options"
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              placeholder={t('post.selectCity')}
              className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-purple-400"
            />
            <datalist id="edit-city-options">
              <option value="Tel Aviv" /><option value="Jerusalem" /><option value="Haifa" /><option value="Eilat" />
            </datalist>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-full border-purple-200">Cancel</Button>
            <Button type="submit" disabled={saving || uploading} className="flex-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { profile, loading: authLoading, signOut } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("listed");
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [watchlist, setWatchlist] = useState<Listing[]>([]);
  const [purchases, setPurchases] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      router.replace("/login");
      return;
    }
    loadData();
  }, [profile, authLoading, router]);

  function loadData() {
    Promise.all([
        api.getMyListings().catch(() => []),
        api.getWatchlist().catch(() => []),
        api.getMyPurchases().catch(() => []),
      ]).then(([listings, wl, purch]) => {
        setMyListings(listings);
        setWatchlist(wl);
        setPurchases(purch);
        setLoading(false);
      });
  }

  // Show loading spinner while auth is resolving
  if (authLoading || (!profile && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!profile) return null;

  const userListings = myListings.filter((l) => l.status === "active");
  const inProcessListings = myListings.filter((l) => l.status === "in_process");
  const soldListings = myListings.filter((l) => l.status === "sold");
  const purchasedInProcess = purchases.filter((l) => l.status === "in_process");
  const purchasedCompleted = purchases.filter((l) => l.status === "sold");

  const tabs = [
    {
      id: "listed",
      label: t('dash.tab.listed'),
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: "process",
      label: t('dash.tab.process'),
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: "sold",
      label: t('dash.tab.sold'),
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      id: "watchlist",
      label: t('dash.tab.watchlist'),
      icon: <Heart className="w-4 h-4" />,
    },
    {
      id: "purchased",
      label: t('dash.tab.purchased'),
      icon: <ShoppingBag className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row">
      {/* Edit Modal */}
      <AnimatePresence>
        {editingListing && (
          <EditModal
            listing={editingListing}
            onClose={() => setEditingListing(null)}
            onSaved={() => { setLoading(true); loadData(); }}
          />
        )}
      </AnimatePresence>
      <aside className="hidden md:flex w-64 bg-purple-900 text-cream-50 flex-col py-8 px-6 border-r border-purple-800 shrink-0">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-yellow-300 flex items-center justify-center text-purple-900 font-bold text-xl shadow-lg">
            {profile?.fullName?.charAt(0) || "?"}
          </div>
          <div>
            <div className="font-bold text-lg">{profile?.fullName || "User"}</div>
            <div className="text-purple-300 text-sm">{t('dash.seller')}</div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-4">
            {t('dash.activity')}
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? "bg-purple-700/50 text-white font-medium" : "text-purple-300 hover:bg-purple-800/50 hover:text-white"}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}

          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mt-8 mb-4">
            {t('dash.account')}
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-300 hover:bg-purple-800/50 hover:text-white transition-all">
            <User className="w-4 h-4" /> {t('dash.profile')}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-300 hover:bg-purple-800/50 hover:text-white transition-all">
            <Settings className="w-4 h-4" /> {t('dash.settings')}
          </button>
        </nav>

        <button onClick={() => { signOut(); router.push("/"); }} className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-purple-300 hover:bg-red-900/50 hover:text-red-400 transition-all">
          <LogOut className="w-4 h-4" /> {t('dash.logOut')}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-4xl font-bold text-purple-900">
              {t('dash.title')}
            </h1>
            <Link href="/post">
              <Button className="hidden md:flex bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 shadow-md">
                <Plus className="w-5 h-5 mr-2" /> {t('dash.listNewItem')}
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {[
              { label: t('dash.stat.active'), value: String(userListings.length), color: "bg-white" },
              { label: t('dash.stat.inProcess'), value: String(inProcessListings.length), color: "bg-purple-50" },
              { label: t('dash.stat.totalSold'), value: String(soldListings.length), color: "bg-cream-100" },
              { label: t('dash.stat.watchlist'), value: String(watchlist.length), color: "bg-white" },
              { label: t('dash.stat.purchased'), value: String(purchases.length), color: "bg-purple-50" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-3xl border border-purple-100 shadow-sm ${stat.color}`}
              >
                <div className="text-3xl font-serif font-bold text-purple-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-purple-600/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Tabs */}
          <div className="flex md:hidden overflow-x-auto pb-4 mb-6 gap-2 snap-x scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`snap-start shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? "bg-purple-900 text-cream-50" : "bg-white text-purple-700 border border-purple-200"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="font-serif text-2xl font-bold text-purple-900 mb-6">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h2>

                {activeTab === "listed" &&
                  (userListings.length > 0 ? (
                    userListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow group"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 mr-4">
                        <img
                          src={listing.images[0]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          alt=""
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-purple-900 text-lg line-clamp-1">
                          {listing.title}
                        </h3>
                        <div className="text-sm text-purple-500 mb-2">{listing.category} · {listing.city}</div>
                        <div className="flex gap-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">
                            {t('status.active')}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col gap-2 justify-center pl-4 border-l border-purple-50 ml-4">
                        <Link href={`/item/${listing.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-purple-200"
                          >
                            {t('dash.view')}
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="text-xs border-purple-200 text-purple-700" onClick={() => setEditingListing(listing)}>
                          <Pencil className="w-3 h-3 mr-1" /> Edit
                        </Button>
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-purple-100 border-dashed">
                      <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-10 h-10 text-purple-400" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-purple-900 mb-2">
                        {t('dash.empty.listed')}
                      </h3>
                      <p className="text-purple-600/70 mb-4">
                        {t('dash.empty.listedSub')}
                      </p>
                      <Link href="/post">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6">
                          <Plus className="w-4 h-4 mr-2" /> {t('dash.empty.listItem')}
                        </Button>
                      </Link>
                    </div>
                  ))}

                {activeTab === "process" &&
                  (inProcessListings.length > 0 ? (
                    inProcessListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow group"
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 mr-4">
                          <img
                            src={listing.images[0]}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            alt=""
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="font-bold text-purple-900 text-lg line-clamp-1">
                            {listing.title}
                          </h3>
                          <div className="text-sm text-purple-500 mb-2">{listing.category} · {listing.city}</div>
                          <div className="flex gap-2">
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-md font-medium">
                              {t('status.inProcess')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-purple-100 border-dashed">
                      <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-10 h-10 text-purple-400" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-purple-900 mb-2">
                        {t('dash.empty.process')}
                      </h3>
                      <p className="text-purple-600/70">
                        {t('dash.empty.processSub')}
                      </p>
                    </div>
                  ))}

                {activeTab === "sold" &&
                  (soldListings.length > 0 ? (
                    soldListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow group"
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 mr-4">
                          <img
                            src={listing.images[0]}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            alt=""
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="font-bold text-purple-900 text-lg line-clamp-1">
                            {listing.title}
                          </h3>
                          <div className="text-sm text-purple-500 mb-2">{listing.category} · {listing.city}</div>
                          <div className="flex gap-2">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">
                            {t('status.sold')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-purple-100 border-dashed">
                      <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-purple-400" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-purple-900 mb-2">
                        {t('dash.empty.sold')}
                      </h3>
                      <p className="text-purple-600/70">
                        {t('dash.empty.soldSub')}
                      </p>
                    </div>
                  ))}

                {activeTab === "watchlist" &&
                  (watchlist.length > 0 ? (
                    watchlist.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow group"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 mr-4">
                        <img
                          src={listing.images[0]}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-purple-900 text-lg line-clamp-1">
                          {listing.title}
                        </h3>
                        <div className="text-sm text-purple-500 mb-2">{listing.category} · {listing.city}</div>
                        <div className="text-xs text-purple-400 flex items-center">
                          <Heart className="w-3 h-3 mr-1 fill-purple-400" />{" "}
                          {t('status.saved')}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 justify-center pl-4 border-l border-purple-50 ml-4">
                        <Link href={`/item/${listing.id}`}>
                          <Button
                            size="sm"
                            className="bg-purple-100 text-purple-900 hover:bg-purple-200"
                          >
                            {t('dash.view')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-purple-100 border-dashed">
                      <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-10 h-10 text-purple-400" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-purple-900 mb-2">
                        {t('dash.empty.watchlist')}
                      </h3>
                      <p className="text-purple-600/70 mb-4">
                        {t('dash.empty.watchlistSub')}
                      </p>
                      <Link href="/browse">
                        <Button variant="outline" className="rounded-full px-6 border-purple-200">
                          {t('dash.browseItems')}
                        </Button>
                      </Link>
                    </div>
                  ))}

                {activeTab === "purchased" &&
                  (purchases.length > 0 ? (
                    <>
                      {purchasedInProcess.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider">{t('dash.purchased.inProcess')}</h3>
                          {purchasedInProcess.map((listing) => (
                            <div
                              key={listing.id}
                              className="flex bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow group"
                            >
                              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 mr-4">
                                <img src={listing.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                              </div>
                              <div className="flex-1 flex flex-col justify-center">
                                <h3 className="font-bold text-purple-900 text-lg line-clamp-1">{listing.title}</h3>
                                <div className="text-sm text-purple-500 mb-2">{listing.category} · {listing.city}</div>
                                <div className="flex gap-2">
                                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-md font-medium">{t('status.waitingAdmin')}</span>
                                </div>
                              </div>
                              <div className="hidden sm:flex flex-col gap-2 justify-center pl-4 border-l border-purple-50 ml-4">
                                <Link href={`/item/${listing.id}`}>
                                  <Button variant="outline" size="sm" className="text-xs border-purple-200">{t('dash.view')}</Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {purchasedCompleted.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider">{t('dash.purchased.completed')}</h3>
                          {purchasedCompleted.map((listing) => (
                            <div
                              key={listing.id}
                              className="flex bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow group"
                            >
                              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 mr-4">
                                <img src={listing.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                              </div>
                              <div className="flex-1 flex flex-col justify-center">
                                <h3 className="font-bold text-purple-900 text-lg line-clamp-1">{listing.title}</h3>
                                <div className="text-sm text-purple-500 mb-2">{listing.category} · {listing.city}</div>
                                <div className="flex gap-2">
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">{t('status.purchased')}</span>
                                </div>
                              </div>
                              <div className="hidden sm:flex flex-col gap-2 justify-center pl-4 border-l border-purple-50 ml-4">
                                <Link href={`/item/${listing.id}`}>
                                  <Button variant="outline" size="sm" className="text-xs border-purple-200">{t('dash.view')}</Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-purple-100 border-dashed">
                      <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-10 h-10 text-purple-400" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-purple-900 mb-2">
                        {t('dash.empty.purchased')}
                      </h3>
                      <p className="text-purple-600/70 mb-4">
                        {t('dash.empty.purchasedSub')}
                      </p>
                      <Link href="/browse">
                        <Button variant="outline" className="rounded-full px-6 border-purple-200">
                          {t('dash.browseItems')}
                        </Button>
                      </Link>
                    </div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Link href="/post">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-purple-600 rounded-full text-white shadow-[0_8px_30px_rgb(91,45,142,0.4)] flex items-center justify-center"
          >
            <Plus className="w-8 h-8" />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
