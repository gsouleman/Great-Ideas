import { Transaction } from '../types';

// Transactions transcribed from the 5 provided spreadsheet images
// February 2024 to January 2025 (Excluding yellow rows)
export const sampleTransactions: Transaction[] = [
    // June 2026
    { id: '26-06-01', date: '2026-06-15', description: '9th Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },

    // March 2026
    { id: '26-03-01', date: '2026-03-15', description: '8th Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },

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
    { id: '25-04-01', date: '2025-04-30', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // March 2025
    { id: '25-03-01', date: '2025-03-15', description: '4th Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },
    { id: '25-03-02', date: '2025-03-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // February 2025
    { id: '25-02-01', date: '2025-02-28', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // January 2025
    { id: '25-01-01', date: '2025-01-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // December 2024
    { id: '24-12-01', date: '2024-12-15', description: '3rd Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },
    { id: '24-12-02', date: '2024-12-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // November 2024
    { id: '24-11-01', date: '2024-11-30', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // October 2024
    { id: '24-10-01', date: '2024-10-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // September 2024
    { id: '24-09-01', date: '2024-09-15', description: '2nd Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },
    { id: '24-09-02', date: '2024-09-30', description: 'Bank Charges', amount: 6500, type: 'expense', category: 'Finance' },

    // August 2024
    { id: '24-08-01', date: '2024-08-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // July 2024
    { id: '24-07-01', date: '2024-07-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // June 2024
    { id: '24-06-01', date: '2024-06-15', description: '1st Installment payment to Land owners', amount: 133333, type: 'expense', category: 'Operations' },
    { id: '24-06-02', date: '2024-06-30', description: 'Bank Charges', amount: 6500, type: 'expense', category: 'Finance' },

    // May 2024
    { id: '24-05-01', date: '2024-05-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // April 2024
    { id: '24-04-01', date: '2024-04-30', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // March 2024
    { id: '24-03-01', date: '2024-03-31', description: 'Bank Charges', amount: 3500, type: 'expense', category: 'Finance' },

    // February 2024
    { id: '24-02-01', date: '2024-02-28', description: 'Contributions from members', amount: 4250000, type: 'income', category: 'Membership Fees' },
    { id: '24-02-02', date: '2024-02-27', description: 'Notarization of Protocol d\'accord', amount: 350000, type: 'expense', category: 'Operations' },
    { id: '24-02-03', date: '2024-02-26', description: 'Commission', amount: 195000, type: 'expense', category: 'Operations' },
    { id: '24-02-04', date: '2024-02-25', description: 'Down Payment (40%)', amount: 780000, type: 'expense', category: 'Operations' },
    { id: '24-02-05', date: '2024-02-24', description: 'Bank Charges', amount: 65000, type: 'expense', category: 'Finance' },
    { id: '24-02-06', date: '2024-02-18', description: 'Registration of Association', amount: 300000, type: 'expense', category: 'Operations' },
    { id: '24-02-07', date: '2024-02-16', description: 'Documentation and Transportation', amount: 70000, type: 'expense', category: 'Operations' },
    { id: '24-02-08', date: '2024-02-15', description: 'Logistics and Gift to the palace', amount: 125000, type: 'expense', category: 'Operations' }
];
