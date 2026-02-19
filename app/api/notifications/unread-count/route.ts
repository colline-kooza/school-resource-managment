import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const count = await db.notification.count({
      where: {
        userId: session.user.id,
        status: "UNREAD"
      }
    });

    return NextResponse.json({ count });

  } catch (error) {
    console.error("[NOTIFICATIONS_UNREAD_COUNT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
