import React, { useState, useEffect } from 'react';
import { Asset, AssetType, Language } from '../../types/assets';
import { translations } from '../../utils/translations';
import { formatCurrency, formatDate } from '../../utils/calculations';
import { loadAssets, deleteAsset, addAsset, updateAsset, getAssetShareConfig, saveAllocationsForAsset, getAllocationsForAsset, MemberAssetAllocation, loadAssetShareConfigs } from '../../utils/assetStorage';
import { MemberAllocationTable } from './MemberAllocationTable';

interface AssetsListProps {
    language: Language;
}

export const AssetsList: React.FC<AssetsListProps> = ({ language }) => {
    const t = translations[language];
    const [assets, setAssets] = useState<Asset[]>([]);
    const [filterType, setFilterType] = useState<AssetType | 'all'>('all');
    const [showForm, setShowForm] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [shareConfigs] = useState(loadAssetShareConfigs());

    // Load assets from storage
    useEffect(() => {
        setAssets(loadAssets());
    }, []);

    // Helper function to calculate current value for an asset
    const calculateCurrentValue = (asset: Asset): number => {
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

    // Helper function to calculate purchase price for an asset
    const calculatePurchasePrice = (asset: Asset): number => {
        const config = shareConfigs.find(c => c.assetId === asset.id);

        if (!config || !config.costPrice) {
            return 0;
        }

        if (asset.type === 'realEstate' && asset.size) {
            // Parse size to extract numeric value and unit
            const sizeStr = asset.size.trim().toLowerCase();
            const sizeMatch = sizeStr.match(/^([\d,.]+)\s*(ha|m2|m²)?/);

            if (sizeMatch) {
                const sizeValue = parseFloat(sizeMatch[1].replace(/,/g, ''));
                const sizeUnit = sizeMatch[2] || '';

                if (sizeUnit === 'ha') {
                    return config.costPrice * sizeValue * 10000;
                } else {
                    return config.costPrice * sizeValue;
                }
            }
        }

        // For other asset types, Purchase Price = Cost Price
        return config.costPrice;
    };

    const filteredAssets = filterType === 'all'
        ? assets
        : assets.filter(a => a.type === filterType);

    const totalValue = assets.reduce((sum, a) => sum + calculateCurrentValue(a), 0);
    const realEstateAssets = assets.filter(a => a.type === 'realEstate');
    const totalLandArea = realEstateAssets.reduce((sum, a) => {
        const sizeMatch = a.size?.match(/(\d+\.?\d*)/);
        return sum + (sizeMatch ? parseFloat(sizeMatch[1]) : 0);
    }, 0);

    const handleAdd = () => {
        setEditingAsset(null);
        setShowForm(true);
    };

    const handleEdit = (asset: Asset) => {
        setEditingAsset(asset);
        setShowForm(true);
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`${t.confirmDelete}\n\n${name}?`)) {
            deleteAsset(id);
            setAssets(loadAssets());
        }
    };

    const handleSave = (asset: Asset) => {
        if (editingAsset) {
            updateAsset(asset.id, asset);
        } else {
            addAsset(asset);
        }
        setAssets(loadAssets());
        setShowForm(false);
        setEditingAsset(null);
    };


    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {t.assets}
                </h1>
                <button className="btn btn-primary" onClick={handleAdd}>
                    <span>+</span> {t.addAsset}
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div className="card">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {t.totalAssets}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-primary)' }}>
                        {assets.length}
                    </p>
                    <div style={{ marginTop: 'var(--spacing-sm)', borderTop: '3px solid var(--color-primary)', width: '30px' }}></div>
                </div>
                <div className="card">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {t.totalValue}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-success)' }}>
                        {formatCurrency(totalValue)}
                    </p>
                    <div style={{ marginTop: 'var(--spacing-sm)', borderTop: '3px solid var(--color-success)', width: '30px' }}></div>
                </div>
                {realEstateAssets.length > 0 && (
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                            {language === 'fr' ? 'Superficie' : 'Land Area'}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-secondary)' }}>
                            {totalLandArea.toFixed(1)} ha
                        </p>
                        <div style={{ marginTop: 'var(--spacing-sm)', borderTop: '3px solid var(--color-secondary)', width: '30px' }}></div>
                    </div>
                )}
            </div>

            {/* Filter */}
            <div className="card mb-lg">
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{t.assetType}</label>
                    <select
                        className="form-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as AssetType | 'all')}
                    >
                        <option value="all">{t.allTime}</option>
                        <option value="realEstate">{t.realEstate}</option>
                        <option value="vehicleTransport">{t.vehicleTransport}</option>
                        <option value="equipment">{t.equipment}</option>
                        <option value="investment">{t.investment}</option>
                        <option value="other">{t.other}</option>
                    </select>
                </div>
            </div>

            {/* Assets Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--spacing-md)' }}>
                {filteredAssets.length === 0 ? (
                    <div className="card">
                        <p className="text-muted text-center" style={{ padding: 'var(--spacing-xl)' }}>
                            {language === 'fr' ? 'Aucun actif trouvé' : 'No assets found'}
                        </p>
                    </div>
                ) : (
                    filteredAssets.map((asset) => (
                        <div key={asset.id} className="card">
                            <div className="flex justify-between items-start mb-md">
                                <div>
                                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 900, marginBottom: 'var(--spacing-xs)', textTransform: 'uppercase' }}>
                                        {asset.name}
                                    </h3>
                                    <span className="badge" style={{ fontSize: 'var(--font-size-xs)', background: '#000000', color: '#ffffff', borderRadius: 0 }}>
                                        {asset.type === 'realEstate' && t.realEstate}
                                        {asset.type === 'vehicleTransport' && t.vehicleTransport}
                                        {asset.type === 'equipment' && t.equipment}
                                        {asset.type === 'investment' && t.investment}
                                        {asset.type === 'other' && t.other}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-success" style={{ fontSize: 'var(--font-size-xl)', fontWeight: 900, color: 'var(--color-primary)' }}>
                                        {calculateCurrentValue(asset) > 0
                                            ? `${calculateCurrentValue(asset).toLocaleString()}`
                                            : '—'}
                                    </p>
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700 }}>
                                        XAF
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                                    {asset.description}
                                </p>

                                {asset.location && (
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                                        📍 {asset.location}
                                    </p>
                                )}

                                {asset.size && (
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                                        📏 {asset.size}
                                    </p>
                                )}

                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)' }}>
                                    {t.purchaseDate}: {formatDate(asset.purchaseDate)}
                                </p>
                            </div>

                            {/* Purchase Price and Net Profit */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 'var(--spacing-sm)',
                                padding: 'var(--spacing-sm)',
                                backgroundColor: 'var(--color-bg-tertiary)',
                                borderRadius: 'var(--radius-sm)',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                <div>
                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                                        {language === 'fr' ? 'Prix d\'Achat' : 'Purchase Price'}
                                    </p>
                                    <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-warning)' }}>
                                        {calculatePurchasePrice(asset) > 0
                                            ? `${calculatePurchasePrice(asset).toLocaleString()} XAF`
                                            : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                                        {language === 'fr' ? 'Bénéfice Net' : 'Net Profit'}
                                    </p>
                                    <p style={{
                                        fontSize: 'var(--font-size-sm)',
                                        fontWeight: 600,
                                        color: (calculateCurrentValue(asset) - calculatePurchasePrice(asset)) >= 0
                                            ? 'var(--color-success)'
                                            : 'var(--color-danger)'
                                    }}>
                                        {calculatePurchasePrice(asset) > 0
                                            ? `${(calculateCurrentValue(asset) - calculatePurchasePrice(asset)).toLocaleString()} XAF`
                                            : '—'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-sm">
                                <button
                                    className="btn btn-sm btn-outline"
                                    style={{ flex: 1 }}
                                    onClick={() => handleEdit(asset)}
                                >
                                    {t.edit}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(asset.id, asset.name)}
                                >
                                    {t.delete}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Asset Form Modal */}
            {showForm && (
                <AssetFormModal
                    asset={editingAsset}
                    language={language}
                    onSave={handleSave}
                    onClose={() => {
                        setShowForm(false);
                        setEditingAsset(null);
                    }}
                />
            )}
        </div>
    );
};

