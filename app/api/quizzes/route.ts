import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    // Filters
    const courseId = searchParams.get("courseId");
    const courseUnitId = searchParams.get("courseUnitId");
    const difficulty = searchParams.get("difficulty"); // EASY, MEDIUM, HARD
    const search = searchParams.get("search");

    let where: any = {};

    // Logic: 
    // 1. If user is logged in as LECTURER or ADMIN, they see their OWN quizzes regardless of status.
    // 2. Students and everyone else only see published quizzes.
    if (session?.user && (session.user.role === 'LECTURER' || session.user.role === 'ADMIN')) {
      where.OR = [
        { isPublished: true },
        { createdById: session.user.id }
      ];
    } else {
      where.isPublished = true;
    }

    if (courseId) where.courseId = courseId;
    if (courseUnitId) where.courseUnitId = courseUnitId;
    if (difficulty) where.difficulty = difficulty.toUpperCase();
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [quizzes, total] = await Promise.all([
      db.quiz.findMany({
        where,
        include: {
          courseUnit: { select: { title: true } },
          _count: { select: { questions: true } },
          attempts: session?.user?.id ? {
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { score: true, passed: true }
          } : false
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize
      }),
      db.quiz.count({ where })
    ]);

    return NextResponse.json({
      quizzes,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });

  } catch (error) {
    console.error("[QUIZZES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'LECTURER' && session.user.role !== 'ADMIN')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { 
      title, 
      description, 
      difficulty, 
      timeLimit, 
      passMark, 
      courseId, 
      courseUnitId,
      questions 
    } = body;

    if (!title || !questions || questions.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const quiz = await db.quiz.create({
      data: {
        title,
        description,
        difficulty: difficulty || "MEDIUM",
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        passMark: passMark ? parseFloat(passMark) : 50,
        courseId,
        courseUnitId,
        createdById: session.user.id,
        isPublished: false, // Default to draft
        questions: {
          create: questions.map((q: any) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            points: q.points || 1
          }))
        }
      }
    });

    return NextResponse.json(quiz);

  } catch (error) {
    console.error("[QUIZZES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
