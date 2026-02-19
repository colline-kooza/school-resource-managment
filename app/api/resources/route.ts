import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/auth';
import { ResourceStatus, ResourceType } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
        // GET resources remains public, but we handle the session safely
    }
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Filters
    const campusId = searchParams.get('campusId');
    const courseId = searchParams.get('courseId');
    const courseUnitId = searchParams.get('courseUnitId');
    const type = searchParams.get('type') as ResourceType | null;
    const categoryId = searchParams.get('categoryId');
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const semester = searchParams.get('semester');
    const search = searchParams.get('search');
    const status = searchParams.get('status') as ResourceStatus | null;

    // Build Where Clause
    let where: any = {
      // By default, only show APPROVED resources to students/public
      status: ResourceStatus.APPROVED,
    };

    // If Admin or Lecturer, they might want to see PENDING/REJECTED for specific reasons
    if (status && (session?.user?.role === 'ADMIN' || session?.user?.role === 'LECTURER')) {
      where.status = status;
    }

    if (campusId) where.campusId = campusId;
    if (courseId) where.courseId = courseId;
    if (courseUnitId) where.courseUnitId = courseUnitId;
    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (year) where.year = year;
    if (semester) where.semester = semester;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Special case for Lecturers viewing their own resources
    if (searchParams.get('mine') === 'true' && session?.user?.id) {
      where.userId = session.user.id;
      delete where.status; // Show all statuses when viewing "mine"
    }

    const [resources, total] = await Promise.all([
      db.resource.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      db.resource.count({ where })
    ]);

    return NextResponse.json({
      resources,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error("Resource fetch error:", error);
    return NextResponse.json({
      message: "Failed to fetch resources",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'LECTURER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, slug, description, type, fileUrl, thumbnailUrl, 
      year, semester, categoryId, courseId, courseUnitId, campusId 
    } = body;

    const resource = await db.resource.create({
      data: {
        title,
        slug,
        description,
        type,
        fileUrl,
        thumbnailUrl,
        year: year ? parseInt(year) : null,
        semester,
        categoryId,
        courseId,
        courseUnitId,
        campusId,
        userId: session.user.id,
        status: ResourceStatus.PENDING, // Always start as pending
      },
    });

    return NextResponse.json(resource, { status: 201 });

  } catch (error: any) {
    console.error("Resource creation error:", error);
    return NextResponse.json({
      message: "Failed to create resource",
      error: error.message
    }, { status: 500 });
  }
}
