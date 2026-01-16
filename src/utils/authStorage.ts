import { User, AuthSession, TwoFactorCode, LoginCredentials, ChangePasswordRequest } from '../types/auth';
import { defaultAdminUser } from '../data/defaultUsers';
import { loadMembers, Member } from './assetStorage';

const USERS_STORAGE_KEY = 'great_ideas_users';
const SESSION_STORAGE_KEY = 'great_ideas_session';
const TWO_FACTOR_STORAGE_KEY = 'great_ideas_2fa_codes';

// Initialize with default admin user if no users exist
const initializeUsers = (): User[] => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
        const initialUsers = [defaultAdminUser];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
        return initialUsers;
    }
    return JSON.parse(stored);
};

export const loadUsers = (): User[] => {
    return initializeUsers();
};

export const saveUsers = (users: User[]): void => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const getUserById = (userId: string): User | undefined => {
    const users = loadUsers();
    return users.find(u => u.id === userId);
};

export const getUserByUsername = (username: string): User | undefined => {
    const users = loadUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const users = loadUsers();
    const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
    const users = loadUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return users[index];
};

export const deleteUser = (userId: string): boolean => {
    const users = loadUsers();
    const filtered = users.filter(u => u.id !== userId && u.username !== 'admin'); // Prevent deleting admin
    if (filtered.length === users.length) return false;

    saveUsers(filtered);
    return true;
};

// Get members that haven't been assigned to any user yet
export const getAvailableMembers = (): Member[] => {
    const users = loadUsers();
    const members = loadMembers();
    const assignedMemberIds = users
        .filter(u => u.memberId)
        .map(u => u.memberId);

    return members.filter(m => !assignedMemberIds.includes(m.id));
};

// Session Management
export const getCurrentSession = (): AuthSession | null => {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const saveSession = (session: AuthSession): void => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearSession = (): void => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
};

// Authentication
export const validateLogin = (credentials: LoginCredentials): { success: boolean; user?: User; requires2FA?: boolean; error?: string } => {
    const user = getUserByUsername(credentials.username);

    if (!user) {
        return { success: false, error: 'Invalid username or password' };
    }

    // Simple password check (in production, use proper hashing comparison)
    if (user.passwordHash !== credentials.password) {
        return { success: false, error: 'Invalid username or password' };
    }

    // Check if 2FA is enabled
    if (user.is2FAEnabled) {
        return { success: true, user, requires2FA: true };
    }

    // Update last login
    updateUser(user.id, { lastLogin: new Date().toISOString() });

    return { success: true, user };
};

export const changePassword = (request: ChangePasswordRequest): { success: boolean; error?: string } => {
    const user = getUserById(request.userId);

    if (!user) {
        return { success: false, error: 'User not found' };
    }

    // Verify current password
    if (user.passwordHash !== request.currentPassword) {
        return { success: false, error: 'Current password is incorrect' };
    }

    // Validate new password
    if (request.newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters' };
    }

    if (request.newPassword === request.currentPassword) {
        return { success: false, error: 'New password must be different from current password' };
    }

    // Update password
    updateUser(user.id, {
        passwordHash: request.newPassword,
        mustChangePassword: false
    });

    return { success: true };
};

// 2FA Management
export const generate2FACode = (userId: string, email: string): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const twoFactorCode: TwoFactorCode = {
        userId,
        code,
        expiresAt,
        email
    };

    // Store the code
    const stored = localStorage.getItem(TWO_FACTOR_STORAGE_KEY);
    const codes: TwoFactorCode[] = stored ? JSON.parse(stored) : [];

    // Remove old codes for this user
    const filtered = codes.filter(c => c.userId !== userId);
    filtered.push(twoFactorCode);

    localStorage.setItem(TWO_FACTOR_STORAGE_KEY, JSON.stringify(filtered));

    return code;
};

export const validate2FACode = (userId: string, code: string): { success: boolean; error?: string } => {
    const stored = localStorage.getItem(TWO_FACTOR_STORAGE_KEY);
    if (!stored) {
        return { success: false, error: 'No verification code found' };
    }

    const codes: TwoFactorCode[] = JSON.parse(stored);
    const userCode = codes.find(c => c.userId === userId);

    if (!userCode) {
        return { success: false, error: 'No verification code found' };
    }

    if (new Date(userCode.expiresAt) < new Date()) {
        return { success: false, error: 'Verification code has expired' };
    }

    if (userCode.code !== code) {
        return { success: false, error: 'Invalid verification code' };
    }

    // Code is valid - remove it and update last login
    const filtered = codes.filter(c => c.userId !== userId);
    localStorage.setItem(TWO_FACTOR_STORAGE_KEY, JSON.stringify(filtered));

    updateUser(userId, { lastLogin: new Date().toISOString() });

    return { success: true };
};

// Get 2FA code for display (for demo purposes only!)
export const get2FACodeForDisplay = (userId: string): string | null => {
    const stored = localStorage.getItem(TWO_FACTOR_STORAGE_KEY);
    if (!stored) return null;

    const codes: TwoFactorCode[] = JSON.parse(stored);
    const userCode = codes.find(c => c.userId === userId);

    return userCode?.code || null;
};

// Check if user has permission
export const hasPermission = (role: User['role'], permission: string): boolean => {
    const rolePermissions = {
        admin: ['all'],
        excom: ['view_financial', 'view_assets', 'manage_users', 'view_admin'],
        member: ['view_financial', 'view_assets'],
        guest: ['view_financial']
    };

    const permissions = rolePermissions[role] || [];
    return permissions.includes('all') || permissions.includes(permission);
};
