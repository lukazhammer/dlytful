import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { getEnv } from '../../lib/env';
import { inferProductName, isGeneric } from '../../../lib/brand/inferName';
import { CURATED_PALETTES } from '../../../lib/brand/palette';
import { createHash } from 'node:crypto';
import { mixToneSheets } from '../../../lib/brand/tone/mixToneSheets';
import { normalizeToneSheets } from '../../../lib/brand/tone/normalizeToneSheet';
import { buildBrandPrompt } from '../../../lib/brand/prompt/buildBrandPrompt';
import { getPositioningPattern, getHeadlineMoves } from '../../../lib/brand/content/archetypePatterns';
import type { ToneStyleSheet } from '../../../lib/brand/tone/schema';
import fs from 'node:fs';
import path from 'node:path';

// Load Tone Fixtures (Cached & Normalized)
const tonesPath = path.resolve(process.cwd(), 'tests/tone_style_sheets.v1.json');
const rawTones = JSON.parse(fs.readFileSync(tonesPath, 'utf-8'));
const allTones: ToneStyleSheet[] = normalizeToneSheets(rawTones);

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
    const clone = [...list]; // Fixed: spread to clone
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
// --- SCHEMA ---
const ARCHETYPE_STYLES: Record<string, string> = {
    'The Hero': 'Direct, action-oriented, overcoming challenges, strength verbs.',
    'The Sage': 'Logical, clarity-first, definitions, objectivity, no fluff.',
    'The Lover': 'Sensory, warm, relational, "you belong", intimacy.',
    'The Rebel': 'Contrarian, "stop doing X", refuse the status quo, sharp edge.',
    'The Jester': 'Playful, wink/nod, unexpected twists, never boring.',
    'The Creator': 'Craftsmanship, "by design", building, precision, unlocking potential.',
    'The Caregiver': 'Supportive, "we got you", relief, safety, warmth.',
    'The Ruler': 'Dominant, industry standard, leading, control, stability.',
    'The Innocent': 'Simple, pure, optimism, easy, "just works".',
    'The Explorer': 'Discovery, new frontiers, freedom, "go anywhere".',
    'The Magician': 'Transformation, "like magic", instant results, wonder.',
    'The Everyman': 'Relatable, down-to-earth, "for people like us", honest.'
};

const BodySchema = z.object({
    q1_core_what: z.string().min(1),
    q2_moment: z.string().optional(),
    q3_url_or_desc: z.string().optional(),
    product_type: z.string().optional(),
    remix: z.boolean().optional(),
    remix_nonce: z.string().optional(),
    tone_ids: z.array(z.string()).optional(),
    archetype: z.string().optional(),
    palette_id: z.string().optional()
});

// Positioning Parts Validation Schema
const PositioningPartsSchema = z.object({
    target: z.string().min(3),
    product: z.string().min(1),
    category: z.string().min(3),
    value: z.string().min(5),
    alternative: z.string().min(3).optional(),
    differentiator: z.string().min(5),
    proof: z.string().min(5).refine(val => !val.toLowerCase().includes('generic'), { message: "Proof cannot be generic" })
});

import { renderPositioningDeclaration } from '../../utils/renderPositioning';

// --- HANDLER ---

