import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?auto-fill");

  return (
    <DashboardLayout user={session.user}>
      <StudentDashboard user={session.user} />
    </DashboardLayout>
  );
}


