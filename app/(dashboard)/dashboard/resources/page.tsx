import React from "react";
import { columns } from "./columns";
// import DataTable from "@/components/DataTableComponents/DataTable";
import { getData } from "@/lib/getData";
import TableHeader from "@/components/backend/dashboard/Tables/TableHeader";
import DataTable from "@/components/backend/DataTableComponents/DataTable";


export default async function page() {
  try {
    const data = await getData('your-endpoint');
    // Handle successful data
  } catch (error) {
    // Handle error appropriately
    console.error('Failed to fetch data:', error);
  }
  const resources = await getData("resources");
  // console.log(products);
  return (
    <div className="p-8">
      <TableHeader
        title="resources"
        linkTitle="Add resource"
        href="/dashboard/resources/new"
        data={resources}
        model="resource"
      />
      <div className="py-8">
        <DataTable data={resources} columns={columns} />
      </div>
    </div>
  );
}
