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

        const { title, slug, campusId, description } = await req.json();

        const department = await db.department.update({
            where: { id: id },
            data: { title, slug, campusId, description }
        });

        return NextResponse.json(department);

    } catch (error) {
        console.error("[DEPARTMENT_PATCH]", error);
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

        const department = await db.department.delete({
            where: { id: id }
        });

        return NextResponse.json(department);

    } catch (error) {
        console.error("[DEPARTMENT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
