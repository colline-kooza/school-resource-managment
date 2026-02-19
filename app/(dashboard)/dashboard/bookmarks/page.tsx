import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BookmarksClient from "@/components/resources/BookmarksClient";

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login?auto-fill");
  }

  return (
    <DashboardLayout user={session.user}>
       <BookmarksClient />
    </DashboardLayout>
  );
}
