import React from "react";
export const dynamic = "force-dynamic";
import { columns } from "./columns";
// import DataTable from "@/components/DataTableComponents/DataTable";
import { getData } from "@/lib/getData";
import TableHeader from "@/components/backend/dashboard/Tables/TableHeader";
import DataTable from "@/components/backend/DataTableComponents/DataTable";


export default async function page() {
  const categories = await getData("categories");
  // console.log(products);
  return (
    <div className="p-8">
      <TableHeader
        title="Categories"
        linkTitle="Add Category"
        href="/dashboard/categories/new"
        data={categories}
        model="category"
      />
      <div className="py-8">
        <DataTable data={categories} columns={columns} />
      </div>
    </div>
  );
}
