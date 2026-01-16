import { Transaction } from '../types';

// Transactions transcribed from the 5 provided spreadsheet images
// February 2024 to January 2025 (Excluding yellow rows)
export const sampleTransactions: Transaction[] = [
    // December 2025
    { id: '25-12-01', date: '2025-12-15', description: '7th Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },

    // November 2025
    { id: '25-11-01', date: '2025-11-30', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // October 2025
    { id: '25-10-01', date: '2025-10-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // September 2025
    { id: '25-09-01', date: '2025-09-15', description: '6th Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },
    { id: '25-09-02', date: '2025-09-30', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // August 2025
    { id: '25-08-01', date: '2025-08-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // July 2025
    { id: '25-07-01', date: '2025-07-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // June 2025
    { id: '25-06-01', date: '2025-06-15', description: '5th Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },
    { id: '25-06-02', date: '2025-06-30', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // May 2025
    { id: '25-05-01', date: '2025-05-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // April 2025
    { id: '25-04-01', date: '2024-04-30', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // March 2025
    { id: '25-03-01', date: '2025-03-15', description: '4th Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },
    { id: '25-03-02', date: '2025-03-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // February 2025
    { id: '25-02-01', date: '2025-02-28', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' }
];

