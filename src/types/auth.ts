export interface User {
    id: string;
    username: string;
    memberName: string; // From the 19 members list
    memberId?: string; // Link to member if applicable
    email: string;
    role: UserRole;
    passwordHash: string; // Simulated - in production use proper backend hashing
    mustChangePassword: boolean;
    is2FAEnabled: boolean;
    createdAt: string;
    lastLogin?: string;
}

export type UserRole = 'admin' | 'excom' | 'member' | 'guest';

export interface AuthSession {
    userId: string;
    username: string;
    memberName: string;
    role: UserRole;
    loginTime: string;
    requires2FA?: boolean;
}

export interface TwoFactorCode {
    userId: string;
    code: string;
    expiresAt: string;
    email: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface ChangePasswordRequest {
    userId: string;
    currentPassword: string;
    newPassword: string;
}

export const ROLE_PERMISSIONS = {
    admin: ['all'],
    excom: ['view_financial', 'view_assets', 'manage_users', 'view_admin'],
    member: ['view_financial', 'view_assets'],
    guest: ['view_financial']
} as const;
