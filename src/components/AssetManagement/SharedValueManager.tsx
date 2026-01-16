import React, { useState, useEffect } from 'react';
import { Language } from '../../types/assets';
import { loadAssets, loadAssetShareConfigs, saveAssetShareConfig, AssetShareConfig } from '../../utils/assetStorage';
import { translations } from '../../utils/translations';

interface SharedValueManagerProps {
    language: Language;
}

const UNIT_OPTIONS = ['m2', 'ha', '$', 'XAF', 'USD', 'EUR'];

export const SharedValueManager: React.FC<SharedValueManagerProps> = ({ language }) => {
    const t = translations[language];
    const [assets] = useState(loadAssets());
    const [configs, setConfigs] = useState<AssetShareConfig[]>(loadAssetShareConfigs());
    const [selectedAssetId, setSelectedAssetId] = useState<string>('');
    const [shareValue, setShareValue] = useState<number>(0);
    const [unit, setUnit] = useState<string>('m2');
    const [customUnit, setCustomUnit] = useState<string>('');
    const [costPrice, setCostPrice] = useState<number>(0);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
        if (selectedAssetId) {
            const config = configs.find(c => c.assetId === selectedAssetId);
            if (config) {
                setShareValue(config.shareValue);
                const isCustom = !UNIT_OPTIONS.includes(config.unit);
                setUnit(isCustom ? 'custom' : config.unit);
                if (isCustom) {
                    setCustomUnit(config.unit);
                }
                setCostPrice(config.costPrice || 0);
                setCurrentPrice(config.currentPrice || 0);
            } else {
                setShareValue(0);
                setUnit('m2');
                setCustomUnit('');
                setCostPrice(0);
                setCurrentPrice(0);
            }
        }
    }, [selectedAssetId, configs]);

    const handleSave = () => {
        if (!selectedAssetId) {
            alert(language === 'fr' ? 'Veuillez sélectionner un actif' : 'Please select an asset');
            return;
        }

        const asset = assets.find(a => a.id === selectedAssetId);
        if (!asset) return;

        const finalUnit = unit === 'custom' ? customUnit : unit;

        if (!finalUnit) {
            alert(language === 'fr' ? 'Veuillez entrer une unité' : 'Please enter a unit');
            return;
        }

        const config: AssetShareConfig = {
            assetId: asset.id,
            assetName: asset.name,
            shareValue,
            unit: finalUnit,
            costPrice,
            currentPrice
        };

        saveAssetShareConfig(config);
        setConfigs(loadAssetShareConfigs());
        setIsEditing(false);
        alert(language === 'fr' ? 'Configuration enregistrée' : 'Configuration saved');
    };



    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                    {language === 'fr' ? 'Configuration de Valeur d\'Action' : 'Share Value Configuration'}
                </h2>
                <button
                    className="btn btn-primary"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={!selectedAssetId}
                >
                    {isEditing ? t.save : t.edit}
                </button>
            </div>

            {/* Asset Selection & Configuration */}
            <div className="card mb-lg">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)' }}>
                    {/* Asset Selection */}
                    <div>
                        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
                            {language === 'fr' ? 'Sélectionner un Actif' : 'Select Asset'}
                        </h3>
                        <div className="form-group">
                            <label className="label">{language === 'fr' ? 'Nom de l\'Actif' : 'Asset Name'}</label>
                            <select
                                className="input"
                                value={selectedAssetId}
                                onChange={(e) => setSelectedAssetId(e.target.value)}
                            >
                                <option value="">{language === 'fr' ? 'Sélectionner un actif...' : 'Select an asset...'}</option>
                                {assets.map(asset => (
                                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Configuration Section */}
                    {selectedAssetId && (
                        <div>
                            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
                                {language === 'fr' ? 'Configuration' : 'Configuration'}
                            </h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-md)' }}>
                                <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 500 }}>
                                    {language === 'fr' ? '1 Action =' : '1 Share ='}
                                </span>
                                <input
                                    type="number"
                                    className="input"
                                    style={{ width: '150px' }}
                                    value={shareValue}
                                    disabled={!isEditing}
                                    onChange={(e) => setShareValue(parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="0.01"
                                    placeholder={language === 'fr' ? 'Entrer par l\'utilisateur' : 'Enter by user'}
                                />
                                <span style={{ fontSize: 'var(--font-size-md)' }}>,</span>
                                <select
                                    className="input"
                                    style={{ width: '150px' }}
                                    value={unit}
                                    disabled={!isEditing}
                                    onChange={(e) => setUnit(e.target.value)}
                                >
                                    {UNIT_OPTIONS.map(u => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                    <option value="custom">{language === 'fr' ? 'Personnalisé...' : 'Custom...'}</option>
                                </select>
                            </div>

                            {unit === 'custom' && (
                                <div className="form-group" style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <label className="label">{language === 'fr' ? 'Unité Personnalisée' : 'Custom Unit'}</label>
                                    <input
                                        type="text"
                                        className="input"
                                        style={{ maxWidth: '200px' }}
                                        value={customUnit}
                                        disabled={!isEditing}
                                        onChange={(e) => setCustomUnit(e.target.value)}
                                        placeholder={language === 'fr' ? 'Ex: parcelle, lot, etc.' : 'e.g., plot, lot, etc.'}
                                    />
                                </div>
                            )}

                            {/* Cost Price */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-md)' }}>
                                <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 500 }}>
                                    {language === 'fr' ? 'Prix de Coût =' : 'Cost Price ='}
                                </span>
                                <input
                                    type="number"
                                    className="input"
                                    style={{ width: '150px' }}
                                    value={costPrice}
                                    disabled={!isEditing}
                                    onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="0.01"
                                    placeholder={language === 'fr' ? 'Entrer par l\'utilisateur' : 'Enter by user'}
                                />
                                <span style={{ fontSize: 'var(--font-size-md)' }}>
                                    XAF/{unit === 'custom' ? customUnit || (language === 'fr' ? 'unité' : 'unit') : unit}
                                </span>
                            </div>

                            {/* Current Price */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-md)' }}>
                                <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 500 }}>
                                    {language === 'fr' ? 'Prix Actuel =' : 'Current Price ='}
                                </span>
                                <input
                                    type="number"
                                    className="input"
                                    style={{ width: '150px' }}
                                    value={currentPrice}
                                    disabled={!isEditing}
                                    onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="0.01"
                                    placeholder={language === 'fr' ? 'Entrer par l\'utilisateur' : 'Enter by user'}
                                />
                                <span style={{ fontSize: 'var(--font-size-md)' }}>
                                    XAF/{unit === 'custom' ? customUnit || (language === 'fr' ? 'unité' : 'unit') : unit}
                                </span>
                            </div>

                            <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                <p style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold' }}>
                                    {language === 'fr' ? 'Valeur d\'Action =' : 'Share value ='}
                                    <span style={{ color: 'var(--color-primary)', marginLeft: 'var(--spacing-sm)' }}>
                                        {shareValue > 0 ? `${shareValue} ${unit === 'custom' ? customUnit : unit}` : '—'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Configured Assets List */}
            <div className="card">
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
                    {language === 'fr' ? 'Actifs Configurés' : 'Configured Assets'}
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>{language === 'fr' ? 'Nom de l\'Actif' : 'Asset Name'}</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>{language === 'fr' ? 'Type d\'Actif' : 'Asset Type'}</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>{language === 'fr' ? 'Valeur d\'Action' : 'Share Value'}</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>{language === 'fr' ? 'Unité' : 'Unit'}</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>{language === 'fr' ? 'Prix Actuel' : 'Current Price'}</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>{language === 'fr' ? 'Prix d\'Achat' : 'Purchase Price'}</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>{language === 'fr' ? 'Valeur Actuelle' : 'Current Value'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        {language === 'fr' ? 'Aucune configuration trouvée' : 'No configurations found'}
                                    </td>
                                </tr>
                            ) : (
                                configs.map(config => {
                                    const asset = assets.find(a => a.id === config.assetId);
                                    const assetType = asset?.type || 'other';

                                    // Get asset type label
                                    const getAssetTypeLabel = (type: string) => {
                                        switch (type) {
                                            case 'realEstate': return t.realEstate;
                                            case 'vehicleTransport': return t.vehicleTransport;
                                            case 'equipment': return t.equipment;
                                            case 'investment': return t.investment;
                                            case 'other': return t.other;
                                            default: return type;
                                        }
                                    };

                                    // Calculate current value
                                    let currentValue = 0;

                                    if (assetType === 'realEstate' && config.currentPrice && asset?.size) {
                                        // Parse size to extract numeric value and unit
                                        const sizeStr = asset.size.trim().toLowerCase();
                                        const sizeMatch = sizeStr.match(/^([\d,.]+)\s*(ha|m2|m²)?/);

                                        if (sizeMatch) {
                                            const sizeValue = parseFloat(sizeMatch[1].replace(/,/g, ''));
                                            const sizeUnit = sizeMatch[2] || '';

                                            if (sizeUnit === 'ha') {
                                                // Current Value = Current Price × Size × 10,000
                                                currentValue = config.currentPrice * sizeValue * 10000;
                                            } else {
                                                // Current Value = Current Price × Size
                                                currentValue = config.currentPrice * sizeValue;
                                            }
                                        }
                                    } else {
                                        // For other asset types, Current Value = Current Price
                                        currentValue = config.currentPrice || 0;
                                    }

                                    // Calculate purchase price
                                    let purchasePrice = 0;

                                    if (assetType === 'realEstate' && config.costPrice && asset?.size) {
                                        // Parse size to extract numeric value and unit
                                        const sizeStr = asset.size.trim().toLowerCase();
                                        const sizeMatch = sizeStr.match(/^([\d,.]+)\s*(ha|m2|m²)?/);

                                        if (sizeMatch) {
                                            const sizeValue = parseFloat(sizeMatch[1].replace(/,/g, ''));
                                            const sizeUnit = sizeMatch[2] || '';

                                            if (sizeUnit === 'ha') {
                                                // Purchase Price = Cost Price × Size × 10,000
                                                purchasePrice = config.costPrice * sizeValue * 10000;
                                            } else {
                                                // Purchase Price = Cost Price × Size
                                                purchasePrice = config.costPrice * sizeValue;
                                            }
                                        }
                                    } else {
                                        // For other asset types, Purchase Price = Cost Price
                                        purchasePrice = config.costPrice || 0;
                                    }

                                    return (
                                        <tr key={config.assetId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '1rem' }}>{config.assetName}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span className="badge badge-income" style={{ fontSize: 'var(--font-size-xs)' }}>
                                                    {getAssetTypeLabel(assetType)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>{config.shareValue.toLocaleString()}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>{config.unit}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-success)' }}>
                                                {config.currentPrice ? `${config.currentPrice.toLocaleString()} XAF/${config.unit}` : '—'}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-warning)' }}>
                                                {purchasePrice > 0 ? purchasePrice.toLocaleString() : '—'}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                                {currentValue > 0 ? currentValue.toLocaleString() : '—'}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
