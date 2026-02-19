import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/profile/ProfileClient";
import { db } from "@/prisma/db";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?auto-fill");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      campus: { select: { title: true } },
      course: { select: { title: true } }
    }
  });

  if (!user) {
    redirect("/login?auto-fill");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <ProfileClient user={user} />
    </div>
  );
}
