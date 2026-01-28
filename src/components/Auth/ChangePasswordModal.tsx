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
            <div className="modal fade-in" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{isFirstLogin
                        ? (language === 'fr' ? 'CHANGEMENT DE MOT DE PASSE REQUIS' : 'PASSWORD CHANGE REQUIRED')
                        : (language === 'fr' ? 'CHANGER LE MOT DE PASSE' : 'CHANGE PASSWORD')
                    }</h2>
                </div>

                {isFirstLogin && (
                    <div style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        padding: 'var(--spacing-md)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em'
                    }}>
                        {language === 'fr'
                            ? 'SÉCURITÉ: VOUS DEVEZ CHANGER VOTRE MOT DE PASSE POUR CONTINUER.'
                            : 'SECURITY: YOU MUST CHANGE YOUR PASSWORD TO CONTINUE.'}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div style={{
                                padding: 'var(--spacing-sm)',
                                background: '#000000',
                                color: 'white',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                fontSize: 'var(--font-size-xs)',
                                marginBottom: 'var(--spacing-md)',
                                borderLeft: '4px solid var(--color-primary)'
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
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
                                <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
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
                                            gap: '2px',
                                            marginBottom: 'var(--spacing-xs)'
                                        }}>
                                            {[1, 2, 3].map(level => (
                                                <div
                                                    key={level}
                                                    style={{
                                                        flex: 1,
                                                        height: '6px',
                                                        background: level <= passwordStrength.strength ? passwordStrength.color : '#e0e0e0'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <p style={{
                                            fontSize: 'var(--font-size-xs)',
                                            color: passwordStrength.color,
                                            fontWeight: 900,
                                            textTransform: 'uppercase'
                                        }}>
                                            {passwordStrength.label}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                    {language === 'fr' ? 'Confirmer' : 'Confirm'} *
                                </label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{
                                background: '#f8f8f8',
                                padding: 'var(--spacing-md)',
                                border: '1px solid #000000',
                                fontSize: 'var(--font-size-xs)',
                                color: '#000000'
                            }}>
                                <p style={{ marginBottom: 'var(--spacing-xs)', fontWeight: 900, textTransform: 'uppercase' }}>
                                    {language === 'fr' ? 'Critères requis:' : 'Required criteria:'}
                                </p>
                                <ul style={{ margin: 0, paddingLeft: 'var(--spacing-md)', fontWeight: 700 }}>
                                    <li>{language === 'fr' ? 'MINIMUM 6 CARACTÈRES' : 'MINIMUM 6 CHARACTERS'}</li>
                                    <li>{language === 'fr' ? 'UNE MAJUSCULE' : 'ONE UPPERCASE LETTER'}</li>
                                    <li>{language === 'fr' ? 'UN CHIFFRE' : 'ONE NUMBER'}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        {!isFirstLogin && (
                            <button type="button" className="btn btn-primary btn_outline" onClick={onClose}>
                                {language === 'fr' ? 'ANNULER' : 'CANCEL'}
                            </button>
                        )}
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ letterSpacing: '0.05em' }}>
                            {loading
                                ? (language === 'fr' ? 'MISE À JOUR...' : 'UPDATING...')
                                : (language === 'fr' ? 'CHANGER LE MOT DE PASSE' : 'CHANGE PASSWORD')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
