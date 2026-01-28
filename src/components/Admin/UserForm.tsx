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
            <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{user
                        ? (language === 'fr' ? 'Modifier l\'Utilisateur' : 'Edit User')
                        : (language === 'fr' ? 'Ajouter un Utilisateur' : 'Add User')
                    }</h2>
                    <button className="btn-icon" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="card card-compact" style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '2px solid var(--color-danger)',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)' }}>{error}</p>
                            </div>
                        )}

                        {/* Member Selection */}
                        <div className="form-group">
                            <label className="form-label">
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

                        {/* Username (auto-filled, editable) */}
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'fr' ? 'Nom d\'utilisateur' : 'Username'} *
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

                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Role */}
                        <div className="form-group">
                            <label className="form-label">
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

                        {/* Password fields (only for new users) */}
                        {!user && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">
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
                                    <label className="form-label">
                                        {language === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'} *
                                    </label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.mustChangePassword}
                                            onChange={(e) => setFormData({ ...formData, mustChangePassword: e.target.checked })}
                                            style={{ width: 'auto' }}
                                        />
                                        <span>{language === 'fr' ? 'Forcer le changement de mot de passe' : 'Force password change'}</span>
                                    </label>
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label className="flex items-center gap-sm" style={{ cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.is2FAEnabled}
                                    onChange={(e) => setFormData({ ...formData, is2FAEnabled: e.target.checked })}
                                    style={{ width: 'auto' }}
                                />
                                <span>{language === 'fr' ? 'Activer 2FA' : 'Enable 2FA'}</span>
                            </label>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            {language === 'fr' ? 'Annuler' : 'Cancel'}
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading
                                ? (language === 'fr' ? 'Sauvegarde...' : 'Saving...')
                                : (language === 'fr' ? 'Enregistrer' : 'Save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
