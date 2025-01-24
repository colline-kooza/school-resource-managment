import { db } from '@/prisma/db';
import { NextResponse } from 'next/server'
import React from 'react'

// creating a new record
export async function POST(request:any) {
    try {
        const {title,slug}=await request.json();

        const existingCategory=await db.category.findUnique({
            where:{
                slug,
            }
        });
        if(existingCategory){
            return NextResponse.json({
                data:null,
                message:"Category already exists"
            },{status:409})
        }

        // use prisma to create the category
        const newCampus=await db.category.create({
            data:{title,slug}

        })
        console.log(newCampus);
        return NextResponse.json(newCampus,{status:201})

    } catch (error:any) {
        console.log("error while creating category",error)
        return NextResponse.json({
            message:"Failed to create category",
            error:error.message
        },{status:500})
        
    }

}

// getting a record
export async function GET(request:any){
    try {
        const categories=await db.category.findMany({
            orderBy:{
                createdAt:"desc"
            }
        });
        return NextResponse.json(categories);
    } catch (error:any) {
        console.log("error while fetching categories",error)
        return NextResponse.json({
            message:"Failed to fetch categories",
            error:error.message
        },{status:500})
        
    }
}




