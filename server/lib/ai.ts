import { GoogleGenerativeAI } from '@google/generative-ai';

// Centralised AI configuration
export const MODEL_FLASH = 'gemini-1.5-flash';

export async function generateStructuredJSON(prompt: string, schemaDescription: string) {
    const config = useRuntimeConfig();
    const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY; // Allow both for robustness

    if (!apiKey) {
        console.warn('Gemini API Key missing');
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: MODEL_FLASH,
            generationConfig: { responseMimeType: "application/json" }
        });

        const fullPrompt = `${prompt}\n\nReturn strict JSON matching this structure: ${schemaDescription}`;

        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();
        return JSON.parse(text);
    } catch (error) {
        console.error('Gemini JSON Generation Error:', error);
        return null;
    }
}
