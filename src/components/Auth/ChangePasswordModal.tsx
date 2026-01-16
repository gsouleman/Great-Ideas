import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Language } from '../../types';

interface ChangePasswordModalProps {
    userId: string;
    language: Language;
    onClose: () => void;
    onSuccess: () => void;
    isFirstLogin?: boolean;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    userId,
    language,
    onClose,
    onSuccess,
    isFirstLogin = false
}) => {
    const { updatePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        if (password.length < 6) {
            errors.push(language === 'fr' ? 'Au moins 6 caractères' : 'At least 6 characters');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push(language === 'fr' ? 'Une lettre majuscule' : 'One uppercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push(language === 'fr' ? 'Un chiffre' : 'One number');
        }
        return errors;
    };

    const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) return { strength: 1, label: language === 'fr' ? 'Faible' : 'Weak', color: 'var(--color-danger)' };
        if (strength <= 4) return { strength: 2, label: language === 'fr' ? 'Moyen' : 'Medium', color: 'var(--color-warning)' };
        return { strength: 3, label: language === 'fr' ? 'Fort' : 'Strong', color: 'var(--color-success)' };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (newPassword !== confirmPassword) {
            setError(language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match');
            return;
        }

        const passwordErrors = validatePassword(newPassword);
        if (passwordErrors.length > 0) {
            setError(`${language === 'fr' ? 'Requis:' : 'Required:'} ${passwordErrors.join(', ')}`);
            return;
        }

        setLoading(true);

        try {
            const result = await updatePassword({
                userId,
                currentPassword,
                newPassword
            });

            if (result.success) {
                onSuccess();
            } else {
                setError(result.error || 'Failed to update password');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <div className="modal-overlay" onClick={isFirstLogin ? undefined : onClose}>
            <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isFirstLogin
                        ? (language === 'fr' ? 'Changement de mot de passe requis' : 'Password Change Required')
                        : (language === 'fr' ? 'Changer le mot de passe' : 'Change Password')
                    }</h2>
                    {!isFirstLogin && <button className="btn-icon" onClick={onClose}>×</button>}
                </div>

                {isFirstLogin && (
                    <div className="card card-compact" style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '2px solid var(--color-warning)',
                        margin: 'var(--spacing-md) 0'
                    }}>
                        <p style={{ color: 'var(--color-warning)', fontSize: 'var(--font-size-sm)' }}>
                            {language === 'fr'
                                ? '⚠️ Pour des raisons de sécurité, vous devez changer votre mot de passe avant de continuer.'
                                : '⚠️ For security reasons, you must change your password before continuing.'}
                        </p>
                    </div>
                )}

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

                        <div className="form-group">
                            <label className="form-label">
                                {language === 'fr' ? 'Mot de passe actuel' : 'Current Password'} *
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                {language === 'fr' ? 'Nouveau mot de passe' : 'New Password'} *
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                            {/* Password Strength Indicator */}
                            {newPassword && (
                                <div style={{ marginTop: 'var(--spacing-sm)' }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: 'var(--spacing-xs)',
                                        marginBottom: 'var(--spacing-xs)'
                                    }}>
                                        {[1, 2, 3].map(level => (
                                            <div
                                                key={level}
                                                style={{
                                                    flex: 1,
                                                    height: '4px',
                                                    borderRadius: '2px',
                                                    background: level <= passwordStrength.strength ? passwordStrength.color : '#e5e7eb'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p style={{
                                        fontSize: 'var(--font-size-xs)',
                                        color: passwordStrength.color,
                                        fontWeight: 600
                                    }}>
                                        {passwordStrength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                {language === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'} *
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="card card-compact" style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-muted)'
                        }}>
                            <p style={{ marginBottom: 'var(--spacing-xs)', fontWeight: 600 }}>
                                {language === 'fr' ? 'Le mot de passe doit contenir:' : 'Password must contain:'}
                            </p>
                            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)' }}>
                                <li>{language === 'fr' ? 'Au moins 6 caractères' : 'At least 6 characters'}</li>
                                <li>{language === 'fr' ? 'Une lettre majuscule' : 'One uppercase letter'}</li>
                                <li>{language === 'fr' ? 'Un chiffre' : 'One number'}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="modal-footer">
                        {!isFirstLogin && (
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                {language === 'fr' ? 'Annuler' : 'Cancel'}
                            </button>
                        )}
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading
                                ? (language === 'fr' ? 'Mise à jour...' : 'Updating...')
                                : (language === 'fr' ? 'Changer le mot de passe' : 'Change Password')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
