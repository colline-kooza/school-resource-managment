import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import NotificationsClient from "@/components/notifications/NotificationsClient";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?auto-fill");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <NotificationsClient />
    </div>
  );
}
