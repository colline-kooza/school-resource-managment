import React from 'react'
import { Input } from "@/components/ui/input";
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronsUpDown,
  Command,
  CreditCard,
  Frame,
  GalleryVerticalEnd,
  Home,
  LogOut,
  Map,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';


const data = {
    user: {
        name: "User",
        email: "user@busilearn.ac.ug",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

import { Button } from "@/components/ui/button";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";


export default function DashboardNav() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = React.useState("");
  return (
    <div className="flex h-16 items-center gap-4 border-b px-4">
              <SidebarTrigger />
              <div className="flex-1">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Button variant="outline" size="icon">
                <Plus className="h-5 w-5" />
                <span className="sr-only">Add new</span>
              </Button>
              <SidebarFooter>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                  size="lg"
                                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                  <Avatar className="h-8 w-8 rounded-lg">
                                      <AvatarImage
                                        src={session?.user?.image || data.user.avatar}
                                        alt={session?.user?.name || data.user.name}
                                      />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                  </Avatar>
                                  <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                      {data.user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                      {data.user.email}
                                    </span>
                                  </div>
                                  <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                              >
                                <DropdownMenuLabel className="p-0 font-normal">
                                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                     <Avatar className="h-8 w-8 rounded-lg">
                                       <AvatarImage
                                         src={session?.user?.image || data.user.avatar}
                                         alt={session?.user?.name || data.user.name}
                                       />
                                       <AvatarFallback className="rounded-lg">
                                         CN
                                       </AvatarFallback>
                                     </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                      <span className="truncate font-semibold">
                                        {session?.user?.name || "User"}
                                      </span>
                                      <span className="truncate text-xs">
                                        {session?.user?.email || "user@busilearn.ac.ug"}
                                      </span>
                                    </div>
                                  </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                  <DropdownMenuItem>
                                    <Sparkles />
                                    Upgrade to Pro
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href="/" className="cursor-pointer">
                                      <Home className="mr-2 h-4 w-4" />
                                      Home
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                  <DropdownMenuItem>
                                    <BadgeCheck />
                                    Account
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CreditCard />
                                    Billing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Bell/>
                                    Notifications
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="cursor-pointer">
                                  <LogOut />
                                  Log out
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarFooter>
            </div>
  )
}
