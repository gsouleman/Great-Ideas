// Document Management System Type Definitions
// Part 1: Common Types and Enums

// Document categories
export enum DocumentCategory {
    MEMBERSHIP = 'MEMBERSHIP',
    SHARES = 'SHARES',
    LAND = 'LAND',
    FINANCIAL = 'FINANCIAL',
    GOVERNANCE = 'GOVERNANCE',
    SUCCESSION = 'SUCCESSION'
}

// Document scope
export enum DocumentScope {
    ASSOCIATION = 'ASSOCIATION',  // One document for entire association
    MEMBER = 'MEMBER',            // One per member
    LAND_PARCEL = 'LAND_PARCEL',  // One per land parcel
    TRANSACTION = 'TRANSACTION'   // One per transaction
}

// Linked entity types
export enum LinkedEntityType {
    MEMBER = 'MEMBER',
    LAND_PARCEL = 'LAND_PARCEL',
    SHARE_TRANSACTION = 'SHARE_TRANSACTION',
    PAYMENT = 'PAYMENT',
    MEETING = 'MEETING',
    INHERITANCE_CASE = 'INHERITANCE_CASE'
}

// Output formats
export enum OutputFormat {
    PDF = 'PDF',
    DOCX = 'DOCX',
    HTML = 'HTML'
}

// Part 2: Generated Documents

// Generated document types
export enum GeneratedDocumentType {
    MEMBERSHIP_CERTIFICATE = 'MEMBERSHIP_CERTIFICATE',
    SHARE_CERTIFICATE = 'SHARE_CERTIFICATE',
    SHARE_TRANSFER_CERTIFICATE = 'SHARE_TRANSFER_CERTIFICATE',
    LAND_ALLOCATION_CERTIFICATE = 'LAND_ALLOCATION_CERTIFICATE',
    PLOT_ATTRIBUTION_LETTER = 'PLOT_ATTRIBUTION_LETTER',
    PAYMENT_RECEIPT = 'PAYMENT_RECEIPT',
    STATEMENT_OF_ACCOUNT = 'STATEMENT_OF_ACCOUNT',
    SHARE_VALUATION_CERTIFICATE = 'SHARE_VALUATION_CERTIFICATE',
    WITHDRAWAL_CERTIFICATE = 'WITHDRAWAL_CERTIFICATE',
    INHERITANCE_TRANSFER_CERTIFICATE = 'INHERITANCE_TRANSFER_CERTIFICATE',
    MEETING_MINUTES = 'MEETING_MINUTES',
    POWER_OF_ATTORNEY = 'POWER_OF_ATTORNEY',
    ANNUAL_FINANCIAL_REPORT = 'ANNUAL_FINANCIAL_REPORT',
    SHARE_REGISTER_EXTRACT = 'SHARE_REGISTER_EXTRACT'
}

// Trigger events for auto-generation
export enum TriggerEvent {
    MEMBER_REGISTRATION = 'MEMBER_REGISTRATION',
    SHARE_PURCHASE = 'SHARE_PURCHASE',
    SHARE_TRANSFER = 'SHARE_TRANSFER',
    PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
    PLOT_ALLOCATION = 'PLOT_ALLOCATION',
    MEMBER_WITHDRAWAL = 'MEMBER_WITHDRAWAL',
    INHERITANCE_CLAIM = 'INHERITANCE_CLAIM',
    MEETING_CONCLUDED = 'MEETING_CONCLUDED',
    MANUAL_REQUEST = 'MANUAL_REQUEST',
    PERIODIC_SCHEDULE = 'PERIODIC_SCHEDULE'
}

// Document status
export enum DocumentStatus {
    DRAFT = 'DRAFT',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    ISSUED = 'ISSUED',
    REVOKED = 'REVOKED',
    EXPIRED = 'EXPIRED',
    SUPERSEDED = 'SUPERSEDED'
}

// Document template configuration
export interface DocumentTemplate {
    id: string;
    type: GeneratedDocumentType;
    name: string;
    description: string;
    category: DocumentCategory;
    requiredFields: string[];
    optionalFields: string[];
    triggerEvents: TriggerEvent[];
    autoGenerate: boolean;
    requiresApproval: boolean;
    validityPeriod: number | null; // days, null = permanent
    sequencePrefix: string;
    outputFormats: OutputFormat[];
}

// Generated document record
export interface GeneratedDocument {
    id: string;
    documentNumber: string;
    templateId: string;
    templateType: GeneratedDocumentType;
    category: DocumentCategory;
    memberId: string | null;
    memberName: string | null;
    title: string;
    generatedAt: Date;
    generatedBy: string;
    approvedAt: Date | null;
    approvedBy: string | null;
    status: DocumentStatus;
    outputFormat: OutputFormat;
    fileUrl: string;
    fileSize: number;
    checksum: string;
    validUntil: Date | null;
    metadata: Record<string, any>;
    version: number;
    previousVersionId: string | null;
}

// Document generation request
export interface DocumentGenerationRequest {
    templateType: GeneratedDocumentType;
    requestedBy: string;
    memberId?: string;
    parameters: Record<string, any>;
    outputFormat: OutputFormat;
    copies: number;
    urgent: boolean;
}

// Part 3: Uploaded Documents

// Uploaded document types
export enum UploadedDocumentType {
    // Founding documents
    CERTIFICATE_OF_REGISTRATION = 'CERTIFICATE_OF_REGISTRATION',
    CONSTITUTION_BYLAWS = 'CONSTITUTION_BYLAWS',

