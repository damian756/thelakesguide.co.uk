import { prisma } from "@/lib/prisma";
import ClaimsPageClient from "./ClaimsPageClient";

export const metadata = {
  title: "Claims | Admin",
  description: "Manage claim requests.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function AdminClaimsPage({ searchParams }: Props) {
  const { tab = "pending" } = await searchParams;
  const validTab =
    tab === "approved" || tab === "rejected" ? tab : "pending";

  const claims = await prisma.claimRequest.findMany({
    where: { status: validTab },
    orderBy: { createdAt: "desc" },
    include: {
      business: { select: { id: true, name: true, address: true, postcode: true } },
    },
  });

  const serialized = claims.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    message: c.message,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    business: c.business,
  }));

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-2xl font-bold text-[#1B2E4B] mb-6">
        Claims
      </h1>
      <ClaimsPageClient claims={serialized} tab={validTab} />
    </div>
  );
}
