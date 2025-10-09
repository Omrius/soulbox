// services/aiService.ts
import { TrainingData } from '../types';

// This is the single, secure endpoint for all AI interactions.
const SECURE_API_ENDPOINT = '/api/chat';

/**
 * Generates an inspirational message by calling the secure backend function.
 * @param topic The theme for the message.
 * @returns The AI-generated message.
 */
export const generateInspiration = async (topic: string): Promise<string> => {
    try {
        const response = await fetch(SECURE_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                promptType: 'inspiration',
                topic: topic,
                message: '' // Not needed for inspiration type, but good to have a consistent shape
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to generate inspiration via backend.");
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error in generateInspiration:", error);
        return "Je me souviens de... (Erreur du serveur, réponse par défaut)";
    }
};


/**
 * Sends a chat message to the clone via the secure backend function.
 * @param message The user's message.
 * @param context The training data for the clone.
 * @param cloneId The unique ID of the clone being interacted with.
 * @returns The clone's response.
 */
export const chatWithClone = async (message: string, context: TrainingData, cloneId: string): Promise<string> => {
    try {
        const response = await fetch(SECURE_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                promptType: 'chat',
                message: message,
                context: context,
                cloneId: cloneId
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to chat with clone via backend.");
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error in chatWithClone:", error);
        return "Je ne suis pas certain de savoir quoi répondre à ça. (Erreur du serveur, réponse par défaut)";
    }
};
