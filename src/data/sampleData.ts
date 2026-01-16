import { Transaction } from '../types';

// Transactions transcribed from the 5 provided spreadsheet images
// February 2024 to January 2025 (Excluding yellow rows)
export const sampleTransactions: Transaction[] = [
    // January 2025
    { id: '25-01-01', date: '2025-01-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // December 2024
    { id: '24-12-01', date: '2024-12-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },
    { id: '24-12-02', date: '2024-12-15', description: '3rd Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },

    // November 2024
    { id: '24-11-01', date: '2024-11-30', description: 'Banks Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // October 2024
    { id: '24-10-01', date: '2024-10-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // September 2024
    { id: '24-09-01', date: '2024-09-30', description: 'Bank Charges', amount: 6500, type: 'expense', category: 'Finance' },
    { id: '24-09-02', date: '2024-09-15', description: '2nd Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },

    // August 2024
    { id: '24-08-01', date: '2024-08-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // July 2024
    { id: '24-07-01', date: '2024-07-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // June 2024
    { id: '24-06-01', date: '2024-06-30', description: 'Bank Charges', amount: 6500, type: 'expense', category: 'Finance' },
    { id: '24-06-02', date: '2024-06-15', description: '1st Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },

    // May 2024
    { id: '24-05-01', date: '2024-05-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // April 2024
    { id: '24-04-01', date: '2024-04-30', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // March 2024
    { id: '24-03-01', date: '2024-03-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // February 2024
    { id: '24-02-01', date: '2024-02-28', description: 'Contributions from members', amount: 4250000, type: 'income', category: 'Membership Fees' },
    { id: '24-02-02', date: '2024-02-25', description: 'Notarization of Protocol d\'accord', amount: 350000, type: 'expense', category: 'Operations' },
    { id: '24-02-03', date: '2024-02-23', description: 'Commission', amount: 195000, type: 'expense', category: 'Operations' },
    { id: '24-02-04', date: '2024-02-22', description: 'Down Payment (40%)', amount: 780000, type: 'expense', category: 'Operations' },
    { id: '24-02-05', date: '2024-02-20', description: 'Bank Charges', amount: 65000, type: 'expense', category: 'Finance' },
    { id: '24-02-06', date: '2024-02-18', description: 'Registration of Association', amount: 300000, type: 'expense', category: 'Operations' },
    { id: '24-02-07', date: '2024-02-16', description: 'Documentation and Transportation', amount: 70000, type: 'expense', category: 'Operations' },
    { id: '24-02-08', date: '2024-02-15', description: 'Logistics and Gift to the palace', amount: 125000, type: 'expense', category: 'Operations' }
];
