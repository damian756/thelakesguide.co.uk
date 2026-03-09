#!/usr/bin/env tsx
/**
 * Import businesses from CSV into the database.
 * Usage: npm run import-businesses
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

interface CSVRow {
  name: string;
  category: string; // category slug
  address: string;
  postcode: string;
  lat: string;
  lng: string;
  phone: string;
  website: string;
  price_range: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePriceRange(priceRange: string): string | undefined {
  // Convert price_level (1-4) or other format to £ symbols
  if (!priceRange) return undefined;
  const level = parseInt(priceRange);
  if (level >= 1 && level <= 4) {
    return "£".repeat(level);
  }
  return priceRange; // Return as-is if not a number
}

async function parseCSV(filePath: string): Promise<CSVRow[]> {
  const content = fs.readFileSync(filePath, "utf-8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return records as CSVRow[];
}

async function main() {
  const csvPath = path.join(process.cwd(), "businesses.csv");
  
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: ${csvPath} not found.`);
    console.error("Run the scraper first: python scripts/scrape-businesses.py");
    process.exit(1);
  }
  
  console.log("Reading businesses.csv...");
  const rows = await parseCSV(csvPath);
  console.log(`Found ${rows.length} businesses in CSV`);
  
  // Get category map
  const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));
  
  let imported = 0;
  let skipped = 0;
  
  for (const row of rows) {
    const categoryId = categoryMap.get(row.category);
    if (!categoryId) {
      console.warn(`  Skipping "${row.name}": unknown category "${row.category}"`);
      skipped++;
      continue;
    }
    
    const slug = slugify(row.name);
    if (!slug) {
      console.warn(`  Skipping "${row.name}": could not generate slug`);
      skipped++;
      continue;
    }
    
    try {
      await prisma.business.upsert({
        where: { slug },
        create: {
          slug,
          name: row.name,
          categoryId,
          address: row.address || "Southport",
          postcode: row.postcode || "",
          lat: row.lat ? parseFloat(row.lat) : null,
          lng: row.lng ? parseFloat(row.lng) : null,
          phone: row.phone || null,
          website: row.website || null,
          priceRange: parsePriceRange(row.price_range),
          images: [],
        },
        update: {
          name: row.name,
          address: row.address || "Southport",
          postcode: row.postcode || "",
          lat: row.lat ? parseFloat(row.lat) : null,
          lng: row.lng ? parseFloat(row.lng) : null,
          phone: row.phone || null,
          website: row.website || null,
          priceRange: parsePriceRange(row.price_range),
        },
      });
      imported++;
      if (imported % 50 === 0) {
        console.log(`  Imported ${imported}...`);
      }
    } catch (error: any) {
      console.error(`  Error importing "${row.name}": ${error.message}`);
      skipped++;
    }
  }
  
  console.log(`\n✓ Import complete`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped: ${skipped}`);
  
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
