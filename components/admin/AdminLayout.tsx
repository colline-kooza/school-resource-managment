"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserAvatar } from "@/components/shared/UserAvatar";

interface AdminLayoutProps {
  children: React.ReactNode;
  user: any;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden font-Inter">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar user={user} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6 text-[#1A3A6B]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px] border-none">
                <AdminSidebar user={user} />
              </SheetContent>
            </Sheet>

            <h1 className="text-xl font-bold text-[#1A3A6B] hidden sm:block tracking-tight">Admin Control Center</h1>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-[#1A3A6B] hover:bg-slate-50 transition-all rounded-xl">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </Button>

            <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />

            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#1A3A6B] leading-none uppercase tracking-tight">
                  {user.firstName} {user.lastName?.[0]}.
                </p>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Administrator</p>
              </div>
              <UserAvatar 
                src={user.image} 
                name={`${user.firstName} ${user.lastName || ""}`} 
                size="sm" 
                className="ring-2 ring-slate-50 group-hover:ring-[#1A3A6B]/10 transition-all duration-300"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content View */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-10 no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
