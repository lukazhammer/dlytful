import { defineEventHandler } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    interface HealthReport {
        env: Record<string, string>;
        supabase: string;
        gemini: string;
        availableEnvKeys?: string[];
    }

    const report: HealthReport = {
        env: {},
        supabase: 'pending',
        gemini: 'pending'
    };

    // 1. Check Env Vars
    const requiredVars = ['NUXT_PUBLIC_SUPABASE_URL', 'NUXT_PUBLIC_SUPABASE_ANON_KEY', 'GEMINI_API_KEY'];
    requiredVars.forEach(v => {
        report.env[v] = process.env[v] ? 'Set' : 'Missing';
    });

    // 2. Check Supabase
    try {
        const client = await serverSupabaseClient(event);
        const { error } = await client.from('waitlist').select('count', { count: 'exact', head: true });
        if (error) throw error;
        report.supabase = 'Connected';
    } catch (e: unknown) {
        report.supabase = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }

    // 3. Check Gemini
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Say hello');
        if (result && result.response) {
            report.gemini = 'Connected';
        } else {
            report.gemini = 'No response';
        }
    } catch (e: unknown) {
        report.gemini = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }

    // Debugging: List available keys (masked)
    report.availableEnvKeys = Object.keys(process.env).filter(k => k.startsWith('SUPABASE') || k.startsWith('GEMINI'));

    return report;
});
