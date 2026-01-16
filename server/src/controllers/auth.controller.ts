```typescript
import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }

        // Find user by username (case-insensitive)
        const user = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive'
                }
            }
        });

        if (!user) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }

        // Validate password
        // Note: For production, use bcrypt/argon2. Accessing direct password field for now as per migration plan.
        if (user.passwordHash !== password) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }

        // Success - return user data (excluding password)
        const { passwordHash, ...userWithoutPassword } = user;

        res.json({
            success: true,
            user: userWithoutPassword,
            requires2FA: user.is2FAEnabled, // Assuming schema supports this, will allow client to handle flow
            userId: user.id,
            email: user.email
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password, email, fullName } = req.body;

        if (!username || !password || !email || !fullName) {
            res.status(400).json({ error: 'Username, password, email and fullName are required' });
            return;
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: { equals: username, mode: 'insensitive' } },
                    { email: { equals: email, mode: 'insensitive' } }
                ]
            }
        });

        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                passwordHash: password, // TODO: Hash this
                email,
                memberName: fullName, // Map fullName to schema's memberName
                role: Role.MEMBER, // Use Enum
                // status field removed as it does not exist in schema
            }
        });

        const { passwordHash, ...userWithoutPassword } = newUser;

        res.status(201).json({
            success: true,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
