/// <reference types="vite/client" />
import axios from 'axios';
import { LoginCredentials } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    },
    register: async (userData: any) => {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    },
    getUser: async (userId: string) => {
        // For V1, we fetch all users and find the one we need since we don't have a direct ID endpoint yet
        // TODO: Implement GET /api/users/:id on backend
        const response = await api.get('/api/users');
        const users = response.data;
        return users.find((u: any) => u.id === userId);
    },
    // Add other auth methods as needed
};

export default api;
