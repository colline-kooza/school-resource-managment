import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/auth';
import { ResourceStatus } from '@prisma/client';
import { createNotification } from '@/lib/notifications';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { rejectionNote } = body;

    const resource = await db.resource.findUnique({
      where: { id: id }
    });

    if (!resource) {
      return NextResponse.json({ message: "Resource not found" }, { status: 404 });
    }

    const updatedResource = await db.resource.update({
      where: { id: id },
      data: { 
        status: ResourceStatus.REJECTED,
        rejectionNote: rejectionNote
      }
    });

    // Create notification for uploader
    if (resource.userId) {
      await createNotification({
        userId: resource.userId,
        title: "Resource Rejected ❌",
        message: `Your resource "${resource.title}" was rejected: ${rejectionNote || "No reason provided."}`,
        link: `/lecturer/resources`
      });
    }

    return NextResponse.json(updatedResource);

  } catch (error: any) {
    return NextResponse.json({
      message: "Failed to reject resource",
      error: error.message
    }, { status: 500 });
  }
}
