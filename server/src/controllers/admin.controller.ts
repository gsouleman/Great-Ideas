import { Request, Response } from 'express';
import { PrismaClient, Role, Module } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, memberName, memberId, email, role, passwordHash, mustChangePassword, is2FAEnabled } = req.body;
        const user = await prisma.user.create({
            data: {
                username,
                memberName,
                memberId: memberId || null,
                email,
                role: role as Role,
                passwordHash,
                mustChangePassword: mustChangePassword ?? true,
                is2FAEnabled: is2FAEnabled ?? false
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const user = await prisma.user.update({
            where: { id: id as string },
            data: {
                ...data,
                role: data.role ? (data.role as Role) : undefined,
                memberId: data.memberId || undefined
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const userToDelete = await prisma.user.findUnique({ where: { id: id as string } });
        if (userToDelete?.username === 'admin') {
            return res.status(400).json({ error: 'Cannot delete default admin user' });
        }

        await prisma.user.delete({ where: { id: id as string } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

export const getPermissions = async (req: Request, res: Response) => {
    try {
        const permissions = await prisma.moduleAccess.findMany();
        res.json(permissions || []);
    } catch (error) {
        console.error('Fetch permissions error:', error);
        res.json([]);
    }
};

export const updatePermission = async (req: Request, res: Response) => {
    try {
        const { role, module, access } = req.body;
        const permission = await prisma.moduleAccess.upsert({
            where: {
                role_module: {
                    role: role as Role,
                    module: module as Module
                }
            },
            update: { access },
            create: {
                role: role as Role,
                module: module as Module,
                access
            }
        });
        res.json(permission);
    } catch (error) {
        console.error('Update permission error:', error);
        res.status(500).json({ error: 'Failed to update permission' });
    }
};

export const initializePermissions = async (req: Request, res: Response) => {
    try {
        const defaultPermissions = [
            { role: 'ADMIN' as Role, module: 'FINANCIAL' as Module, access: true },
            { role: 'ADMIN' as Role, module: 'ASSETS' as Module, access: true },
            { role: 'ADMIN' as Role, module: 'ADMIN' as Module, access: true },
            { role: 'EXCOM' as Role, module: 'FINANCIAL' as Module, access: true },
            { role: 'EXCOM' as Role, module: 'ASSETS' as Module, access: true },
            { role: 'EXCOM' as Role, module: 'ADMIN' as Module, access: true },
            { role: 'MEMBER' as Role, module: 'FINANCIAL' as Module, access: true },
            { role: 'MEMBER' as Role, module: 'ASSETS' as Module, access: true },
            { role: 'MEMBER' as Role, module: 'ADMIN' as Module, access: false },
            { role: 'GUEST' as Role, module: 'FINANCIAL' as Module, access: true },
            { role: 'GUEST' as Role, module: 'ASSETS' as Module, access: false },
            { role: 'GUEST' as Role, module: 'ADMIN' as Module, access: false },
        ];

        for (const p of defaultPermissions) {
            await prisma.moduleAccess.upsert({
                where: {
                    role_module: {
                        role: p.role,
                        module: p.module
                    }
                },
                update: {},
                create: {
                    role: p.role,
                    module: p.module,
                    access: p.access
                }
            });
        }

        // Ensure 'admin' user is actually an ADMIN
        await prisma.user.updateMany({
            where: { username: { equals: 'admin', mode: 'insensitive' } },
            data: { role: Role.ADMIN }
        });

        res.json({ message: 'Permissions initialized and admin user role fixed' });
    } catch (error) {
        console.error('Init permissions error:', error);
        res.status(500).json({ error: 'Failed to initialize permissions' });
    }
};
