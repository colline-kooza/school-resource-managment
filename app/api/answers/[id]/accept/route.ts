import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { createNotification } from "@/lib/notifications";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: answerId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const answer = await db.answer.findUnique({
      where: { id: answerId },
      include: { question: true }
    });

    if (!answer) {
      return new NextResponse("Answer not found", { status: 404 });
    }

    // Role check: Question Owner, Lecturer, or Admin
    const isQuestionOwner = answer.question.userId === session.user.id;
    const isModerator = session.user.role === "ADMIN" || session.user.role === "LECTURER";

    if (!isQuestionOwner && !isModerator) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Wrap in transaction: Un-accept other answers, accept this one, mark question resolved
    await db.$transaction([
      // Un-accept any currently accepted answer for this question
      db.answer.updateMany({
        where: { 
          questionId: answer.questionId,
          isAccepted: true
        },
        data: { isAccepted: false }
      }),
      // Accept this answer
      db.answer.update({
        where: { id: answerId },
        data: { isAccepted: true }
      }),
      // Mark question as resolved
      db.question.update({
        where: { id: answer.questionId },
        data: { isResolved: true }
      })
    ]);

    // Notify answer owner
    if (answer.userId !== session.user.id) {
      await createNotification({
        userId: answer.userId,
        title: "Your Answer Was Accepted ✅",
        message: `Your answer was marked as the best answer on: "${answer.question.title}"`,
        link: `/qa/${answer.questionId}`
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ANSWER_ACCEPT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
