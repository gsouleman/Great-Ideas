import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthSession, LoginCredentials, ChangePasswordRequest } from '../types/auth';
import { getCurrentSession, saveSession, clearSession, generate2FACode, validate2FACode } from '../utils/authStorage';

interface AuthContextType {
    currentUser: User | null;
    session: AuthSession | null;
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; requires2FA?: boolean; userId?: string; email?: string; error?: string }>;
    logout: () => void;
    verify2FA: (userId: string, code: string) => Promise<{ success: boolean; user?: User; error?: string }>;
    updatePassword: (request: ChangePasswordRequest) => Promise<{ success: boolean; error?: string }>;
    isAuthenticated: boolean;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [session, setSession] = useState<AuthSession | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<any[]>([]);

    useEffect(() => {
        // Load session on mount
        const existingSession = getCurrentSession();
        if (existingSession) {
            setSession(existingSession);

            // Load the user data from the session via API
            const loadData = async () => {
                try {
                    const { authApi, adminApi } = await import('../utils/api');
                    const [user, perms] = await Promise.all([
                        authApi.getUser(existingSession.userId),
                        adminApi.getPermissions()
                    ]);

                    if (user) {
                        setCurrentUser(user);
                    } else {
                        clearSession();
                        setSession(null);
                    }

                    if (perms) {
                        setPermissions(perms);
                    }
                } catch (error) {
                    console.error('Failed to load user session or permissions:', error);
                }
            };
            loadData();
        }
    }, []);

    const login = async (credentials: LoginCredentials): Promise<{ success: boolean; requires2FA?: boolean; userId?: string; email?: string; error?: string }> => {
        try {
            const { authApi, adminApi } = await import('../utils/api');
            const result = await authApi.login(credentials);

            if (!result.success) {
                return { success: false, error: result.error || 'Login failed' };
            }

            if (result.requires2FA) {
                const code = generate2FACode(result.userId, result.email);
                console.log(`[2FA SIMULATION] Code for ${result.email}: ${code}`);
                return {
                    success: true,
                    requires2FA: true,
                    userId: result.userId,
                    email: result.email
                };
            }

            if (result.user) {
                const perms = await adminApi.getPermissions();
                setPermissions(perms);

                const newSession: AuthSession = {
                    userId: result.user.id,
                    username: result.user.username,
                    memberName: result.user.memberName,
                    role: result.user.role,
                    loginTime: new Date().toISOString()
                };

                saveSession(newSession);
                setSession(newSession);
                setCurrentUser(result.user);

                return { success: true };
            }

            return { success: false, error: 'Unknown response from server' };
        } catch (error: any) {
            console.error('Login error:', error);
            const msg = error.response?.data?.error || 'Connection to server failed';
            return { success: false, error: msg };
        }
    };

    const verify2FA = async (userId: string, code: string): Promise<{ success: boolean; user?: User; error?: string }> => {
        const result = validate2FACode(userId, code);

        if (!result.success) {
            return { success: false, error: result.error };
        }

        try {
            const { authApi, adminApi } = await import('../utils/api');
            const [user, perms] = await Promise.all([
                authApi.getUser(userId),
                adminApi.getPermissions()
            ]);

            if (!user) {
                return { success: false, error: 'User not found' };
            }

            if (perms) setPermissions(perms);

            const newSession: AuthSession = {
                userId: user.id,
                username: user.username,
                memberName: user.memberName,
                role: user.role,
                loginTime: new Date().toISOString()
            };

            saveSession(newSession);
            setSession(newSession);
            setCurrentUser(user);

            return { success: true, user };
        } catch (error) {
            console.error('Verify 2FA error:', error);
            return { success: false, error: 'Failed to retrieve user data' };
        }
    };

    const logout = () => {
        clearSession();
        setSession(null);
        setCurrentUser(null);
        setPermissions([]);
    };

    const updatePassword = async (request: ChangePasswordRequest): Promise<{ success: boolean; error?: string }> => {
        try {
            const { authApi } = await import('../utils/api');
            const result = await authApi.changePassword(request);

            if (result.success && currentUser?.id === request.userId) {
                const updatedUser = await authApi.getUser(request.userId);
                if (updatedUser) {
                    setCurrentUser(updatedUser);
                }
                return { success: true };
            }
            return { success: false, error: result.error || 'Failed to update password' };
        } catch (error: any) {
            console.error('Update password error:', error);
            const msg = error.response?.data?.error || 'Connection to server failed';
            return { success: false, error: msg };
        }
    };

    const hasPermission = (permission: string): boolean => {
        if (!currentUser) return false;
        if (currentUser.role === 'admin') return true;

        // Map permission strings to modules
        const permissionMap: Record<string, string> = {
            'view_financial': 'FINANCIAL',
            'view_assets': 'ASSETS',
            'view_admin': 'ADMIN',
            'manage_users': 'ADMIN'
        };

        const module = permissionMap[permission];
        if (!module) return false;

        const perm = permissions.find(p => p.role.toLowerCase() === currentUser.role.toLowerCase() && p.module === module);
        return perm ? perm.access : false;
    };

    const value: AuthContextType = {
        currentUser,
        session,
        login,
        logout,
        verify2FA,
        updatePassword,
        isAuthenticated: !!session,
        hasPermission
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
