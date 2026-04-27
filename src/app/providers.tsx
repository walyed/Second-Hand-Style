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
              richColors
              expand
              closeButton
              toastOptions={{
                style: {
                  background: "white",
                  border: "1px solid #e9d5ff",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#3b0764",
                  boxShadow: "0 20px 60px -10px rgba(107,33,168,0.25), 0 4px 20px -4px rgba(0,0,0,0.1)",
                  minWidth: "320px",
                },
                classNames: {
                  success: "!border-green-200 !bg-green-50",
                  error: "!border-red-200 !bg-red-50",
                },
              }}
            />
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
