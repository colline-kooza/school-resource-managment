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

        const { title, slug, location, description, imageUrl } = await req.json();

        const existing = await db.campus.findUnique({
            where: { slug }
        });

        if (existing) {
            return new NextResponse("Campus with this slug already exists", { status: 409 });
        }

        const campus = await db.campus.create({
            data: { title, slug, location, description, imageUrl }
        });

        return NextResponse.json(campus);

    } catch (error) {
        console.error("[CAMPUSES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const campuses = await db.campus.findMany({
            include: {
                _count: {
                    select: { departments: true, users: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(campuses);
    } catch (error) {
        console.error("[CAMPUSES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
