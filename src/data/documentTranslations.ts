import { GeneratedDocumentType, UploadedDocumentType } from '../types/documents';

// ===============================================
// DOCUMENT TEMPLATE TRANSLATIONS
// ===============================================

export const documentTemplateNames: Record<GeneratedDocumentType, { fr: string; en: string }> = {
    [GeneratedDocumentType.MEMBERSHIP_CERTIFICATE]: {
        fr: 'Certificat de Membre',
        en: 'Membership Certificate'
    },
    [GeneratedDocumentType.SHARE_CERTIFICATE]: {
        fr: 'Certificat d\'Actions',
        en: 'Share Certificate'
    },
    [GeneratedDocumentType.SHARE_TRANSFER_CERTIFICATE]: {
        fr: 'Certificat de Transfert d\'Actions',
        en: 'Share Transfer Certificate'
    },
    [GeneratedDocumentType.LAND_ALLOCATION_CERTIFICATE]: {
        fr: 'Certificat d\'Attribution de Terrain',
        en: 'Land Allocation Certificate'
    },
    [GeneratedDocumentType.PLOT_ATTRIBUTION_LETTER]: {
        fr: 'Lettre d\'Attribution de Parcelle',
        en: 'Plot Attribution Letter'
    },
    [GeneratedDocumentType.PAYMENT_RECEIPT]: {
        fr: 'Reçu de Paiement',
        en: 'Payment Receipt'
    },
    [GeneratedDocumentType.STATEMENT_OF_ACCOUNT]: {
        fr: 'Relevé de Compte',
        en: 'Statement of Account'
    },
    [GeneratedDocumentType.SHARE_VALUATION_CERTIFICATE]: {
        fr: 'Certificat de Valorisation d\'Actions',
        en: 'Share Valuation Certificate'
    },
    [GeneratedDocumentType.WITHDRAWAL_CERTIFICATE]: {
        fr: 'Certificat de Retrait',
        en: 'Withdrawal Certificate'
    },
    [GeneratedDocumentType.INHERITANCE_TRANSFER_CERTIFICATE]: {
        fr: 'Certificat de Transfert Héréditaire',
        en: 'Inheritance Transfer Certificate'
    },
    [GeneratedDocumentType.MEETING_MINUTES]: {
        fr: 'Procès-Verbal de Réunion',
        en: 'Meeting Minutes'
    },
    [GeneratedDocumentType.POWER_OF_ATTORNEY]: {
        fr: 'Procuration',
        en: 'Power of Attorney'
    },
    [GeneratedDocumentType.ANNUAL_FINANCIAL_REPORT]: {
        fr: 'Rapport Financier Annuel',
        en: 'Annual Financial Report'
    },
    [GeneratedDocumentType.SHARE_REGISTER_EXTRACT]: {
        fr: 'Extrait du Registre des Actions',
        en: 'Share Register Extract'
    }
};

export const documentTemplateDescriptions: Record<GeneratedDocumentType, { fr: string; en: string }> = {
    [GeneratedDocumentType.MEMBERSHIP_CERTIFICATE]: {
        fr: 'Certifie qu\'un individu est membre de l\'association',
        en: 'Certifies that an individual is a member of the association'
    },
    [GeneratedDocumentType.SHARE_CERTIFICATE]: {
        fr: 'Certifie la propriété des actions dans l\'association foncière',
        en: 'Certifies ownership of shares in the land association'
    },
    [GeneratedDocumentType.SHARE_TRANSFER_CERTIFICATE]: {
        fr: 'Documente le transfert d\'actions entre parties',
        en: 'Documents the transfer of shares between parties'
    },
    [GeneratedDocumentType.LAND_ALLOCATION_CERTIFICATE]: {
        fr: 'Attribue des parcelles de terrain spécifiques à un actionnaire',
        en: 'Allocates specific land parcels to a shareholder'
    },
    [GeneratedDocumentType.PLOT_ATTRIBUTION_LETTER]: {
        fr: 'Notification formelle de l\'attribution de parcelle au membre',
        en: 'Formal notification of plot attribution to member'
    },
    [GeneratedDocumentType.PAYMENT_RECEIPT]: {
        fr: 'Accuse réception du paiement reçu du membre',
        en: 'Acknowledges receipt of payment from member'
    },
    [GeneratedDocumentType.STATEMENT_OF_ACCOUNT]: {
        fr: 'Résumé des transactions financières du membre',
        en: 'Summary of member\'s financial transactions'
    },
    [GeneratedDocumentType.SHARE_VALUATION_CERTIFICATE]: {
        fr: 'Valorisation actuelle des actions du membre',
        en: 'Current valuation of member\'s shares'
    },
    [GeneratedDocumentType.WITHDRAWAL_CERTIFICATE]: {
        fr: 'Confirme la sortie du membre et le règlement',
        en: 'Confirms member withdrawal and settlement'
    },
    [GeneratedDocumentType.INHERITANCE_TRANSFER_CERTIFICATE]: {
        fr: 'Documente le transfert d\'actions aux héritiers',
        en: 'Documents transfer of shares to heirs'
    },
    [GeneratedDocumentType.MEETING_MINUTES]: {
        fr: 'Compte rendu des réunions de l\'assemblée générale ou du conseil',
        en: 'Minutes of general assembly or board meetings'
    },
    [GeneratedDocumentType.POWER_OF_ATTORNEY]: {
        fr: 'Autorisation pour action représentative',
        en: 'Authorization for representative action'
    },
    [GeneratedDocumentType.ANNUAL_FINANCIAL_REPORT]: {
        fr: 'Résumé financier annuel de l\'association',
        en: 'Annual financial summary of the association'
    },
    [GeneratedDocumentType.SHARE_REGISTER_EXTRACT]: {
        fr: 'Extrait officiel du registre des actions',
        en: 'Official extract from the share register'
    }
};

