"use client";

import React from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { Home, LayoutDashboard, BookOpen, User, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  user: any;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children, user }) => {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const getDashboardHref = () => {
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "LECTURER") return "/lecturer";
    return "/dashboard";
  };

  const mobileNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "Panel", href: getDashboardHref() },
    { icon: PlusCircle, label: "Add", href: "/resources/upload", isAction: true },
    { icon: BookOpen, label: "Library", href: "/resources" },
    { icon: User, label: "Profile", href: "/settings" },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F5F7FA] overflow-hidden text-slate-900 relative font-Inter">
      {/* Sidebar - Desktop Only */}
      <div className={cn(
        "hidden lg:flex h-full transition-all duration-300",
        sidebarCollapsed ? "w-[80px]" : "w-[280px]"
      )}>
        <DashboardSidebar user={user} collapsed={sidebarCollapsed} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <DashboardHeader 
          user={user} 
          sidebarCollapsed={sidebarCollapsed} 
          setSidebarCollapsed={setSidebarCollapsed} 
        />
        
        <main className="flex-1 overflow-y-auto no-scrollbar pb-32 lg:pb-12 scroll-smooth">
          <div className="max-w-[1600px] mx-auto p-4 md:p-10">
             {children}
          </div>
        </main>

        {/* Bottom Navigation - Mobile Only */}
        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
          <nav className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-around">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              if (item.isAction) {
                return (
                  <Link key={item.label} href={item.href}>
                    <div className="flex items-center justify-center bg-[#1A3A6B] text-[#F4A800] w-14 h-14 rounded-full shadow-xl shadow-[#1A3A6B]/30 hover:scale-110 active:scale-90 transition-all border-4 border-white">
                      <Icon className="w-7 h-7" />
                    </div>
                  </Link>
                );
              }

              return (
                <Link key={item.label} href={item.href} className="flex flex-col items-center">
                  <div className={cn(
                    "p-3 rounded-2xl transition-all",
                    isActive ? "bg-blue-50 text-[#1A3A6B]" : "text-slate-400"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isActive && <span className="text-[10px] font-bold text-[#1A3A6B] uppercase tracking-tighter mt-1">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
