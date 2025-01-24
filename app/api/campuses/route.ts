import { db } from '@/prisma/db';
import { NextResponse } from 'next/server'
import React from 'react'

// creating a new record
export async function POST(request:any) {
    try {
        const {title,slug,imageUrl}=await request.json();

        const existingCategory=await db.category.findUnique({
            where:{
                slug,
            }
        });
        if(existingCategory){
            return NextResponse.json({
                data:null,
                message:"Campus already exists"
            },{status:409})
        }

        // use prisma to create the category
        const newCampus=await db.campus.create({
            data:{title,slug,imageUrl}

        })
        console.log(newCampus);
        return NextResponse.json(newCampus,{status:201})

    } catch (error:any) {
        console.log("error while creating campus",error)
        return NextResponse.json({
            message:"Failed to create campus",
            error:error.message
        },{status:500})
        
    }

}

// getting a record
export async function GET(request:any){
    try {
        const campuses=await db.campus.findMany({
            orderBy:{
                createdAt:"desc"
            }
        });
        return NextResponse.json(campuses);
    } catch (error:any) {
        console.log("error while fetching campuses",error)
        return NextResponse.json({
            message:"Failed to fetch campuses",
            error:error.message
        },{status:500})
        
    }
}




