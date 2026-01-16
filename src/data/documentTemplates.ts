import {
    DocumentTemplate,
    GeneratedDocumentType,
    DocumentCategory,
    TriggerEvent,
    OutputFormat,
    UploadDocumentConfig,
    UploadedDocumentType,
    DocumentScope,
    LinkedEntityType
} from '../types/documents';

// ===========================
// PART 1: DOCUMENT TEMPLATES
// ===========================

export const documentTemplates: DocumentTemplate[] = [
    {
        id: 'TPL-001',
        type: GeneratedDocumentType.MEMBERSHIP_CERTIFICATE,
        name: 'Certificat de Membre',
        description: 'Certifie qu\'un individu est membre de l\'association',
        category: DocumentCategory.MEMBERSHIP,
        requiredFields: [
            'memberId',
            'memberName',
            'dateOfBirth',
            'nationalIdNumber',
            'admissionDate',
            'membershipNumber'
        ],
        optionalFields: ['address', 'phone', 'email', 'photo'],
        triggerEvents: [TriggerEvent.MEMBER_REGISTRATION],
        autoGenerate: true,
        requiresApproval: true,
        validityPeriod: null,
        sequencePrefix: 'MC',
        outputFormats: [OutputFormat.PDF]
    },
    {
        id: 'TPL-002',
        type: GeneratedDocumentType.SHARE_CERTIFICATE,
        name: 'Certificat d\'Actions',
        description: 'Certifie la propriété des actions dans l\'association foncière',
        category: DocumentCategory.SHARES,
        requiredFields: [
            'memberId',
            'memberName',
            'certificateNumber',
            'numberOfShares',
            'shareValue',
            'totalArea',
            'issueDate',
            'landParcelReference'
        ],
        optionalFields: ['plotNumbers', 'previousCertificateNumber'],
        triggerEvents: [TriggerEvent.SHARE_PURCHASE, TriggerEvent.SHARE_TRANSFER],
        autoGenerate: true,
        requiresApproval: true,
        validityPeriod: null,
        sequencePrefix: 'SC',
        outputFormats: [OutputFormat.PDF]
    },
    {
        id: 'TPL-003',
        type: GeneratedDocumentType.SHARE_TRANSFER_CERTIFICATE,
        name: 'Certificat de Transfert d\'Actions',
        description: 'Documente le transfert d\'actions entre parties',
        category: DocumentCategory.SHARES,
        requiredFields: [
            'transferorId',
            'transferorName',
            'transfereeId',
            'transfereeName',
            'numberOfShares',
            'transferDate',
            'transferType',
            'consideration'
        ],
        optionalFields: ['witnessName', 'witnessId', 'remarks'],
        triggerEvents: [TriggerEvent.SHARE_TRANSFER],
        autoGenerate: true,
        requiresApproval: true,
        validityPeriod: null,
        sequencePrefix: 'STC',
        outputFormats: [OutputFormat.PDF]
    },
    {
        id: 'TPL-004',
        type: GeneratedDocumentType.LAND_ALLOCATION_CERTIFICATE,
        name: 'Certificat d\'Attribution de Terrain',
        description: 'Attribue des parcelles de terrain spécifiques à un actionnaire',
        category: DocumentCategory.LAND,
        requiredFields: [
            'memberId',
            'memberName',
            'plotNumbers',
            'totalArea',
            'numberOfShares',
            'allocationDate',
            'coordinates'
        ],
        optionalFields: ['boundaryDescription', 'adjacentPlots'],
        triggerEvents: [TriggerEvent.PLOT_ALLOCATION],
        autoGenerate: false,
        requiresApproval: true,
        validityPeriod: null,
        sequencePrefix: 'LAC',
        outputFormats: [OutputFormat.PDF]
    },
    {
        id: 'TPL-005',
        type: GeneratedDocumentType.PLOT_ATTRIBUTION_LETTER,
        name: 'Lettre d\'Attribution de Parcelle',
        description: 'Notification formelle de l\'attribution de parcelle au membre',
        category: DocumentCategory.LAND,
        requiredFields: [
            'memberId',
            'memberName',
            'memberAddress',
            'plotNumbers',
            'area',
            'attributionDate'
        ],
        optionalFields: ['conditions', 'restrictions'],
        triggerEvents: [TriggerEvent.PLOT_ALLOCATION],
        autoGenerate: true,
        requiresApproval: false,
        validityPeriod: null,
        sequencePrefix: 'PAL',
        outputFormats: [OutputFormat.PDF, OutputFormat.DOCX]
    },
    {
        id: 'TPL-006',
        type: GeneratedDocumentType.PAYMENT_RECEIPT,
        name: 'Reçu de Paiement',
        description: 'Accuse réception du paiement reçu du membre',
        category: DocumentCategory.FINANCIAL,
        requiredFields: [
            'memberId',
            'memberName',
            'receiptNumber',
            'amount',
            'paymentDate',
            'paymentMethod',
            'purpose'
        ],
        optionalFields: ['transactionReference', 'bankName', 'remarks'],
        triggerEvents: [TriggerEvent.PAYMENT_RECEIVED],
        autoGenerate: true,
        requiresApproval: false,
        validityPeriod: null,
        sequencePrefix: 'RCP',
        outputFormats: [OutputFormat.PDF]
    },
    {
        id: 'TPL-007',
        type: GeneratedDocumentType.STATEMENT_OF_ACCOUNT,
        name: 'Relevé de Compte',
        description: 'Résumé des transactions financières du membre',
        category: DocumentCategory.FINANCIAL,
        requiredFields: [
            'memberId',
            'memberName',
            'statementPeriod',
            'openingBalance',
            'transactions',
            'closingBalance',
            'totalSharesOwned'
        ],
        optionalFields: ['pendingPayments', 'nextDueDate'],
        triggerEvents: [TriggerEvent.MANUAL_REQUEST, TriggerEvent.PERIODIC_SCHEDULE],
        autoGenerate: false,
        requiresApproval: false,
        validityPeriod: 30,
        sequencePrefix: 'SOA',
        outputFormats: [OutputFormat.PDF]
    },
    {
        id: 'TPL-008',
        type: GeneratedDocumentType.SHARE_VALUATION_CERTIFICATE,
        name: 'Certificat de Valorisation d\'Actions',
        description: 'Valorisation actuelle des actions du membre',
        category: DocumentCategory.FINANCIAL,
        requiredFields: [
            'memberId',
            'memberName',
            'numberOfShares',
            'valuationDate',
            'pricePerShare',
            'totalValue',
            'valuationBasis'
        ],
        optionalFields: ['marketComparables', 'appreciationRate'],
        triggerEvents: [TriggerEvent.MANUAL_REQUEST],
        autoGenerate: false,
        requiresApproval: true,
        validityPeriod: 90,
        sequencePrefix: 'SVC',
        outputFormats: [OutputFormat.PDF]
    },
    {
        id: 'TPL-009',
        type: GeneratedDocumentType.WITHDRAWAL_CERTIFICATE,
        name: 'Certificat de Retrait',
        description: 'Confirme la sortie du membre et le règlement',
        category: DocumentCategory.SUCCESSION,
        requiredFields: [
            'memberId',
            'memberName',
            'withdrawalDate',
            'sharesHeld',
            'settlementAmount',
            'settlementMethod',
            'reasonForWithdrawal'
        ],
        optionalFields: ['outstandingObligations', 'clearanceStatus'],
        triggerEvents: [TriggerEvent.MEMBER_WITHDRAWAL],
        autoGenerate: true,
        requiresApproval: true,
        validityPeriod: null,
        sequencePrefix: 'WDC',
        outputFormats: [OutputFormat.PDF]
    },
    {
        id: 'TPL-010',
        type: GeneratedDocumentType.INHERITANCE_TRANSFER_CERTIFICATE,
        name: 'Certificat de Transfert Héréditaire',
        description: 'Documente le transfert d\'actions aux héritiers',
        category: DocumentCategory.SUCCESSION,
        requiredFields: [
            'deceasedMemberId',
            'deceasedMemberName',
            'dateOfDeath',
            'totalSharesTransferred',
            'heirs',
            'transferDate'
        ],
        optionalFields: ['courtOrderReference', 'notaryActReference'],
        triggerEvents: [TriggerEvent.INHERITANCE_CLAIM],
        autoGenerate: false,
        requiresApproval: true,
        validityPeriod: null,
        sequencePrefix: 'ITC',
        outputFormats: [OutputFormat.PDF]
    },
    {
        id: 'TPL-011',
        type: GeneratedDocumentType.MEETING_MINUTES,
        name: 'Procès-Verbal de Réunion',
        description: 'Compte rendu des réunions de l\'assemblée générale ou du conseil',
        category: DocumentCategory.GOVERNANCE,
        requiredFields: [
            'meetingType',
            'meetingDate',
            'venue',
            'attendees',
            'quorumStatus',
            'agenda',
            'resolutions',
            'chairperson',
            'secretary'
        ],
        optionalFields: ['attachments', 'nextMeetingDate', 'actionItems'],
        triggerEvents: [TriggerEvent.MEETING_CONCLUDED],
        autoGenerate: false,
        requiresApproval: true,
        validityPeriod: null,
        sequencePrefix: 'MIN',
        outputFormats: [OutputFormat.PDF, OutputFormat.DOCX]
    },
    {
        id: 'TPL-012',
        type: GeneratedDocumentType.POWER_OF_ATTORNEY,
        name: 'Procuration',
        description: 'Autorisation pour action représentative',
        category: DocumentCategory.GOVERNANCE,
        requiredFields: [
            'principalId',
            'principalName',
            'agentName',
            'agentId',
            'scope',
            'effectiveDate',
            'expiryDate'
        ],
        optionalFields: ['limitations', 'revocationConditions'],
        triggerEvents: [TriggerEvent.MANUAL_REQUEST],
        autoGenerate: false,
        requiresApproval: false,
        validityPeriod: 365,
        sequencePrefix: 'POA',
        outputFormats: [OutputFormat.PDF, OutputFormat.DOCX]
    },
    {
        id: 'TPL-013',
        type: GeneratedDocumentType.ANNUAL_FINANCIAL_REPORT,
        name: 'Rapport Financier Annuel',
        description: 'Résumé financier annuel de l\'association',
        category: DocumentCategory.FINANCIAL,
        requiredFields: [
            'fiscalYear',
            'totalRevenue',
            'totalExpenses',
            'netPosition',
            'landAssets',
            'memberEquity',
            'auditorName'
        ],
        optionalFields: ['comparativeData', 'projections', 'notes'],
        triggerEvents: [TriggerEvent.PERIODIC_SCHEDULE],
        autoGenerate: false,
        requiresApproval: true,
        validityPeriod: null,
        sequencePrefix: 'AFR',
        outputFormats: [OutputFormat.PDF]
    },
    {
        id: 'TPL-014',
        type: GeneratedDocumentType.SHARE_REGISTER_EXTRACT,
        name: 'Extrait du Registre des Actions',
        description: 'Extrait officiel du registre des actions',
        category: DocumentCategory.SHARES,
        requiredFields: [
            'memberId',
            'memberName',
            'extractDate',
            'sharesOwned',
            'transactionHistory',
            'currentStatus'
        ],
        optionalFields: ['encumbrances', 'pendingTransfers'],
        triggerEvents: [TriggerEvent.MANUAL_REQUEST],
        autoGenerate: false,
        requiresApproval: false,
        validityPeriod: 30,
        sequencePrefix: 'SRE',
        outputFormats: [OutputFormat.PDF]
    }
];

