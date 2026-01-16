import React, { useState } from 'react';
import { Transaction, Language } from '../types';
import { calculateMonthlyBalances, getMonthLabel, sortMonthlyBalances } from '../utils/monthlyBalance';
import { formatCurrency } from '../utils/calculations';

interface MonthlyBalanceViewProps {
    transactions: Transaction[];
    language: Language;
}

export const MonthlyBalanceView: React.FC<MonthlyBalanceViewProps> = ({ transactions, language }) => {
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

    // Get all unique years from transactions
    const years = Array.from(
        new Set(transactions.map(t => new Date(t.date).getFullYear()))
    ).sort((a, b) => b - a);

    // Filter transactions by year if selected
    const filteredTransactions = selectedYear === 'all'
        ? transactions
        : transactions.filter(t => new Date(t.date).getFullYear() === selectedYear);

    // Calculate monthly balances
    const monthlyBalances = sortMonthlyBalances(
        calculateMonthlyBalances(filteredTransactions),
        true // Most recent first
    );

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {language === 'fr' ? 'Solde Mensuel' : 'Monthly Balance'}
                </h1>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                    <select
                        className="form-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">{language === 'fr' ? 'Toutes les années' : 'All Years'}</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Monthly Balance Table */}
            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{language === 'fr' ? 'Mois' : 'Month'}</th>
                                <th className="text-right">{language === 'fr' ? 'Solde Ouverture' : 'Opening Balance'}</th>
                                <th className="text-right">{language === 'fr' ? 'Revenus' : 'Income'}</th>
                                <th className="text-right">{language === 'fr' ? 'Dépenses' : 'Expenses'}</th>
                                <th className="text-right">{language === 'fr' ? 'Solde Clôture' : 'Closing Balance'}</th>
                                <th className="text-right">{language === 'fr' ? 'Variation' : 'Change'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyBalances.map((balance) => {
                                const netChange = balance.totalIncome - balance.totalExpenses;
                                const percentChange = balance.openingBalance !== 0
                                    ? ((netChange / Math.abs(balance.openingBalance)) * 100)
                                    : 0;

                                return (
                                    <tr key={balance.month}>
                                        <td style={{ fontWeight: 600 }}>
                                            {getMonthLabel(balance.month, language)}
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                                {balance.transactionCount} {language === 'fr' ? 'transaction(s)' : 'transaction(s)'}
                                            </div>
                                        </td>
                                        <td className="text-right" style={{ color: 'var(--color-text-secondary)' }}>
                                            {formatCurrency(balance.openingBalance)}
                                        </td>
                                        <td className="text-right text-success" style={{ fontWeight: 500 }}>
                                            {formatCurrency(balance.totalIncome)}
                                        </td>
                                        <td className="text-right text-danger" style={{ fontWeight: 500 }}>
                                            {formatCurrency(balance.totalExpenses)}
                                        </td>
                                        <td className="text-right font-bold" style={{
                                            color: balance.closingBalance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                                        }}>
                                            {formatCurrency(balance.closingBalance)}
                                        </td>
                                        <td className="text-right">
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                color: netChange >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                                            }}>
                                                <span>{netChange >= 0 ? '↑' : '↓'}</span>
                                                <span style={{ fontWeight: 500 }}>{formatCurrency(Math.abs(netChange))}</span>
                                                {balance.openingBalance !== 0 && (
                                                    <span style={{ fontSize: 'var(--font-size-xs)', marginLeft: '0.25rem' }}>
                                                        ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%)
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        {monthlyBalances.length > 0 && (
                            <tfoot>
                                <tr style={{ borderTop: '2px solid var(--color-border)', fontWeight: 'bold' }}>
                                    <td>{language === 'fr' ? 'Total' : 'Total'}</td>
                                    <td className="text-right">
                                        {formatCurrency(monthlyBalances[monthlyBalances.length - 1]?.openingBalance || 0)}
                                    </td>
                                    <td className="text-right text-success">
                                        {formatCurrency(monthlyBalances.reduce((sum, b) => sum + b.totalIncome, 0))}
                                    </td>
                                    <td className="text-right text-danger">
                                        {formatCurrency(monthlyBalances.reduce((sum, b) => sum + b.totalExpenses, 0))}
                                    </td>
                                    <td className="text-right" style={{
                                        color: monthlyBalances[0]?.closingBalance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                                    }}>
                                        {formatCurrency(monthlyBalances[0]?.closingBalance || 0)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

                {monthlyBalances.length === 0 && (
                    <p className="text-muted text-center" style={{ padding: 'var(--spacing-xl)' }}>
                        {language === 'fr' ? 'Aucune donnée disponible' : 'No data available'}
                    </p>
                )}
            </div>
        </div>
    );
};
