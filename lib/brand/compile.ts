import { createHash } from 'node:crypto';
import type { BrandSpec } from "./schema";
import { BrandSpecSchema } from "./schema";
import { normalizeBannedWords } from "./normalize";
import {
    extractName, extractCategory, extractAudience,
    extractPain, extractOutcome, extractDifferentiation, extractVoice, extractOutcomeFromMoment
} from "./extract";
import { dedupePreserveOrder } from "./utils";
import { getPaletteById, CURATED_PALETTES } from "./palette";

/*
  WIRING DIAGRAM: COMPILER
  ========================
  [Input Object] --> { Name, Category, Audience, Pain, Outcome }
        |
        +-> Domain Check (devtools/saas/consumer/general)
        |     Selects Default Pack (Outcome/Proof Fallbacks)
        |
        +-> generateAssets(spec, domain)
               |
               +-> Headlines (Domain Specific)
               +-> Bullets (Domain Specific)
               +-> Final Sanity Pass (Strip fragments)
  
  RESULT:
  Deterministic, Grammar-Safe Brand Spec + Assets
*/

const DOMAIN_DEFAULTS = {
    devtools: {
        outcome: "ship with clarity",
        proof: "It works inside your workflow.",
        headlines: ["Ship with confidence.", "Scale your impact."],
        bullets: ["Ship faster.", "Reduce errors.", "Automate config.", "Stay compliant.", "Scale up."]
    },
    saas: {
        outcome: "make decisions faster",
        proof: "It fits into your existing process.",
        headlines: ["Scale your operations.", "See the big picture."],
        bullets: ["Save time.", "Reduce churn.", "Work faster.", "Stay organized.", "Scale up."]
    },
    consumer: {
        outcome: "feel better every day",
        proof: "It is built for trust and consistency.",
        headlines: ["Live better.", "Feel the difference."],
        bullets: ["Feel great.", "Save money.", "Live freely.", "Trust the process.", "Enjoy more."]
    },
    general: {
        outcome: "get results without guesswork",
        proof: "It stays simple and reliable.",
        headlines: ["Get results.", "Make it happen."],
        bullets: ["Save time.", "Reduce errors.", "Work faster.", "Stay organized.", "Scale up."]
    }
};

// --- SANITIZERS (Result Only, No Logic) ---

export function cleanText(s: string): string {
    return (s || "").replace(/—|--/g, ", ")
        .replace(/\s+/g, " ")
        .replace(/\b(because works|consists of)\b/gi, "")
        .trim();
}

const clean = cleanText;

