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

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const where: any = { userId: session.user.id };
    if (unreadOnly) {
      where.status = "UNREAD";
    }

    const [notifications, total] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip
      }),
      db.notification.count({ where })
    ]);

    return NextResponse.json({
      notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("[NOTIFICATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Mark all as read if no ID provided in body, or if a specific flag is set
    const body = await req.json().catch(() => ({}));
    const { markAllRead } = body;

    if (markAllRead) {
      await db.notification.updateMany({
        where: { userId: session.user.id, status: "UNREAD" },
        data: { status: "READ" }
      });
      return NextResponse.json({ message: "All marked as read" });
    }

    return new NextResponse("Bad Request", { status: 400 });

  } catch (error) {
    console.error("[NOTIFICATIONS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
