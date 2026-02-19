import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminCrudTable, { Column } from "@/components/admin/AdminCrudTable";
import { prisma } from "@/lib/prisma";

export default async function AdminCourseUnitsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const courses = await prisma.course.findMany({ select: { id: true, title: true, code: true } });

  const columns: Column[] = [
    { key: "code", label: "Unit Code" },
    { key: "title", label: "Unit Title" },
    { 
        key: "course", 
        label: "Course", 
        formatter: "code-title"
    },
    { 
        key: "_count", 
        label: "Stats", 
        formatter: "multi-badge-count",
        formatterConfig: [
            { label: "Res", field: "resources" },
            { label: "Quizzes", field: "quizzes" }
        ]
    }
  ];

  const fields: any[] = [
    { name: "title", label: "Unit Title", type: "text", required: true, placeholder: "e.g. Crop Production" },
    { name: "code", label: "Unit Code", type: "text", placeholder: "e.g. AGR1101" },
    { 
        name: "courseId", 
        label: "Parent Course", 
        type: "select", 
        required: true, 
        options: courses.map((c: any) => ({ label: `${c.code} - ${c.title}`, value: c.id })) 
    },
    { name: "description", label: "Description", type: "textarea" },
  ];

  return (
    <AdminLayout user={session.user}>
      <AdminCrudTable 
        entityName="CourseUnit"
        apiEndpoint="/api/course-units"
        title="Course Unit Management"
        description="Manage individual units and modules within courses"
        columns={columns}
        fields={fields}
      />
    </AdminLayout>
  );
}
