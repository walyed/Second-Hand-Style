import React from 'react';
import { motion } from 'framer-motion';
import { dummyListings } from '@/lib/dummy-data';
import { Users, Package, Activity, AlertCircle, Search, LayoutDashboard, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Admin() {
  const inProcessListings = dummyListings.filter(l => l.condition === 'Special Deal');
  
  // Force dark mode for this page specifically by wrapping it in a .dark div
  return (
    <div className="dark min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-border">
          <div className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <span className="text-secondary">✦</span> Admin
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          <div className="relative">
            <motion.div layoutId="admin-nav-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-muted rounded-lg text-primary font-medium">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition-colors">
            <Package className="w-5 h-5" /> Items
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition-colors">
            <Users className="w-5 h-5" /> Users
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-serif">Platform Overview</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-muted border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 ring-primary"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Items', value: '2,451', icon: <Package className="w-5 h-5 text-blue-400" /> },
              { label: 'Active Listings', value: '1,832', icon: <Activity className="w-5 h-5 text-green-400" /> },
              { label: 'Total Users', value: '4,192', icon: <Users className="w-5 h-5 text-purple-400" /> },
              { label: 'Deals in Process', value: '24', icon: <AlertCircle className="w-5 h-5 text-amber-400" /> },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border p-6 rounded-2xl shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-muted rounded-lg">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Tables Section */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Deals in Process - Priority */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                Action Required <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/50">24 Pending</Badge>
              </h2>
              
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground">
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
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-bold">{item.title}</div>
                          <div className="text-muted-foreground text-xs">{item.category}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">{item.seller.name.charAt(0)}</div>
                            <span>{item.seller.name.split(' ')[0]}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-primary">₪{item.sellPrice}</td>
                        <td className="p-4 text-right">
                          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-full">
                              Confirm Deal
                            </Button>
                          </motion.div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Users Summary */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif">Recent Users</h2>
              <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
                {[
                  { name: 'Sarah J.', role: 'Admin', color: 'bg-red-500/20 text-red-500 border-red-500/30' },
                  { name: 'Michael T.', role: 'Seller', color: 'bg-primary/20 text-primary border-primary/30' },
                  { name: 'Emma W.', role: 'Buyer', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
                  { name: 'David L.', role: 'Seller', color: 'bg-primary/20 text-primary border-primary/30' },
                  { name: 'Rachel M.', role: 'Buyer', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                    <Badge variant="outline" className={user.color}>{user.role}</Badge>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
