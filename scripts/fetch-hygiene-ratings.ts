/**
 * Fetch Food Hygiene Ratings from the FSA free public API.
 * Matches businesses by name + postcode. No API key required.
 * Run: npx tsx scripts/fetch-hygiene-ratings.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const FSA_BASE = "https://api.ratings.food.gov.uk";
const FSA_HEADERS = { "x-api-version": "2", Accept: "application/json" };
const PROGRESS_FILE = "hygiene-progress.json";
const DELAY_MS = 350; // polite rate – FSA asks for reasonable use

// ── String similarity (Levenshtein-lite) ──────────────────────────────────
function similarity(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (s1 === s2) return 1;
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1;
  // Count common chars
  let matches = 0;
  const used = new Array(longer.length).fill(false);
  for (let i = 0; i < shorter.length; i++) {
    for (let j = 0; j < longer.length; j++) {
      if (!used[j] && shorter[i] === longer[j]) {
        matches++;
        used[j] = true;
        break;
      }
    }
  }
  return (2 * matches) / (s1.length + s2.length);
}

function cleanPostcode(pc: string): string {
  // FSA API requires standard postcode format WITH space e.g. "PR8 4AR"
  const raw = pc.trim().toUpperCase().replace(/\s+/g, "");
  // Insert space before last 3 chars (standard UK format)
  if (raw.length >= 5) return `${raw.slice(0, -3)} ${raw.slice(-3)}`;
  return raw;
}

function postcodeSector(pc: string): string {
  // e.g. "PR8 4AR" -> "PR8 4", "PR9 0BS" -> "PR9 0"
  const clean = cleanPostcode(pc);
  return clean.split(" ")[0]; // just the outward code, e.g. "PR8"
}

// ── FSA API ───────────────────────────────────────────────────────────────
type FsaEstablishment = {
  FHRSID: number;         // FSA unique establishment ID
  BusinessName: string;
  RatingValue: string;
  RatingDate: string | null;
  AddressLine1?: string;
  PostCode?: string;
};

async function searchFsa(name: string, postcode: string): Promise<FsaEstablishment | null> {
  const pc = cleanPostcode(postcode);
  const outward = postcodeSector(postcode); // e.g. "PR8"

  // Strategy 1: name + full postcode – highest confidence
  try {
    const url = `${FSA_BASE}/Establishments?name=${encodeURIComponent(name.slice(0, 40))}&address=${encodeURIComponent(pc)}&pageSize=5`;
    const res = await fetch(url, { headers: FSA_HEADERS });
    if (res.ok) {
      const data = (await res.json()) as { establishments: FsaEstablishment[] };
      const results = data.establishments || [];
      if (results.length > 0) {
        const best = results.reduce((a, b) =>
          similarity(name, b.BusinessName) > similarity(name, a.BusinessName) ? b : a
        );
        const sim = similarity(name, best.BusinessName);
        const resultOutward = postcodeSector(best.PostCode || "");
        const sameArea = resultOutward === outward || cleanPostcode(best.PostCode || "") === pc;
        if (sim >= 0.55 && sameArea) return best;
        if (sim >= 0.80) return best; // very strong name match, trust regardless
      }
    }
  } catch {/* skip */}

  // Strategy 2: town/city search with name – broader net
  try {
    const url = `${FSA_BASE}/Establishments?name=${encodeURIComponent(name.slice(0, 40))}&address=Southport&pageSize=10`;
    const res = await fetch(url, { headers: FSA_HEADERS });
    if (res.ok) {
      const data = (await res.json()) as { establishments: FsaEstablishment[] };
      // Filter to same outward postcode
      const results = (data.establishments || []).filter((e) =>
        postcodeSector(e.PostCode || "") === outward
      );
      if (results.length > 0) {
        const best = results.reduce((a, b) =>
          similarity(name, b.BusinessName) > similarity(name, a.BusinessName) ? b : a
        );
        if (similarity(name, best.BusinessName) >= 0.60) return best;
      }
    }
  } catch {/* skip */}

  return null;
}

