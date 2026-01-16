import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, LedgerFilter } from '../types';
import { formatCurrency, formatDate, filterTransactions, calculateSummary } from './calculations';

export const generateLedgerPDF = (
    transactions: Transaction[],
    filter: LedgerFilter,
    language: 'en' | 'fr'
): void => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Filter transactions
    const filtered = filterTransactions(transactions, filter).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const summary = calculateSummary(filtered);

    // Header
    doc.setFontSize(20);
    doc.setTextColor(41, 98, 255); // Blue color
    doc.text('Great Ideas Association', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    const title = language === 'fr' ? 'Grand Livre' : 'Ledger Report';
    doc.text(title, pageWidth / 2, 30, { align: 'center' });

    // Period information
    doc.setFontSize(10);
    let periodText = '';
    if (filter.periodType === 'all') {
        periodText = language === 'fr' ? 'Période: Tous' : 'Period: All Time';
    } else if (filter.periodType === 'year') {
        periodText = `${language === 'fr' ? 'Année' : 'Year'}: ${filter.year}`;
    } else if (filter.periodType === 'month') {
        const months = language === 'fr'
            ? ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
            : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        periodText = `${months[filter.month!]} ${filter.year}`;
    } else if (filter.periodType === 'custom') {
        periodText = `${formatDate(filter.startDate!)} - ${formatDate(filter.endDate!)}`;
    }
    doc.text(periodText, pageWidth / 2, 38, { align: 'center' });

    // Calculate running balance
    let runningBalance = 0;
    const tableData = filtered.map((t) => {
        runningBalance += t.type === 'income' ? t.amount : -t.amount;
        return [
            formatDate(t.date),
            t.description,
            t.type === 'income' ? (language === 'fr' ? 'Revenu' : 'Income') : (language === 'fr' ? 'Dépense' : 'Expense'),
            t.type === 'income' ? formatCurrency(t.amount) : '',
            t.type === 'expense' ? formatCurrency(t.amount) : '',
            formatCurrency(runningBalance)
        ];
    });

    // Table
    autoTable(doc, {
        startY: 45,
        head: [[
            language === 'fr' ? 'Date' : 'Date',
            language === 'fr' ? 'Libellé' : 'Description',
            'Type',
            language === 'fr' ? 'Crédit' : 'Credit',
            language === 'fr' ? 'Débit' : 'Debit',
            language === 'fr' ? 'Solde' : 'Balance'
        ]],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [41, 98, 255],
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 60 },
            2: { cellWidth: 25 },
            3: { cellWidth: 25, halign: 'right' },
            4: { cellWidth: 25, halign: 'right' },
            5: { cellWidth: 25, halign: 'right', fontStyle: 'bold' }
        }
    });

    // Summary section
    const finalY = (doc as any).lastAutoTable.finalY || 45;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');

    const summaryY = finalY + 15;
    const labelX = pageWidth - 80;
    const valueX = pageWidth - 20;

    doc.text(language === 'fr' ? 'Revenus Totaux:' : 'Total Income:', labelX, summaryY);
    doc.setTextColor(34, 197, 94); // Green
    doc.text(formatCurrency(summary.totalIncome), valueX, summaryY, { align: 'right' });

    doc.setTextColor(0, 0, 0);
    doc.text(language === 'fr' ? 'Dépenses Totales:' : 'Total Expenses:', labelX, summaryY + 7);
    doc.setTextColor(239, 68, 68); // Red
    doc.text(formatCurrency(summary.totalExpenses), valueX, summaryY + 7, { align: 'right' });

    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(200, 200, 200);
    doc.line(labelX, summaryY + 10, valueX, summaryY + 10);

    doc.setFontSize(12);
    doc.text(language === 'fr' ? 'Solde Net:' : 'Net Balance:', labelX, summaryY + 17);
    const balanceColor = summary.netBalance >= 0 ? [34, 197, 94] : [239, 68, 68];
    doc.setTextColor(balanceColor[0], balanceColor[1], balanceColor[2]);
    doc.text(formatCurrency(summary.netBalance), valueX, summaryY + 17, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    const today = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US');
    const footerText = language === 'fr' ? `Généré le ${today}` : `Generated on ${today}`;
    doc.text(footerText, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

    // Save PDF
    const fileName = `Great_Ideas_Ledger_${periodText.replace(/[: ]/g, '_')}.pdf`;
    doc.save(fileName);
};

// Generate PDF for a single transaction
export const generateTransactionPDF = (
    transaction: Transaction,
    language: 'en' | 'fr'
): void => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(41, 98, 255);
    doc.text('Great Ideas Association', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    const title = language === 'fr' ? 'Détails de Transaction' : 'Transaction Details';
    doc.text(title, pageWidth / 2, 30, { align: 'center' });

    // Transaction type badge
    doc.setFontSize(12);
    const typeLabel = transaction.type === 'income'
        ? (language === 'fr' ? 'Revenu' : 'Income')
        : (language === 'fr' ? 'Dépense' : 'Expense');
    const typeColor = transaction.type === 'income' ? [34, 197, 94] : [239, 68, 68];
    doc.setTextColor(typeColor[0], typeColor[1], typeColor[2]);
    doc.text(typeLabel, pageWidth / 2, 40, { align: 'center' });

    // Transaction details table
    doc.setTextColor(0, 0, 0);
    const tableData = [
        [language === 'fr' ? 'Date' : 'Date', formatDate(transaction.date)],
        [language === 'fr' ? 'Libellé' : 'Description', transaction.description],
        [language === 'fr' ? 'Catégorie' : 'Category', transaction.category || '—'],
        [language === 'fr' ? 'Montant' : 'Amount', formatCurrency(transaction.amount)],
        ['ID', transaction.id]
    ];

    autoTable(doc, {
        startY: 50,
        body: tableData,
        theme: 'striped',
        styles: {
            fontSize: 11,
            cellPadding: 5
        },
        columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold', fillColor: [240, 240, 240] },
            1: { cellWidth: 120 }
        }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    const today = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US');
    const footerText = language === 'fr' ? `Généré le ${today}` : `Generated on ${today}`;
    doc.text(footerText, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

    // Save PDF
    const fileName = `Great_Ideas_Transaction_${transaction.id}.pdf`;
    doc.save(fileName);
};
