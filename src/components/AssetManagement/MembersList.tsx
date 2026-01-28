import React, { useState, useEffect } from 'react';
import { Member, Language, IdentificationType, MemberPosition } from '../../types/assets';
import { translations } from '../../utils/translations';
import { formatDate } from '../../utils/calculations';
import { loadMembers, deleteMember, addMember, updateMember } from '../../utils/assetStorage';
import { MemberViewModal } from './MemberViewModal';

interface MembersListProps {
    language: Language;
}

export const MembersList: React.FC<MembersListProps> = ({ language }) => {
    const t = translations[language];
    const [members, setMembers] = useState<Member[]>(loadMembers()); // Load immediately
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [viewingMember, setViewingMember] = useState<Member | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);

    // Load members from storage
    useEffect(() => {
        setMembers(loadMembers());
    }, []);

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalShares = members.reduce((sum, m) => sum + m.sharesOwned, 0);
    const totalLand = members.reduce((sum, m) => sum + m.landSizeM2, 0);

    const handleAdd = () => {
        setEditingMember(null);
        setShowForm(true);
    };

    const handleView = (member: Member) => {
        setViewingMember(member);
    };

    const handleEdit = (member: Member) => {
        setEditingMember(member);
        setShowForm(true);
    };


    const handleDelete = (id: string, name: string) => {
        // Set the member to delete, which will show the confirmation modal
        setMemberToDelete({ id, name });
    };

    const confirmDelete = () => {
        if (!memberToDelete) return;

        try {
            console.log('Deleting member:', memberToDelete.id, memberToDelete.name);
            deleteMember(memberToDelete.id);
            const updated = loadMembers();
            setMembers(updated);
            console.log('Delete successful, new count:', updated.length);
        } catch (error) {
            console.error('Delete error:', error);
        }

        // Close the confirmation modal
        setMemberToDelete(null);
    };

    const cancelDelete = () => {
        setMemberToDelete(null);
    };

    const handleSave = (member: Member) => {
        if (editingMember) {
            updateMember(member.id, member);
        } else {
            addMember(member);
        }
        setMembers(loadMembers());
        setShowForm(false);
        setEditingMember(null);
    };

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {t.members}
                </h1>
                <button className="btn btn-primary" onClick={handleAdd}>
                    <span>+</span> {t.addMember}
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div className="card">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {t.totalMembers}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-primary)' }}>
                        {members.length}
                    </p>
                    <div style={{ marginTop: 'var(--spacing-sm)', borderTop: '3px solid var(--color-primary)', width: '30px' }}></div>
                </div>
                <div className="card">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {t.totalShares}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-secondary)' }}>
                        {totalShares.toLocaleString()}
                    </p>
                    <div style={{ marginTop: 'var(--spacing-sm)', borderTop: '3px solid var(--color-secondary)', width: '30px' }}></div>
                </div>
                <div className="card">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {language === 'fr' ? 'Superficie Totale' : 'Total Land Area'}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-success)' }}>
                        {(totalLand / 10000).toFixed(2)} ha
                    </p>
                    <div style={{ marginTop: 'var(--spacing-sm)', borderTop: '3px solid var(--color-success)', width: '30px' }}></div>
                </div>
            </div>

            {/* Search */}
            <div className="card mb-lg">
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <input
                        type="text"
                        className="form-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`${t.search} ${t.members.toLowerCase()}...`}
                    />
                </div>
            </div>

            {/* Members Table */}
            <div className="card">
                {filteredMembers.length === 0 ? (
                    <p className="text-muted text-center" style={{ padding: 'var(--spacing-xl)' }}>
                        {language === 'fr' ? 'Aucun membre trouvé' : 'No members found'}
                    </p>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{language === 'fr' ? 'ID Membre' : 'Member ID'}</th>
                                    <th>{t.memberName}</th>
                                    <th>{language === 'fr' ? 'Position' : 'Position'}</th>
                                    <th>{language === 'fr' ? 'Date de Naissance' : 'Date of Birth'}</th>
                                    <th>{language === 'fr' ? 'Type d\'ID' : 'ID Type'}</th>
                                    <th>{language === 'fr' ? 'Numéro d\'ID' : 'ID Number'}</th>
                                    <th>{language === 'fr' ? 'Expiration ID' : 'ID Expiry'}</th>
                                    <th className="text-right">{t.sharesOwned}</th>
                                    <th className="text-right">{t.landSize}</th>
                                    <th>{t.dateJoined}</th>
                                    <th className="text-center no-print">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member) => {
                                    const isExpired = member.idExpirationDate && new Date(member.idExpirationDate) < new Date();
                                    const expiringSoon = member.idExpirationDate && new Date(member.idExpirationDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) && !isExpired;

                                    return (
                                        <tr key={member.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                                                    {member.memberId || 'N/A'}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{member.name}</div>
                                                {member.email && (
                                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                                        📧 {member.email}
                                                    </div>
                                                )}
                                                {member.phone && (
                                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                                        📱 {member.phone}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
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
                                            </td>
                                            <td style={{ color: 'var(--color-text-secondary)' }}>
                                                {member.dateOfBirth ? formatDate(member.dateOfBirth) : '-'}
                                            </td>
                                            <td>
                                                <span className="badge">
                                                    {member.identificationType === 'NATIONAL_ID' && (language === 'fr' ? 'Carte Nationale' : 'National ID')}
                                                    {member.identificationType === 'PASSPORT' && (language === 'fr' ? 'Passeport' : 'Passport')}
                                                    {member.identificationType === 'DRIVER_LICENSE' && (language === 'fr' ? 'Permis' : 'License')}
                                                </span>
                                            </td>
                                            <td style={{ fontFamily: 'monospace' }}>
                                                {member.idNumber ? `•••• ${member.idNumber.slice(-4)}` : '-'}
                                            </td>
                                            <td>
                                                {member.idExpirationDate ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <span style={{ color: isExpired ? 'var(--color-error)' : expiringSoon ? 'var(--color-warning)' : 'var(--color-text-secondary)' }}>
                                                            {formatDate(member.idExpirationDate)}
                                                        </span>
                                                        {isExpired && <span style={{ color: 'var(--color-error)' }}>⚠️</span>}
                                                        {expiringSoon && <span style={{ color: 'var(--color-warning)' }}>⏰</span>}
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="text-right font-bold" style={{ color: 'var(--color-primary)' }}>
                                                {member.sharesOwned.toLocaleString()}
                                            </td>
                                            <td className="text-right font-bold" style={{ color: 'var(--color-success)' }}>
                                                {member.landSizeM2.toLocaleString()} m²
                                            </td>
                                            <td style={{ color: 'var(--color-text-secondary)' }}>
                                                {formatDate(member.dateJoined)}
                                            </td>
                                            <td className="no-print">
                                                <div className="flex gap-sm justify-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-info"
                                                        onClick={() => handleView(member)}
                                                        title={language === 'fr' ? 'Voir les détails' : 'View details'}
                                                    >
                                                        {language === 'fr' ? 'Voir' : 'View'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() => handleEdit(member)}
                                                    >
                                                        {t.edit}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleDelete(member.id, member.name);
                                                        }}
                                                    >
                                                        {t.delete}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Member View Details Modal */}
            {viewingMember && (
                <MemberViewModal
                    member={viewingMember}
                    language={language}
                    onClose={() => setViewingMember(null)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {memberToDelete && (
                <div className="modal-overlay" onClick={cancelDelete}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">{language === 'fr' ? 'Confirmer la suppression' : 'Confirm Deletion'}</h2>
                        </div>
                        <div className="modal-body">
                            <p>{language === 'fr'
                                ? `Êtes-vous sûr de vouloir supprimer ce membre ?`
                                : `Are you sure you want to delete this member?`}</p>
                            <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--spacing-md)', marginTop: 'var(--spacing-md)', borderLeft: '4px solid var(--color-danger)' }}>
                                <p style={{ fontWeight: 'bold' }}>
                                    {memberToDelete.name}
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={cancelDelete}>
                                {language === 'fr' ? 'Annuler' : 'Cancel'}
                            </button>
                            <button className="btn btn-danger" onClick={confirmDelete}>
                                {language === 'fr' ? 'Supprimer' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Member Form Modal */}
            {showForm && (
                <MemberFormModal
                    member={editingMember}
                    language={language}
                    onSave={handleSave}
                    onClose={() => {
                        setShowForm(false);
                        setEditingMember(null);
                    }}
                />
            )}
        </div>
    );
};

// Member Form Modal Component
interface MemberFormModalProps {
    member: Member | null;
    language: Language;
    onSave: (member: Member) => void;
    onClose: () => void;
}

const MemberFormModal: React.FC<MemberFormModalProps> = ({
    member,
    language,
    onSave,
    onClose
}) => {
    const t = translations[language];
    const [formData, setFormData] = useState<Member>(
        member || {
            id: Date.now().toString(),
            memberId: '',
            name: '',
            position: 'Member' as MemberPosition,
            dateOfBirth: '',
            identificationType: 'NATIONAL_ID' as IdentificationType,
            idNumber: '',
            idExpirationDate: '',
            sharesOwned: 0,
            landSizeM2: 0,
            dateJoined: new Date().toISOString().split('T')[0],
            email: '',
            phone: '',
            remarks: '',
            notes: ''
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            alert(language === 'fr' ? 'Veuillez entrer le nom du membre' : 'Please enter member name');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{member ? t.edit + ' ' + (language === 'fr' ? 'Membre' : 'Member') : t.addMember}</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">{t.memberName} *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{language === 'fr' ? 'Position' : 'Position'} *</label>
                            <select
                                className="form-input"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value as MemberPosition })}
                                required
                            >
                                <option value="Member">{language === 'fr' ? 'Membre' : 'Member'}</option>
                                <option value="President">{language === 'fr' ? 'Président' : 'President'}</option>
                                <option value="Vice President">{language === 'fr' ? 'Vice-Président' : 'Vice President'}</option>
                                <option value="Treasurer">{language === 'fr' ? 'Trésorier' : 'Treasurer'}</option>
                                <option value="Secretary General">{language === 'fr' ? 'Secrétaire Général' : 'Secretary General'}</option>
                                <option value="Assistant Secretary General">{language === 'fr' ? 'Secrétaire Général Adjoint' : 'Assistant Secretary General'}</option>
                                <option value="Auditor">{language === 'fr' ? 'Auditeur' : 'Auditor'}</option>
                                <option value="Founders shares">{language === 'fr' ? 'Actions de Fondateurs' : 'Founders shares'}</option>
                            </select>
                        </div>

                        {/* Show auto-generated Member ID for existing members */}
                        {member && member.memberId && (
                            <div className="form-group">
                                <label className="form-label">{language === 'fr' ? 'ID Membre' : 'Member ID'}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.memberId}
                                    readOnly
                                    style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-muted)' }}
                                />
                            </div>
                        )}

                        {/* Identification Section */}
                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                            <h4 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
                                {language === 'fr' ? 'Informations d\'Identification' : 'Identification Information'}
                            </h4>

                            <div className="form-group">
                                <label className="form-label">{language === 'fr' ? 'Date de Naissance' : 'Date of Birth'} *</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{language === 'fr' ? 'Type d\'Identification' : 'Identification Type'} *</label>
                                <select
                                    className="form-input"
                                    value={formData.identificationType}
                                    onChange={(e) => setFormData({ ...formData, identificationType: e.target.value as IdentificationType })}
                                    required
                                >
                                    <option value="NATIONAL_ID">{language === 'fr' ? 'Carte d\'Identité Nationale' : 'National ID Card'}</option>
                                    <option value="PASSPORT">{language === 'fr' ? 'Passeport' : 'Passport'}</option>
                                    <option value="DRIVER_LICENSE">{language === 'fr' ? 'Permis de Conduire' : 'Driver License'}</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <div className="form-group">
                                    <label className="form-label">{language === 'fr' ? 'Numéro d\'Identification' : 'ID Number'} *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.idNumber}
                                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{language === 'fr' ? 'Date d\'Expiration' : 'Expiration Date'} *</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.idExpirationDate}
                                        onChange={(e) => setFormData({ ...formData, idExpirationDate: e.target.value })}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Member Details Section */}
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                        <h4 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
                            {language === 'fr' ? 'Détails du Membre' : 'Member Details'}
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="form-label">{t.sharesOwned}</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.sharesOwned}
                                    onChange={(e) => setFormData({ ...formData, sharesOwned: parseInt(e.target.value) || 0 })}
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t.landSize}</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.landSizeM2}
                                    onChange={(e) => setFormData({ ...formData, landSizeM2: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    placeholder="m²"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t.dateJoined}</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.dateJoined}
                                onChange={(e) => setFormData({ ...formData, dateJoined: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{language === 'fr' ? 'Téléphone' : 'Phone'}</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t.remarks}</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t.notes}</label>
                            <textarea
                                className="form-textarea"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
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
