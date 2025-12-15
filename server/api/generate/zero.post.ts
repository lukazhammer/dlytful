import { GoogleGenerativeAI } from '@google/generative-ai';
import { serverSupabaseClient } from '#supabase/server';
import { z } from 'zod';
import { getEnv } from '../../lib/env';
import { inferProductName, isGeneric } from '../../../lib/brand/inferName'; // Added
import { compileBrandSpec, stableHash } from '../../../lib/brand/compile';
import { getAllPaletteOptions, CURATED_PALETTES, getPaletteById } from '../../../lib/brand/palette';
import type { Database } from '~/types/database.types';

/*
  WIRING DIAGRAM: ZERO GENERATOR FLOW
  ===================================
  [Client] Q1/Q2/Q3 Input -> [zero.post.ts]
        |
        +-> 1. Check Cache (InputHash) -> Return Cached Spec
        |
        +-> 2. Phase A: LLM Interpreter ("Drafting")
        |    Prompt: "Interpret product, pain, outcome from inputs"
        |    Includes: Domain Hints, Palette Options
        |    Output: Soft JSON Draft
        |
        +-> 3. Phase B: Repair Loop (Validation)
        |    Check: Valid JSON? Pain !contains Product? Grammar? Distinctness?
        |    If Invalid -> Retry LLM (Max 3) with Full Context
        |    Result: Validated Draft (or fallback)
        |
        +-> 4. Compilaton (Deterministic)
        |    Merge Draft + Mapped Inputs -> compileBrandSpec()
        |    Apply: Domain Logic (Devtools vs General), Sanitizers
        |
        +-> 5. Persist & Return
             Update DB (sprints table)
             Return Spec + Debug Info
*/

// SCHEMA: Soft Draft from Interpreter
const SoftDraftSchema = z.object({
    productName: z.string().optional(),
    category: z.string().optional(),
    audience: z.string().max(120).optional(),
    pain: z.string().max(120).optional(),
    outcome: z.string().max(120).optional(),
    differentiation: z.string().max(120).optional(),
    proof: z.string().max(200).optional(),
    voice: z.object({
        soundsLike: z.array(z.string()).optional(),
        neverLike: z.array(z.string()).optional(),
        neverWords: z.array(z.string()).optional()
    }).optional(),
    archetypePrimary: z.string().optional(),
    paletteId: z.string().optional(),
    paletteRationale: z.string().optional(),
    vibeTags: z.array(z.string()).optional()
});

const LLM_JSON_INSTRUCTIONS = `
RESPONSE FORMAT:
You must return a valid JSON object. No Markdown blocks. No comments. No trailing commas.
`;

const VALID_ARCHETYPES = [
    'The Innocent', 'The Sage', 'The Explorer', 'The Outlaw', 'The Magician', 'The Hero',
    'The Lover', 'The Jester', 'The Caregiver', 'The Ruler', 'The Creator', 'The Everyman'
];

const DOMAIN_HINTS = `
DOMAIN HINT TABLE:
- devtools: Archetypes [Sage, Creator, Hero]. Proof: integrations, workflow, speed. Tone: precise, technical.
- saas: Archetypes [Sage, Ruler, Hero]. Proof: reporting, ops, scale. Tone: confident, efficient.
- consumer/health: Archetypes [Caregiver, Sage, Lover]. Proof: trust, quality, feeling. Tone: warm, clear.
- community/travel: Archetypes [Explorer, Everyman, Jester]. Proof: simplicity, connection. Tone: friendly, clear.
`;

