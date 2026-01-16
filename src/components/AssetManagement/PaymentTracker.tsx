import React, { useState, useEffect } from 'react';
import { PaymentPlan, Payment, Language } from '../../types/assets';
import { translations } from '../../utils/translations';
import { formatCurrency, formatDate } from '../../utils/calculations';
import { loadPaymentPlans, updatePaymentPlan, addPaymentPlan, deletePaymentPlan, loadMembers } from '../../utils/assetStorage';

interface PaymentTrackerProps {
    language: Language;
}

export const PaymentTracker: React.FC<PaymentTrackerProps> = ({ language }) => {
    const t = translations[language];
    const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
    const [activeTab, setActiveTab] = useState<'asset' | 'membership' | 'all'>('all');
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [editingPayment, setEditingPayment] = useState<{ plan: PaymentPlan; payment: Payment } | null>(null);

    useEffect(() => {
        setPaymentPlans(loadPaymentPlans());
    }, []);

    const handleRecordPayment = (planId: string, paymentId: string) => {
        const plan = paymentPlans.find(p => p.id === planId);
        if (plan) {
            const updatedPayments = plan.payments.map(p => {
                if (p.id === paymentId && p.status !== 'paid') {
                    return { ...p, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0] };
                }
                return p;
            });
            updatePaymentPlan(planId, { ...plan, payments: updatedPayments });
            setPaymentPlans(loadPaymentPlans());
        }
    };

    const handleDeletePayment = (planId: string, paymentId: string) => {
        const plan = paymentPlans.find(p => p.id === planId);
        if (plan && window.confirm(language === 'fr' ? 'Supprimer ce paiement?' : 'Delete this payment?')) {
            const updatedPayments = plan.payments.filter(p => p.id !== paymentId);
            if (updatedPayments.length === 0) {
                deletePaymentPlan(planId);
            } else {
                updatePaymentPlan(planId, { ...plan, payments: updatedPayments });
            }
            setPaymentPlans(loadPaymentPlans());
        }
    };

    const handleEditPayment = (plan: PaymentPlan, payment: Payment) => {
        setEditingPayment({ plan, payment });
        setShowPaymentForm(true);
    };

    const handleSavePayment = (payment: Payment, planId?: string) => {
        if (editingPayment) {
            const plan = editingPayment.plan;
            const updatedPayments = plan.payments.map(p => p.id === payment.id ? payment : p);
            updatePaymentPlan(plan.id, { ...plan, payments: updatedPayments });
        } else {
            if (planId) {
                const plan = paymentPlans.find(p => p.id === planId);
                if (plan) {
                    updatePaymentPlan(planId, { ...plan, payments: [...plan.payments, payment] });
                }
            } else {
                const members = loadMembers();
                const member = members.find(m => m.id === payment.memberId);
                if (member) {
                    const newPlan: PaymentPlan = {
                        id: Date.now().toString(),
                        memberId: member.id,
                        memberName: member.name,
                        totalAmount: payment.amount,
                        downPayment: 0,
                        balance: payment.amount,
                        quarterlyAmount: 0,
                        startDate: payment.dueDate,
                        payments: [payment]
                    };
                    addPaymentPlan(newPlan);
                }
            }
        }
        setPaymentPlans(loadPaymentPlans());
        setShowPaymentForm(false);
        setEditingPayment(null);
    };

    const filteredPlans = activeTab === 'all' ? paymentPlans : paymentPlans.filter(p => p.payments.some(pay => pay.type === activeTab));

    const stats = filteredPlans.reduce((acc, plan) => {
        plan.payments.forEach(payment => {
            if (payment.status === 'paid') {
                acc.totalPaid += payment.amount;
            } else {
                acc.totalDue += payment.amount;
                if (payment.status === 'overdue' || new Date(payment.dueDate) < new Date()) {
                    acc.totalOverdue += payment.amount;
                }
            }
        });
        return acc;
    }, { totalDue: 0, totalPaid: 0, totalOverdue: 0 });

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>{t.payments}</h1>
                <button className="btn btn-primary" onClick={() => { setEditingPayment(null); setShowPaymentForm(true); }}>
                    <span>+</span> {language === 'fr' ? 'Ajouter Paiement' : 'Add Payment'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>{t.outstanding}</p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-danger)' }}>{formatCurrency(stats.totalDue)}</p>
                </div>
                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>{t.paid}</p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-success)' }}>{formatCurrency(stats.totalPaid)}</p>
                </div>
                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>{t.overdue}</p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-warning)' }}>{formatCurrency(stats.totalOverdue)}</p>
                </div>
            </div>

            <div className="card mb-lg" style={{ padding: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button className={activeTab === 'all' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setActiveTab('all')}>
                        {language === 'fr' ? 'Tous' : 'All'}
                    </button>
                    <button className={activeTab === 'asset' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setActiveTab('asset')}>
                        {t.assetPayment}
                    </button>
                    <button className={activeTab === 'membership' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setActiveTab('membership')}>
                        {t.membershipFee}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {filteredPlans.length === 0 ? (
                    <div className="card">
                        <p className="text-muted text-center" style={{ padding: 'var(--spacing-xl)' }}>
                            {language === 'fr' ? 'Aucun plan de paiement' : 'No payment plans'}
                        </p>
                    </div>
                ) : (
                    filteredPlans.map(plan => (
                        <div key={plan.id} className="card">
                            <div className="flex justify-between items-start mb-md">
                                <div>
                                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>{plan.memberName}</h3>
                                    {plan.assetName && <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>{plan.assetName}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>{language === 'fr' ? 'Total Paiements' : 'Total Payments'}</p>
                                    <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{plan.payments.length}</p>
                                </div>
                            </div>

                            <div className="table-container">
                                <table className="table" style={{ fontSize: 'var(--font-size-sm)' }}>
                                    <thead>
                                        <tr>
                                            <th>{language === 'fr' ? 'Description' : 'Description'}</th>
                                            <th>{language === 'fr' ? 'Type' : 'Type'}</th>
                                            <th className="text-right">{t.amount}</th>
                                            <th>{t.dueDate}</th>
                                            <th>{t.paidDate}</th>
                                            <th>{language === 'fr' ? 'Statut' : 'Status'}</th>
                                            <th className="text-center no-print">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plan.payments.map(payment => (
                                            <tr key={payment.id}>
                                                <td>{payment.description || (payment.quarter ? `Q${payment.quarter} ${payment.year}` : payment.type)}</td>
                                                <td>
                                                    <span className="badge" style={{ fontSize: 'var(--font-size-xs)' }}>
                                                        {payment.type === 'asset' && (language === 'fr' ? 'Actif' : 'Asset')}
                                                        {payment.type === 'membership' && (language === 'fr' ? 'Cotisation' : 'Membership')}
                                                        {payment.type === 'commission' && 'Commission'}
                                                        {payment.type === 'other' && (language === 'fr' ? 'Autre' : 'Other')}
                                                    </span>
                                                </td>
                                                <td className="text-right font-bold">{formatCurrency(payment.amount)}</td>
                                                <td>{formatDate(payment.dueDate)}</td>
                                                <td>{payment.paidDate ? formatDate(payment.paidDate) : '-'}</td>
                                                <td>
                                                    {payment.status === 'paid' && <span className="badge badge-income">{t.paid}</span>}
                                                    {payment.status === 'pending' && (
                                                        <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--color-warning)', border: '2px solid var(--color-warning)' }}>
                                                            {t.pending}
                                                        </span>
                                                    )}
                                                    {payment.status === 'overdue' && <span className="badge badge-expense">{t.overdue}</span>}
                                                </td>
                                                <td className="no-print">
                                                    <div className="flex gap-sm justify-center">
                                                        {payment.status !== 'paid' && (
                                                            <button className="btn btn-sm btn-primary" onClick={() => handleRecordPayment(plan.id, payment.id)}>
                                                                {t.recordPayment}
                                                            </button>
                                                        )}
                                                        <button className="btn btn-sm btn-outline" onClick={() => handleEditPayment(plan, payment)}>{t.edit}</button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeletePayment(plan.id, payment.id)}>{t.delete}</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showPaymentForm && <PaymentFormModal payment={editingPayment?.payment} language={language} onSave={handleSavePayment} onClose={() => { setShowPaymentForm(false); setEditingPayment(null); }} />}
        </div>
    );
};

interface PaymentFormModalProps {
    payment: Payment | null | undefined;
    language: Language;
    onSave: (payment: Payment, planId?: string) => void;
    onClose: () => void;
}

const PaymentFormModal: React.FC<PaymentFormModalProps> = ({ payment, language, onSave, onClose }) => {
    const t = translations[language];
    const members = loadMembers();
    const paymentPlans = loadPaymentPlans();

    const [formData, setFormData] = useState<Payment>(payment || {
        id: Date.now().toString(),
        planId: '',
        memberId: '',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        year: new Date().getFullYear(),
        type: 'membership',
        description: '',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.memberId) {
            alert(language === 'fr' ? 'Veuillez sélectionner un membre' : 'Please select a member');
            return;
        }
        const existingPlan = paymentPlans.find(p => p.memberId === formData.memberId);
        onSave(formData, existingPlan?.id);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{payment ? (language === 'fr' ? 'Modifier Paiement' : 'Edit Payment') : (language === 'fr' ? 'Ajouter Paiement' : 'Add Payment')}</h2>
                    <button className="btn-icon" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">{language === 'fr' ? 'Membre' : 'Member'} *</label>
                            <select className="form-select" value={formData.memberId} onChange={e => setFormData({ ...formData, memberId: e.target.value })} required disabled={!!payment}>
                                <option value="">{language === 'fr' ? 'Sélectionner un membre' : 'Select a member'}</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>{member.name} {member.remarks && `(${member.remarks})`}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="form-label">{language === 'fr' ? 'Type de Paiement' : 'Payment Type'} *</label>
                                <select className="form-select" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} required>
                                    <option value="membership">{language === 'fr' ? 'Cotisation Membre' : 'Membership Fee'}</option>
                                    <option value="asset">{language === 'fr' ? 'Paiement d\'Actif (Trimestriel)' : 'Asset Payment (Quarterly)'}</option>
                                    <option value="commission">Commission</option>
                                    <option value="other">{language === 'fr' ? 'Autre' : 'Other'}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t.amount} *</label>
                                <input type="number" className="form-input" value={formData.amount} onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} min="0" step="1000" required />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="form-label">{t.dueDate} *</label>
                                <input type="date" className="form-input" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} required />
                            </div>
                            {formData.type === 'asset' && (
                                <div className="form-group">
                                    <label className="form-label">{t.quarter}</label>
                                    <select className="form-select" value={formData.quarter || ''} onChange={e => setFormData({ ...formData, quarter: parseInt(e.target.value) || undefined })}>
                                        <option value="">N/A</option>
                                        <option value="1">Q1</option>
                                        <option value="2">Q2</option>
                                        <option value="3">Q3</option>
                                        <option value="4">Q4</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">{language === 'fr' ? 'Description' : 'Description'}</label>
                            <input type="text" className="form-input" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder={language === 'fr' ? 'Ex: Cotisation annuelle 2025' : 'Ex: Annual membership 2025'} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t.notes}</label>
                            <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={2} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>{t.cancel}</button>
                        <button type="submit" className="btn btn-primary">{t.save}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
