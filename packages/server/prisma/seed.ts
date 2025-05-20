import { PrismaClient } from '@prisma/client';
import data from './biomarkers.json';

const prisma = new PrismaClient();

async function main() {
  for (const b of (data as any[])) {
    await prisma.biomarker.upsert({
      where: { name: b.name },
      update: {},
      create: {
        name: b.name,
        unit: b.unit,
        category: b.category,
        description: b.description,
        measurementType: b.measurementType,
        importance: b.importance,
        optimalRangeLow: b.optimalRangeLow,
        optimalRangeHigh: b.optimalRangeHigh,
      },
    });
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
