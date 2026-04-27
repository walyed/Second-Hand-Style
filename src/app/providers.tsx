"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CursorEffect } from "@/components/CursorEffect";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/i18n";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <CursorEffect />
            <ScrollProgress />
            {children}
            <Toaster
              position="top-center"
              offset="45vh"
              expand={false}
              closeButton
              duration={3500}
              toastOptions={{
                style: {
                  background: "#ffffff",
                  border: "1.5px solid #ede9fe",
                  borderRadius: "20px",
                  padding: "18px 24px",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#3b0764",
                  boxShadow: "0 25px 60px -8px rgba(107,33,168,0.30), 0 8px 24px -4px rgba(0,0,0,0.12)",
                  minWidth: "340px",
                  maxWidth: "440px",
                  transform: "translateY(-50%)",
                },
                classNames: {
                  toast: "sonner-bestow",
                  success: "sonner-success",
                  error: "sonner-error",
                  title: "sonner-title",
                },
              }}
            />
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
