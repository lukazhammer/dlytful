import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateStructuredJSON = async (prompt: string, schemaDescription: string) => {
    const config = useRuntimeConfig();
    if (!config.geminiApiKey) {
        console.warn('Gemini API Key missing');
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(config.geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

        const fullPrompt = `${prompt}\n\nReturn strict JSON matching this structure: ${schemaDescription}`;

        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();
        return JSON.parse(text);
    } catch (error) {
        console.error('Gemini JSON Generation Error:', error);
        return null;
    }
}
