// types.ts

export enum PlanTier {
    STANDARD = 'Standard',
    PREMIUM = 'Premium',
    PREMIUM_PLUS = 'Premium+',
    PRO = 'Pro',
}

export type UserRole = 'CLONE' | 'CONSULTEUR' | 'ADMIN';

interface BaseUser {
    id: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
}

export interface CloneUser extends BaseUser {
    role: 'CLONE';
    email: string;
    plan: PlanTier;
    googleDriveConnected: boolean;
}

export interface ConsulteurUser extends BaseUser {
    role: 'CONSULTEUR';
    cloneId: string;
    cloneName: string;
    cloneNickname?: string;
    beneficiaryId: string; // Used for vault verification
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface AdminUser extends BaseUser {
    role: 'ADMIN';
    permissions: ('manage_users' | 'view_stats' | 'manage_billing')[];
}


export type AppUser = CloneUser | ConsulteurUser | AdminUser;


export enum DashboardView {
    DASHBOARD = 'dashboard',
    VAULT = 'vault',
    CHANNELS = 'channels',
    VOICE = 'voice',
    TRAINING_CENTER = 'training_center',
    BILLING = 'billing',
    SETTINGS = 'settings',
}

export enum AdminDashboardView {
    OVERVIEW = 'overview',
    CLIENTS = 'clients',
    VERIFICATIONS = 'verifications',
    PAYMENTS = 'payments',
    SETTINGS = 'settings',
}

export enum ProcheDashboardView {
    CHAT = 'chat',
    VAULT = 'vault',
    CONTRIBUTE = 'contribute',
    SETTINGS = 'settings',
    PRIVACY = 'privacy',
}

export interface Guardian {
    id: string;
    name: string;
    email: string;
}

export type VerificationStatus = 'pending' | 'approved' | 'rejected';


export interface SealedItem {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    status: 'sealed' | 'unsealing' | 'unsealed';
    shards_required: number;
    guardians: Guardian[];
    metadata: {
        type: 'message' | 'file';
    };
}

export interface CustomKnowledge {
    id: number;
    text: string;
}

export interface PersonalityQuizQuestion {
    id: number;
    question: string;
    answer: string;
}

export interface TrainingData {
    personality: string;
    values: string;
    humor: string;
    greeting: string;
    comfortStyle: string;
    customKnowledge: CustomKnowledge[];
    personalityQuiz: PersonalityQuizQuestion[];
}

export interface TrainingDocument {
    id: string;
    name: string;
    uploadedAt: string;
    status: 'ready' | 'processing' | 'error';
}

export interface PublicCloneInfo {
    id: string;
    name: string;
    welcomeMessage: string;
}

export interface Beneficiary {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idNumber: string;
    relationship: string;
    secretQuestion: string;
    secretToken: string;
}

export interface UnlockAttempt {
    fullName: string;
    idNumber: string;
    secretToken: string;
}

// NEW: Types for legal document management
export type LegalDocumentType = 'cgu' | 'privacy' | 'legal' | 'contact';

export type LegalDocuments = {
    [key in LegalDocumentType]?: {
        fileName: string;
        url: string;
    }
};