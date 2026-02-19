import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { createBulkNotifications } from "@/lib/notifications";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, content, campusId, isPublic } = await req.json();

        const announcement = await db.announcement.create({
            data: { 
                title, 
                content, 
                campusId: campusId === "all" ? null : campusId, 
                isPublic,
                createdById: session.user.id
            }
        });

        // 2. Notify users (Public = all users, Campus = campus users)
        const userWhere: any = {};
        if (!isPublic && campusId && campusId !== "all") {
            userWhere.campusId = campusId;
        }

        const usersToNotify = await db.user.findMany({
            where: userWhere,
            select: { id: true }
        });

        if (usersToNotify.length > 0) {
            await createBulkNotifications(
                usersToNotify.map((u: { id: string }) => u.id),
                {
                    title: "New Announcement 📢",
                    message: title,
                    link: `/announcements`
                }
            );
        }

        return NextResponse.json(announcement);

    } catch (error) {
        console.error("[ANNOUNCEMENTS_POST]", error);
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

        const announcements = await db.announcement.findMany({
            where,
            include: {
                campus: { select: { title: true } },
                createdBy: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(announcements);
    } catch (error) {
        console.error("[ANNOUNCEMENTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
