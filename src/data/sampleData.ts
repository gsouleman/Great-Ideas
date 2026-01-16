import { Transaction } from '../types';

// Correct transaction data extracted from the new Great Ideas Association sheet
// Non-yellow rows transcribed from November 2024 down to April 2024
export const sampleTransactions: Transaction[] = [
    // November 2024
    { id: 'nov-01', date: '2024-11-29', description: 'Report à nouveau', amount: 603600, type: 'income', category: 'Other' },
    { id: 'nov-02', date: '2024-11-25', description: 'Cotisation M. A.', amount: 30000, type: 'income', category: 'Membership Fees' },
    { id: 'nov-03', date: '2024-11-20', description: 'Transfert vers M. A.', amount: 30000, type: 'expense', category: 'Other' },
    { id: 'nov-04', date: '2024-11-15', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: 'nov-05', date: '2024-11-10', description: 'Cotisation Mme B.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: 'nov-06', date: '2024-11-05', description: 'Transfert vers Mme B.', amount: 50000, type: 'expense', category: 'Other' },

    // October 2024
    { id: 'oct-01', date: '2024-10-31', description: 'Bal M/s octobre', amount: 33100, type: 'income', category: 'Membership Fees' },
    { id: 'oct-02', date: '2024-10-24', description: 'Frais dossier Elise', amount: 5000, type: 'income', category: 'Other' },
    { id: 'oct-03', date: '2024-10-22', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: 'oct-04', date: '2024-10-17', description: 'Transfert vers Mme veuve L. T.', amount: 50000, type: 'expense', category: 'Other' },
    { id: 'oct-05', date: '2024-10-15', description: 'Cotisation M. M. E + Mme L. T', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: 'oct-06', date: '2024-10-10', description: 'Prestation Elise', amount: 15000, type: 'expense', category: 'Events' },
    { id: 'oct-07', date: '2024-10-01', description: "Dépl. Cameroun - billet d'avion", amount: 7100, type: 'expense', category: 'Other' },

    // September 2024
    { id: 'sep-01', date: '2024-09-30', description: 'Bal M/s septembre', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: 'sep-02', date: '2024-09-26', description: 'Apport S. M.', amount: 100000, type: 'income', category: 'Donations' },
    { id: 'sep-03', date: '2024-09-15', description: 'Frais dossier', amount: 5000, type: 'income', category: 'Other' },
    { id: 'sep-04', date: '2024-09-12', description: 'Apport S. M.', amount: 100000, type: 'income', category: 'Donations' },
    { id: 'sep-05', date: '2024-09-10', description: 'Cotisation S. M.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: 'sep-06', date: '2024-09-09', description: 'Prestation Elise', amount: 15000, type: 'expense', category: 'Events' },
    { id: 'sep-07', date: '2024-09-05', description: 'Rembt emprunt Mme E. M.', amount: 150000, type: 'expense', category: 'Other' },
    { id: 'sep-08', date: '2024-09-01', description: 'Cotisation M. C. F.', amount: 30000, type: 'income', category: 'Membership Fees' },

    // August 2024
    { id: 'aug-01', date: '2024-08-31', description: 'Bal M/s août', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: 'aug-02', date: '2024-08-27', description: 'Emprunt Mme E. M.', amount: 150000, type: 'income', category: 'Other' },
    { id: 'aug-03', date: '2024-08-22', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: 'aug-04', date: '2024-08-20', description: 'Apport M. C. F.', amount: 30000, type: 'income', category: 'Donations' },
    { id: 'aug-05', date: '2024-08-15', description: 'Transfert vers Mme L.', amount: 50000, type: 'expense', category: 'Other' },
    { id: 'aug-06', date: '2024-08-12', description: 'Cotisation Mme L.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: 'aug-07', date: '2024-08-10', description: 'Transfert vers M. C.', amount: 20000, type: 'expense', category: 'Other' },
    { id: 'aug-08', date: '2024-08-08', description: 'Cotisation M. C.', amount: 20000, type: 'income', category: 'Membership Fees' },
    { id: 'aug-09', date: '2024-08-05', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },

    // July 2024
    { id: 'jul-01', date: '2024-07-31', description: 'Bal M/s juillet', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: 'jul-02', date: '2024-07-25', description: 'Cotisation Mme D. M.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: 'jul-03', date: '2024-07-22', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: 'jul-04', date: '2024-07-18', description: 'Transfert vers Mme D. M.', amount: 50000, type: 'expense', category: 'Other' },
    { id: 'jul-05', date: '2024-07-15', description: 'Cotisation M. L. N.', amount: 30000, type: 'income', category: 'Membership Fees' },
    { id: 'jul-06', date: '2024-07-10', description: 'Transfert vers M. L. N.', amount: 30000, type: 'expense', category: 'Other' },
    { id: 'jul-07', date: '2024-07-05', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },

    // June 2024
    { id: 'jun-01', date: '2024-06-30', description: 'Bal M/s juin', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: 'jun-02', date: '2024-06-26', description: 'Cotisation M. E. T.', amount: 100000, type: 'income', category: 'Membership Fees' },
    { id: 'jun-03', date: '2024-06-24', description: 'Prestation Elise', amount: 15000, type: 'expense', category: 'Events' },
    { id: 'jun-04', date: '2024-06-20', description: 'Transfert vers M. E. T.', amount: 100000, type: 'expense', category: 'Other' },
    { id: 'jun-05', date: '2024-06-15', description: 'Cotisation Mme A. S.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: 'jun-06', date: '2024-06-12', description: 'Transfert vers Mme A. S.', amount: 50000, type: 'expense', category: 'Other' },
    { id: 'jun-07', date: '2024-06-08', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },

    // May 2024
    { id: 'may-01', date: '2024-05-31', description: 'Bal M/s mai', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: 'may-02', date: '2024-05-28', description: 'Cotisation M. K. P.', amount: 30000, type: 'income', category: 'Membership Fees' },
    { id: 'may-03', date: '2024-05-25', description: 'Transfert vers M. K. P.', amount: 30000, type: 'expense', category: 'Other' },
    { id: 'may-04', date: '2024-05-22', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: 'may-05', date: '2024-05-18', description: 'Cotisation Mme F. B.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: 'may-06', date: '2024-05-15', description: 'Transfert vers Mme F. B.', amount: 50000, type: 'expense', category: 'Other' },
    { id: 'may-07', date: '2024-05-10', description: 'Prestation Elise', amount: 15000, type: 'expense', category: 'Events' },

    // April 2024
    { id: 'apr-01', date: '2024-04-30', description: 'Bal M/s avril', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: 'apr-02', date: '2024-04-26', description: 'Cotisation M. R. D.', amount: 100000, type: 'income', category: 'Membership Fees' },
    { id: 'apr-03', date: '2024-04-24', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: 'apr-04', date: '2024-04-20', description: 'Transfert vers M. R. D.', amount: 100000, type: 'expense', category: 'Other' },
    { id: 'apr-05', date: '2024-04-15', description: 'Cotisation Mme H. K.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: 'apr-06', date: '2024-04-12', description: 'Transfert vers Mme H. K.', amount: 50000, type: 'expense', category: 'Other' },
    { id: 'apr-07', date: '2024-04-08', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' }
];
