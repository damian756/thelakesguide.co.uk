import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLoginClient from "./DashboardLoginClient";

export const metadata = {
  title: "Business Dashboard | SouthportGuide",
  description: "Manage your business listing on SouthportGuide.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard/home");
  return <DashboardLoginClient />;
}
