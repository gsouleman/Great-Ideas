"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePermissions = exports.updatePermission = exports.getPermissions = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    try {
        const { username, memberName, memberId, email, role, passwordHash, mustChangePassword, is2FAEnabled } = req.body;
        const user = await prisma.user.create({
            data: {
                username,
                memberName,
                memberId: memberId || null,
                email,
                role: role,
                passwordHash,
                mustChangePassword: mustChangePassword ?? true,
                is2FAEnabled: is2FAEnabled ?? false
            }
        });
        res.json(user);
    }
    catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const user = await prisma.user.update({
            where: { id: id },
            data: {
                ...data,
                role: data.role ? data.role : undefined,
                memberId: data.memberId || undefined
            }
        });
        res.json(user);
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToDelete = await prisma.user.findUnique({ where: { id: id } });
        if (userToDelete?.username === 'admin') {
            return res.status(400).json({ error: 'Cannot delete default admin user' });
        }
        await prisma.user.delete({ where: { id: id } });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;
const getPermissions = async (req, res) => {
    try {
        const permissions = await prisma.moduleAccess.findMany();
        res.json(permissions);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch permissions' });
    }
};
exports.getPermissions = getPermissions;
const updatePermission = async (req, res) => {
    try {
        const { role, module, access } = req.body;
        const permission = await prisma.moduleAccess.upsert({
            where: {
                role_module: {
                    role: role,
                    module: module
                }
            },
            update: { access },
            create: {
                role: role,
                module: module,
                access
            }
        });
        res.json(permission);
    }
    catch (error) {
        console.error('Update permission error:', error);
        res.status(500).json({ error: 'Failed to update permission' });
    }
};
exports.updatePermission = updatePermission;
const initializePermissions = async (req, res) => {
    try {
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
                update: {},
                create: {
                    role: p.role,
                    module: p.module,
                    access: p.access
                }
            });
        }
        res.json({ message: 'Permissions initialized' });
    }
    catch (error) {
        console.error('Init permissions error:', error);
        res.status(500).json({ error: 'Failed to initialize permissions' });
    }
};
exports.initializePermissions = initializePermissions;
