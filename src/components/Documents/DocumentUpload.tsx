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
        <div className="fade-in">
            <div style={{ padding: 'var(--spacing-lg)', borderBottom: '4px solid #000000', marginBottom: 'var(--spacing-xl)' }}>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                    {text.title}
                </h2>
            </div>

            {!selectedType ? (
                <>
                    {/* Category filter */}
                    <div className="card mb-lg" style={{ padding: 'var(--spacing-lg)' }}>
                        <div style={{ maxWidth: '400px' }}>
                            <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                {text.category}
                            </label>
                            <select
                                className="form-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory | 'ALL')}
                            >
                                {Object.entries(categoryLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Document type selection grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 'var(--spacing-md)'
                    }}>
                        {filteredConfigs.map(config => (
                            <div
                                key={config.id}
                                className="card"
                                style={{
                                    padding: 0,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    borderLeft: `4px solid ${config.isRequired ? 'var(--color-primary)' : '#000'}`
                                }}
                                onClick={() => setSelectedType(config.type)}
                            >
                                <div style={{ padding: 'var(--spacing-lg)' }}>
                                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                                        {categoryLabels[config.category]}
                                    </div>
                                    <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 900, textTransform: 'uppercase', marginBottom: 'var(--spacing-sm)', color: '#000' }}>
                                        {uploadDocumentNames[config.type][language]}
                                    </h4>
                                    <p style={{
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--color-text-secondary)',
                                        marginBottom: 'var(--spacing-md)',
                                        lineHeight: 1.4
                                    }}>
                                        {uploadDocumentDescriptions[config.type][language]}
                                    </p>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
                                        {config.isRequired && (
                                            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', color: 'white', background: 'var(--color-primary)', padding: '2px 8px' }}>
                                                {language === 'fr' ? 'REQUIS' : 'REQUIRED'}
                                            </span>
                                        )}
                                        {config.requiresVerification && (
                                            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', color: '#92400e', background: '#fef3c7', padding: '2px 8px' }}>
                                                {language === 'fr' ? 'VÉRIFICATION REQUISE' : 'VERIFICATION REQUIRED'}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: '#666', fontWeight: 700 }}>
                                        {text.allowedFormats.toUpperCase()}: {config.allowedFormats.join(', ')}
                                        <br />
                                        {text.maxSize.toUpperCase()}: {config.maxFileSizeMB} MB
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="card fade-in" style={{ padding: 0, borderTop: '4px solid #000' }}>
                    <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                                {selectedConfig && uploadDocumentNames[selectedConfig.type][language]}
                            </h3>
                            <p style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', marginTop: 'var(--spacing-xs)', letterSpacing: '0.05em' }}>
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
                            className="btn btn-primary btn_outline"
                            style={{ height: '36px', fontSize: 'var(--font-size-xs)' }}
                        >
                            {text.cancel.toUpperCase()}
                        </button>
                    </div>

                    <div style={{ padding: 'var(--spacing-lg)' }}>
                        {error && (
                            <div style={{ padding: 'var(--spacing-sm)', background: 'var(--color-primary)', color: 'white', fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--spacing-md)' }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{ padding: 'var(--spacing-sm)', background: 'var(--color-success)', color: 'white', fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--spacing-md)' }}>
                                {success}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                            {/* File upload area */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #eee', paddingBottom: 'var(--spacing-xs)' }}>
                                    {language === 'fr' ? 'FICHIER' : 'FILE'}
                                </h4>
                                <div
                                    style={{
                                        border: '4px dashed #000',
                                        padding: 'var(--spacing-xl)',
                                        textAlign: 'center',
                                        backgroundColor: '#f8f8f8',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        minHeight: '200px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.style.backgroundColor = '#f0f0f0';
                                    }}
                                    onDragLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f8f8f8';
                                    }}
                                    onDrop={(e) => {
                                        handleFileDrop(e);
                                        e.currentTarget.style.backgroundColor = '#f8f8f8';
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
                                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>📄</div>
                                            <div style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--font-size-md)' }}>{selectedFile.name}</div>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 800, marginTop: '4px' }}>
                                                {(selectedFile.size / 1024).toFixed(1)} KB
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>📤</div>
                                            <div style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: 'var(--font-size-sm)' }}>{text.dragDrop}</div>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: '#666', marginTop: 'var(--spacing-sm)', fontWeight: 700 }}>
                                                {text.allowedFormats.toUpperCase()}: {selectedConfig?.allowedFormats.join(', ')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #eee', paddingBottom: 'var(--spacing-xs)' }}>
                                    {text.metadata}
                                </h4>

                                {/* Link to member */}
                                {selectedConfig?.linkedEntities.includes(LinkedEntityType.MEMBER) && (
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                            {text.linkToMember}
                                        </label>
                                        <select
                                            className="form-select"
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
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                        {selectedConfig.validationRules.map(rule => (
                                            <div key={rule.field} className="form-group">
                                                <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                                    {rule.field} {rule.rule === 'REQUIRED' && '*'}
                                                </label>
                                                {renderMetadataField(rule)}
                                                {rule.errorMessage && (
                                                    <div style={{ fontSize: 'var(--font-size-xs)', color: '#999', marginTop: '4px', fontWeight: 600 }}>
                                                        {rule.errorMessage}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleUpload}
                            className="btn btn-primary"
                            disabled={!selectedFile || isUploading}
                            style={{ width: '100%', marginTop: 'var(--spacing-xl)', height: '48px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            {isUploading ? text.uploading.toUpperCase() : text.upload.toUpperCase()}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
