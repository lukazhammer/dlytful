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
    remix_nonce: z.string().optional(), // Client provided source of entropy
    // Vibe Overrides
    tone_ids: z.array(z.string()).optional(),
    archetype: z.string().optional(),
    palette_id: z.string().optional()
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

    // Determine Archetype
    const archetype = bodyResult.data.archetype || pickRandom(VALID_ARCHETYPES, seed);

    // Determine Palette (Name/Tags logic or just ID)
    // If palette_id is sent, we can try to find it in CURATED, or just use it as seed for consistency
    let palette = pickRandom(CURATED_PALETTES, seed + 1);
    // If palette_id provided, finding by ID might be hard if we don't have IDs in CURATED_PALETTES or if it's just a seed
    // For now we trust the random seed derived from inputs/nonce (which changes on Remix) handles palette variety sufficienty.
    // If user specifically requested 'p1', we could look it up, but palette_id is mostly for cache determinism here.

    // Determine Tones
    let selectedToneIds: string[] = [];
    let toneTags: string[] = [];

    if (bodyResult.data.tone_ids && bodyResult.data.tone_ids.length > 0) {
        selectedToneIds = bodyResult.data.tone_ids;
    } else {
        // Fallback: Pick 3 random IDs from available tones
        const randomIds = pickRandomUnique(allTones.map(t => t.id), 3, seed + 2);
        selectedToneIds = randomIds;
    }

    // Resolve Tone Objects and Names
    const selectedTones = selectedToneIds.map(id => allTones.find(t => t.id === id)).filter(Boolean) as ToneStyleSheet[];
    // Fallback if some IDs invalid: fill with random? Or just use what we have.
    if (selectedTones.length === 0) {
        selectedTones.push(allTones[0]); // Default to first (Sage)
    }
    toneTags = selectedTones.map(t => t.name);

    // MIX TONES
    const mixedSpec = mixToneSheets(selectedTones, selectedTones.map(() => 1)); // Equal weights

    // DETERMINISTIC PATTERNS
    const posPattern = getPositioningPattern(archetype, seed);
    const headlineMoves = getHeadlineMoves(seed, 3);

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
    Task: Generate a brand vibe for a new product.
    
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
    
    STRICT STRUCTURE ENFORCEMENT (Mandatory):
    1. Positioning: You MUST use this exact sentence structure (fill in the brackets):
       Template: "${posPattern.template}"
       Context: This fits the ${archetype} archetype (${posPattern.description}).
    
    2. Headlines: You MUST generate exactly 3 headlines following these specific moves:
       - Headline 1 (${headlineMoves[0].name}): ${headlineMoves[0].instruction}
       - Headline 2 (${headlineMoves[1].name}): ${headlineMoves[1].instruction}
       - Headline 3 (${headlineMoves[2].name}): ${headlineMoves[2].instruction}
       
       Constraints: 
       - MAX 5 words per headline.
       - Do not use the same first word for any of the headlines.
       - Use at least one Preferred Vocabulary word in at least 2 headlines.

    LEXICON RULES:
    - BANNED WORDS/PHRASES (Do NOT use): ${mixedSpec.banned_lexicon.slice(0, 80).join(', ') || 'None'}
    - PREFERRED VOCABULARY (Try to use): ${mixedSpec.preferred_lexicon.slice(0, 40).join(', ') || 'None'}

    STYLE ENFORCEMENT:
    1. If a banned word/phrase appears, REWRITE until it is gone.
    2. Do not reuse previous sentence skeletons. Vary openings.
    3. If "No contractions" is set, do not use them (e.g. use "do not" instead of "don't").

    Output Format: JSON ONLY. No markdown blocks.
    Schema:
    {
      "llmOneLiner": "string (12-20 words, action-oriented, customer-win focus, NO hype words)",
      "llmHeadlines": ["string (max 5 words)", "string", "string"],
      "llmPositioning": "string (2 sentences, clear value prop)",
      "llmOutcome": "string (3-5 words, e.g. 'ships code faster')",
      "llmProof": "string (5-10 words, e.g. 'of our automated pipeline')",
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

                // --- STRICT REWRITE PASS ---
                // Check for banned lexicon or punctuation
                const bannedTerms = [...mixedSpec.banned_lexicon, ...mixedSpec.constraints.punctuation_bans];
                if (!mixedSpec.constraints.allow_numbers) bannedTerms.push('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');

                const combinedText = (parsed.llmOneLiner + parsed.llmHeadlines.join(' ') + parsed.llmPositioning).toLowerCase();
                const foundViolations = bannedTerms.filter(term => combinedText.includes(term.toLowerCase()));

                if (foundViolations.length > 0) {
                    // REWRITE LOOP (Attempt 1)
                    console.log(`[Demo] Rewrite triggered. Violations: ${foundViolations.join(', ')}`);
                    const rewritePrompt = `
                        Original JSON: ${JSON.stringify(parsed)}
                        
                        VIOLATIONS FOUND: The text contained these banned terms/chars: ${foundViolations.join(', ')}.
                        
                        Task: HOSTILE REWRITE. Remove all banned terms. Enforce tone constraints harder.
                        Preserve JSON schema. Return fixed JSON.
                     `;

                    const rewriteRes = await model.generateContent({
                        contents: [{ role: 'user', parts: [{ text: rewritePrompt }] }],
                        generationConfig: { temperature: 0.3 } // Lower temp for strict fix
                    });
                    const rewriteText = rewriteRes.response.text().replace(/^```json|```$/g, '').trim();
                    const rewrittenParsed = JSON.parse(rewriteText);

                    if (rewrittenParsed.llmOneLiner) {
                        vibeRes = rewrittenParsed; // Accept rewrite
                        fallbackReason = 'Rewritten';
                    } else {
                        vibeRes = parsed; // Keep original if rewrite broke schema
                        fallbackReason = 'RewriteFailedSchema';
                    }
                } else {
                    vibeRes = parsed; // All good
                    fallbackReason = '';
                }

                llmOk = true;
                break;
            } else {
                fallbackReason = `Invalid JSON schema: ${text.slice(0, 50)}...`;
            }
        } catch (e: any) {
            llmError += `[${modelName}: ${e.message}] `;
            fallbackReason = 'Exception';
        }
    }

    // FINAL SAFETY NET: Blindly strip banned punctuation if it leaked through
    if (vibeRes.llmOneLiner) {
        const stripRx = /[!—–]/g; // Exclamation, Em-dash, En-dash
        vibeRes.llmOneLiner = vibeRes.llmOneLiner.replace(stripRx, '.');
        if (Array.isArray(vibeRes.llmHeadlines)) {
            vibeRes.llmHeadlines = vibeRes.llmHeadlines.map(h => h.replace(stripRx, ''));
        }
        if (vibeRes.llmPositioning) {
            vibeRes.llmPositioning = vibeRes.llmPositioning.replace(stripRx, '.');
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

    // Generate Brand Prompt (Deterministic based on final outputs)
    const brandPromptCtx = {
        productName: productName,
        category: category,
        audience: 'Users', // Fallback
        outcome: vibeRes.llmOutcome || 'Success',
        proof: vibeRes.llmProof || '',
        archetype: archetype,
        toneTags: toneTags,
        palette: palette,
        assets: {
            oneLiner: vibeRes.llmOneLiner || '',
            positioning: vibeRes.llmPositioning || '',
            headlines: Array.isArray(vibeRes.llmHeadlines) ? vibeRes.llmHeadlines : []
        },
        mixedSpec: mixedSpec
    };

    const brandPrompt = buildBrandPrompt(brandPromptCtx);

    return {
        identity: {
            productName: productName,
            category: category,
            outcome: vibeRes.llmOutcome,
            proof: vibeRes.llmProof
        },
        vibe: {
            archetype,
            toneTags,
            palette
        },
        copy: {
            oneLiner: vibeRes.llmOneLiner,
            headlines: vibeRes.llmHeadlines,
            positioning: vibeRes.llmPositioning
        },
        brandPrompt: brandPrompt, // Legacy object
        brandPromptMarkdown: brandPrompt.text, // Builder-Agnostic Markdown

        // Legacy fields for frontend compat (if needed, but we updated frontend to use result.assets)
        // demo.vue uses: result.brandSpec.productName, category, voice.soundsLike, designTokens...
        // and result.assets.oneLiner...
        // We handle mapping in frontend now or here?
        // Frontend `demo.vue` maps: 
        // res.identity -> brandSpec
        // res.vibe -> brandSpec.voice/tokens
        // res.oneLiner -> assets
        // So I should KEEP legacy keys `oneLiner`, `headlines`, `positioning` at top level if frontend expects them.
        // Yes, frontend uses `res.oneLiner`, `res.headlines`.
        // I will keep them.

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
            cacheHit: false, // Demo never caches
            mixedSpec: mixedSpec // Proof of mixing
        }
    };
});
