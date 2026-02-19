"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6 font-Inter">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-[12rem] font-bold text-rose-500/5 leading-none select-none">500</h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-rose-500" />
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-[#1A3A6B]">Something Went Wrong</h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            A technical glitch occurred while processing your request. Our team has been notified (metaphorically).
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => reset()}
            className="w-full sm:w-auto bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white rounded-2xl h-14 px-8 font-bold shadow-xl shadow-[#1A3A6B]/20 transition-all hover:scale-[1.02]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto bg-white border-slate-200 text-[#1A3A6B] rounded-2xl h-14 px-8 font-bold hover:bg-slate-50 transition-all">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
