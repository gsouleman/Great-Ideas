// Type definitions for Asset Management Module

export type Language = 'en' | 'fr';

export type IdentificationType = 'NATIONAL_ID' | 'PASSPORT' | 'DRIVER_LICENSE';

export type MemberPosition =
    | 'President'
    | 'Vice President'
    | 'Treasurer'
    | 'Secretary General'
    | 'Assistant Secretary General'
    | 'Auditor'
    | 'Member'
    | 'Founders shares';

export interface Member {
    id: string;                          // UUID for internal use
    memberId: string;                    // Auto-generated display ID (GIS-0001-12345)
    name: string;
    position: MemberPosition;            // Position in the association
    dateOfBirth: string;                 // Date of birth
    identificationType: IdentificationType; // Type of identification
    idNumber: string;                    // Identification number
    idExpirationDate: string;            // ID expiration date
    sharesOwned: number;
    landSizeM2: number;
    dateJoined: string;
    remarks: string;
    notes: string;
    email?: string;
    phone?: string;
}

export type AssetType = 'realEstate' | 'vehicleTransport' | 'equipment' | 'investment' | 'other';

export interface Asset {
    id: string;
    name: string;
    type: AssetType;
    purchaseDate: string;
    purchasePrice: number;
    currentValue: number;
    description: string;
    location?: string;
    size?: string; // For land: "14.5 ha", for vehicles: VIN, etc.
    documents: string[]; // Document IDs
    notes: string;
}

export type DocumentType =
    | 'articles_of_association'
    | 'share_certificate'
    | 'land_title'
    | 'purchase_agreement'
    | 'other';

export interface Document {
    id: string;
    name: string;
    type: DocumentType;
    assetId?: string;
    memberId?: string;
    uploadDate: string;
    fileUrl?: string;
    generated: boolean;
    notes: string;
}

export interface PaymentPlan {
    id: string;
    memberId: string;
    memberName: string;
    assetId?: string;
    assetName?: string;
    totalAmount: number;
    downPayment: number;
    balance: number;
    quarterlyAmount: number;
    startDate: string;
    payments: Payment[];
}

export interface Payment {
    id: string;
    planId: string;
    memberId: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: 'pending' | 'paid' | 'overdue';
    quarter?: number; // 1-4, optional for non-quarterly payments
    year: number;
    type: 'asset' | 'membership' | 'commission' | 'other';
    description: string;
    notes: string;
}

export type AssetView = 'dashboard' | 'members' | 'assets' | 'documents' | 'payments' | 'sharedValue' | 'memberShares';

// Asset Share Configuration (per asset)
export interface AssetShareConfig {
    assetId: string;
    assetName: string;
    shareValue: number;
    unit: string; // 'm2', 'ha', '$', 'XAF', or custom
    costPrice?: number; // Cost price per unit
    currentPrice?: number; // Current price per unit
}

// Member Asset Allocation
export interface MemberAssetAllocation {
    id: string;
    assetId: string;
    assetName: string;
    memberId: string;
    memberName: string;
    totalShares: number;
    totalAssetValue: number; // calculated: totalShares × shareValue
}
