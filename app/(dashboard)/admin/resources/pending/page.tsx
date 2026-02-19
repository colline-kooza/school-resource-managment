import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPendingApprovals from "@/components/resources/AdminPendingApprovals";

export default async function AdminPendingPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <AdminLayout user={session.user}>
      <AdminPendingApprovals />
    </AdminLayout>
  );
}
