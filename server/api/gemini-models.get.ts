import { defineEventHandler } from 'h3';

export default defineEventHandler(async (_event) => {
    const config = useRuntimeConfig();
    const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return { ok: false, error: 'Missing Gemini API Key' };
    }

    try {
        // Use REST API to list models since SDK is primarily for inference
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            throw new Error(`Failed to list models: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const models = (data.models || []).map((m: { name: string }) => m.name.replace('models/', ''));

        return {
            ok: true,
            models
        };
    } catch (e: unknown) {
        return {
            ok: false,
            error: e instanceof Error ? e.message : String(e)
        };
    }
});
