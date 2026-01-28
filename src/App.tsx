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
                background: 'var(--color-bg-header)',
                borderBottom: '1px solid var(--color-border)',
                padding: '0',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 var(--spacing-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch', // Stretch to allow nav links to fill height
                    height: '60px' // Professional fixed height
                }}>
                    <div className="flex items-center gap-md">
                        <div style={{
                            fontSize: 'var(--font-size-xl)',
                            background: 'var(--color-primary)',
                            color: 'white',
                            padding: '0 var(--spacing-md)',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 900,
                            letterSpacing: '-0.02em'
                        }}>
                            GREAT IDEAS
                        </div>
                    </div>

                    <nav className="flex" style={{ height: '100%' }}>
                        <button
                            className={`nav-link ${currentView === 'assets' ? 'active' : ''}`}
                            onClick={() => {
                                setCurrentView('assets');
                                setAssetView('dashboard');
                            }}
                        >
                            {language === 'fr' ? 'ACTIFS' : 'ASSETS'}
                        </button>
                        <button
                            className={`nav-link ${currentView === 'financial' ? 'active' : ''}`}
                            onClick={() => {
                                setCurrentView('financial');
                                setFinancialView('dashboard');
                            }}
                        >
                            {language === 'fr' ? 'FINANCIER' : 'FINANCE'}
                        </button>
                        {hasPermission('view_admin') && (
                            <button
                                className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                                onClick={() => {
                                    setCurrentView('admin');
                                    setAdminView('dashboard');
                                }}
                            >
                                {language === 'fr' ? 'GESTION' : 'MANAGEMENT'}
                            </button>
                        )}
                    </nav>

                    <div className="flex items-center gap-md">
                        <button
                            className="btn btn-outline btn-sm"
                            style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', borderRadius: '0' }}
                            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                        >
                            {language === 'fr' ? 'EN' : 'FR'}
                        </button>

                        {currentUser && (
                            <div className="flex items-center gap-sm">
                                <span style={{ color: 'var(--color-text-on-header-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                                    {currentUser.memberName.toUpperCase()}
                                </span>
                                <button
                                    className="btn btn-sm"
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--color-text-on-header)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '0',
                                        fontSize: 'var(--font-size-xs)'
                                    }}
                                    onClick={() => {
                                        if (window.confirm(language === 'fr' ? 'Se déconnecter?' : 'Logout?')) {
                                            logout();
                                        }
                                    }}
                                >
                                    {language === 'fr' ? 'DÉCONNEXION' : 'LOGOUT'}
                                </button>
                            </div>
                        )}
                    </div>
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
                        <div className="mb-lg" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-sm)' }}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                                <button
                                    className="nav-link"
                                    style={{ color: financialView === 'dashboard' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: financialView === 'dashboard' ? '2px solid var(--color-primary)' : 'none' }}
                                    onClick={() => setFinancialView('dashboard')}
                                >
                                    {t.dashboard.toUpperCase()}
                                </button>
                                <button
                                    className="nav-link"
                                    style={{ color: financialView === 'transactions' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: financialView === 'transactions' ? '2px solid var(--color-primary)' : 'none' }}
                                    onClick={() => setFinancialView('transactions')}
                                >
                                    {t.transactions.toUpperCase()}
                                </button>
                                <button
                                    className="nav-link"
                                    style={{ color: financialView === 'monthly' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: financialView === 'monthly' ? '2px solid var(--color-primary)' : 'none' }}
                                    onClick={() => setFinancialView('monthly')}
                                >
                                    {(language === 'fr' ? 'Solde Mensuel' : 'Monthly Balance').toUpperCase()}
                                </button>
                                <button
                                    className="nav-link"
                                    style={{ color: financialView === 'reports' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: financialView === 'reports' ? '2px solid var(--color-primary)' : 'none' }}
                                    onClick={() => setFinancialView('reports')}
                                >
                                    {t.reports.toUpperCase()}
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
                        <div className="mb-lg" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-sm)' }}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                                <button
                                    className="nav-link"
                                    style={{ color: adminView === 'dashboard' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: adminView === 'dashboard' ? '2px solid var(--color-primary)' : 'none' }}
                                    onClick={() => setAdminView('dashboard')}
                                >
                                    {(language === 'fr' ? 'Tableau de Bord' : 'Dashboard').toUpperCase()}
                                </button>
                                <button
                                    className="nav-link"
                                    style={{ color: adminView === 'accessControl' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', borderBottom: adminView === 'accessControl' ? '2px solid var(--color-primary)' : 'none' }}
                                    onClick={() => setAdminView('accessControl')}
                                >
                                    {(language === 'fr' ? 'Contrôle d\'Accès' : 'Access Control').toUpperCase()}
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
