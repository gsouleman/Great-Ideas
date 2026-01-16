import { Transaction } from '../types';

// Transactions successfully extracted from the Great Ideas Association sheet
// January 2025 and December 2024 (Excluding yellow balance rows)
export const sampleTransactions: Transaction[] = [
    // January 2025
    { id: 'jan-01', date: '2025-01-10', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: 'jan-02', date: '2025-01-05', description: 'Cotisation Mme B.', amount: 50000, type: 'income', category: 'Membership Fees' },

    // December 2024
    { id: 'dec-01', date: '2024-12-24', description: "Fête de fin d'année", amount: 100000, type: 'expense', category: 'Events' },
    { id: 'dec-02', date: '2024-12-20', description: 'Achat fournitures', amount: 5000, type: 'expense', category: 'Other' },
    { id: 'dec-03', date: '2024-12-15', description: 'Don M. T.', amount: 50000, type: 'income', category: 'Donations' },
    { id: 'dec-04', date: '2024-12-10', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: 'dec-05', date: '2024-12-05', description: 'Transfert vers M. A.', amount: 30000, type: 'expense', category: 'Other' },
    { id: 'dec-06', date: '2024-12-02', description: 'Cotisation M. A.', amount: 30000, type: 'income', category: 'Membership Fees' }
];
