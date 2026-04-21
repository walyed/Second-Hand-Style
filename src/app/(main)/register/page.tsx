"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";

export default function Register() {
  const router = useRouter();
  const { signUp, profile, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect when profile becomes available after signup
  useEffect(() => {
    if (profile && !authLoading) {
      router.replace(profile.isAdmin ? "/admin" : "/dashboard");
    }
  }, [profile, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    const fullName = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (password.length < 6) {
      toast.error(t('register.passwordShort'));
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, phone, password, fullName);

    if (error) {
      setIsLoading(false);
      toast.error(error);
    } else {
      toast.success(t('register.success'));
      // Don't call router.push here — the useEffect above handles redirect
    }
  };

  return (
    <div className="min-h-[90vh] flex bg-cream-50">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-purple-900 items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20 noise-overlay" />
        <div className="absolute w-[40rem] h-[40rem] bg-purple-600/30 rounded-full blur-[100px] -top-20 -left-20 animate-drift" />
        <div
          className="absolute w-[30rem] h-[30rem] bg-gold/20 rounded-full blur-[80px] bottom-10 right-10 animate-drift"
          style={{ animationDelay: "-5s" }}
        />

        <div className="relative z-10 max-w-lg text-cream-50">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-6xl font-bold mb-6"
          >
            {t('register.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-purple-200 font-light leading-relaxed"
          >
            &ldquo;{t('register.quote')}&rdquo;
          </motion.p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10 lg:hidden">
            <h1 className="font-serif text-4xl font-bold text-purple-900 mb-2">
              {t('register.title')}
            </h1>
            <p className="text-purple-600/80">{t('register.subtitle')}</p>
          </div>

          <div className="glass rounded-3xl p-8 sm:p-10 shadow-xl relative">
            <div className="absolute inset-0 rounded-3xl border-2 border-purple-200/50 pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-900 font-bold">
                  {t('register.fullName')}
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t('register.namePlaceholder')}
                  className="rounded-xl bg-cream-50 border-purple-200 focus-visible:ring-purple-500 p-6 text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-900 font-bold">
                  {t('register.email')}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('register.emailPlaceholder')}
                  className="rounded-xl bg-cream-50 border-purple-200 focus-visible:ring-purple-500 p-6 text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-purple-900 font-bold">
                  {t('register.phone')}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t('register.phonePlaceholder')}
                  className="rounded-xl bg-cream-50 border-purple-200 focus-visible:ring-purple-500 p-6 text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-purple-900 font-bold"
                >
                  {t('register.password')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="rounded-xl bg-cream-50 border-purple-200 focus-visible:ring-purple-500 p-6 text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl py-6 text-lg bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white shadow-md transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  t('register.submit')
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-purple-700/80">
              {t('register.hasAccount')}{" "}
              <Link
                href="/login"
                className="font-bold text-purple-600 hover:text-purple-900 transition-colors"
              >
                {t('register.loginLink')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
