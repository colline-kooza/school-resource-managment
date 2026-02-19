import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import LecturerDashboard from "@/components/dashboard/LecturerDashboard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function LecturerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?auto-fill");
  }

  if (session.user.role !== "LECTURER" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout user={session.user}>
      <LecturerDashboard user={session.user} />
    </DashboardLayout>
  );
}
