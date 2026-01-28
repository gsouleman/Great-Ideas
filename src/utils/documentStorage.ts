import {
    GeneratedDocument,
    UploadedDocument,
    UnifiedDocumentView,
    DocumentGenerationRequest,
    DocumentUploadRequest,
    ValidationResult,
    RequirementsCheckResult,
    DocumentStatus,
    VerificationStatus,
    DocumentSource,
    DocumentCategory,
    DocumentScope,
    LinkedEntityType,
    TriggerEvent,
    UploadedDocumentType
} from '../types/documents';
import {
    getTemplateByType,
    getUploadConfigByType,
    getTemplatesByTrigger,
    getRequiredUploadConfigs
} from '../data/documentTemplates';

const CERTIFICATE_SEQUENCE_KEY = 'certificate_sequence_';

// Certificate Number Generation - Format: CERT-YYYY-#####
export const getNextCertificateSequence = (): number => {
    const year = new Date().getFullYear();
    const key = `${CERTIFICATE_SEQUENCE_KEY}${year}`;
    const current = localStorage.getItem(key);
    const next = current ? parseInt(current, 10) + 1 : 1;
    localStorage.setItem(key, next.toString());
    return next;
};

export const generateCertificateNumber = (): string => {
    const year = new Date().getFullYear();
    const sequence = getNextCertificateSequence();
    return `CERT-${year}-${sequence.toString().padStart(5, '0')}`;
};

// =====================================
// PART 1: STORAGE KEYS AND UTILITIES
// =====================================

const STORAGE_KEYS = {
    GENERATED_DOCUMENTS: 'great_ideas_generated_documents',
    UPLOADED_DOCUMENTS: 'great_ideas_uploaded_documents',
    DOCUMENT_SEQUENCES: 'great_ideas_document_sequences',
    DOCUMENT_AUDIT_LOG: 'great_ideas_document_audit'
};

/**
 * Generate UUID
 */
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Calculate simple checksum
 */
function calculateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

// =====================================
// PART 2: DOCUMENT NUMBER SEQUENCING
// =====================================

interface SequenceCounter {
    [key: string]: number; // Format: "PREFIX-YEAR" => count
}

/**
 * Get next sequence number for a prefix and year
 */
export function getNextSequence(prefix: string, year: number): number {
    const sequences: SequenceCounter = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.DOCUMENT_SEQUENCES) || '{}'
    );

    const key = `${prefix}-${year}`;
    const current = sequences[key] || 0;
    const next = current + 1;

    sequences[key] = next;
    localStorage.setItem(STORAGE_KEYS.DOCUMENT_SEQUENCES, JSON.stringify(sequences));

    return next;
}

/**
 * Generate document number
 */
export function generateDocumentNumber(prefix: string): string {
    const year = new Date().getFullYear();
    const sequence = getNextSequence(prefix, year);
    return `${prefix}-${year}-${sequence.toString().padStart(5, '0')}`;
}

// =======================================
// PART 3: GENERATED DOCUMENTS STORAGE
// =======================================

/**
 * Load all generated documents
 */
export function loadGeneratedDocuments(): GeneratedDocument[] {
    const data = localStorage.getItem(STORAGE_KEYS.GENERATED_DOCUMENTS);
    if (!data) return [];

    const docs = JSON.parse(data);
    if (!Array.isArray(docs)) return [];

    // Convert date strings back to Date objects
    return docs.map((doc: any) => ({
        ...doc,
        generatedAt: new Date(doc.generatedAt),
        approvedAt: doc.approvedAt ? new Date(doc.approvedAt) : null,
        validUntil: doc.validUntil ? new Date(doc.validUntil) : null
    }));
}

/**
 * Save generated documents
 */
export function saveGeneratedDocuments(documents: GeneratedDocument[]): void {
    localStorage.setItem(STORAGE_KEYS.GENERATED_DOCUMENTS, JSON.stringify(documents));
}

