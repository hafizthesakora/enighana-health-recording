// scripts/backfill-employee-id.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find all users missing an employeeId
  const users = await prisma.user.findMany({
    where: { employeeId: null },
  });

  console.log(`Found ${users.length} users without employeeId.`);

  for (const user of users) {
    // Generate a new employeeId
    const suffix = user.id.slice(-6); // last 6 chars of the ObjectId
    const newEmployeeId = `EMP-${suffix.toUpperCase()}`;

    await prisma.user.update({
      where: { id: user.id },
      data: { employeeId: newEmployeeId },
    });

    console.log(`• ${user.id} → ${newEmployeeId}`);
  }

  console.log('✅ Backfill complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
