import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error("Missing GOOGLE_PLACES_API_KEY in .env.local");
  process.exit(1);
}

const BATCH_SIZE = 5;
const DELAY_MS = 1200;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getPhotoUrl(placeId) {
  // Step 1: Get photo_reference from Place Details
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`;
  const detailsRes = await fetch(detailsUrl);
  if (!detailsRes.ok) return null;

  const details = await detailsRes.json();
  const ref = details.result?.photos?.[0]?.photo_reference;
  if (!ref) return null;

  // Step 2: Follow the redirect to get the CDN URL (no API key in it)
  const photoApiUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${API_KEY}`;
  const photoRes = await fetch(photoApiUrl, { redirect: "manual" });
  const cdnUrl = photoRes.headers.get("location");

  if (cdnUrl && cdnUrl.includes("googleusercontent.com")) {
    return cdnUrl;
  }

  // Some responses may follow multiple redirects — follow one more if needed
  if (cdnUrl) {
    const secondRes = await fetch(cdnUrl, { redirect: "manual" });
    const finalUrl = secondRes.headers.get("location");
    if (finalUrl) return finalUrl;
    // If no further redirect, the first URL was the final destination
    return cdnUrl;
  }

  return null;
}

async function main() {
  const businesses = await prisma.$queryRaw`
    SELECT id, name, "placeId"
    FROM "Business"
    WHERE "placeId" IS NOT NULL
      AND (images IS NULL OR array_length(images, 1) IS NULL OR images = '{}')
    ORDER BY name
  `;

  console.log(`Found ${businesses.length} businesses without stored images\n`);

  let success = 0;
  let failed = 0;
  let noPhoto = 0;

  for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
    const batch = businesses.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map(async (b) => {
        try {
          const url = await getPhotoUrl(b.placeId);
          if (url) {
            await prisma.business.update({
              where: { id: b.id },
              data: { images: [url] },
            });
            return { name: b.name, status: "ok" };
          }
          return { name: b.name, status: "no-photo" };
        } catch (err) {
          return { name: b.name, status: "error", err: err.message };
        }
      })
    );

    for (const r of results) {
      if (r.status === "ok") {
        success++;
        console.log(`  ✓ ${r.name}`);
      } else if (r.status === "no-photo") {
        noPhoto++;
        console.log(`  – ${r.name} (no photo available)`);
      } else {
        failed++;
        console.log(`  ✗ ${r.name}: ${r.err}`);
      }
    }

    const progress = Math.min(i + BATCH_SIZE, businesses.length);
    console.log(`\n[${progress}/${businesses.length}] — ${success} saved, ${noPhoto} no photo, ${failed} errors\n`);

    if (i + BATCH_SIZE < businesses.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nDone. ${success} photos saved, ${noPhoto} without photos, ${failed} errors.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
