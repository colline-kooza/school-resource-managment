"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DashboardSidebar from "./DashboardSidebar";
import { Menu, Search, Bell, Grid, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  user: any;
}

const DashboardHeader: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="h-20 px-4 md:px-10 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] border-none shadow-2xl">
              <DashboardSidebar user={user} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Home/Back Button */}
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#1A3A6B] transition-colors group">
          <div className="p-1.5 hover:bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* Page Identity */}
        <div className="flex items-center gap-3 ml-2 border-l border-slate-100 pl-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
             <Grid className="w-4 h-4 text-[#1A3A6B]" />
          </div>
          <span className="text-sm font-bold text-[#1A3A6B] tracking-tight uppercase hidden xs:inline">Dashboard</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search - Desktop */}
        <div className="relative group hidden md:block">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1A3A6B] transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search resources, quizzes..."
            className="w-[300px] lg:w-[400px] bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-14 text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none placeholder:text-slate-400"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none hidden lg:flex">
            <span className="text-[10px] font-bold text-slate-300 bg-white border border-slate-100 rounded-lg px-2 py-0.5 shadow-sm">⌘K</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:border-l border-slate-100 md:pl-6">
          <Button variant="ghost" size="icon" className="hidden sm:flex h-10 w-10 text-slate-400 hover:text-[#1A3A6B] hover:bg-blue-50 rounded-xl">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative h-10 w-10 text-slate-400 hover:text-[#1A3A6B] hover:bg-blue-50 rounded-xl">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#F4A800] rounded-full border-2 border-white" />
          </Button>
          
          <Link href={user.role === "STUDENT" ? "/dashboard/resources/new" : "/lecturer/resources/upload"}>
            <Button className="bg-[#1A3A6B] text-white hover:bg-[#0F2447] px-6 rounded-xl font-bold text-xs uppercase tracking-wider ml-2 shadow-lg shadow-[#1A3A6B]/20 active:scale-95 transition-all">
              Upload
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
