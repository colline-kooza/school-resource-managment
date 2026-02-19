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

        const { title, slug, location, description, imageUrl } = await req.json();

        const campus = await db.campus.update({
            where: { id: id },
            data: { title, slug, location, description, imageUrl }
        });

        return NextResponse.json(campus);

    } catch (error) {
        console.error("[CAMPUS_PATCH]", error);
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

        const campus = await db.campus.delete({
            where: { id: id }
        });

        return NextResponse.json(campus);

    } catch (error) {
        console.error("[CAMPUS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
