"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  Clock, 
  Megaphone, 
  MapPin, 
  Building2, 
  BookOpen, 
  Library, 
  Tags, 
  Users, 
  Home,
  ChevronRight,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  user: any;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ user }) => {
  const pathname = usePathname();

  const NavItem = ({ 
    icon: Icon, 
    label, 
    href, 
    active 
  }: { 
    icon: any, 
    label: string, 
    href: string,
    active?: boolean 
  }) => (
    <Link href={href}>
      <div className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all group mb-1",
        active 
          ? "bg-[#1A3A6B] text-white shadow-lg shadow-[#1A3A6B]/20" 
          : "text-slate-500 hover:bg-slate-50 hover:text-[#1A3A6B]"
      )}>
        <div className="flex items-center gap-3">
          <Icon className={cn(
            "w-5 h-5 transition-colors",
            active ? "text-[#F4A800]" : "text-slate-400 group-hover:text-[#1A3A6B]"
          )} />
          <span className="text-sm font-bold tracking-tight">{label}</span>
        </div>
      </div>
    </Link>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="px-4 mt-8 mb-3">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{title}</span>
    </div>
  );

  return (
    <aside className="w-[280px] h-full bg-white border-r border-slate-100 flex flex-col flex-shrink-0 z-40 overflow-y-auto no-scrollbar">
      {/* Brand Logo */}
      <div className="p-8 pb-6 bg-white sticky top-0 z-10">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 bg-[#1A3A6B] rounded-2xl flex items-center justify-center shadow-xl shadow-[#1A3A6B]/20 transform group-hover:scale-105 transition-all duration-300">
            <span className="text-[#F4A800] font-bold text-xl">B</span>
          </div>
          <div>
            <h2 className="text-lg font-bold leading-none text-[#1A3A6B]">Admin</h2>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Academic Hub</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4">
        <SectionTitle title="Overview" />
        <NavItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          href="/admin"
          active={pathname === "/admin"} 
        />
        <NavItem 
          icon={BarChart3} 
          label="Analytics" 
          href="/admin/analytics" 
          active={pathname === "/admin/analytics"} 
        />

        <SectionTitle title="Content" />
        <NavItem 
          icon={Clock} 
          label="Pending Approvals" 
          href="/admin/resources/pending" 
          active={pathname === "/admin/resources/pending"} 
        />
        <NavItem 
          icon={Megaphone} 
          label="Announcements" 
          href="/admin/announcements" 
          active={pathname.startsWith("/admin/announcements")} 
        />

        <SectionTitle title="Platform" />
        <NavItem 
          icon={MapPin} 
          label="Campuses" 
          href="/admin/campuses" 
          active={pathname.startsWith("/admin/campuses")} 
        />
        <NavItem 
          icon={Building2} 
          label="Departments" 
          href="/admin/departments" 
          active={pathname.startsWith("/admin/departments")} 
        />
        <NavItem 
          icon={BookOpen} 
          label="Courses" 
          href="/admin/courses" 
          active={pathname.startsWith("/admin/courses")} 
        />
        <NavItem 
          icon={Library} 
          label="Course Units" 
          href="/admin/course-units" 
          active={pathname.startsWith("/admin/course-units")} 
        />
        <NavItem 
          icon={Tags} 
          label="Categories" 
          href="/admin/categories" 
          active={pathname.startsWith("/admin/categories")} 
        />

        <SectionTitle title="Users" />
        <NavItem 
          icon={Users} 
          label="Users Management" 
          href="/admin/users" 
          active={pathname.startsWith("/admin/users")} 
        />

        <SectionTitle title="Back" />
        <NavItem 
          icon={Home} 
          label="Return to Dashboard" 
          href="/dashboard"
          active={false} 
        />
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-50 mt-auto bg-white sticky bottom-0">
        <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all">
          <div className="flex items-center gap-3 overflow-hidden">
            <UserAvatar 
              src={user.image} 
              name={`${user.firstName} ${user.lastName || ""}`} 
              size="sm" 
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user.firstName}
              </p>
              <p className="text-[10px] text-slate-400 truncate uppercase font-bold tracking-tighter">Admin Panel</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/login?auto-fill" })}
            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
