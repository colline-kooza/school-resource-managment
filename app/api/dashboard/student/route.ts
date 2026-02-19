import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const courseId = session.user.courseId;

    // 1. Resources Available (APPROVED in user's course)
    const resourceCount = courseId ? await db.resource.count({
      where: {
        courseId: courseId,
        status: "APPROVED",
      },
    }) : 0;

    // 2. My Questions (posted by the user)
    const questionCount = await db.question.count({
      where: {
        userId: userId,
      },
    });

    // 3. My Bookmarks (saved resources)
    const bookmarkCount = await db.bookmark.count({
      where: {
        userId: userId,
      },
    });

    // 4. Quizzes Taken (quiz attempts by the user)
    const attemptCount = await db.quizAttempt.count({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json({
      resourceCount,
      questionCount,
      bookmarkCount,
      attemptCount,
    });
  } catch (error) {
    console.error("[STUDENT_DASHBOARD_STATS]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
