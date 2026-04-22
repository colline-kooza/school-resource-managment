import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { QuizDetailClient } from "@/components/quiz/QuizDetailClient";

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?auto-fill");
  }

  const { id } = await params;

  return (
    <DashboardLayout user={session.user}>
      <QuizDetailClient quizId={id} />
    </DashboardLayout>
  );
}
