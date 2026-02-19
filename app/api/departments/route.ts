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

        const { title, slug, campusId, description } = await req.json();

        const existing = await db.department.findUnique({
            where: { slug }
        });

        if (existing) {
            return new NextResponse("Department with this slug already exists", { status: 409 });
        }

        const department = await db.department.create({
            data: { title, slug, campusId, description }
        });

        return NextResponse.json(department);

    } catch (error) {
        console.error("[DEPARTMENTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const campusId = searchParams.get("campusId");

        const where: any = {};
        if (campusId && campusId !== "all") {
            where.campusId = campusId;
        }

        const departments = await db.department.findMany({
            where,
            include: {
                campus: { select: { title: true } },
                _count: {
                    select: { courses: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(departments);
    } catch (error) {
        console.error("[DEPARTMENTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
