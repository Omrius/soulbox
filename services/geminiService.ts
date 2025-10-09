import { SealedItem, TrainingData, TrainingDocument, PublicCloneInfo, Guardian } from '../types';
import { uploadFileToDrive } from './googleDriveService';
import { fetchGuardians } from './authService';

// NOTE: All direct calls to the GoogleGenAI API have been removed from this file
// to prevent exposing the secret API key on the client-side.
// AI interactions are now handled securely via `services/aiService.ts` which calls a serverless function.

// --- Mock Data ---

let mockSealedItems: SealedItem[] = [
    {
        id: 'item_1',
        title: "Instructions pour l'héritage",
        description: "Contient des informations importantes sur la distribution de mes biens numériques et physiques. Ceci est un test.",
        createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
        status: 'sealed',
        shards_required: 2,
        guardians: [
            { id: 'g_1', name: 'Alice Dupont', email: 'alice.d@example.com' },
            { id: 'g_2', name: 'Bob Martin', email: 'bob.m@example.com' },
            { id: 'g_3', name: 'Charlie Durand', email: 'charlie.d@example.com' },
        ],
        metadata: { type: 'message' }
    },
];

const defaultQuizQuestions = [
    { id: 1, question: "Si vous pouviez donner un seul conseil à votre 'moi' de 20 ans, quel serait-il ?", answer: "" },
    { id: 2, question: "Quelle est la chose la plus folle ou la plus spontanée que vous ayez faite par amour ou amitié ?", answer: "" },
    { id: 3, question: "Décrivez un échec qui vous a finalement appris votre plus grande leçon.", answer: "" },
    { id: 4, question: "Face à un dilemme moral difficile, qu'est-ce qui guide principalement votre décision ?", answer: "" },
    { id: 5, question: "Quel est le plus beau cadeau que vous ayez jamais reçu, et pourquoi n'était-il pas forcément matériel ?", answer: "" },
    { id: 6, question: "Racontez un souvenir d'enfance qui définit encore aujourd'hui la personne que vous êtes.", answer: "" },
    { id: 7, question: "Quelle est la chose pour laquelle vous aimeriez que l'on se souvienne de vous ?", answer: "" },
    { id: 8, question: "Comment décririez-vous votre sens de l'humour ? Donnez un exemple de blague qui vous fait toujours rire.", answer: "" },
    { id: 9, question: "Quelle est la tradition familiale la plus importante que vous voudriez transmettre ?", answer: "" },
    { id: 10, question: "S'il y avait une 'bande originale' de votre vie, quelle chanson en serait le titre principal et pourquoi ?", answer: "" }
];

const defaultTrainingData: TrainingData = {
    personality: 'Bienveillant et à l\'écoute',
    values: 'Respect, honnêteté',
    humor: 'Simple et léger',
    greeting: 'Bonjour, comment puis-je vous aider ?',
    comfortStyle: 'Je suis là pour vous écouter.',
    customKnowledge: [],
    personalityQuiz: JSON.parse(JSON.stringify(defaultQuizQuestions))
};

// Simulate a database table for training data, keyed by user ID.
const trainingDatabase: { [key: string]: TrainingData } = {
    'clone_user_123': {
        personality: 'Optimiste et bienveillant',
        values: 'Famille, honnêteté, curiosité',
        humor: 'Pince-sans-rire, jeux de mots',
        greeting: 'Salut ! Comment ça va aujourd\'hui ?',
        comfortStyle: 'Je suis là pour toi. Prends ton temps, respire. On va trouver une solution ensemble.',
        customKnowledge: [
            { id: 1, text: 'Mon plus grand regret est de ne pas avoir voyagé plus en Asie.' },
            { id: 2, text: 'Le souvenir le plus heureux est la naissance de ma fille, Alice.' }
        ],
        personalityQuiz: JSON.parse(JSON.stringify(defaultQuizQuestions))
    },
    // Add default data for the Google user to have a distinct starting point
    'google_user_789': JSON.parse(JSON.stringify(defaultTrainingData)),
};


let mockTrainingDocuments: TrainingDocument[] = [
    { id: 'doc_1', name: 'journal_2022.pdf', uploadedAt: new Date().toISOString(), status: 'ready' },
    { id: 'doc_2', name: 'notes_philosophiques.txt', uploadedAt: new Date().toISOString(), status: 'processing' },
];

const mockPublicClone: PublicCloneInfo = {
    id: 'user_123',
    name: 'Jean Dupont',
    welcomeMessage: 'Bonjour, je suis le clone numérique de Jean. Je suis là pour partager ses souvenirs et ses pensées. N\'hésitez pas à me poser vos questions.'
};
const MOCK_PHONE_NUMBER = '0612345678';


