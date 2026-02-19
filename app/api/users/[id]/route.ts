import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.id !== id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, phone, yearOfStudy, image } = body;

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        phone,
        yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : undefined,
        image,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
