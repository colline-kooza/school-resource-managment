import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { UserRole } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") as UserRole | null;
    const status = searchParams.get("status"); // "active" or "inactive"
    const campusId = searchParams.get("campusId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const where: any = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { studentId: { contains: search, mode: "insensitive" } },
      ]
    };

    if (role && ["STUDENT", "LECTURER", "ADMIN"].includes(role)) {
      where.role = role;
    }

    if (status) {
      where.status = status === "active" ? true : false;
    }

    if (campusId && campusId !== "all") {
      where.campusId = campusId;
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        take: limit,
        skip,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          studentId: true,
          createdAt: true,
          image: true,
          campus: { select: { title: true } },
          course: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
