require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const cats = await prisma.category.findMany({
    select: { slug: true, name: true, businesses: { select: { name: true }, orderBy: { name: 'asc' } } }
  });
  
  let total = 0;
  for (const c of cats) {
    console.log(`\n=== ${c.name} (${c.slug}): ${c.businesses.length} ===`);
    total += c.businesses.length;
    for (const b of c.businesses) {
      console.log(`  ${b.name}`);
    }
  }
  console.log(`\nTOTAL: ${total}`);
  await prisma.$disconnect();
}

main();
