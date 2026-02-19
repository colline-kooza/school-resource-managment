import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.LECTURER && session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. My Uploads (Total resources uploaded by this lecturer)
    const uploadCount = await db.resource.count({
      where: {
        userId: userId,
      },
    });

    // 2. Pending Approval (status=PENDING)
    const pendingCount = await db.resource.count({
      where: {
        userId: userId,
        status: "PENDING",
      },
    });

    // 3. Approved (status=APPROVED)
    const approvedCount = await db.resource.count({
      where: {
        userId: userId,
        status: "APPROVED",
      },
    });

    // 4. My Quizzes (Total quizzes created by this lecturer)
    const quizCount = await db.quiz.count({
      where: {
        createdById: userId,
      },
    });

    return NextResponse.json({
      uploadCount,
      pendingCount,
      approvedCount,
      quizCount,
    });
  } catch (error) {
    console.error("[LECTURER_DASHBOARD_STATS]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
