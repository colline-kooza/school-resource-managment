import { db } from '@/prisma/db';
import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

// creating a new record
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { content, questionId } = await request.json();

        if (!content || !questionId) {
            return NextResponse.json({ message: "Content and Question ID are required" }, { status: 400 });
        }

        const answer = await db.answer.create({
            data: {
                content,
                questionId,
                userId: session.user.id,
                upVotes: 0,
                downVotes: 0
            }
        });

        return NextResponse.json(answer, { status: 201 });

    } catch (error: any) {
        console.error("error while creating answer", error);
        return NextResponse.json({
            message: "Failed to create answer",
            error: error.message
        }, { status: 500 });
    }
}

// getting a record
export async function GET(request:any){
    try {
        const answers=await db.answer.findMany({
            orderBy:{
                upVotes:"desc"
            },include:{
                user:true,
                question:true
            }
        });
        return NextResponse.json(answers);
    } catch (error:any) {
        console.log("error while fetching answers",error)
        return NextResponse.json({
            message:"Failed to fetch answers",
            error:error.message
        },{status:500})
        
    }
}




