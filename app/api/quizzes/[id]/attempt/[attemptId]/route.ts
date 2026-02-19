import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string, attemptId: string }> }
) {
  try {
    const { id: quizId, attemptId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attempt = await db.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: true // Correct answers ARE included here for review
          }
        }
      }
    });

    if (!attempt) {
      return new NextResponse("Attempt not found", { status: 404 });
    }

    // Auth check: Own attempt OR Lecturer/Admin
    const isOwner = attempt.userId === session.user.id;
    const isSpecialist = session.user.role === "ADMIN" || session.user.role === "LECTURER";

    if (!isOwner && !isSpecialist) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(attempt);

  } catch (error) {
    console.error("[QUIZ_ATTEMPT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
