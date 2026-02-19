import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import AnnouncementsClient from "@/components/announcements/AnnouncementsClient";
import { db } from "@/prisma/db";

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?auto-fill");
  }

  const campuses = await db.campus.findMany({
    select: { id: true, title: true }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <AnnouncementsClient 
        campuses={campuses} 
        userCampusId={session.user.campusId} 
        userRole={session.user.role}
      />
    </div>
  );
}
