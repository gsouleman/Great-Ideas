import React, { useState } from 'react';
import { Language } from '../../types/assets';
import { translations } from '../../utils/translations';
import DocumentDashboard from '../Documents/DocumentDashboard';
import DocumentsList from '../Documents/DocumentsList';
import DocumentGeneration from '../Documents/DocumentGeneration';
import DocumentUpload from '../Documents/DocumentUpload';

interface DocumentsManagerProps {
    language: Language;
}

type DocView = 'dashboard' | 'list' | 'generate' | 'upload';

export const DocumentsManager: React.FC<DocumentsManagerProps> = ({ language }) => {
    const t = translations[language];
    const [activeView, setActiveView] = useState<DocView>('dashboard');

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-lg">
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                    {t.documents}
                </h1>
            </div>

            {/* Document Sub-navigation */}
            <div className="card mb-lg" style={{ padding: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                    <button
                        className={activeView === 'dashboard' ? 'btn btn-primary' : 'btn btn-outline'}
                        onClick={() => setActiveView('dashboard')}
                    >
                        📊 {language === 'fr' ? 'Tableau de Bord' : 'Dashboard'}
                    </button>
                    <button
                        className={activeView === 'list' ? 'btn btn-primary' : 'btn btn-outline'}
                        onClick={() => setActiveView('list')}
                    >
                        📋 {language === 'fr' ? 'Liste' : 'List'}
                    </button>
                    <button
                        className={activeView === 'generate' ? 'btn btn-primary' : 'btn btn-outline'}
                        onClick={() => setActiveView('generate')}
                    >
                        ✨ {language === 'fr' ? 'Générer' : 'Generate'}
                    </button>
                    <button
                        className={activeView === 'upload' ? 'btn btn-primary' : 'btn btn-outline'}
                        onClick={() => setActiveView('upload')}
                    >
                        ⬆️ {language === 'fr' ? 'Télécharger' : 'Upload'}
                    </button>
                </div>
            </div>

            {/* Document Views */}
            {activeView === 'dashboard' && <DocumentDashboard language={language} />}
            {activeView === 'list' && <DocumentsList language={language} />}
            {activeView === 'generate' && <DocumentGeneration language={language} currentUserId="admin" />}
            {activeView === 'upload' && <DocumentUpload language={language} currentUserId="admin" />}
        </div>
    );
};
