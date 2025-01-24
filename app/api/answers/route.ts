import { db } from '@/prisma/db';
import { NextResponse } from 'next/server'

// creating a new record
export async function POST(request:any) {
    try {
        const {content,questionId,userId,upVotes,downVotes}=await request.json();
        // use prisma to create the category
        const answer=await db.answer.create({
            data:{content,questionId,userId,upVotes,downVotes}
        })
        // console.log(newCampus);
        return NextResponse.json(answer,{status:201})

    } catch (error:any) {
        console.log("error while creating answer",error)
        return NextResponse.json({
            message:"Failed to create answer",
            error:error.message
        },{status:500})
        
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




