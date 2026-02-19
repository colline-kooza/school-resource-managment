import CreateResourceForm from '@/components/backend/forms/CreateResourceForm'
export const dynamic = "force-dynamic";
import { authOptions } from '@/config/auth';
import { getData } from '@/lib/getData';
import { getServerSession } from 'next-auth';
import React from 'react'

export default async function page() {
   const courseData=await getData("courses");
   const categoryData=await getData("categories");
   const campusData=await getData("campuses");
   const session = await getServerSession(authOptions);
   const user =session?.user
    const courses= courseData.map((item:any,i:any)=>{
      return(
        {
          title:item.title,
          id:item.id
        }
      )
    })
    const categories= categoryData.map((item:any,i:any)=>{
      return(
        {
          title:item.title,
          id:item.id
        }
      )
    })
    const campuses= campusData.map((item:any,i:any)=>{
      return(
        {
          title:item.title,
          id:item.id
        }
      )
    })
  return (
    <div>
        <CreateResourceForm user={user} categories={categories} courses={courses} campuses={campuses}/>
    </div>
  )
}
