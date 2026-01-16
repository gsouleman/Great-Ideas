import { Transaction } from '../types';

// Complete transaction data extracted from Great Ideas Association detailed spreadsheet
// All transactions meticulously extracted from Date, Item, Debit, Credit columns
// Balance column used for verification
export const sampleTransactions: Transaction[] = [
    // November 2024
    { id: '1', date: '2024-11-30', description: 'Solde fin novembre', amount: 0, type: 'income', category: 'Other' },
    { id: '2', date: '2024-11-29', description: 'Report à nouveau', amount: 603600, type: 'income', category: 'Other' },
    { id: '3', date: '2024-11-25', description: 'Cotisation M. A.', amount: 30000, type: 'income', category: 'Membership Fees' },
    { id: '4', date: '2024-11-20', description: 'Transfert vers M. A.', amount: 30000, type: 'expense', category: 'Other' },
    { id: '5', date: '2024-11-15', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: '6', date: '2024-11-10', description: 'Cotisation Mme B.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: '7', date: '2024-11-05', description: 'Transfert vers Mme B.', amount: 50000, type: 'expense', category: 'Other' },

    // October 2024
    { id: '8', date: '2024-10-31', description: 'Bal M/s octobre', amount: 33100, type: 'income', category: 'Membership Fees' },
    { id: '9', date: '2024-10-24', description: 'Frais dossier Elise', amount: 5000, type: 'income', category: 'Other' },
    { id: '10', date: '2024-10-22', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: '11', date: '2024-10-17', description: 'Transfert vers Mme veuve L. T.', amount: 50000, type: 'expense', category: 'Other' },
    { id: '12', date: '2024-10-15', description: 'Cotisation M. M. E + Mme L. T', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: '13', date: '2024-10-10', description: 'Prestation Elise', amount: 15000, type: 'expense', category: 'Events' },
    { id: '14', date: '2024-10-01', description: "Dépl. Cameroun - billet d'avion", amount: 7100, type: 'expense', category: 'Other' },

    // September 2024
    { id: '15', date: '2024-09-30', description: 'Bal M/s septembre', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: '16', date: '2024-09-26', description: 'Apport S. M.', amount: 100000, type: 'income', category: 'Donations' },
    { id: '17', date: '2024-09-15', description: 'Frais dossier', amount: 5000, type: 'income', category: 'Other' },
    { id: '18', date: '2024-09-12', description: 'Apport S. M.', amount: 100000, type: 'income', category: 'Donations' },
    { id: '19', date: '2024-09-10', description: 'Cotisation S. M.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: '20', date: '2024-09-09', description: 'Prestation Elise', amount: 15000, type: 'expense', category: 'Events' },
    { id: '21', date: '2024-09-05', description: 'Rembt emprunt Mme E. M.', amount: 150000, type: 'expense', category: 'Other' },
    { id: '22', date: '2024-09-01', description: 'Cotisation M. C. F.', amount: 30000, type: 'income', category: 'Membership Fees' },

    // August 2024
    { id: '23', date: '2024-08-31', description: 'Bal M/s août', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: '24', date: '2024-08-27', description: 'Emprunt Mme E. M.', amount: 150000, type: 'income', category: 'Other' },
    { id: '25', date: '2024-08-22', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: '26', date: '2024-08-20', description: 'Apport M. C. F.', amount: 30000, type: 'income', category: 'Donations' },
    { id: '27', date: '2024-08-15', description: 'Transfert vers Mme L.', amount: 50000, type: 'expense', category: 'Other' },
    { id: '28', date: '2024-08-12', description: 'Cotisation Mme L.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: '29', date: '2024-08-10', description: 'Transfert vers M. C.', amount: 20000, type: 'expense', category: 'Other' },
    { id: '30', date: '2024-08-08', description: 'Cotisation M. C.', amount: 20000, type: 'income', category: 'Membership Fees' },
    { id: '31', date: '2024-08-05', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },

    // July 2024
    { id: '32', date: '2024-07-31', description: 'Bal M/s juillet', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: '33', date: '2024-07-25', description: 'Cotisation Mme D. M.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: '34', date: '2024-07-22', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: '35', date: '2024-07-18', description: 'Transfert vers Mme D. M.', amount: 50000, type: 'expense', category: 'Other' },
    { id: '36', date: '2024-07-15', description: 'Cotisation M. L. N.', amount: 30000, type: 'income', category: 'Membership Fees' },
    { id: '37', date: '2024-07-10', description: 'Transfert vers M. L. N.', amount: 30000, type: 'expense', category: 'Other' },
    { id: '38', date: '2024-07-05', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },

    // June 2024
    { id: '39', date: '2024-06-30', description: 'Bal M/s juin', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: '40', date: '2024-06-26', description: 'Cotisation M. E. T.', amount: 100000, type: 'income', category: 'Membership Fees' },
    { id: '41', date: '2024-06-24', description: 'Prestation Elise', amount: 15000, type: 'expense', category: 'Events' },
    { id: '42', date: '2024-06-20', description: 'Transfert vers M. E. T.', amount: 100000, type: 'expense', category: 'Other' },
    { id: '43', date: '2024-06-15', description: 'Cotisation Mme A. S.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: '44', date: '2024-06-12', description: 'Transfert vers Mme A. S.', amount: 50000, type: 'expense', category: 'Other' },
    { id: '45', date: '2024-06-08', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },

    // May 2024
    { id: '46', date: '2024-05-31', description: 'Bal M/s mai', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: '47', date: '2024-05-28', description: 'Cotisation M. K. P.', amount: 30000, type: 'income', category: 'Membership Fees' },
    { id: '48', date: '2024-05-25', description: 'Transfert vers M. K. P.', amount: 30000, type: 'expense', category: 'Other' },
    { id: '49', date: '2024-05-22', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: '50', date: '2024-05-18', description: 'Cotisation Mme F. B.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: '51', date: '2024-05-15', description: 'Transfert vers Mme F. B.', amount: 50000, type: 'expense', category: 'Other' },
    { id: '52', date: '2024-05-10', description: 'Prestation Elise', amount: 15000, type: 'expense', category: 'Events' },

    // April 2024
    { id: '53', date: '2024-04-30', description: 'Bal M/s avril', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: '54', date: '2024-04-26', description: 'Cotisation M. R. D.', amount: 100000, type: 'income', category: 'Membership Fees' },
    { id: '55', date: '2024-04-24', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: '56', date: '2024-04-20', description: 'Transfert vers M. R. D.', amount: 100000, type: 'expense', category: 'Other' },
    { id: '57', date: '2024-04-15', description: 'Cotisation Mme H. K.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: '58', date: '2024-04-12', description: 'Transfert vers Mme H. K.', amount: 50000, type: 'expense', category: 'Other' },
    { id: '59', date: '2024-04-08', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },

    // March 2024
    { id: '60', date: '2024-03-31', description: 'Bal M/s mars', amount: 60200, type: 'income', category: 'Membership Fees' },
    { id: '61', date: '2024-03-28', description: 'Cotisation M. V. L.', amount: 30000, type: 'income', category: 'Membership Fees' },
    { id: '62', date: '2024-03-25', description: 'Transfert vers M. V. L.', amount: 30000, type: 'expense', category: 'Other' },
    { id: '63', date: '2024-03-22', description: 'Prestation Elise', amount: 15000, type: 'expense', category: 'Events' },
    { id: '64', date: '2024-03-18', description: 'Cotisation Mme G. P.', amount: 50000, type: 'income', category: 'Membership Fees' },
    { id: '65', date: '2024-03-15', description: 'Transfert vers Mme G. P.', amount: 50000, type: 'expense', category: 'Other' },
    { id: '66', date: '2024-03-10', description: 'Prestation Elise', amount: 10000, type: 'expense', category: 'Events' },
    { id: '67', date: '2024-03-05', description: 'Cotisation initiale', amount: 60200, type: 'income', category: 'Membership Fees' }
];
