import { Translations } from '../types';

export const translations: Translations = {
    en: {
        // Navigation
        dashboard: 'Dashboard',
        transactions: 'Transactions',
        reports: 'Reports',

        // Dashboard
        totalIncome: 'Total Income',
        totalExpenses: 'Total Expenses',
        netBalance: 'Net Balance',
        recentTransactions: 'Recent Transactions',
        addTransaction: 'Add Transaction',

        // Transaction Types
        income: 'Income',
        expense: 'Expense',

        // Form Labels
        date: 'Date',
        description: 'Description',
        amount: 'Amount',
        type: 'Type',
        category: 'Category',
        notes: 'Notes',

        // Actions
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        search: 'Search',
        filter: 'Filter',
        exportPDF: 'Export PDF',
        print: 'Print',

        // Period Filters
        allTime: 'All Time',
        year: 'Year',
        month: 'Month',
        customRange: 'Custom Range',
        selectYear: 'Select Year',
        selectMonth: 'Select Month',
        startDate: 'Start Date',
        endDate: 'End Date',

        // Months
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December',

        // Categories
        membershipFees: 'Membership Fees',
        donations: 'Donations',
        fundraising: 'Fundraising',
        grants: 'Grants',
        rent: 'Rent',
        utilities: 'Utilities',
        officeSupplies: 'Office Supplies',
        events: 'Events',
        bankFees: 'Bank Fees',
        insurance: 'Insurance',
        training: 'Training',
        commission: 'Commission',
        logistics: 'Logistics',
        adminFee: 'Admin Fee',
        monthlyRunningCost: 'Monthly Running Cost',
        installmentPayments: 'Installment Payments',
        other: 'Other',

        // Report
        ledgerReport: 'Ledger Report',
        period: 'Period',
        openingBalance: 'Opening Balance',
        closingBalance: 'Closing Balance',
        balance: 'Balance',
        generatedOn: 'Generated on',

        // Messages
        noTransactions: 'No transactions found',
        confirmDelete: 'Are you sure you want to delete this transaction?',
        transactionAdded: 'Transaction added successfully',
        transactionUpdated: 'Transaction updated successfully',
        transactionDeleted: 'Transaction deleted successfully',

        // Transaction Detail
        transactionDetails: 'Transaction Details',
        close: 'Close',
        viewDetails: 'View Details',
        minAmount: 'Min Amount',
        maxAmount: 'Max Amount',
        applyFilters: 'Apply Filters',
        clearFilters: 'Clear Filters',

        // Asset Management
        assetManagement: 'Asset Management',
        members: 'Members',
        assets: 'Assets',
        documents: 'Documents',
        payments: 'Payments',
        sharedValue: 'Shared Value',
        memberShares: 'Member Shares',

        // Members
        addMember: 'Add Member',
        memberName: 'Member Name',
        sharesOwned: 'Shares Owned',
        landSize: 'Land Size (m²)',
        dateJoined: 'Date Joined',
        remarks: 'Remarks',
        totalMembers: 'Total Members',
        totalShares: 'Total Shares',

        // Assets
        addAsset: 'Add Asset',
        assetType: 'Asset Type',
        realEstate: 'Real Estate',
        vehicleTransport: 'Vehicle/Transport',
        equipment: 'Equipment',
        investment: 'Investment',
        purchaseDate: 'Purchase Date',
        purchasePrice: 'Purchase Price',
        currentValue: 'Current Value',
        location: 'Location',
        size: 'Size',
        totalAssets: 'Total Assets',
        totalValue: 'Total Value',

        // Documents
        generateDocument: 'Generate Document',
        uploadDocument: 'Upload Document',
        articlesOfAssociation: 'Articles of Association',
        shareCertificate: 'Share Certificate',
        landTitle: 'Land Title',
        purchaseAgreement: 'Purchase Agreement',
        documentType: 'Document Type',
        uploadDate: 'Upload Date',

        // Payments
        paymentPlan: 'Payment Plan',
        downPayment: 'Down Payment',
        quarterlyPayment: 'Quarterly Payment',
        outstanding: 'Outstanding',
        overdue: 'Overdue',
        paid: 'Paid',
        pending: 'Pending',
        membershipFee: 'Membership Fee',
        assetPayment: 'Asset Payment',
        dueDate: 'Due Date',
        paidDate: 'Paid Date',
        quarter: 'Quarter',
        recordPayment: 'Record Payment',
        viewPaymentHistory: 'View Payment History'
    },
    fr: {
        // Navigation
        dashboard: 'Tableau de Bord',
        transactions: 'Transactions',
        reports: 'Rapports',

        // Dashboard
        totalIncome: 'Revenus Totaux',
        totalExpenses: 'Dépenses Totales',
        netBalance: 'Solde Net',
        recentTransactions: 'Transactions Récentes',
        addTransaction: 'Ajouter Transaction',

        // Transaction Types
        income: 'Revenu',
        expense: 'Dépense',

        // Form Labels
        date: 'Date',
        description: 'Libellé',
        amount: 'Montant',
        type: 'Type',
        category: 'Catégorie',
        notes: 'Notes',

        // Actions
        add: 'Ajouter',
        edit: 'Modifier',
        delete: 'Supprimer',
        save: 'Enregistrer',
        cancel: 'Annuler',
        search: 'Rechercher',
        filter: 'Filtrer',
        exportPDF: 'Exporter PDF',
        print: 'Imprimer',

        // Period Filters
        allTime: 'Tous',
        year: 'Année',
        month: 'Mois',
        customRange: 'Période Personnalisée',
        selectYear: 'Sélectionner Année',
        selectMonth: 'Sélectionner Mois',
        startDate: 'Date Début',
        endDate: 'Date Fin',

        // Months
        january: 'Janvier',
        february: 'Février',
        march: 'Mars',
        april: 'Avril',
        may: 'Mai',
        june: 'Juin',
        july: 'Juillet',
        august: 'Août',
        september: 'Septembre',
        october: 'Octobre',
        november: 'Novembre',
        december: 'Décembre',

        // Categories
        membershipFees: 'Cotisations',
        donations: 'Dons',
        fundraising: 'Levée de Fonds',
        grants: 'Subventions',
        rent: 'Loyer',
        utilities: 'Services Publics',
        officeSupplies: 'Fournitures Bureau',
        events: 'Événements',
        bankFees: 'Frais Bancaires',
        insurance: 'Assurance',
        training: 'Formation',
        commission: 'Commission',
        logistics: 'Logistique',
        adminFee: 'Frais d\'Administration',
        monthlyRunningCost: 'Frais de Fonctionnement Mensuel',
        installmentPayments: 'Paiements Échelonnés',
        other: 'Autre',

        // Report
        ledgerReport: 'Grand Livre',
        period: 'Période',
        openingBalance: 'Solde Ouverture',
        closingBalance: 'Solde Clôture',
        balance: 'Solde',
        generatedOn: 'Généré le',

        // Messages
        noTransactions: 'Aucune transaction trouvée',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette transaction?',
        transactionAdded: 'Transaction ajoutée avec succès',
        transactionUpdated: 'Transaction mise à jour avec succès',
        transactionDeleted: 'Transaction supprimée avec succès',

        // Transaction Detail
        transactionDetails: 'Détails de la Transaction',
        close: 'Fermer',
        viewDetails: 'Voir Détails',
        minAmount: 'Montant Min',
        maxAmount: 'Montant Max',
        applyFilters: 'Appliquer Filtres',
        clearFilters: 'Effacer Filtres',

        // Asset Management
        assetManagement: 'Gestion des Actifs',
        members: 'Membres',
        assets: 'Actifs',
        documents: 'Documents',
        payments: 'Paiements',
        sharedValue: 'Valeur Partagée',
        memberShares: 'Actions par Membre',

        // Members
        addMember: 'Ajouter Membre',
        memberName: 'Nom du Membre',
        sharesOwned: 'Actions Détenues',
        landSize: 'Superficie (m²)',
        dateJoined: 'Date d\'Adhésion',
        remarks: 'Remarques',
        totalMembers: 'Total Membres',
        totalShares: 'Total Actions',

        // Assets
        addAsset: 'Ajouter Actif',
        assetType: 'Type d\'Actif',
        realEstate: 'Immobilier',
        vehicleTransport: 'Véhicule/Transport',
        equipment: 'Équipement',
        investment: 'Investissement',
        purchaseDate: 'Date d\'Achat',
        purchasePrice: 'Prix d\'Achat',
        currentValue: 'Valeur Actuelle',
        location: 'Localisation',
        size: 'Taille',
        totalAssets: 'Total Actifs',
        totalValue: 'Valeur Totale',

        // Documents
        generateDocument: 'Générer Document',
        uploadDocument: 'Téléverser Document',
        articlesOfAssociation: 'Statuts de l\'Association',
        shareCertificate: 'Certificat d\'Actions',
        landTitle: 'Titre Foncier',
        purchaseAgreement: 'Accord d\'Achat',
        documentType: 'Type de Document',
        uploadDate: 'Date de Téléversement',

        // Payments
        paymentPlan: 'Plan de Paiement',
        downPayment: 'Acompte',
        quarterlyPayment: 'Paiement Trimestriel',
        outstanding: 'En Attente',
        overdue: 'En Retard',
        paid: 'Payé',
        pending: 'En Attente',
        membershipFee: 'Cotisation Membre',
        assetPayment: 'Paiement d\'Actif',
        dueDate: 'Date d\'Échéance',
        paidDate: 'Date de Paiement',
        quarter: 'Trimestre',
        recordPayment: 'Enregistrer Paiement',
        viewPaymentHistory: 'Voir Historique Paiements'
    }
};