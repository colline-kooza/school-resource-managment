import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import QuestionDetailClient from "@/components/qa/QuestionDetailClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login?auto-fill");
  }

  return (
    <DashboardLayout user={session.user}>
       <QuestionDetailClient 
         id={id} 
         currentUserId={session.user.id}
         currentUserRole={session.user.role}
       />
    </DashboardLayout>
  );
}
