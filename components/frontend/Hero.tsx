"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Users, BookOpenCheck } from "lucide-react";
import ChatUI from "./ChatUI";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center pt-24 md:pt-28 lg:pt-10 overflow-hidden bg-[#163360]">
      {/* Background with BusiLearn Gradient and Optional Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="relative w-full h-full opacity-40">
          <img
            src="https://img.freepik.com/free-photo/study-group-african-people_23-2149156368.jpg?t=st=1771488816~exp=1771492416~hmac=f89a40cf10fe3c9052a354f859a4764522a3210052fc93101a8a7214b23fe93c&w=1060"
            alt="University Background"
            className="w-full h-full object-cover scale-110"
          />
        </div>
        {/* BusiLearn Primary Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#163360] via-[#163360]/25 to-transparent"></div>
        {/* Animated Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-[#F4A800]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 -ml-20 -mb-20 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-20">
        {/* Left Side: Text Content */}
        <div className="max-w-2xl transform animate-in fade-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold leading-none mb-6 hover:bg-white/10 transition-all cursor-default w-fit">
            <span className="bg-[#F4A800] text-[#163360] px-2 py-0.5 rounded-full uppercase font-extrabold text-[9px]">NEW</span>
            <span className="font-semibold tracking-wide">🎓 BusiLearn: Academic Hub</span>
          </div>

          <h1
            className="
              text-4xl sm:text-5xl lg:text-[3.5rem]
              font-extrabold
              text-white
              mb-5 lg:mb-6
              leading-[1.1] sm:leading-[1] lg:leading-[1]
              tracking-tight
            "
          >
             Your Campus <br />
             <span className="text-[#F4A800]">Learning Hub</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100/80 mb-8 lg:mb-10 leading-relaxed font-medium max-w-xl">
            Find past papers, lecture notes, videos — and get your questions answered by peers and lecturers at BusiLearn: Academic Hub.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-[#F4A800] hover:bg-[#d99700] text-[#163360] px-8 py-6 rounded-xl font-extrabold text-xs shadow-xl shadow-[#F4A800]/20 transition-all hover:scale-[1.02] active:scale-95">
                GET STARTED <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login?auto-fill" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold h-[56px] px-8 rounded-xl transition-all text-xs">
                Login
              </Button>
            </Link>
          </div>

          {/* Trust Strip / Stats */}
          <div className="mt-10 lg:mt-16">
            <div className="flex flex-wrap items-center gap-6 sm:gap-x-10 gap-y-4">
              <div className="flex items-center gap-2 group">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors">
                  <Users className="w-5 h-5 text-[#F4A800]" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white leading-none">3K+</div>
                  <div className="text-[9px] text-blue-100/50 uppercase font-bold tracking-widest mt-1">Students</div>
                </div>
              </div>

              <div className="flex items-center gap-2 group text-white">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors">
                  <GraduationCap className="w-5 h-5 text-[#F4A800]" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white leading-none">12+</div>
                  <div className="text-[9px] text-blue-100/50 uppercase font-bold tracking-widest mt-1">Faculties</div>
                </div>
              </div>

              <div className="flex items-center gap-2 group text-white">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors">
                  <BookOpenCheck className="w-5 h-5 text-[#F4A800]" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white leading-none">500+</div>
                  <div className="text-[9px] text-blue-100/50 uppercase font-bold tracking-widest mt-1">Resources</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chat UI */}
        <div className="flex justify-center lg:justify-end relative animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="relative w-full max-w-md lg:max-w-lg">
             <ChatUI />
             
             {/* Scroll Indicator - Adapted for Academic Style */}
             <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 opacity-20 group">
                <span className="text-[11px] text-white uppercase tracking-[0.5em] font-black rotate-90 whitespace-nowrap origin-center translate-x-4">
                  Explore Hub
                </span>
                <div className="w-px h-24 bg-gradient-to-b from-white via-white/50 to-transparent"></div>
             </div>

             {/* Background Decoration for ChatUI */}
             <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-[#F4A800]/20 rounded-full blur-2xl" />
             <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
