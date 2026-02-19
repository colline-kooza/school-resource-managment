import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { direction } = await req.json(); // "UP" or "DOWN"

    if (direction !== "UP" && direction !== "DOWN") {
      return new NextResponse("Invalid direction", { status: 400 });
    }

    const question = await db.question.findUnique({
      where: { id: questionId },
      select: { userId: true, upVotes: true, downVotes: true }
    });

    if (!question) {
      return new NextResponse("Question not found", { status: 404 });
    }

    const existingVote = await db.questionVote.findUnique({
      where: {
        questionId_userId: {
          questionId,
          userId: session.user.id
        }
      }
    });

    let upVoteChange = 0;
    let downVoteChange = 0;

    if (!existingVote) {
      // New vote
      await db.questionVote.create({
        data: { questionId, userId: session.user.id, direction }
      });
      if (direction === "UP") upVoteChange = 1;
      else downVoteChange = 1;
    } else if (existingVote.direction === direction) {
      // Toggle off (remove vote)
      await db.questionVote.delete({
        where: { id: existingVote.id }
      });
      if (direction === "UP") upVoteChange = -1;
      else downVoteChange = -1;
    } else {
      // Change direction
      await db.questionVote.update({
        where: { id: existingVote.id },
        data: { direction }
      });
      if (direction === "UP") {
        upVoteChange = 1;
        downVoteChange = -1;
      } else {
        upVoteChange = -1;
        downVoteChange = 1;
      }
    }

    // Update the question counts atomically
    const updatedQuestion = await db.question.update({
      where: { id: questionId },
      data: {
        upVotes: { increment: upVoteChange },
        downVotes: { increment: downVoteChange }
      }
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("[QUESTION_VOTE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
