import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'LECTURER' && session.user.role !== 'ADMIN')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      select: { createdById: true }
    });

    if (!quiz) return new NextResponse("Quiz not found", { status: 404 });

    // Auth check: Must be creator or Admin
    if (quiz.createdById !== session.user.id && session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const attempts = await db.quizAttempt.findMany({
      where: { quizId },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, image: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Summary stats
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter(a => a.passed).length;
    const avgScore = totalAttempts > 0 ? attempts.reduce((acc, a) => acc + a.score, 0) / totalAttempts : 0;
    const scores = attempts.map(a => a.score);
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    return NextResponse.json({
      attempts,
      summary: {
        totalAttempts,
        passRate: totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0,
        avgScore,
        highestScore,
        lowestScore
      }
    });

  } catch (error) {
    console.error("[QUIZ_RESULTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
