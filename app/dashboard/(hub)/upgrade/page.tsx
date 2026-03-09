import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UpgradePageClient from "./UpgradePageClient";

export const metadata = {
  title: "Upgrade to Pro | Business Hub",
  description: "Get more visibility with Pro.",
  robots: { index: false, follow: false },
};

export default async function UpgradePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/dashboard");

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: { hubTier: true },
  });

  if (!business) redirect("/dashboard");
  if (business.hubTier === "pro") redirect("/dashboard/home");

  return <UpgradePageClient />;
}
