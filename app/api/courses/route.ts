import { db } from '@/prisma/db';
import { NextResponse } from 'next/server'
import React from 'react'

// creating a new record
export async function POST(request:any) {
    try {
        const {title,slug,imageUrl,description}=await request.json();

        const existingCourse=await db.course.findUnique({
            where:{
                slug,
            }
        });
        if(existingCourse){
            return NextResponse.json({
                data:null,
                message:"Course already exists"
            },{status:409})
        }

        // use prisma to create the category
        const newCourse=await db.course.create({
            data:{title,slug}

        })
        console.log(newCourse);
        return NextResponse.json(newCourse,{status:201})

    } catch (error:any) {
        console.log("error while creating course",error)
        return NextResponse.json({
            message:"Failed to create course",
            error:error.message
        },{status:500})
        
    }

}

// getting a record
export async function GET(request:any){
    try {
        const courses=await db.course.findMany({
            orderBy:{
                createdAt:"desc"
            }
        });
        return NextResponse.json(courses);
    } catch (error:any) {
        console.log("error while fetching courses",error)
        return NextResponse.json({
            message:"Failed to fetch courses",
            error:error.message
        },{status:500})
        
    }
}




