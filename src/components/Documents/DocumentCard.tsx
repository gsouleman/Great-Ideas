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
            padding: 0,
            marginBottom: 'var(--spacing-md)',
            borderLeft: `8px solid ${document.source === DocumentSource.GENERATED ? 'var(--color-success)' : 'var(--color-primary)'}`,
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                <div style={{ flex: 1, padding: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                        <span style={{
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: document.source === DocumentSource.GENERATED ? 'var(--color-success)' : 'var(--color-primary)'
                        }}>
                            {document.source === DocumentSource.GENERATED ? text.generated : text.uploaded}
                        </span>
                        <span style={{ color: '#DDD' }}>|</span>
                        <span style={{
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: getStatusBadgeColor(document.status)
                        }}>
                            {document.status}
                        </span>
                    </div>

                    <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 900, textTransform: 'uppercase', marginBottom: 'var(--spacing-xs)', color: '#000000' }}>
                        {document.title}
                    </h4>

                    <div style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        fontStyle: 'italic',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        {document.description}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-md)',
                        alignItems: 'center',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 700,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase'
                    }}>
                        <span>{formatDate(document.createdAt)}</span>
                        <span>•</span>
                        <span>{text.by} {document.createdBy}</span>
                        <span>•</span>
                        <span>{formatFileSize(document.fileSize)}</span>
                        {document.version > 1 && (
                            <>
                                <span>•</span>
                                <span style={{ color: '#000', fontWeight: 900 }}>v{document.version}</span>
                            </>
                        )}
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '1px solid var(--color-border)',
                    background: '#fcfcfc'
                }}>
                    <button
                        onClick={() => onView(document)}
                        className="btn btn-sm"
                        style={{ flex: 1, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--color-border)', background: 'transparent' }}
                        title={text.view}
                    >
                        👁️
                    </button>

                    <button
                        onClick={() => onDownload(document)}
                        className="btn btn-sm"
                        style={{ flex: 1, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--color-border)', background: 'transparent' }}
                        title={text.download}
                    >
                        ⬇️
                    </button>

                    {onDelete && document.canDelete && (
                        <button
                            onClick={() => onDelete(document)}
                            className="btn btn-sm"
                            style={{ flex: 1, borderRadius: 0, border: 'none', background: 'transparent', color: 'var(--color-danger)' }}
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
