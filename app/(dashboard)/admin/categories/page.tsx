import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminCrudTable, { Column } from "@/components/admin/AdminCrudTable";

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const columns: Column[] = [
    { key: "title", label: "Category" },
    { key: "slug", label: "Slug" },
    { key: "iconUrl", label: "Icon/Emoji" },
    { 
        key: "_count", 
        label: "Usage", 
        formatter: "badge-count",
        formatterConfig: { prefix: "Resources", field: "resources" }
    }
  ];

  const fields: any[] = [
    { name: "title", label: "Category Title", type: "text", required: true, placeholder: "e.g. Past Papers" },
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "e.g. past-papers" },
    { name: "iconUrl", label: "Icon/Emoji Shortcode", type: "text", placeholder: "e.g. 📄" },
  ];

  return (
    <AdminLayout user={session.user}>
      <AdminCrudTable 
        entityName="Category"
        apiEndpoint="/api/categories"
        title="Category Management"
        description="Organize platform resources into distinct categories"
        columns={columns}
        fields={fields}
        slugSource="title"
      />
    </AdminLayout>
  );
}