// --- API Functions ---

// Coffre-Fort (Digital Vault)
export const fetchSealedItems = async (): Promise<SealedItem[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockSealedItems]), 500));
};

export const createSealedItem = async (itemData: any): Promise<SealedItem> => {
    const allGuardians = await fetchGuardians();
    return new Promise(resolve => {
        setTimeout(() => {
            const selectedGuardians = itemData.guardians
                .map((g: { id: string }) => allGuardians.find(ag => ag.id === g.id))
                .filter((g: Guardian | undefined): g is Guardian => g !== undefined);

            const newItem: SealedItem = {
                id: `item_${Date.now()}`,
                title: itemData.title,
                description: itemData.payload, // Assuming payload is the description for this mock
                createdAt: new Date().toISOString(),
                status: 'sealed',
                shards_required: itemData.shards_required,
                guardians: selectedGuardians,
                metadata: { type: itemData.payload_type === 'text' ? 'message' : 'file' }
            };
            mockSealedItems.push(newItem);
            resolve(newItem);
        }, 500);
    });
};


// Clone Vocal (Voice Clone)
export const uploadVoiceSample = async (audioBlob: Blob): Promise<void> => {
    console.log("Uploading voice sample:", audioBlob);
    // In a real app, this would use fetch() to send the blob to a backend service
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.1) { // 90% success rate
                resolve();
            } else {
                reject(new Error("Simulated upload failure"));
            }
        }, 1500);
    });
};

// Centre d'Entraînement (Training Center)
export const fetchTrainingData = async (userId: string): Promise<TrainingData> => {
    return new Promise(resolve => setTimeout(() => {
        // Ensure there's always some data to return, defaulting for robustness
        const userData = trainingDatabase[userId] || defaultTrainingData;
        resolve(JSON.parse(JSON.stringify(userData))); // Return a copy
    }, 500));
};

export const saveTrainingData = async (userId: string, data: TrainingData): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            trainingDatabase[userId] = data;
            console.log(`Training data for user ${userId} saved.`);
            resolve();
        }, 1000);
    });
};

export const fetchTrainingDocuments = async(): Promise<TrainingDocument[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockTrainingDocuments]), 500));
};

export const uploadTrainingDocument = async (file: File): Promise<TrainingDocument> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate a failure rate
            if (Math.random() > 0.3) { // 70% success rate
                const newDoc: TrainingDocument = {
                    id: `doc_${Date.now()}`,
                    name: file.name,
                    uploadedAt: new Date().toISOString(),
                    status: 'ready'
                };
                mockTrainingDocuments.push(newDoc);
                // Simulate processing time for other files
                setTimeout(() => {
                    mockTrainingDocuments = mockTrainingDocuments.map(d => d.status === 'processing' ? {...d, status: 'ready'} : d);
                }, 3000);
                resolve(newDoc);
            } else {
                reject(new Error("Échec de téléversement simulé. Veuillez réessayer."));
            }
        }, 2000);
    });
};

export const deleteTrainingDocument = async (docId: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            mockTrainingDocuments = mockTrainingDocuments.filter(d => d.id !== docId);
            resolve();
        }, 500);
    });
};

export const saveTrainingToDrive = async (data: TrainingData): Promise<void> => {
    console.log("Saving training data to Google Drive...");
    try {
        const jsonData = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([jsonData], { type: 'application/json' });
        
        const result = await uploadFileToDrive(dataBlob, `soulbox_training_backup_${new Date().toISOString()}.json`);
        
        console.log("Successfully saved training data to Google Drive.", result);
    } catch (error) {
        console.error("Failed to save training data to Google Drive:", error);
        // In a real app, you might want to show a notification to the user
        throw error;
    }
};

// --- Public Chat Portal ---
export const findCloneByPhoneNumber = async (phone: string): Promise<PublicCloneInfo | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (phone === MOCK_PHONE_NUMBER) {
                resolve(mockPublicClone);
            } else {
                resolve(null);
            }
        }, 1000);
    });
};

export const chatWithPublicClone = async (message: string, cloneId: string): Promise<string> => {
    console.log(`Public chat with cloneId: ${cloneId}`);
    // This function is now illustrative. The actual call is made through aiService.
    // In a real app, you might fetch context here before passing it to the chat handler.
    const trainingContext = await fetchTrainingData(cloneId);
    // The actual API call is now abstracted and secure. This function might not be needed
    // if the component calls aiService directly with the context.
    return "This is a mock response. The actual chat is handled by aiService.";
};
