import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./SettingsClient";

export const metadata = {
  title: "Settings | Business Hub",
  description: "Account and notification settings.",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  if (!user) redirect("/dashboard");

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: {
      weeklyEmailEnabled: true,
      hubTier: true,
      stripeSubscriptionId: true,
    },
  });

  let subscription = null;
  if (business?.stripeSubscriptionId) {
    const sub = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: business.stripeSubscriptionId },
      select: { currentPeriodEnd: true },
    });
    if (sub) {
      subscription = {
        currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
      };
    }
  }

  return (
    <SettingsClient
      user={{ name: user.name, email: user.email }}
      business={business ? {
        weeklyEmailEnabled: business.weeklyEmailEnabled,
        hubTier: business.hubTier,
        stripeSubscriptionId: business.stripeSubscriptionId,
      } : null}
      subscription={subscription}
    />
  );
}
