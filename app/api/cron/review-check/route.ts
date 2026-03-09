import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import {
  generateNewReviewEmail,
  generateRatingChangeEmail,
} from "@/lib/email-templates/review-alert";

const BATCH_SIZE = 20;
const BATCH_DELAY_MS = 200;

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "SouthportGuide <onboarding@resend.dev>";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type PlaceDetailsResult = {
  result?: {
    rating?: number;
    user_ratings_total?: number;
  };
  status?: string;
};

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_PLACES_API_KEY not configured" },
      { status: 500 }
    );
  }

  const businesses = await prisma.business.findMany({
    where: {
      claimed: true,
      placeId: { not: null },
    },
    include: { user: true },
  });

  let checked = 0;
  let reviewsSent = 0;
  let ratingSent = 0;

  for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
    const batch = businesses.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (business) => {
        const placeId = business.placeId;
        if (!placeId) return;

        try {
          const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=rating,user_ratings_total&key=${apiKey}`;
          const res = await fetch(url);
          const data = (await res.json()) as PlaceDetailsResult;

          if (data.status !== "OK" || !data.result) {
            return;
          }

          const newRating = data.result.rating ?? null;
          const newReviewCount = data.result.user_ratings_total ?? null;

          const oldRating = business.rating;
          const oldReviewCount = business.reviewCount;

          const reviewCountIncreased =
            newReviewCount != null &&
            oldReviewCount != null &&
            newReviewCount > oldReviewCount;

          const ratingDecreased =
            newRating != null &&
            oldRating != null &&
            oldRating - newRating >= 0.1;

          if (reviewCountIncreased) {
            await prisma.reviewSnapshot.create({
              data: {
                businessId: business.id,
                rating: newRating ?? 0,
                reviewCount: newReviewCount,
              },
            });

            const user = business.user;
            if (user?.email && process.env.RESEND_API_KEY) {
              const html = generateNewReviewEmail(
                { name: business.name },
                { name: user.name, email: user.email },
                newReviewCount,
                newRating ?? 0
              );
              const { error } = await resend.emails.send({
                from: FROM_EMAIL,
                to: user.email,
                subject: `New Google review for ${business.name}`,
                html,
              });
              if (!error) reviewsSent++;
            }
          }

          if (ratingDecreased && oldRating != null && newRating != null) {
            const user = business.user;
            if (user?.email && process.env.RESEND_API_KEY) {
              const html = generateRatingChangeEmail(
                { name: business.name },
                { name: user.name, email: user.email },
                oldRating,
                newRating
              );
              const { error } = await resend.emails.send({
                from: FROM_EMAIL,
                to: user.email,
                subject: `Rating update for ${business.name}`,
                html,
              });
              if (!error) ratingSent++;
            }
          }

          await prisma.business.update({
            where: { id: business.id },
            data: {
              rating: newRating,
              reviewCount: newReviewCount,
              googleReviewCachedAt: new Date(),
            },
          });
          checked++;
        } catch (err) {
          console.error(`Review check failed for ${business.name}:`, err);
        }
      })
    );

    if (i + BATCH_SIZE < businesses.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  return NextResponse.json({
    checked,
    reviewAlertsSent: reviewsSent,
    ratingAlertsSent: ratingSent,
  });
}
