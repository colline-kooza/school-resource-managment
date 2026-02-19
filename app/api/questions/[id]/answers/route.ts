import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const questionId = id;
    const body = await req.json();
    const { content } = body;

    if (!content || content.length < 20) {
      return new NextResponse("Content is too short", { status: 400 });
    }

    const question = await db.question.findUnique({
      where: { id: questionId },
      select: { title: true, userId: true }
    });

    if (!question) {
      return new NextResponse("Question not found", { status: 404 });
    }

    const answer = await db.answer.create({
      data: {
        content,
        questionId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            firstName: true,
            lastName: true,
            image: true,
          }
        }
      }
    });

    // Notify question owner
    if (question.userId !== session.user.id) {
      await createNotification({
        userId: question.userId,
        title: "New Answer 💬",
        message: `[${session.user.name || "User"}] answered your question: "${question.title}"`,
        link: `/qa/${questionId}`,
      });
    }

    return NextResponse.json(answer);
  } catch (error) {
    console.error("[ANSWERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