// =============================
// PART 2: UPLOAD CONFIGURATIONS
// =============================

export const uploadDocumentConfigs: UploadDocumentConfig[] = [
    // === FOUNDING DOCUMENTS ===
    {
        id: 'UPL-001',
        type: UploadedDocumentType.CERTIFICATE_OF_REGISTRATION,
        name: 'Certificat d\'Enregistrement',
        description: 'Certificat officiel d\'enregistrement du registre gouvernemental',
        category: DocumentCategory.GOVERNANCE,
        scope: DocumentScope.ASSOCIATION,
        allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
        maxFileSizeMB: 10,
        isRequired: true,
        requiresVerification: true,
        expiryTracking: false,
        linkedEntities: [],
        validationRules: [
            {
                field: 'registrationNumber',
                rule: 'REQUIRED',
                errorMessage: 'Le numéro d\'enregistrement est requis'
            },
            {
                field: 'issueDate',
                rule: 'REQUIRED',
                errorMessage: 'La date d\'émission est requise'
            }
        ]
    },
    {
        id: 'UPL-002',
        type: UploadedDocumentType.CONSTITUTION_BYLAWS,
        name: 'Constitution / Règlements',
        description: 'Document fondateur de l\'association avec règles et structure de gouvernance',
        category: DocumentCategory.GOVERNANCE,
        scope: DocumentScope.ASSOCIATION,
        allowedFormats: ['pdf', 'docx'],
        maxFileSizeMB: 20,
        isRequired: true,
        requiresVerification: true,
        expiryTracking: false,
        linkedEntities: [],
        validationRules: [
            {
                field: 'adoptionDate',
                rule: 'REQUIRED',
                errorMessage: 'La date d\'adoption est requise'
            }
        ]
    },

    // === LAND DOCUMENTS ===
    {
        id: 'UPL-003',
        type: UploadedDocumentType.GLOBAL_LAND_TITLE,
        name: 'Titre Foncier Global',
        description: 'Titre de propriété principal du terrain de l\'association',
        category: DocumentCategory.LAND,
        scope: DocumentScope.LAND_PARCEL,
        allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
        maxFileSizeMB: 15,
        isRequired: true,
        requiresVerification: true,
        expiryTracking: false,
        linkedEntities: [LinkedEntityType.LAND_PARCEL],
        validationRules: [
            {
                field: 'titleNumber',
                rule: 'REQUIRED',
                errorMessage: 'Le numéro de titre est requis'
            },
            {
                field: 'totalArea',
                rule: 'REQUIRED',
                errorMessage: 'La superficie totale est requise'
            },
            {
                field: 'location',
                rule: 'REQUIRED',
                errorMessage: 'Les détails de localisation sont requis'
            }
        ]
    },
    {
        id: 'UPL-004',
        type: UploadedDocumentType.SURVEY_DEMARCATION_PLAN,
        name: 'Plan de Bornage / Démarcation',
        description: 'Plan technique montrant la subdivision du terrain',
        category: DocumentCategory.LAND,
        scope: DocumentScope.LAND_PARCEL,
        allowedFormats: ['pdf', 'dwg', 'dxf', 'jpg', 'jpeg', 'png'],
        maxFileSizeMB: 50,
        isRequired: true,
        requiresVerification: true,
        expiryTracking: false,
        linkedEntities: [LinkedEntityType.LAND_PARCEL],
        validationRules: [
            {
                field: 'surveyorName',
                rule: 'REQUIRED',
                errorMessage: 'Le nom du géomètre est requis'
            },
            {
                field: 'surveyDate',
                rule: 'REQUIRED',
                errorMessage: 'La date du levé est requise'
            },
            {
                field: 'surveyorLicense',
                rule: 'REQUIRED',
                errorMessage: 'Le numéro de licence du géomètre est requis'
            }
        ]
    },

    // === MEMBER IDENTITY DOCUMENTS ===
    {
        id: 'UPL-008',
        type: UploadedDocumentType.NATIONAL_ID,
        name: 'Carte d\'Identité Nationale',
        description: 'Carte d\'identité nationale du membre',
        category: DocumentCategory.MEMBERSHIP,
        scope: DocumentScope.MEMBER,
        allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
        maxFileSizeMB: 5,
        isRequired: true,
        requiresVerification: true,
        expiryTracking: true,
        linkedEntities: [LinkedEntityType.MEMBER],
        validationRules: [
            {
                field: 'idNumber',
                rule: 'REQUIRED',
                errorMessage: 'Le numéro d\'identité est requis'
            },
            {
                field: 'expiryDate',
                rule: 'DATE_RANGE',
                params: { minDate: 'today' },
                errorMessage: 'La carte d\'identité ne doit pas être expirée'
            }
        ]
    },
    {
        id: 'UPL-009',
        type: UploadedDocumentType.PASSPORT,
        name: 'Passeport',
        description: 'Passeport du membre (alternative à la carte d\'identité)',
        category: DocumentCategory.MEMBERSHIP,
        scope: DocumentScope.MEMBER,
        allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
        maxFileSizeMB: 5,
        isRequired: false,
        requiresVerification: true,
        expiryTracking: true,
        linkedEntities: [LinkedEntityType.MEMBER],
        validationRules: [
            {
                field: 'passportNumber',
                rule: 'REQUIRED',
                errorMessage: 'Le numéro de passeport est requis'
            },
            {
                field: 'expiryDate',
                rule: 'DATE_RANGE',
                params: { minDate: 'today' },
                errorMessage: 'Le passeport ne doit pas être expiré'
            }
        ]
    },
    {
        id: 'UPL-012',
        type: UploadedDocumentType.DEATH_CERTIFICATE,
        name: 'Certificat de Décès',
        description: 'Certificat de décès pour traitement de la succession',
        category: DocumentCategory.SUCCESSION,
        scope: DocumentScope.MEMBER,
        allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
        maxFileSizeMB: 5,
        isRequired: false,
        requiresVerification: true,
        expiryTracking: false,
        linkedEntities: [LinkedEntityType.MEMBER, LinkedEntityType.INHERITANCE_CASE],
        validationRules: [
            {
                field: 'dateOfDeath',
                rule: 'REQUIRED',
                errorMessage: 'La date du décès est requise'
            },
            {
                field: 'certificateNumber',
                rule: 'REQUIRED',
                errorMessage: 'Le numéro de certificat est requis'
            }
        ]
    },

    // === FINANCIAL DOCUMENTS ===
    {
        id: 'UPL-014',
        type: UploadedDocumentType.PROOF_OF_PAYMENT,
        name: 'Preuve de Paiement',
        description: 'Preuve de paiement externe (virement bancaire, chèque)',
        category: DocumentCategory.FINANCIAL,
        scope: DocumentScope.TRANSACTION,
        allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
        maxFileSizeMB: 5,
        isRequired: false,
        requiresVerification: true,
        expiryTracking: false,
        linkedEntities: [LinkedEntityType.MEMBER, LinkedEntityType.PAYMENT],
        validationRules: [
            {
                field: 'paymentAmount',
                rule: 'REQUIRED',
                errorMessage: 'Le montant du paiement est requis'
            },
            {
                field: 'paymentDate',
                rule: 'REQUIRED',
                errorMessage: 'La date du paiement est requise'
            }
        ]
    },

    // === OTHER DOCUMENTS ===
    {
        id: 'UPL-019',
        type: UploadedDocumentType.PHOTOGRAPH,
        name: 'Photographie',
        description: 'Photo d\'identité du membre',
        category: DocumentCategory.MEMBERSHIP,
        scope: DocumentScope.MEMBER,
        allowedFormats: ['jpg', 'jpeg', 'png'],
        maxFileSizeMB: 2,
        isRequired: true,
        requiresVerification: false,
        expiryTracking: false,
        linkedEntities: [LinkedEntityType.MEMBER],
        validationRules: []
    },
    {
        id: 'UPL-020',
        type: UploadedDocumentType.SUPPORTING_DOCUMENT,
        name: 'Document Justificatif',
        description: 'Tout document justificatif supplémentaire',
        category: DocumentCategory.GOVERNANCE,
        scope: DocumentScope.TRANSACTION,
        allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'docx'],
        maxFileSizeMB: 20,
        isRequired: false,
        requiresVerification: false,
        expiryTracking: false,
        linkedEntities: [
            LinkedEntityType.MEMBER,
            LinkedEntityType.LAND_PARCEL,
            LinkedEntityType.SHARE_TRANSACTION,
            LinkedEntityType.PAYMENT,
            LinkedEntityType.MEETING,
            LinkedEntityType.INHERITANCE_CASE
        ],
        validationRules: []
    }
];

