import { prisma } from "@/lib/prisma";
import ActivateClient from "./ActivateClient";

export const metadata = {
  title: "Set Your Password | The Lakes Guide",
  description: "Complete your listing claim.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ActivatePage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md text-center">
          <h1 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">
            Invalid link
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            This link is missing or invalid. Check your email for the correct
            activation link, or contact{" "}
            <a
              href="mailto:hello@thelakesguide.co.uk"
              className="text-[#C9A84C] font-semibold"
            >
              hello@thelakesguide.co.uk
            </a>
            .
          </p>
          <a
            href="/claim-listing"
            className="inline-block px-6 py-2.5 bg-[#C9A84C] text-[#1B2E4B] font-bold rounded-full text-sm"
          >
            Back to claim listing
          </a>
        </div>
      </div>
    );
  }

  const invite = await prisma.inviteToken.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          businesses: { select: { name: true } },
        },
      },
    },
  });

  if (
    !invite ||
    invite.usedAt ||
    new Date(invite.expiresAt) < new Date()
  ) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md text-center">
          <h1 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">
            Link expired
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            This link has expired. Contact{" "}
            <a
              href="mailto:hello@thelakesguide.co.uk"
              className="text-[#C9A84C] font-semibold"
            >
              hello@thelakesguide.co.uk
            </a>{" "}
            to request a new one.
          </p>
          <a
            href="/claim-listing"
            className="inline-block px-6 py-2.5 bg-[#C9A84C] text-[#1B2E4B] font-bold rounded-full text-sm"
          >
            Back to claim listing
          </a>
        </div>
      </div>
    );
  }

  const businessName =
    invite.user.businesses[0]?.name ?? "your listing";

  return (
    <ActivateClient
      token={token}
      email={invite.user.email}
      businessName={businessName}
    />
  );
}
