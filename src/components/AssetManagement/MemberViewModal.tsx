import React from 'react';
import { Member, Language } from '../../types/assets';
import { formatDate } from '../../utils/calculations';

// Member View Details Modal Component
interface MemberViewModalProps {
    member: Member;
    language: Language;
    onClose: () => void;
}

export const MemberViewModal: React.FC<MemberViewModalProps> = ({ member, language, onClose }) => {

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">{language === 'fr' ? 'Détails du Membre' : 'Member Details'}</h2>
                </div>
                <div className="modal-body">
                    <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                        {/* Member ID and Name */}
                        <div style={{ padding: 'var(--spacing-xl)', border: '1px solid var(--color-border)', borderLeft: '8px solid var(--color-primary)' }}>
                            <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 'var(--spacing-xs)' }}>{member.name}</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>
                                ID: {member.memberId || member.id}
                            </p>
                        </div>

                        {/* Position */}
                        <div className="flex justify-between items-center" style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border-light)' }}>
                            <label className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700 }}>{language === 'fr' ? 'Position' : 'Position'}</label>
                            <span className="badge" style={{
                                borderRadius: 0,
                                fontWeight: 800,
                                background: '#000000',
                                color: '#ffffff',
                                border: 'none'
                            }}>
                                {member.position?.toUpperCase() || 'MEMBER'}
                            </span>
                        </div>

                        {/* Details Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                            <div>
                                <label className="text-muted" style={{ display: 'block', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>{language === 'fr' ? 'Né(e) le' : 'Born on'}</label>
                                <p style={{ fontWeight: 600 }}>{member.dateOfBirth ? formatDate(member.dateOfBirth) : '-'}</p>
                            </div>
                            <div>
                                <label className="text-muted" style={{ display: 'block', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>{language === 'fr' ? 'Adhésion' : 'Joined'}</label>
                                <p style={{ fontWeight: 600 }}>{formatDate(member.dateJoined)}</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--color-bg-secondary)' }}>
                            <div>
                                <label className="text-muted" style={{ display: 'block', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>{language === 'fr' ? 'Parts' : 'Shares'}</label>
                                <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-secondary)' }}>
                                    {member.sharesOwned}
                                </p>
                            </div>
                            <div>
                                <label className="text-muted" style={{ display: 'block', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>{language === 'fr' ? 'Terrain' : 'Land'}</label>
                                <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-success)' }}>
                                    {member.landSizeM2.toLocaleString()} m²
                                </p>
                            </div>
                        </div>

                        {/* Identification */}
                        <div style={{ borderTop: '2px solid #000000', paddingTop: 'var(--spacing-lg)' }}>
                            <h4 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 900, marginBottom: 'var(--spacing-md)' }}>{language === 'fr' ? 'Identification' : 'Identification'}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <p style={{ fontSize: 'var(--font-size-sm)' }}>
                                    <span style={{ fontWeight: 700 }}>{member.identificationType}:</span> {member.idNumber ? `•••• ${member.idNumber.slice(-4)}` : '-'}
                                </p>
                                <p style={{ fontSize: 'var(--font-size-sm)' }}>
                                    <span style={{ fontWeight: 700 }}>EXP:</span> {member.idExpirationDate ? formatDate(member.idExpirationDate) : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
                            <p style={{ fontSize: 'var(--font-size-sm)' }}>✉️ {member.email || '-'}</p>
                            <p style={{ fontSize: 'var(--font-size-sm)' }}>📞 {member.phone || '-'}</p>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        {language === 'fr' ? 'Fermer' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
    );
};
