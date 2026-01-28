import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { adminApi } from '../../utils/api';
import { UserRole } from '../../types/auth';

interface AccessControlPanelProps {
    language: Language;
}

type Module = 'FINANCIAL' | 'ASSETS' | 'ADMIN';

interface Permission {
    role: UserRole | string;
    module: Module;
    access: boolean;
}

export const AccessControlPanel: React.FC<AccessControlPanelProps> = ({ language }) => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const roles: UserRole[] = ['admin', 'excom', 'member', 'guest'];
    const modules: Module[] = ['FINANCIAL', 'ASSETS', 'ADMIN'];

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getPermissions();
            // Map backend Role (uppercase) to frontend UserRole (lowercase) if necessary, 
            // but let's assume the API returns what we need or we handle it here.
            setPermissions(data.map((p: any) => ({
                ...p,
                role: p.role.toLowerCase()
            })));
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (role: UserRole, module: Module, currentAccess: boolean) => {
        if (role === 'admin') return; // Cannot change admin permissions

        try {
            setSaving(true);
            await adminApi.updatePermission({
                role: role.toUpperCase(),
                module,
                access: !currentAccess
            });

            setPermissions(prev => {
                const index = prev.findIndex(p => p.role === role && p.module === module);
                if (index !== -1) {
                    const next = [...prev];
                    next[index] = { ...next[index], access: !currentAccess };
                    return next;
                }
                return [...prev, { role, module, access: !currentAccess }];
            });
        } catch (error) {
            alert(language === 'fr' ? 'Échec de la mise à jour' : 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const hasAccess = (role: UserRole, module: Module) => {
        const p = permissions.find(p => p.role === role && p.module === module);
        return p ? p.access : false;
    };

    if (loading) {
        return <div className="text-center p-xl">Loading...</div>;
    }

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {language === 'fr' ? 'Contrôle d\'Accès' : 'Access Control Panel'}
                </h1>
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{language === 'fr' ? 'Module / Rôle' : 'Module / Role'}</th>
                                {roles.map(role => (
                                    <th key={role} className="text-center" style={{ textTransform: 'capitalize' }}>
                                        {role}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {modules.map(module => (
                                <tr key={module}>
                                    <td style={{ fontWeight: 600 }}>
                                        {module === 'FINANCIAL' ? (language === 'fr' ? 'Financier' : 'Financial') :
                                            module === 'ASSETS' ? (language === 'fr' ? 'Actifs' : 'Assets') :
                                                'Admin'}
                                    </td>
                                    {roles.map(role => {
                                        const access = hasAccess(role, module);
                                        const isAdmin = role === 'admin';
                                        return (
                                            <td key={`${role}-${module}`} className="text-center">
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={access}
                                                        disabled={isAdmin || saving}
                                                        onChange={() => handleToggle(role, module, access)}
                                                    />
                                                    <span className="slider round"></span>
                                                </label>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: var(--color-border);
                    transition: .4s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                }
                input:checked + .slider {
                    background-color: var(--color-primary);
                }
                input:focus + .slider {
                    box-shadow: 0 0 1px var(--color-primary);
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
                .slider.round {
                    border-radius: 34px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }
                input:disabled + .slider {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            ` }} />
        </div>
    );
};
