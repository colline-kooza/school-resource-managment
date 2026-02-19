import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import { LecturerResourcesTable } from "@/components/backend/dashboard/LecturerResourcesTable";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function LecturerResourcesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?auto-fill");
  }

  if (session.user.role !== "LECTURER" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="p-8 max-w-7xl mx-auto min-h-screen">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#1A3A6B]">Resource Management</h1>
          <p className="text-slate-500 font-medium">Manage and monitor the status of your uploaded academic materials.</p>
        </div>
        <LecturerResourcesTable userId={session.user.id} />
      </div>
    </DashboardLayout>
  );
}
