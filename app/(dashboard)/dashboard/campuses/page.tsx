import React from "react";
export const dynamic = "force-dynamic";
import { columns } from "./columns";
// import DataTable from "@/components/DataTableComponents/DataTable";
import { getData } from "@/lib/getData";
import TableHeader from "@/components/backend/dashboard/Tables/TableHeader";
import DataTable from "@/components/backend/DataTableComponents/DataTable";


export default async function page() {
  const campuses = await getData("campuses");
  // console.log(products);
  return (
    <div className="p-8">
      <TableHeader
        title="campuses"
        linkTitle="Add Campus"
        href="/dashboard/campuses/new"
        data={campuses}
        model="campus"
      />
      <div className="py-8">
        <DataTable data={campuses} columns={columns} />
      </div>
    </div>
  );
}
