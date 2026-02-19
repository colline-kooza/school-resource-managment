import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect, notFound } from "next/navigation";
import UpdateResourceForm from "@/components/backend/forms/UpdateResourceForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getData } from "@/lib/getData";
import { db } from "@/prisma/db";

export default async function LecturerEditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?auto-fill");
  }

  const resource = await db.resource.findUnique({
    where: { id }
  });

  if (!resource) {
    notFound();
  }

  // Auth check: Only owner or admin
  if (resource.userId !== session.user.id && session.user.role !== 'ADMIN') {
    redirect("/dashboard");
  }

  const courseData = await getData("courses");
  const categoryData = await getData("categories");
  const campusData = await getData("campuses");
  
  const courses = courseData.map((item: any) => ({ title: item.title, id: item.id }));
  const categories = categoryData.map((item: any) => ({ title: item.title, id: item.id }));
  const campuses = campusData.map((item: any) => ({ title: item.title, id: item.id }));

  return (
    <DashboardLayout user={session.user}>
      <div className="min-h-screen bg-[#F5F7FA]">
        <UpdateResourceForm 
          initialData={resource}
          categories={categories} 
          courses={courses} 
          campuses={campuses}
        />
      </div>
    </DashboardLayout>
  );
}
