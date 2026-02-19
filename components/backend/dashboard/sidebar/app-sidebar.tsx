import React from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible";
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
  } from "@/components/ui/sidebar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

  import {
    BadgeCheck,
    Bell,
    Book,
    BookOpen,
    Bot,
    ChevronRight,
    ChevronsUpDown,
    CreditCard,
    Home,
    LogOut,
    Settings2,
    Sparkles,
    SquareTerminal,
  } from "lucide-react";
import Link from 'next/link';
import Logo from '@/components/frontend/Logo';
import { useSession, signOut } from "next-auth/react";
  

export default function AppSidebar() {
  const { data: session } = useSession();
  const sessionUser = session?.user;
  
  const user = {
    name: sessionUser?.name || "User",
    email: sessionUser?.email || "user@busilearn.ac.ug",
    avatar: sessionUser?.image || "/avatars/shadcn.jpg",
  };

  const sidebarLinks = [
    {
      title: "📊 Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive:true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Resource Management",
      url: "#",
      icon: Book,
      items: [
        {
          title: "Resources",
          url: "/dashboard/resources",
        },
        {
          title: "Campuses",
          url: "/dashboard/campuses",
        },
        {
          title: "Courses",
          url: "/dashboard/courses",
        },
        {
          title: "Categories",
          url: "/dashboard/categories",
        }
      ],
    },
    {
      title: "👨User Management",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
        }
      ],
    },
    {
      title: "Forum Management",
      url: "/dashboard/forum",
      icon: BookOpen,
      items: [
        {
          title: "Topics",
          url: "/dashboard/topics",
        },
        {
          title: "Examinations",
          url: "#",
        },
        {
          title: "Assignments",
          url: "#",
        },
        {
          title: "Report Cards",
          url: "#",
        },
      ],
    },
    {
      title: "Q & A Management",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "questions",
          url: "/dashboard/questions",
        },
        {
          title: "Answers",
          url: "/dashboard/answers",
        }
      ],
    },
    {
      title: "⚙️ Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "School Profile",
          url: "#",
        },
        {
          title: "User Management",
          url: "#",
        },
        {
          title: "System Settings",
          url: "#",
        },
        {
          title: "Backup & Security",
          url: "#",
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r-0">
        <SidebarHeader className="pt-4">
          <SidebarMenu>
            <SidebarMenuItem>
            <SidebarMenuButton tooltip="School-Guru">
                  <Logo href='/' title='KAU'/>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {sidebarLinks.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
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
                        src={user.avatar}
                        alt={user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">
                        {user.email}
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
                          src={user.avatar}
                          alt={user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.name}
                        </span>
                        <span className="truncate text-xs">
                          {user.email}
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
      </Sidebar>
  )
}