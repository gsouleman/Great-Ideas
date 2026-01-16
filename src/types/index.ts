export interface Transaction {
    id: string;
    date: string; // ISO date string
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category?: string;
    notes?: string;
}

export type PeriodType = 'all' | 'year' | 'month' | 'custom';

export interface LedgerFilter {
    periodType: PeriodType;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
}

export interface Summary {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    transactionCount: number;
}

export type Language = 'en' | 'fr';

export interface Translations {
    en: Record<string, string>;
    fr: Record<string, string>;
}

export interface MonthlyBalance {
    month: string; // e.g., "2024-10"
    monthLabel: string; // e.g., "October 2024" or "Octobre 2024"
    openingBalance: number;
    totalIncome: number;
    totalExpenses: number;
    closingBalance: number;
    transactionCount: number;
    transactions: Transaction[];
}

export interface MonthlyBalanceFilter {
    groupByMonth: boolean;
    showMonthlyTotals: boolean;
}
