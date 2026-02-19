import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { role } = await req.json();

    if (!role || !["STUDENT", "LECTURER", "ADMIN"].includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    const user = await db.user.update({
      where: { id: id },
      data: { role }
    });

    return NextResponse.json(user);

  } catch (error) {
    console.error("[USER_ROLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
