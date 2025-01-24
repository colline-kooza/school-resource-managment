import { db } from '@/prisma/db';
import { NextResponse } from 'next/server'
import React from 'react'

// creating a new record
export async function POST(request:any) {
    try {
        const {title,slug,courseUnit,pdfUrl,description,categoryId,courseId,campusId,userId}=await request.json();
        // use prisma to create the category
        const resource=await db.resource.create({
            data:{title,slug,courseUnit,pdfUrl,description,categoryId,courseId,campusId,userId}
        })
        // console.log(newCampus);
        return NextResponse.json(resource,{status:201})

    } catch (error:any) {
        console.log("error while creating resource",error)
        return NextResponse.json({
            message:"Failed to create resource",
            error:error.message
        },{status:500})
        
    }

}

// getting a record
export async function GET(request:any){
    try {
        const resources=await db.resource.findMany({
            orderBy:{
                createdAt:"desc"
            },include:{
                user:true,
                campus:true,
                category:true,
                course:true
            }
        });
        return NextResponse.json(resources);
    } catch (error:any) {
        console.log("error while fetching resources",error)
        return NextResponse.json({
            message:"Failed to fetch resources",
            error:error.message
        },{status:500})
        
    }
}




