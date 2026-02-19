import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ResourcesClient from "@/components/resources/ResourcesClient";
import { SkeletonCard } from "@/components/shared/LoadingSkeleton";

export default async function ResourcesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login?auto-fill");
  }

  return (
    <DashboardLayout user={session.user}>
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      }>
        <ResourcesClient />
      </Suspense>
    </DashboardLayout>
  );
}