/**
 * Get generated document by ID
 */
export function getGeneratedDocumentById(id: string): GeneratedDocument | null {
    const documents = loadGeneratedDocuments();
    return documents.find(d => d.id === id) || null;
}

/**
 * Create generated document
 */
export function createGeneratedDocument(doc: GeneratedDocument): void {
    const documents = loadGeneratedDocuments();
    documents.push(doc);
    saveGeneratedDocuments(documents);
}

/**
 * Update generated document
 */
export function updateGeneratedDocument(doc: GeneratedDocument): void {
    const documents = loadGeneratedDocuments();
    const index = documents.findIndex(d => d.id === doc.id);
    if (index !== -1) {
        documents[index] = doc;
        saveGeneratedDocuments(documents);
    }
}

/**
 * Delete generated document
 */
export function deleteGeneratedDocument(id: string): void {
    const documents = loadGeneratedDocuments();
    const filtered = documents.filter(d => d.id !== id);
    saveGeneratedDocuments(filtered);
}

// =======================================
// PART 4: UPLOADED DOCUMENTS STORAGE
// =======================================

/**
 * Load all uploaded documents
 */
export function loadUploadedDocuments(): UploadedDocument[] {
    const data = localStorage.getItem(STORAGE_KEYS.UPLOADED_DOCUMENTS);
    if (!data) return [];

    const docs = JSON.parse(data);
    if (!Array.isArray(docs)) return [];

    // Convert date strings back to Date objects
    return docs.map((doc: any) => ({
        ...doc,
        uploadedAt: new Date(doc.uploadedAt),
        verifiedAt: doc.verifiedAt ? new Date(doc.verifiedAt) : null,
        expiryDate: doc.expiryDate ? new Date(doc.expiryDate) : null
    }));
}

/**
 * Save uploaded documents
 */
export function saveUploadedDocuments(documents: UploadedDocument[]): void {
    localStorage.setItem(STORAGE_KEYS.UPLOADED_DOCUMENTS, JSON.stringify(documents));
}

/**
 * Get uploaded document by ID
 */
export function getUploadedDocumentById(id: string): UploadedDocument | null {
    const documents = loadUploadedDocuments();
    return documents.find(d => d.id === id) || null;
}

/**
 * Create uploaded document
 */
export function createUploadedDocument(doc: UploadedDocument): void {
    const documents = loadUploadedDocuments();
    documents.push(doc);
    saveUploadedDocuments(documents);
}

/**
 * Update uploaded document
 */
export function updateUploadedDocument(doc: UploadedDocument): void {
    const documents = loadUploadedDocuments();
    const index = documents.findIndex(d => d.id === doc.id);
    if (index !== -1) {
        documents[index] = doc;
        saveUploadedDocuments(documents);
    }
}

/**
 * Delete uploaded document
 */
export function deleteUploadedDocument(id: string): void {
    const documents = loadUploadedDocuments();
    const filtered = documents.filter(d => d.id !== id);
    saveUploadedDocuments(filtered);
}

// =======================================
// PART 5: DOCUMENT GENERATION LOGIC
// =======================================

/**
 * Validate generation request
 */
