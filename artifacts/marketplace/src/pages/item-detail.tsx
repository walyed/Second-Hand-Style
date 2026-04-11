import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, ShieldCheck, Heart, Info, X } from 'lucide-react';
import { dummyListings } from '@/lib/dummy-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import NotFound from './not-found';

export default function ItemDetail() {
  const { id } = useParams();
  const listing = dummyListings.find(l => l.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [isWatchlisted, setIsWatchlisted] = useState(listing?.isWatchlisted ?? false);
  const [showContactModal, setShowContactModal] = useState(false);

  if (!listing) return <NotFound />;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-green-100 text-green-800 border-green-200';
      case 'Used': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Refurbished': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Special Deal': return 'bg-gradient-to-r from-purple-500 to-purple-400 text-white border-transparent';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 pb-20">
      {/* Hero Image Section */}
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden bg-cream-100">
        <Link href="/browse" className="absolute top-6 left-6 z-20">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <div className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-purple-900 hover:text-purple-600 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </div>
          </motion.div>
        </Link>

        <button 
          onClick={() => setIsWatchlisted(!isWatchlisted)}
          className="absolute top-6 right-6 z-20 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-purple-900 hover:text-purple-600 transition-colors"
        >
          <motion.div whileTap={{ scale: 0.8, rotate: isWatchlisted ? [0, -15, 15, 0] : 0 }}>
            <Heart className={`w-6 h-6 ${isWatchlisted ? 'fill-purple-600 text-purple-600' : ''}`} />
          </motion.div>
        </button>

        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          src={listing.images[activeImage]}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 relative z-10 -mt-20 md:-mt-32">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Main Details */}
          <div className="flex-1 glass rounded-3xl p-6 md:p-10 shadow-xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`${getConditionColor(listing.condition)} px-3 py-1 text-sm`}>
                {listing.condition}
              </Badge>
              <Badge variant="outline" className="bg-white/50 px-3 py-1 text-sm text-purple-700 border-purple-200">
                {listing.category}
              </Badge>
              <div className="flex items-center text-sm font-medium text-purple-600 bg-white/50 px-3 py-1 rounded-full border border-purple-200">
                <MapPin className="w-4 h-4 mr-1" /> {listing.city}
              </div>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-purple-900 mb-6 leading-tight">
              {listing.title}
            </h1>

            <div className="prose prose-purple max-w-none mb-8 text-purple-800/80 font-sans text-lg">
              <p>{listing.description}</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 mb-8 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-purple-500 shrink-0" />
              <div>
                <h4 className="font-bold text-purple-900 mb-1">Marketplace Guarantee</h4>
                <p className="text-sm text-purple-700/80">Every transaction is monitored by our admin team to ensure safety and authenticity. A small commission applies only upon successful transfer.</p>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {listing.images.length > 1 && (
              <div className="flex gap-3 mt-8 overflow-x-auto pb-4">
                {listing.images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImage === i ? 'border-purple-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="w-full md:w-80 lg:w-96 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="glass rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="mb-6">
                  <div className="text-sm text-purple-400 mb-1">Original Price</div>
                  <motion.div 
                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                    animate={{ clipPath: 'inset(0 0% 0 0)' }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="inline-block relative text-2xl text-purple-300 font-medium"
                  >
                    ₪{listing.originalPrice.toLocaleString()}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500/50 -rotate-3" />
                  </motion.div>
                  
                  <div className="text-sm text-purple-600 mt-4 mb-1 font-medium">Selling for</div>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="text-5xl font-bold text-purple-900"
                  >
                    ₪{listing.sellPrice.toLocaleString()}
                  </motion.div>
                </div>

                <div className="border-t border-purple-100 pt-6 mb-6">
                  <div className="text-sm font-medium text-purple-400 mb-3 uppercase tracking-wider">Seller</div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {listing.seller.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-purple-900 text-lg">{listing.seller.name}</div>
                      <div className="flex items-center text-gold text-sm font-medium">
                        <Star className="w-4 h-4 fill-current mr-1" /> {listing.seller.rating} Rating
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div whileTap={{ scale: 0.96 }}>
                  <Button 
                    size="lg" 
                    className="w-full rounded-full py-6 text-lg bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 shadow-lg shadow-purple-500/30"
                    onClick={() => setShowContactModal(true)}
                  >
                    Contact Seller
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md bg-cream-50 border-purple-200 p-0 overflow-hidden rounded-3xl">
          <div className="p-8 text-center flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6"
            >
              <Info className="w-10 h-10 text-purple-600" />
            </motion.div>
            
            <h2 className="font-serif text-3xl font-bold text-purple-900 mb-4">Connect Securely</h2>
            
            <p className="text-purple-700/80 mb-8 text-lg">
              Our admin team will connect you with <span className="font-bold">{listing.seller.name}</span> within 24 hours. A small fixed commission applies to ensure a safe transaction.
            </p>
            
            <div className="flex gap-4 w-full">
              <Button 
                variant="outline" 
                className="flex-1 rounded-full border-purple-200 text-purple-900 hover:bg-purple-50"
                onClick={() => setShowContactModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => {
                  setShowContactModal(false);
                  // sonner toast would go here
                  alert("Request sent successfully!");
                }}
              >
                Confirm Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
