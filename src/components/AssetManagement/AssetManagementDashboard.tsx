import React, { useState } from 'react';
import { Language, AssetView } from '../../types/assets';
import { translations } from '../../utils/translations';
import { loadMembers, loadAssets, loadPaymentPlans, loadAssetShareConfigs } from '../../utils/assetStorage';
import { formatCurrency } from '../../utils/calculations';
import { MembersList } from './MembersList';
import { AssetsList } from './AssetsList';
import { DocumentsManager } from './DocumentsManager';
import { PaymentTracker } from './PaymentTracker';
import { SharedValueManager } from './SharedValueManager';
import { MemberAssetShares } from './MemberAssetShares';

interface AssetManagementDashboardProps {
    language: Language;
    activeView: AssetView;
    onViewChange: (view: AssetView) => void;
}

export const AssetManagementDashboard: React.FC<AssetManagementDashboardProps> = ({
    language,
    activeView,
    onViewChange
}) => {
    const t = translations[language];

    // Sub-component for the main dashboard content
    const DashboardMain = () => {
        const [members] = useState(loadMembers());
        const [assets] = useState(loadAssets());
        const [paymentPlans] = useState(loadPaymentPlans());
        const [shareConfigs] = useState(loadAssetShareConfigs());

        const totalMembers = members.length;
        const totalShares = members.reduce((sum, m) => sum + m.sharesOwned, 0);
        const totalLandArea = members.reduce((sum, m) => sum + m.landSizeM2, 0);

        const totalAssetsValue = assets.reduce((sum, a) => {
            const config = shareConfigs.find(c => c.assetId === a.id);
            if (!config || !config.currentPrice) return sum + (a.currentValue || 0);

            if (a.type === 'realEstate' && a.size) {
                const sizeMatch = a.size.trim().toLowerCase().match(/^([\d,.]+)\s*(ha|m2|m²)?/);
                if (sizeMatch) {
                    const sizeValue = parseFloat(sizeMatch[1].replace(/,/g, ''));
                    const sizeUnit = sizeMatch[2] || '';
                    const value = sizeUnit === 'ha' ? config.currentPrice * sizeValue * 10000 : config.currentPrice * sizeValue;
                    return sum + value;
                }
            }
            return sum + config.currentPrice;
        }, 0);

        const pendingPayments = paymentPlans.reduce((sum, plan) => {
            const unpaid = plan.payments.filter(p => p.status === 'pending' || p.status === 'overdue');
            return sum + unpaid.reduce((pSum, p) => pSum + p.amount, 0);
        }, 0);

        return (
            <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                    <div className="card card-compact">
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>{t.totalMembers}</p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>{totalMembers}</p>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>{t.totalShares}: {totalShares.toLocaleString()}</p>
                    </div>

                    <div className="card card-compact">
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>{t.totalAssets}</p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>{assets.length}</p>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>{t.totalValue}: {formatCurrency(totalAssetsValue)}</p>
                    </div>

                    <div className="card card-compact">
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>{language === 'fr' ? 'Superficie Totale' : 'Total Land Area'}</p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-success)' }}>{(totalLandArea / 10000).toFixed(2)} ha</p>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>{totalLandArea.toLocaleString()} m²</p>
                    </div>

                    <div className="card card-compact">
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>{t.outstanding}</p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-danger)' }}>{formatCurrency(pendingPayments)}</p>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>{language === 'fr' ? 'Paiements en Attente' : 'Pending Payments'}</p>
                    </div>
                </div>

                <div className="card">
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>{language === 'fr' ? 'Actifs Récents' : 'Recent Assets'}</h2>
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {assets.slice(0, 3).map((asset) => (
                            <div key={asset.id} style={{ padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-secondary)' }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>{asset.name}</h3>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                                            {asset.type === 'realEstate' && '🏢 ' + t.realEstate}
                                            {asset.type === 'vehicleTransport' && '🚗 ' + t.vehicleTransport}
                                            {asset.type === 'equipment' && '🔧 ' + t.equipment}
                                            {asset.type === 'investment' && '📈 ' + t.investment}
                                            {asset.type === 'other' && '📦 ' + t.other}
                                        </p>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>📍 {asset.location}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p className="text-success" style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>{formatCurrency(asset.currentValue || 0)}</p>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>{new Date(asset.purchaseDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    };

    const renderContent = () => {
        switch (activeView) {
            case 'members': return <MembersList language={language} />;
            case 'assets': return <AssetsList language={language} />;
            case 'documents': return <DocumentsManager language={language} />;
            case 'payments': return <PaymentTracker language={language} />;
            case 'sharedValue': return <SharedValueManager language={language} />;
            case 'memberShares': return <MemberAssetShares language={language} />;
            default: return <DashboardMain />;
        }
    };

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {t.assetManagement}
                </h1>
            </div>

            {/* Sub-navigation */}
            <div className="mb-lg" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                    <button
                        className="nav-link"
                        style={{ color: activeView === 'dashboard' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: activeView === 'dashboard' ? '2px solid var(--color-primary)' : 'none' }}
                        onClick={() => onViewChange('dashboard')}
                    >
                        {t.dashboard.toUpperCase()}
                    </button>
                    <button
                        className="nav-link"
                        style={{ color: activeView === 'members' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: activeView === 'members' ? '2px solid var(--color-primary)' : 'none' }}
                        onClick={() => onViewChange('members')}
                    >
                        {t.members.toUpperCase()}
                    </button>
                    <button
                        className="nav-link"
                        style={{ color: activeView === 'assets' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: activeView === 'assets' ? '2px solid var(--color-primary)' : 'none' }}
                        onClick={() => onViewChange('assets')}
                    >
                        {t.assets.toUpperCase()}
                    </button>
                    <button
                        className="nav-link"
                        style={{ color: activeView === 'documents' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: activeView === 'documents' ? '2px solid var(--color-primary)' : 'none' }}
                        onClick={() => onViewChange('documents')}
                    >
                        {t.documents.toUpperCase()}
                    </button>
                    <button
                        className="nav-link"
                        style={{ color: activeView === 'payments' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: activeView === 'payments' ? '2px solid var(--color-primary)' : 'none' }}
                        onClick={() => onViewChange('payments')}
                    >
                        {t.payments.toUpperCase()}
                    </button>
                    <button
                        className="nav-link"
                        style={{ color: activeView === 'sharedValue' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: activeView === 'sharedValue' ? '2px solid var(--color-primary)' : 'none' }}
                        onClick={() => onViewChange('sharedValue')}
                    >
                        {t.sharedValue.toUpperCase()}
                    </button>
                    <button
                        className="nav-link"
                        style={{ color: activeView === 'memberShares' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: activeView === 'memberShares' ? '2px solid var(--color-primary)' : 'none' }}
                        onClick={() => onViewChange('memberShares')}
                    >
                        {t.memberShares.toUpperCase()}
                    </button>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};
