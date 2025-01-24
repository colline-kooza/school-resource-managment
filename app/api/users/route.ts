import { db } from '@/prisma/db';
import { NextResponse } from 'next/server'
import React from 'react'



// getting a record
export async function GET(request:any){
    try {
        const courses=await db.user.findMany({
            orderBy:{
                createdAt:"desc"
            },
            include:{
                campus:true,
                course:true
            }
        });
        return NextResponse.json(courses);
    } catch (error:any) {
        console.log("error while fetching users",error)
        return NextResponse.json({
            message:"Failed to fetch users",
            error:error.message
        },{status:500})
        
    }
}