function capitalize(s: string): string {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function sanitizeCategory(cat: string): string {
    let c = cleanText(cat);
    // Strip "called X" purely
    c = c.replace(/\s+(called|named|titled|calls)\s+[A-Za-z0-9\-\.]+/i, "");

    // Strip trailing relative clauses
    // "App that helps...", "Platform where friends..."
    // "Tool for...", "System to...", "Software called..."
    c = c.replace(/\s+(that|which|where|when|who|helps)\s+.*/i, "");
    // Note: Removed 'to' from stop list as it breaks "Go to market strategy" -> "Go"

    // Strip leading "a "
    c = c.replace(/^(a|an|the)\s+/i, "");

    // Capitalize first char
    if (c.length > 0) {
        c = c.charAt(0).toUpperCase() + c.slice(1);
    }
    return c;
}

export function sanitizeProof(proof: string): string {
    let p = cleanText(proof);
    if (!p) return "";
    // If it starts with "It", ensure case.
    if (p.match(/^it\s/i)) {
        p = "It " + p.slice(3);
    } else {
        // If not clause, prepend "It "
        p = "It " + p.charAt(0).toLowerCase() + p.slice(1);
    }
    // Ensure period
    if (!p.endsWith('.')) p += '.';
    return p;
}

export function repairPain(pain: string, productName: string): string {
    const p = cleanText(pain);
    if (!p || p.length < 3) return "manual work";

    // Leakage checks
    // Only check if productName is substantial (>3 chars) to avoid "App" or "Tool" triggering matches.
    if (productName && productName.length > 3 && !['product', 'your product', 'app', 'tool'].includes(productName.toLowerCase())) {
        if (p.toLowerCase().includes(productName.toLowerCase())) {
            return "chaotic workflows";
        }
    }
    if (p.match(/^(is|this is)\s+a/i)) return "fragmented tools";

    return p;
}

export function repairOutcome(outcome: string): string {
    let o = cleanText(outcome);
    if (!o || o.length < 3) return "save time"; // Base form fallback

    // Strip leading "to " to force base form
    o = o.replace(/^to\s+/i, "");

    // Ensure it's not single word (unless very strong verb)
    if (o.split(' ').length < 2) return o + " consistently";
    return o;
}

// Converts base form ("save time") to 3rd person ("saves time")
export function ensureThirdPerson(s: string): string {
    if (!s) return s;
    const parts = s.split(" ");
    let verb = parts[0];
    if (!verb) return s;

    if (verb.endsWith("s")) return s;

    if (verb.endsWith("y") && !verb.match(/[aeiou]y$/)) {
        verb = verb.slice(0, -1) + "ies";
    } else if (verb.match(/(sh|ch|x|z)$/)) {
        verb = verb + "es";
    } else {
        verb = verb + "s";
    }
    return [verb, ...parts.slice(1)].join(" ");
}

/**
 * Removes trailing stop fragments that ruin sentences.
 * e.g. "Software that" -> "Software"
 */
function finalSanityPass(s: string): string {
    if (!s) return s;
    // Remove trailing " that", " where", " calls", " which"
    return s.replace(/\s+(that|which|where|calls|allows|helps)\s*$/i, "").trim();
}

// --- ARCHETYPE DATA ---

const ARCHETYPE_DATA: Record<string, { voice: string[] }> = {
    'The Innocent': { voice: ['Optimistic', 'Honest', 'Simple'] },
    'The Sage': { voice: ['Knowledgeable', 'Analytical', 'Calm'] },
    'The Explorer': { voice: ['Adventurous', 'Authentic', 'Independent'] },
    'The Outlaw': { voice: ['Disruptive', 'Bold', 'Liberating'] },
    'The Magician': { voice: ['Visionary', 'Charismatic', 'Transformational'] },
    'The Hero': { voice: ['Courageous', 'Competent', 'Focused'] },
    'The Lover': { voice: ['Passionate', 'Intimate', 'Sensual'] },
    'The Jester': { voice: ['Playful', 'Humorous', 'Spontaneous'] },
    'The Caregiver': { voice: ['Compassionate', 'Nurturing', 'Selfless'] },
    'The Ruler': { voice: ['Authoritative', 'Controlling', 'Responsible'] },
    'The Creator': { voice: ['Creative', 'Imaginative', 'Perfectionist'] },
    'The Everyman': { voice: ['Realistic', 'Empathetic', 'Connection-oriented'] },
};


// --- COMPILATION ---

export interface BrandAssets {
    oneLiner: string;
    heroHeadlines: string[];
    subheadlines: string[];
    benefitBullets: string[];
    objectionHandlers: { objection: string; answer: string }[];
    pitch30s: string;
    notForYouIf: string[];
    ctaOptions: string[];
    positioning: string;
}

function stableStringify(obj: any): string {
    if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
    if (Array.isArray(obj)) return '[' + obj.map(stableStringify).join(',') + ']';
    const keys = Object.keys(obj).sort();
    return '{' + keys.map(k => JSON.stringify(k) + ':' + stableStringify(obj[k])).join(',') + '}';
}

export function stableHash(spec: any): string {
    const json = stableStringify(spec);
    return createHash('sha256').update(json).digest('hex');
}

function limitWords(s: string, n: number) {
    return s.split(/\s+/).slice(0, n).join(" ");
}

function asText(v: unknown): string {
    if (typeof v === 'string') return v;
    return "";
}

function ensureLen(list: string[], len: number, fallbacks: string[]): string[] {
    let clean = dedupePreserveOrder(list, len);
    if (clean.length < len) {
        clean = dedupePreserveOrder([...clean, ...fallbacks], len);
    }
    return clean.slice(0, len);
}

/**
 * Main Compilation Function.
 */
export function compileBrandSpec(inputs: Record<string, unknown>): { brandSpec: BrandSpec, markdown: string, specHash: string, assets: BrandAssets } {

    const name = clean(asText(inputs.productName) || extractName(asText(inputs.q1_core_what)));

    // Domain Resolution
    let pType = asText(inputs.product_type).toLowerCase() || "other";
    // Map pType to known keys: devtools, saas, consumer, general
    let domainKey: keyof typeof DOMAIN_DEFAULTS = 'general';

    // Strict domain mapping (No rigid "app => consumer" trap)
    if (pType.includes('dev')) domainKey = 'devtools';
    else if (pType.includes('saas')) domainKey = 'saas';
    else if (pType.includes('consumer') || pType.includes('health') || inputs.q1_core_what?.toString().toLowerCase().includes('health')) domainKey = 'consumer';

    const defaults = DOMAIN_DEFAULTS[domainKey];

    let category = sanitizeCategory(asText(inputs.category) || extractCategory(asText(inputs.q1_core_what)));
    if (!category) category = "Product";
    category = limitWords(category, 6);

    let audience = clean(asText(inputs.audience) || extractAudience(asText(inputs.q2_audience_who)));
    if (!audience) audience = "Users";

    // Merge inputs for pain/outcome
    // Pass q2_moment to extractPain for better context
    let painRaw = asText(inputs.pain);
    const q2Moment = asText(inputs.q2_moment);
    if (!painRaw) painRaw = extractPain(asText(inputs.q1_core_what), asText(inputs.q6_mission_why), q2Moment);
    const pain = repairPain(painRaw, name);

    let outcomeRaw = asText(inputs.outcome);
    if (!outcomeRaw) outcomeRaw = extractOutcome(pain, domainKey); // Pass domainKey

    // Outcome Guard: If outcome is generic (default), try extracting from Moment
    if (!outcomeRaw || outcomeRaw === 'save time' || outcomeRaw === defaults.outcome) {
        const momentOutcome = extractOutcomeFromMoment(q2Moment, domainKey);
        if (momentOutcome) {
            outcomeRaw = momentOutcome;
        } else {
            outcomeRaw = defaults.outcome;
        }
    }

    // Outcome Grammar Logic:
    // Outcome should be BASE FORM ("save time") in the Spec.
    const outcome = repairOutcome(outcomeRaw);

    // Proof
    // STRICT RULE: If inputs.proof missing, use Domain Default. Never fallback to Differentiation (it often breaks grammar).
    let proofRaw = asText(inputs.proof);
    if (!proofRaw) proofRaw = defaults.proof;
    const proof = sanitizeProof(proofRaw); // Clean "It ..." if needed

    const differentiation = clean(asText(inputs.differentiation) || "outputs consistent quality");

    const promise = `${outcome} from day one`;

    // Voice & Archetype
    const archName = asText(inputs.archetypePrimary) || asText(inputs.q4_archetype_primary) || "The Creator";
    const archData = ARCHETYPE_DATA[archName] || ARCHETYPE_DATA['The Creator']!;

    let soundsLike = (inputs.voice as any)?.soundsLike || [];
    let neverLike = (inputs.voice as any)?.neverLike || [];
    let neverWords = (inputs.voice as any)?.neverWords || [];

    if (soundsLike.length === 0) {
        const v = extractVoice(differentiation, asText(inputs.q9_voice_tone), archData);
        soundsLike = v.soundsLike;
        neverLike = v.neverLike;
        neverWords = v.neverWords;
    }

    const userBanned = normalizeBannedWords(asText(inputs.q8_banned_words));
    neverWords = dedupePreserveOrder([...neverWords, ...userBanned], 8);

    const ARCHETYPE_PALETTE_MAP: Record<string, string> = {
        'The Sage': 'slate-glass',
        'The Innocent': 'forest-calm',
        'The Explorer': 'warm-paper',
        'The Creator': 'violet-haze',
        'The Outlaw': 'midnight-neon',
        'The Ruler': 'corporate-blue',
        'The Magician': 'violet-haze',
        'The Hero': 'corporate-blue',
        'The Lover': 'warm-paper',
        'The Jester': 'midnight-neon',
        'The Caregiver': 'forest-calm',
        'The Everyman': 'swiss-design'
    };

    // Palette
    // If paletteId provided, use it. Else map from Archetype. Else default.
    let pid = asText(inputs.paletteId);
    if (!pid && archName) {
        pid = ARCHETYPE_PALETTE_MAP[archName] || '';
    }
    const paletteId = pid || 'swiss-design';
    const palette = getPaletteById(paletteId) || getPaletteById('swiss-design')!;

    const tokens = {
        accent: palette.accent,
        ink: palette.ink,
        base: palette.base,
        radius: palette.radius,
        font: palette.font as "Inter" | "Outfit" | "Cormorant"
    };

    let vibeTags = Array.isArray(inputs.vibeTags) ? inputs.vibeTags : palette.tags;

    // Constraining Lists
    const fixedSoundsLike = ensureLen(soundsLike, 3, ["Clear", "Prioritized", "Functional"]);
    const fixedNeverLike = ensureLen(neverLike, 3, ["Arrogant", "Confusing", "Generic"]);
    const fixedNeverWords = dedupePreserveOrder(neverWords, 8);

    const visualDo = [
        `Use ${tokens.accent} for primary actions.`,
        `Keep layouts clean with ${tokens.radius}rem radius.`,
        `Speak like ${archName}.`,
        `Emphasize ${outcome}.`,
        `Keep it ${vibeTags[0] || 'minimal'}.`
    ];
    const fixedDo = ensureLen(visualDo, 6, ["Use consistent spacing.", "Maintain hierarchy.", "Keep it clean."]);

    // Spec Construction
    const rawSpec = {
        productName: name,
        category,
        audience,
        pain,
        outcome, // Base form
        differentiation,
        proof: limitWords(proof, 16),
        promise: limitWords(promise, 12),
        taglineOptions: [],
        voice: {
            soundsLike: fixedSoundsLike,
            neverLike: fixedNeverLike,
            neverWords: fixedNeverWords,
        },
        archetypePrimary: archName,
        visualDirection: {
            vibeTags: vibeTags.slice(0, 5),
            uiPrinciples: fixedDo.slice(0, 5),
            do: fixedDo,
            avoid: ensureLen([], 6, [
                "Don't clutter.",
                "Avoid inconsistency.",
                "No low contrast.",
                "Don't ignore mobile.",
                "Avoid ambiguity.",
                "Never block flow."
            ]),
        },
        designTokens: tokens,
        seo: {
            primaryKeyword: limitWords(`${category} for ${audience}`, 6),
            secondaryKeywords: vibeTags,
            oneSentenceMeta: `${name} is the ${category} for ${audience} that ${outcome}.`
        },
        sourceNotes: {
            rawWhat: asText(inputs.q1_core_what),
            rawWho: asText(inputs.q2_audience_who),
            rawWhy: asText(inputs.q6_mission_why),
            rawDifferent: asText(inputs.q7_competitors_differentiation),
            rawSound: asText(inputs.q9_voice_tone),
            rawLook: (Array.isArray(inputs.vibeTags) ? inputs.vibeTags.join(', ') : asText(inputs.q3_url_or_desc)),
            rawForbidden: asText(inputs.q8_banned_words)
        }
    };

    // Asset Generation (Domain Aware!)
    const assets = generateAssets(rawSpec, domainKey);
    (rawSpec as any).taglineOptions = assets.heroHeadlines.slice(0, 3);

    // Validate
    const spec = BrandSpecSchema.parse(rawSpec);
    const specHash = stableHash(spec);

    return {
        brandSpec: spec,
        markdown: renderMarkdown(spec, assets),
        specHash,
        assets
    };
}


/**
 * GENERATE ASSETS
 * Domain-Aware logic.
 */
export function generateAssets(spec: any, domain: keyof typeof DOMAIN_DEFAULTS): BrandAssets {
    const name = spec.productName;
    const audience = spec.audience;
    const outcomeBase = spec.outcome; // Base form "save time"
    const outcome3p = ensureThirdPerson(outcomeBase); // "saves time"
    const category = spec.category;
    const proof = spec.proof;
    const pain = spec.pain;
    const diff = spec.differentiation;

    // Positioning Statement (The source of truth)
    // "For {audience}, {name} is the {category} that {outcome3p}. {proof}."
    // 3rd person required after "that"
    const positioning = finalSanityPass(`For ${audience}, ${name} is the ${category} that ${outcome3p}. ${proof}`);

    // One-Liner
    // "{name} helps {audience} {outcomeBase} with a {category}."
    // Base form required after "helps X ..."
    const oneLiner = finalSanityPass(`${name} helps ${audience} ${outcomeBase} with a ${category}.`.slice(0, 100));

    // Get Pack
    const defaults = DOMAIN_DEFAULTS[domain];

    const headlinesRaw = [
        `${outcome3p}.`, // "Saves time."
        defaults.headlines[0],
        `The ${category} for ${audience}.`,
        diff
    ];
    const heroHeadlines = headlinesRaw.map(s => limitWords(s, 6)).slice(0, 3);

    const subheadlines = [
        `${proof}`,
        `Finally, ${pain} is solved.`,
        defaults.headlines[1] || "Designed for results."
    ].map(s => limitWords(s, 18));

    const benefitBullets = ensureLen([
        `Stop ${pain}.`,
        `${capitalize(outcomeBase)} fast.`,
        `${proof}`,
        `Built for ${audience}.`
    ], 5, defaults.bullets).map(s => limitWords(s, 10));

    // Objection Handling (Generic for now)
    const objectionHandlers = [
        {
            objection: "Why switch?",
            answer: `Because ${pain} costs you time. ${outcome3p} pays for itself.`
        },
        {
            objection: "Is it hard to learn?",
            answer: `No. ${name} is designed for ${audience} to start in minutes.`
        }
    ];

    // Pitch
    const pitch30s = `${name} helps ${audience} ${outcomeBase}. We see that ${pain} is a blocker. That's why we built the ${category} that ${diff}. ${proof} Stop settling and start ${outcomeBase} today.`;

    const notForYouIf = ensureLen([
        `You don't care about ${outcomeBase}.`,
        `You prefer ${pain}.`
    ], 3, ["You want cheap fixes.", "You ignore quality."]);

    const ctaOptions = ensureLen([
        `Start ${outcomeBase}`,
        `Get ${name}`,
        `Join ${audience}`
    ], 3, ["Get Started", "Try Free", "Learn More"]);

    return {
        oneLiner,
        heroHeadlines,
        subheadlines,
        benefitBullets,
        objectionHandlers,
        pitch30s,
        notForYouIf,
        ctaOptions,
        positioning
    };
}

export function renderMarkdown(spec: BrandSpec, assets: BrandAssets): string {
    const t = spec.designTokens;
    return `# Brand Prompt (Copy this)

## 1. Brand Identity
**One-Liner:** ${clean(assets.oneLiner)}
**Positioning:** ${clean(assets.positioning)}

## 2. Strategy
**Target:** ${clean(spec.audience)}
**Pain:** ${clean(spec.pain)}
**Outcome:** ${clean(spec.outcome)}
**Differentiation:** ${clean(spec.differentiation)}
**Proof:** ${clean(spec.proof)}

## 3. Voice Rules
**Sounds Like:** ${spec.voice.soundsLike.join(', ')}
**Never Like:** ${spec.voice.neverLike.join(', ')}
**Banned Words:** ${spec.voice.neverWords.join(', ')}

## 4. Visual Tokens
**Accent:** ${t.accent}
**Base:** ${t.base}
**Ink:** ${t.ink}
**Font:** ${t.font}
**Radius:** ${t.radius}rem

> **Builder Instruction:**
> Paste this entire prompt into your AI builder (Cursor, V0, Bolt) to align it immediately with your brand logic.
`;
}
