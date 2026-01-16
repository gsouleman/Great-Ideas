import axios from 'axios';
import { LoginCredentials, User } from '../types/auth';

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
    // Add other auth methods as needed
};

export default api;
