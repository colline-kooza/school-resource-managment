import React from "react";
import { LecturerQuizzesTable } from "@/components/quiz/LecturerQuizzesTable";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";

export default async function LecturerQuizzesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?auto-fill");
  }

  if (session.user.role !== "LECTURER" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1A3A6B]">Quiz Management</h1>
        <p className="text-slate-500 font-medium">Create and oversee academic assessments for your courses.</p>
      </div>
      <LecturerQuizzesTable />
    </DashboardLayout>
  );
}
