import { Member, Asset, Document, PaymentPlan } from '../types/assets';
import { sampleMembers, sampleAssets, samplePaymentPlans } from '../data/assetSampleData';

// Re-export Member for convenience
export type { Member, Asset, Document, PaymentPlan } from '../types/assets';

const MEMBERS_KEY = 'great_ideas_members';
const ASSETS_KEY = 'great_ideas_assets';
const DOCUMENTS_KEY = 'great_ideas_documents';
const PAYMENT_PLANS_KEY = 'great_ideas_payment_plans';
const MEMBER_SEQUENCE_KEY = 'member_sequence'; // Single counter, no year

// Member ID Generation - New Format: GIS-####-#####
const generateRandomDigits = (length: number): number => {
    return Math.floor(Math.random() * Math.pow(10, length));
};

export const getNextMemberSequence = (): number => {
    const current = localStorage.getItem(MEMBER_SEQUENCE_KEY);
    const next = current ? parseInt(current, 10) + 1 : 1;
    localStorage.setItem(MEMBER_SEQUENCE_KEY, next.toString());
    return next;
};

export const generateMemberId = (): string => {
    const sequence = getNextMemberSequence();
    const incrementalPart = sequence.toString().padStart(4, '0');
    const randomPart = generateRandomDigits(5).toString().padStart(5, '0');
    return `GIS-${incrementalPart}-${randomPart}`;
};

// Data Migration - Add new fields to existing members
const migrateMembersData = (members: Member[]): Member[] => {
    return members.map((member, index) => ({
        ...member,
        memberId: member.memberId || `GIS-${(index + 1).toString().padStart(4, '0')}-${generateRandomDigits(5).toString().padStart(5, '0')}`,
        position: member.position || 'Member',
        dateOfBirth: member.dateOfBirth || '',
        identificationType: member.identificationType || 'NATIONAL_ID',
        idNumber: member.idNumber || '',
        idExpirationDate: member.idExpirationDate || ''
    }));
};

// Members
export const loadMembers = (): Member[] => {
    const stored = localStorage.getItem(MEMBERS_KEY);
    if (stored) {
        const members = JSON.parse(stored);
        if (!Array.isArray(members)) {
            const migratedSamples = migrateMembersData(sampleMembers);
            saveMembers(migratedSamples);
            return migratedSamples;
        }
        // Check if migration is needed (old data without memberId)
        if (members.length > 0 && !members[0].memberId) {
            const migrated = migrateMembersData(members);
            saveMembers(migrated);
            return migrated;
        }
        return members;
    }
    // Initialize with sample data
    const migratedSamples = migrateMembersData(sampleMembers);
    saveMembers(migratedSamples);
    return migratedSamples;
};

export const saveMembers = (members: Member[]): void => {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
};

export const addMember = (member: Member): void => {
    const members = loadMembers();
    // Auto-generate memberId if not provided
    if (!member.memberId) {
        member.memberId = generateMemberId();
    }
    members.push(member);
    saveMembers(members);
};

export const updateMember = (id: string, updatedMember: Member): void => {
    const members = loadMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
        members[index] = updatedMember;
        saveMembers(members);
    }
};

export const deleteMember = (id: string): void => {
    console.log('deleteMember CALLED with ID:', id);
    const members = loadMembers();
    console.log('Current members before delete:', members.length, members.map(m => m.id));
    const filtered = members.filter(m => m.id !== id);
    console.log('Filtered members after delete:', filtered.length);
    saveMembers(filtered);
    console.log('Members saved to localStorage');
};

// Assets
export const loadAssets = (): Asset[] => {
    const stored = localStorage.getItem(ASSETS_KEY);
    if (stored) {
        const assets = JSON.parse(stored);
        return Array.isArray(assets) ? assets : sampleAssets;
    }
    // Initialize with sample data
    saveAssets(sampleAssets);
    return sampleAssets;
};

export const saveAssets = (assets: Asset[]): void => {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
};

export const addAsset = (asset: Asset): void => {
    const assets = loadAssets();
    assets.push(asset);
    saveAssets(assets);
};

export const updateAsset = (id: string, updatedAsset: Asset): void => {
    const assets = loadAssets();
    const index = assets.findIndex(a => a.id === id);
    if (index !== -1) {
        assets[index] = updatedAsset;
        saveAssets(assets);
    }
};

export const deleteAsset = (id: string): void => {
    const assets = loadAssets();
    const filtered = assets.filter(a => a.id !== id);
    saveAssets(filtered);
};

// Documents
export const loadDocuments = (): Document[] => {
    const stored = localStorage.getItem(DOCUMENTS_KEY);
    if (!stored) return [];
    const docs = JSON.parse(stored);
    return Array.isArray(docs) ? docs : [];
};

export const saveDocuments = (documents: Document[]): void => {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
};

export const addDocument = (document: Document): void => {
    const documents = loadDocuments();
    documents.push(document);
    saveDocuments(documents);
};

export const deleteDocument = (id: string): void => {
    const documents = loadDocuments();
    const filtered = documents.filter(d => d.id !== id);
    saveDocuments(filtered);
};

