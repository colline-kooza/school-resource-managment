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

        const { title, code, slug, campusId, departmentId, yearOfStudy, description, imageUrl } = await req.json();

        const existing = await db.course.findUnique({
            where: { slug }
        });

        if (existing) {
            return new NextResponse("Course with this slug already exists", { status: 409 });
        }

        const course = await db.course.create({
            data: { title, code, slug, campusId, departmentId, yearOfStudy, description, imageUrl }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.error("[COURSES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const departmentId = searchParams.get("departmentId");
        const campusId = searchParams.get("campusId");

        const where: any = {};
        if (departmentId && departmentId !== "all") where.departmentId = departmentId;
        if (campusId && campusId !== "all") where.campusId = campusId;

        const courses = await db.course.findMany({
            where,
            include: {
                campus: { select: { title: true } },
                department: { select: { title: true } },
                _count: {
                    select: { units: true, users: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error("[COURSES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
