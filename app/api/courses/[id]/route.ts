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

        const { title, code, slug, campusId, departmentId, yearOfStudy, description, imageUrl } = await req.json();

        const course = await db.course.update({
            where: { id: id },
            data: { title, code, slug, campusId, departmentId, yearOfStudy, description, imageUrl }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.error("[COURSE_PATCH]", error);
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

        const course = await db.course.delete({
            where: { id: id }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.error("[COURSE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
