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
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>{text.title}</h2>

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <div className="card" style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {stats.total}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
                        {text.totalDocs}
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                        {stats.generated}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
                        {text.generated}
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--info-color)' }}>
                        {stats.uploaded}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
                        {text.uploaded}
                    </div>
                </div>

                {stats.pendingApproval > 0 && (
                    <div className="card" style={{ padding: 'var(--spacing-md)', textAlign: 'center', borderColor: 'var(--warning-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>
                            {stats.pendingApproval}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
                            {text.pendingApproval}
                        </div>
                    </div>
                )}

                {stats.pendingVerification > 0 && (
                    <div className="card" style={{ padding: 'var(--spacing-md)', textAlign: 'center', borderColor: 'var(--warning-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>
                            {stats.pendingVerification}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
                            {text.pendingVerification}
                        </div>
                    </div>
                )}

                {stats.expiringSoon > 0 && (
                    <div className="card" style={{ padding: 'var(--spacing-md)', textAlign: 'center', borderColor: 'var(--error-color)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--error-color)' }}>
                            {stats.expiringSoon}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
                            {text.expiringSoon}
                        </div>
                    </div>
                )}
            </div>

            {/* Category Breakdown */}
            <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>{text.byCategory}</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Catégorie</th>
                                <th>Total</th>
                                <th>{text.generated}</th>
                                <th>{text.uploaded}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(categoryBreakdown).map(([category, data]) => (
                                <tr key={category}>
                                    <td>{categoryLabels[category as DocumentCategory]}</td>
                                    <td><strong>{data.total}</strong></td>
                                    <td>{data.generated}</td>
                                    < td>{data.uploaded}</td>
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
