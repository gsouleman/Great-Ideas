import { Transaction, MonthlyBalance } from '../types';
import { parseISO, format, getYear } from 'date-fns';

/**
 * Group transactions by month
 */
export const groupTransactionsByMonth = (transactions: Transaction[]): Map<string, Transaction[]> => {
    const grouped = new Map<string, Transaction[]>();

    transactions.forEach((transaction) => {
        const date = parseISO(transaction.date);
        const monthKey = format(date, 'yyyy-MM'); // e.g., "2024-10"

        if (!grouped.has(monthKey)) {
            grouped.set(monthKey, []);
        }
        grouped.get(monthKey)!.push(transaction);
    });

    return grouped;
};

/**
 * Get formatted month label
 */
export const getMonthLabel = (monthKey: string, language: 'en' | 'fr'): string => {
    const [year, month] = monthKey.split('-');

    const monthNames = {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    };

    return `${monthNames[language][parseInt(month) - 1]} ${year}`;
};

/**
 * Calculate monthly balances with running totals
 */
export const calculateMonthlyBalances = (
    transactions: Transaction[],
    initialBalance: number = 0
): MonthlyBalance[] => {
    // Sort transactions by date
    const sorted = [...transactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group by month
    const grouped = groupTransactionsByMonth(sorted);

    // Sort month keys chronologically
    const sortedMonths = Array.from(grouped.keys()).sort();

    let runningBalance = initialBalance;
    const monthlyBalances: MonthlyBalance[] = [];

    sortedMonths.forEach((monthKey) => {
        const monthTransactions = grouped.get(monthKey)!;
        const openingBalance = runningBalance;

        const totalIncome = monthTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = monthTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const closingBalance = openingBalance + totalIncome - totalExpenses;
        runningBalance = closingBalance;

        monthlyBalances.push({
            month: monthKey,
            monthLabel: getMonthLabel(monthKey, 'fr'), // Default to French
            openingBalance,
            totalIncome,
            totalExpenses,
            closingBalance,
            transactionCount: monthTransactions.length,
            transactions: monthTransactions
        });
    });

    return monthlyBalances;
};

/**
 * Sort monthly balances chronologically (most recent first)
 */
export const sortMonthlyBalances = (
    balances: MonthlyBalance[],
    descending: boolean = true
): MonthlyBalance[] => {
    return [...balances].sort((a, b) => {
        const comparison = a.month.localeCompare(b.month);
        return descending ? -comparison : comparison;
    });
};

/**
 * Get monthly balances for a specific year
 */
export const getMonthlyBalancesForYear = (
    transactions: Transaction[],
    year: number
): MonthlyBalance[] => {
    const yearTransactions = transactions.filter((t) => {
        const date = parseISO(t.date);
        return getYear(date) === year;
    });

    return calculateMonthlyBalances(yearTransactions);
};

/**
 * Get the last N months of balances
 */
export const getRecentMonthlyBalances = (
    transactions: Transaction[],
    monthCount: number = 6
): MonthlyBalance[] => {
    const allBalances = calculateMonthlyBalances(transactions);
    const sorted = sortMonthlyBalances(allBalances, true);
    return sorted.slice(0, monthCount);
};
