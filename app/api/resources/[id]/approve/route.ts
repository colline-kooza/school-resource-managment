import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/auth';
import { ResourceStatus } from '@prisma/client';
import { createNotification, createBulkNotifications } from '@/lib/notifications';

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

    const resource = await db.resource.findUnique({
      where: { id: id }
    });

    if (!resource) {
      return NextResponse.json({ message: "Resource not found" }, { status: 404 });
    }

    const updatedResource = await db.resource.update({
      where: { id: id },
      data: { status: ResourceStatus.APPROVED }
    });

    // 4. Create notification for uploader
    if (resource.userId) {
      await createNotification({
        userId: resource.userId,
        title: "Resource Approved! 🎉",
        message: `Your resource "${resource.title}" has been approved and is now visible to students.`,
        link: `/resources/${resource.id}`
      });
    }

    // 5. Create bulk notifications for students in this course
    const students = await db.user.findMany({
      where: { 
        courseId: resource.courseId,
        role: "STUDENT",
        id: { not: resource.userId || undefined } // Don't notify the uploader twice
      },
      select: { id: true }
    });

    if (students.length > 0) {
      await createBulkNotifications(
        students.map(s => s.id),
        {
          title: "New Resource Available 📚",
          message: `A new resource has been added to your course: "${resource.title}"`,
          link: `/resources/${resource.id}`
        }
      );
    }

    return NextResponse.json(updatedResource);

  } catch (error: any) {
    return NextResponse.json({
      message: "Failed to approve resource",
      error: error.message
    }, { status: 500 });
  }
}
