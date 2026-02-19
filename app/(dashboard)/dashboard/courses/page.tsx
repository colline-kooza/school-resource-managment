import React from "react";
export const dynamic = "force-dynamic";
import { columns } from "./columns";
// import DataTable from "@/components/DataTableComponents/DataTable";
import { getData } from "@/lib/getData";
import TableHeader from "@/components/backend/dashboard/Tables/TableHeader";
import DataTable from "@/components/backend/DataTableComponents/DataTable";


export default async function page() {
  const courses = await getData("courses");
  // console.log(products);
  return (
    <div className="p-8">
      <TableHeader
        title="courses"
        linkTitle="Add course"
        href="/dashboard/courses/new"
        data={courses}
        model="course"
      />
      <div className="py-8">
        <DataTable data={courses} columns={columns} />
      </div>
    </div>
  );
}
