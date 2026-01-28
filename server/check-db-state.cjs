const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndFixUsers() {
    try {
        console.log('Fixing admin role...');
        await prisma.user.updateMany({
            where: { username: { equals: 'admin', mode: 'insensitive' } },
            data: { role: 'ADMIN' }
        });

        console.log('Seeding permissions...');
        const defaultPermissions = [
            { role: 'ADMIN', module: 'FINANCIAL', access: true },
            { role: 'ADMIN', module: 'ASSETS', access: true },
            { role: 'ADMIN', module: 'ADMIN', access: true },
            { role: 'EXCOM', module: 'FINANCIAL', access: true },
            { role: 'EXCOM', module: 'ASSETS', access: true },
            { role: 'EXCOM', module: 'ADMIN', access: true },
            { role: 'MEMBER', module: 'FINANCIAL', access: true },
            { role: 'MEMBER', module: 'ASSETS', access: true },
            { role: 'MEMBER', module: 'ADMIN', access: false },
            { role: 'GUEST', module: 'FINANCIAL', access: true },
            { role: 'GUEST', module: 'ASSETS', access: false },
            { role: 'GUEST', module: 'ADMIN', access: false },
        ];

        for (const p of defaultPermissions) {
            await prisma.moduleAccess.upsert({
                where: {
                    role_module: {
                        role: p.role,
                        module: p.module
                    }
                },
                update: { access: p.access },
                create: {
                    role: p.role,
                    module: p.module,
                    access: p.access
                }
            });
        }

        const users = await prisma.user.findMany();
        console.log('\n--- USERS IN DATABASE ---');
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

checkAndFixUsers();
