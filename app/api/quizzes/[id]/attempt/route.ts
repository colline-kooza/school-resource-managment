import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

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

    const quizId = id;
    const { answers, timeTaken } = await req.json(); // answers: { questionId: selectedOption }

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true }
    });

    if (!quiz) {
      return new NextResponse("Quiz not found", { status: 404 });
    }

    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach(q => {
      totalPoints += q.points;
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
        earnedPoints += q.points;
      }
    });

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = score >= quiz.passMark;

    const attempt = await db.quizAttempt.create({
      data: {
        quizId,
        userId: session.user.id,
        score,
        passed,
        answers,
        timeTaken: timeTaken || 0
      }
    });

    return NextResponse.json(attempt);

  } catch (error) {
    console.error("[QUIZ_ATTEMPT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
