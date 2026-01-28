import React, { useState, useEffect } from 'react';
import {
    getAllDocumentsUnified,
    loadGeneratedDocuments,
    loadUploadedDocuments,
    getExpiringDocuments
} from '../../utils/documentStorage';
import { DocumentCategory, VerificationStatus, DocumentStatus } from '../../types/documents';

interface DocumentDashboardProps {
    language: 'fr' | 'en';
}

const DocumentDashboard: React.FC<DocumentDashboardProps> = ({ language }) => {
    const [stats, setStats] = useState({
        total: 0,
        generated: 0,
        uploaded: 0,
        pendingApproval: 0,
        pendingVerification: 0,
        expiringSoon: 0
    });

    const [categoryBreakdown, setCategoryBreakdown] = useState<Record<DocumentCategory, {
        total: number;
        generated: number;
        uploaded: number;
    }>>({} as any);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = () => {
        const allDocs = getAllDocumentsUnified();
        const generatedDocs = loadGeneratedDocuments();
        const uploadedDocs = loadUploadedDocuments();
        const expiringDocs = getExpiringDocuments(30);

        const pendingApproval = generatedDocs.filter(
            d => d.status === DocumentStatus.PENDING_APPROVAL
        ).length;

        const pendingVerification = uploadedDocs.filter(
            d => d.verificationStatus === VerificationStatus.PENDING
        ).length;

        setStats({
            total: allDocs.length,
            generated: generatedDocs.length,
            uploaded: uploadedDocs.filter(d => d.isActive).length,
            pendingApproval,
            pendingVerification,
            expiringSoon: expiringDocs.length
        });

        // Calculate category breakdown
        const breakdown: Record<string, { total: number; generated: number; uploaded: number }> = {};

        Object.values(DocumentCategory).forEach(category => {
            const genCount = generatedDocs.filter(d => d.category === category).length;
            const upCount = uploadedDocs.filter(d => d.category === category && d.isActive).length;

            breakdown[category] = {
                total: genCount + upCount,
                generated: genCount,
                uploaded: upCount
            };
        });

        setCategoryBreakdown(breakdown as any);
    };

    const t = {
        fr: {
            title: 'Tableau de Bord Documents',
            totalDocs: 'Total Documents',
            generated: 'Générés',
            uploaded: 'Téléchargés',
            pendingApproval: 'En attente d\'approbation',
            pendingVerification: 'En attente de vérification',
            expiringSoon: 'Expirent bientôt (30j)',
            byCategory: 'Par Catégorie',
            membership: 'Adhésion',
            shares: 'Actions',
            land: 'Terrain',
            financial: 'Financier',
            governance: 'Gouvernance',
            succession: 'Succession'
        },
        en: {
            title: 'Documents Dashboard',
            totalDocs: 'Total Documents',
            generated: 'Generated',
            uploaded: 'Uploaded',
            pendingApproval: 'Pending Approval',
            pendingVerification: 'Pending Verification',
            expiringSoon: 'Expiring Soon (30d)',
            byCategory: 'By Category',
            membership: 'Membership',
            shares: 'Shares',
            land: 'Land',
            financial: 'Financial',
            governance: 'Governance',
            succession: 'Succession'
        }
    };

    const text = t[language];

    const categoryLabels: Record<DocumentCategory, string> = {
        [DocumentCategory.MEMBERSHIP]: text.membership,
        [DocumentCategory.SHARES]: text.shares,
        [DocumentCategory.LAND]: text.land,
        [DocumentCategory.FINANCIAL]: text.financial,
        [DocumentCategory.GOVERNANCE]: text.governance,
        [DocumentCategory.SUCCESSION]: text.succession
    };

    return (
        <div className="fade-in">
            <div style={{ padding: 'var(--spacing-lg)', borderBottom: '4px solid #000000', marginBottom: 'var(--spacing-xl)' }}>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                    {text.title}
                </h2>
            </div>

            {/* Summary Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-2xl)'
            }}>
                <div className="card" style={{ padding: 'var(--spacing-lg)', borderTop: '4px solid #000000' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {text.totalDocs}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: '#000000' }}>
                        {stats.total}
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-lg)', borderTop: '4px solid var(--color-success)' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {text.generated}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: 'var(--color-success)' }}>
                        {stats.generated}
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-lg)', borderTop: '4px solid var(--color-primary)' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {text.uploaded}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: 'var(--color-primary)' }}>
                        {stats.uploaded}
                    </div>
                </div>

                {stats.pendingApproval > 0 && (
                    <div className="card" style={{ padding: 'var(--spacing-lg)', borderTop: '4px solid var(--color-warning)', background: '#fffbeb' }}>
                        <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                            {text.pendingApproval}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: '#d97706' }}>
                            {stats.pendingApproval}
                        </div>
                    </div>
                )}

                {stats.expiringSoon > 0 && (
                    <div className="card" style={{ padding: 'var(--spacing-lg)', borderTop: '4px solid var(--color-danger)', background: '#fef2f2' }}>
                        <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                            {text.expiringSoon}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: 'var(--color-danger)' }}>
                            {stats.expiringSoon}
                        </div>
                    </div>
                )}
            </div>

            {/* Category Breakdown */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--spacing-md) var(--spacing-lg)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                        {text.byCategory}
                    </h3>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{language === 'fr' ? 'CATÉGORIE' : 'CATEGORY'}</th>
                                <th className="text-center">TOTAL</th>
                                <th className="text-center">{text.generated.toUpperCase()}</th>
                                <th className="text-center">{text.uploaded.toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(categoryBreakdown).map(([category, data]) => (
                                <tr key={category}>
                                    <td style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                        {categoryLabels[category as DocumentCategory]}
                                    </td>
                                    <td className="text-center" style={{ fontWeight: 900 }}>{data.total}</td>
                                    <td className="text-center" style={{ color: data.generated > 0 ? 'var(--color-success)' : 'inherit', fontWeight: data.generated > 0 ? 700 : 400 }}>{data.generated}</td>
                                    <td className="text-center" style={{ color: data.uploaded > 0 ? 'var(--color-primary)' : 'inherit', fontWeight: data.uploaded > 0 ? 700 : 400 }}>{data.uploaded}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DocumentDashboard;
