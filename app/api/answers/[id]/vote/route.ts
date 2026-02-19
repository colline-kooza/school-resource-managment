import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: answerId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { direction } = await req.json(); // "UP" or "DOWN"

    if (direction !== "UP" && direction !== "DOWN") {
      return new NextResponse("Invalid direction", { status: 400 });
    }

    const answer = await db.answer.findUnique({
      where: { id: answerId },
      select: { userId: true, upVotes: true, downVotes: true }
    });

    if (!answer) {
      return new NextResponse("Answer not found", { status: 404 });
    }

    const existingVote = await db.answerVote.findUnique({
      where: {
        answerId_userId: {
          answerId,
          userId: session.user.id
        }
      }
    });

    let upVoteChange = 0;
    let downVoteChange = 0;

    if (!existingVote) {
      await db.answerVote.create({
        data: { answerId, userId: session.user.id, direction }
      });
      if (direction === "UP") upVoteChange = 1;
      else downVoteChange = 1;
    } else if (existingVote.direction === direction) {
      await db.answerVote.delete({
        where: { id: existingVote.id }
      });
      if (direction === "UP") upVoteChange = -1;
      else downVoteChange = -1;
    } else {
      await db.answerVote.update({
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

    const updatedAnswer = await db.answer.update({
      where: { id: answerId },
      data: {
        upVotes: { increment: upVoteChange },
        downVotes: { increment: downVoteChange }
      }
    });

    return NextResponse.json(updatedAnswer);
  } catch (error) {
    console.error("[ANSWER_VOTE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
