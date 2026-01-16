import { Transaction } from '../types';

const STORAGE_KEY = 'great_ideas_transactions_v7';

export const loadTransactions = (): Transaction[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
    return [];
};

export const saveTransactions = (transactions: Transaction[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
        console.error('Error saving transactions:', error);
    }
};

export const addTransaction = (transactions: Transaction[], newTransaction: Transaction): Transaction[] => {
    const updated = [...transactions, newTransaction];
    saveTransactions(updated);
    return updated;
};

export const updateTransaction = (
    transactions: Transaction[],
    id: string,
    updates: Partial<Transaction>
): Transaction[] => {
    const updated = transactions.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveTransactions(updated);
    return updated;
};

export const deleteTransaction = (transactions: Transaction[], id: string): Transaction[] => {
    const updated = transactions.filter((t) => t.id !== id);
    saveTransactions(updated);
    return updated;
};
