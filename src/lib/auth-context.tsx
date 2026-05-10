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
  profileLoading: boolean;
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
  const [profileLoading, setProfileLoading] = useState(false);
  const profileFetchRef = useRef(false);

  // fetchProfile uses the authId we already have — no extra getUser() roundtrip
  const fetchProfile = useCallback(async (authId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authId)
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
    if (s?.user?.id) {
      await fetchProfile(s.user.id);
    }
  }, [fetchProfile]);

  useEffect(() => {
    // getSession() reads from cookie/localStorage — near-instant, no network call
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false); // unblock UI immediately

      // Fetch profile in background so pages render without waiting
      if (s?.user?.id) {
        setProfileLoading(true);
        fetchProfile(s.user.id).finally(() => setProfileLoading(false));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user?.id) {
        if (!profileFetchRef.current) {
          profileFetchRef.current = true;
          setProfileLoading(true);
          fetchProfile(s.user.id).finally(() => {
            setProfileLoading(false);
            profileFetchRef.current = false;
          });
        }
      } else {
        setProfile(null);
        setProfileLoading(false);
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
      setProfileLoading(true);
      await fetchProfile(data.user.id);
      setProfileLoading(false);
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
    if (data.session?.user?.id) {
      profileFetchRef.current = true;
      setProfileLoading(true);
      await fetchProfile(data.session.user.id);
      setProfileLoading(false);
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
      value={{ session, user, profile, loading, profileLoading, signUp, signIn, signOut, refreshProfile }}
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
