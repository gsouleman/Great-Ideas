import React, { useState } from 'react';
import { documentTemplates } from '../../data/documentTemplates';
import { documentTemplateNames, documentTemplateDescriptions } from '../../data/documentTranslations';
import { generateDocument, generateCertificateNumber } from '../../utils/documentStorage';
import { GeneratedDocumentType, OutputFormat, DocumentGenerationRequest, DocumentCategory } from '../../types/documents';
import { loadMembers } from '../../utils/assetStorage';
import {
    meetingTypes,
    venueTypes,
    agendaItems,
    resolutionTypes,
    actionItems as actionItemTypes,
    quorumStatusTypes
} from '../../data/meetingMinutesData';

interface DocumentGenerationProps {
    language: 'fr' | 'en';
    currentUserId: string;
}

const AttendeesField = ({ members, value, onChange }: { members: any[], value: string, onChange: (val: string) => void }) => {
    const [guestName, setGuestName] = useState('');

    // Parse current value into array
    const selectedNames = value ? value.split(', ').filter(Boolean) : [];

    const handleToggleMember = (member: any) => {
        const memberString = `${member.name} (${member.memberId})`;
        let newNames;
        if (selectedNames.includes(memberString)) {
            newNames = selectedNames.filter(n => n !== memberString);
        } else {
            newNames = [...selectedNames, memberString];
        }
        onChange(newNames.join(', '));
    };

    const handleAddGuest = () => {
        if (!guestName.trim()) return;
        const newGuest = `${guestName.trim()} (Guest)`;
        if (!selectedNames.includes(newGuest)) {
            onChange([...selectedNames, newGuest].join(', '));
        }
        setGuestName('');
    };

    const handleRemoveName = (nameToRemove: string) => {
        onChange(selectedNames.filter((n: string) => n !== nameToRemove).join(', '));
    };

    return (
        <div className="card" style={{ padding: '1rem', border: '1px solid var(--color-border)', marginTop: '0.5rem' }}>
            <label className="label" style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>Select Attendees</label>
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem', border: '1px solid var(--color-border)', padding: '0.5rem', borderRadius: '4px' }}>
                {members.map(member => {
                    const memberString = `${member.name} (${member.memberId})`;
                    const isChecked = selectedNames.includes(memberString);
                    return (
                        <div key={member.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleMember(member)}
                                style={{ marginRight: '0.5rem' }}
                            />
                            <span>{member.name} <small style={{ color: 'var(--color-text-muted)' }}>({member.memberId})</small></span>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                    type="text"
                    className="input"
                    placeholder="Guest Name (e.g. John Doe)"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGuest())}
                    style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-primary btn-sm" onClick={handleAddGuest}>Add Guest</button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedNames.map((name: string, idx: number) => (
                    <span key={idx} className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.5rem' }}>
                        {name}
                        <span
                            style={{ cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={() => handleRemoveName(name)}
                        >×</span>
                    </span>
                ))}
            </div>
            {selectedNames.length === 0 && <p className="text-muted" style={{ fontSize: '0.8rem' }}>No attendees selected</p>}
        </div>
    );
};

const DocumentGeneration: React.FC<DocumentGenerationProps> = ({ language, currentUserId }) => {
    const [selectedType, setSelectedType] = useState<GeneratedDocumentType | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'ALL'>('ALL');

    const members = loadMembers();

    const t = {
        fr: {
            title: 'Générer un Document',
            selectTemplate: 'Sélectionner un élément',
            category: 'Catégorie',
            all: 'Toutes',
            membership: 'Adhésion',
            shares: 'Actions',
            land: 'Terrain',
            financial: 'Financier',
            governance: 'Gouvernance',
            succession: 'Succession',
            generate: 'Générer le Document',
            cancel: 'Annuler',
            requiredFields: 'Champs requis',
            optionalFields: 'Champs optionnels',
            selectMember: 'Sélectionner un membre',
            noMember: 'Aucun membre',
            generating: 'Génération en cours...',
            successMessage: 'Document généré avec succès!'
        },
        en: {
            title: 'Generate Document',
            selectTemplate: 'Select an Item',
            category: 'Category',
            all: 'All',
            membership: 'Membership',
            shares: 'Shares',
            land: 'Land',
            financial: 'Financial',
            governance: 'Governance',
            succession: 'Succession',
            generate: 'Generate Document',
            cancel: 'Cancel',
            requiredFields: 'Required fields',
            optionalFields: 'Optional fields',
            selectMember: 'Select a member',
            noMember: 'No member',
            generating: 'Generating...',
            successMessage: 'Document successfully generated!'
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

    const filteredTemplates = selectedCategory === 'ALL'
        ? documentTemplates
        : documentTemplates.filter(t => t.category === selectedCategory);

    const selectedTemplate = selectedType
        ? documentTemplates.find(t => t.type === selectedType)
        : null;

    const handleMemberChange = (memberId: string) => {
        const member = members.find(m => m.id === memberId);
        if (member) {
            // Prepare updated form data with ALL member fields
            const updatedData: Record<string, any> = {
                ...formData,
                memberId: member.memberId || member.id,  // Use display ID (GIS-####-#####)
                membershipId: member.memberId || member.id,  // membershipId = same as memberId
                membershipNumber: member.memberId || member.id,  // membershipNumber = same as memberId
                memberName: member.name,

                // Date fields - auto-populate from member data
                dateOfBirth: member.dateOfBirth,
                dateJoined: member.dateJoined,
                admissionDate: member.dateJoined,  // admissionDate = dateJoined from member

                idExpirationDate: member.idExpirationDate,
                email: member.email,
                phone: member.phone,

                // Shares and land information
                numberOfShares: member.sharesOwned,
                sharesOwned: member.sharesOwned,
                shareValue: member.sharesOwned, // Can calculate if needed
                totalArea: member.landSizeM2,
                landSizeM2: member.landSizeM2,
                landSize: `${(member.landSizeM2 / 10000).toFixed(2)} ha`,

                // Position
                position: member.position
            };

            // Map ID fields based on identification type
            if (member.identificationType === 'NATIONAL_ID') {
                updatedData.nationalIdNumber = member.idNumber;
            } else if (member.identificationType === 'PASSPORT') {
                updatedData.passportNumber = member.idNumber;
            } else if (member.identificationType === 'DRIVER_LICENSE') {
                updatedData.driverLicenseNumber = member.idNumber;
            }

            // Also add generic ID field for templates that use it
            updatedData.idNumber = member.idNumber;
            updatedData.identificationType = member.identificationType;

            setFormData(updatedData);
        }
    };

    const handleGenerate = async () => {
        if (!selectedTemplate) return;

        setIsGenerating(true);
        setError(null);
        setSuccess(null);

        try {
            const request: DocumentGenerationRequest = {
                templateType: selectedTemplate.type,
                requestedBy: currentUserId,
                memberId: formData.memberId,
                parameters: formData,
                outputFormat: OutputFormat.PDF,
                copies: 1,
                urgent: false
            };

            await generateDocument(request);
            setSuccess(text.successMessage);
            setSelectedType(null);
            setFormData({});
        } catch (error: any) {
            setError(error.message || 'Erreur lors de la génération');
        } finally {
            setIsGenerating(false);
        }
    };


    // Helper to render a dropdown field
    const DropdownField = ({ value, options, onChange, required }: { value: string, options: string[], onChange: (val: string) => void, required?: boolean }) => (
        <select
            className="input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
        >
            <option value="">{text.selectTemplate || 'Select...'}</option>
            {options.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
            ))}
        </select>
    );

    const renderFieldInput = (fieldName: string, isRequired: boolean) => {
        const value = formData[fieldName] || '';

        // Meeting Minutes Dropdowns
        if (selectedTemplate?.type === GeneratedDocumentType.MEETING_MINUTES) {
            if (fieldName === 'meetingType') {
                return (
                    <DropdownField
                        value={value}
                        options={meetingTypes}
                        onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
                        required={isRequired}
                    />
                );
            }
            if (fieldName === 'quorumStatus') {
                return (
                    <DropdownField
                        value={value}
                        options={quorumStatusTypes}
                        onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
                        required={isRequired}
                    />
                );
            }
            if (fieldName === 'venue') {
                return (
                    <DropdownField
                        value={value}
                        options={venueTypes}
                        onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
                        required={isRequired}
                    />
                );
            }
            if (fieldName === 'agenda') {
                return (
                    <DropdownField
                        value={value}
                        options={agendaItems}
                        onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
                        required={isRequired}
                    />
                );
            }
            if (fieldName === 'resolutions') {
                return (
                    <DropdownField
                        value={value}
                        options={resolutionTypes}
                        onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
                        required={isRequired}
                    />
                );
            }
            if (fieldName === 'actionItems') {
                return (
                    <DropdownField
                        value={value}
                        options={actionItemTypes}
                        onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
                        required={isRequired}
                    />
                );
            }
            if (fieldName === 'attachments') {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label
                            className="btn btn-outline"
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>📁</span>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                multiple
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const fileNames = Array.from(e.target.files).map(f => f.name).join(', ');
                                        setFormData({ ...formData, [fieldName]: fileNames });
                                    }
                                }}
                            />
                        </label>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            {value || (language === 'fr' ? 'Aucun fichier sélectionné (Parcourir...)' : 'No file selected (Browse...)')}
                        </span>
                    </div>
                );
            }
            if (fieldName === 'attendees') {
                return (
                    <AttendeesField
                        members={members}
                        value={value}
                        onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
                    />
                );
            }
            if (fieldName === 'chairperson' || fieldName === 'secretary') {
                return (
                    <select
                        className="input"
                        value={value}
                        onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                        required={isRequired}
                    >
                        <option value="">{text.selectMember}</option>
                        {members.map(member => (
                            <option key={member.id} value={`${member.name} (${member.memberId})`}>
                                {member.name} - {member.memberId}
                            </option>
                        ))}
                    </select>
                );
            }
        }

        // Special handling for certain fields
        if (fieldName === 'memberId' || fieldName.includes('Member')) {
            return (
                <select
                    className="input"
                    value={value}
                    onChange={(e) => handleMemberChange(e.target.value)}
                    required={isRequired}
                >
                    <option value="">{text.selectMember}</option>
                    {members.map(member => (
                        <option key={member.id} value={member.id}>
                            {member.memberId} - {member.name}
                        </option>
                    ))}
                </select>
            );
        }

        if (fieldName.toLowerCase().includes('date')) {
            return (
                <input
                    type="date"
                    className="input"
                    value={value}
                    onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                    required={isRequired}
                />
            );
        }

        if (fieldName.toLowerCase().includes('amount') || fieldName.toLowerCase().includes('value') || fieldName.toLowerCase().includes('number') && !fieldName.includes('Number')) {
            return (
                <input
                    type="number"
                    className="input"
                    value={value}
                    onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                    required={isRequired}
                />
            );
        }

        return (
            <input
                type="text"
                className="input"
                value={value}
                onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                required={isRequired}
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

                    {/* Template selection grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 'var(--spacing-md)'
                    }}>
                        {filteredTemplates.map(template => (
                            <div
                                key={template.id}
                                className="card"
                                style={{
                                    padding: 0,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    borderLeft: `4px solid ${template.requiresApproval ? 'var(--color-warning)' : '#000'}`
                                }}
                                onClick={() => {
                                    setSelectedType(template.type);
                                    setFormData({ certificateNumber: generateCertificateNumber() });
                                }}
                            >
                                <div style={{ padding: 'var(--spacing-lg)' }}>
                                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                                        {categoryLabels[template.category]}
                                    </div>
                                    <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 900, textTransform: 'uppercase', marginBottom: 'var(--spacing-sm)', color: '#000' }}>
                                        {documentTemplateNames[template.type][language]}
                                    </h4>
                                    <p style={{
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--color-text-secondary)',
                                        marginBottom: 'var(--spacing-md)',
                                        lineHeight: 1.4
                                    }}>
                                        {documentTemplateDescriptions[template.type][language]}
                                    </p>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                        {template.requiresApproval && (
                                            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', color: '#92400e', background: '#fef3c7', padding: '2px 8px' }}>
                                                {language === 'fr' ? 'APPROBATION REQUISE' : 'APPROVAL REQUIRED'}
                                            </span>
                                        )}
                                        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', color: '#000', background: '#eee', padding: '2px 8px' }}>
                                            PDF
                                        </span>
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
                                {selectedTemplate && documentTemplateNames[selectedTemplate.type][language]}
                            </h3>
                            <p style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', marginTop: 'var(--spacing-xs)', letterSpacing: '0.05em' }}>
                                {selectedTemplate && documentTemplateDescriptions[selectedTemplate.type][language]}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedType(null);
                                setFormData({});
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
                            {/* Required fields */}
                            {selectedTemplate && selectedTemplate.requiredFields.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                    <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #eee', paddingBottom: 'var(--spacing-xs)' }}>
                                        {text.requiredFields}
                                    </h4>
                                    {selectedTemplate.requiredFields.map(field => (
                                        <div key={field} className="form-group">
                                            <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                                {field} *
                                            </label>
                                            {renderFieldInput(field, true)}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Optional fields */}
                            {selectedTemplate && selectedTemplate.optionalFields.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                    <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 900, textTransform: 'uppercase', color: '#666', borderBottom: '1px solid #eee', paddingBottom: 'var(--spacing-xs)' }}>
                                        {text.optionalFields}
                                    </h4>
                                    {selectedTemplate.optionalFields.map(field => (
                                        <div key={field} className="form-group">
                                            <label className="form-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>
                                                {field}
                                            </label>
                                            {renderFieldInput(field, false)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleGenerate}
                            className="btn btn-primary"
                            disabled={isGenerating}
                            style={{ width: '100%', marginTop: 'var(--spacing-xl)', height: '48px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            {isGenerating ? text.generating.toUpperCase() : text.generate.toUpperCase()}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentGeneration;