    // Land documents
    GLOBAL_LAND_TITLE = 'GLOBAL_LAND_TITLE',
    SURVEY_DEMARCATION_PLAN = 'SURVEY_DEMARCATION_PLAN',
    LAND_CERTIFICATE = 'LAND_CERTIFICATE',

    // Legal documents
    COURT_ORDER = 'COURT_ORDER',
    NOTARIZED_ACT = 'NOTARIZED_ACT',
    LEGAL_OPINION = 'LEGAL_OPINION',

    // Member identity documents
    NATIONAL_ID = 'NATIONAL_ID',
    PASSPORT = 'PASSPORT',
    BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
    MARRIAGE_CERTIFICATE = 'MARRIAGE_CERTIFICATE',
    DEATH_CERTIFICATE = 'DEATH_CERTIFICATE',

    // Financial documents
    BANK_STATEMENT = 'BANK_STATEMENT',
    PROOF_OF_PAYMENT = 'PROOF_OF_PAYMENT',
    TAX_CLEARANCE = 'TAX_CLEARANCE',

    // External certifications
    SURVEYOR_CERTIFICATE = 'SURVEYOR_CERTIFICATE',
    VALUATION_REPORT = 'VALUATION_REPORT',
    ENVIRONMENTAL_ASSESSMENT = 'ENVIRONMENTAL_ASSESSMENT',

    // Other
    PHOTOGRAPH = 'PHOTOGRAPH',
    SUPPORTING_DOCUMENT = 'SUPPORTING_DOCUMENT',
    CORRESPONDENCE = 'CORRESPONDENCE'
}

// Verification status
export enum VerificationStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
}

// Validation rule types
export type ValidationRuleType = 'REQUIRED' | 'FORMAT' | 'DATE_RANGE' | 'CUSTOM';

// Validation rule
export interface ValidationRule {
    field: string;
    rule: ValidationRuleType;
    params?: Record<string, any>;
    errorMessage: string;
}

// Upload configuration
export interface UploadDocumentConfig {
    id: string;
    type: UploadedDocumentType;
    name: string;
    description: string;
    category: DocumentCategory;
    scope: DocumentScope;
    allowedFormats: string[];
    maxFileSizeMB: number;
    isRequired: boolean;
    requiresVerification: boolean;
    expiryTracking: boolean;
    linkedEntities: LinkedEntityType[];
    validationRules: ValidationRule[];
}

// Uploaded document record
export interface UploadedDocument {
    id: string;
    documentType: UploadedDocumentType;
    category: DocumentCategory;
    scope: DocumentScope;
    originalFilename: string;
    storedFilename: string;
    mimeType: string;
    fileSize: number;
    fileUrl: string;
    checksum: string;
    uploadedAt: Date;
    uploadedBy: string;
    linkedEntityType: LinkedEntityType | null;
    linkedEntityId: string | null;
    metadata: Record<string, any>;
    tags: string[];
    verificationStatus: VerificationStatus;
    verifiedAt: Date | null;
    verifiedBy: string | null;
    verificationNotes: string | null;
    expiryDate: Date | null;
    isActive: boolean;
    replacedById: string | null;
    version: number;
}

// Document upload request
export interface DocumentUploadRequest {
    documentType: UploadedDocumentType;
    file: File;
    uploadedBy: string;
    linkedEntityType?: LinkedEntityType;
    linkedEntityId?: string;
    metadata: Record<string, any>;
    tags?: string[];
}

// Part 4: Unified Document Types

// Document source
export enum DocumentSource {
    GENERATED = 'GENERATED',
    UPLOADED = 'UPLOADED'
}

// Union type for all documents
export type AnyDocument = GeneratedDocument | UploadedDocument;

// Unified document view for UI
export interface UnifiedDocumentView {
    id: string;
    source: DocumentSource;
    documentType: GeneratedDocumentType | UploadedDocumentType;
    category: DocumentCategory;
    title: string;
    description: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    createdAt: Date;
    createdBy: string;
    linkedEntityType: LinkedEntityType | null;
    linkedEntityId: string | null;
    status: string;
    expiryDate: Date | null;
    version: number;
    tags: string[];
    canDownload: boolean;
    canDelete: boolean;
    canRegenerate: boolean;
    canReplace: boolean;
}

// Part 5: Utility Types

// Validation result
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

// Requirements check result
export interface RequirementsCheckResult {
    isComplete: boolean;
    completionPercentage: number;
    required: UploadDocumentConfig[];
    uploaded: UploadedDocument[];
    missing: UploadDocumentConfig[];
    expired: UploadedDocument[];
    pendingVerification: UploadedDocument[];
}

// Document dashboard data
export interface DocumentDashboardData {
    summary: {
        totalDocuments: number;
        generatedDocuments: number;
        uploadedDocuments: number;
        pendingApproval: number;
        pendingVerification: number;
        expiringWithin30Days: number;
        expiredDocuments: number;
    };
    byCategory: Record<DocumentCategory, {
        total: number;
        generated: number;
        uploaded: number;
    }>;
    recentActivity: {
        documentId: string;
        action: string;
        timestamp: Date;
        userId: string;
        documentTitle: string;
    }[];
    memberDocumentStatus: {
        memberId: string;
        memberName: string;
        requiredCount: number;
        uploadedCount: number;
        missingCount: number;
        completionPercentage: number;
    }[];
    associationDocumentStatus: {
        type: UploadedDocumentType;
        name: string;
        status: 'COMPLETE' | 'MISSING' | 'EXPIRED' | 'PENDING';
        documentId: string | null;
        expiryDate: Date | null;
    }[];
}

// Audit log entry
export interface DocumentAuditLog {
    id: string;
    action: string;
    documentId: string;
    userId: string;
    timestamp: Date;
    details: Record<string, any>;
}
