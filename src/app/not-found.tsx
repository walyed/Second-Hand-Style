"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cream-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-purple-900">
              {t('notFound.title')}
            </h1>
          </div>

          <p className="mt-4 text-sm text-purple-700/80">
            {t('notFound.desc')}
          </p>

          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-purple-600 hover:text-purple-800 underline underline-offset-4"
          >
            {t('notFound.goHome')}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
