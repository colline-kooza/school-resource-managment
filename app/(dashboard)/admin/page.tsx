import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch some initial data server-side for the "Recent" tables
  const [recentUsers, pendingResources] = await Promise.all([
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          campus: { select: { title: true } }
      }
    }),
    prisma.resource.findMany({
      take: 5,
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
          uploadedBy: true,
          course: true
      }
    })
  ]);

  return (
    <AdminLayout user={session.user}>
      <AdminDashboardClient 
        initialRecentUsers={JSON.parse(JSON.stringify(recentUsers))}
        initialPendingResources={JSON.parse(JSON.stringify(pendingResources))}
      />
    </AdminLayout>
  );
}
