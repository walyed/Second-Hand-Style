"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/lib/api';
import { X, Loader2, CheckCircle2 } from 'lucide-react';

function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await api.submitContactRequest({ name: form.name, email: form.email, phone: form.phone || undefined, message: form.message });
      setSuccess(true);
    } catch (err: any) {
      setErrors({ submit: err.message || "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-purple-900 px-6 py-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-white">Contact Us</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-purple-800 text-purple-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-purple-900 mb-2">Message Sent!</h3>
            <p className="text-purple-600 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
            <button onClick={onClose} className="px-8 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-purple-800">Name <span className="text-red-500">*</span></label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your full name"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-purple-400 ${errors.name ? "border-red-400 bg-red-50" : "border-purple-200"}`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-purple-800">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="email@example.com"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-purple-400 ${errors.email ? "border-red-400 bg-red-50" : "border-purple-200"}`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-purple-800">Contact Number <span className="text-purple-400 text-xs">(optional)</span></label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="e.g. 0501234567"
                className="w-full border border-purple-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-purple-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-purple-800">Message <span className="text-red-500">*</span></label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                placeholder="How can we help you?"
                rows={4}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-purple-400 resize-none ${errors.message ? "border-red-400 bg-red-50" : "border-purple-200"}`}
              />
              {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{errors.submit}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send Message"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <AnimatePresence>
        {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      </AnimatePresence>

    <footer className="bg-purple-900 text-cream-50 py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="font-serif text-3xl font-bold mb-4">Bestow<span className="text-gold">.</span></h3>
          <p className="text-purple-200 max-w-sm mb-6">
            {t('footer.tagline')}
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-4 text-purple-100">{t('footer.explore')}</h4>
          <ul className="space-y-3">
            <li><Link href="/browse" className="text-purple-300 hover:text-white transition-colors">{t('footer.allItems')}</Link></li>
            <li><Link href="/browse?category=Furniture" className="text-purple-300 hover:text-white transition-colors">{t('cat.Furniture')}</Link></li>
            <li><Link href="/browse?category=Electronics" className="text-purple-300 hover:text-white transition-colors">{t('cat.Electronics')}</Link></li>
            <li><Link href="/browse?category=Clothing" className="text-purple-300 hover:text-white transition-colors">{t('cat.Clothing')}</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-4 text-purple-100">{t('footer.company')}</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-purple-300 hover:text-white transition-colors">{t('footer.aboutUs')}</a></li>
            <li>
              <button onClick={() => setShowContact(true)} className="text-purple-300 hover:text-white transition-colors">
                {t('footer.contact')}
              </button>
            </li>
            <li><a href="#" className="text-purple-300 hover:text-white transition-colors">{t('footer.terms')}</a></li>
            <li><a href="#" className="text-purple-300 hover:text-white transition-colors">{t('footer.privacy')}</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-purple-800 text-center text-purple-400 text-sm">
        <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
      </div>
    </footer>
    </>
  );
}
