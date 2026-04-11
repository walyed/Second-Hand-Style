import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Search, ArrowDown, Star, Sparkles, MoveRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dummyListings } from '@/lib/dummy-data';
import { ListingCard } from '@/components/ListingCard';

const categories = [
  { name: "Furniture", icon: "🛋️", delay: 0.1 },
  { name: "Electronics", icon: "📱", delay: 0.2 },
  { name: "Kitchen", icon: "🍳", delay: 0.3 },
  { name: "Clothing", icon: "👗", delay: 0.4 },
  { name: "Other", icon: "📦", delay: 0.5 },
];

export default function Home() {
  const featuredItems = dummyListings.filter(l => l.condition === 'Special Deal' || l.sellPrice > 2000).slice(0, 4);

  return (
    <div className="min-h-screen bg-cream-50 text-purple-900 relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden noise-overlay">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-full bg-gradient-to-b from-purple-100/50 to-cream-50/0 z-0" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-drift z-0" />
          <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-purple-200/40 rounded-full blur-3xl animate-drift z-0" style={{ animationDelay: '-5s' }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gold/10 rounded-full blur-3xl animate-drift z-0" style={{ animationDelay: '-10s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 z-10 flex flex-col items-center text-center mt-[-10vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              Buy Less. <br className="md:hidden" /> Choose <span className="animate-shimmer">Well.</span>
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
              <Button size="lg" className="w-full sm:w-auto text-lg rounded-full px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30 group">
                Browse Items <MoveRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/post">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg rounded-full px-8 py-6 border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 text-purple-900 glass">
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
            <p className="text-purple-600/80 text-lg">Hand-picked items that deserve a second life.</p>
          </div>
          <Link href="/browse" className="hidden md:flex items-center gap-2 text-purple-600 font-medium hover:text-purple-800 transition-colors group">
            View all <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
            <Button variant="outline" className="w-full rounded-full border-purple-200 text-purple-900">
              View all listings
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-cream-100 border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">The Marketplace Way</h2>
            <p className="text-purple-600/80 text-lg">A simpler, more intentional way to buy and sell.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Browse & Discover", desc: "Find unique, high-quality items in your area. Everything is curated for quality.", icon: "🔍" },
              { title: "Connect Securely", desc: "Our admin team facilitates the connection between buyer and seller, ensuring a safe transaction.", icon: "🤝" },
              { title: "Collect & Enjoy", desc: "Pick up your new piece and give it a second life in your home. Sustainable and smart.", icon: "✨" }
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, rotateY: 90 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: i * 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-cream-50 flex items-center justify-center text-4xl mb-6 shadow-inner">
                  {step.icon}
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-purple-700/70">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-purple-900 text-cream-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="font-serif text-6xl font-bold text-gold mb-2">2.4k+</div>
            <div className="text-purple-200 text-lg uppercase tracking-widest font-medium">Items Listed</div>
          </div>
          <div>
            <div className="font-serif text-6xl font-bold text-purple-300 mb-2">1.8k+</div>
            <div className="text-purple-200 text-lg uppercase tracking-widest font-medium">Happy Buyers</div>
          </div>
          <div>
            <div className="font-serif text-6xl font-bold text-cream-50 mb-2">98%</div>
            <div className="text-purple-200 text-lg uppercase tracking-widest font-medium">Satisfaction Rate</div>
          </div>
        </div>
      </section>
    </div>
  );
}
