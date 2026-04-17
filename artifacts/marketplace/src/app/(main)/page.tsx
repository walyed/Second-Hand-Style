"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowDown,
  Sparkles,
  MoveRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, type Listing } from "@/lib/api";
import { ListingCard } from "@/components/ListingCard";

const categories = [
  { name: "Furniture", icon: "🛋️", delay: 0.1 },
  { name: "Electronics", icon: "📱", delay: 0.2 },
  { name: "Kitchen", icon: "🍳", delay: 0.3 },
  { name: "Clothing", icon: "👗", delay: 0.4 },
  { name: "Other", icon: "📦", delay: 0.5 },
];

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<Listing[]>([]);

  useEffect(() => {
    api.getListings({ limit: 4, sort: "newest" }).then(setFeaturedItems).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-cream-50 text-purple-900 relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden noise-overlay">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-full bg-gradient-to-b from-purple-100/50 to-cream-50/0 z-0" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-drift z-0" />
          <div
            className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-purple-200/40 rounded-full blur-3xl animate-drift z-0"
            style={{ animationDelay: "-5s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-80 h-80 bg-gold/10 rounded-full blur-3xl animate-drift z-0"
            style={{ animationDelay: "-10s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 z-10 flex flex-col items-center text-center mt-[-10vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              Buy Less. <br className="md:hidden" /> Choose{" "}
              <span className="animate-shimmer">Well.</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-700/80 max-w-2xl mx-auto mb-10 font-sans font-light">
              Curated premium second-hand goods. Reimagined for modern living.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16 w-full max-w-md mx-auto justify-center"
          >
            <Link href="/browse">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg rounded-full px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30 group"
              >
                Browse Items{" "}
                <MoveRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/post">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg rounded-full px-8 py-6 border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 text-purple-900 glass"
              >
                Start Selling <ShoppingBag className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + cat.delay }}
              >
                <Link href={`/browse?category=${cat.name}`}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.05 }}
                    className="glass px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-shadow font-medium"
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-purple-400"
        >
          <ArrowDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
              Featured Pieces <Sparkles className="w-8 h-8 text-gold" />
            </h2>
            <p className="text-purple-600/80 text-lg">
              Hand-picked items that deserve a second life.
            </p>
          </div>
          <Link
            href="/browse"
            className="hidden md:flex items-center gap-2 text-purple-600 font-medium hover:text-purple-800 transition-colors group"
          >
            View all{" "}
            <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ListingCard listing={item} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/browse">
            <Button
              variant="outline"
              className="w-full rounded-full border-purple-200 text-purple-900"
            >
              View all listings
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E0A3C] via-[#2D1558] to-[#3D1F73]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#7B3FB5]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C9A84C]/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] text-sm font-medium tracking-wider uppercase mb-6 border border-[#C9A84C]/30">
                How It Works
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-5">
                The Marketplace <span className="text-[#C9A84C]">Way</span>
              </h2>
              <p className="text-[#DCC4F8] text-lg md:text-xl max-w-2xl mx-auto">
                Three simple steps to a simpler, more intentional way to buy and
                sell.
              </p>
            </motion.div>
          </div>

          <div className="hidden md:block absolute top-[55%] left-[calc(50%-340px)] w-[680px] h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
              className="w-full h-px bg-gradient-to-r from-transparent via-[#9B5FD4]/40 to-transparent origin-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {[
              {
                step: "01",
                title: "Browse & Discover",
                desc: "Explore curated, high-quality second-hand items near you. Filter by category, condition, and location to find exactly what you need.",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-8 h-8"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" strokeLinecap="round" />
                  </svg>
                ),
                gradient: "from-[#7B3FB5] to-[#9B5FD4]",
                glowColor: "shadow-[#7B3FB5]/30",
              },
              {
                step: "02",
                title: "Connect Securely",
                desc: "Our admin team personally facilitates every connection between buyer and seller — ensuring trust, safety, and a seamless experience.",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-8 h-8"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path
                      d="m9 12 2 2 4-4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                gradient: "from-[#C9A84C] to-[#d4b86a]",
                glowColor: "shadow-[#C9A84C]/30",
              },
              {
                step: "03",
                title: "Collect & Enjoy",
                desc: "Pick up your treasure and give it a second life. Sustainable shopping that feels great — for you and the planet.",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-8 h-8"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ),
                gradient: "from-[#BC8FEE] to-[#DCC4F8]",
                glowColor: "shadow-[#BC8FEE]/30",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.2, ease: "easeOut" }}
                className="group relative"
              >
                <div className="relative rounded-3xl p-px bg-gradient-to-b from-white/20 to-white/5 overflow-hidden">
                  <div className="relative rounded-[calc(1.5rem-1px)] bg-white/[0.06] backdrop-blur-xl p-8 md:p-10 h-full border border-white/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.04] to-transparent rounded-bl-full" />

                    <div className="flex items-start gap-5 mb-6">
                      <div
                        className={`relative flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-lg ${step.glowColor} group-hover:scale-110 transition-transform duration-500`}
                      >
                        {step.icon}
                        <div
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`}
                        />
                      </div>
                      <span className="font-serif text-5xl font-bold text-white/[0.08] leading-none select-none">
                        {step.step}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl md:text-[1.7rem] font-bold text-white mb-3 group-hover:text-[#C9A84C] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-[#BC8FEE]/80 leading-relaxed text-[0.95rem]">
                      {step.desc}
                    </p>

                    <div
                      className={`mt-6 h-0.5 w-12 rounded-full bg-gradient-to-r ${step.gradient} group-hover:w-20 transition-all duration-500`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-24 bg-[#FDFBF7] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1E0A3C 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DCC4F8] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DCC4F8] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                value: "2,400+",
                label: "Items Listed",
                color: "text-[#C9A84C]",
                borderColor: "border-[#C9A84C]/20",
                bgGlow: "bg-[#C9A84C]/5",
              },
              {
                value: "1,800+",
                label: "Happy Buyers",
                color: "text-[#7B3FB5]",
                borderColor: "border-[#7B3FB5]/20",
                bgGlow: "bg-[#7B3FB5]/5",
              },
              {
                value: "98%",
                label: "Satisfaction Rate",
                color: "text-[#1E0A3C]",
                borderColor: "border-[#1E0A3C]/10",
                bgGlow: "bg-[#1E0A3C]/5",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative text-center p-10 rounded-3xl border ${stat.borderColor} ${stat.bgGlow} backdrop-blur-sm`}
              >
                <div
                  className={`font-serif text-5xl md:text-6xl font-bold ${stat.color} mb-3`}
                >
                  {stat.value}
                </div>
                <div className="text-[#5B2D8E] text-sm uppercase tracking-[0.2em] font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
