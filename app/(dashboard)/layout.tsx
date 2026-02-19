"use client";
import * as React from "react";
import { Suspense } from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import DashboardNav from "@/components/backend/dashboard/dashboard-nav";
import AppSidebar from "@/components/backend/dashboard/sidebar/app-sidebar";

export default function DashboardLayout({children}:{children:React.ReactNode}) {
  return (
    <SidebarProvider defaultOpen={false}>
          <AppSidebar/>
          <SidebarInset>
            <DashboardNav/>
            <Suspense>
            {children}
            </Suspense>
          </SidebarInset>
        </SidebarProvider>
  )
}


