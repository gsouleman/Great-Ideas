import React from 'react';
import { UnifiedDocumentView, DocumentSource } from '../../types/documents';

interface DocumentCardProps {
    document: UnifiedDocumentView;
    onView: (doc: UnifiedDocumentView) => void;
    onDownload: (doc: UnifiedDocumentView) => void;
    onDelete?: (doc: UnifiedDocumentView) => void;
    language: 'fr' | 'en';
}

const DocumentCard: React.FC<DocumentCardProps> = ({
    document,
    onView,
    onDownload,
    onDelete,
    language
}) => {
    const t = {
        fr: {
            view: 'Voir',
            download: 'Télécharger',
            delete: 'Supprimer',
            version: 'Version',
            expires: 'Expire le',
            generated: 'Généré',
            uploaded: 'Téléchargé',
            by: 'par'
        },
        en: {
            view: 'View',
            download: 'Download',
            delete: 'Delete',
            version: 'Version',
            expires: 'Expires',
            generated: 'Generated',
            uploaded: 'Uploaded',
            by: 'by'
        }
    };

    const text = t[language];

    const getStatusBadgeColor = (status: string): string => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('approved') || statusLower.includes('verified') || statusLower.includes('issued')) {
            return 'var(--success-color)';
        }
        if (statusLower.includes('pending')) {
            return 'var(--warning-color)';
        }
        if (statusLower.includes('rejected') || statusLower.includes('revoked') || statusLower.includes('expired')) {
            return 'var(--error-color)';
        }
        return 'var(--info-color)';
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US');
    };

    return (
        <div className="card" style={{
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)',
            borderLeft: `4px solid ${document.source === DocumentSource.GENERATED ? 'var(--success-color)' : 'var(--info-color)'}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: 'var(--spacing-xs)', wordBreak: 'break-word' }}>
                        {document.title}
                    </h4>
                    <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--spacing-xs)'
                    }}>
                        {document.description}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-sm)',
                        flexWrap: 'wrap',
                        marginTop: 'var(--spacing-sm)'
                    }}>
                        <span className="badge" style={{
                            backgroundColor: document.source === DocumentSource.GENERATED
                                ? 'var(--success-light)'
                                : 'var(--info-light)',
                            color: document.source === DocumentSource.GENERATED
                                ? 'var(--success-color)'
                                : 'var(--info-color)'
                        }}>
                            {document.source === DocumentSource.GENERATED ? text.generated : text.uploaded}
                        </span>

                        <span className="badge" style={{
                            backgroundColor: getStatusBadgeColor(document.status) + '20',
                            color: getStatusBadgeColor(document.status)
                        }}>
                            {document.status}
                        </span>

                        {document.version > 1 && (
                            <span className="badge">
                                {text.version} {document.version}
                            </span>
                        )}

                        {document.expiryDate && (
                            <span className="badge" style={{
                                backgroundColor: new Date(document.expiryDate) < new Date()
                                    ? 'var(--error-light)'
                                    : 'var(--warning-light)',
                                color: new Date(document.expiryDate) < new Date()
                                    ? 'var(--error-color)'
                                    : 'var(--warning-color)'
                            }}>
                                {text.expires}: {formatDate(document.expiryDate)}
                            </span>
                        )}
                    </div>

                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        marginTop: 'var(--spacing-sm)'
                    }}>
                        {formatDate(document.createdAt)} {text.by} {document.createdBy} • {formatFileSize(document.fileSize)}
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-xs)',
                    marginLeft: 'var(--spacing-md)'
                }}>
                    <button
                        onClick={() => onView(document)}
                        className="btn btn-sm btn-outline"
                        title={text.view}
                    >
                        👁️
                    </button>

                    <button
                        onClick={() => onDownload(document)}
                        className="btn btn-sm btn-primary"
                        title={text.download}
                    >
                        ⬇️
                    </button>

                    {onDelete && document.canDelete && (
                        <button
                            onClick={() => onDelete(document)}
                            className="btn btn-sm btn-danger"
                            title={text.delete}
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
