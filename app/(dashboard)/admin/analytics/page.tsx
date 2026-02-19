import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminAnalyticsClient from "@/components/admin/AdminAnalyticsClient";

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <AdminLayout user={session.user}>
      <AdminAnalyticsClient />
    </AdminLayout>
  );
}
