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
    if (!session?.user || (session.user.role !== 'LECTURER' && session.user.role !== 'ADMIN')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const { isPublished } = await req.json();

    const quiz = await db.quiz.findUnique({ where: { id } });
    if (!quiz) return new NextResponse("Not Found", { status: 404 });

    if (quiz.createdById !== session.user.id && session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedQuiz = await db.quiz.update({
      where: { id },
      data: { isPublished }
    });

    return NextResponse.json(updatedQuiz);

  } catch (error) {
    console.error("[QUIZ_PUBLISH_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
