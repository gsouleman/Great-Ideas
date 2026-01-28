import React, { useState } from 'react';
import { Transaction, Language } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';
import { translations } from '../utils/translations';
import { TransactionDetail } from './TransactionDetail';

interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
    onAdd: () => void;
    language: Language;
}

export const TransactionList: React.FC<TransactionListProps> = ({
    transactions,
    onEdit,
    onDelete,
    onAdd,
    language
}) => {
    const t = translations[language];
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [sortField, setSortField] = useState<'date' | 'amount'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

    const handleSort = (field: 'date' | 'amount') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const handleDelete = (e: React.MouseEvent, transaction: Transaction) => {
        e.preventDefault();
        e.stopPropagation();
        setTransactionToDelete(transaction);
    };

    const confirmDelete = () => {
        if (transactionToDelete) {
            onDelete(transactionToDelete.id);
            setTransactionToDelete(null);
        }
    };

    const cancelDelete = () => {
        setTransactionToDelete(null);
    };

    const filteredAndSorted = transactions
        .filter((t) => {
            const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || t.type === filterType;
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            let comparison = 0;
            if (sortField === 'date') {
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            } else {
                comparison = a.amount - b.amount;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {t.transactions}
                </h1>
                <button className="btn btn-primary" onClick={onAdd}>
                    <span>+</span> {t.addTransaction}
                </button>
            </div>

            {/* Filters */}
            <div className="card mb-lg">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{t.search}</label>
                        <input
                            type="text"
                            className="form-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{t.filter}</label>
                        <select
                            className="form-select"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                        >
                            <option value="all">{t.allTime}</option>
                            <option value="income">{t.income}</option>
                            <option value="expense">{t.expense}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="card">
                {filteredAndSorted.length === 0 ? (
                    <p className="text-muted text-center" style={{ padding: 'var(--spacing-xl)' }}>
                        {t.noTransactions}
                    </p>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th
                                        onClick={() => handleSort('date')}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                    >
                                        {t.date} {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th>{t.description}</th>
                                    <th>{t.category}</th>
                                    <th>{t.type}</th>
                                    <th
                                        onClick={() => handleSort('amount')}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                        className="text-right"
                                    >
                                        {t.amount} {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="text-center no-print">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSorted.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td>
                                            {transaction.description}
                                            {transaction.notes && (
                                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                                    {transaction.notes}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                            {transaction.category || '-'}
                                        </td>
                                        <td>
                                            <span className={`badge ${transaction.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                                                {transaction.type === 'income' ? t.income : t.expense}
                                            </span>
                                        </td>
                                        <td className="text-right font-bold" style={{
                                            color: transaction.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)'
                                        }}>
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="no-print">
                                            <div className="flex gap-sm justify-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-info"
                                                    onClick={() => setViewingTransaction(transaction)}
                                                    title={t.viewDetails}
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => onEdit(transaction)}
                                                >
                                                    {t.edit}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={(e) => handleDelete(e, transaction)}
                                                >
                                                    {t.delete}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredAndSorted.length > 0 && (
                    <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                        <p className="text-muted text-right">
                            {language === 'fr' ? 'Total:' : 'Total:'} {filteredAndSorted.length} {language === 'fr' ? 'transaction(s)' : 'transaction(s)'}
                        </p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {transactionToDelete && (
                <div className="modal-overlay" onClick={cancelDelete}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">{language === 'fr' ? 'Confirmer la suppression' : 'Confirm Deletion'}</h2>
                        </div>
                        <div className="modal-body">
                            <p>{language === 'fr'
                                ? `Êtes-vous sûr de vouloir supprimer cette transaction ?`
                                : `Are you sure you want to delete this transaction?`}</p>
                            <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--spacing-md)', marginTop: 'var(--spacing-md)', borderLeft: '4px solid var(--color-danger)' }}>
                                <p style={{ fontWeight: 'bold' }}>
                                    {transactionToDelete.description}
                                </p>
                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)' }}>
                                    {formatDate(transactionToDelete.date)} - {formatCurrency(transactionToDelete.amount)}
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={cancelDelete}>
                                {language === 'fr' ? 'Annuler' : 'Cancel'}
                            </button>
                            <button className="btn btn-danger" onClick={confirmDelete}>
                                {language === 'fr' ? 'Supprimer' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Detail Modal */}
            {viewingTransaction && (
                <TransactionDetail
                    transaction={viewingTransaction}
                    language={language}
                    onClose={() => setViewingTransaction(null)}
                />
            )}
        </div>
    );
};
