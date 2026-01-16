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

    // Render the active sub-view
    if (activeView === 'members') {
        return <MembersList language={language} />;
    }

    if (activeView === 'assets') {
        return <AssetsList language={language} />;
    }

    if (activeView === 'documents') {
        return <DocumentsManager language={language} />;
    }

    if (activeView === 'payments') {
        return <PaymentTracker language={language} />;
    }

    if (activeView === 'sharedValue') {
        return <SharedValueManager language={language} />;
    }

    if (activeView === 'memberShares') {
        return <MemberAssetShares language={language} />;
    }

    // Dashboard view
    const [members] = useState(loadMembers());
    const [assets] = useState(loadAssets());
    const [paymentPlans] = useState(loadPaymentPlans());
    const [shareConfigs] = useState(loadAssetShareConfigs());

    // Helper function to calculate current value for an asset
    const calculateCurrentValue = (asset: typeof assets[0]): number => {
        const config = shareConfigs.find(c => c.assetId === asset.id);

        if (!config || !config.currentPrice) {
            return asset.currentValue || 0;
        }

        if (asset.type === 'realEstate' && asset.size) {
            // Parse size to extract numeric value and unit
            const sizeStr = asset.size.trim().toLowerCase();
            const sizeMatch = sizeStr.match(/^([\d,.]+)\s*(ha|m2|m²)?/);

            if (sizeMatch) {
                const sizeValue = parseFloat(sizeMatch[1].replace(/,/g, ''));
                const sizeUnit = sizeMatch[2] || '';

                if (sizeUnit === 'ha') {
                    return config.currentPrice * sizeValue * 10000;
                } else {
                    return config.currentPrice * sizeValue;
                }
            }
        }

        // For other asset types, Current Value = Current Price
        return config.currentPrice;
    };

    // Calculate summary statistics
    const totalMembers = members.length;
    const totalShares = members.reduce((sum, m) => sum + m.sharesOwned, 0);
    const totalLandArea = members.reduce((sum, m) => sum + m.landSizeM2, 0);
    const totalAssetsValue = assets.reduce((sum, a) => sum + calculateCurrentValue(a), 0);

    const pendingPayments = paymentPlans.reduce((sum, plan) => {
        const unpaid = plan.payments.filter(p => p.status === 'pending' || p.status === 'overdue');
        return sum + unpaid.reduce((pSum, p) => pSum + p.amount, 0);
    }, 0);

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {t.assetManagement}
                </h1>
            </div>

            {/* Sub-navigation */}
            <div className="card mb-lg" style={{ padding: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => onViewChange('dashboard')}
                    >
                        📊 {t.dashboard}
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => onViewChange('members')}
                    >
                        👥 {t.members}
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => onViewChange('assets')}
                    >
                        🏢 {t.assets}
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => onViewChange('documents')}
                    >
                        📄 {t.documents}
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => onViewChange('payments')}
                    >
                        💳 {t.payments}
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => onViewChange('sharedValue')}
                    >
                        🤝 {t.sharedValue}
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => onViewChange('memberShares')}
                    >
                        📊 {t.memberShares}
                    </button>
                </div>
            </div>

            {/* Dashboard Summary Cards */}
            <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                    <div className="card card-compact">
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                            {t.totalMembers}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                            {totalMembers}
                        </p>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                            {t.totalShares}: {totalShares.toLocaleString()}
                        </p>
                    </div>

                    <div className="card card-compact">
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                            {t.totalAssets}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                            {assets.length}
                        </p>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                            {t.totalValue}: {formatCurrency(totalAssetsValue)}
                        </p>
                    </div>

                    <div className="card card-compact">
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                            {language === 'fr' ? 'Superficie Totale' : 'Total Land Area'}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-success)' }}>
                            {(totalLandArea / 10000).toFixed(2)} ha
                        </p>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                            {totalLandArea.toLocaleString()} m²
                        </p>
                    </div>

                    <div className="card card-compact">
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                            {t.outstanding}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-danger)' }}>
                            {formatCurrency(pendingPayments)}
                        </p>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                            {language === 'fr' ? 'Paiements en Attente' : 'Pending Payments'}
                        </p>
                    </div>
                </div>

                {/* Recent Assets */}
                <div className="card">
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>
                        {language === 'fr' ? 'Actifs Récents' : 'Recent Assets'}
                    </h2>
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {assets.slice(0, 3).map((asset) => (
                            <div
                                key={asset.id}
                                style={{
                                    padding: 'var(--spacing-md)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--color-bg-secondary)'
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                                            {asset.name}
                                        </h3>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                                            {asset.type === 'realEstate' && '🏢 ' + t.realEstate}
                                            {asset.type === 'vehicleTransport' && '🚗 ' + t.vehicleTransport}
                                            {asset.type === 'equipment' && '🔧 ' + t.equipment}
                                            {asset.type === 'investment' && '📈 ' + t.investment}
                                            {asset.type === 'other' && '📦 ' + t.other}
                                        </p>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                                            📍 {asset.location}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p className="text-success" style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
                                            {formatCurrency(calculateCurrentValue(asset))}
                                        </p>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                                            {new Date(asset.purchaseDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        </div>
    );
};
