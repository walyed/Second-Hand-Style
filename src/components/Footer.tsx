"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/lib/api';
import { X, Loader2, CheckCircle2, Gift, Heart, Recycle, Users, Shield, FileText } from 'lucide-react';

function InfoModal({ title, icon, onClose, children }: { title: string; icon: React.ReactNode; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-purple-900 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-700 rounded-xl text-purple-200">{icon}</div>
            <h2 className="font-serif text-xl font-bold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-purple-800 text-purple-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-6 text-sm text-purple-800 space-y-4 leading-relaxed">
          {children}
        </div>
        <div className="shrink-0 px-6 pb-6">
          <button onClick={onClose} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AboutUsModal({ onClose }: { onClose: () => void }) {
  return (
    <InfoModal title="About Us" icon={<Heart className="w-5 h-5" />} onClose={onClose}>
      <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
        <Gift className="w-8 h-8 text-purple-600 shrink-0" />
        <p className="font-medium text-purple-900">Bestow is a free giving platform that connects generous people with those who can use what they no longer need.</p>
      </div>
      <h3 className="font-semibold text-purple-900 text-base">Our Mission</h3>
      <p>We believe that every item has a second life waiting for it. Bestow was created to make giving simple, joyful, and free — no transactions, no fees, just community generosity at its best.</p>
      <h3 className="font-semibold text-purple-900 text-base">How It Works</h3>
      <ul className="space-y-2 pl-4">
        <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">1.</span><span><strong>List an item</strong> you no longer need — it takes under two minutes.</span></li>
        <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">2.</span><span><strong>Browse freely</strong> — find furniture, electronics, clothing, books, and more near you.</span></li>
        <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">3.</span><span><strong>Connect directly</strong> — reach out to the giver and arrange a pickup at your convenience.</span></li>
      </ul>
      <div className="grid grid-cols-3 gap-3 pt-2">
        {[
          { icon: <Recycle className="w-5 h-5" />, label: "Reduce waste" },
          { icon: <Heart className="w-5 h-5" />, label: "Spread kindness" },
          { icon: <Users className="w-5 h-5" />, label: "Build community" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 p-3 bg-purple-50 rounded-2xl text-purple-700">
            {icon}
            <span className="text-xs font-medium text-center">{label}</span>
          </div>
        ))}
      </div>
      <h3 className="font-semibold text-purple-900 text-base">Who We Are</h3>
      <p>Bestow is a community-driven project dedicated to reducing waste and fostering a culture of generosity. We are a small team passionate about sustainability and the power of giving.</p>
    </InfoModal>
  );
}

function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <InfoModal title="Terms of Service" icon={<FileText className="w-5 h-5" />} onClose={onClose}>
      <p className="text-purple-500 text-xs">Last updated: April 2026</p>
      <p>By using Bestow, you agree to these Terms of Service. Please read them carefully.</p>
      <h3 className="font-semibold text-purple-900 text-base">1. The Service</h3>
      <p>Bestow is a free platform for giving and receiving items within the community. All listings are offered at no cost — no buying or selling is permitted through the platform.</p>
      <h3 className="font-semibold text-purple-900 text-base">2. User Conduct</h3>
      <ul className="space-y-1 pl-4 list-disc">
        <li>You must be at least 18 years old to use Bestow.</li>
        <li>All information you provide must be accurate and truthful.</li>
        <li>You may not post items that are illegal, hazardous, counterfeit, or otherwise prohibited.</li>
        <li>Harassment, discrimination, or abusive behavior toward other users is strictly prohibited.</li>
        <li>Each account must be owned and operated by one individual.</li>
      </ul>
      <h3 className="font-semibold text-purple-900 text-base">3. Listings</h3>
      <p>You are solely responsible for the items you list. Bestow does not verify the condition, accuracy, or safety of listed items. By listing an item, you confirm you have the right to give it away.</p>
      <h3 className="font-semibold text-purple-900 text-base">4. Limitation of Liability</h3>
      <p>Bestow is provided "as is" without warranties of any kind. We are not liable for any disputes, damages, or losses arising from interactions between users or from items exchanged through the platform.</p>
      <h3 className="font-semibold text-purple-900 text-base">5. Account Termination</h3>
      <p>We reserve the right to suspend or terminate accounts that violate these terms, at our sole discretion and without prior notice.</p>
      <h3 className="font-semibold text-purple-900 text-base">6. Changes to Terms</h3>
      <p>We may update these terms from time to time. Continued use of Bestow after changes constitutes acceptance of the new terms.</p>
    </InfoModal>
  );
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <InfoModal title="Privacy Policy" icon={<Shield className="w-5 h-5" />} onClose={onClose}>
      <p className="text-purple-500 text-xs">Last updated: April 2026</p>
      <p>Your privacy matters to us. This policy explains what data we collect, how we use it, and your rights.</p>
      <h3 className="font-semibold text-purple-900 text-base">1. Data We Collect</h3>
      <ul className="space-y-1 pl-4 list-disc">
        <li><strong>Account data:</strong> Name, email address, and password (stored securely via Supabase Auth).</li>
        <li><strong>Listing data:</strong> Item descriptions, photos, and location city you provide.</li>
        <li><strong>Contact messages:</strong> Name, email, phone, and message content submitted via our contact form.</li>
        <li><strong>Usage data:</strong> Basic analytics such as pages visited and actions taken, collected anonymously.</li>
      </ul>
      <h3 className="font-semibold text-purple-900 text-base">2. How We Use Your Data</h3>
      <ul className="space-y-1 pl-4 list-disc">
        <li>To operate and improve the Bestow platform.</li>
        <li>To display your listings to other users.</li>
        <li>To respond to contact requests you submit.</li>
        <li>To enforce our Terms of Service and keep the platform safe.</li>
      </ul>
      <h3 className="font-semibold text-purple-900 text-base">3. Data Sharing</h3>
      <p>We do not sell your personal data. We do not share your information with third parties except as required by law, or to operate core services (e.g., Supabase for database and authentication, Vercel for hosting).</p>
      <h3 className="font-semibold text-purple-900 text-base">4. Data Security</h3>
      <p>We use industry-standard security measures including encrypted connections (HTTPS) and secure authentication. However, no system is 100% secure and we cannot guarantee absolute security.</p>
      <h3 className="font-semibold text-purple-900 text-base">5. Your Rights</h3>
      <ul className="space-y-1 pl-4 list-disc">
        <li>You may request access to or deletion of your personal data at any time.</li>
        <li>You may delete your account and associated listings from the platform.</li>
        <li>To exercise these rights, contact us through the Contact form.</li>
      </ul>
      <h3 className="font-semibold text-purple-900 text-base">6. Cookies</h3>
      <p>Bestow uses only essential cookies required for authentication and session management. No tracking or advertising cookies are used.</p>
    </InfoModal>
  );
}

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
  const [showAbout, setShowAbout] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <AnimatePresence>
        {showContact && <ContactModal onClose={() => setShowContact(false)} />}
        {showAbout && <AboutUsModal onClose={() => setShowAbout(false)} />}
        {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
        {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
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
            <li><button onClick={() => setShowAbout(true)} className="text-purple-300 hover:text-white transition-colors">{t('footer.aboutUs')}</button></li>
            <li>
              <button onClick={() => setShowContact(true)} className="text-purple-300 hover:text-white transition-colors">
                {t('footer.contact')}
              </button>
            </li>
            <li><button onClick={() => setShowTerms(true)} className="text-purple-300 hover:text-white transition-colors">{t('footer.terms')}</button></li>
            <li><button onClick={() => setShowPrivacy(true)} className="text-purple-300 hover:text-white transition-colors">{t('footer.privacy')}</button></li>
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
