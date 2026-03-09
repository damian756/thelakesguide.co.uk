import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminShell from "../AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/dashboard");

  if ((session.user as { role?: string }).role !== "admin") {
    redirect("/dashboard/home");
  }

  return <AdminShell>{children}</AdminShell>;
}
