const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    await prisma.globalSettings.upsert({
        where: { key: 'ramadanStart' },
        update: {},
        create: {
            key: 'ramadanStart',
            value: '2026-02-18T00:00:00.000Z',
        },
    });

    console.log("Seeded Global Settings");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
