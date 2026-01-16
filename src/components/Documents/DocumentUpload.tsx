import React, { useState } from 'react';
import { uploadDocumentConfigs } from '../../data/documentTemplates';
import { uploadDocumentNames, uploadDocumentDescriptions } from '../../data/documentTranslations';
import { uploadDocument } from '../../utils/documentStorage';
import { UploadedDocumentType, DocumentUploadRequest, DocumentCategory, LinkedEntityType } from '../../types/documents';
import { loadMembers } from '../../utils/assetStorage';

interface DocumentUploadProps {
    language: 'fr' | 'en';
    currentUserId: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ language, currentUserId }) => {
    const [selectedType, setSelectedType] = useState<UploadedDocumentType | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<Record<string, any>>({});
    const [linkedMemberId, setLinkedMemberId] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'ALL'>('ALL');

    const members = loadMembers();

    const t = {
        fr: {
            title: 'Télécharger un Document',
            selectType: 'Sélectionner le type de document',
            category: 'Catégorie',
            all: 'Toutes',
            membership: 'Adhésion',
            shares: 'Actions',
            land: 'Terrain',
            financial: 'Financier',
            governance: 'Gouvernance',
            succession: 'Succession',
            chooseFile: 'Choisir un fichier',
            noFileSelected: 'Aucun fichier sélectionné',
            fileSelected: 'Fichier sélectionné',
            linkToMember: 'Lier au membre',
            noMember: 'Aucun membre',
            metadata: 'Informations du document',
            upload: 'Télécharger',
            cancel: 'Annuler',
            uploading: 'Téléchargement en cours...',
            successMessage: 'Document téléchargé avec succès!',
            dragDrop: 'Glissez-déplacez un fichier ici, ou cliquez pour sélectionner',
            allowedFormats: 'Formats acceptés',
            maxSize: 'Taille max',
            required: 'Requis',
            optional: 'Optionnel'
        },
        en: {
            title: 'Upload Document',
            selectType: 'Select document type',
            category: 'Category',
            all: 'All',
            membership: 'Membership',
            shares: 'Shares',
            land: 'Land',
            financial: 'Financial',
            governance: 'Governance',
            succession: 'Succession',
            chooseFile: 'Choose file',
            noFileSelected: 'No file selected',
            fileSelected: 'File selected',
            linkToMember: 'Link to member',
            noMember: 'No member',
            metadata: 'Document information',
            upload: 'Upload',
            cancel: 'Cancel',
            uploading: 'Uploading...',
            successMessage: 'Document successfully uploaded!',
            dragDrop: 'Drag and drop a file here, or click to select',
            allowedFormats: 'Allowed formats',
            maxSize: 'Max size',
            required: 'Required',
            optional: 'Optional'
        }
    };

    const text = t[language];

    const categoryLabels: Record<string, string> = {
        'ALL': text.all,
        [DocumentCategory.MEMBERSHIP]: text.membership,
        [DocumentCategory.SHARES]: text.shares,
        [DocumentCategory.LAND]: text.land,
        [DocumentCategory.FINANCIAL]: text.financial,
        [DocumentCategory.GOVERNANCE]: text.governance,
        [DocumentCategory.SUCCESSION]: text.succession
    };

    const filteredConfigs = selectedCategory === 'ALL'
        ? uploadDocumentConfigs
        : uploadDocumentConfigs.filter(c => c.category === selectedCategory);

    const selectedConfig = selectedType
        ? uploadDocumentConfigs.find(c => c.type === selectedType)
        : null;

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        setError(null);
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedConfig || !selectedFile) return;

        setIsUploading(true);
        setError(null);
        setSuccess(null);

        try {
            const request: DocumentUploadRequest = {
                documentType: selectedConfig.type,
                file: selectedFile,
                uploadedBy: currentUserId,
                linkedEntityType: linkedMemberId ? LinkedEntityType.MEMBER : undefined,
                linkedEntityId: linkedMemberId || undefined,
                metadata
            };

            await uploadDocument(request);
            setSuccess(text.successMessage);
            setSelectedType(null);
            setSelectedFile(null);
            setMetadata({});
            setLinkedMemberId('');
        } catch (error: any) {
            setError(error.message || 'Erreur lors du téléchargement');
        } finally {
            setIsUploading(false);
        }
    };

    const renderMetadataField = (rule: any) => {
        const value = metadata[rule.field] || '';

        if (rule.rule === 'DATE_RANGE' || rule.field.toLowerCase().includes('date')) {
            return (
                <input
                    type="date"
                    className="input"
                    value={value}
                    onChange={(e) => setMetadata({ ...metadata, [rule.field]: e.target.value })}
                />
            );
        }

        return (
            <input
                type="text"
                className="input"
                value={value}
                onChange={(e) => setMetadata({ ...metadata, [rule.field]: e.target.value })}
            />
        );
    };

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>{text.title}</h2>

            {!selectedType ? (
                <>
                    {/* Category filter */}
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <label className="label">{text.category}</label>
                        <select
                            className="input"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory | 'ALL')}
                            style={{ maxWidth: '300px' }}
                        >
                            {Object.entries(categoryLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Document type selection grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 'var(--spacing-md)'
                    }}>
                        {filteredConfigs.map(config => (
                            <div
                                key={config.id}
                                className="card"
                                style={{
                                    padding: 'var(--spacing-md)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onClick={() => setSelectedType(config.type)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>
                                    {uploadDocumentNames[config.type][language]}
                                </h4>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    marginBottom: 'var(--spacing-sm)'
                                }}>
                                    {uploadDocumentDescriptions[config.type][language]}
                                </p>
                                <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                                    <span className="badge">{categoryLabels[config.category]}</span>
                                    {config.isRequired && (
                                        <span className="badge" style={{ marginLeft: 'var(--spacing-xs)', backgroundColor: 'var(--error-light)' }}>
                                            {language === 'fr' ? 'Requis' : 'Required'}
                                        </span>
                                    )}
                                    {config.requiresVerification && (
                                        <span className="badge" style={{ marginLeft: 'var(--spacing-xs)', backgroundColor: 'var(--warning-light)' }}>
                                            {language === 'fr' ? 'Vérification requise' : 'Verification required'}
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var--(--text-secondary)' }}>
                                    {text.allowedFormats}: {config.allowedFormats.join(', ')}
                                    <br />
                                    {text.maxSize}: {config.maxFileSizeMB} MB
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="card" style={{ padding: 'var(--spacing-lg)', maxWidth: '800px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: 'var(--spacing-lg)'
                    }}>
                        <div>
                            <h3>{selectedConfig && uploadDocumentNames[selectedConfig.type][language]}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {selectedConfig && uploadDocumentDescriptions[selectedConfig.type][language]}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedType(null);
                                setSelectedFile(null);
                                setMetadata({});
                                setLinkedMemberId('');
                                setError(null);
                                setSuccess(null);
                            }}
                            className="btn btn-sm btn-outline"
                        >
                            {text.cancel}
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-md)' }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success" style={{ marginBottom: 'var(--spacing-md)' }}>
                            {success}
                        </div>
                    )}

                    {/* File upload area */}
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <label className="label">{text.chooseFile} *</label>
                        <div
                            style={{
                                border: '2px dashed var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--spacing-xl)',
                                textAlign: 'center',
                                backgroundColor: 'var(--bg-secondary)',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s'
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                            }}
                            onDragLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                            onDrop={(e) => {
                                handleFileDrop(e);
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                            onClick={() => document.getElementById('fileInput')?.click()}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                accept={selectedConfig?.allowedFormats.map(f => `.${f}`).join(',')}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileSelect(file);
                                }}
                                style={{ display: 'none' }}
                            />
                            {selectedFile ? (
                                <div>
                                    <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>📄</div>
                                    <div style={{ fontWeight: 'bold' }}>{selectedFile.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {(selectedFile.size / 1024).toFixed(1)} KB
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>📤</div>
                                    <div>{text.dragDrop}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
                                        {text.allowedFormats}: {selectedConfig?.allowedFormats.join(', ')}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Link to member */}
                    {selectedConfig?.linkedEntities.includes(LinkedEntityType.MEMBER) && (
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <label className="label">{text.linkToMember}</label>
                            <select
                                className="input"
                                value={linkedMemberId}
                                onChange={(e) => setLinkedMemberId(e.target.value)}
                            >
                                <option value="">{text.noMember}</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Metadata fields */}
                    {selectedConfig && selectedConfig.validationRules.length > 0 && (
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <h4 style={{ marginBottom: 'var(--spacing-md)' }}>{text.metadata}</h4>
                            {selectedConfig.validationRules.map(rule => (
                                <div key={rule.field} style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <label className="label">
                                        {rule.field} {rule.rule === 'REQUIRED' && '*'}
                                    </label>
                                    {renderMetadataField(rule)}
                                    {rule.errorMessage && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
                                            {rule.errorMessage}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        className="btn btn-primary"
                        disabled={!selectedFile || isUploading}
                        style={{ width: '100%' }}
                    >
                        {isUploading ? text.uploading : text.upload}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