export const uploadDocumentNames: Record<UploadedDocumentType, { fr: string; en: string }> = {
    [UploadedDocumentType.CERTIFICATE_OF_REGISTRATION]: {
        fr: 'Certificat d\'Enregistrement',
        en: 'Certificate of Registration'
    },
    [UploadedDocumentType.CONSTITUTION_BYLAWS]: {
        fr: 'Constitution / Règlements',
        en: 'Constitution / Bylaws'
    },
    [UploadedDocumentType.GLOBAL_LAND_TITLE]: {
        fr: 'Titre Foncier Global',
        en: 'Global Land Title'
    },
    [UploadedDocumentType.SURVEY_DEMARCATION_PLAN]: {
        fr: 'Plan de Bornage / Démarcation',
        en: 'Survey / Demarcation Plan'
    },
    [UploadedDocumentType.LAND_CERTIFICATE]: {
        fr: 'Certificat de Terrain',
        en: 'Land Certificate'
    },
    [UploadedDocumentType.COURT_ORDER]: {
        fr: 'Ordonnance du Tribunal',
        en: 'Court Order'
    },
    [UploadedDocumentType.NOTARIZED_ACT]: {
        fr: 'Acte Notarié',
        en: 'Notarized Act'
    },
    [UploadedDocumentType.LEGAL_OPINION]: {
        fr: 'Avis Juridique',
        en: 'Legal Opinion'
    },
    [UploadedDocumentType.NATIONAL_ID]: {
        fr: 'Carte d\'Identité Nationale',
        en: 'National ID Card'
    },
    [UploadedDocumentType.PASSPORT]: {
        fr: 'Passeport',
        en: 'Passport'
    },
    [UploadedDocumentType.BIRTH_CERTIFICATE]: {
        fr: 'Acte de Naissance',
        en: 'Birth Certificate'
    },
    [UploadedDocumentType.MARRIAGE_CERTIFICATE]: {
        fr: 'Acte de Mariage',
        en: 'Marriage Certificate'
    },
    [UploadedDocumentType.DEATH_CERTIFICATE]: {
        fr: 'Certificat de Décès',
        en: 'Death Certificate'
    },
    [UploadedDocumentType.BANK_STATEMENT]: {
        fr: 'Relevé Bancaire',
        en: 'Bank Statement'
    },
    [UploadedDocumentType.PROOF_OF_PAYMENT]: {
        fr: 'Preuve de Paiement',
        en: 'Proof of Payment'
    },
    [UploadedDocumentType.TAX_CLEARANCE]: {
        fr: 'Quittance Fiscale',
        en: 'Tax Clearance'
    },
    [UploadedDocumentType.SURVEYOR_CERTIFICATE]: {
        fr: 'Certificat de Géomètre',
        en: 'Surveyor Certificate'
    },
    [UploadedDocumentType.VALUATION_REPORT]: {
        fr: 'Rapport d\'Évaluation',
        en: 'Valuation Report'
    },
    [UploadedDocumentType.ENVIRONMENTAL_ASSESSMENT]: {
        fr: 'Évaluation Environnementale',
        en: 'Environmental Assessment'
    },
    [UploadedDocumentType.PHOTOGRAPH]: {
        fr: 'Photographie',
        en: 'Photograph'
    },
    [UploadedDocumentType.SUPPORTING_DOCUMENT]: {
        fr: 'Document Justificatif',
        en: 'Supporting Document'
    },
    [UploadedDocumentType.CORRESPONDENCE]: {
        fr: 'Correspondance',
        en: 'Correspondence'
    }
};

