import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { User } from '../../types/auth';
import { adminApi } from '../../utils/api';
import { UserForm } from './UserForm';

interface UserManagementProps {
    language: Language;
}

export const UserManagement: React.FC<UserManagementProps> = ({ language }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | undefined>();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');

    const refreshUsers = async () => {
        try {
            const data = await adminApi.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    const handleAddUser = () => {
        setEditingUser(undefined);
        setShowForm(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleDeleteUser = async (user: User) => {
        if (user.username === 'admin') {
            alert(language === 'fr'
                ? 'Impossible de supprimer l\'administrateur par défaut'
                : 'Cannot delete the default administrator');
            return;
        }

        const confirmMessage = language === 'fr'
            ? `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.username}"?`
            : `Are you sure you want to delete user "${user.username}"?`;

        if (window.confirm(confirmMessage)) {
            try {
                await adminApi.deleteUser(user.id);
                refreshUsers();
            } catch (error) {
                alert(language === 'fr' ? 'Échec de la suppression' : 'Deletion failed');
            }
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingUser(undefined);
        refreshUsers();
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {language === 'fr' ? 'Gestion des Utilisateurs' : 'User Management'}
                </h1>
                <button className="btn btn-primary" onClick={handleAddUser}>
                    <span>+</span> {language === 'fr' ? 'Ajouter Utilisateur' : 'Add User'}
                </button>
            </div>

            {/* Filters */}
            <div className="card mb-lg" style={{ padding: 'var(--spacing-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--spacing-md)' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="form-select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        style={{ minWidth: '200px' }}
                    >
                        <option value="all">{language === 'fr' ? 'Tous les rôles' : 'All Roles'}</option>
                        <option value="admin">{language === 'fr' ? 'Administrateur' : 'Administrator'}</option>
                        <option value="excom">Excom</option>
                        <option value="member">{language === 'fr' ? 'Membre' : 'Member'}</option>
                        <option value="guest">{language === 'fr' ? 'Invité' : 'Guest'}</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{language === 'fr' ? 'Nom d\'utilisateur' : 'Username'}</th>
                                <th>{language === 'fr' ? 'Nom du Membre' : 'Member Name'}</th>
                                <th>Email</th>
                                <th>{language === 'fr' ? 'Rôle' : 'Role'}</th>
                                <th className="text-center">2FA</th>
                                <th>{language === 'fr' ? 'Dernière Connexion' : 'Last Login'}</th>
                                <th className="text-center no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center text-muted" style={{ padding: 'var(--spacing-xl)' }}>
                                        {language === 'fr' ? 'Aucun utilisateur trouvé' : 'No users found'}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <strong>{user.username}</strong>
                                            {user.mustChangePassword && (
                                                <span className="badge" style={{
                                                    marginLeft: 'var(--spacing-xs)',
                                                    background: 'rgba(245, 158, 11, 0.2)',
                                                    color: 'var(--color-warning)',
                                                    border: '2px solid var(--color-warning)',
                                                    fontSize: 'var(--font-size-xs)'
                                                }}>
                                                    {language === 'fr' ? 'Doit changer MdP' : 'Must Change Pwd'}
                                                </span>
                                            )}
                                        </td>
                                        <td>{user.memberName}</td>
                                        <td className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>{user.email}</td>
                                        <td>
                                            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                                {getRoleLabel(user.role, language)}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            {user.is2FAEnabled ? (
                                                <span style={{ color: 'var(--color-success)', fontSize: 'var(--font-size-lg)' }}>✓</span>
                                            ) : (
                                                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-lg)' }}>-</span>
                                            )}
                                        </td>
                                        <td className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                                            {user.lastLogin
                                                ? new Date(user.lastLogin).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short'
                                                })
                                                : '-'}
                                        </td>
                                        <td className="no-print">
                                            <div className="flex gap-sm justify-center">
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    {language === 'fr' ? 'Modifier' : 'Edit'}
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDeleteUser(user)}
                                                    disabled={user.username === 'admin'}
                                                >
                                                    {language === 'fr' ? 'Supprimer' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{
                    padding: 'var(--spacing-md)',
                    borderTop: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)'
                }}>
                    {language === 'fr'
                        ? `${filteredUsers.length} utilisateur(s) affiché(s) sur ${users.length} total`
                        : `Showing ${filteredUsers.length} of ${users.length} user(s)`}
                </div>
            </div>

            {showForm && (
                <UserForm
                    user={editingUser}
                    language={language}
                    onClose={handleFormClose}
                />
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
