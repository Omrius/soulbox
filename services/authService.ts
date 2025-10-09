// services/authService.ts
import { AppUser, CloneUser, ConsulteurUser, AdminUser, PlanTier, Beneficiary, UnlockAttempt, Guardian, LegalDocuments, LegalDocumentType } from '../types.ts';

// --- Mock Data Store ---

const MOCK_CLONE_USER: CloneUser = {
    id: 'clone_user_123',
    name: 'Jean Dupont',
    email: 'user@example.com',
    role: 'CLONE',
    plan: PlanTier.PREMIUM,
    googleDriveConnected: false,
};

const MOCK_ADMIN_USER: AdminUser = {
    id: 'admin_user_789',
    name: 'Admin SoulBox',
    role: 'ADMIN',
    permissions: ['manage_users', 'view_stats', 'manage_billing'],
};

// NEW: Mock store for multiple admins
let mockAdmins: AdminUser[] = [MOCK_ADMIN_USER];


let mockBeneficiaries: Beneficiary[] = [
    {
        id: 'benef_1',
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.d@example.com',
        phone: '0601020304',
        idNumber: '1234567890AB',
        relationship: 'Fille',
        secretQuestion: 'Nom de mon premier chien ?',
        secretToken: 'TOKEN_MARIE_123'
    }
];

let mockGuardians: Guardian[] = [
    { id: 'g_1', name: 'Alice Dupont', email: 'alice.d@example.com' },
    { id: 'g_2', name: 'Bob Martin', email: 'bob.m@example.com' },
    { id: 'g_3', name: 'Charlie Durand', email: 'charlie.d@example.com' },
];

// NEW: Mock store for legal documents
let mockLegalDocuments: LegalDocuments = {};


// --- Mock API Functions ---

export const loginAsClone = async (email: string, password: string): Promise<AppUser> => {
    console.log(`Attempting login as Clone with email: ${email}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === 'user@example.com' && password === 'password') {
                resolve(MOCK_CLONE_USER);
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
};

export const registerWithEmail = async (name: string, email: string, password: string): Promise<{ user: CloneUser, message: string }> => {
    console.log(`Registering user ${name} with email ${email}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newUser: CloneUser = {
                id: `new_user_${Date.now()}`,
                name,
                email,
                role: 'CLONE',
                plan: PlanTier.STANDARD,
                googleDriveConnected: false,
            };
            resolve({ user: newUser, message: `Un code a été envoyé à ${email} pour vérification.`});
        }, 1500);
    });
};

export const verifyEmailCode = async (user: CloneUser, code: string): Promise<AppUser> => {
    console.log(`Verifying code ${code} for user ${user.email}`);
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (code === '123456') {
                resolve({ ...user, id: MOCK_CLONE_USER.id }); // Simulate successful verification and login
            } else {
                reject(new Error('Code de vérification invalide.'));
            }
        }, 1000);
    });
};

export const forgotPassword = async (email: string): Promise<string> => {
    console.log(`Password reset requested for email: ${email}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email.includes('@')) {
                resolve(`Si un compte est associé à ${email}, un email de réinitialisation de mot de passe a été envoyé.`);
            } else {
                reject(new Error('Veuillez entrer une adresse email valide.'));
            }
        }, 1000);
    });
};

// NEW: Step 1 for "Proche" login
export const verifyProcheIdentity = async (name: string, phone: string): Promise<{ success: boolean, message: string }> => {
    console.log(`Verifying Proche identity for ${name} with phone ${phone}`);
    return new Promise(resolve => {
        setTimeout(() => {
            // In a real app, you'd check if a beneficiary with this info exists.
            if (name.trim() !== '' && phone.trim() !== '') {
                resolve({ success: true, message: "Identité vérifiée. Veuillez entrer le jeton secret." });
            } else {
                resolve({ success: false, message: "Nom et téléphone non valides." });
            }
        }, 1000);
    });
};

// UPDATE: Step 2 for "Proche" login - Now dynamic and includes beneficiaryId
export const verifyProcheToken = async (token: string): Promise<AppUser> => {
    console.log(`Verifying Proche token: ${token}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const beneficiary = mockBeneficiaries.find(b => b.secretToken.toUpperCase() === token.toUpperCase());

            if (beneficiary) {
                resolve({
                    id: `consulteur_user_${beneficiary.id}`,
                    name: `${beneficiary.firstName} ${beneficiary.lastName}`,
                    role: 'CONSULTEUR',
                    cloneId: MOCK_CLONE_USER.id,
                    cloneName: MOCK_CLONE_USER.name,
                    beneficiaryId: beneficiary.id,
                    firstName: beneficiary.firstName,
                    lastName: beneficiary.lastName,
                    email: beneficiary.email,
                    phone: beneficiary.phone,
                });
            } else {
                reject(new Error('Jeton secret invalide.'));
            }
        }, 1000);
    });
};


