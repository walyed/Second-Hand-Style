"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, SlidersHorizontal } from "lucide-react";
import { dummyListings, Category, Condition, City } from "@/lib/dummy-data";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

export default function Browse() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(
    "newest"
  );
  const [isLoading, setIsLoading] = useState(false);

  const categories: Category[] = [
    "Furniture",
    "Electronics",
    "Kitchen",
    "Clothing",
    "Other",
  ];
  const conditions: Condition[] = [
    "New",
    "Used",
    "Refurbished",
    "Special Deal",
  ];
  const cities: City[] = ["Tel Aviv", "Jerusalem", "Haifa", "Eilat"];

  const handleToggle = <T,>(list: T[], setList: (v: T[]) => void, item: T) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const filteredListings = dummyListings
    .filter((listing) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(listing.category)
      )
        return false;
      if (
        selectedConditions.length > 0 &&
        !selectedConditions.includes(listing.condition)
      )
        return false;
      if (
        selectedCities.length > 0 &&
        !selectedCities.includes(listing.city)
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.sellPrice - b.sellPrice;
      if (sortBy === "price-desc") return b.sellPrice - a.sellPrice;
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-serif text-xl font-bold mb-4 border-b border-purple-100 pb-2">
          Category
        </h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() =>
                  handleToggle(
                    selectedCategories,
                    setSelectedCategories,
                    cat
                  )
                }
              />
              <Label
                htmlFor={`cat-${cat}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-serif text-xl font-bold mb-4 border-b border-purple-100 pb-2">
          Condition
        </h3>
        <div className="space-y-3">
          {conditions.map((cond) => (
            <div key={cond} className="flex items-center space-x-2">
              <Checkbox
                id={`cond-${cond}`}
                checked={selectedConditions.includes(cond)}
                onCheckedChange={() =>
                  handleToggle(
                    selectedConditions,
                    setSelectedConditions,
                    cond
                  )
                }
              />
              <Label
                htmlFor={`cond-${cond}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {cond}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-serif text-xl font-bold mb-4 border-b border-purple-100 pb-2">
          Location
        </h3>
        <div className="space-y-3">
          {cities.map((city) => (
            <div key={city} className="flex items-center space-x-2">
              <Checkbox
                id={`city-${city}`}
                checked={selectedCities.includes(city)}
                onCheckedChange={() =>
                  handleToggle(selectedCities, setSelectedCities, city)
                }
              />
              <Label
                htmlFor={`city-${city}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {city}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="font-serif text-4xl font-bold text-purple-900">
            Explore Collection
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-sm text-purple-600 font-medium">
              Showing {filteredListings.length} results
            </div>

            {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="md:hidden border-purple-200 text-purple-900"
                >
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[80vh] rounded-t-3xl bg-cream-50 overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl mb-4">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <FilterContent />
              </SheetContent>
            </Sheet>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white border border-purple-200 text-purple-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 outline-none shadow-sm"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 glass rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-purple-600" />
                <h2 className="font-serif text-2xl font-bold">Filters</h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            {filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-serif text-2xl font-bold mb-2">
                  No items found
                </h3>
                <p className="text-purple-600/80">
                  Try adjusting your filters to see more results.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-purple-200"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedConditions([]);
                    setSelectedCities([]);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredListings.map((listing, i) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <ListingCard listing={listing} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {filteredListings.length > 0 && (
                  <div className="mt-12 text-center">
                    <Button
                      size="lg"
                      className="bg-white text-purple-900 border border-purple-200 hover:bg-purple-50 rounded-full px-8 shadow-sm"
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => setIsLoading(false), 1000);
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
