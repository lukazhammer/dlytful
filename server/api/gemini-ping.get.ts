import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnv } from '../lib/env';

export default defineEventHandler(async (_event) => {
    // Will throw if missing, handled by H3 error handler typically or we wrap
    const apiKey = getEnv('GEMINI_API_KEY');

    let modelName = 'gemini-1.5-flash-latest'; // Default fallback

    try {
        // 1. Try to discover 'flash' model
        try {
            const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (listResponse.ok) {
                const data = await listResponse.json();
                const available = (data.models || []) as Array<{ name: string, supportedGenerationMethods: string[] }>;

                // Find first model that supports generateContent and has 'flash'
                const flashModel = available.find(m =>
                    m.supportedGenerationMethods.includes('generateContent') &&
                    m.name.toLowerCase().includes('flash')
                );

                if (flashModel) {
                    modelName = flashModel.name.replace('models/', '');
                } else {
                    // Fallback search for any 1.5 model
                    const any15 = available.find(m =>
                        m.supportedGenerationMethods.includes('generateContent') &&
                        m.name.includes('1.5')
                    );
                    if (any15) modelName = any15.name.replace('models/', '');
                }
            }
        } catch {
            // Ignore listing errors, proceed with fallback
            console.warn('Gemini model listing failed, using fallback:', modelName);
        }

        // 2. Ping with selected model
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent('ping');
        const text = result.response.text();

        return {
            ok: true,
            modelUsed: modelName,
            text: text.slice(0, 50).trim()
        };
    } catch (e: unknown) {
        const error = e as { message?: string };
        const message = error.message || String(e);

        // Ultimate fallback check
        if (message?.includes('404') && modelName.includes('flash')) {
            return { ok: false, error: `Model ${modelName} not found. Try gemini-1.5-pro-latest?`, originalError: message };
        }
        return {
            ok: false,
            error: message
        };
    }
});
