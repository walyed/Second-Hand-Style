"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function PostItem() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    originalPrice: "",
    sellPrice: "",
    city: "",
    images: [] as string[],
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.error("Please log in to post an item");
      router.push("/login");
      return;
    }
    setIsSubmitting(true);

    try {
      await api.createListing({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        city: formData.city,
        originalPrice: Number(formData.originalPrice),
        sellPrice: Number(formData.sellPrice),
        images: formData.images.length > 0
          ? formData.images
          : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7B3FB5", "#9B5FD4", "#C9A84C"],
      });
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err.message || "Failed to create listing");
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error("Please select image files");
      return;
    }

    for (const file of imageFiles) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `listings/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("listing-images")
        .upload(path, file, { contentType: file.type });

      if (error) {
        // If bucket doesn't exist or upload fails, fall back to a local preview URL
        const url = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
      } else {
        const { data: urlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(path);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, urlData.publicUrl],
        }));
      }
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-cream-50 p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </motion.div>
        <h1 className="font-serif text-5xl font-bold text-purple-900 mb-4">
          Item Listed!
        </h1>
        <p className="text-xl text-purple-700/80 max-w-md mb-8">
          Your item is now live and waiting for a buyer. We&apos;ll notify you
          when someone is interested.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="rounded-full px-8 border-purple-200"
            >
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/browse">
            <Button className="rounded-full px-8 bg-purple-600 hover:bg-purple-700 text-white">
              View Listing
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-cream-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header & Progress */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-purple-900 mb-6">
            List an Item
          </h1>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-purple-100 -translate-y-1/2 rounded-full" />
            <motion.div
              className="absolute top-1/2 left-0 h-1 bg-purple-600 -translate-y-1/2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / 2) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            <div className="relative flex justify-between">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500
                    ${s < step ? "bg-purple-600 text-white" : s === step ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(123,63,181,0.5)]' : "bg-purple-100 text-purple-400"}`}
                >
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-xs font-bold text-purple-400 mt-2 uppercase tracking-wider">
            <span>Photos &amp; Details</span>
            <span>Category &amp; Price</span>
            <span>Review &amp; Post</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* STEP 1: Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="font-serif text-2xl font-bold text-purple-900 border-b border-purple-100 pb-4">
                    What are you selling?
                  </h2>

                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-purple-900 font-bold"
                    >
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g. Vintage Leather Sofa"
                      className="rounded-xl bg-cream-50 border-purple-200 p-6 text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-purple-900 font-bold">Photos</Label>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleImageDrop}
                      className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer
                        ${isDragging ? "border-purple-500 bg-purple-50" : "border-purple-200 bg-cream-50 hover:bg-white"}
                        ${formData.images.length > 0 ? "bg-white border-solid" : ""}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) handleFiles(e.target.files);
                          e.target.value = "";
                        }}
                      />
                      {formData.images.length > 0 ? (
                        <div className="flex gap-4 overflow-x-auto">
                          {formData.images.map((img, i) => (
                            <div
                              key={i}
                              className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0 group"
                            >
                              <img
                                src={img}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData((prev) => ({
                                    ...prev,
                                    images: prev.images.filter(
                                      (_, idx) => idx !== i
                                    ),
                                  }));
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="w-32 h-32 rounded-xl border-2 border-dashed border-purple-200 flex items-center justify-center shrink-0 text-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          >
                            <Plus className="w-8 h-8" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-purple-500" />
                          </div>
                          <p className="font-bold text-purple-900 mb-1">
                            Drag &amp; drop photos here
                          </p>
                          <p className="text-sm text-purple-600/70">
                            High quality photos make your item sell faster
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="desc"
                      className="text-purple-900 font-bold"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="desc"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the item's features, history, and any flaws..."
                      className="rounded-xl bg-cream-50 border-purple-200 p-4 min-h-[120px]"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Category & Price */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <h2 className="font-serif text-2xl font-bold text-purple-900 border-b border-purple-100 pb-4">
                    Categorize it
                  </h2>

                  <div>
                    <Label className="text-purple-900 font-bold mb-3 block">
                      Category
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        "Furniture",
                        "Electronics",
                        "Kitchen",
                        "Clothing",
                        "Other",
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, category: cat })
                          }
                          className={`p-4 rounded-xl border text-center transition-all ${formData.category === cat ? "bg-purple-100 border-purple-500 text-purple-900 font-bold shadow-sm" : "bg-white border-purple-100 text-purple-700 hover:border-purple-300"}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-purple-900 font-bold mb-3 block">
                      Condition
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["New", "Like New", "Used", "Needs Love"].map(
                        (cond) => (
                          <button
                            key={cond}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, condition: cond })
                            }
                            className={`p-4 rounded-xl border text-center transition-all ${formData.condition === cond ? "bg-purple-100 border-purple-500 text-purple-900 font-bold shadow-sm" : "bg-white border-purple-100 text-purple-700 hover:border-purple-300"}`}
                          >
                            {cond}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="oprice"
                        className="text-purple-900 font-bold"
                      >
                        Original Price (₪)
                      </Label>
                      <Input
                        id="oprice"
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            originalPrice: e.target.value,
                          })
                        }
                        className="rounded-xl bg-cream-50 border-purple-200 p-6 text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="sprice"
                        className="text-purple-900 font-bold"
                      >
                        Selling Price (₪)
                      </Label>
                      <Input
                        id="sprice"
                        type="number"
                        value={formData.sellPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sellPrice: e.target.value,
                          })
                        }
                        className="rounded-xl bg-cream-50 border-purple-500 ring-2 ring-purple-500/20 p-6 text-lg font-bold text-purple-900"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Review */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="font-serif text-2xl font-bold text-purple-900 border-b border-purple-100 pb-4">
                    Where is it located?
                  </h2>

                  <div className="space-y-2">
                    <Label className="text-purple-900 font-bold">City</Label>
                    <select
                      className="w-full rounded-xl bg-white border border-purple-200 p-4 text-lg focus:ring-purple-500 focus:border-purple-500 outline-none"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    >
                      <option value="">Select a city...</option>
                      <option value="Tel Aviv">Tel Aviv</option>
                      <option value="Jerusalem">Jerusalem</option>
                      <option value="Haifa">Haifa</option>
                      <option value="Eilat">Eilat</option>
                    </select>
                  </div>

                  <div className="mt-8 bg-purple-50 rounded-2xl p-6 border border-purple-100">
                    <h3 className="font-bold text-purple-900 mb-4">Summary</h3>
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-cream-100 rounded-xl overflow-hidden shrink-0">
                        {formData.images[0] && (
                          <img
                            src={formData.images[0]}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-purple-900">
                          {formData.title || "Untitled Item"}
                        </div>
                        <div className="text-purple-600 font-bold text-xl">
                          ₪{formData.sellPrice || "0"}
                        </div>
                        <div className="text-sm text-purple-500">
                          {formData.category} &bull; {formData.condition} &bull;{" "}
                          {formData.city}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-10 pt-6 border-t border-purple-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="rounded-full px-6 border-purple-200 text-purple-900 disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="rounded-full px-8 bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full px-8 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white shadow-lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Post Listing"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
