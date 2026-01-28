import React, { useState } from 'react';
import { getAllDocumentsUnified } from '../../utils/documentStorage';
import { UnifiedDocumentView, DocumentCategory } from '../../types/documents';
import DocumentCard from './DocumentCard';

interface DocumentsListProps {
    language: 'fr' | 'en';
}

const DocumentsList: React.FC<DocumentsListProps> = ({ language }) => {
    const [documents, setDocuments] = useState<UnifiedDocumentView[]>([]);
    const [filteredDocs, setFilteredDocs] = useState<UnifiedDocumentView[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'ALL'>('ALL');
    const [viewerDoc, setViewerDoc] = useState<UnifiedDocumentView | null>(null);

    React.useEffect(() => {
        loadDocuments();
    }, []);

    React.useEffect(() => {
        filterDocuments();
    }, [documents, searchTerm, selectedCategory]);

    const loadDocuments = () => {
        const docs = getAllDocumentsUnified();
        setDocuments(docs);
    };

    const filterDocuments = () => {
        let filtered = [...documents];

        // Filter by category
        if (selectedCategory !== 'ALL') {
            filtered = filtered.filter(d => d.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(d =>
                d.title.toLowerCase().includes(term) ||
                d.description.toLowerCase().includes(term) ||
                d.status.toLowerCase().includes(term)
            );
        }

        setFilteredDocs(filtered);
    };

    const handleView = (doc: UnifiedDocumentView) => {
        setViewerDoc(doc);
    };

    const handleDownload = (doc: UnifiedDocumentView) => {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = doc.fileUrl;
        link.download = doc.title;
        link.click();
    };

    const handleDelete = (doc: UnifiedDocumentView) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${doc.title}"?`)) {
            // Implementation would delete from storage
            // For now, just reload
            loadDocuments();
        }
    };

    const t = {
        fr: {
            title: 'Liste des Documents',
            search: 'Rechercher...',
            all: 'Toutes catégories',
            membership: 'Adhésion',
            shares: 'Actions',
            land: 'Terrain',
            financial: 'Financier',
            governance: 'Gouvernance',
            succession: 'Succession',
            noDocuments: 'Aucun document trouvé',
            totalDocuments: 'Total',
            closeViewer: 'Fermer'
        },
        en: {
            title: 'Documents List',
            search: 'Search...',
            all: 'All categories',
            membership: 'Membership',
            shares: 'Shares',
            land: 'Land',
            financial: 'Financial',
            governance: 'Governance',
            succession: 'Succession',
            noDocuments: 'No documents found',
            totalDocuments: 'Total',
            closeViewer: 'Close'
        }
    };

    const text = t[language];

    const categoryOptions: Record<string, string> = {
        'ALL': text.all,
        [DocumentCategory.MEMBERSHIP]: text.membership,
        [DocumentCategory.SHARES]: text.shares,
        [DocumentCategory.LAND]: text.land,
        [DocumentCategory.FINANCIAL]: text.financial,
        [DocumentCategory.GOVERNANCE]: text.governance,
        [DocumentCategory.SUCCESSION]: text.succession
    };

    return (
        <div className="fade-in">
            <div style={{ padding: 'var(--spacing-lg)', borderBottom: '4px solid #000000', marginBottom: 'var(--spacing-xl)' }}>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                    {text.title}
                </h2>
            </div>

            {/* Filters */}
            <div className="card mb-lg" style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--spacing-md)'
                }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                            {language === 'fr' ? 'RECHERCHER' : 'SEARCH'}
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder={text.search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                            {language === 'fr' ? 'CATÉGORIE' : 'CATEGORY'}
                        </label>
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory | 'ALL')}
                        >
                            {Object.entries(categoryOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Documents count */}
            <div style={{
                marginBottom: 'var(--spacing-md)',
                color: '#000000',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {text.totalDocuments}: <span style={{ color: 'var(--color-primary)' }}>{filteredDocs.length}</span>
            </div>

            {/* Documents list */}
            {filteredDocs.length === 0 ? (
                <div className="card" style={{
                    padding: 'var(--spacing-xl)',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                }}>
                    {text.noDocuments}
                </div>
            ) : (
                filteredDocs.map(doc => (
                    <DocumentCard
                        key={doc.id}
                        document={doc}
                        onView={handleView}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                        language={language}
                    />
                ))
            )}

            {/* Simple Document Viewer Modal */}
            {viewerDoc && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: 'var(--spacing-lg)'
                }} onClick={() => setViewerDoc(null)}>
                    <div style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-lg)',
                        maxWidth: '900px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            padding: 'var(--spacing-md)',
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3>{viewerDoc.title}</h3>
                            <button
                                onClick={() => setViewerDoc(null)}
                                className="btn btn-sm btn-outline"
                            >
                                {text.closeViewer}
                            </button>
                        </div>
                        <div style={{
                            flex: 1,
                            overflow: 'auto',
                            padding: 'var(--spacing-md)'
                        }}>
                            {viewerDoc.mimeType.startsWith('image/') ? (
                                <img
                                    src={viewerDoc.fileUrl}
                                    alt={viewerDoc.title}
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            ) : viewerDoc.mimeType === 'application/pdf' ? (
                                <iframe
                                    src={viewerDoc.fileUrl}
                                    style={{ width: '100%', height: '600px', border: 'none' }}
                                    title={viewerDoc.title}
                                />
                            ) : (
                                <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--text-secondary)' }}>
                                    Aperçu non disponible pour ce type de fichier.
                                    <br /><br />
                                    <button onClick={() => handleDownload(viewerDoc)} className="btn btn-primary">
                                        Télécharger le fichier
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentsList;
