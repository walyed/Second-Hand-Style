"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dummyListings } from "@/lib/dummy-data";
import {
  Users,
  Package,
  Activity,
  AlertCircle,
  Search,
  LayoutDashboard,
  Settings,
  Shield,
  Bell,
  Globe,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Tab = "dashboard" | "items" | "users" | "settings";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const inProcessListings = dummyListings.filter(
    (l) => l.condition === "Special Deal"
  );

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "items", label: "Items", icon: <Package className="w-5 h-5" /> },
    { id: "users", label: "Users", icon: <Users className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
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
            {activeTab === "dashboard" && <DashboardView inProcessListings={inProcessListings} />}
            {activeTab === "items" && <ItemsView listings={dummyListings} />}
            {activeTab === "users" && <UsersView />}
            {activeTab === "settings" && <SettingsView />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ─── Dashboard Tab ─── */
function DashboardView({ inProcessListings }: { inProcessListings: typeof dummyListings }) {
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: "2,451", icon: <Package className="w-5 h-5 text-blue-600" /> },
          { label: "Active Listings", value: "1,832", icon: <Activity className="w-5 h-5 text-green-600" /> },
          { label: "Total Users", value: "4,192", icon: <Users className="w-5 h-5 text-purple-600" /> },
          { label: "Deals in Process", value: "24", icon: <AlertCircle className="w-5 h-5 text-amber-600" /> },
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
              24 Pending
            </Badge>
          </h2>

          <div className="bg-white border border-purple-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-purple-50 border-b border-purple-100 text-purple-500">
                <tr>
                  <th className="p-4 font-medium">Item</th>
                  <th className="p-4 font-medium">Seller</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {inProcessListings.map((item, i) => (
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
                          {item.seller.name.charAt(0)}
                        </div>
                        <span>{item.seller.name.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-purple-700">
                      ₪{item.sellPrice}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                      >
                        Confirm Deal
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif">Recent Users</h2>
          <div className="bg-white border border-purple-100 rounded-2xl p-4 space-y-4">
            {[
              { name: "Sarah J.", role: "Admin", color: "bg-red-50 text-red-600 border-red-200" },
              { name: "Michael T.", role: "Seller", color: "bg-purple-50 text-purple-600 border-purple-200" },
              { name: "Emma W.", role: "Buyer", color: "bg-blue-50 text-blue-600 border-blue-200" },
              { name: "David L.", role: "Seller", color: "bg-purple-50 text-purple-600 border-purple-200" },
              { name: "Rachel M.", role: "Buyer", color: "bg-blue-50 text-blue-600 border-blue-200" },
            ].map((user, i) => (
              <div
                key={i}
                className="flex items-center justify-between pb-4 border-b border-purple-50 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">
                    {user.name.charAt(0)}
                  </div>
                  <div className="font-medium">{user.name}</div>
                </div>
                <Badge variant="outline" className={user.color}>
                  {user.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Items Tab ─── */
function ItemsView({ listings }: { listings: typeof dummyListings }) {
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search items..."
            className="bg-white border border-purple-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 ring-purple-400"
          />
        </div>
      </div>

      <div className="bg-white border border-purple-100 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-purple-50 border-b border-purple-100 text-purple-500">
            <tr>
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Condition</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">City</th>
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
                  <img src={item.images[0]} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                </td>
                <td className="p-4 font-bold text-purple-900">{item.title}</td>
                <td className="p-4 text-purple-600">{item.category}</td>
                <td className="p-4">
                  <Badge variant="outline" className="text-xs">{item.condition}</Badge>
                </td>
                <td className="p-4 font-mono font-bold text-purple-700">₪{item.sellPrice}</td>
                <td className="p-4 text-purple-500">{item.city}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ─── Users Tab ─── */
function UsersView() {
  const users = [
    { name: "Sarah Johnson", email: "sarah@example.com", role: "Admin", status: "Active", joined: "Jan 2025" },
    { name: "Michael Torres", email: "michael@example.com", role: "Seller", status: "Active", joined: "Mar 2025" },
    { name: "Emma Williams", email: "emma@example.com", role: "Buyer", status: "Active", joined: "Apr 2025" },
    { name: "David Levi", email: "david@example.com", role: "Seller", status: "Inactive", joined: "Feb 2025" },
    { name: "Rachel Miller", email: "rachel@example.com", role: "Buyer", status: "Active", joined: "May 2025" },
    { name: "Noam Cohen", email: "noam@example.com", role: "Seller", status: "Active", joined: "Jun 2025" },
  ];

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
        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6">
          Add User
        </Button>
      </div>

      <div className="bg-white border border-purple-100 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-purple-50 border-b border-purple-100 text-purple-500">
            <tr>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <motion.tr
                key={user.email}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-purple-50 hover:bg-purple-50/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium text-purple-900">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-purple-500">{user.email}</td>
                <td className="p-4">
                  <Badge variant="outline" className={
                    user.role === "Admin" ? "bg-red-50 text-red-600 border-red-200"
                    : user.role === "Seller" ? "bg-purple-50 text-purple-600 border-purple-200"
                    : "bg-blue-50 text-blue-600 border-blue-200"
                  }>{user.role}</Badge>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.status === "Active" ? "text-green-600" : "text-red-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-green-500" : "bg-red-400"}`} />
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-purple-500">{user.joined}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ─── Settings Tab ─── */
function SettingsView() {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold font-serif">Settings</h1>

      <div className="grid gap-6">
        {[
          { icon: <Globe className="w-5 h-5 text-purple-600" />, title: "General", desc: "Site name, language, timezone, and regional preferences." },
          { icon: <Shield className="w-5 h-5 text-purple-600" />, title: "Moderation", desc: "Review queues, content policies, and auto-flag rules." },
          { icon: <Bell className="w-5 h-5 text-purple-600" />, title: "Notifications", desc: "Email templates, push settings, and alert thresholds." },
          { icon: <Lock className="w-5 h-5 text-purple-600" />, title: "Security", desc: "Two-factor auth, session policies, and API keys." },
        ].map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border border-purple-100 rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-3 bg-purple-50 rounded-xl">{section.icon}</div>
            <div>
              <h3 className="font-bold text-lg text-purple-900">{section.title}</h3>
              <p className="text-sm text-purple-500 mt-1">{section.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
