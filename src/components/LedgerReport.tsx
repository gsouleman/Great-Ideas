import React, { useState } from 'react';
import { Transaction, Language, LedgerFilter } from '../types';
import { filterTransactions, calculateSummary, formatCurrency, formatDate } from '../utils/calculations';
import { translations } from '../utils/translations';
import { generateLedgerPDF } from '../utils/pdfGenerator';

interface LedgerReportProps {
    transactions: Transaction[];
    language: Language;
}

export const LedgerReport: React.FC<LedgerReportProps> = ({ transactions, language }) => {
    const t = translations[language];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const [filter, setFilter] = useState<LedgerFilter>({
        periodType: 'all'
    });
    const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [minAmount, setMinAmount] = useState<string>('');
    const [maxAmount, setMaxAmount] = useState<string>('');

    // Apply period filter first
    let filtered = filterTransactions(transactions, filter);

    // Apply type filter
    if (typeFilter !== 'all') {
        filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Apply amount range filter
    if (minAmount !== '') {
        const min = parseFloat(minAmount);
        if (!isNaN(min)) {
            filtered = filtered.filter(t => t.amount >= min);
        }
    }
    if (maxAmount !== '') {
        const max = parseFloat(maxAmount);
        if (!isNaN(max)) {
            filtered = filtered.filter(t => t.amount <= max);
        }
    }

    // Sort by date
    filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const summary = calculateSummary(filtered);

    const years = Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear()))).sort((a, b) => b - a);
    const months = [
        { value: 0, label: t.january },
        { value: 1, label: t.february },
        { value: 2, label: t.march },
        { value: 3, label: t.april },
        { value: 4, label: t.may },
        { value: 5, label: t.june },
        { value: 6, label: t.july },
        { value: 7, label: t.august },
        { value: 8, label: t.september },
        { value: 9, label: t.october },
        { value: 10, label: t.november },
        { value: 11, label: t.december }
    ];

    const handlePeriodTypeChange = (type: string) => {
        if (type === 'all') {
            setFilter({ periodType: 'all' });
        } else if (type === 'year') {
            setFilter({ periodType: 'year', year: currentYear });
        } else if (type === 'month') {
            setFilter({ periodType: 'month', year: currentYear, month: currentMonth });
        } else if (type === 'custom') {
            setFilter({
                periodType: 'custom',
                startDate: new Date(currentYear, 0, 1).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
            });
        }
    };

    const handleExportPDF = () => {
        generateLedgerPDF(transactions, filter, language);
    };

    const handleClearFilters = () => {
        setFilter({ periodType: 'all' });
        setTypeFilter('all');
        setMinAmount('');
        setMaxAmount('');
    };

    const hasActiveFilters = filter.periodType !== 'all' || typeFilter !== 'all' || minAmount !== '' || maxAmount !== '';

    // Calculate running balance
    let runningBalance = 0;
    const transactionsWithBalance = filtered.map(t => {
        runningBalance += t.type === 'income' ? t.amount : -t.amount;
        return { ...t, balance: runningBalance };
    });

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {t.ledgerReport}
                </h1>
                <button className="btn btn-primary no-print" onClick={handleExportPDF}>
                    📄 {t.exportPDF}
                </button>
            </div>

            {/* Period Filters */}
            <div className="card mb-lg no-print">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{t.period}</label>
                        <select
                            className="form-select"
                            value={filter.periodType}
                            onChange={(e) => handlePeriodTypeChange(e.target.value)}
                        >
                            <option value="all">{t.allTime}</option>
                            <option value="year">{t.year}</option>
                            <option value="month">{t.month}</option>
                            <option value="custom">{t.customRange}</option>
                        </select>
                    </div>

                    {filter.periodType === 'year' && (
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">{t.selectYear}</label>
                            <select
                                className="form-select"
                                value={filter.year}
                                onChange={(e) => setFilter({ ...filter, year: parseInt(e.target.value) })}
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {filter.periodType === 'month' && (
                        <>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">{t.selectYear}</label>
                                <select
                                    className="form-select"
                                    value={filter.year}
                                    onChange={(e) => setFilter({ ...filter, year: parseInt(e.target.value) })}
                                >
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">{t.selectMonth}</label>
                                <select
                                    className="form-select"
                                    value={filter.month}
                                    onChange={(e) => setFilter({ ...filter, month: parseInt(e.target.value) })}
                                >
                                    {months.map(month => (
                                        <option key={month.value} value={month.value}>{month.label}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {filter.periodType === 'custom' && (
                        <>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">{t.startDate}</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={filter.startDate}
                                    onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">{t.endDate}</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={filter.endDate}
                                    onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Additional Filters */}
            <div className="card mb-lg no-print">
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                    {language === 'fr' ? 'Filtres Avancés' : 'Advanced Filters'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{t.type}</label>
                        <select
                            className="form-select"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                        >
                            <option value="all">{t.allTime}</option>
                            <option value="income">{t.income}</option>
                            <option value="expense">{t.expense}</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{t.minAmount}</label>
                        <input
                            type="number"
                            className="form-input"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            placeholder="0"
                            min="0"
                            step="1000"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{t.maxAmount}</label>
                        <input
                            type="number"
                            className="form-input"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            placeholder="999999"
                            min="0"
                            step="1000"
                        />
                    </div>

                    {hasActiveFilters && (
                        <div className="form-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'flex-end' }}>
                            <button
                                className="btn btn-outline"
                                onClick={handleClearFilters}
                                style={{ width: '100%' }}
                            >
                                {t.clearFilters}
                            </button>
                        </div>
                    )}
                </div>

                {hasActiveFilters && (
                    <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-sm)', background: 'rgba(41, 98, 255, 0.1)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            {language === 'fr' ? '🔍 Filtres actifs:' : '🔍 Active filters:'} {filtered.length} {language === 'fr' ? 'transaction(s)' : 'transaction(s)'}
                        </p>
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                        {t.totalIncome}
                    </p>
                    <p className="text-success" style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
                        {formatCurrency(summary.totalIncome)}
                    </p>
                </div>
                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                        {t.totalExpenses}
                    </p>
                    <p className="text-danger" style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
                        {formatCurrency(summary.totalExpenses)}
                    </p>
                </div>
                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                        {t.netBalance}
                    </p>
                    <p style={{
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 700,
                        color: summary.netBalance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                    }}>
                        {formatCurrency(summary.netBalance)}
                    </p>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="card">
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>
                    {t.transactions}
                </h2>

                {transactionsWithBalance.length === 0 ? (
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
                                    <th className="text-right">{language === 'fr' ? 'Crédit' : 'Credit'}</th>
                                    <th className="text-right">{language === 'fr' ? 'Débit' : 'Debit'}</th>
                                    <th className="text-right">{t.balance}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionsWithBalance.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td>
                                            {transaction.description}
                                            {transaction.category && (
                                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                                    {transaction.category}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${transaction.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                                                {transaction.type === 'income' ? t.income : t.expense}
                                            </span>
                                        </td>
                                        <td className="text-right" style={{ color: 'var(--color-success)', fontWeight: 500 }}>
                                            {transaction.type === 'income' ? formatCurrency(transaction.amount) : ''}
                                        </td>
                                        <td className="text-right" style={{ color: 'var(--color-danger)', fontWeight: 500 }}>
                                            {transaction.type === 'expense' ? formatCurrency(transaction.amount) : ''}
                                        </td>
                                        <td className="text-right font-bold" style={{
                                            color: transaction.balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                                        }}>
                                            {formatCurrency(transaction.balance)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ borderTop: '2px solid var(--color-border)' }}>
                                    <td colSpan={3} className="text-right font-bold">{language === 'fr' ? 'Totaux:' : 'Totals:'}</td>
                                    <td className="text-right font-bold text-success">{formatCurrency(summary.totalIncome)}</td>
                                    <td className="text-right font-bold text-danger">{formatCurrency(summary.totalExpenses)}</td>
                                    <td className="text-right font-bold" style={{
                                        color: summary.netBalance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                                    }}>
                                        {formatCurrency(summary.netBalance)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