export const loginAsAdmin = async (email: string, password: string): Promise<AppUser> => {
    console.log(`Attempting login as Admin with email: ${email}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Check against our mock array of admins (simple check for demo)
            const admin = mockAdmins.find(a => a.id === 'admin_user_789');
            if (email === 'admin@soulbox.com' && password === 'admin' && admin) {
                resolve(admin);
            } else {
                reject(new Error('Invalid admin credentials'));
            }
        }, 1000);
    });
};

// NEW: Admin Management Functions
export const fetchAdmins = async (): Promise<AdminUser[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockAdmins]), 500));
};

export const addAdmin = async (data: { name: string; permissions: AdminUser['permissions'] }): Promise<AdminUser> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newAdmin: AdminUser = {
                id: `admin_${Date.now()}`,
                name: data.name,
                role: 'ADMIN',
                permissions: data.permissions,
            };
            mockAdmins.push(newAdmin);
            resolve(newAdmin);
        }, 1000);
    });
};

export const changeAdminPassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string; }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // In a real app, you would verify the current password against a hash in the database.
            // For this mock, we'll just check against the known password 'admin'.
            if (currentPassword !== 'admin') {
                return reject(new Error("Le mot de passe actuel est incorrect."));
            }
            if (newPassword.length < 6) {
                return reject(new Error("Le nouveau mot de passe doit contenir au moins 6 caractères."));
            }
            
            // Here you would hash the newPassword and update it in the database.
            console.log("Admin password change successful (simulated).");
            resolve({ success: true, message: "Mot de passe changé avec succès !" });
        }, 1000);
    });
};


export const fetchBeneficiaries = async (): Promise<Beneficiary[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockBeneficiaries]), 500));
};

export const addBeneficiary = async (data: Omit<Beneficiary, 'id' | 'secretToken'>): Promise<Beneficiary> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newBeneficiary: Beneficiary = {
                ...data,
                id: `benef_${Date.now()}`,
                secretToken: `SB-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            };
            mockBeneficiaries.push(newBeneficiary);
            resolve(newBeneficiary);
        }, 1000);
    });
};

export const deleteBeneficiary = async (id: string): Promise<void> => {
     return new Promise(resolve => {
        setTimeout(() => {
            mockBeneficiaries = mockBeneficiaries.filter(b => b.id !== id);
            resolve();
        }, 500);
    });
};

export const sendToken = async (beneficiaryId: string, method: 'sms' | 'email'): Promise<void> => {
    const beneficiary = mockBeneficiaries.find(b => b.id === beneficiaryId);
    if (!beneficiary) throw new Error("Beneficiary not found");

    console.log(`Simulating sending token ${beneficiary.secretToken} to ${beneficiary.firstName} via ${method}.`);
    return new Promise(resolve => setTimeout(resolve, 1500));
};


export const verifySecretAccess = async (attempt: UnlockAttempt, beneficiaryId: string): Promise<{ success: boolean; message:string; }> => {
    console.log(`Verifying secret access for beneficiary ${beneficiaryId}`);
     return new Promise(resolve => {
        setTimeout(() => {
            const beneficiary = mockBeneficiaries.find(b => b.id === beneficiaryId);
            if (!beneficiary) {
                return resolve({ success: false, message: "Utilisateur bénéficiaire non trouvé." });
            }

            // In a real app, this would be a more robust check, possibly case-insensitive and trimmed.
            const isNameMatch = (beneficiary.firstName + ' ' + beneficiary.lastName).toLowerCase().trim() === attempt.fullName.toLowerCase().trim();
            const isIdMatch = beneficiary.idNumber === attempt.idNumber;
            const isTokenMatch = beneficiary.secretToken === attempt.secretToken;

            if (isNameMatch && isIdMatch && isTokenMatch) {
                resolve({ success: true, message: "Vérification réussie. Accès au coffre-fort accordé." });
            } else {
                let error = "Les informations de vérification sont incorrectes. ";
                if (!isNameMatch) error += `Le nom ne correspond pas. (Attendu: ${beneficiary.firstName} ${beneficiary.lastName})`;
                if (!isIdMatch) error += "Le numéro d'ID ne correspond pas. ";
                if (!isTokenMatch) error += "Le jeton ne correspond pas. ";
                resolve({ success: false, message: error });
            }
        }, 1500);
    });
};

// --- NEW: Guardian Management Functions ---

export const fetchGuardians = async (): Promise<Guardian[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockGuardians]), 500));
};

export const addGuardian = async (data: { name: string; email: string }): Promise<Guardian> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newGuardian: Guardian = {
                id: `g_${Date.now()}`,
                name: data.name,
                email: data.email,
            };
            mockGuardians.push(newGuardian);
            resolve(newGuardian);
        }, 1000);
    });
};

export const updateGuardian = async (guardianId: string, data: { name: string; email: string }): Promise<Guardian> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockGuardians.findIndex(g => g.id === guardianId);
            if (index !== -1) {
                mockGuardians[index] = { ...mockGuardians[index], ...data };
                resolve(mockGuardians[index]);
            } else {
                reject(new Error("Guardian not found"));
            }
        }, 1000);
    });
};

export const deleteGuardian = async (id: string): Promise<void> => {
     return new Promise(resolve => {
        setTimeout(() => {
            mockGuardians = mockGuardians.filter(g => g.id !== id);
            resolve();
        }, 500);
    });
};

// --- NEW: Legal Document Management ---
export const fetchLegalDocuments = async (): Promise<LegalDocuments> => {
    return new Promise(resolve => setTimeout(() => resolve({ ...mockLegalDocuments }), 500));
};

export const uploadLegalDocument = async (docType: LegalDocumentType, file: File): Promise<{ fileName: string, url: string }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // In a real app, this would upload to a secure storage and return a permanent URL.
            // For this mock, we use a temporary blob URL.
            const url = URL.createObjectURL(file);
            const newDoc = { fileName: file.name, url };
            mockLegalDocuments[docType] = newDoc;
            console.log(`Uploaded ${file.name} for ${docType}. URL: ${url}`);
            resolve(newDoc);
        }, 1500);
    });
};