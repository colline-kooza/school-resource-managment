import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const status = Boolean(body.status);

    const user = await db.user.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(user);

  } catch (error) {
    console.error("[USER_STATUS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
