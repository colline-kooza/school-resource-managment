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

        const { title, courseId, code, description } = await req.json();

        const unit = await db.courseUnit.update({
            where: { id: id },
            data: { title, courseId, code, description }
        });

        return NextResponse.json(unit);

    } catch (error) {
        console.error("[COURSE_UNIT_PATCH]", error);
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

        const unit = await db.courseUnit.delete({
            where: { id: id }
        });

        return NextResponse.json(unit);

    } catch (error) {
        console.error("[COURSE_UNIT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
