import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import UserManagementClient from "@/components/admin/UserManagementClient";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const campuses = await prisma.campus.findMany({
    select: { id: true, title: true }
  });

  return (
    <AdminLayout user={session.user}>
      <UserManagementClient campuses={campuses} />
    </AdminLayout>
  );
}
