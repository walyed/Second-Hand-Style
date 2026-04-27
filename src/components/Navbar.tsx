"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth-context';
import { useTranslation, type Lang } from '@/lib/i18n';

export function Navbar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const { lang, setLang, t } = useTranslation();
  
  const switchLang = () => {
    const nextLang: Lang = lang === 'EN' ? 'עברית' : lang === 'עברית' ? 'عربي' : 'EN';
    setLang(nextLang);
  };

  const navLinks = [
    { href: '/browse', label: t('nav.browse') },
    { href: '/post', label: t('nav.sell') },
    { href: '/dashboard', label: t('nav.dashboard') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b-0 border-purple-200/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl font-extrabold tracking-tight text-purple-900 group-hover:text-purple-600 transition-colors">
            Bestow
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium hover:text-purple-600 transition-colors ${pathname === link.href ? 'text-purple-600' : 'text-purple-900'}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <button onClick={switchLang} className="flex items-center gap-1 text-sm font-medium text-purple-900 hover:text-purple-600 transition-colors">
              <Globe className="w-4 h-4" />
              {lang}
            </button>
            {profile ? (
              <div className="flex items-center gap-2">
                <Link href={profile.isAdmin ? '/admin' : '/dashboard'}>
                  <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-full px-6">
                    <User className="w-4 h-4 mr-1" />
                    {profile.fullName.split(' ')[0]}
                  </Button>
                </Link>
                <button onClick={signOut} className="text-purple-900 hover:text-purple-600 transition-colors" title={t('nav.signOut')}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-full px-6">
                  {t('nav.login')}
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={switchLang} className="text-purple-900">
            <Globe className="w-5 h-5" />
          </button>
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-purple-900"><Menu className="w-6 h-6" /></button>
            </SheetTrigger>
            <SheetContent side={typeof document !== 'undefined' && document.documentElement.dir === 'rtl' ? 'left' : 'right'} className="bg-cream-50 border-purple-200/40">
              <SheetTitle className="font-serif text-2xl mb-6">{t('nav.menu')}</SheetTitle>
              <SheetDescription className="sr-only">{t('nav.navigationMenu')}</SheetDescription>
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium text-purple-900 hover:text-purple-600">
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-purple-200/50 my-2" />
                {profile ? (
                  <button onClick={signOut} className="text-lg font-medium text-red-500 hover:text-red-700 text-left">
                    {t('nav.signOut')}
                  </button>
                ) : (
                  <Link href="/login" className="text-lg font-medium text-purple-600">
                    {t('nav.loginRegister')}
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
