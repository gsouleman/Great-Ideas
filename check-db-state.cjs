const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany();
        console.log('--- USERS IN DATABASE ---');
        users.forEach(u => {
            console.log(`Username: ${u.username}, Role: ${u.role}, memberName: ${u.memberName}`);
        });

        const permissions = await prisma.moduleAccess.findMany();
        console.log('\n--- PERMISSIONS IN DATABASE ---');
        permissions.forEach(p => {
            console.log(`Role: ${p.role}, Module: ${p.module}, Access: ${p.access}`);
        });
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
