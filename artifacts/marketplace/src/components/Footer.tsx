"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-purple-900 text-cream-50 py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="font-serif text-3xl font-bold mb-4">Marketplace<span className="text-gold">.</span></h3>
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
            <li><a href="#" className="text-purple-300 hover:text-white transition-colors">{t('footer.contact')}</a></li>
            <li><a href="#" className="text-purple-300 hover:text-white transition-colors">{t('footer.terms')}</a></li>
            <li><a href="#" className="text-purple-300 hover:text-white transition-colors">{t('footer.privacy')}</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-purple-800 text-center text-purple-400 text-sm">
        <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
      </div>
    </footer>
  );
}
