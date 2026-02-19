import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
    const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, content, campusId, isPublic } = await req.json();

        const announcement = await db.announcement.update({
            where: { id: id },
            data: { 
                title, 
                content, 
                campusId: campusId === "all" ? null : campusId, 
                isPublic 
            }
        });

        return NextResponse.json(announcement);

    } catch (error) {
        console.error("[ANNOUNCEMENT_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
    const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const announcement = await db.announcement.delete({
            where: { id: id }
        });

        return NextResponse.json(announcement);

    } catch (error) {
        console.error("[ANNOUNCEMENT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
