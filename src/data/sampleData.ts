import { Transaction } from '../types';

// Transactions extracted from Great Ideas Association detailed spreadsheet
// January 2025 and December 2024
export const sampleTransactions: Transaction[] = [
    // January 2025
    { id: '108', date: '2025-01-10', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: '107', date: '2025-01-05', description: 'Cotisation Mme B.', amount: 50000, type: 'income', category: 'Membership Fees' },

    // December 2024
    { id: '106', date: '2024-12-24', description: "Fête de fin d'année", amount: 100000, type: 'expense', category: 'Events' },
    { id: '105', date: '2024-12-20', description: 'Achat fournitures', amount: 5000, type: 'expense', category: 'Other' },
    { id: '104', date: '2024-12-15', description: 'Don M. T.', amount: 50000, type: 'income', category: 'Donations' },
    { id: '103', date: '2024-12-10', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: '102', date: '2024-12-05', description: 'Transfert vers M. A.', amount: 30000, type: 'expense', category: 'Other' },
    { id: '101', date: '2024-12-02', description: 'Cotisation M. A.', amount: 30000, type: 'income', category: 'Membership Fees' }
];
