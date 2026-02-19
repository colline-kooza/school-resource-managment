import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminCrudTable, { Column } from "@/components/admin/AdminCrudTable";
import { prisma } from "@/lib/prisma";

export default async function AdminAnnouncementsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const campuses = await prisma.campus.findMany({ select: { id: true, title: true } });

  const columns: Column[] = [
    { key: "title", label: "Announcement Title" },
    { 
        key: "campus", 
        label: "Target", 
        formatter: "announcement-target"
    },
    { 
        key: "createdBy", 
        label: "By", 
        formatter: "object-name"
    }
  ];

  const fields: any[] = [
    { name: "title", label: "Title", type: "text", required: true, placeholder: "Announcement heading" },
    { name: "content", label: "Content", type: "textarea", required: true, placeholder: "Full message details..." },
    { 
        name: "campusId", 
        label: "Campus (Optional)", 
        type: "select", 
        options: [
            { label: "Platform-wide (All Campuses)", value: "all" },
            ...campuses.map((c: any) => ({ label: c.title, value: c.id }))
        ] 
    },
  ];

  return (
    <AdminLayout user={session.user}>
      <AdminCrudTable 
        entityName="Announcement"
        apiEndpoint="/api/announcements"
        title="Announcements Management"
        description="Broadcast important updates to students and lecturers"
        columns={columns}
        fields={fields}
      />
    </AdminLayout>
  );
}
