import React from 'react';
import { Language } from '../../types';
import { loadUsers } from '../../utils/authStorage';
import { User } from '../../types/auth';

interface AdminPanelProps {
    language: Language;
    onNavigateToUsers: () => void;
    onNavigateToAccessControl: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ language, onNavigateToUsers, onNavigateToAccessControl }) => {
    const users = loadUsers();

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        excom: users.filter(u => u.role === 'excom').length,
        members: users.filter(u => u.role === 'member').length,
        guests: users.filter(u => u.role === 'guest').length,
        with2FA: users.filter(u => u.is2FAEnabled).length
    };

    const recentUsers = users
        .filter(u => u.lastLogin)
        .sort((a, b) => new Date(b.lastLogin!).getTime() - new Date(a.lastLogin!).getTime())
        .slice(0, 5);

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {language === 'fr' ? 'Panneau d\'Administration' : 'Admin Panel'}
                </h1>
            </div>

            {/* Statistics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <div className="card">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {language === 'fr' ? 'Utilisateurs' : 'Users'}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-primary)' }}>
                        {stats.total}
                    </p>
                    <div style={{ marginTop: 'var(--spacing-sm)', borderTop: '3px solid var(--color-primary)', width: '30px' }}></div>
                </div>

                <div className="card">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {language === 'fr' ? 'Administrateurs' : 'Admins'}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-danger)' }}>
                        {stats.admins}
                    </p>
                    <div style={{ marginTop: 'var(--spacing-sm)', borderTop: '3px solid var(--color-danger)', width: '30px' }}></div>
                </div>

                <div className="card">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>Excom</p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-secondary)' }}>
                        {stats.excom}
                    </p>
                    <div style={{ marginTop: 'var(--spacing-sm)', borderTop: '3px solid var(--color-secondary)', width: '30px' }}></div>
                </div>

                <div className="card">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {language === 'fr' ? 'Membres' : 'Members'}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-success)' }}>
                        {stats.members}
                    </p>
                    <div style={{ marginTop: 'var(--spacing-sm)', borderTop: '3px solid var(--color-success)', width: '30px' }}></div>
                </div>

                <div className="card">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                        {language === 'fr' ? '2FA' : '2FA'}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-warning)' }}>
                        {stats.with2FA}
                    </p>
                    <div style={{ marginTop: 'var(--spacing-sm)', borderTop: '3px solid var(--color-warning)', width: '30px' }}></div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card mb-lg">
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                    {language === 'fr' ? 'Actions Rapides' : 'Quick Actions'}
                </h2>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={onNavigateToUsers}>
                        👥 {language === 'fr' ? 'Gestion des Utilisateurs' : 'User Management'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => onNavigateToAccessControl()}>
                        🔐 {language === 'fr' ? 'Contrôle d\'Accès' : 'Access Control'}
                    </button>
                </div>
            </div>

            {/* Recent Logins */}
            {recentUsers.length > 0 && (
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: 'var(--spacing-lg)', borderBottom: '2px solid #000000' }}>
                        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {language === 'fr' ? 'Connexions Récentes' : 'Recent Logins'}
                        </h2>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{language === 'fr' ? 'Utilisateur' : 'User'}</th>
                                    <th>{language === 'fr' ? 'Nom du Membre' : 'Member Name'}</th>
                                    <th>{language === 'fr' ? 'Rôle' : 'Role'}</th>
                                    <th>{language === 'fr' ? 'Dernière Connexion' : 'Last Login'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map(user => (
                                    <tr key={user.id}>
                                        <td style={{ fontWeight: 700 }}>{user.username}</td>
                                        <td>{user.memberName}</td>
                                        <td>
                                            <span className="badge" style={{ borderRadius: 0, fontWeight: 800, background: '#000000', color: '#ffffff' }}>
                                                {getRoleLabel(user.role, language).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="text-muted" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
                                            {new Date(user.lastLogin!).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};


const getRoleLabel = (role: User['role'], language: Language): string => {
    const labels = {
        admin: language === 'fr' ? 'Administrateur' : 'Administrator',
        excom: 'Excom',
        member: language === 'fr' ? 'Membre' : 'Member',
        guest: language === 'fr' ? 'Invité' : 'Guest'
    };
    return labels[role];
};
