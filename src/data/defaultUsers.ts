import { User } from '../types/auth';

// Default admin user - will be created on first app load
export const defaultAdminUser: User = {
    id: '1',
    username: 'admin',
    memberName: 'System Administrator',
    email: 'admin@greatideas.com',
    role: 'admin',
    passwordHash: 'admin', // Simple simulation - user must change on first login
    mustChangePassword: true,
    is2FAEnabled: false,
    createdAt: new Date().toISOString()
};
