import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, courseId, code, description } = await req.json();

        const unit = await db.courseUnit.create({
            data: { title, courseId, code, description }
        });

        return NextResponse.json(unit);

    } catch (error) {
        console.error("[COURSE_UNITS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");

        const where: any = {};
        if (courseId && courseId !== "all") where.courseId = courseId;

        const units = await db.courseUnit.findMany({
            where,
            include: {
                course: { select: { title: true, code: true } },
                _count: {
                    select: { resources: true, questions: true, quizzes: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(units);
    } catch (error) {
        console.error("[COURSE_UNITS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
