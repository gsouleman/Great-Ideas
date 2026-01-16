import React from 'react';
import { Language } from '../../types';
import { loadUsers } from '../../utils/authStorage';
import { User } from '../../types/auth';

interface AdminPanelProps {
    language: Language;
    onNavigateToUsers: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ language, onNavigateToUsers }) => {
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                        {language === 'fr' ? 'Total Utilisateurs' : 'Total Users'}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {stats.total}
                    </p>
                </div>

                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                        {language === 'fr' ? 'Administrateurs' : 'Administrators'}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-danger)' }}>
                        {stats.admins}
                    </p>
                </div>

                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Excom</p>
                    <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-secondary)' }}>
                        {stats.excom}
                    </p>
                </div>

                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                        {language === 'fr' ? 'Membres' : 'Members'}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-success)' }}>
                        {stats.members}
                    </p>
                </div>

                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                        {language === 'fr' ? 'Invités' : 'Guests'}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                        {stats.guests}
                    </p>
                </div>

                <div className="card card-compact">
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                        {language === 'fr' ? '2FA Activé' : '2FA Enabled'}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-warning)' }}>
                        {stats.with2FA}
                    </p>
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
                </div>
            </div>

            {/* Recent Logins */}
            {recentUsers.length > 0 && (
                <div className="card">
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                        {language === 'fr' ? 'Connexions Récentes' : 'Recent Logins'}
                    </h2>
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
                                        <td>{user.username}</td>
                                        <td>{user.memberName}</td>
                                        <td>
                                            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                                {getRoleLabel(user.role, language)}
                                            </span>
                                        </td>
                                        <td className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
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

const getRoleBadgeClass = (role: User['role']): string => {
    switch (role) {
        case 'admin': return 'badge-expense';
        case 'excom': return '';
        case 'member': return 'badge-income';
        case 'guest': return '';
        default: return '';
    }
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
