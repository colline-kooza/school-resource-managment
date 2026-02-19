import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminCrudTable, { Column } from "@/components/admin/AdminCrudTable";

export default async function AdminCampusesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const columns: Column[] = [
    { key: "title", label: "Campus Name" },
    { key: "slug", label: "Slug" },
    { key: "location", label: "Location" },
    { 
        key: "_count", 
        label: "Stats", 
        formatter: "multi-badge-count",
        formatterConfig: [
            { label: "Depts", field: "departments" },
            { label: "Users", field: "users" }
        ]
    }
  ];

  const fields: any[] = [
    { name: "title", label: "Campus Title", type: "text", required: true, placeholder: "e.g. Arapai Campus" },
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "e.g. arapai-campus" },
    { name: "location", label: "Location", type: "text", placeholder: "e.g. Soroti, Uganda" },
    { name: "imageUrl", label: "Image URL", type: "text", placeholder: "URL for campus banner" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  return (
    <AdminLayout user={session.user}>
      <AdminCrudTable 
        entityName="Campus"
        apiEndpoint="/api/campuses"
        title="Campus Management"
        description="Oversee university campuses and branch locations"
        columns={columns}
        fields={fields}
        slugSource="title"
      />
    </AdminLayout>
  );
}