export default defineEventHandler(async (event) => {
    const bodyResult = BodySchema.safeParse(await readBody(event));
    if (!bodyResult.success) {
        throw createError({ statusCode: 400, statusMessage: "Invalid Inputs" });
    }
    const { q1_core_what, q2_moment, q3_url_or_desc, product_type, remix, remix_nonce } = bodyResult.data;

    const inferred = inferProductName({ q1: q1_core_what, q2: q2_moment, q3: q3_url_or_desc });
    let productName = inferred.confidence !== 'low' ? inferred.name : "Your Product";
    const category = product_type || "Product";
    const entropySource = `${q1_core_what}${q2_moment}${q3_url_or_desc}${product_type}${remix_nonce}`;
    const seed = stableStringHash(entropySource);

    const archetype = bodyResult.data.archetype || pickRandom(VALID_ARCHETYPES, seed);
    let palette = pickRandom(CURATED_PALETTES, seed + 1);

    let selectedToneIds: string[] = [];
    let toneTags: string[] = [];
    if (bodyResult.data.tone_ids && bodyResult.data.tone_ids.length > 0) {
        selectedToneIds = bodyResult.data.tone_ids;
    } else {
        const randomIds = pickRandomUnique(allTones.map(t => t.id), 3, seed + 2);
        selectedToneIds = randomIds;
    }
    const selectedTones = selectedToneIds.map(id => allTones.find(t => t.id === id)).filter(Boolean) as ToneStyleSheet[];
    if (selectedTones.length === 0) selectedTones.push(allTones[0]);
    toneTags = selectedTones.map(t => t.name);

    const mixedSpec = mixToneSheets(selectedTones, selectedTones.map(() => 1));
    const headlineMoves = getHeadlineMoves(seed, 3);

    // Positioning logic handled by LLM now, so we removed old pattern fetching.

    const apiKey = getEnv('GEMINI_API_KEY');
    const genAI = new GoogleGenerativeAI(apiKey);
    const MODELS_TO_TRY = ['gemini-2.5-latest', 'gemini-2.0-flash-exp', 'gemini-1.5-flash'];

    let vibeRes = {
        llmOneLiner: `${productName} helps users achieve their goals with a ${category}.`,
        llmHeadlines: [`The ${category} for users.`, `Achieve goals fast.`, `Stop struggling with ${category}.`],
        llmPositioningParts: {
            target: 'users', product: productName, category, value: 'works well', alternative: 'old tools', differentiator: 'is faster', proof: 'experience'
        },
        llmOutcome: 'achieve their goals',
        llmProof: 'it just works',
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
    Task: Generate a brand vibe and detailed positioning declaration for a new product.
    
    Inputs:
    Product: ${q1_core_what}
    Moment: ${q2_moment || 'None'}
    Domain: ${product_type || 'General'}
    Context Name: ${productName}
    ${visualContext}
    
    Target Archetype: ${archetype}
    Target Tones: ${toneTags.join(', ')}

    STRICT TONE CONTRAINTS (MUST FOLLOW):
    ${mixedSpec.instructions.map(i => `- ${i}`).join('\n')}
    - Banned Digits/Punctuation: ${mixedSpec.constraints.punctuation_bans.join(' ')} ${mixedSpec.constraints.allow_numbers ? '' : '0-9'}
    
    STRICT POSITIONING DECLARATION (Internal Spec, not tagline):
    You must decompose the positioning into these parts:
    - Target: Who is it for? (e.g. "DevOps engineers", not "You")
    - Category: What is it? (e.g. "CI/CD pipeline")
    - Value: What does it do? (e.g. "automates deployments")
    - Alternative: What are they using now? (e.g. "manual scripts", "Jenkins")
    - Differentiator: Why is this better? (e.g. "is 10x faster due to caching")
    - Proof: Why believe it? (e.g. "used by Netflix", "zero-config architecture") -> MUST NOT BE GENERIC. Use inferred details.

    STRICT HEADLINE RULES:
    You MUST generate exactly 3 headlines following these specific moves:
    - Headline 1 (${headlineMoves[0].name}): ${headlineMoves[0].instruction}
    - Headline 2 (${headlineMoves[1].name}): ${headlineMoves[1].instruction}
    - Headline 3 (${headlineMoves[2].name}): ${headlineMoves[2].instruction}
       
    Constraints: 
    - MAX 5 words per headline.
    - Do not use the same first word for any of the headlines.

    Output Format: JSON ONLY.
    Schema:
    {
      "llmOneLiner": "string (12-20 words, action-oriented, customer-win focus)",
      "llmHeadlines": ["string", "string", "string"],
      "llmPositioningParts": {
        "target": "string",
        "product": "string (${productName})",
        "category": "string(noun)",
        "value": "string (verb phrase)",
        "alternative": "string (competitor/status quo)",
        "differentiator": "string (comparative)",
        "proof": "string (evidence)"
      },
      "llmPalette": { "accent": "#hex", "base": "#hex", "ink": "#hex", "font": "string", "radius": number }
    }
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

            const jsonText = text.replace(/^```json|```$/g, '').trim();
            const parsed = JSON.parse(jsonText);

            if (parsed.llmPositioningParts) {
                // Validate positioning decomposition
                const posCheck = PositioningPartsSchema.safeParse(parsed.llmPositioningParts);
                if (!posCheck.success) {
                    throw new Error("Positioning parts validation failed: " + posCheck.error.message);
                }

                vibeRes = parsed;
                fallbackReason = '';
                llmOk = true;
                break;
            } else {
                fallbackReason = `Invalid JSON schema: Missing positioning parts`;
            }
        } catch (e: any) {
            llmError += `[${modelName}: ${e.message}] `;
            fallbackReason = 'Exception';
        }
    }

    // Safety Clean
    if (vibeRes.llmOneLiner) {
        const stripRx = /[!—–]/g;
        vibeRes.llmOneLiner = vibeRes.llmOneLiner.replace(stripRx, '.');
        if (Array.isArray(vibeRes.llmHeadlines)) vibeRes.llmHeadlines = vibeRes.llmHeadlines.map(h => h.replace(stripRx, ''));
    }

    if (llmOk && q3_url_or_desc && vibeRes.llmPalette) {
        const p = vibeRes.llmPalette;
        palette = {
            id: 'llm-custom', name: 'Custom Vibe',
            accent: p.accent || palette.accent, base: p.base || palette.base, ink: p.ink || palette.ink,
            font: p.font || palette.font, radius: typeof p.radius === 'number' ? p.radius : palette.radius,
            tags: ['custom']
        };
    }

    // Render positioning string using helper
    const finalPositioning = renderPositioningDeclaration(vibeRes.llmPositioningParts);

    // Response Construction
    const brandPromptCtx = {
        productName, category, audience: vibeRes.llmPositioningParts.target,
        outcome: vibeRes.llmPositioningParts.value, proof: vibeRes.llmPositioningParts.proof,
        archetype, toneTags, palette,
        assets: { oneLiner: vibeRes.llmOneLiner || '', positioning: finalPositioning, headlines: vibeRes.llmHeadlines || [] },
        mixedSpec
    };
    const brandPrompt = buildBrandPrompt(brandPromptCtx);

    return {
        identity: { productName, category, outcome: vibeRes.llmPositioningParts.value, proof: vibeRes.llmPositioningParts.proof },
        vibe: { archetype, toneTags, palette },
        copy: { oneLiner: vibeRes.llmOneLiner, headlines: vibeRes.llmHeadlines, positioning: finalPositioning, positioningParts: vibeRes.llmPositioningParts },
        brandPrompt, brandPromptMarkdown: brandPrompt.text,
        oneLiner: vibeRes.llmOneLiner, headlines: vibeRes.llmHeadlines, positioning: finalPositioning,
        debug: {
            endpointName: 'demo-v2', model: usedModel, remix: !!remix, seed, llmOk, llmError, fallbackReason,
            rawTextPreview: rawTextPreview.slice(0, 100), inferredName: inferred.name
        }
    };
});
