import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { content } = body;

    const existingAnswer = await db.answer.findUnique({
      where: { id },
    });

    if (!existingAnswer) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Role check: Only Owner or Admin can edit answer
    const isOwner = existingAnswer.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const answer = await db.answer.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json(answer);
  } catch (error) {
    console.error("[ANSWER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const existingAnswer = await db.answer.findUnique({
      where: { id },
    });

    if (!existingAnswer) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Role check: Owner, Lecturer, or Admin can delete
    const isOwner = existingAnswer.userId === session.user.id;
    const isModerator = session.user.role === "ADMIN" || session.user.role === "LECTURER";

    if (!isOwner && !isModerator) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await db.answer.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ANSWER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
