import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment views asynchronously
    db.question.update({
      where: { id },
      data: { views: { increment: 1 } }
    }).catch((err: any) => console.error("Failed to increment views:", err));

    const question = await db.question.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            image: true,
            role: true,
          },
        },
        course: { select: { title: true } },
        courseUnit: { select: { title: true } },
        answers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                image: true,
                role: true,
              },
            },
          },
          orderBy: [
            { isAccepted: "desc" },
            { upVotes: "desc" },
          ],
        },
        _count: {
          select: { answers: true }
        }
      },
    });

    if (!question) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("[QUESTION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content, tags, isResolved } = body;

    const existingQuestion = await db.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Authorization: Owner or Admin
    const isOwner = existingQuestion.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";
    const isLecturer = session.user.role === "LECTURER";

    if (!isOwner && !isAdmin && !isLecturer) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const question = await db.question.update({
      where: { id },
      data: {
        title,
        content,
        tags,
        isResolved,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("[QUESTION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const existingQuestion = await db.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Role check: Only Owner, Lecturer, or Admin can delete
    const isOwner = existingQuestion.userId === session.user.id;
    const isModerator = session.user.role === "ADMIN" || session.user.role === "LECTURER";

    if (!isOwner && !isModerator) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await db.question.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[QUESTION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
