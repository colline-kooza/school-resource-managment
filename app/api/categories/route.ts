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

        const { title, slug, iconUrl } = await req.json();

        const existing = await db.category.findUnique({
            where: { slug }
        });

        if (existing) {
            return new NextResponse("Category with this slug already exists", { status: 409 });
        }

        const category = await db.category.create({
            data: { title, slug, iconUrl }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.error("[CATEGORIES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const categories = await db.category.findMany({
            include: {
                _count: {
                    select: { resources: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("[CATEGORIES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
