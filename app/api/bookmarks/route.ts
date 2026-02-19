import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await db.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        resource: {
          include: {
            campus: { select: { title: true } },
            category: { select: { title: true } },
            course: { select: { title: true } },
            courseUnit: { select: { title: true } },
            _count: { select: { bookmarks: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(bookmarks);

  } catch (error: any) {
    console.error("Bookmarks fetch error:", error);
    return NextResponse.json({
      message: "Failed to fetch bookmarks",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { resourceId } = await request.json();
    if (!resourceId) {
      return NextResponse.json({ message: "Resource ID is required" }, { status: 400 });
    }

    const bookmark = await db.bookmark.create({
      data: {
        userId: session.user.id,
        resourceId: resourceId
      },
      include: {
        resource: true
      }
    });

    return NextResponse.json(bookmark, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Already bookmarked" }, { status: 400 });
    }
    console.error("Bookmark creation error:", error);
    return NextResponse.json({
      message: "Failed to create bookmark",
      error: error.message
    }, { status: 500 });
  }
}
