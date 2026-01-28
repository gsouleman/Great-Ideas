import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

import * as authController from './controllers/auth.controller';
import * as adminController from './controllers/admin.controller';

// ... middleware setup ...

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Great Ideas API is running 🚀' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Auth Routes
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register', authController.register);
app.post('/api/auth/change-password', authController.changePassword);

// Admin Routes
app.get('/api/admin/users', adminController.getUsers);
app.post('/api/admin/users', adminController.createUser);
app.put('/api/admin/users/:id', adminController.updateUser);
app.delete('/api/admin/users/:id', adminController.deleteUser);
app.get('/api/admin/permissions', adminController.getPermissions);
app.post('/api/admin/permissions', adminController.updatePermission);
app.get('/api/admin/permissions/init', adminController.initializePermissions);

// API Routes
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { date: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

app.get('/api/assets', async (req, res) => {
    try {
        const assets = await prisma.asset.findMany();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch assets' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
