import React, { useState, useEffect } from 'react';
import { Language } from '../../types/assets';
import { loadMembers, MemberAssetAllocation } from '../../utils/assetStorage';
import { translations } from '../../utils/translations';

interface MemberAllocationTableProps {
    language: Language;
    assetName: string;
    shareValue: number;
    unit: string;
    allocations: MemberAssetAllocation[];
    onChange: (allocations: MemberAssetAllocation[]) => void;
}

export const MemberAllocationTable: React.FC<MemberAllocationTableProps> = ({
    language,
    assetName,
    shareValue,
    unit,
    allocations,
    onChange
}) => {
    const t = translations[language];
    const [members] = useState(loadMembers());
    const [selectedOption, setSelectedOption] = useState<'individual' | 'all' | ''>('');
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        if (selectedOption === 'all' && members.length > 0 && allocations.length === 0) {
            // Auto-populate with all members
            const newAllocations: MemberAssetAllocation[] = members.map(member => ({
                id: `${Date.now()}-${member.id}`,
                assetId: '',
                assetName,
                memberId: member.id,
                memberName: member.name,
                totalShares: 0,
                totalAssetValue: 0
            }));
            onChange(newAllocations);
            setShowTable(true);
        } else if (selectedOption === 'individual') {
            setShowTable(true);
        }
    }, [selectedOption, members, assetName, allocations.length, onChange]);

    const handleAddMember = (memberId: string) => {
        const member = members.find(m => m.id === memberId);
        if (!member) return;

        const exists = allocations.some(a => a.memberId === memberId);
        if (exists) {
            alert(language === 'fr' ? 'Ce membre est déjà ajouté' : 'This member is already added');
            return;
        }

        const newAllocation: MemberAssetAllocation = {
            id: `${Date.now()}-${memberId}`,
            assetId: '',
            assetName,
            memberId: member.id,
            memberName: member.name,
            totalShares: 0,
            totalAssetValue: 0
        };

        onChange([...allocations, newAllocation]);
    };

    const handleSharesChange = (allocationId: string, shares: number) => {
        const updated = allocations.map(a => {
            if (a.id === allocationId) {
                return {
                    ...a,
                    totalShares: shares,
                    totalAssetValue: shares * shareValue
                };
            }
            return a;
        });
        onChange(updated);
    };

    const handleRemove = (allocationId: string) => {
        onChange(allocations.filter(a => a.id !== allocationId));
    };

    const totalShares = allocations.reduce((sum, a) => sum + a.totalShares, 0);
    const totalValue = allocations.reduce((sum, a) => sum + a.totalAssetValue, 0);

    return (
        <div className="form-group">
            <label className="label" style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                {language === 'fr' ? 'Allocation des Membres' : 'Member Allocation'}
            </label>

            {/* Selection Type */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <select
                    className="input"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value as 'individual' | 'all' | '')}
                >
                    <option value="">{language === 'fr' ? 'Sélectionner le type...' : 'Select type...'}</option>
                    <option value="individual">{language === 'fr' ? 'Membres Individuels' : 'Individual Members'}</option>
                    <option value="all">{language === 'fr' ? 'Tous les Membres' : 'All Members'}</option>
                </select>
            </div>

            {/* Add Individual Member */}
            {selectedOption === 'individual' && showTable && (
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <select
                        className="input"
                        onChange={(e) => {
                            if (e.target.value) {
                                handleAddMember(e.target.value);
                                e.target.value = '';
                            }
                        }}
                    >
                        <option value="">{language === 'fr' ? 'Ajouter un membre...' : 'Add member...'}</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>{member.name} ({member.memberId})</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Allocation Table */}
            {showTable && allocations.length > 0 && (
                <>
                    {/* Formula Display */}
                    <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
                        <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)' }}>
                            {language === 'fr' ? 'Formule:' : 'Formula:'}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-primary)' }}>
                            {language === 'fr' ? 'Valeur Totale de l\'Actif' : 'Total Asset Value'} = {language === 'fr' ? 'Total des Actions' : 'Total Shares'} × {language === 'fr' ? 'Valeur d\'Action' : 'Share Value'} ({shareValue} {unit})
                        </p>
                    </div>

                    <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>{language === 'fr' ? 'Nom du Membre' : 'Member Name'}</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>{language === 'fr' ? 'Total des Actions' : 'Total Shares'}</th>
                                    <th style={{ padding: 'rem', textAlign: 'right' }}>{language === 'fr' ? 'Valeur Totale de l\'Actif' : 'Total Asset Value'}</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>{language === 'fr' ? 'Nom de l\'Actif' : 'Asset Name'}</th>
                                    {selectedOption === 'individual' && (
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>{language === 'fr' ? 'Actions' : 'Actions'}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {allocations.map(allocation => (
                                    <tr key={allocation.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            {allocation.memberName}
                                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginLeft: 'var(--spacing-xs)' }}>
                                                ({members.find(m => m.id === allocation.memberId)?.memberId})
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <input
                                                type="number"
                                                className="input"
                                                style={{ textAlign: 'right', maxWidth: '150px', marginLeft: 'auto' }}
                                                value={allocation.totalShares}
                                                onChange={(e) => handleSharesChange(allocation.id, parseFloat(e.target.value) || 0)}
                                                min="0"
                                                step="1"
                                            />
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-success)' }}>
                                            {allocation.totalAssetValue.toLocaleString()} {unit}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            {assetName || '—'}
                                        </td>
                                        {selectedOption === 'individual' && (
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemove(allocation.id)}
                                                >
                                                    {t.delete}
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                <tr style={{ backgroundColor: 'var(--color-bg-secondary)', fontWeight: 'bold' }}>
                                    <td style={{ padding: '1rem' }}>{language === 'fr' ? 'TOTAL' : 'TOTAL'}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>{totalShares.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--color-success)' }}>
                                        {totalValue.toLocaleString()} {unit}
                                    </td>
                                    <td style={{ padding: '1rem' }}></td>
                                    {selectedOption === 'individual' && <td style={{ padding: '1rem' }}></td>}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};
