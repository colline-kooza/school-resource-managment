import { db } from '@/prisma/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updatedResource = await db.resource.update({
      where: { id: id },
      data: { downloads: { increment: 1 } }
    });

    return NextResponse.json(updatedResource);

  } catch (error: any) {
    return NextResponse.json({
      message: "Failed to increment downloads",
      error: error.message
    }, { status: 500 });
  }
}
