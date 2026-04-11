"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = React.useState('EN');
  
  const switchLang = () => {
    const nextLang = lang === 'EN' ? 'עברית' : lang === 'עברית' ? 'عربي' : 'EN';
    setLang(nextLang);
    document.documentElement.dir = nextLang === 'EN' ? 'ltr' : 'rtl';
    localStorage.setItem('app-lang', nextLang);
  };

  useEffect(() => {
    const saved = localStorage.getItem('app-lang');
    if (saved) {
      setLang(saved);
      document.documentElement.dir = saved === 'EN' ? 'ltr' : 'rtl';
    }
  }, []);

  const navLinks = [
    { href: '/browse', label: 'Browse' },
    { href: '/post', label: 'Sell' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b-0 border-purple-200/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-3xl text-purple-900 font-bold group-hover:text-purple-600 transition-colors">
            M<span className="text-gold">.</span>
          </span>
          <span className="font-serif text-xl font-medium hidden sm:inline-block">Marketplace</span>
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
            <Link href="/login">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-full px-6">
                Login
              </Button>
            </Link>
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
              <SheetTitle className="font-serif text-2xl mb-6">Menu</SheetTitle>
              <SheetDescription className="sr-only">Navigation menu</SheetDescription>
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium text-purple-900 hover:text-purple-600">
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-purple-200/50 my-2" />
                <Link href="/login" className="text-lg font-medium text-purple-600">
                  Login / Register
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
