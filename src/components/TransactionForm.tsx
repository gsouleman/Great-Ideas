import React, { useState } from 'react';
import { Transaction, Language } from '../types';
import { generateId } from '../utils/calculations';
import { translations } from '../utils/translations';

interface TransactionFormProps {
    transaction?: Transaction;
    onSave: (transaction: Transaction) => void;
    onCancel: () => void;
    language: Language;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
    transaction,
    onSave,
    onCancel,
    language
}) => {
    const t = translations[language];
    const [formData, setFormData] = useState<Partial<Transaction>>({
        id: transaction?.id || generateId(),
        date: transaction?.date || new Date().toISOString().split('T')[0],
        description: transaction?.description || '',
        amount: transaction?.amount || 0,
        type: transaction?.type || 'income',
        category: transaction?.category || '',
        notes: transaction?.notes || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.description && formData.amount && formData.amount > 0) {
            onSave(formData as Transaction);
        }
    };

    const categories = [
        { value: '', label: t.other },
        { value: t.membershipFees, label: t.membershipFees },
        { value: t.donations, label: t.donations },
        { value: t.fundraising, label: t.fundraising },
        { value: t.grants, label: t.grants },
        { value: t.commission, label: t.commission },
        { value: t.logistics, label: t.logistics },
        { value: t.downPayment, label: t.downPayment },
        { value: t.adminFee, label: t.adminFee },
        { value: t.monthlyRunningCost, label: t.monthlyRunningCost },
        { value: t.installmentPayments, label: t.installmentPayments },
        { value: t.rent, label: t.rent },
        { value: t.utilities, label: t.utilities },
        { value: t.officeSupplies, label: t.officeSupplies },
        { value: t.events, label: t.events },
        { value: t.bankFees, label: t.bankFees },
        { value: t.insurance, label: t.insurance },
        { value: t.training, label: t.training }
    ];

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {transaction ? t.edit : t.add} {t.transactions}
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">{t.date}</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t.description}</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder={language === 'fr' ? 'Ex: Cotisation mensuelle' : 'E.g., Monthly membership fee'}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t.type}</label>
                            <select
                                className="form-select"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                                required
                            >
                                <option value="income">{t.income}</option>
                                <option value="expense">{t.expense}</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t.amount}</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                placeholder="0"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t.category}</label>
                            <select
                                className="form-select"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t.notes}</label>
                            <textarea
                                className="form-textarea"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder={language === 'fr' ? 'Notes optionnelles...' : 'Optional notes...'}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onCancel}>
                            {t.cancel}
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {t.save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
