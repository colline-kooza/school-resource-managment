import RegisterForm from "@/components/frontend/RegisterForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function page() {
  const campusData=await getData("campuses");
  const courseData=await getData("courses");
  const campus= campusData.map((item:any,i:any)=>{
    return(
      {
        title:item.title,
        id:item.id
      }
    )
  })

  const course= courseData.map((item:any,i:any)=>{
    return(
      {
        title:item.title,
        id:item.id
      }
    )
  })
  return (
    <section>
      <div className="md:container px-4 md:px-0">
        <div className="border-gray-200 md:mt-8 dark:border-gray-700 max-w-xl mx-auto border my-3 shadow rounded-md ">
          <RegisterForm course={course} campus={campus}/>
        </div>
      </div>
    </section>
  );
}
