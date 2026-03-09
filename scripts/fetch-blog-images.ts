/**
 * One-off: fetch one CC-licensed image per blog post from Wikimedia Commons,
 * save to public/images/blog/, then print the image paths to update lakes-data.ts.
 * Run: npx tsx scripts/fetch-blog-images.ts
 */

import * as fs from "fs";
import * as path from "path";

const BLOG_IMAGE_QUERIES: { slug: string; query: string; offset?: number }[] = [
  { slug: "southport-flower-show-guide", query: "flower show garden" },
  { slug: "southport-vs-blackpool",      query: "Southport beach" },
];

const OUT_DIR = path.join(process.cwd(), "public", "images", "blog");

async function searchCommons(query: string, offset = 0): Promise<string | null> {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", query);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "1");
  if (offset > 0) url.searchParams.set("gsroffset", String(offset));
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url");
  url.searchParams.set("iiurlwidth", "1200");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "SouthportGuide/1.0 (blog image fetch; https://www.thelakesguide.co.uk)" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    query?: { pages?: Record<string, { imageinfo?: Array<{ url: string }> }> };
    error?: unknown;
  };
  if (data.error) return null;
  const pages = data.query?.pages;
  if (!pages || Object.keys(pages).length === 0) return null;
  const first = Object.values(pages)[0];
  const info = first?.imageinfo?.[0];
  return info?.url ?? null;
}

async function downloadImage(imageUrl: string, filePath: string): Promise<void> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filePath, buf);
}

function getExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return ext.slice(1);
  } catch {
    // ignore
  }
  return "jpg";
}

async function main(): Promise<void> {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const results: { slug: string; path: string }[] = [];

  for (const { slug, query, offset } of BLOG_IMAGE_QUERIES) {
    try {
      await new Promise((r) => setTimeout(r, 400)); // avoid 429 from Commons
      const imageUrl = await searchCommons(query, offset ?? 0);
      if (!imageUrl) {
        console.warn(`No image for "${query}" (${slug}), skipping`);
        continue;
      }
      const ext = getExtension(imageUrl);
      const fileName = `${slug}.${ext}`;
      const filePath = path.join(OUT_DIR, fileName);
      await downloadImage(imageUrl, filePath);
      results.push({ slug, path: `/images/blog/${fileName}` });
      console.log(`OK ${slug} -> ${fileName}`);
    } catch (e) {
      console.warn(`Failed ${slug}:`, e);
    }
  }

  console.log("\n--- Update lakes-data.ts image fields ---");
  results.forEach(({ slug, path: p }) => {
    console.log(`${slug}: "${p}",`);
  });
}

main();
