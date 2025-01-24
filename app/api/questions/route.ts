import { db } from '@/prisma/db';
import { NextResponse } from 'next/server'

// creating a new record
export async function POST(request:any) {
    try {
        const {title,courseUnit,content,stars,course,courseId,userId}=await request.json();
        // use prisma to create the category
        const question=await db.question.create({
            data:{title,courseUnit,content,stars,course,courseId,userId}
        })
        // console.log(newCampus);
        return NextResponse.json(question,{status:201})

    } catch (error:any) {
        console.log("error while creating question",error)
        return NextResponse.json({
            message:"Failed to create question",
            error:error.message
        },{status:500})
        
    }

}

// getting a record
export async function GET(request:any){
    try {
        const questions=await db.question.findMany({
            orderBy:{
                createdAt:"desc"
            },include:{
                user:true,
                course:true,
                answers:true
            }
        });
        return NextResponse.json(questions);
    } catch (error:any) {
        console.log("error while fetching questions",error)
        return NextResponse.json({
            message:"Failed to fetch questions",
            error:error.message
        },{status:500})
        
    }
}




