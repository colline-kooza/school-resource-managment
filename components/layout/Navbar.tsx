"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  GraduationCap,
  BookOpen,
  Menu,
  X,
  Bell,
  Home,
  FileText,
  MessageSquare,
  Brain,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Logo from "../frontend/Logo";
import NotificationBell from "./NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Resources", href: "/resources", icon: FileText },
  { name: "Q&A Forum", href: "/qa", icon: MessageSquare },
  { name: "Quizzes", href: "/quizzes", icon: Brain },
];

function getInitials(name?: string | null) {
  if (!name) return "BL";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getDashboardLink(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "LECTURER") return "/lecturer";
  return "/dashboard";
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const dashboardLink = getDashboardLink(session?.user?.role);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo href="/" />

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 hover:text-[#163360] hover:bg-blue-50"
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: "#163360" }
                        : {}
                    }
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right: Notifications + User */}
            <div className="hidden md:flex items-center gap-3">
              {session?.user ? (
                <>
                  {/* Notifications */}
                  <NotificationBell />

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#163360]">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={session.user.image ?? ""}
                            alt={session.user.name ?? ""}
                          />
                          <AvatarFallback
                            className="text-white text-xs font-semibold"
                            style={{ backgroundColor: "#163360" }}
                          >
                            {getInitials(session.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {session.user.firstName} {session.user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                          <span
                            className="text-xs font-medium px-1.5 py-0.5 rounded w-fit"
                            style={{
                              backgroundColor: "#F4A800",
                              color: "#163360",
                            }}
                          >
                            {session.user.role}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={dashboardLink} className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer focus:text-red-600"
                        onClick={() => signOut({ callbackUrl: "/login?auto-fill" })}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login?auto-fill">Log in</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="text-white"
                    style={{ backgroundColor: "#163360" }}
                  >
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#163360] hover:bg-blue-50 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between px-4 py-4 border-b"
          style={{ borderColor: "#16336020" }}
        >
            <Logo href="/" />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex flex-col h-full overflow-y-auto">
          {/* User info if logged in */}
          {session?.user && (
            <div
              className="px-4 py-3 border-b"
              style={{ backgroundColor: "#F5F7FA" }}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session.user.image ?? ""} />
                  <AvatarFallback
                    className="text-white text-sm font-semibold"
                    style={{ backgroundColor: "#163360" }}
                  >
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {session.user.firstName} {session.user.lastName}
                  </p>
                  <span
                    className="text-xs font-medium px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: "#F4A800", color: "#163360" }}
                  >
                    {session.user.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-[#163360]"
                  }`}
                  style={isActive ? { backgroundColor: "#163360" } : {}}
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                </Link>
              );
            })}

            {session?.user && (
              <>
                <div className="border-t my-2" />
                <Link
                  href={dashboardLink}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#163360] transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#163360] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Bell className="h-5 w-5" />
                    Notifications
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#163360] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                <button
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  onClick={() => signOut({ callbackUrl: "/login?auto-fill" })}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Auth buttons if not logged in */}
          {!session?.user && (
            <div className="px-4 py-4 border-t space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login?auto-fill">Log in</Link>
              </Button>
              <Button
                asChild
                className="w-full text-white"
                style={{ backgroundColor: "#163360" }}
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
