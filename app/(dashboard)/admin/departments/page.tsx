import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminCrudTable, { Column } from "@/components/admin/AdminCrudTable";
import { prisma } from "@/lib/prisma";

export default async function AdminDepartmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const campuses = await prisma.campus.findMany({ select: { id: true, title: true } });

  const columns: Column[] = [
    { key: "title", label: "Department" },
    { 
        key: "campus", 
        label: "Campus", 
        formatter: "object-title" 
    },
    { key: "slug", label: "Slug" },
    { 
        key: "_count", 
        label: "Courses", 
        formatter: "badge-count",
        formatterConfig: { prefix: "Courses", field: "courses" }
    }
  ];

  const fields: any[] = [
    { name: "title", label: "Department Title", type: "text", required: true, placeholder: "e.g. Department of Agriculture" },
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "e.g. dept-agriculture" },
    { 
        name: "campusId", 
        label: "Campus", 
        type: "select", 
        required: true, 
        options: campuses.map((c: any) => ({ label: c.title, value: c.id })) 
    },
    { name: "description", label: "Description", type: "textarea" },
  ];

  return (
    <AdminLayout user={session.user}>
      <AdminCrudTable 
        entityName="Department"
        apiEndpoint="/api/departments"
        title="Department Management"
        description="Manage academic departments across university campuses"
        columns={columns}
        fields={fields}
        slugSource="title"
      />
    </AdminLayout>
  );
}
