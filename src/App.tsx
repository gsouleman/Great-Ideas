import { useState, useEffect } from 'react';
import { Transaction, Language } from './types';
import { AssetView } from './types/assets';

type FinancialView = 'dashboard' | 'transactions' | 'monthly' | 'reports';
type AdminView = 'dashboard' | 'users' | 'accessControl';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { LedgerReport } from './components/LedgerReport';
import { MonthlyBalanceView } from './components/MonthlyBalanceView';
import { AssetManagementDashboard } from './components/AssetManagement/AssetManagementDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { ChangePasswordModal } from './components/Auth/ChangePasswordModal';
import { AdminPanel } from './components/Admin/AdminPanel';
import { UserManagement } from './components/Admin/UserManagement';
import { AccessControlPanel } from './components/Admin/AccessControlPanel';
import { loadTransactions, saveTransactions, addTransaction, updateTransaction, deleteTransaction } from './utils/storage';
import { sampleTransactions } from './data/sampleData';
import { translations } from './utils/translations';
import './index.css';

type View = 'financial' | 'assets' | 'admin';

function AppContent() {
    const { currentUser, logout, hasPermission } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentView, setCurrentView] = useState<View>('financial');
    const [financialView, setFinancialView] = useState<FinancialView>('dashboard');
    const [assetView, setAssetView] = useState<AssetView>('dashboard');
    const [adminView, setAdminView] = useState<AdminView>('dashboard');
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
    const [language, setLanguage] = useState<Language>('en');
    const [showPasswordChange, setShowPasswordChange] = useState(false);

    const t = translations[language];

    // Check if user must change password
    useEffect(() => {
        if (currentUser && currentUser.mustChangePassword) {
            setShowPasswordChange(true);
        }
    }, [currentUser]);

    useEffect(() => {
        const loaded = loadTransactions();
        if (loaded.length === 0) {
            // Initialize with sample data
            saveTransactions(sampleTransactions);
            setTransactions(sampleTransactions);
        } else {
            setTransactions(loaded);
        }
    }, []);

    const handleAddTransaction = (transaction: Transaction) => {
        const updated = addTransaction(transactions, transaction);
        setTransactions(updated);
        setShowForm(false);
    };

    const handleUpdateTransaction = (transaction: Transaction) => {
        const updated = updateTransaction(transactions, transaction.id, transaction);
        setTransactions(updated);
        setShowForm(false);
        setEditingTransaction(undefined);
    };

    const handleDeleteTransaction = (id: string) => {
        const updated = deleteTransaction(transactions, id);
        setTransactions(updated);
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingTransaction(undefined);
    };

    const handleSaveTransaction = (transaction: Transaction) => {
        if (editingTransaction) {
            handleUpdateTransaction(transaction);
        } else {
            handleAddTransaction(transaction);
        }
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Header */}
            <header style={{
                background: 'var(--color-bg-secondary)',
                borderBottom: '1px solid var(--color-border)',
                padding: 'var(--spacing-lg) 0',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 var(--spacing-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div className="flex items-center gap-md">
                        <div style={{
                            fontSize: 'var(--font-size-2xl)',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700
                        }}>
                            💡 Great Ideas
                        </div>
                    </div>

                    <nav className="flex gap-sm">
                        <button
                            className={`btn ${currentView === 'assets' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => {
                                setCurrentView('assets');
                                setAssetView('dashboard');
                            }}
                        >
                            {t.assetManagement}
                        </button>
                        <button
                            className={`btn ${currentView === 'financial' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => {
                                setCurrentView('financial');
                                setFinancialView('dashboard');
                            }}
                        >
                            {language === 'fr' ? 'Financier' : 'Financial'}
                        </button>
                        {hasPermission('view_admin') && (
                            <button
                                className={`btn ${currentView === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => {
                                    setCurrentView('admin');
                                    setAdminView('dashboard');
                                }}
                            >
                                {language === 'fr' ? 'Administration' : 'Admin'}
                            </button>
                        )}
                    </nav>

                    <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                    >
                        {language === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
                    </button>

                    {currentUser && (
                        <div className="flex items-center gap-sm">
                            <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                                {currentUser.memberName}
                            </span>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => {
                                    if (window.confirm(language === 'fr' ? 'Se déconnecter?' : 'Logout?')) {
                                        logout();
                                    }
                                }}
                            >
                                {language === 'fr' ? 'Déconnexion' : 'Logout'}
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main style={{
                flex: 1,
                maxWidth: '1400px',
                width: '100%',
                margin: '0 auto',
                padding: 'var(--spacing-2xl) var(--spacing-lg)'
            }}>
                {currentView === 'financial' && (
                    <div>
                        {/* Financial Sub-Navigation */}
                        <div className="card mb-lg" style={{ padding: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                                <button
                                    className={`btn ${financialView === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setFinancialView('dashboard')}
                                >
                                    {t.dashboard}
                                </button>
                                <button
                                    className={`btn ${financialView === 'transactions' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setFinancialView('transactions')}
                                >
                                    {t.transactions}
                                </button>
                                <button
                                    className={`btn ${financialView === 'monthly' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setFinancialView('monthly')}
                                >
                                    {language === 'fr' ? 'Solde Mensuel' : 'Monthly Balance'}
                                </button>
                                <button
                                    className={`btn ${financialView === 'reports' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setFinancialView('reports')}
                                >
                                    {t.reports}
                                </button>
                            </div>
                        </div>

                        {/* Financial Content */}
                        {financialView === 'dashboard' && (
                            <Dashboard
                                transactions={transactions}
                                language={language}
                                onAddTransaction={() => setShowForm(true)}
                            />
                        )}

                        {financialView === 'transactions' && (
                            <TransactionList
                                transactions={transactions}
                                onEdit={handleEdit}
                                onDelete={handleDeleteTransaction}
                                onAdd={() => setShowForm(true)}
                                language={language}
                            />
                        )}

                        {financialView === 'monthly' && (
                            <MonthlyBalanceView
                                transactions={transactions}
                                language={language}
                            />
                        )}

                        {financialView === 'reports' && (
                            <LedgerReport
                                transactions={transactions}
                                language={language}
                            />
                        )}
                    </div>
                )}

                {currentView === 'assets' && (
                    <AssetManagementDashboard
                        language={language}
                        activeView={assetView}
                        onViewChange={setAssetView}
                    />
                )}

                {currentView === 'admin' && (
                    <div>
                        {/* Admin Sub-Navigation */}
                        <div className="card mb-lg" style={{ padding: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                                <button
                                    className={`btn ${adminView === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setAdminView('dashboard')}
                                >
                                    {language === 'fr' ? 'Tableau de Bord' : 'Dashboard'}
                                </button>
                                <button
                                    className={`btn ${adminView === 'accessControl' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setAdminView('accessControl')}
                                >
                                    {language === 'fr' ? 'Contrôle d\'Accès' : 'Access Control'}
                                </button>
                            </div>
                        </div>

                        {/* Admin Content */}
                        {adminView === 'dashboard' && (
                            <AdminPanel
                                language={language}
                                onNavigateToUsers={() => setAdminView('users')}
                                onNavigateToAccessControl={() => setAdminView('accessControl')}
                            />
                        )}

                        {adminView === 'users' && (
                            <UserManagement language={language} />
                        )}

                        {adminView === 'accessControl' && (
                            <AccessControlPanel language={language} />
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer style={{
                textAlign: 'center',
                padding: 'var(--spacing-xl)',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-sm)'
            }}>
                <p>© 2026 Great Ideas Association - {language === 'fr' ? 'Système de Gestion Financière' : 'Financial Management System'}</p>
            </footer>

            {/* Transaction Form Modal */}
            {showForm && (
                <TransactionForm
                    transaction={editingTransaction}
                    onSave={handleSaveTransaction}
                    onCancel={handleCancelForm}
                    language={language}
                />
            )}

            {/* Password Change Modal */}
            {showPasswordChange && currentUser && (
                <ChangePasswordModal
                    userId={currentUser.id}
                    language={language}
                    isFirstLogin={currentUser.mustChangePassword}
                    onClose={() => setShowPasswordChange(false)}
                    onSuccess={() => {
                        setShowPasswordChange(false);
                        alert(language === 'fr' ? 'Mot de passe changé avec succès!' : 'Password changed successfully!');
                    }}
                />
            )}
        </div>
    );
}

// Main App with Auth
function App() {
    return (
        <AuthProvider>
            <AppWithAuth />
        </AuthProvider>
    );
}

// Auth wrapper
function AppWithAuth() {
    const { isAuthenticated } = useAuth();
    // The language state is managed within AppContent, so no need to redefine it here.
    // However, if LoginForm needs language, it must be passed.
    // For now, assuming LoginForm can handle its own language or gets it from context.

    if (!isAuthenticated) {
        // If LoginForm needs language, it should be passed here.
        // For example: return <LoginForm language={someLanguageStateOrContext} onLoginSuccess={() => {}} />;
        // As per the provided snippet, it expects language. Let's assume a default or context for LoginForm.
        // Or, if AppWithAuth needs to manage language for LoginForm, it would need its own language state.
        // Given the original AppContent manages language, let's assume LoginForm can get it from context or a default.
        // The provided snippet for AppWithAuth had `const [language, setLanguage] = useState<Language>('fr');`
        // but that conflicts with AppContent's management.
        // For now, I'll use a placeholder for language if LoginForm truly needs it from AppWithAuth.
        // However, the instruction only provided the `App` and `AppWithAuth` structure, not how `language` is handled for `LoginForm`.
        // I will use the `language` variable from the original snippet for LoginForm, assuming it's defined in this scope.
        // But it's not. So, I'll remove the `language` prop from LoginForm for now, or assume it's available via context.
        // Let's re-add the language state to AppWithAuth for LoginForm's sake, as it was in the provided snippet.
        const [language] = useState<Language>('en'); // Re-adding as per the provided snippet, assuming LoginForm needs it.
        return <LoginForm language={language} onLoginSuccess={() => { }} />;
    }

    return <AppContent />;
}

export default App;
