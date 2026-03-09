require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const total = await prisma.business.count();
  const withPhone = await prisma.business.count({ where: { phone: { not: null } } });
  const withWebsite = await prisma.business.count({ where: { website: { not: null } } });
  const withRating = await prisma.business.count({ where: { rating: { not: null } } });
  const withPostcode = await prisma.business.count({ where: { postcode: { not: '' } } });
  const withHours = await prisma.business.count({ where: { openingHours: { not: null } } });  // Changed Prisma.JsonNull
  const withPlaceId = await prisma.business.count({ where: { placeId: { not: null } } });
  const noData = await prisma.business.count({ where: { placeId: null, rating: null, phone: null } });

  console.log(`Total businesses: ${total}`);
  console.log(`With placeId:     ${withPlaceId} (${(withPlaceId/total*100).toFixed(0)}%)`);
  console.log(`With phone:       ${withPhone} (${(withPhone/total*100).toFixed(0)}%)`);
  console.log(`With website:     ${withWebsite} (${(withWebsite/total*100).toFixed(0)}%)`);
  console.log(`With rating:      ${withRating} (${(withRating/total*100).toFixed(0)}%)`);
  console.log(`With postcode:    ${withPostcode} (${(withPostcode/total*100).toFixed(0)}%)`);
  console.log(`With hours:       ${withHours} (${(withHours/total*100).toFixed(0)}%)`);
  console.log(`No data at all:   ${noData} (${(noData/total*100).toFixed(0)}%)`);

  // Show a few enriched examples
  console.log('\n--- Sample enriched businesses ---');
  const samples = await prisma.business.findMany({
    where: { rating: { not: null } },
    take: 5,
    orderBy: { rating: 'desc' },
    select: { name: true, phone: true, website: true, rating: true, reviewCount: true, postcode: true }
  });
  samples.forEach(b => {
    console.log(`  ${b.name}: ${b.rating}/5 (${b.reviewCount} reviews) | ${b.phone || 'no phone'} | ${b.postcode || 'no postcode'}`);
  });

  // Show a few NOT enriched
  console.log('\n--- Sample NOT enriched ---');
  const noEnrich = await prisma.business.findMany({
    where: { placeId: null },
    take: 5,
    select: { name: true, phone: true, rating: true, postcode: true }
  });
  noEnrich.forEach(b => {
    console.log(`  ${b.name}: rating=${b.rating} | phone=${b.phone} | postcode=${b.postcode}`);
  });

  await prisma.$disconnect();
}

main();
