import React from 'react';
import { Transaction, Language } from '../types';
import { translations } from '../utils/translations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { generateTransactionPDF } from '../utils/pdfGenerator';

interface TransactionDetailProps {
    transaction: Transaction;
    language: Language;
    onClose: () => void;
}

export const TransactionDetail: React.FC<TransactionDetailProps> = ({
    transaction,
    language,
    onClose
}) => {
    const t = translations[language];

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('fr-FR').format(amount);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return format(date, 'dd MMMM yyyy', { locale: language === 'fr' ? fr : undefined });
    };

    const handlePrintPDF = () => {
        generateTransactionPDF(transaction, language);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{t.transactionDetails}</h2>
                </div>

                <div className="transaction-detail-body">
                    {/* Transaction Type Badge */}
                    <div className="detail-section">
                        <div className={`transaction-type-badge ${transaction.type}`} style={{ borderRadius: 0, textTransform: 'uppercase', fontSize: 'var(--font-size-sm)', padding: 'var(--spacing-sm) var(--spacing-lg)' }}>
                            {transaction.type === 'income' ? t.income : t.expense}
                        </div>
                    </div>

                    {/* Main Details */}
                    <div className="detail-section" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-lg)' }}>
                        <div className="detail-row">
                            <span className="detail-label">{t.date}</span>
                            <span className="detail-value" style={{ fontWeight: 700 }}>{formatDate(transaction.date)}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">{t.description}</span>
                            <span className="detail-value">{transaction.description}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">{t.category}</span>
                            <span className="detail-value">{transaction.category || '-'}</span>
                        </div>

                        <div className="detail-row highlight" style={{ background: 'var(--color-bg-secondary)', borderLeft: `4px solid ${transaction.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)'}` }}>
                            <span className="detail-label" style={{ color: 'var(--color-text-primary)', fontWeight: 800 }}>{t.amount}</span>
                            <span className={`detail-value amount ${transaction.type}`} style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900 }}>
                                {formatAmount(transaction.amount)}
                            </span>
                        </div>
                    </div>

                    {/* Transaction ID */}
                    <div className="detail-section">
                        <div className="detail-row">
                            <span className="detail-label">🔑 ID:</span>
                            <span className="detail-value">{transaction.id}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose}>
                        {t.close}
                    </button>
                    <button className="btn btn-primary" onClick={handlePrintPDF}>
                        {t.exportPDF}
                    </button>
                </div>
            </div>
        </div>
    );
};
