import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cream-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-purple-900">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-sm text-purple-700/80">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-purple-600 hover:text-purple-800 underline underline-offset-4"
          >
            Go back home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
