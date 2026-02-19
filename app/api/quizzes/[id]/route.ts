import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const quiz = await db.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
        creator: {
          select: { firstName: true, lastName: true, image: true }
        },
        courseUnit: { select: { title: true } },
        _count: { select: { attempts: true } }
      }
    });

    if (!quiz) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Auth check for sensitive data
    const isOwner = session.user.id === quiz.createdById;
    const isAdmin = session.user.role === 'ADMIN';

    // If not owner/admin, strip sensitive fields from questions
    if (!isOwner && !isAdmin) {
      quiz.questions = quiz.questions.map((q: any) => {
        const { correctAnswer, explanation, ...rest } = q;
        return rest;
      }) as any;
    }

    // Attempt history for current user
    const lastAttempt = await db.quizAttempt.findFirst({
      where: { quizId: id, userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { score: true, passed: true, createdAt: true }
    });

    return NextResponse.json({ ...quiz, lastAttempt });

  } catch (error) {
    console.error("[QUIZ_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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
    const body = await req.json();

    const existingQuiz = await db.quiz.findUnique({ where: { id } });
    if (!existingQuiz) return new NextResponse("Not Found", { status: 404 });

    // Auth check
    if (existingQuiz.createdById !== session.user.id && session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { questions, ...updateData } = body;

    const quiz = await db.quiz.update({
      where: { id },
      data: {
        ...updateData,
        // Replace questions if provided
        ...(questions ? {
          questions: {
            deleteMany: {},
            create: questions.map((q: any) => ({
              questionText: q.questionText,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              points: q.points || 1
            }))
          }
        } : {})
      }
    });

    return NextResponse.json(quiz);

  } catch (error) {
    console.error("[QUIZ_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'LECTURER' && session.user.role !== 'ADMIN')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const existingQuiz = await db.quiz.findUnique({ where: { id } });
    if (!existingQuiz) return new NextResponse("Not Found", { status: 404 });

    // Auth check
    if (existingQuiz.createdById !== session.user.id && session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await db.quiz.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("[QUIZ_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
