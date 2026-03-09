import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ListingEditorClient from "./ListingEditorClient";

export const metadata = {
  title: "My Listing | Business Hub",
  description: "Edit your business listing.",
  robots: { index: false, follow: false },
};

export default async function ListingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/dashboard");

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      description: true,
      phone: true,
      email: true,
      website: true,
      priceRange: true,
      openingHours: true,
      images: true,
      rating: true,
      reviewCount: true,
      hubTier: true,
      category: { select: { slug: true } },
    },
  });

  if (!business) redirect("/dashboard");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#1B2E4B] mb-6">My Listing</h1>
      <ListingEditorClient business={business} />
    </div>
  );
}
