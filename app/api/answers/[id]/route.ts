import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Increment upVotes for a specific answer
export async function PATCH(request: NextRequest,{params}: {params: Promise<{ id: string }>}) {
    try {
        const { id } =await params; // Access `id` directly
        const { answerId } = await request.json(); // Get the answer ID from the request body
        
        // Update the upVotes count for the specific answer
        const updatedAnswer = await db.answer.update({
            where: { id },
            data: { upVotes: { increment: 1 } }, // Increment upVotes by 1
        });
        revalidatePath
        return NextResponse.json(updatedAnswer, { status: 200 });
    } catch (error: any) {
        console.log("Error while updating upVotes", error);
        return NextResponse.json({
            message: "Failed to update upVotes",
            error: error.message,
        }, { status: 500 });
    }
}
