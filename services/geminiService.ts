import { GoogleGenAI } from "@google/genai";
import { SealedItem, TrainingData, TrainingDocument, PublicCloneInfo } from '../types.ts';
import { uploadFileToDrive } from './googleDriveService.ts';

// Per guidelines, initialize the SDK and assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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
export const generateInspiration = async (topic: string): Promise<string> => {
     if (!process.env.API_KEY) {
        console.warn("API_KEY not set. Returning mock data for generateInspiration.");
        return new Promise(resolve => setTimeout(() => resolve(`Je me souviens de la fois où nous avons parlé de "${topic}". C'était un moment précieux. (Réponse simulée car la clé API est manquante)`), 300));
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Génère un court message inspirant ou une lettre sur le thème de "${topic}". Le message doit être sincère, touchant et adapté pour être laissé en héritage à des proches. Écris en français.`,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error in generateInspiration:", error);
        return `Je me souviens de... (Erreur de l'IA, réponse par défaut)`;
    }
};

export const fetchSealedItems = async (): Promise<SealedItem[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockSealedItems]), 500));
};

export const createSealedItem = async (itemData: any): Promise<SealedItem> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newItem: SealedItem = {
                id: `item_${Date.now()}`,
                title: itemData.title,
                description: itemData.payload, // Assuming payload is the description for this mock
                createdAt: new Date().toISOString(),
                status: 'sealed',
                shards_required: itemData.shards_required,
                guardians: itemData.guardians.map((g: any, i: number) => ({...g, id: g.id, name: `Gardien ${i+1}`, email: `gardien${i+1}@example.com`})), // Mock names/emails
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
     return new Promise(resolve => {
        setTimeout(() => {
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

const buildSystemInstruction = (context: TrainingData): string => {
    // Synthesize personality from quiz if available
    const quizSummary = context.personalityQuiz && context.personalityQuiz.every(q => q.answer)
        ? `Le clone a répondu à un quiz sur sa personnalité. Voici un résumé de ses réponses, qui sont la source la plus fiable de sa personnalité :\n` +
          context.personalityQuiz.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')
        : 'Aucune réponse au quiz de personnalité n\'a été fournie.';

    return `
        Tu es un clone numérique. Ton but est d'incarner la personnalité de la personne décrite ci-dessous.
        
        --- Personnalité (basé sur un quiz) ---
        ${quizSummary}

        --- Traits Généraux (fournis par l'utilisateur, moins prioritaires que le quiz) ---
        Personnalité: ${context.personality}
        Valeurs: ${context.values}
        Humour: ${context.humor}
        
        --- Style de communication ---
        - Salutations: "${context.greeting}"
        - Pour réconforter: "${context.comfortStyle}"
        
        --- Connaissances spécifiques et souvenirs (tu dois t'y référer comme si c'étaient les tiens) ---
        ${context.customKnowledge.map(k => `- ${k.text}`).join('\n')}
        
        Réponds aux questions en te basant UNIQUEMENT sur cette personnalité et ces connaissances. La source principale de vérité est le quiz de personnalité. Si tu ne sais pas, dis-le gentiment, à la manière de la personne. Ne sors jamais de ton rôle. Parle en français.
    `;
}

export const chatWithClone = async (message: string, context: TrainingData): Promise<string> => {
    if (!process.env.API_KEY) {
        console.warn("API_KEY not set. Returning mock data for chatWithClone.");
        return new Promise(resolve => setTimeout(() => resolve(`C'est une bonne question. Laissez-moi y réfléchir. (Réponse simulée car la clé API est manquante)`), 500));
    }

    const systemInstruction = buildSystemInstruction(context);
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error in chatWithClone:", error);
        return "Je ne suis pas certain de savoir quoi répondre à ça. (Erreur de l'IA, réponse par défaut)";
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
    // Correctly fetch the training data for the specific cloneId.
    const trainingContext = await fetchTrainingData(cloneId);
    return chatWithClone(message, trainingContext);
};