export function validateGenerationRequest(
    request: DocumentGenerationRequest
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const template = getTemplateByType(request.templateType);
    if (!template) {
        errors.push('Template introuvable');
        return { isValid: false, errors, warnings };
    }

    // Check required fields
    for (const field of template.requiredFields) {
        if (!request.parameters[field]) {
            errors.push(`Champ requis manquant: ${field}`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Generate document
 */
export async function generateDocument(
    request: DocumentGenerationRequest
): Promise<GeneratedDocument> {
    // Validate request
    const validation = validateGenerationRequest(request);
    if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
    }

    const template = getTemplateByType(request.templateType)!;

    // Generate document number
    const documentNumber = generateDocumentNumber(template.sequencePrefix);

    // For this demo, we'll create a base64 placeholder for the PDF
    // In production, you would use jsPDF to generate actual PDFs
    const mockPdfContent = `Mock PDF content for ${documentNumber}`;
    const fileUrl = `data:application/pdf;base64,${btoa(mockPdfContent)}`;
    const fileSize = mockPdfContent.length;
    const checksum = calculateChecksum(mockPdfContent);

    // Calculate validity period
    const validUntil = template.validityPeriod
        ? new Date(Date.now() + template.validityPeriod * 24 * 60 * 60 * 1000)
        : null;

    const document: GeneratedDocument = {
        id: generateUUID(),
        documentNumber,
        templateId: template.id,
        templateType: template.type,
        category: template.category,
        memberId: request.memberId || null,
        memberName: request.parameters.memberName || null,
        title: `${template.name} - ${documentNumber}`,
        generatedAt: new Date(),
        generatedBy: request.requestedBy,
        approvedAt: null,
        approvedBy: null,
        status: template.requiresApproval
            ? DocumentStatus.PENDING_APPROVAL
            : DocumentStatus.ISSUED,
        outputFormat: request.outputFormat,
        fileUrl,
        fileSize,
        checksum,
        validUntil,
        metadata: request.parameters,
        version: 1,
        previousVersionId: null
    };

    createGeneratedDocument(document);

    return document;
}

/**
 * Approve generated document
 */
export function approveGeneratedDocument(
    documentId: string,
    approvedBy: string
): GeneratedDocument | null {
    const doc = getGeneratedDocumentById(documentId);
    if (!doc) return null;

    doc.status = DocumentStatus.APPROVED;
    doc.approvedAt = new Date();
    doc.approvedBy = approvedBy;

    updateGeneratedDocument(doc);
    return doc;
}

/**
 * Revoke generated document
 */
export function revokeGeneratedDocument(documentId: string): GeneratedDocument | null {
    const doc = getGeneratedDocumentById(documentId);
    if (!doc) return null;

    doc.status = DocumentStatus.REVOKED;
    updateGeneratedDocument(doc);
    return doc;
}

/**
 * Handle trigger event for auto-generation
 */
export async function handleTriggerEvent(
    event: TriggerEvent,
    eventData: Record<string, any>,
    triggeredBy: string
): Promise<GeneratedDocument[]> {
    const templates = getTemplatesByTrigger(event);
    const generatedDocs: GeneratedDocument[] = [];

    for (const template of templates) {
        try {
            const request: DocumentGenerationRequest = {
                templateType: template.type,
                requestedBy: triggeredBy,
                memberId: eventData.memberId,
                parameters: eventData,
                outputFormat: template.outputFormats[0],
                copies: 1,
                urgent: false
            };

            const doc = await generateDocument(request);
            generatedDocs.push(doc);
        } catch (error) {
            console.error(`Failed to auto-generate ${template.type}:`, error);
        }
    }

    return generatedDocs;
}

// =======================================
// PART 6: DOCUMENT UPLOAD LOGIC
// =======================================

/**
 * Validate file
 */
export function validateFile(
    file: File,
    documentType: UploadedDocumentType
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const config = getUploadConfigByType(documentType);
    if (!config) {
        errors.push('Configuration introuvable');
        return { isValid: false, errors, warnings };
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > config.maxFileSizeMB) {
        errors.push(
            `Taille du fichier (${fileSizeMB.toFixed(2)} MB) dépasse le maximum autorisé (${config.maxFileSizeMB} MB)`
        );
    }

    // Check file format
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !config.allowedFormats.includes(extension)) {
        errors.push(
            `Format de fichier (.${extension}) non autorisé. Formats acceptés: ${config.allowedFormats.join(', ')}`
        );
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Validate metadata
 */
export function validateMetadata(
    metadata: Record<string, any>,
    documentType: UploadedDocumentType
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const config = getUploadConfigByType(documentType);
    if (!config) {
        errors.push('Configuration introuvable');
        return { isValid: false, errors, warnings };
    }

    for (const rule of config.validationRules) {
        const value = metadata[rule.field];

        switch (rule.rule) {
            case 'REQUIRED':
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    errors.push(rule.errorMessage);
                }
                break;

            case 'DATE_RANGE':
                if (value) {
                    const date = new Date(value);
                    if (rule.params?.minDate === 'today' && date < new Date()) {
                        errors.push(rule.errorMessage);
                    }
                    if (rule.params?.maxDate === 'today' && date > new Date()) {
                        errors.push(rule.errorMessage);
                    }
                }
                break;
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Upload document
 */
export async function uploadDocument(
    request: DocumentUploadRequest
): Promise<UploadedDocument> {
    // Validate file
    const fileValidation = validateFile(request.file, request.documentType);
    if (!fileValidation.isValid) {
        throw new Error(fileValidation.errors.join(', '));
    }

    // Validate metadata
    const metadataValidation = validateMetadata(request.metadata, request.documentType);
    if (!metadataValidation.isValid) {
        throw new Error(metadataValidation.errors.join(', '));
    }

    const config = getUploadConfigByType(request.documentType)!;

    // Read file as base64 (for demo purposes)
    const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(request.file);
    });

    const extension = request.file.name.split('.').pop();
    const storedFilename = `${config.type}_${Date.now()}_${generateUUID()}.${extension}`;
    const checksum = calculateChecksum(fileContent);

    // Determine expiry date
    let expiryDate: Date | null = null;
    if (config.expiryTracking && request.metadata.expiryDate) {
        expiryDate = new Date(request.metadata.expiryDate);
    } else if (config.expiryTracking && request.metadata.validUntil) {
        expiryDate = new Date(request.metadata.validUntil);
    }

    // Check for existing document to version
    const existing = loadUploadedDocuments().find(
        d => d.documentType === request.documentType &&
            d.linkedEntityId === request.linkedEntityId &&
            d.isActive
    );

    const document: UploadedDocument = {
        id: generateUUID(),
        documentType: request.documentType,
        category: config.category,
        scope: config.scope,
        originalFilename: request.file.name,
        storedFilename,
        mimeType: request.file.type,
        fileSize: request.file.size,
        fileUrl: fileContent,
        checksum,
        uploadedAt: new Date(),
        uploadedBy: request.uploadedBy,
        linkedEntityType: request.linkedEntityType || null,
        linkedEntityId: request.linkedEntityId || null,
        metadata: request.metadata,
        tags: request.tags || [],
        verificationStatus: config.requiresVerification
            ? VerificationStatus.PENDING
            : VerificationStatus.VERIFIED,
        verifiedAt: config.requiresVerification ? null : new Date(),
        verifiedBy: config.requiresVerification ? null : 'SYSTEM',
        verificationNotes: null,
        expiryDate,
        isActive: true,
        replacedById: null,
        version: existing ? existing.version + 1 : 1
    };

    // Deactivate existing if replacing
    if (existing) {
        existing.isActive = false;
        existing.replacedById = document.id;
        updateUploadedDocument(existing);
    }

    createUploadedDocument(document);

    return document;
}

/**
 * Verify uploaded document
 */
export function verifyUploadedDocument(
    documentId: string,
    verifiedBy: string,
    status: VerificationStatus,
    notes?: string
): UploadedDocument | null {
    const doc = getUploadedDocumentById(documentId);
    if (!doc) return null;

    doc.verificationStatus = status;
    doc.verifiedAt = new Date();
    doc.verifiedBy = verifiedBy;
    doc.verificationNotes = notes || null;

    updateUploadedDocument(doc);
    return doc;
}

// =======================================
// PART 7: UNIFIED DOCUMENT QUERIES
// =======================================

/**
 * Get all documents (generated + uploaded) as unified view
 */
export function getAllDocumentsUnified(): UnifiedDocumentView[] {
    const generated = loadGeneratedDocuments();
    const uploaded = loadUploadedDocuments();

    const generatedViews: UnifiedDocumentView[] = generated.map(doc => ({
        id: doc.id,
        source: DocumentSource.GENERATED,
        documentType: doc.templateType,
        category: doc.category,
        title: doc.title,
        description: `Document généré: ${doc.documentNumber}`,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        mimeType: doc.outputFormat === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        createdAt: doc.generatedAt,
        createdBy: doc.generatedBy,
        linkedEntityType: doc.memberId ? LinkedEntityType.MEMBER : null,
        linkedEntityId: doc.memberId,
        status: doc.status,
        expiryDate: doc.validUntil,
        version: doc.version,
        tags: [],
        canDownload: true,
        canDelete: doc.status === DocumentStatus.DRAFT,
        canRegenerate: doc.status === DocumentStatus.ISSUED || doc.status === DocumentStatus.APPROVED,
        canReplace: false
    }));

    const uploadedViews: UnifiedDocumentView[] = uploaded
        .filter(doc => doc.isActive)
        .map(doc => ({
            id: doc.id,
            source: DocumentSource.UPLOADED,
            documentType: doc.documentType,
            category: doc.category,
            title: doc.originalFilename,
            description: `Document téléchargé: ${doc.originalFilename}`,
            fileUrl: doc.fileUrl,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            createdAt: doc.uploadedAt,
            createdBy: doc.uploadedBy,
            linkedEntityType: doc.linkedEntityType,
            linkedEntityId: doc.linkedEntityId,
            status: doc.verificationStatus,
            expiryDate: doc.expiryDate,
            version: doc.version,
            tags: doc.tags,
            canDownload: true,
            canDelete: true,
            canRegenerate: false,
            canReplace: true
        }));

    return [...generatedViews, ...uploadedViews].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
}

/**
 * Get documents by category
 */
export function getDocumentsByCategory(category: DocumentCategory): UnifiedDocumentView[] {
    return getAllDocumentsUnified().filter(doc => doc.category === category);
}

/**
 * Get documents by member
 */
export function getDocumentsByMember(memberId: string): UnifiedDocumentView[] {
    return getAllDocumentsUnified().filter(
        doc => doc.linkedEntityType === LinkedEntityType.MEMBER && doc.linkedEntityId === memberId
    );
}

/**
 * Check expiring documents
 */
export function getExpiringDocuments(daysAhead: number = 30): UnifiedDocumentView[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    return getAllDocumentsUnified().filter(
        doc => doc.expiryDate && doc.expiryDate <= cutoffDate && doc.expiryDate >= new Date()
    );
}

/**
 * Get member document requirements status
 */
export function getMemberDocumentRequirements(memberId: string): RequirementsCheckResult {
    const requiredConfigs = getRequiredUploadConfigs(DocumentScope.MEMBER);
    const memberDocs = loadUploadedDocuments().filter(
        d => d.linkedEntityId === memberId && d.isActive
    );

    const uploadedTypes = new Set(memberDocs.map(d => d.documentType));
    const missingConfigs = requiredConfigs.filter(
        c => !uploadedTypes.has(c.type)
    );

    const now = new Date();
    const expiredDocs = memberDocs.filter(
        d => d.expiryDate && d.expiryDate < now
    );

    const pendingVerification = memberDocs.filter(
        d => d.verificationStatus === VerificationStatus.PENDING
    );

    const completionPercentage = requiredConfigs.length > 0
        ? ((requiredConfigs.length - missingConfigs.length) / requiredConfigs.length) * 100
        : 100;

    return {
        isComplete: missingConfigs.length === 0 && expiredDocs.length === 0,
        completionPercentage,
        required: requiredConfigs,
        uploaded: memberDocs,
        missing: missingConfigs,
        expired: expiredDocs,
        pendingVerification
    };
}
