import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db.bookmark.delete({
      where: {
        userId_resourceId: {
          userId: session.user.id,
          resourceId: resourceId
        }
      }
    });

    return NextResponse.json({ message: "Bookmark removed" });

  } catch (error: any) {
    console.error("Bookmark deletion error:", error);
    return NextResponse.json({
      message: "Failed to remove bookmark",
      error: error.message
    }, { status: 500 });
  }
}
