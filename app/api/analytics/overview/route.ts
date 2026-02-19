import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { subDays, startOfDay, format } from "date-fns";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Totals
    const [
      totalUsers,
      totalStudents,
      totalLecturers,
      totalResources,
      pendingResources,
      approvedResources,
      totalQuizzes,
      totalQuestions,
      totalAttempts
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "STUDENT" } }),
      db.user.count({ where: { role: "LECTURER" } }),
      db.resource.count(),
      db.resource.count({ where: { status: "PENDING" } }),
      db.resource.count({ where: { status: "APPROVED" } }),
      db.quiz.count(),
      db.quizQuestion.count(),
      db.quizAttempt.count()
    ]);

    // 2. User Registrations by Day (Last 30 Days)
    const thirtyDaysAgo = subDays(startOfDay(new Date()), 30);
    const registrations = await db.user.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    // Grouping registrations by day
    const registrationTrendsMap = new Map();
    // Pre-fill last 30 days with 0
    for (let i = 0; i <= 30; i++) {
        const date = format(subDays(new Date(), i), "MMM dd");
        registrationTrendsMap.set(date, 0);
    }

    registrations.forEach(user => {
        const date = format(user.createdAt, "MMM dd");
        if (registrationTrendsMap.has(date)) {
            registrationTrendsMap.set(date, (registrationTrendsMap.get(date) || 0) + 1);
        }
    });

    const registrationTrends = Array.from(registrationTrendsMap.entries())
        .map(([date, count]) => ({ date, count }))
        .reverse();

    // 3. Resources by Type
    const resourceDistribution = await db.resource.groupBy({
        by: ["type"],
        where: { status: "APPROVED" },
        _count: { _all: true }
    });

    const resourcesByType = resourceDistribution.map(item => ({
        type: item.type,
        count: item._count._all
    }));

    // 4. Quiz Attempts by Quiz (Top 10)
    const quizAttempts = await db.quiz.findMany({
        take: 10,
        select: {
            title: true,
            _count: {
                select: { attempts: true }
            }
        },
        orderBy: {
            attempts: { _count: "desc" }
        }
    });

    const quizAttemptsByQuiz = quizAttempts.map(quiz => ({
        quizTitle: quiz.title.length > 20 ? quiz.title.substring(0, 20) + "..." : quiz.title,
        count: quiz._count.attempts
    }));

    // 5. Top 10 Most Downloaded Resources
    const topDownloads = await db.resource.findMany({
        take: 10,
        where: { status: "APPROVED" },
        select: {
            id: true,
            title: true,
            type: true,
            downloads: true,
            course: { select: { title: true } }
        },
        orderBy: {
            downloads: "desc"
        }
    });

    // 6. Quiz Pass Rates & Statistics
    const quizzesWithStats = await db.quiz.findMany({
        take: 10,
        select: {
            id: true,
            title: true,
            attempts: {
                select: {
                    score: true,
                    passed: true
                }
            }
        }
    });

    const quizPassRates = quizzesWithStats.map(quiz => {
        const attemptsCount = quiz.attempts.length;
        if (attemptsCount === 0) return { title: quiz.title, attempts: 0, passRate: 0, avgScore: 0 };

        const passedCount = quiz.attempts.filter(a => a.passed).length;
        const totalScore = quiz.attempts.reduce((acc, curr) => acc + curr.score, 0);

        return {
            quizId: quiz.id,
            title: quiz.title,
            attempts: attemptsCount,
            passRate: Math.round((passedCount / attemptsCount) * 100),
            avgScore: Math.round(totalScore / attemptsCount)
        };
    }).sort((a, b) => b.attempts - a.attempts);

    return NextResponse.json({
      totals: {
        users: totalUsers,
        students: totalStudents,
        lecturers: totalLecturers,
        resources: totalResources,
        pendingResources,
        approvedResources,
        quizzes: totalQuizzes,
        questions: totalQuestions,
        attempts: totalAttempts
      },
      registrationTrends,
      resourcesByType,
      quizAttemptsByQuiz,
      topDownloads: topDownloads.map(d => ({
        id: d.id,
        title: d.title,
        type: d.type,
        course: d.course.title,
        downloads: d.downloads
      })),
      quizPassRates
    });

  } catch (error) {
    console.error("[ANALYTICS_OVERVIEW_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
