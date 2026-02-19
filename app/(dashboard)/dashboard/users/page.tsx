import React from "react";
export const dynamic = "force-dynamic";
import { columns } from "./columns";
// import DataTable from "@/components/DataTableComponents/DataTable";
import { getData } from "@/lib/getData";
import TableHeader from "@/components/backend/dashboard/Tables/TableHeader";
import DataTable from "@/components/backend/DataTableComponents/DataTable";


export default async function page() {
  const usersData = await getData("users");
  const users = Array.isArray(usersData) ? usersData : (usersData.users || []);
  // console.log(products);
  return (
    <div className="p-8">
      <TableHeader
        title="users"
        linkTitle="Add user"
        href="/register"
        data={users}
        model="user"
      />
      <div className="py-8">
        <DataTable data={users} columns={columns} />
      </div>
    </div>
  );
}
