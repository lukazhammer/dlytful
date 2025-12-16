import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnv } from '../lib/env';
import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/database.types';
import type { BrandSpec } from '../../lib/brand/schema';
import { mixToneSheets } from '../../lib/brand/tone/mixToneSheets';
import type { ToneStyleSheet } from '../../lib/brand/tone/schema';
import fs from 'node:fs';
import path from 'node:path';

// Load Tone Fixtures (Cached)
const tonesPath = path.resolve(process.cwd(), 'tests/tone_style_sheets.v1.json');
const allTones: ToneStyleSheet[] = JSON.parse(fs.readFileSync(tonesPath, 'utf-8'));

// Helper: Word limit truncation
const limitWords = (s: string, n: number) => s.trim().split(/\s+/).slice(0, n).join(" ");

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { brandSpec, specHash } = body as { brandSpec: BrandSpec, specHash: string };

    if (!brandSpec || !specHash) {
        throw createError({ statusCode: 400, message: 'Missing brandSpec or specHash' });
    }

    const client = await serverSupabaseClient<Database>(event);

    // 1. Check Cache
    // Cast to any because new table copy_cache is not yet in Database types
    const { data: cached } = await client
        .from('copy_cache' as any)
        .select('assets')
        .eq('spec_hash', specHash)
        .maybeSingle();

    if (cached) {
        return { assets: cached.assets, cached: true };
    }
    // 2. Generate with Gemini
    const apiKey = getEnv('GEMINI_API_KEY');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-latest',
        generationConfig: { responseMimeType: "application/json" }
    });

    // 3. Resolve Tone Mix
    // For now, map Archetype to a primary tone, or default to Creator
    // Ideally, UI sends weights. Here we derive strictness from Archetype.
    let baseId = 'creator';
    if (brandSpec.archetypePrimary === 'The Sage') baseId = 'sage';
    if (brandSpec.archetypePrimary === 'The Jester') baseId = 'jester';

    const baseTone = allTones.find(t => t.id === baseId) || allTones[0];
    const mixedSpec = mixToneSheets([baseTone], [1.0]);

    const prompt = `
You are a world-class copywriter and brand strategist.
Create a set of deployable copy assets for the following brand.

BRAND CONTEXT:
Product: ${brandSpec.productName}
Category: ${brandSpec.category}
Audience: ${brandSpec.audience}
Outcome: ${brandSpec.outcome}
Tone: ${brandSpec.voice.soundsLike.join(', ')} (Never ${brandSpec.voice.neverLike.join(', ')})
Archetype: ${brandSpec.archetypePrimary}

STYLE INSTRUCTIONS:
${mixedSpec.instructions.map(i => `- ${i}`).join('\n')}
Banned Words: ${mixedSpec.lexicon.banned.join(', ')}
Preferred Words: ${mixedSpec.lexicon.preferred.join(', ')}

REQUIREMENTS:
Return a JSON object with strictly these keys and constraints:
1. oneLiner: (String, max 18 words) A punchy description.
2. heroHeadlines: (Array of 3 strings, max 6 words each) Big, bold, variations (Benefit, Identity, Action).
3. subheadlines: (Array of 3 strings, max 18 words each) supporting the heroes.
4. benefitBullets: (Array of 5 strings, max 10 words each) punchy checks.
5. objectionHandlers: (Array of 2 objects {objection: string, answer: string})
   - First objection must be "Why not just use ChatGPT?" (Answer: "ChatGPT drifts..." or specific to product).
   - Second objection: most likely constraint.
6. pitch30s: (String, max 60 words) Elevator pitch.
7. notForYouIf: (Array of 3 strings, max 10 words each) disqualifiers.
8. ctaOptions: (Array of 3 strings, max 5 words each) button text.

Output valid JSON only.
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const json = JSON.parse(text);

        // 3. Validate & Sanitize (Truncate max words)
        const assets = {
            oneLiner: limitWords(String(json.oneLiner || ""), 18),
            heroHeadlines: (Array.isArray(json.heroHeadlines) ? json.heroHeadlines : []).slice(0, 3).map((s: string) => limitWords(String(s), 6)),
            subheadlines: (Array.isArray(json.subheadlines) ? json.subheadlines : []).slice(0, 3).map((s: string) => limitWords(String(s), 18)),
            benefitBullets: (Array.isArray(json.benefitBullets) ? json.benefitBullets : []).slice(0, 5).map((s: string) => limitWords(String(s), 10)),
            objectionHandlers: (Array.isArray(json.objectionHandlers) ? json.objectionHandlers : []).slice(0, 2).map((x: any) => ({
                objection: limitWords(String(x.objection || ""), 10),
                answer: limitWords(String(x.answer || ""), 22)
            })),
            pitch30s: limitWords(String(json.pitch30s || ""), 60),
            notForYouIf: (Array.isArray(json.notForYouIf) ? json.notForYouIf : []).slice(0, 3).map((s: string) => limitWords(String(s), 10)),
            ctaOptions: (Array.isArray(json.ctaOptions) ? json.ctaOptions : []).slice(0, 3).map((s: string) => limitWords(String(s), 5)),
        };
        // 4. Cache
        // We use 'upsert' to handle race conditions if two reqs come in at once
        await client.from('copy_cache' as any).upsert({
            spec_hash: specHash,
            assets: assets as any, // Cast for JSONB
            model_used: 'gemini-1.5-flash-latest'
        }) as any;

        return { assets, cached: false };

    } catch (err: any) {
        console.error('LLM Copy Gen Failed:', err);
        throw createError({ statusCode: 500, message: 'Failed to generate copy' });
    }
});
