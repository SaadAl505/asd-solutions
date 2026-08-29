import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getContent } from "@/lib/content";
import Dashboard from "@/components/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata = { title: "لوحة التحكم" };

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  const content = await getContent();
  return <Dashboard initial={content} />;
}