// Asset Form Modal Component
interface AssetFormModalProps {
    asset: Asset | null;
    language: Language;
    onSave: (asset: Asset) => void;
    onClose: () => void;
}

const AssetFormModal: React.FC<AssetFormModalProps> = ({
    asset,
    language,
    onSave,
    onClose
}) => {
    const t = translations[language];
    const [formData, setFormData] = useState<Asset>(
        asset || {
            id: Date.now().toString(),
            name: '',
            type: 'realEstate',
            purchaseDate: new Date().toISOString().split('T')[0],
            purchasePrice: 0,
            currentValue: 0,
            description: '',
            location: '',
            size: '',
            documents: [],
            notes: ''
        }
    );

    // Member allocations
    const [allocations, setAllocations] = useState<MemberAssetAllocation[]>(
        asset ? getAllocationsForAsset(asset.id) : []
    );

    // Get share config for current asset
    const shareConfig = asset ? getAssetShareConfig(asset.id) : null;
    const shareValue = shareConfig?.shareValue || 1;
    const unit = shareConfig?.unit || '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            alert(language === 'fr' ? 'Veuillez entrer le nom de l\'actif' : 'Please enter asset name');
            return;
        }

        // Save asset
        const assetToSave = { ...formData };
        onSave(assetToSave);

        // Save allocations if any
        if (allocations.length > 0) {
            const allocationsWithAssetId = allocations.map(a => ({
                ...a,
                assetId: formData.id,
                assetName: formData.name
            }));
            saveAllocationsForAsset(formData.id, allocationsWithAssetId);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{asset ? t.edit + ' ' + (language === 'fr' ? 'Actif' : 'Asset') : t.addAsset}</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">{language === 'fr' ? 'Nom de l\'Actif' : 'Asset Name'} *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="form-label">{t.assetType}</label>
                                <select
                                    className="form-select"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AssetType })}
                                >
                                    <option value="realEstate">{t.realEstate}</option>
                                    <option value="vehicleTransport">{t.vehicleTransport}</option>
                                    <option value="equipment">{t.equipment}</option>
                                    <option value="investment">{t.investment}</option>
                                    <option value="other">{t.other}</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t.purchaseDate}</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.purchaseDate}
                                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="form-label">{t.purchasePrice}</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.purchasePrice}
                                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="form-label">{t.location}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Massoumbou, Cameroon"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t.size}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.size}
                                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                    placeholder={formData.type === 'realEstate' ? '14.5 ha' : formData.type === 'vehicleTransport' ? 'VIN: XXX' : ''}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t.description}</label>
                            <textarea
                                className="form-textarea"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t.notes}</label>
                            <textarea
                                className="form-textarea"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={2}
                            />
                        </div>

                        {/* Member Allocation Section */}
                        <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '2px solid var(--color-border)' }}>
                            {!shareConfig && (
                                <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-warning-light)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-warning-dark)' }}>
                                        ⚠️ {language === 'fr'
                                            ? 'Veuillez d\'abord configurer la valeur d\'action pour cet actif dans la section "Valeur Partagée".'
                                            : 'Please configure the share value for this asset in the "Shared Value" section first.'}
                                    </p>
                                </div>
                            )}
                            <MemberAllocationTable
                                language={language}
                                assetName={formData.name}
                                shareValue={shareValue}
                                unit={unit || 'm2'}
                                allocations={allocations}
                                onChange={setAllocations}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
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
