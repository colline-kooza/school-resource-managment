import { db } from "@/prisma/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    const userId = searchParams.get("userId");
    const status = searchParams.get("status") || "APPROVED";

    const resources = await db.resource.findMany({
      where: {
        ...(userId ? { userId } : { status: status as any }),
        ...(courseId ? { courseId } : {}),
      },
      include: {
        uploadedBy: {
          select: {
            name: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            title: true,
            code: true,
          },
        },
        courseUnit: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("[RECENT_RESOURCES]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
