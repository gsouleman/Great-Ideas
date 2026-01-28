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
            setUsers(Array.isArray(data) ? data : []);
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
            <div className="card" style={{ padding: 0 }}>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{language === 'fr' ? 'Utilisateur' : 'Username'}</th>
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
                                            <div style={{ fontWeight: 800 }}>{user.username}</div>
                                            {user.mustChangePassword && (
                                                <span className="badge" style={{
                                                    background: 'var(--color-warning)',
                                                    color: '#000000',
                                                    borderRadius: 0,
                                                    fontSize: 'var(--font-size-xs)',
                                                    fontWeight: 800,
                                                    marginTop: '4px',
                                                    display: 'inline-block'
                                                }}>
                                                    {language === 'fr' ? 'CHANGE PWD' : 'CHANGE PWD'}
                                                </span>
                                            )}
                                        </td>
                                        <td>{user.memberName}</td>
                                        <td className="text-muted" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>{user.email}</td>
                                        <td>
                                            <span className="badge" style={{ borderRadius: 0, fontWeight: 800, background: '#000000', color: '#ffffff' }}>
                                                {getRoleLabel(user.role, language).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            {user.is2FAEnabled ? (
                                                <span style={{ color: 'var(--color-success)', fontWeight: 900 }}>YES</span>
                                            ) : (
                                                <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                                            )}
                                        </td>
                                        <td className="text-muted" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
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
                    borderTop: '1px solid #000000',
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-xs)',
                    textTransform: 'uppercase',
                    fontWeight: 700
                }}>
                    {language === 'fr'
                        ? `${filteredUsers.length} affiché(s) / ${users.length} total`
                        : `Showing ${filteredUsers.length} / ${users.length} users`}
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


const getRoleLabel = (role: User['role'], language: Language): string => {
    const labels = {
        admin: language === 'fr' ? 'Administrateur' : 'Administrator',
        excom: 'Excom',
        member: language === 'fr' ? 'Membre' : 'Member',
        guest: language === 'fr' ? 'Invité' : 'Guest'
    };
    return labels[role];
};