// ============================
// PART 3: HELPER FUNCTIONS
// ============================

/**
 * Get template by type
 */
export function getTemplateByType(type: GeneratedDocumentType): DocumentTemplate | undefined {
    return documentTemplates.find(t => t.type === type);
}

/**
 * Get upload config by type
 */
export function getUploadConfigByType(type: UploadedDocumentType): UploadDocumentConfig | undefined {
    return uploadDocumentConfigs.find(c => c.type === type);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: DocumentCategory): DocumentTemplate[] {
    return documentTemplates.filter(t => t.category === category);
}

/**
 * Get upload configs by category
 */
export function getUploadConfigsByCategory(category: DocumentCategory): UploadDocumentConfig[] {
    return uploadDocumentConfigs.filter(c => c.category === category);
}

/**
 * Get templates that auto-generate on trigger event
 */
export function getTemplatesByTrigger(event: TriggerEvent): DocumentTemplate[] {
    return documentTemplates.filter(
        t => t.triggerEvents.includes(event) && t.autoGenerate
    );
}

/**
 * Get required upload configs for scope
 */
export function getRequiredUploadConfigs(scope: DocumentScope): UploadDocumentConfig[] {
    return uploadDocumentConfigs.filter(
        c => c.scope === scope && c.isRequired
    );
}
