import React from 'react';
import { Transaction, Language } from '../types';
import { calculateSummary, formatCurrency, formatDate } from '../utils/calculations';
import { translations } from '../utils/translations';

interface DashboardProps {
    transactions: Transaction[];
    onAddTransaction: () => void;
    language: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, onAddTransaction, language }) => {
    const t = translations[language];
    const summary = calculateSummary(transactions);
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {t.dashboard}
                </h1>
                <button className="btn btn-primary" onClick={onAddTransaction}>
                    <span>+</span> {t.addTransaction}
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
                {/* Total Income */}
                <div className="card slide-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                {t.totalIncome}
                            </p>
                            <p className="text-success" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {formatCurrency(summary.totalIncome)}
                            </p>
                        </div>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: 'var(--radius-xl)',
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--font-size-2xl)'
                        }}>
                            📈
                        </div>
                    </div>
                </div>

                {/* Total Expenses */}
                <div className="card slide-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                {t.totalExpenses}
                            </p>
                            <p className="text-danger" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                                {formatCurrency(summary.totalExpenses)}
                            </p>
                        </div>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: 'var(--radius-xl)',
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--font-size-2xl)'
                        }}>
                            📉
                        </div>
                    </div>
                </div>

                {/* Net Balance */}
                <div className="card slide-in" style={{ animationDelay: '0.3s' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                {t.netBalance}
                            </p>
                            <p style={{
                                fontSize: 'var(--font-size-2xl)',
                                fontWeight: 700,
                                color: summary.netBalance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                            }}>
                                {formatCurrency(summary.netBalance)}
                            </p>
                        </div>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: 'var(--radius-xl)',
                            background: `linear-gradient(135deg, ${summary.netBalance >= 0 ? 'rgba(41, 98, 255, 0.2), rgba(41, 98, 255, 0.05)' : 'rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05)'})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--font-size-2xl)'
                        }}>
                            💰
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>
                    {t.recentTransactions}
                </h2>

                {recentTransactions.length === 0 ? (
                    <p className="text-muted text-center" style={{ padding: 'var(--spacing-xl)' }}>
                        {t.noTransactions}
                    </p>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t.date}</th>
                                    <th>{t.description}</th>
                                    <th>{t.type}</th>
                                    <th className="text-right">{t.amount}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td>{transaction.description}</td>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
