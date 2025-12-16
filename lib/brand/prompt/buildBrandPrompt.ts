
import type { MixedStyleSpec } from '../tone/schema';
import { createHash } from 'node:crypto';

export interface BrandPromptContext {
    productName: string;
    category: string;
    audience: string;
    outcome: string;
    proof: string;
    archetype: string;
    toneTags: string[];
    palette: {
        accent: string;
        base: string;
        ink: string;
        font: string;
        radius: number | string;
    };
    assets: {
        oneLiner: string;
        positioning: string;
        headlines: string[];
    };
    mixedSpec: MixedStyleSpec;
}

export function buildBrandPrompt(ctx: BrandPromptContext): { text: string; checksum: string } {
    const { mixedSpec, palette } = ctx;

    const sections: string[] = [];

    // 1. HEADER
    sections.push(`# BRAND PROMPT: ${ctx.productName}`);
    sections.push(`> Use this prompt to instruct AI builders (Lovable, Replit, v0, etc.) on the exact voice and style for this product.`);

    // 2. NON-NEGOTIABLES
    sections.push(`## NON-NEGOTIABLES`);
    sections.push(`1. **No "AI Slop"**: Do not use words like "seamless", "cutting-edge", "revolutionary", "robust", "delighted".`);
    sections.push(`2. **Punctuation**: No exclamation marks (!). No em-dashes (—).`);
    sections.push(`3. **Length**: Keep copy short. If in doubt, cut it by 50%.`);

    if (mixedSpec.constraints.allow_numbers === false) {
        sections.push(`4. **Numbers**: Spell out all numbers (one, two, ten).`);
    }
    if (mixedSpec.constraints.allow_contractions === false) {
        sections.push(`5. **Contractions**: Do not use contractions (cannot, do not, will not).`);
    }

    // 3. IDENTITY
    sections.push(`## BRAND IDENTITY`);
    sections.push(`- **Product**: ${ctx.productName}`);
    sections.push(`- **Category**: ${ctx.category}`);
    sections.push(`- **Audience**: ${ctx.audience}`);
    sections.push(`- **Outcome**: ${ctx.outcome}`);
    sections.push(`- **Proof**: ${ctx.proof}`);
    sections.push(`- **Archetype**: ${ctx.archetype}`);
    sections.push(`- **Tones**: ${ctx.toneTags.join(', ')}`);

    // 4. COPY PATTERNS (The Benchmarks)
    sections.push(`## COPY PATTERNS (THE STANDARD)`);
    sections.push(`Use the following approved copy as your benchmark for voice, rhythm, and attitude. All new copy must match this vibe.`);
    sections.push(``);
    sections.push(`### One Liner`);
    sections.push(`"${ctx.assets.oneLiner}"`);
    sections.push(``);
    sections.push(`### Positioning`);
    sections.push(`"${ctx.assets.positioning}"`);
    sections.push(``);
    sections.push(`### Headlines`);
    ctx.assets.headlines.forEach(h => sections.push(`- "${h}"`));

    // 5. VOICE RULES (From Mixed Spec)
    sections.push(`## VOICE RULES`);
    mixedSpec.instructions.forEach(inst => sections.push(`- ${inst}`));

    if (mixedSpec.banned_lexicon.length > 0) {
        sections.push(``);
        sections.push(`### BANNED WORDS (STRICT)`);
        sections.push(`Do not use: ${mixedSpec.banned_lexicon.slice(0, 20).join(', ')}.`);
    }

    if (mixedSpec.preferred_lexicon.length > 0) {
        sections.push(``);
        sections.push(`### PREFERRED VOCABULARY`);
        sections.push(`Try to use: ${mixedSpec.preferred_lexicon.slice(0, 15).join(', ')}.`);
    }

    // 6. UI TOKENS
    sections.push(`## UI TOKENS`);
    sections.push(`Use these tokens to immediately style the UI:`);
    sections.push('```css');
    sections.push(`:root {`);
    sections.push(`  --primary: ${palette.accent};`);
    sections.push(`  --background: ${palette.base};`);
    sections.push(`  --foreground: ${palette.ink};`);
    sections.push(`  --radius: ${palette.radius}rem;`);
    sections.push(`  --font-sans: '${palette.font}', sans-serif;`);
    sections.push(`}`);
    sections.push('```');
    sections.push(`- **Vibe**: ${ctx.mixedSpec.sliders.formality < 0.5 ? 'Casual & Open' : 'Structured & Professional'} UI density.`);

    // 7. BEHAVIOR
    sections.push(`## INSTRUCTION TO BUILDER`);
    sections.push(`When writing new copy or building UI components, check every sentence against the "NON-NEGOTIABLES" list above. If you find a banned word, rewrite the sentence immediately.`);

    const text = sections.join('\n\n');
    const checksum = createHash('sha256').update(text).digest('hex').substring(0, 8);

    return { text, checksum };
}