export const uploadDocumentDescriptions: Record<UploadedDocumentType, { fr: string; en: string }> = {
    [UploadedDocumentType.CERTIFICATE_OF_REGISTRATION]: {
        fr: 'Certificat officiel d\'enregistrement du registre gouvernemental',
        en: 'Official registration certificate from government registry'
    },
    [UploadedDocumentType.CONSTITUTION_BYLAWS]: {
        fr: 'Document fondateur de l\'association avec règles et structure de gouvernance',
        en: 'Founding document of the association with rules and governance structure'
    },
    [UploadedDocumentType.GLOBAL_LAND_TITLE]: {
        fr: 'Titre de propriété principal du terrain de l\'association',
        en: 'Main land title deed for the association\'s property'
    },
    [UploadedDocumentType.SURVEY_DEMARCATION_PLAN]: {
        fr: 'Plan technique montrant la subdivision du terrain',
        en: 'Technical plan showing land subdivision'
    },
    [UploadedDocumentType.LAND_CERTIFICATE]: {
        fr: 'Certificat de propriété foncière',
        en: 'Land ownership certificate'
    },
    [UploadedDocumentType.COURT_ORDER]: {
        fr: 'Décision judiciaire',
        en: 'Judicial decision'
    },
    [UploadedDocumentType.NOTARIZED_ACT]: {
        fr: 'Document légal certifié par un notaire',
        en: 'Legal document certified by a notary'
    },
    [UploadedDocumentType.LEGAL_OPINION]: {
        fr: 'Avis juridique professionnel',
        en: 'Professional legal opinion'
    },
    [UploadedDocumentType.NATIONAL_ID]: {
        fr: 'Carte d\'identité nationale du membre',
        en: 'Member\'s national identity card'
    },
    [UploadedDocumentType.PASSPORT]: {
        fr: 'Passeport du membre (alternative à la carte d\'identité)',
        en: 'Member\'s passport (alternative to ID card)'
    },
    [UploadedDocumentType.BIRTH_CERTIFICATE]: {
        fr: 'Acte de naissance officiel',
        en: 'Official birth certificate'
    },
    [UploadedDocumentType.MARRIAGE_CERTIFICATE]: {
        fr: 'Acte de mariage officiel',
        en: 'Official marriage certificate'
    },
    [UploadedDocumentType.DEATH_CERTIFICATE]: {
        fr: 'Certificat de décès pour traitement de la succession',
        en: 'Death certificate for succession processing'
    },
    [UploadedDocumentType.BANK_STATEMENT]: {
        fr: 'Relevé de compte bancaire',
        en: 'Bank account statement'
    },
    [UploadedDocumentType.PROOF_OF_PAYMENT]: {
        fr: 'Preuve de paiement externe (virement bancaire, chèque)',
        en: 'External payment proof (bank transfer, cheque)'
    },
    [UploadedDocumentType.TAX_CLEARANCE]: {
        fr: 'Attestation de régularité fiscale',
        en: 'Tax compliance certificate'
    },
    [UploadedDocumentType.SURVEYOR_CERTIFICATE]: {
        fr: 'Certificat professionnel de géomètre',
        en: 'Professional surveyor certificate'
    },
    [UploadedDocumentType.VALUATION_REPORT]: {
        fr: 'Rapport d\'évaluation de la propriété',
        en: 'Property valuation report'
    },
    [UploadedDocumentType.ENVIRONMENTAL_ASSESSMENT]: {
        fr: 'Évaluation de l\'impact environnemental',
        en: 'Environmental impact assessment'
    },
    [UploadedDocumentType.PHOTOGRAPH]: {
        fr: 'Photo d\'identité du membre',
        en: 'Member\'s identity photograph'
    },
    [UploadedDocumentType.SUPPORTING_DOCUMENT]: {
        fr: 'Tout document justificatif supplémentaire',
        en: 'Any additional supporting document'
    },
    [UploadedDocumentType.CORRESPONDENCE]: {
        fr: 'Correspondance officielle',
        en: 'Official correspondence'
    }
};
