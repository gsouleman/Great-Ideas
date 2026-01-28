import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { User, UserRole } from '../../types/auth';
import { adminApi } from '../../utils/api';
import { getAvailableMembers } from '../../utils/authStorage';
import { loadMembers, Member } from '../../utils/assetStorage';

interface UserFormProps {
    user?: User;
    language: Language;
    onClose: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, language, onClose }) => {
    const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        memberId: user?.memberId || '',
        memberName: user?.memberName || '',
        email: user?.email || '',
        role: user?.role || ('member' as UserRole),
        password: '',
        confirmPassword: '',
        is2FAEnabled: user?.is2FAEnabled || false,
        mustChangePassword: user?.mustChangePassword ?? true
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const members = getAvailableMembers();
        // If editing, add the current member to the list
        if (user && user.memberId) {
            const allMembers = loadMembers();
            const currentMember = allMembers.find((m: Member) => m.id === user.memberId);
            if (currentMember && !members.find((m: Member) => m.id === currentMember.id)) {
                members.push(currentMember);
            }
        }
        setAvailableMembers(members);
    }, [user]);

    const handleMemberChange = (memberId: string) => {
        const member = availableMembers.find(m => m.id === memberId);
        if (member) {
            setFormData({
                ...formData,
                memberId: member.id,
                memberName: member.name,
                username: member.name.toLowerCase().replace(/\s+/g, '_'),
                email: member.email || `${member.name.toLowerCase().replace(/\s+/g, '.')}@greatideas.com`
            });
        }
    };

    const validateForm = (): boolean => {
        if (!formData.memberName) {
            setError(language === 'fr' ? 'Veuillez sélectionner un membre' : 'Please select a member');
            return false;
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError(language === 'fr' ? 'Email invalide' : 'Invalid email');
            return false;
        }

        if (!user) {
            // Creating new user - password required
            if (!formData.password || formData.password.length < 6) {
                setError(language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères' : 'Password must be at least 6 characters');
                return false;
            }

            if (formData.password !== formData.confirmPassword) {
                setError(language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (user) {
                // Update existing user via adminApi
                await adminApi.updateUser(user.id, {
                    email: formData.email,
                    role: formData.role,
                    is2FAEnabled: formData.is2FAEnabled,
                    memberName: formData.memberName,
                    memberId: formData.memberId
                });
            } else {
                // Create new user via adminApi
                await adminApi.createUser({
                    username: formData.username,
                    memberName: formData.memberName,
                    memberId: formData.memberId,
                    email: formData.email,
                    role: formData.role,
                    passwordHash: formData.password,
                    mustChangePassword: formData.mustChangePassword,
                    is2FAEnabled: formData.is2FAEnabled
                });
            }

            onClose();
        } catch (err) {
            console.error('Save user error:', err);
            setError(language === 'fr' ? 'Erreur lors de la sauvegarde' : 'Error saving user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{user
                        ? (language === 'fr' ? 'Modifier l\'Utilisateur' : 'Edit User')
                        : (language === 'fr' ? 'Ajouter un Utilisateur' : 'Add User')
                    }</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div style={{
                                padding: 'var(--spacing-sm)',
                                background: 'var(--color-primary)',
                                color: 'white',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                fontSize: 'var(--font-size-xs)',
                                marginBottom: 'var(--spacing-md)',
                                border: '1px solid #000000'
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                            {/* Member Selection */}
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                    {language === 'fr' ? 'Membre' : 'Member'} *
                                </label>
                                <select
                                    className="form-select"
                                    value={formData.memberId}
                                    onChange={(e) => handleMemberChange(e.target.value)}
                                    required
                                    disabled={!!user || (availableMembers.length === 0 && !user)}
                                >
                                    <option value="">{language === 'fr' ? 'Sélectionner un membre' : 'Select a member'}</option>
                                    {availableMembers.map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.name} {member.remarks && `(${member.remarks})`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                {/* Username (auto-filled, editable) */}
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                        {language === 'fr' ? 'Identifiant' : 'Username'} *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        disabled={!!user}
                                        required
                                    />
                                </div>

                                {/* Role */}
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                        {language === 'fr' ? 'Rôle' : 'Role'} *
                                    </label>
                                    <select
                                        className="form-select"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                        required
                                    >
                                        <option value="admin">{language === 'fr' ? 'Administrateur' : 'Administrator'}</option>
                                        <option value="excom">Excom</option>
                                        <option value="member">{language === 'fr' ? 'Membre' : 'Member'}</option>
                                        <option value="guest">{language === 'fr' ? 'Invité' : 'Guest'}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>Email *</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Password fields (only for new users) */}
                            {!user && (
                                <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                                {language === 'fr' ? 'Mot de passe' : 'Password'} *
                                            </label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                                minLength={6}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                                {language === 'fr' ? 'Confirmer' : 'Confirm'} *
                                            </label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 'var(--spacing-md)' }}>
                                        <label className="flex items-center gap-sm" style={{ cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.mustChangePassword}
                                                onChange={(e) => setFormData({ ...formData, mustChangePassword: e.target.checked })}
                                                style={{ width: 'auto' }}
                                            />
                                            <span>{language === 'fr' ? 'Forcer le changement de MdP' : 'Force password change'}</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
                                <label className="flex items-center gap-sm" style={{ cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.is2FAEnabled}
                                        onChange={(e) => setFormData({ ...formData, is2FAEnabled: e.target.checked })}
                                        style={{ width: 'auto' }}
                                    />
                                    <span>{language === 'fr' ? 'ACTIVER 2FA' : 'ENABLE 2FA'}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary btn-outline" onClick={onClose}>
                            {language === 'fr' ? 'Annuler' : 'Cancel'}
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading
                                ? (language === 'fr' ? 'SAUVEGARDE...' : 'SAVING...')
                                : (language === 'fr' ? 'ENREGISTRER' : 'SAVE USER')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