function parseRating(est: FsaEstablishment): { rating: string | null; date: Date | null; fhrsId: string | null } {
  const rv = est.RatingValue?.trim() || "";
  let rating: string | null = null;

  if (["5", "4", "3", "2", "1", "0"].includes(rv)) {
    rating = rv;
  } else if (rv.toLowerCase().includes("exempt")) {
    rating = "Exempt";
  } else if (rv.toLowerCase().includes("awaiting")) {
    rating = "AwaitingInspection";
  } else if (/^\d+$/.test(rv)) {
    rating = rv;
  }

  let date: Date | null = null;
  if (est.RatingDate) {
    try {
      date = new Date(est.RatingDate.split("T")[0]);
      if (isNaN(date.getTime())) date = null;
    } catch {/* skip */}
  }

  const fhrsId = est.FHRSID ? String(est.FHRSID) : null;

  return { rating, date, fhrsId };
}

// ── Progress ──────────────────────────────────────────────────────────────
function loadProgress(): Set<string> {
  if (fs.existsSync(PROGRESS_FILE)) {
    return new Set(JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8")));
  }
  return new Set();
}

function saveProgress(done: Set<string>) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify([...done]));
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("Fetching Food Hygiene Ratings from FSA API...\n");

  const businesses = await prisma.business.findMany({
    where: { postcode: { not: "" } },
    select: { id: true, name: true, postcode: true, address: true, fhrsId: true },
    orderBy: { name: "asc" },
  });

  console.log(`Found ${businesses.length} businesses\n`);

  const done = loadProgress();
  // Process: not yet done AND (no fhrsId saved yet, OR never processed)
  const remaining = businesses.filter((b) => !done.has(b.id) || !b.fhrsId);
  console.log(`Resuming: ${done.size} done previously, ${remaining.length} to process (including fhrsId backfill)\n`);
  console.log(`Resuming: ${done.size} done, ${remaining.length} to process\n`);

  let matched = 0;
  let notFound = 0;

  for (let i = 0; i < remaining.length; i++) {
    const b = remaining[i];
    const label = `[${i + 1}/${remaining.length}]`;

    try {
      const est = await searchFsa(b.name, b.postcode);

      if (est) {
        const { rating, date, fhrsId } = parseRating(est);
        if (rating !== null) {
          await prisma.business.update({
            where: { id: b.id },
            data: {
              hygieneRating: rating,
              hygieneRatingDate: date ?? undefined,
              fhrsId: fhrsId ?? undefined,
            },
          });
          matched++;
          const fsaName = est.BusinessName.slice(0, 35).replace(/[^\x20-\x7E]/g, "?");
          const nameSafe = b.name.slice(0, 38).replace(/[^\x20-\x7E]/g, "?").padEnd(40);
          console.log(`  ${label} ${nameSafe} -> ${rating}  FHRS:${fhrsId}  (${fsaName})`);
        } else {
          notFound++;
        }
      } else {
        notFound++;
        // Only print every 25 not-founds to keep output clean
        if (notFound % 25 === 0) {
          console.log(`  ${label} ... ${notFound} not matched so far`);
        }
      }
    } catch (err) {
      console.error(`  ERROR ${b.name}: ${err}`);
    }

    done.add(b.id);
    if ((i + 1) % 50 === 0) {
      saveProgress(done);
      console.log(`  ── progress saved (${i + 1}/${remaining.length}) matched: ${matched} ──`);
    }

    await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  saveProgress(done);
  await prisma.$disconnect();

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Complete!`);
  console.log(`  Matched with hygiene rating : ${matched}`);
  console.log(`  Not found / no rating data  : ${notFound}`);
  console.log(`  Total processed             : ${matched + notFound}`);
}

main().catch(console.error);
