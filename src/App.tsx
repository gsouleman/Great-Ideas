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
                background: '#000000',
                borderBottom: '4px solid var(--color-primary)',
                padding: '0',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                color: '#FFFFFF'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 var(--spacing-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    height: '64px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            fontSize: 'var(--font-size-2xl)',
                            color: '#FFFFFF',
                            fontWeight: 900,
                            letterSpacing: '-0.04em',
                            textTransform: 'uppercase',
                            lineHeight: 1
                        }}>
                            Great<br /><span style={{ color: 'var(--color-primary)' }}>Ideas</span>
                        </div>
                    </div>

                    <nav style={{ display: 'flex', height: '100%', marginLeft: 'var(--spacing-2xl)' }}>
                        <button
                            className={`nav-link ${currentView === 'assets' ? 'active' : ''}`}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: currentView === 'assets' ? '#FFFFFF' : '#999',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                fontSize: 'var(--font-size-xs)',
                                letterSpacing: '0.1em',
                                padding: '0 var(--spacing-lg)',
                                borderBottom: currentView === 'assets' ? '4px solid var(--color-primary)' : '4px solid transparent',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setCurrentView('assets');
                                setAssetView('dashboard');
                            }}
                        >
                            {language === 'fr' ? 'ACTIFS' : 'ASSETS'}
                        </button>
                        <button
                            className={`nav-link ${currentView === 'financial' ? 'active' : ''}`}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: currentView === 'financial' ? '#FFFFFF' : '#999',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                fontSize: 'var(--font-size-xs)',
                                letterSpacing: '0.1em',
                                padding: '0 var(--spacing-lg)',
                                borderBottom: currentView === 'financial' ? '4px solid var(--color-primary)' : '4px solid transparent',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
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
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: currentView === 'admin' ? '#FFFFFF' : '#999',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    fontSize: 'var(--font-size-xs)',
                                    letterSpacing: '0.1em',
                                    padding: '0 var(--spacing-lg)',
                                    borderBottom: currentView === 'admin' ? '4px solid var(--color-primary)' : '4px solid transparent',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setCurrentView('admin');
                                    setAdminView('dashboard');
                                }}
                            >
                                {language === 'fr' ? 'GESTION' : 'MANAGEMENT'}
                            </button>
                        )}
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginLeft: 'auto' }}>
                        <button
                            className="btn btn-sm"
                            style={{
                                background: 'transparent',
                                color: '#FFFFFF',
                                border: '1px solid #444',
                                borderRadius: 0,
                                fontWeight: 900,
                                fontSize: 'var(--font-size-xs)'
                            }}
                            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                        >
                            {language === 'fr' ? 'EN' : 'FR'}
                        </button>

                        {currentUser && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', borderLeft: '1px solid #333', paddingLeft: 'var(--spacing-md)', height: '100%' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#FFFFFF', fontSize: 'var(--font-size-xs)', fontWeight: 900, textTransform: 'uppercase' }}>
                                        {currentUser.memberName}
                                    </div>
                                    <div style={{ color: 'var(--color-primary)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {currentUser.role}
                                    </div>
                                </div>
                                <button
                                    className="btn btn-sm"
                                    style={{
                                        background: 'var(--color-primary)',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: 0,
                                        fontSize: 'var(--font-size-xs)',
                                        fontWeight: 900,
                                        height: '32px'
                                    }}
                                    onClick={() => {
                                        if (window.confirm(language === 'fr' ? 'Se déconnecter?' : 'Logout?')) {
                                            logout();
                                        }
                                    }}
                                >
                                    {language === 'fr' ? 'LOGOUT' : 'LOGOUT'}
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
                padding: 'var(--spacing-2xl) var(--spacing-lg)',
                color: '#666',
                fontSize: 'var(--font-size-xs)',
                borderTop: '1px solid #eee',
                background: '#fafafa',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                <p>© 2026 Great Ideas Association • {language === 'fr' ? 'SYSTÈME DE GESTION ADMINISTRATIVE' : 'ADMINISTRATIVE MANAGEMENT SYSTEM'}</p>
                <p style={{ marginTop: '8px', color: '#999', fontWeight: 500 }}>SECURED ACCESS • AUTHORIZED PERSONNEL ONLY</p>
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
