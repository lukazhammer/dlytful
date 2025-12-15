import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { getEnv } from '../../lib/env';
import { inferProductName, isGeneric } from '../../../lib/brand/inferName';
import { CURATED_PALETTES } from '../../../lib/brand/palette';
import { createHash } from 'node:crypto';

// --- DATA ---
const VALID_ARCHETYPES = [
    'The Innocent', 'The Sage', 'The Explorer', 'The Outlaw', 'The Magician', 'The Hero',
    'The Lover', 'The Jester', 'The Caregiver', 'The Ruler', 'The Creator', 'The Everyman'
];

// 30 Tone Tags for variety
const TONE_TAGS = [
    "Witty", "Direct", "Warm", "Empathetic", "Bold", "Technical", "Formal", "Casual",
    "Playful", "Sincere", "Authoritative", "Calm", "Dynamic", "Elegant", "Friendly",
    "Hyped", "Minimal", "Nostalgic", "Professional", "Quirky", "Rebellious", "Rustic",
    "Serious", "Soft", "Sophisticated", "Spiritual", "Urban", "Whimsical", "Youthful", "Zen"
];

// --- HELPERS ---

function extractFeatures(text: string) {
    if (!text) return { features: [] };
    // Simple heuristic: split by comma or newline
    return { features: text.split(/,|\n/).map(s => s.trim()).filter(Boolean) };
}

function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function pickRandom<T>(list: T[], seed: number): T {
    const idx = Math.floor(seededRandom(seed) * list.length);
    return list[idx];
}

function pickRandomUnique<T>(list: T[], count: number, seed: number): T[] {
    const result: T[] = [];
    const clone = [...list];
    for (let i = 0; i < count; i++) {
        if (clone.length === 0) break;
        const idx = Math.floor(seededRandom(seed + i) * clone.length);
        result.push(clone.splice(idx, 1)[0]);
    }
    return result;
}

function stableStringHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// --- SCHEMA ---
const BodySchema = z.object({
    q1_core_what: z.string().min(1),
    q2_moment: z.string().optional(),
    q3_url_or_desc: z.string().optional(),
    product_type: z.string().optional(),
    remix: z.boolean().optional(),
    remix_nonce: z.string().optional() // Client provided source of entropy
});

function extractJsonObject(text: string): any {
    try {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
    } catch (e) {
        return null; // Silent fail
    }
    return null;
}


// --- HANDLER ---