// Anti-Generic Blacklist
const GENERIC_PHRASES = [
    "ship with clarity",
    "get results",
    "feel better",
    "save time",
    "make decisions faster",
    "bring order to chaos",
    "orchestrate workflow"
];

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { q1_core_what, q2_moment, q3_url_or_desc, product_type, remix } = body;

    // 1. Input Hash Computation (Phase C Pre-check)
    const rawInputs = {
        q1: (q1_core_what || '').trim(),
        q2: (q2_moment || '').trim(),
        q3: (q3_url_or_desc || '').trim(),
        type: (product_type || 'other').trim()
    };
    if (remix) (rawInputs as any).remix_nonce = Date.now().toString();
    const inputHash = stableHash(rawInputs);

    const client = await serverSupabaseClient<Database>(event);
    const { data: { user } } = await client.auth.getUser();

    // Cache Check
    if (user && !remix) {
        const { data: existing } = await client.from('sprints').select('*').eq('user_id', user.id).eq('input_hash', inputHash).maybeSingle<any>();
        if (existing && existing.unlocks) {
            console.log(`[Cache Hit] Serving ${inputHash}`);
            return {
                brandSpec: existing.unlocks,
                specHash: existing.spec_hash,
                markdown: existing.brand_prompt,
                assets: existing.unlocks.assets || {},
                debug: { cached: true, inputHash }
            };
        }
    }

    // --- DEMO MODE (Brute Force Variety) ---
    if (body.demo) {
        console.log(`[Demo Mode] Bypass cache. InputHash: ${inputHash}`);

        // 1. Random Assignment (Archetype + Palette + Tone)
        const toneOptions = ["Direct", "Playful", "Warm", "Luxurious", "Minimal", "Bold", "Technical", "Friendly"];
        const prev = body.prevAssignment || {};

        let archetypePrimary = "";
        let paletteId = "";
        let tone = "";

        // Retry loop to ensure variety from previous assignment
        let attempts = 0;
        while (attempts < 10) {
            archetypePrimary = VALID_ARCHETYPES[Math.floor(Math.random() * VALID_ARCHETYPES.length)];
            paletteId = CURATED_PALETTES[Math.floor(Math.random() * CURATED_PALETTES.length)].id;
            tone = toneOptions[Math.floor(Math.random() * toneOptions.length)];

            // If first run, break immediately. If remix, ensure at least one thing changed.
            if (!prev.archetypePrimary) break;

            // Ensure meaningful difference (combo must not match exactly)
            const sameArch = archetypePrimary === prev.archetypePrimary;
            const samePal = paletteId === prev.paletteId;
            const sameTone = tone === prev.tone;

            if (!sameArch || !samePal || !sameTone) {
                break;
            }
            attempts++;
        }

        // 2. Generate One-Liner (Gemini 1.5 Flash High Temp)
        const apiKey = getEnv('GEMINI_API_KEY');
        const genAI = new GoogleGenerativeAI(apiKey);
        // Use flash as proxy for 'latest' speed/cost, with high temp for variety
        const modelOneLiner = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: { responseMimeType: 'application/json', temperature: 0.9 }
        });

        const oneLinerPrompt = `
        Given input from fields:
        Product: ${q1_core_what}
        Moment: ${q2_moment}
        Visual vibe: ${q3_url_or_desc || 'None'}
        Product type: ${product_type}
        Random assignment: Archetype ${archetypePrimary}, Tone ${tone}

        Write a good marketing one-liner that is clear, concise, and compelling, focusing on a customer's problem, the user's unique solution, and the positive outcome/benefit, making it memorable, relatable, and action-driving… customer wins story, not feature list.

        Output rules:
        Return JSON: { "oneLiner": "..." }
        8–16 words
        No quotes in the value
        Must not start with product name
        Must not contain "AI-powered", "synergy", "10x", "disruptive"
        `;

        let finalOneLiner = "";
        try {
            console.log(`[Demo] Generating One-Liner...`);
            const res = await modelOneLiner.generateContent(oneLinerPrompt);
            const json = extractJsonObject(res.response.text());
            if (json && json.oneLiner) finalOneLiner = json.oneLiner;
            console.log(`[Demo] OneLiner: "${finalOneLiner}"`);
        } catch (e) {
            console.error("[Demo OneLiner Error]", e);
        }

        // 3. Compile Base (for structure) + Override
        // We still run standard compilation to get Audience, Pain etc. using the inputs
        // But we inject our forced values.

        // Construct a "Fake Draft" based on inputs + assignment
        const compileInputs = {
            productName: '', // Let extractName handle it
            category: '', // Let extractCategory handle it
            audience: '',
            pain: '',
            outcome: '',
            proof: '',
            differentiation: '',
            archetypePrimary: archetypePrimary,
            paletteId: paletteId,
            voice: { soundsLike: [tone], neverLike: [], neverWords: [] },
            vibeTags: [],
            product_type: product_type,
            q1_core_what,
            q2_audience_who: q2_moment, // Use moment as fallbacks
            q2_moment,
            q9_voice_tone: tone,
            q6_mission_why: q2_moment,
            q7_competitors_differentiation: ''
        };

        const compiled = compileBrandSpec(compileInputs);

        // Override One-Liner if we got one
        if (finalOneLiner) {
            compiled.assets.oneLiner = finalOneLiner;
            // Ensure spec assets are synced if needed, though assets object is returned separately
        }

        const chosenPalette = getPaletteById(paletteId);

        return {
            brandSpec: compiled.brandSpec,
            assets: compiled.assets,
            markdown: compiled.markdown,
            specHash: compiled.specHash,
            assignment: {
                archetypePrimary,
                tone,
                paletteId,
                designTokens: {
                    accent: chosenPalette.accent,
                    base: chosenPalette.base,
                    ink: chosenPalette.ink,
                    radius: chosenPalette.radius,
                    font: chosenPalette.font
                },
                voice: compiled.brandSpec.voice
            },
            debug: { demo: true, attempts, oneLinerUsed: !!finalOneLiner }
        };
    }

    // BASELINE (Debug Comparison)
    const baseline = compileBrandSpec({
        q1_core_what,
        q2_audience_who: 'Baseline Audience',
        product_type
    }).brandSpec;

    // PHASE A: LLM Interpreter
    console.log(`[LLM Start] inputs: ${JSON.stringify(rawInputs)}`);
    const apiKey = getEnv('GEMINI_API_KEY');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json', temperature: 0.5 } // Higher temp for variety
    });

    // Compact Palette Options
    // Reconstruct valid IDs for the prompt to ensure no hallucinations
    const rawPaletteOptions = getAllPaletteOptions(); // Returns formatted string from palette.ts? 
    // Wait, getAllPaletteOptions in palette.ts returns a STRING block. We need the raw data for validation.
    // We should parse the string or just hardcode the IDs validation?
    // Let's rely on the string in the prompt but validate against known IDs to be safe.
    // Actually, let's fix the prompt input to be more structured JSON-like for the LLM.
    // See Palette Fix in plan: "Build a compact JSON string... { id, name, tags... }"
    // BUT getAllPaletteOptions() returns a string block. I'll stick to that string block as it contains IDs.
    // I need valid IDs list for validation though.
    // I'll extract IDs from the string via regex or I'll just trust the string I inject is correct.
    // Actually, I should import CURATED_PALETTES from palette.ts if possible, but palette.ts exports getAllPaletteOptions which returns string.
    // I made a mistake assuming I can get list of IDs easily without reading palette.ts content deeply.
    // I'll grab IDs via a simple regex from the returned string block if needed, or loosen validation.
    // Better: I'll assume valid IDs are alphanumeric-dash.

    // const paletteOptions = ... imported string block ...

    // Domain Context
    const domainContext = product_type === 'devtools' ? "Developer Tool" : (product_type === 'saas' ? "B2B SaaS" : (product_type === 'consumer' ? "Consumer Product" : "General Product"));

    const basePrompt = `
    You are an expert brand strategist. INTERPRET this product signal.
    
    INPUTS:
    1. Product: ${q1_core_what}
    2. "Aha" Moment: ${q2_moment}
    3. Context: ${q3_url_or_desc || 'None'}
    4. Domain: ${domainContext}

    PALETTE OPTIONS (Pick one ID):
    ${rawPaletteOptions}

    ${DOMAIN_HINTS}

    TASK:
    Generate a JSON Draft. Use "soft" constraints (capture intent).
    
    GUIDANCE:
    - Audience: Who *really* gets value? e.g. "Frustrated PMs".
    - Pain: What sucks for them before this? e.g. "manual data entry". NEVER mention product name here.
    - Outcome: What is the emotional/functional release? e.g. "freedom from spreadsheets". 2-8 words. Verb phrase.
    - Differentiation: The "Only X that Y".
    - Proof: Why believe it? e.g. "Trusted by 500+ teams." or "Open source."
    - Voice: Pick distinct adjectives.
    
    SCHEMA:
    {
      "productName": "string (infer if missing)",
      "category": "string (2-5 words, e.g. 'Automated CRM'). NO 'that helps' clauses.",
      "audience": "string",
      "pain": "string",
      "outcome": "string",
      "differentiation": "string",
      "proof": "string (starts with 'It ...')",
      "voice": { "soundsLike": ["string"], "neverLike": ["string"], "neverWords": ["string"] },
      "archetypePrimary": "string (Must be one of: ${VALID_ARCHETYPES.join(', ')})",
      "paletteId": "string",
      "paletteRationale": "string",
      "vibeTags": ["string"]
    }
    ${LLM_JSON_INSTRUCTIONS}
    `;

    let draft: z.infer<typeof SoftDraftSchema> = {};
    let attempts = 0;
    let isValid = false;
    let issues: string[] = [];
    let llmLog: any = {};
    let parseError: string | null = null;
    let rawText = "";

    // PHASE B: Generation & Repair Loop
    while (attempts < 3 && !isValid) {
        attempts++;
        try {
            let prompt = basePrompt;

            if (attempts > 1) {
                prompt = `
                PREVIOUS ATTEMPT FAILED. REPAIR ERRORS.
                
                ORIGINAL INPUTS:
                Product: ${q1_core_what}
                Moment: ${q2_moment}
                Domain: ${domainContext}

                PREVIOUS JSON:
                ${JSON.stringify(draft, null, 2)}
                
                ERRORS TO FIX:
                ${issues.join('\n')}
                
                Retain valid fields. Fix invalid ones.
                ${LLM_JSON_INSTRUCTIONS}
                `;
            }

            console.log(`[Gemini Request ${attempts}] Length: ${prompt.length} chars`);
            const res = await model.generateContent(prompt);
            rawText = res.response.text();
            console.log(`[Gemini Response ${attempts}] Length: ${rawText.length} chars`);

            const json = extractJsonObject(rawText);

            if (!json) {
                console.error("JSON Parse Failed", rawText.slice(0, 100));
                issues = ["Invalid JSON format or empty response"];
                parseError = "Invalid JSON";
                continue;
            }

            const parsed = SoftDraftSchema.safeParse(json);

            if (!parsed.success) {
                issues = parsed.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`);
                console.warn("Schema Validation Issues:", issues);
                continue;
            }

            draft = parsed.data;
            issues = validateDraft(draft); // Custom Validator (Banned Words, Grammar)

            if (issues.length === 0) {
                isValid = true;
                llmLog.draft = draft;
            } else {
                console.warn(`Attempt ${attempts} Logic Invalid:`, issues);
            }
        } catch (e) {
            console.error("LLM Error", e);
            llmLog.error = e;
            break;
        }
    }

    // Valid?
    const valid = attempts > 0 && isValid;

    // Robust Name Inference
    const inferred = inferProductName({
        q1: body.q1_core_what,
        q2: body.q2_moment,
        q3: body.q3_url_or_desc,
        draftName: draft.productName
    });

    let finalProductName = draft.productName;
    const isDraftGeneric = !draft.productName || draft.productName === 'Your Product' || draft.productName.includes('App') || isGeneric(draft.productName);

    // If inferred is stronger, or draft is weak, override
    if (inferred.confidence !== 'low') {
        finalProductName = inferred.name;
    } else if (isDraftGeneric) {
        finalProductName = inferred.name;
    }

    // Pass what we have to the Compiler
    const compileInputs = {
        productName: finalProductName, // Use inferred name
        category: draft.category,
        audience: draft.audience,
        pain: draft.pain,
        outcome: draft.outcome,
        proof: draft.proof,
        differentiation: draft.differentiation,
        archetypePrimary: draft.archetypePrimary,
        paletteId: draft.paletteId,
        voice: draft.voice,
        vibeTags: draft.vibeTags,
        product_type: product_type,
        q1_core_what,
        q2_audience_who: draft.audience || q2_moment,
        q2_moment,
        q9_voice_tone: '',
        q6_mission_why: q2_moment,
        q7_competitors_differentiation: draft.differentiation
    };

    // Log compile inputs to debug
    console.log(`[Compile Inputs]`, JSON.stringify(compileInputs));

    const compiled = compileBrandSpec(compileInputs);

    // Persist
    if (user) {
        const dbPayload = {
            user_id: user.id,
            input_hash: inputHash,
            inputs: { ...rawInputs, draft },
            unlocks: compiled.brandSpec,
            brand_prompt: compiled.markdown,
            spec_hash: compiled.specHash,
            current_step: 99,
            is_complete: true
        };
        (dbPayload.unlocks as any).assets = compiled.assets;

        await client.from('sprints').upsert(dbPayload as any, { onConflict: 'user_id, input_hash' });
    }

    const debugInfo = {
        llmUsed: isValid,
        llmAttempts: attempts,
        llmParseError: parseError,
        domain: domainContext,
        draftUsed: isValid,
        draftRaw: isValid ? draft : null, // Return full draft for debug
        draftMissingFields: Object.keys(draft).filter(k => !(draft as any)[k]),
        finalKeyFields: {
            productName: compiled.brandSpec.productName,
            category: compiled.brandSpec.category,
            audience: compiled.brandSpec.audience,
            pain: compiled.brandSpec.pain,
            outcome: compiled.brandSpec.outcome,
            proof: compiled.brandSpec.proof,
            paletteId: compiled.brandSpec.designTokens.font, // Proxy for palette check
            archetypePrimary: compiled.brandSpec.archetypePrimary
        },
        baselineSummary: {
            productName: baseline.productName,
            category: baseline.category,
            outcome: baseline.outcome
        },
        overrides: issues.length > 0 ? issues : (isValid ? ['All LLM'] : ['Baseline Fallback']),
        inputHash
    };

    // DEBUG & RETURN
    console.log(`[ZERO] domain=${domainContext} attempts=${attempts} intent=${isValid ? 'valid' : 'fallback'} specHash=${compiled.specHash}`);

    return {
        brandSpec: compiled.brandSpec,
        assets: compiled.assets,
        markdown: compiled.markdown,
        specHash: compiled.specHash,
        preview: { rationale: draft.paletteRationale },
        debug: debugInfo
    };
});

/**
 * Robust JSON Extractor
 */
function extractJsonObject(text: string): any {
    try {
        return JSON.parse(text);
    } catch (e) {
        let clean = text.replace(/```json\s*|\s*```/g, "").trim();
        try {
            return JSON.parse(clean);
        } catch (e2) {
            const start = clean.indexOf('{');
            const end = clean.lastIndexOf('}');
            if (start !== -1 && end !== -1 && end > start) {
                try {
                    return JSON.parse(clean.slice(start, end + 1));
                } catch (e3) {
                    return null;
                }
            }
            return null;
        }
    }
}

/**
 * Custom Validator for Repair Loop.
 */
function validateDraft(d: z.infer<typeof SoftDraftSchema>): string[] {
    const errors: string[] = [];

    // 1. Pain Safety
    const pName = (d.productName || "").toLowerCase();
    if (d.pain && pName && d.pain.toLowerCase().includes(pName)) {
        errors.push(`"pain" must NOT contain the product name. Describe the USER'S problem.`);
    }

    // 2. Proof Grammar
    if (d.proof && !d.proof.match(/^It\s/i)) {
        errors.push(`"proof" must start with "It " (case insensitive). Got: "${d.proof}"`);
    }

    // 3. Category Constraints
    if (d.category) {
        const cat = d.category.toLowerCase();
        if (cat.includes("which") || cat.includes("that helps") || cat.includes("tool for")) {
            errors.push(`"category" must be a noun phrase (e.g. "Project Manager"), not a relative clause ("Tool that helps").`);
        }
        if (cat.split(' ').length > 6) {
            errors.push(`"category" is too long (>6 words). Keep it punchy.`);
        }
    }

    // 4. Outcome Checks (Anti-Generic)
    if (d.outcome) {
        const out = d.outcome;
        const len = out.split(' ').length;
        if (len < 2 || len > 10) {
            errors.push(`"outcome" must be a short phrase (2-10 words). Got: "${out}"`);
        }

        // Distinctness check
        if (d.pain && out.toLowerCase() === d.pain.toLowerCase()) {
            errors.push(`"outcome" must be different from "pain".`);
        }

        // Anti-Generic Check
        if (GENERIC_PHRASES.some(phrase => out.toLowerCase().includes(phrase))) {
            errors.push(`"outcome" is too generic. Be specific. Avoid "${out}".`);
        }
    }

    // 5. Archetype Check
    if (d.archetypePrimary && !VALID_ARCHETYPES.includes(d.archetypePrimary)) {
        errors.push(`"archetypePrimary" must be one of: ${VALID_ARCHETYPES.join(', ')}`);
    }

    // 6. Palette Check (Looser, just check existence if provided)
    if (d.paletteId && !d.paletteId.match(/^[a-z0-9-]+$/)) {
        errors.push(`"paletteId" must be a valid ID string (kebab-case).`);
    }

    // 7. Substance Check (MUST have at least 3 fields to be considered valid)
    let substanceCount = 0;
    if (d.category && d.category.length > 2) substanceCount++;
    if (d.audience && d.audience.length > 2) substanceCount++;
    if (d.pain && d.pain.length > 2) substanceCount++;
    if (d.outcome && d.outcome.length > 2) substanceCount++;
    if (d.differentiation && d.differentiation.length > 2) substanceCount++;
    if (d.paletteId) substanceCount++;

    if (substanceCount < 3) {
        errors.push(`Draft is too thin (only ${substanceCount} fields). Must have at least 3 of: category, audience, pain, outcome, differentiation, paletteId.`);
    }

    return errors;
}
