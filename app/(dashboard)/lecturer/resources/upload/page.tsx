import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import CreateResourceForm from "@/components/backend/forms/CreateResourceForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getData } from "@/lib/getData";

export default async function LecturerUploadPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?auto-fill");
  }

  if (session.user.role !== "LECTURER" && session.user.role !== "ADMIN") {
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
        <CreateResourceForm 
          user={session.user} 
          categories={categories} 
          courses={courses} 
          campuses={campuses}
        />
      </div>
    </DashboardLayout>
  );
}