export default defineEventHandler(async (event) => {
    const bodyResult = BodySchema.safeParse(await readBody(event));
    if (!bodyResult.success) {
        throw createError({ statusCode: 400, statusMessage: "Invalid Inputs" });
    }
    const { q1_core_what, q2_moment, q3_url_or_desc, product_type, remix, remix_nonce } = bodyResult.data;

    // 1. Name Inference
    // --------------------------------------------------------------------------
    const inferred = inferProductName({
        q1: q1_core_what,
        q2: q2_moment,
        q3: q3_url_or_desc
    });

    // Naive heuristic check
    let productName = inferred.confidence !== 'low' ? inferred.name : "Your Product";
    // Fallback logic remains simple for now as per requirements.

    const category = product_type || "Product"; // Simple fallback

    // 2. Random Assignment (Seeded)
    // --------------------------------------------------------------------------
    // Seed depends on Inputs + Nonce. 
    // If nonce changes, seed changes -> Assignments change.
    const entropySource = `${q1_core_what}${q2_moment}${q3_url_or_desc}${product_type}${remix_nonce}`;
    const seed = stableStringHash(entropySource);

    const archetype = pickRandom(VALID_ARCHETYPES, seed);
    let palette = pickRandom(CURATED_PALETTES, seed + 1); // Mutated below if Visuals override
    const toneTags = pickRandomUnique(TONE_TAGS, 3, seed + 2);

    // 3. Gemini Vibe Generation (High Temp + JSON)
    // --------------------------------------------------------------------------
    const apiKey = getEnv('GEMINI_API_KEY');
    const genAI = new GoogleGenerativeAI(apiKey);

    // Model Waterfall
    const MODELS_TO_TRY = ['gemini-2.5-latest', 'gemini-2.0-flash-exp', 'gemini-1.5-flash'];

    // Default Fallbacks
    let vibeRes = {
        llmOneLiner: `${productName} helps users achieve their goals with a ${category}.`,
        llmHeadlines: [`The ${category} for users.`, `Achieve goals fast.`, `Stop struggling with ${category}.`],
        llmPositioning: `${productName} is the ${category} that simply works. It is designed for efficiency.`,
        llmPalette: null as any
    };

    let llmOk = false;
    let usedModel = 'none';
    let llmError = '';
    let rawTextPreview = '';
    let fallbackReason = 'Init';

    const visualContext = q3_url_or_desc ? `Visual Style Requested: "${q3_url_or_desc}". Derive a palette (accent/base/ink/font/radius) that matches this vibe.` : "No specific visual style requested. Generate a random, modern palette.";

    const prompt = `
    Role: Senior Brand Strategist.
    Task: Generate a brand vibe for a new product.
    
    Inputs:
    Product: ${q1_core_what}
    Moment: ${q2_moment || 'None'}
    Domain: ${product_type || 'General'}
    Context Name: ${productName}
    ${visualContext}

    Output Format: JSON ONLY. No markdown blocks.
    Schema:
    {
      "llmOneLiner": "string (12-20 words, action-oriented, customer-win focus, NO hype words)",
      "llmHeadlines": ["string (max 5 words)", "string", "string"],
      "llmPositioning": "string (2 sentences, clear value prop)",
      "llmPalette": { 
          "accent": "#hex", 
          "base": "#hex", 
          "ink": "#hex", 
          "font": "string (Inter|Outfit|Cormorant)", 
          "radius": number (0, 0.5, 1) 
      }
    }

    Guardrails:
    - No "helps users" generic structure if possible. Be punchy.
    - No medical cures or financial promises.
    - Hex codes must be valid 6-char hex.
    - Radius must be number.
    `;

    for (const modelName of MODELS_TO_TRY) {
        try {
            usedModel = modelName;
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: { responseMimeType: 'application/json', temperature: 0.9 }
            });

            const res = await model.generateContent(prompt);
            const text = res.response.text().trim();
            rawTextPreview = text;

            // Clean markdown tokens if any (sometimes model ignores JSON mode or it's not supported in older models)
            const jsonText = text.replace(/^```json|```$/g, '').trim();
            const parsed = JSON.parse(jsonText);

            // Basic Validation
            if (parsed.llmOneLiner && Array.isArray(parsed.llmHeadlines) && parsed.llmPalette?.accent) {
                vibeRes = parsed;
                llmOk = true;
                fallbackReason = '';
                break;
            } else {
                fallbackReason = `Invalid JSON schema: ${text.slice(0, 50)}...`;
            }
        } catch (e: any) {
            llmError += `[${modelName}: ${e.message}] `;
            fallbackReason = 'Exception';
        }
    }

    // Palette Resolution: Visuals override random picker IF LLM succeeded and q3 was provided
    if (llmOk && q3_url_or_desc && vibeRes.llmPalette) {
        // Use LLM palette
        // Validate hex
        // Quick verify? simple assignment.
        const p = vibeRes.llmPalette;
        palette = {
            id: 'llm-custom',
            name: 'Custom Vibe',
            accent: p.accent || palette.accent,
            base: p.base || palette.base,
            ink: p.ink || palette.ink,
            font: p.font || palette.font,
            radius: typeof p.radius === 'number' ? p.radius : palette.radius,
            tags: ['custom', 'generated']
        };
    }

    // 4. Response
    // --------------------------------------------------------------------------
    return {
        identity: {
            productName,
            category
        },
        vibe: {
            archetype,
            toneTags,
            palette // Either random seeded OR LLM generated
        },
        // Spread the LLM texts
        oneLiner: vibeRes.llmOneLiner,
        headlines: vibeRes.llmHeadlines,
        positioning: vibeRes.llmPositioning,

        debug: {
            endpointName: 'demo-v2',
            model: usedModel,
            remix: !!remix,
            seed: seed,
            llmOk,
            llmError,
            fallbackReason,
            rawTextPreview: rawTextPreview.slice(0, 100),
            promptChars: prompt.length,
            inferredName: inferred.name,
            inferredConfidence: inferred.confidence,
            cacheHit: false // Demo never caches
        }
    };
});
