// functions/chat.ts

// Define a minimal interface for the incoming request body.
interface ChatRequestBody {
  message: string;
  context?: any; // The training data context
  promptType: 'chat' | 'inspiration';
  topic?: string;
  cloneId?: string; // Add cloneId to the interface
}

// A simple handler function for Vercel, Netlify, etc.
export default async (req: Request): Promise<Response> => {
  // Ensure this is a POST request
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { message, context, promptType, topic, cloneId } = (await req.json()) as ChatRequestBody;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY_SECRET; // Use the new secure key name

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured on the server.");
    }
    
    // Log the cloneId for debugging or future use
    if (cloneId) {
      console.log(`Processing request for cloneId: ${cloneId}`);
    }

    let systemPrompt = '';
    let userMessage = message;

    if (promptType === 'inspiration' && topic) {
        systemPrompt = "You are an AI assistant specialized in writing heartfelt, sincere, and touching messages suitable for being left as a legacy for loved ones. Write in French.";
        userMessage = `Generate a short, inspiring message or letter on the theme of "${topic}".`;
    } else {
        // Build the system prompt for the chat clone
        const quizSummary = context?.personalityQuiz?.every((q: any) => q.answer)
            ? `The clone answered a personality quiz. Here is a summary of its answers, which are the most reliable source of its personality:\n` +
              context.personalityQuiz.map((q: any) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')
            : 'No personality quiz answers were provided.';

        systemPrompt = `
            You are a digital clone. Your purpose is to embody the personality of the person described below.
            
            --- Personality (based on a quiz) ---
            ${quizSummary}

            --- General Traits (provided by the user, less priority than the quiz) ---
            Personality: ${context.personality}
            Values: ${context.values}
            Humor: ${context.humor}
            
            --- Communication Style ---
            - Greetings: "${context.greeting}"
            - To comfort: "${context.comfortStyle}"
            
            --- Specific Knowledge and Memories (you must refer to these as your own) ---
            ${context.customKnowledge.map((k: any) => `- ${k.text}`).join('\n')}
            
            Answer questions based ONLY on this personality and knowledge. The primary source of truth is the personality quiz. If you don't know, say so kindly, in the person's manner. Never break character. Speak in French.
        `;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(errorData.error?.message || "Failed to get response from OpenAI.");
    }

    const data = await response.json();
    const textResponse = data.choices[0]?.message?.content?.trim() || "Je ne suis pas certain de savoir quoi répondre à ça.";

    return new Response(JSON.stringify({ response: textResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown internal error occurred.";
    console.error("Handler Error:", error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};