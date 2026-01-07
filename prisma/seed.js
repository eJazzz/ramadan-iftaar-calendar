const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('@Eastlak3!', 10);

    const user = await prisma.user.upsert({
        where: { email: 'imam' }, // Using 'imam' as the identifier/username as requested
        update: {
            password: password,
            role: 'ADMIN' // Ensure role is updated if exists
        },
        create: {
            email: 'imam', // Requested username 'Imam', using email field for uniqueness
            name: 'Imam',
            password: password,
            role: 'ADMIN',
        },
    });

    console.log({ user });
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
