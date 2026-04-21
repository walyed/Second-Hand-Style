"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, SlidersHorizontal, Loader2, MapPin, X } from "lucide-react";
import { api, type Listing, type Category, type Condition } from "@/lib/api";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { useTranslation } from "@/lib/i18n";

export default function Browse() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
  const [selectedCondition, setSelectedCondition] = useState<Condition | "">("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(
    "newest"
  );
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const categories: Category[] = ["Furniture", "Electronics", "Kitchen", "Other"];
  const conditions: Condition[] = ["New", "Used", "Refurbished", "Special Deal"];
  const cities = ["Tel Aviv", "Jerusalem", "Haifa", "Eilat"];

  // Auto-detect user city from browser geolocation (Israel only)
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lon } }) => {
        if (lat < 29 || lat > 34 || lon < 33 || lon > 36) return;
        const cityCoords: [string, number, number][] = [
          ["Tel Aviv", 32.0853, 34.7818],
          ["Jerusalem", 31.7683, 35.2137],
          ["Haifa", 32.794, 34.9896],
          ["Eilat", 29.5581, 34.9482],
        ];
        let nearest = "";
        let minDist = Infinity;
        for (const [city, clat, clon] of cityCoords) {
          const d = (lat - clat) ** 2 + (lon - clon) ** 2;
          if (d < minDist) { minDist = d; nearest = city; }
        }
        if (nearest) { setSelectedCity(nearest); setCityInput(nearest); }
      },
      () => {}
    );
  }, []);

  const fetchListings = async (reset = true) => {
    const newOffset = reset ? 0 : offset;
    if (reset) setIsLoading(true);
    else setLoadingMore(true);

    try {
      const sortMap: Record<string, string> = {
        newest: "newest",
        "price-asc": "price_asc",
        "price-desc": "price_desc",
      };
      const data = await api.getListings({
        category: selectedCategory || undefined,
        condition: selectedCondition || undefined,
        city: selectedCity || undefined,
        sort: sortMap[sortBy],
        limit: 18,
        offset: newOffset,
      });
      if (reset) {
        setListings(data);
        setOffset(data.length);
      } else {
        setListings((prev) => [...prev, ...data]);
        setOffset(newOffset + data.length);
      }
    } catch {
      // Keep existing listings on error
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchListings(true);
  }, [selectedCategory, selectedCondition, selectedCity, sortBy]);

  const filteredListings = listings;

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-serif text-xl font-bold mb-4 border-b border-purple-100 pb-2">
          {t('browse.category')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-white text-purple-700 border-purple-200 hover:border-purple-400"
              }`}
            >
              {t(`cat.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-serif text-xl font-bold mb-4 border-b border-purple-100 pb-2">
          {t('browse.condition')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {conditions.map((cond) => (
            <button
              key={cond}
              type="button"
              onClick={() => setSelectedCondition(selectedCondition === cond ? "" : cond)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                selectedCondition === cond
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-white text-purple-700 border-purple-200 hover:border-purple-400"
              }`}
            >
              {t(`cond.${cond}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-serif text-xl font-bold mb-4 border-b border-purple-100 pb-2">
          {t('browse.location')}
        </h3>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
          <input
            list="city-options"
            value={cityInput}
            onChange={(e) => {
              setCityInput(e.target.value);
              const match = cities.find(
                (c) => c.toLowerCase() === e.target.value.toLowerCase()
              );
              setSelectedCity(match ?? "");
            }}
            placeholder={t('browse.searchCity')}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-purple-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <datalist id="city-options">
            {cities.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
          {cityInput && (
            <button
              type="button"
              onClick={() => { setCityInput(""); setSelectedCity(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {selectedCity && (
          <p className="text-xs text-purple-500 mt-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {t(`city.${selectedCity}`)}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="font-serif text-4xl font-bold text-purple-900">
            {t('browse.title')}
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-sm text-purple-600 font-medium">
              {t('browse.showing')} {filteredListings.length} {t('browse.results')}
            </div>

            {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="md:hidden border-purple-200 text-purple-900"
                >
                  <Filter className="w-4 h-4 mr-2" /> {t('browse.filters')}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[80vh] rounded-t-3xl bg-cream-50 overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl mb-4">
                    {t('browse.filters')}
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
              <option value="newest">{t('browse.newest')}</option>
              <option value="price-asc">{t('browse.priceLow')}</option>
              <option value="price-desc">{t('browse.priceHigh')}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 glass rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-purple-600" />
                <h2 className="font-serif text-2xl font-bold">{t('browse.filters')}</h2>
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
                  {t('browse.noItems')}
                </h3>
                <p className="text-purple-600/80">
                  {t('browse.adjustFilters')}
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-purple-200"
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedCondition("");
                    setSelectedCity("");
                    setCityInput("");
                  }}
                >
                  {t('browse.clearFilters')}
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
                      onClick={() => fetchListings(false)}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                          {t('browse.loading')}
                        </div>
                      ) : (
                        t('browse.loadMore')
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
