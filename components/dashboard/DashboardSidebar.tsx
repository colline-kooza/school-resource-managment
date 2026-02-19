"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  ClipboardList, 
  Bell, 
  Settings, 
  Users, 
  ChevronRight,
  LogOut,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface SidebarProps {
  user: any;
  collapsed?: boolean;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ user, collapsed }) => {
  const pathname = usePathname();

  const NavItem = ({ 
    icon: Icon, 
    label, 
    href, 
    count, 
    active, 
    hasDropdown 
  }: { 
    icon: any, 
    label: string, 
    href: string,
    count?: React.ReactNode, 
    active?: boolean, 
    hasDropdown?: boolean 
  }) => (
    <Link href={href}>
      <div className={cn(
        "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all group mb-1",
        active 
          ? "bg-[#1A3A6B] text-white shadow-lg shadow-[#1A3A6B]/20" 
          : "text-slate-500 hover:bg-slate-50 hover:text-[#1A3A6B]",
        collapsed && "justify-center px-0"
      )}>
        <div className={cn("flex items-center gap-3", collapsed && "gap-0")}>
          <Icon className={cn(
            "w-5 h-5 transition-colors",
            active ? "text-[#F4A800]" : "text-slate-400 group-hover:text-[#1A3A6B]"
          )} />
          {!collapsed && <span className="text-sm font-bold tracking-tight">{label}</span>}
        </div>
        {!collapsed && (
          <div className="flex items-center gap-2">
            {count != null && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
              )}>
                {count}
              </span>
            )}
            {hasDropdown && (
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform",
                active ? "rotate-90 text-white" : "text-slate-300"
              )} />
            )}
          </div>
        )}
      </div>
    </Link>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <div className={cn("px-3 mt-8 mb-3", collapsed && "mt-4 mb-2 flex justify-center px-0")}>
      {!collapsed ? (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{title}</span>
      ) : (
        <div className="w-4 h-[1px] bg-slate-100" />
      )}
    </div>
  );

  const getDashboardHref = () => {
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "LECTURER") return "/lecturer";
    return "/dashboard";
  };

  return (
    <aside className={cn(
      "h-full bg-white border-r border-slate-100 flex flex-col z-40 transition-all duration-300",
      collapsed ? "w-[80px]" : "w-[280px]"
    )}>
      {/* Brand Logo */}
      <div className={cn("p-8 pb-6 flex items-center justify-between", collapsed && "p-2 pb-6 justify-center")}>
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-10 h-10 bg-[#1A3A6B] rounded-2xl flex items-center justify-center shadow-xl shadow-[#1A3A6B]/20 transform group-hover:scale-105 transition-all duration-300 shrink-0">
            <span className="text-[#F4A800] font-bold text-xl">B</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F4A800] rounded-full border-2 border-white" />
          </div>
          {!collapsed && (
            <div className="shrink-0">
              <h2 className="text-lg font-bold leading-none text-[#1A3A6B]">BusiLearn</h2>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Academic Hub</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto no-scrollbar py-4 font-Inter">
        <SectionTitle title="Main Menu" />
        <NavItem 
          icon={LayoutDashboard} 
          label="Overview" 
          href={getDashboardHref()}
          active={pathname === getDashboardHref()} 
        />
        <NavItem 
          icon={BookOpen} 
          label="Resources" 
          href="/resources" 
          active={pathname.startsWith("/resources")} 
        />
        <NavItem 
          icon={ClipboardList} 
          label="Quizzes" 
          href="/quizzes" 
          active={pathname.startsWith("/quizzes")} 
        />
        <NavItem 
          icon={HelpCircle} 
          label="Q&A Forum" 
          href="/qa" 
          active={pathname.startsWith("/qa")} 
        />

        <SectionTitle title="Account" />
        <NavItem 
          icon={Bell} 
          label="Notifications" 
          href="/notifications" 
          count={3}
          active={pathname === "/notifications"} 
        />
        <NavItem 
          icon={Settings} 
          label="Settings" 
          href="/settings" 
          active={pathname === "/settings"} 
        />

        {(user.role === "ADMIN" || user.role === "LECTURER") && (
          <>
            <SectionTitle title="Lecturer Tools" />
            <NavItem icon={BookOpen} label="Manage Resources" href="/lecturer/resources" active={pathname.startsWith("/lecturer/resources")} />
            <NavItem icon={ClipboardList} label="Manage Quizzes" href="/lecturer/quizzes" active={pathname.startsWith("/lecturer/quizzes")} />
            {user.role === "ADMIN" && (
              <>
                <SectionTitle title="Admin Tools" />
                <NavItem icon={Users} label="User Management" href="/admin/users" active={pathname === "/admin/users"} />
                <NavItem icon={UserPlus} label="Course Setup" href="/admin/courses" active={pathname === "/admin/courses"} />
              </>
            )}
          </>
        )}
      </nav>

      {/* User Footer */}
      <div className={cn("p-4 border-t border-slate-50 space-y-2", collapsed && "p-2")}>
        <div className={cn(
          "p-3 bg-slate-50 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all",
          collapsed && "p-1.5 justify-center"
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            <UserAvatar 
              src={user.image} 
              name={`${user.firstName} ${user.lastName || ""}`} 
              size="sm" 
            />
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate uppercase">
                  {user.firstName} {user.lastName?.[0]}.
                </p>
                <p className="text-[10px] text-slate-400 truncate tracking-tight">{user.email}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button 
              onClick={() => signOut({ callbackUrl: "/login?auto-fill" })}
              className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
