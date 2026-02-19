import React from "react";
import { QuizAttemptsAnalytics } from "@/components/quiz/QuizAttemptsAnalytics";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";

export default async function LecturerQuizAttemptsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
        <h1 className="text-3xl font-bold text-[#1A3A6B]">Student Results</h1>
        <p className="text-slate-500 font-medium">Detailed breakdown of attempt statistics and individual performance.</p>
      </div>
      <QuizAttemptsAnalytics quizId={id} />
    </DashboardLayout>
  );
}
