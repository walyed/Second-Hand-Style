import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { MapPin, Heart } from 'lucide-react';
import { Listing } from '@/lib/dummy-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ListingCard({ listing }: { listing: Listing }) {
  const [isWatchlisted, setIsWatchlisted] = React.useState(listing.isWatchlisted);

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
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex flex-col glass rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/item/${listing.id}`} className="block relative aspect-square overflow-hidden bg-cream-100">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-3 left-3 ${getConditionColor(listing.condition)} font-medium`}>
          {listing.condition}
        </Badge>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWatchlisted(!isWatchlisted);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-purple-900 hover:text-purple-600 transition-colors z-10"
        >
          <motion.div whileTap={{ scale: 0.8, rotate: isWatchlisted ? [0, -15, 15, 0] : 0 }}>
            <Heart className={`w-5 h-5 ${isWatchlisted ? 'fill-purple-600 text-purple-600' : ''}`} />
          </motion.div>
        </button>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-purple-500 uppercase tracking-wider">{listing.category}</span>
          <div className="flex items-center text-purple-400 text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            {listing.city}
          </div>
        </div>
        
        <Link href={`/item/${listing.id}`}>
          <h3 className="font-serif font-bold text-xl text-purple-900 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {listing.title}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            <div className="text-sm text-purple-400 line-through">₪{listing.originalPrice.toLocaleString()}</div>
            <div className="text-2xl font-bold text-purple-600">₪{listing.sellPrice.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-purple-400">Seller</div>
            <div className="text-sm font-medium text-purple-900 truncate max-w-[100px]">{listing.seller.name.split(' ')[0]}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