// Payment Plans
export const loadPaymentPlans = (): PaymentPlan[] => {
    const stored = localStorage.getItem(PAYMENT_PLANS_KEY);
    if (stored) {
        const plans = JSON.parse(stored);
        return Array.isArray(plans) ? plans : samplePaymentPlans;
    }
    // Initialize with sample data
    savePaymentPlans(samplePaymentPlans);
    return samplePaymentPlans;
};

export const savePaymentPlans = (plans: PaymentPlan[]): void => {
    localStorage.setItem(PAYMENT_PLANS_KEY, JSON.stringify(plans));
};

export const addPaymentPlan = (plan: PaymentPlan): void => {
    const plans = loadPaymentPlans();
    plans.push(plan);
    savePaymentPlans(plans);
};

export const updatePaymentPlan = (id: string, updatedPlan: PaymentPlan): void => {
    const plans = loadPaymentPlans();
    const index = plans.findIndex(p => p.id === id);
    if (index !== -1) {
        plans[index] = updatedPlan;
        savePaymentPlans(plans);
    }
};

export const deletePaymentPlan = (id: string): void => {
    const plans = loadPaymentPlans();
    const filtered = plans.filter(p => p.id !== id);
    savePaymentPlans(filtered);
};

// Shared Value Configuration
const SHARED_VALUE_CONFIG_KEY = 'great_ideas_shared_value_config';

export interface SharedValueConfig {
    shareToM2Ratio: number; // 1 share = X m2
    m2ToCfaRatio: number;   // 1 m2 = Y CFA
}

export const loadSharedValueConfig = (): SharedValueConfig => {
    const stored = localStorage.getItem(SHARED_VALUE_CONFIG_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return { shareToM2Ratio: 0, m2ToCfaRatio: 0 };
};

export const saveSharedValueConfig = (config: SharedValueConfig): void => {
    localStorage.setItem(SHARED_VALUE_CONFIG_KEY, JSON.stringify(config));
};

// Asset Share Configuration (per asset)
const ASSET_SHARE_CONFIGS_KEY = 'great_ideas_asset_share_configs';

export interface AssetShareConfig {
    assetId: string;
    assetName: string;
    shareValue: number;
    unit: string;
    costPrice?: number;
    currentPrice?: number;
}

export const loadAssetShareConfigs = (): AssetShareConfig[] => {
    const stored = localStorage.getItem(ASSET_SHARE_CONFIGS_KEY);
    if (!stored) return [];
    const configs = JSON.parse(stored);
    return Array.isArray(configs) ? configs : [];
};

export const saveAssetShareConfigs = (configs: AssetShareConfig[]): void => {
    localStorage.setItem(ASSET_SHARE_CONFIGS_KEY, JSON.stringify(configs));
};

export const getAssetShareConfig = (assetId: string): AssetShareConfig | null => {
    const configs = loadAssetShareConfigs();
    return configs.find(c => c.assetId === assetId) || null;
};

export const saveAssetShareConfig = (config: AssetShareConfig): void => {
    const configs = loadAssetShareConfigs();
    const index = configs.findIndex(c => c.assetId === config.assetId);
    if (index !== -1) {
        configs[index] = config;
    } else {
        configs.push(config);
    }
    saveAssetShareConfigs(configs);
};

export const deleteAssetShareConfig = (assetId: string): void => {
    const configs = loadAssetShareConfigs();
    const filtered = configs.filter(c => c.assetId !== assetId);
    saveAssetShareConfigs(filtered);
};

// Member Asset Allocations
const MEMBER_ALLOCATIONS_KEY = 'great_ideas_member_allocations';

export interface MemberAssetAllocation {
    id: string;
    assetId: string;
    assetName: string;
    memberId: string;
    memberName: string;
    totalShares: number;
    totalAssetValue: number;
}

export const loadMemberAllocations = (): MemberAssetAllocation[] => {
    const stored = localStorage.getItem(MEMBER_ALLOCATIONS_KEY);
    if (!stored) return [];
    const allocations = JSON.parse(stored);
    return Array.isArray(allocations) ? allocations : [];
};

export const saveMemberAllocations = (allocations: MemberAssetAllocation[]): void => {
    localStorage.setItem(MEMBER_ALLOCATIONS_KEY, JSON.stringify(allocations));
};

export const getAllocationsForAsset = (assetId: string): MemberAssetAllocation[] => {
    const allocations = loadMemberAllocations();
    return allocations.filter(a => a.assetId === assetId);
};

export const saveMemberAllocation = (allocation: MemberAssetAllocation): void => {
    const allocations = loadMemberAllocations();
    const index = allocations.findIndex(a => a.id === allocation.id);
    if (index !== -1) {
        allocations[index] = allocation;
    } else {
        allocations.push(allocation);
    }
    saveMemberAllocations(allocations);
};

export const saveAllocationsForAsset = (assetId: string, newAllocations: MemberAssetAllocation[]): void => {
    const all = loadMemberAllocations();
    const filtered = all.filter(a => a.assetId !== assetId);
    saveMemberAllocations([...filtered, ...newAllocations]);
};

export const deleteAllocationsForAsset = (assetId: string): void => {
    const allocations = loadMemberAllocations();
    const filtered = allocations.filter(a => a.assetId !== assetId);
    saveMemberAllocations(filtered);
};
