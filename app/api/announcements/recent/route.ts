import { db } from "@/prisma/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campusId = searchParams.get("campusId");

    const announcements = await db.announcement.findMany({
      where: {
        OR: [
          { isPublic: true },
          ...(campusId ? [{ campusId }] : []),
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("[RECENT_ANNOUNCEMENTS]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
