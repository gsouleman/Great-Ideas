import React from 'react';
import { Member, Language } from '../../types/assets';
import { translations } from '../../utils/translations';
import { formatDate } from '../../utils/calculations';

// Member View Details Modal Component
interface MemberViewModalProps {
    member: Member;
    language: Language;
    onClose: () => void;
}

export const MemberViewModal: React.FC<MemberViewModalProps> = ({ member, language, onClose }) => {
    const t = translations[language];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2>{language === 'fr' ? 'Détails du Membre' : 'Member Details'}</h2>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {/* Member ID and Name */}
                        <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-surface)', borderRadius: 'var(--border-radius)' }}>
                            <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>{member.name}</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'monospace', fontSize: 'var(--font-size-sm)' }}>
                                {member.memberId || member.id}
                            </p>
                        </div>

                        {/* Position */}
                        <div className="form-row">
                            <label className="form-label">{language === 'fr' ? 'Position' : 'Position'}</label>
                            <span className="badge" style={{
                                backgroundColor: member.position === 'President' ? 'var(--color-error)' :
                                    member.position === 'Vice President' ? 'var(--color-warning)' :
                                        member.position === 'Treasurer' ? 'var(--color-success)' :
                                            member.position === 'Secretary General' ? 'var(--color-info)' :
                                                member.position === 'Assistant Secretary General' ? 'var(--color-info-light)' :
                                                    member.position === 'Auditor' ? 'var(--color-purple)' :
                                                        member.position === 'Founders shares' ? 'var(--color-gold)' :
                                                            'var(--color-muted)'
                            }}>
                                {member.position || 'Member'}
                            </span>
                        </div>

                        {/* Personal Information */}
                        <div className="form-row">
                            <label className="form-label">{language === 'fr' ? 'Date de Naissance' : 'Date of Birth'}</label>
                            <p>{member.dateOfBirth ? formatDate(member.dateOfBirth) : '-'}</p>
                        </div>

                        {/* Identification */}
                        <div className="form-row">
                            <label className="form-label">{language === 'fr' ? 'Type d\'Identification' : 'Identification Type'}</label>
                            <p>{member.identificationType || '-'}</p>
                        </div>

                        <div className="form-row">
                            <label className="form-label">{language === 'fr' ? 'Numéro d\'Identification' : 'ID Number'}</label>
                            <p style={{ fontFamily: 'monospace' }}>{member.idNumber ? `•••• ${member.idNumber.slice(-4)}` : '-'}</p>
                        </div>

                        <div className="form-row">
                            <label className="form-label">{language === 'fr' ? 'Date d\'Expiration' : 'Expiration Date'}</label>
                            <p>{member.idExpirationDate ? formatDate(member.idExpirationDate) : '-'}</p>
                        </div>

                        {/* Contact Information */}
                        <div className="form-row">
                            <label className="form-label">{t.email}</label>
                            <p>{member.email || '-'}</p>
                        </div>

                        <div className="form-row">
                            <label className="form-label">{language === 'fr' ? 'Téléphone' : 'Phone'}</label>
                            <p>{member.phone || '-'}</p>
                        </div>

                        {/* Shares and Land */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="form-row">
                                <label className="form-label">{language === 'fr' ? 'Parts Détenues' : 'Shares Owned'}</label>
                                <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-secondary)' }}>
                                    {member.sharesOwned}
                                </p>
                            </div>
                            <div className="form-row">
                                <label className="form-label">{language === 'fr' ? 'Superficie' : 'Land Size'}</label>
                                <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-success)' }}>
                                    {member.landSizeM2.toLocaleString()} m²
                                </p>
                            </div>
                        </div>

                        {/* Join Date */}
                        <div className="form-row">
                            <label className="form-label">{language === 'fr' ? 'Date d\'Adhésion' : 'Date Joined'}</label>
                            <p>{formatDate(member.dateJoined)}</p>
                        </div>

                        {/* Notes */}
                        {member.notes && (
                            <div className="form-row">
                                <label className="form-label">{t.notes}</label>
                                <p>{member.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        {language === 'fr' ? 'Fermer' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
    );
};
