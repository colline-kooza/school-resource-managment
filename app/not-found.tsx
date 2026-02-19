"use client";

import Link from "next/link";
import { MoveLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6 font-Inter">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-[12rem] font-bold text-[#1A3A6B]/5 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center">
                <HelpCircle className="w-12 h-12 text-[#F4A800]" />
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-[#1A3A6B]">Page Not Found</h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            Oops! It seems the knowledge you're looking for has moved or never existed. Let's get you back on track.
          </p>
        </div>

        <div className="pt-6">
          <Button asChild className="bg-[#1A3A6B] hover:bg-[#1A3A6B]/90 text-white rounded-2xl h-14 px-8 font-bold shadow-xl shadow-[#1A3A6B]/20 transition-all hover:scale-[1.02]">
            <Link href="/" className="flex items-center gap-2">
              <MoveLeft className="w-4 h-4" />
              Return to BusiLearn
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
