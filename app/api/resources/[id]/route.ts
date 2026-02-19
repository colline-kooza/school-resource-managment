import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/auth';
import { ResourceStatus } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resource = await db.resource.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { firstName: true, lastName: true, role: true, image: true }
        },
        campus: { select: { title: true } },
        category: { select: { title: true } },
        course: { select: { title: true } },
        courseUnit: { select: { title: true } },
        _count: { select: { bookmarks: true } }
      },
    });

    if (!resource) {
      return NextResponse.json({ message: "Resource not found" }, { status: 404 });
    }

    // Increment view count asynchronously (fire and forget)
    db.resource.update({
      where: { id },
      data: { views: { increment: 1 } }
    }).catch((err: any) => console.error("Error incrementing views:", err));

    return NextResponse.json(resource);

  } catch (error: any) {
    return NextResponse.json({
      message: "Failed to fetch resource",
      error: error.message
    }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resource = await db.resource.findUnique({
      where: { id }
    });

    if (!resource) {
      return NextResponse.json({ message: "Resource not found" }, { status: 404 });
    }

    // Only owner or admin can edit
    if (resource.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const updatedResource = await db.resource.update({
      where: { id },
      data: {
        ...body,
        // If it was rejected, editing it might set it back to pending for re-approval
        status: resource.status === ResourceStatus.REJECTED ? ResourceStatus.PENDING : resource.status
      }
    });

    return NextResponse.json(updatedResource);

  } catch (error: any) {
    return NextResponse.json({
      message: "Failed to update resource",
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resource = await db.resource.findUnique({
      where: { id }
    });

    if (!resource) {
      return NextResponse.json({ message: "Resource not found" }, { status: 404 });
    }

    // Only owner or admin can delete
    if (resource.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await db.resource.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Resource deleted successfully" });

  } catch (error: any) {
    return NextResponse.json({
      message: "Failed to delete resource",
      error: error.message
    }, { status: 500 });
  }
}
