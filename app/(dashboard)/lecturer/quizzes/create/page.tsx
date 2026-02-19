import React from "react";
import { CreateQuizForm } from "@/components/quiz/CreateQuizForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";

export default async function LecturerCreateQuizPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?auto-fill");
  }

  if (session.user.role !== "LECTURER" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[#1A3A6B]">Create New Quiz</h1>
        <p className="text-slate-500 font-medium">Design an academic assessment with custom questions, timing, and points.</p>
      </div>
      <CreateQuizForm />
    </DashboardLayout>
  );
}
