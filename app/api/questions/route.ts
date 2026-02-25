import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const courseId = searchParams.get("courseId");
    const courseUnitId = searchParams.get("courseUnitId");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const resolved = searchParams.get("resolved") === "true";

    // Build filter
    let where: any = {};

    if (courseId) where.courseId = courseId;
    if (courseUnitId) where.courseUnitId = courseUnitId;
    if (tag) {
      where.tags = {
        has: tag
      };
    }
    if (resolved) {
      where.isResolved = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build sort
    let orderBy: any = { createdAt: "desc" };

    if (sort === "most-votes") {
      // Net votes = upVotes - downVotes
      // Prisma doesn't support complex arithmetic in orderBy directly without raw SQL or computed fields
      // For now, we sort by upVotes as a proxy, or we'd need to fetch and sort in memory if the dataset is small
      orderBy = { upVotes: "desc" };
    } else if (sort === "unanswered") {
      where.answers = {
        none: {}
      };
    } else if (sort === "resolved") {
      where.isResolved = true;
    }

    const [questions, total] = await Promise.all([
      db.question.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
          _count: {
            select: { answers: true },
          },
          course: {
            select: { title: true }
          },
          courseUnit: {
            select: { title: true }
          },
          answers: {
            take: 3,
            orderBy: { createdAt: "desc" },
            include: {
              user: {
                select: {
                  name: true,
                  firstName: true,
                  lastName: true,
                  image: true,
                }
              }
            }
          }
        },
        orderBy,
        skip,
        take: pageSize,
      }),
      db.question.count({ where }),
    ]);

    return NextResponse.json({
      questions,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[QUESTIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, content, courseId, courseUnitId, tags } = body;

    if (!title || !content) {
      return new NextResponse("Title and content are required", { status: 400 });
    }

    const question = await db.question.create({
      data: {
        title,
        content,
        courseId,
        courseUnitId,
        tags: tags || [],
        userId: session.user.id,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("[QUESTIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
