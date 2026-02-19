import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notification = await db.notification.findUnique({
      where: { id: id }
    });

    if (!notification) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (notification.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updated = await db.notification.update({
      where: { id: id },
      data: { status: "READ" }
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error("[NOTIFICATION_READ_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
