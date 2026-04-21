"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  authId: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  profile: AppUser | null;
  loading: boolean;
  signUp: (email: string, phone: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (identifier: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const profileFetchRef = useRef(false);

  const fetchProfile = useCallback(async (_token?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .maybeSingle();
    if (!error && data) {
      const p: AppUser = {
        id: data.id,
        authId: data.auth_id,
        fullName: data.full_name,
        phone: data.phone,
        avatarUrl: data.avatar_url,
        isAdmin: data.is_admin,
      };
      setProfile(p);
      return p;
    }
    return null;
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (s?.access_token) {
      await fetchProfile(s.access_token);
    }
  }, [fetchProfile]);

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user && s.access_token) {
        await fetchProfile();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user && s.access_token) {
        if (!profileFetchRef.current) {
          profileFetchRef.current = true;
          await fetchProfile();
          profileFetchRef.current = false;
        }
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async (email: string, phone: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });

    if (error) return { error: error.message };

    let token = data.session?.access_token;
    if (data.user && !data.session) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) return { error: signInError.message };
      token = signInData.session?.access_token;
    }

    // Create profile directly in Supabase
    if (data.user) {
      await supabase
        .from("users")
        .upsert({
          auth_id: data.user.id,
          full_name: fullName,
          phone: phone,
          email: email,
        }, { onConflict: "auth_id" });
      // Fetch and set profile BEFORE returning so redirect sees it
      profileFetchRef.current = true;
      await fetchProfile();
      profileFetchRef.current = false;
    }

    return { error: null };
  };

  const signIn = async (identifier: string, password: string) => {
    let email = identifier;

    // If not an email, treat as phone number and look up the user's email
    if (!identifier.includes("@")) {
      const phone = identifier.replace(/[^0-9]/g, "");
      const { data: userRow } = await supabase
        .from("users")
        .select("email")
        .eq("phone", phone)
        .maybeSingle();

      if (!userRow?.email) {
        // Try with original input in case phone stored with formatting
        const { data: userRow2 } = await supabase
          .from("users")
          .select("email")
          .eq("phone", identifier.trim())
          .maybeSingle();

        if (!userRow2?.email) {
          return { error: "No account found with that phone number" };
        }
        email = userRow2.email;
      } else {
        email = userRow.email;
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    // Fetch profile BEFORE returning so the redirect target sees it immediately
    if (data.session) {
      profileFetchRef.current = true;
      await fetchProfile();
      profileFetchRef.current = false;
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, user, profile, loading, signUp, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
