import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import ResourceDetailPage from "@/components/resources/ResourceDetailPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login?auto-fill");
  }

  return <ResourceDetailPage />;
}
