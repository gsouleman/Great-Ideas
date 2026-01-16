import React, { useState } from 'react';
import { Language } from '../../types/assets';
import { loadMemberAllocations, loadAssetShareConfigs, loadAssets } from '../../utils/assetStorage';
import { translations } from '../../utils/translations';

interface MemberAssetSharesProps {
    language: Language;
}

export const MemberAssetShares: React.FC<MemberAssetSharesProps> = ({ language }) => {
    const t = translations[language];
    const [allocations] = useState(loadMemberAllocations());
    const [shareConfigs] = useState(loadAssetShareConfigs());
    const [assets] = useState(loadAssets());

    // Helper function to get asset type
    const getAssetType = (assetId: string) => {
        const asset = assets.find(a => a.id === assetId);
        return asset?.type || 'other';
    };

    // Helper function to format asset value with unit from share config
    const formatAssetValue = (value: number, assetId: string) => {
        const config = shareConfigs.find(c => c.assetId === assetId);

        if (config && config.unit) {
            return `${value.toLocaleString()} ${config.unit}`;
        }

        return value.toLocaleString();
    };

    // Helper function to get asset type label
    const getAssetTypeLabel = (assetType: string) => {
        switch (assetType) {
            case 'realEstate': return t.realEstate;
            case 'vehicleTransport': return t.vehicleTransport;
            case 'equipment': return t.equipment;
            case 'investment': return t.investment;
            case 'other': return t.other;
            default: return assetType;
        }
    };

    // Group allocations by member
    const memberGroups = allocations.reduce((groups, allocation) => {
        if (!groups[allocation.memberId]) {
            groups[allocation.memberId] = {
                memberName: allocation.memberName,
                memberId: allocation.memberId,
                assets: []
            };
        }
        groups[allocation.memberId].assets.push(allocation);
        return groups;
    }, {} as Record<string, { memberName: string; memberId: string; assets: typeof allocations }>);

    const members = Object.values(memberGroups);

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                    {language === 'fr' ? 'Actions par Membre' : 'Member Asset Shares'}
                </h2>
            </div>

            {/* Summary Card */}
            <div className="card mb-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                    <div>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                            {language === 'fr' ? 'Total de Membres' : 'Total Members'}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            {members.length}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                            {language === 'fr' ? 'Total d\'Allocations' : 'Total Allocations'}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-success)' }}>
                            {allocations.length}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                            {language === 'fr' ? 'Actifs Configurés' : 'Configured Assets'}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                            {shareConfigs.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Member Asset Shares Table */}
            <div className="card">
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
                    {language === 'fr' ? 'Détails par Membre' : 'Member Details'}
                </h3>

                {members.length === 0 ? (
                    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                        <p className="text-muted">
                            {language === 'fr'
                                ? 'Aucune allocation trouvée. Veuillez ajouter des allocations d\'actifs aux membres.'
                                : 'No allocations found. Please add asset allocations to members.'}
                        </p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>
                                        {language === 'fr' ? 'Nom du Membre' : 'Member Name'}
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>
                                        {language === 'fr' ? 'Nom de l\'Actif' : 'Asset Name'}
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>
                                        {language === 'fr' ? 'Type d\'Actif' : 'Asset Type'}
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>
                                        {language === 'fr' ? 'Total des Actions' : 'Total Shares'}
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>
                                        {language === 'fr' ? 'Total Actif' : 'Total Asset'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member) => (
                                    <React.Fragment key={member.memberId}>
                                        {member.assets.map((asset, index) => (
                                            <tr
                                                key={asset.id}
                                                style={{
                                                    borderBottom: '1px solid var(--color-border)',
                                                    backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--color-bg-tertiary)'
                                                }}
                                            >
                                                {index === 0 && (
                                                    <td
                                                        rowSpan={member.assets.length}
                                                        style={{
                                                            padding: '1rem',
                                                            fontWeight: 'bold',
                                                            verticalAlign: 'top',
                                                            borderRight: '2px solid var(--color-border)'
                                                        }}
                                                    >
                                                        {member.memberName}
                                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 'normal', marginTop: 'var(--spacing-xs)' }}>
                                                            {language === 'fr' ? 'Total Actifs:' : 'Total Assets:'} {member.assets.length}
                                                        </div>
                                                    </td>
                                                )}
                                                <td style={{ padding: '1rem' }}>
                                                    {asset.assetName}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span className="badge badge-income" style={{ fontSize: 'var(--font-size-xs)' }}>
                                                        {getAssetTypeLabel(getAssetType(asset.assetId))}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                                                    {asset.totalShares.toLocaleString()}
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--color-success)', fontWeight: 'bold' }}>
                                                    {formatAssetValue(asset.totalAssetValue, asset.assetId)}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                                {/* Grand Total - Categorized by Asset Type */}
                                <tr style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontWeight: 'bold' }}>
                                    <td colSpan={5} style={{ padding: '1rem', textAlign: 'center', fontSize: 'var(--font-size-lg)' }}>
                                        {language === 'fr' ? 'TOTAL GÉNÉRAL PAR TYPE D\'ACTIF' : 'GRAND TOTAL BY ASSET TYPE'}
                                    </td>
                                </tr>
                                {(() => {
                                    // Group allocations by asset type
                                    const byType = allocations.reduce((acc, allocation) => {
                                        const assetType = getAssetType(allocation.assetId);
                                        const config = shareConfigs.find(c => c.assetId === allocation.assetId);
                                        const unit = config?.unit || '';

                                        if (!acc[assetType]) {
                                            acc[assetType] = { shares: 0, value: 0, unit };
                                        }
                                        acc[assetType].shares += allocation.totalShares;
                                        acc[assetType].value += allocation.totalAssetValue;
                                        return acc;
                                    }, {} as Record<string, { shares: number; value: number; unit: string }>);

                                    return Object.entries(byType).map(([type, data]) => {
                                        // Convert Real Estate to ha if >= 10,000 m²
                                        let displayValue = data.value;
                                        let displayUnit = data.unit;

                                        if (type === 'realEstate' && data.unit === 'm2' && data.value >= 10000) {
                                            displayValue = data.value / 10000;
                                            displayUnit = 'ha';
                                        }

                                        return (
                                            <tr key={type} style={{ backgroundColor: 'var(--color-bg-secondary)', fontWeight: 'bold' }}>
                                                <td colSpan={3} style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                                    {getAssetTypeLabel(type)}:
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                                    {data.shares.toLocaleString()}
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--color-success)' }}>
                                                    {displayValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} {displayUnit}
                                                </td>
                                            </tr>
                                        );
                                    });
                                })()}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
