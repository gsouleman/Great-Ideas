import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Language } from '../../types';

interface LoginFormProps {
    language: Language;
    onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ language, onLoginSuccess }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [userId2FA, setUserId2FA] = useState('');
    const [email2FA, setEmail2FA] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login({ username, password });

            if (result.success && result.requires2FA) {
                // Show 2FA form
                setShow2FA(true);
                setUserId2FA(result.userId!);
                setEmail2FA(result.email!);
            } else if (result.success) {
                // Login successful
                onLoginSuccess();
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (show2FA) {
        return (
            <TwoFactorVerification
                userId={userId2FA}
                email={email2FA}
                language={language}
                onSuccess={onLoginSuccess}
                onBack={() => setShow2FA(false)}
            />
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: 'var(--spacing-xl)'
        }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <h1 style={{
                        fontSize: 'var(--font-size-3xl)',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 'var(--spacing-sm)'
                    }}>
                        💡 Great Ideas
                    </h1>
                    <p className="text-muted">
                        {language === 'fr' ? 'Connexion au Système' : 'System Login'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
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
                            {language === 'fr' ? 'Nom d\'utilisateur' : 'Username'}
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={language === 'fr' ? 'Entrez votre nom d\'utilisateur' : 'Enter your username'}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            {language === 'fr' ? 'Mot de passe' : 'Password'}
                        </label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={language === 'fr' ? 'Entrez votre mot de passe' : 'Enter your password'}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                        disabled={loading}
                    >
                        {loading ? (language === 'fr' ? 'Connexion...' : 'Logging in...') : (language === 'fr' ? 'Se connecter' : 'Login')}
                    </button>
                </form>

                <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                    <p>{language === 'fr' ? 'Identifiants par défaut:' : 'Default credentials:'}</p>
                    <p><strong>admin</strong> / <strong>admin</strong></p>
                </div>
            </div>
        </div>
    );
};

// 2FA Verification Component
interface TwoFactorVerificationProps {
    userId: string;
    email: string;
    language: Language;
    onSuccess: () => void;
    onBack: () => void;
}

const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({ userId, email, language, onSuccess, onBack }) => {
    const { verify2FA } = useAuth();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [displayCode, setDisplayCode] = useState<string | null>(null);

    // Show the code on mount (for demo purposes)
    React.useEffect(() => {
        import('../../utils/authStorage').then(({ get2FACodeForDisplay }) => {
            const demoCode = get2FACodeForDisplay(userId);
            setDisplayCode(demoCode);
        });
    }, [userId]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await verify2FA(userId, code);

            if (result.success) {
                onSuccess();
            } else {
                setError(result.error || 'Verification failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        import('../../utils/authStorage').then(({ generate2FACode }) => {
            const newCode = generate2FACode(userId, email);
            setDisplayCode(newCode);
            console.log(`[2FA SIMULATION] New code for ${email}: ${newCode}`);
            setError('');
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: 'var(--spacing-xl)'
        }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--spacing-sm)' }}>
                        {language === 'fr' ? 'Vérification en 2 Étapes' : 'Two-Factor Verification'}
                    </h2>
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                        {language === 'fr'
                            ? `Un code à 6 chiffres a été envoyé à ${email}`
                            : `A 6-digit code has been sent to ${email}`}
                    </p>
                </div>

                {/* Demo Code Display */}
                {displayCode && (
                    <div className="card card-compact" style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '2px solid var(--color-success)',
                        marginBottom: 'var(--spacing-md)',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                            {language === 'fr' ? '📧 Simulation Email - Votre code:' : '📧 Email Simulation - Your code:'}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-success)', letterSpacing: '4px' }}>
                            {displayCode}
                        </p>
                    </div>
                )}

                <form onSubmit={handleVerify}>
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
                            {language === 'fr' ? 'Code de vérification' : 'Verification Code'}
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            required
                            autoFocus
                            style={{ textAlign: 'center', fontSize: 'var(--font-size-xl)', letterSpacing: '4px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                        disabled={loading || code.length !== 6}
                    >
                        {loading ? (language === 'fr' ? 'Vérification...' : 'Verifying...') : (language === 'fr' ? 'Vérifier' : 'Verify')}
                    </button>

                    <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onBack}
                            style={{ flex: 1 }}
                        >
                            {language === 'fr' ? 'Retour' : 'Back'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={handleResend}
                            style={{ flex: 1 }}
                        >
                            {language === 'fr' ? 'Renvoyer le code' : 'Resend Code'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
