import type { DiscoveryInput } from '../../app/types';
import { ARCHETYPES } from '~/utils/archetypes';

const buildPositioningStatement = (input: DiscoveryInput): string => {
    const audience = input.q2_audience_who || '[Audience]';
    const category = input.q1_core_what || '[Category]';
    const differentiation = input.q7_competitors_differentiation || '[Differentiation]';
    const reason = input.q6_mission_why || '[Reason to Believe]';
    return `For ${audience}, this brand is the ${category} that ${differentiation} because ${reason}.`;
};

const filterBannedWords = (text: string, banned: string[]): string => {
    if (!text || banned.length === 0) return text;
    let clean = text;
    banned.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        clean = clean.replace(regex, '[REDACTED]');
    });
    return clean;
};

export const buildBrandPrompt = (input: DiscoveryInput, tier: 'Free' | 'One' | 'Max' = 'Free'): string => {
    const primary = input.q4_archetype_primary ? ARCHETYPES[input.q4_archetype_primary] : null;
    const secondary = input.q5_archetype_secondary ? ARCHETYPES[input.q5_archetype_secondary] : null;
    const positioning = buildPositioningStatement(input);

    let archetypeSection = '';
    let voiceRules = '';

    if (primary) {
        archetypeSection += `**Primary Archetype:** ${input.q4_archetype_primary}\n> "${primary.motto}"\n${primary.description}\n`;
        voiceRules += `**Sounds Like:** ${input.q3_vibe_adjectives.join(', ')}\n`;
        voiceRules += `**Never Like:** ${input.q8_banned_words.join(', ')}\n`;
    }

    if (secondary) {
        archetypeSection += `\n**Secondary Archetype:** ${input.q5_archetype_secondary}\n${secondary.description}\n`;
    }

    let content = `# BRAND CORE DOCUMENT\n\n## 1. FOUNDATION\n**What:** ${filterBannedWords(input.q1_core_what, input.q8_banned_words)}\n**Why:** ${filterBannedWords(input.q6_mission_why, input.q8_banned_words)}\n\n## 2. POSITIONING STATEMENT\n> ${filterBannedWords(positioning, input.q8_banned_words)}\n\n`;

    if (tier !== 'Free') {
        content += `## 3. ARCHETYPE MIX\n${archetypeSection}\n\n## 4. VOICE GUIDELINES\n${voiceRules}\n**Tone:** ${input.q9_voice_tone}\n\n## 5. VISUAL DIRECTION\n${input.q10_visual_style}\n\n`;
    }

    if (tier === 'Max') {
        content += `## 6. DISCOVERABILITY (Metadata)\n**Title Tag:** ${input.q1_core_what} for ${input.q2_audience_who}\n**Meta Description:** ${positioning}\n\n## 7. AI AGENT SYSTEM PROMPT\n\`\`\`plaintext\nYou are the voice of a brand defined by the ${input.q4_archetype_primary} archetype. \nYour mission is ${input.q6_mission_why}. \nSpeak to ${input.q2_audience_who}. \nNever use these words: ${input.q8_banned_words.join(', ')}. \n\`\`\`\n`;
    }

    if (tier === 'Free') {
        content += `\n---\n*Generated with dlytful.com*`;
    }
    return content.trim();
};

export const enhancePromptTemplate = (field: string, rawInput: string, context: Record<string, unknown>) => `
    Enhance the following brand strategy input for field "${field}".
    Value: "${rawInput}"
    Context: ${JSON.stringify(context || {})}
    
    Make it more professional, impactful, and aligned with modern brand strategy.
`;

export const ENHANCE_SCHEMA = `{
    "enhanced_value": "string",
    "rationale": "string (why this is better)",
    "category_tag": "string (e.g. 'Punchy', 'Emotional', 'Descriptive')"
}`;

export const archetypeRecommendPrompt = (q1: string, q6: string, q3: string[]) => `
    Analyze this brand to recommend the top 3 archetypes.
    Product: ${q1}
    Mission: ${q6}
    Vibe: ${q3?.join(', ')}
    
    Choose from: Innocent, Sage, Explorer, Outlaw, Magician, Hero, Lover, Jester, Everyman, Caregiver, Ruler, Creator.
`;

export const ARCHETYPE_SCHEMA = `{
    "recommendations": [
       { "archetype": "string", "confidence": "number (0-1)", "rationale": "string" }
    ]
}`;
