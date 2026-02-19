import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminCrudTable, { Column } from "@/components/admin/AdminCrudTable";
import { prisma } from "@/lib/prisma";

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const campuses = await prisma.campus.findMany({ select: { id: true, title: true } });
  const departments = await prisma.department.findMany({ select: { id: true, title: true } });

  const columns: Column[] = [
    { key: "code", label: "Code" },
    { key: "title", label: "Course Title" },
    { 
        key: "department", 
        label: "Department", 
        formatter: "object-title" 
    },
    { 
        key: "_count", 
        label: "Stats", 
        formatter: "multi-badge-count",
        formatterConfig: [
            { label: "Units", field: "units" },
            { label: "Students", field: "users" }
        ]
    }
  ];

  const fields: any[] = [
    { name: "title", label: "Course Title", type: "text", required: true, placeholder: "e.g. BSc Agribusiness" },
    { name: "code", label: "Course Code", type: "text", required: true, placeholder: "e.g. AGR101" },
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "e.g. bsc-agribusiness" },
    { 
        name: "campusId", 
        label: "Campus", 
        type: "select", 
        options: campuses.map((c: any) => ({ label: c.title, value: c.id })) 
    },
    { 
        name: "departmentId", 
        label: "Department", 
        type: "select", 
        options: departments.map((d: any) => ({ label: d.title, value: d.id })) 
    },
    { 
        name: "yearOfStudy", 
        label: "Year limit", 
        type: "select", 
        options: [
            { label: "Year 1", value: "1" },
            { label: "Year 2", value: "2" },
            { label: "Year 3", value: "3" },
            { label: "Year 4", value: "4" },
            { label: "Year 5", value: "5" },
        ] 
    },
    { name: "description", label: "Description", type: "textarea" },
    { name: "imageUrl", label: "Image URL", type: "text" },
  ];

  return (
    <AdminLayout user={session.user}>
      <AdminCrudTable 
        entityName="Course"
        apiEndpoint="/api/courses"
        title="Course Management"
        description="Configure academic courses and degree programs"
        columns={columns}
        fields={fields}
        slugSource="title"
      />
    </AdminLayout>
  );
}
