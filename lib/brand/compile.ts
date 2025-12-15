import type { BrandSpec } from "./brandSpec";
import { normalizeBannedWords } from "./normalize";
import {
    extractName, extractCategory, extractAudience,
    extractPain, extractOutcome, extractDifferentiation, extractVoice
} from "./extract";


// Reuse archetype data (or import from app/utils/archetypes if we trust the alias)
// For robustness in this lib file, we'll keep a minimal local copy or try to import if environment allows.
// To avoid "Cannot find module" we will redefine minimal data here as it is safe and deterministic.
const ARCHETYPE_DATA: Record<string, { color: string; voice: string[] }> = {
    'The Innocent': { color: '#3B82F6', voice: ['Optimistic', 'Honest', 'Simple'] },
    'The Sage': { color: '#64748B', voice: ['Knowledgeable', 'Analytical', 'Calm'] },
    'The Explorer': { color: '#22C55E', voice: ['Adventurous', 'Authentic', 'Independent'] },
    'The Outlaw': { color: '#EF4444', voice: ['Disruptive', 'Bold', 'Liberating'] },
    'The Magician': { color: '#A855F7', voice: ['Visionary', 'Charismatic', 'Transformational'] },
    'The Hero': { color: '#F97316', voice: ['Courageous', 'Competent', 'Focused'] },
    'The Lover': { color: '#EC4899', voice: ['Passionate', 'Intimate', 'Sensual'] },
    'The Jester': { color: '#EAB308', voice: ['Playful', 'Humorous', 'Spontaneous'] },
    'The Caregiver': { color: '#10B981', voice: ['Compassionate', 'Nurturing', 'Selfless'] },
    'The Ruler': { color: '#111827', voice: ['Authoritative', 'Controlling', 'Responsible'] },
    'The Creator': { color: '#8B5CF6', voice: ['Creative', 'Imaginative', 'Perfectionist'] },
    'The Everyman': { color: '#6B7280', voice: ['Realistic', 'Empathetic', 'Connection-oriented'] },
};

export function compileBrandSpec(inputs: Record<string, unknown>): { brandSpec: BrandSpec, markdown: string } {
    // 1. Extract
    const name = extractName((inputs.q1_core_what as string) || "");
    const category = extractCategory((inputs.q1_core_what as string) || "");
    const audience = extractAudience((inputs.q2_audience_who as string) || "");
    const pain = extractPain((inputs.q1_core_what as string) || "", (inputs.q6_mission_why as string) || "");
    const outcome = extractOutcome(pain);
    const differentiation = extractDifferentiation((inputs.q7_competitors_differentiation as string) || "");

    // Proof (Default logic per request)
    const rawProof = (inputs.q7_competitors_differentiation as string) || ""; // often proof is mixed with diff/why
    let proof = "works inside your workflow";
    if (rawProof.match(/jira|linear|github|slack/i)) proof = "fits into Jira, Linear, GitHub, Slack";

    // Promise
    const promise = `${outcome} from day one`;

    // Archetype & Voice
    const archName = (inputs.q4_archetype_primary as string) || "The Creator";
    const archData = ARCHETYPE_DATA[archName] || ARCHETYPE_DATA['The Creator']!;

    const voiceSpec = extractVoice(differentiation, (inputs.q9_voice_tone as string) || "", archData);

    // Banned Words: Merge defaults + user input
    const userBanned = normalizeBannedWords(Array.isArray(inputs.q8_banned_words) ? (inputs.q8_banned_words as string[]).join(',') : "");
    // Ensure distinct and max 8
    const uniqueBanned = [...new Set([...voiceSpec.neverWords, ...userBanned])].slice(0, 8);
    voiceSpec.neverWords = uniqueBanned;

    // Visuals
    const vibeTags = Array.isArray(inputs.q3_vibe_adjectives) ? (inputs.q3_vibe_adjectives as string[]).slice(0, 5) : [];

    let radius = 0.5;
    let font = "Inter";
    if (vibeTags.some((v: string) => v.match(/playful|friendly|organic/i))) {
        radius = 1;
        font = "Outfit";
    } else if (vibeTags.some((v: string) => v.match(/serious|corporate|luxury/i))) {
        radius = 0;
        font = "Cormorant";
    }

    const tokens = {
        accent: archData.color,
        ink: "#FFFFFF",
        base: "#0A0A0A",
        radius,
        font
    };

    // Warnings
    const warnings: string[] = [];
    if (!inputs.q1_core_what) warnings.push("Missing core product description.");

    // Taglines
    const taglineOptions = [
        `${name}: ${category} for ${audience}.`,
        `${outcome}.`,
        `The ${category} that ${proof}.`
    ];

    // Visual Rules (Fixed Lists)
    const visualDo = [
        `Use ${tokens.accent} for primary actions.`,
        `Keep layouts clean with ${tokens.radius}rem radius.`,
        `Speak like a ${archName}.`,
        `Emphasize ${outcome}.`,
        `Use high contrast.`,
        `Keep it ${vibeTags[0] || 'minimal'}.`
    ];
    const visualAvoid = [
        `Don't use complex gradients.`,
        `Avoid ambiguous language.`,
        `Never exclude ${audience}.`,
        `No low contrast text.`,
        `Don't clutter the view.`,
        `Never look cheap.`
    ];

    const spec: BrandSpec = {
        name,
        category,
        audience,
        pain,
        outcome,
        differentiation,
        proof,
        promise,
        taglineOptions,
        voice: voiceSpec,
        archetypePrimary: archName,
        vibeTags,
        visualDo,
        visualAvoid,
        tokens,
        warnings
    };

    return {
        brandSpec: spec,
        markdown: renderMarkdown(spec)
    };
}

