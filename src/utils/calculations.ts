import { Transaction, Summary, LedgerFilter } from '../types';
import { parseISO, isWithinInterval, getYear, getMonth } from 'date-fns';

export const calculateSummary = (transactions: Transaction[]): Summary => {
    const txArray = Array.isArray(transactions) ? transactions : [];
    const totalIncome = txArray
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        transactionCount: transactions.length
    };
};

export const filterTransactions = (
    transactions: Transaction[],
    filter: LedgerFilter
): Transaction[] => {
    const txArray = Array.isArray(transactions) ? transactions : [];
    if (filter.periodType === 'all') {
        return txArray;
    }

    return txArray.filter((t) => {
        const transDate = parseISO(t.date);

        if (filter.periodType === 'year' && filter.year) {
            return getYear(transDate) === filter.year;
        }

        if (filter.periodType === 'month' && filter.year && filter.month !== undefined) {
            return getYear(transDate) === filter.year && getMonth(transDate) === filter.month;
        }

        if (filter.periodType === 'custom' && filter.startDate && filter.endDate) {
            return isWithinInterval(transDate, {
                start: parseISO(filter.startDate),
                end: parseISO(filter.endDate)
            });
        }

        return true;
    });
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export const formatDate = (dateString: string): string => {
    const date = parseISO(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
};

export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
