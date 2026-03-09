import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BusinessEditClient from "./BusinessEditClient";

export const metadata = {
  title: "Edit Business | Admin",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminBusinessEditPage({ params }: Props) {
  const { id } = await params;

  const business = await prisma.business.findUnique({
    where: { id },
    include: { category: { select: { name: true } } },
  });

  if (!business) notFound();

  const data = {
    id: business.id,
    name: business.name,
    address: business.address,
    postcode: business.postcode,
    phone: business.phone ?? "",
    email: business.email ?? "",
    website: business.website ?? "",
    shortDescription: business.shortDescription ?? "",
    description: business.description ?? "",
    placeId: business.placeId ?? "",
    listingTier: business.listingTier,
    hubTier: business.hubTier,
    boostCredits: business.boostCredits,
    featured: business.featured,
    claimed: business.claimed,
    categoryName: business.category.name,
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-[#1B2E4B] mb-2">
        Edit business
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {business.name} — {business.category.name}
      </p>
      <BusinessEditClient business={data} />
    </div>
  );
}