function renderMarkdown(spec: BrandSpec): string {
    // Strict replacement of any remaining dashes if they sneak in via variables
    const clean = (s: string) => (s || "").replace(/—|--/g, ", ");

    return `1. PROJECT CONTEXT
Name: ${clean(spec.name)}
Category: ${clean(spec.category)}
Audience: ${clean(spec.audience)}

2. POSITIONING
For ${clean(spec.audience)}, ${clean(spec.name)} is ${clean(spec.category)} that ${clean(spec.outcome)} because ${clean(spec.proof)}.

3. PROMISE
${clean(spec.promise)}

4. DIFFERENTIATION
One thing we do: ${clean(spec.differentiation)}

5. VOICE RULES
Sounds like:
${spec.voice.soundsLike.map(s => `- ${clean(s)}`).join('\n')}
Never like:
${spec.voice.neverLike.map(s => `- ${clean(s)}`).join('\n')}
Never words:
${spec.voice.neverWords.map(s => `- ${clean(s)}`).join('\n')}

6. VISUAL DIRECTION
Do:
${spec.visualDo.map(s => `- ${clean(s)}`).join('\n')}
Avoid:
${spec.visualAvoid.map(s => `- ${clean(s)}`).join('\n')}

7. DESIGN TOKENS
Accent: ${spec.tokens.accent}
Ink: ${spec.tokens.ink}
Base: ${spec.tokens.base}
Radius: ${spec.tokens.radius}rem
Font: ${spec.tokens.font}

8. PASTE READY BRAND PROMPT
**Instruction**: You are building the brand for ${clean(spec.name)}.
- **Role**: ${spec.archetypePrimary}
- **Tone**: ${spec.voice.soundsLike.join(', ')}
- **Constraint**: Never use words like ${spec.voice.neverWords.slice(0, 3).join(', ')}.
- **UI**: Use ${spec.tokens.font} font and ${spec.tokens.radius}rem border radius.

9. WARNINGS
${spec.warnings.length > 0 ? spec.warnings.map(s => `- ${s}`).join('\n') : "None."}
`;
}
