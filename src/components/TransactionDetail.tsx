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
            <div className="modal-content transaction-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t.transactionDetails}</h2>
                    <button className="btn-icon" onClick={onClose}>×</button>
                </div>

                <div className="transaction-detail-body">
                    {/* Transaction Type Badge */}
                    <div className="detail-section">
                        <div className={`transaction-type-badge ${transaction.type}`}>
                            {transaction.type === 'income' ? '💰' : '💸'} {t[transaction.type]}
                        </div>
                    </div>

                    {/* Main Details */}
                    <div className="detail-section">
                        <div className="detail-row">
                            <span className="detail-label">📅 {t.date}:</span>
                            <span className="detail-value">{formatDate(transaction.date)}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">📝 {t.description}:</span>
                            <span className="detail-value">{transaction.description}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">🏷️ {t.category}:</span>
                            <span className="detail-value">{transaction.category}</span>
                        </div>

                        <div className="detail-row highlight">
                            <span className="detail-label">💵 {t.amount}:</span>
                            <span className={`detail-value amount ${transaction.type}`}>
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
                    <button className="btn btn-secondary" onClick={onClose}>
                        {t.close}
                    </button>
                    <button className="btn btn-primary" onClick={handlePrintPDF}>
                        📄 {t.exportPDF}
                    </button>
                </div>
            </div>
        </div>
    );
};
