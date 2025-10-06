// services/elevenLabsService.ts

/**
 * =============================================================================
 * IMPORTANT SECURITY WARNING
 * =============================================================================
 * This file now uses a REAL secret API key to interact with the ElevenLabs API.
 * This is done for DEMONSTRATION PURPOSES ONLY to make the prototype functional.
 *
 * In a production application, you MUST NEVER expose your secret key (`sk_...`)
 * in the frontend JavaScript code.
 *
 * The correct production architecture is:
 * 1. Frontend (this app) calls YOUR backend server (e.g., your FastAPI server).
 * 2. YOUR backend server securely stores and uses the secret key to call the
 *    ElevenLabs API.
 * 3. YOUR backend server returns the result (e.g., audio file) to the frontend.
 *
 * Exposing the key in the frontend allows anyone to steal it and use your
 * ElevenLabs account, potentially incurring costs.
 * =============================================================================
 */
const ELEVENLABS_API_KEY = "sk_65a0b4500f8279d1ad27fd3b996867354a9b1f1498b2e30a";
const ADD_VOICE_URL = "https://api.elevenlabs.io/v1/voices/add";
const TTS_URL_TEMPLATE = (voiceId: string) => `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;


/**
 * Adds a new voice clone to ElevenLabs using recorded audio samples.
 * @param audioBlobs - An array of audio samples recorded by the user.
 * @returns A promise that resolves with the new voice ID from the API.
 */
export const addVoiceClone = async (audioBlobs: Blob[]): Promise<string> => {
    console.log(`Starting real voice clone creation with ${audioBlobs.length} samples.`);

    if (!ELEVENLABS_API_KEY) {
        throw new Error("ElevenLabs API key is not configured.");
    }
    
    const formData = new FormData();
    formData.append('name', `SOULBOX Clone - ${new Date().toISOString()}`);
    
    audioBlobs.forEach((blob, index) => {
        // The API expects the file to have a proper name and extension.
        formData.append(`files`, blob, `sample_${index + 1}.webm`);
    });

    try {
        const response = await fetch(ADD_VOICE_URL, {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("ElevenLabs API Error:", data);
            throw new Error(data.detail?.message || "Failed to create voice clone.");
        }

        const voiceId = data.voice_id;
        if (!voiceId) {
            throw new Error("Voice ID was not returned from the API.");
        }

        console.log(`Successfully created voice clone with ID: ${voiceId}`);
        return voiceId;

    } catch (error) {
        console.error("Error in addVoiceClone:", error);
        throw error; // Re-throw the error to be caught by the component
    }
};

/**
 * Generates speech from text using a specific voice ID from ElevenLabs.
 * @param text - The text to synthesize.
 * @param voiceId - The ID of the voice clone to use.
 * @returns A promise that resolves with a local URL to the generated audio blob.
 */
export const textToSpeech = async (text: string, voiceId: string): Promise<string> => {
    console.log(`Requesting text-to-speech for voice ID: ${voiceId}`);

    if (!ELEVENLABS_API_KEY) {
        throw new Error("Cannot generate speech: ElevenLabs API key is not configured.");
    }
    
    if (!voiceId) {
        throw new Error("Cannot generate speech: Voice ID is missing.");
    }

    try {
        const response = await fetch(TTS_URL_TEMPLATE(voiceId), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY,
                'accept': 'audio/mpeg',
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2", // Or another suitable model
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            }),
        });

        if (!response.ok) {
             const errorData = await response.json();
             console.error("ElevenLabs TTS API Error:", errorData);
             throw new Error(errorData.detail?.message || "Failed to generate speech.");
        }

        // The response is the audio file itself (as a blob)
        const audioBlob = await response.blob();
        
        // Create a local URL for the browser to play the audio
        const audioUrl = URL.createObjectURL(audioBlob);
        
        console.log("Successfully generated speech audio.");
        return audioUrl;
        
    } catch (error) {
        console.error("Error in textToSpeech:", error);
        throw error;
    }
};
