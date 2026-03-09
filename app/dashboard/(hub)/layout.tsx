import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HubShell from "./HubShell";
import SignOutButton from "./SignOutButton";

export default async function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      businesses: {
        include: { category: true },
      },
    },
  });

  if (!user) redirect("/dashboard");

  const business = user.businesses[0] ?? null;

  if (!business) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-[#1B2E4B]/10 flex items-center justify-center mb-6">
          <Building2 className="w-8 h-8 text-[#1B2E4B]" />
        </div>
        <h1 className="font-display text-2xl font-bold text-[#1B2E4B] text-center mb-2">
          No listing linked to your account
        </h1>
        <p className="text-gray-500 text-center max-w-md mb-8">
          If you&apos;ve just claimed your listing, it can take up to 24 hours to link it to your account.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/claim-listing"
            className="bg-[#C9A84C] hover:bg-[#B8972A] text-white px-6 py-3 rounded-full font-bold text-sm transition-colors text-center"
          >
            Claim your listing →
          </Link>
          <a
            href="mailto:hello@southportguide.co.uk"
            className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-full font-medium text-sm transition-colors text-center"
          >
            Contact us
          </a>
        </div>
        <div className="mt-10">
          <SignOutButton />
        </div>
      </div>
    );
  }

  return (
    <HubShell
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }}
      business={{
        id: business.id,
        name: business.name,
        slug: business.slug,
        hubTier: business.hubTier,
        category: { slug: business.category.slug },
      }}
    >
      {children}
    </HubShell>
  );
}
