import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnv } from '../../lib/env';

export default defineEventHandler(async (event) => {
    try {
        const apiKey = getEnv('GEMINI_API_KEY');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const nonce = Math.floor(Math.random() * 9000) + 1000;
        const prompt = `Return exactly: PONG-${nonce}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const rand = text.replace('PONG-', '');

        return {
            ok: true,
            model: 'gemini-1.5-flash',
            rand,
            text
        };
    } catch (e: any) {
        return {
            ok: false,
            error: e.message
        };
    }
});
