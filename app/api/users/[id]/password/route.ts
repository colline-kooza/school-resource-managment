import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import bcrypt from "bcryptjs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.id !== id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return new NextResponse("Missing passwords", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: id }
    });

    if (!user || !user.password) {
      return new NextResponse("User not found or using social login", { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return new NextResponse("Current password is incorrect", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: { id: id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("[USER_PASSWORD_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
