import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Total Users
    const userCount = await db.user.count();

    // 2. Pending Resources
    const pendingCount = await db.resource.count({
      where: { status: "PENDING" },
    });

    // 3. Total APPROVED Resources
    const resourceCount = await db.resource.count({
      where: { status: "APPROVED" },
    });

    // 4. Total Quizzes
    const quizCount = await db.quiz.count();

    // 5. Total Questions
    const questionCount = await db.question.count();

    return NextResponse.json({
      userCount,
      pendingCount,
      resourceCount,
      quizCount,
      questionCount,
    });
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_STATS]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
