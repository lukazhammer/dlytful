import type { DiscoveryInput, BrandArchetype } from '~/types';
import { ARCHETYPES } from '~/utils/archetypes';

const buildPositioningStatement = (input: DiscoveryInput): string => {
  // "For {targetAudience}, {brandName} is the {category} that {differentiation} because {reasonToBelieve}."
  // Mapping:
  // BrandName: "This Brand" (until we have a name input)
  // Category: Derived from Q1 (or just used as Q1)
  // ReasonToBelieve: Q6 (Mission/Why)

  const audience = input.q2_audience_who || '[Audience]';
  const category = input.q1_core_what || '[Category]';
  const differentiation = input.q7_competitors_differentiation || '[Differentiation]';
  const reason = input.q6_mission_why || '[Reason to Believe]';

  return `For ${audience}, this brand is the ${category} that ${differentiation} because ${reason}.`;
};



// --- DISTILLED LOGIC ---

const getDesignTokens = (archetype: string | null, vibes: string[]) => {
  // Default Guide
  const tokens = {
    color: '#3B82F6', // Default Blue
    radius: '0.5rem',
    font: 'Inter, sans-serif',
    density: 'Comfortable'
  };

  if (!archetype) return tokens;

  // Simple Mappings based on Archetypes
  const arch = ARCHETYPES[archetype as BrandArchetype];
  if (arch) {
    tokens.color = arch.color;
  }

  // Vibe refinements
  const joinedVibes = vibes.join(' ').toLowerCase();

  if (joinedVibes.includes('playful') || joinedVibes.includes('fun')) {
    tokens.radius = '1rem (Rounded)';
    tokens.font = 'Outfit, sans-serif';
    tokens.density = 'Spacious';
  } else if (joinedVibes.includes('serious') || joinedVibes.includes('corporate')) {
    tokens.radius = '0px (Sharp)';
    tokens.font = 'Roboto, sans-serif';
    tokens.density = 'Compact';
  } else if (joinedVibes.includes('luxury') || joinedVibes.includes('premium')) {
    tokens.radius = '0.25rem (Subtle)';
    tokens.font = 'Cormorant Garamond, serif';
    tokens.density = 'Spacious';
  }

  return tokens;
};

export const buildDistilledPrompt = (input: DiscoveryInput): string => {
  const tokens = getDesignTokens(input.q4_archetype_primary, input.q3_vibe_adjectives);
  const positioning = buildPositioningStatement(input);
  const banned = input.q8_banned_words.length > 0 ? `NEVER use these words: ${input.q8_banned_words.join(', ')}` : '';

  return `
# CONTEXT FOR AI AGENT (Cursor/Replit/Bolt)
**Role:** You are building a specific Brand Interface.
**Core Objective:** Create a ${input.q1_core_what || 'web product'} for ${input.q2_audience_who || 'users'}.

# DESIGN SYSTEM TOKENS
- **Primary Color:** ${tokens.color}
- **Border Radius:** ${tokens.radius}
- **Typography:** ${tokens.font}
- **Layout Density:** ${tokens.density}
- **Visual Vibe:** ${input.q10_visual_style || 'Clean and modern'}

# CONTENT GUIDELINES
- **Voice:** ${input.q9_voice_tone || 'Professional'}
- **Positioning:** "${positioning}"
- **Constraint:** ${banned}

# INSTRUCTION
Build the landing page and core dashboard using these tokens. Ensure the "Mission" (${input.q6_mission_why}) is clear in the Hero section.
`.trim();
}

export const buildBrandPrompt = (
  input: DiscoveryInput,
  tier: 'Free' | 'One' | 'Max' = 'Free'
): string => {
  // If tier is 'Max' or just general modern usage, prefer the Distilled version?
  // Let's keep the old comprehensive one for 'One' tier, but use Distilled for 'Copy' action if desired.
  // For now, let's keep buildBrandPrompt as usage of the detailed document, 
  // but we might want to expose buildDistilledPrompt separately or integrate it.

  // MERGING Logic: The user wants "Lovable/Replit" friendly. 
  // Let's make the "Max" tier OR a specific "Distilled" toggle use the new format.
  // For this refactor, I will append the Distilled Instruction at the top of the "Free/One" prompt 
  // so it's immediately useful for agents, followed by the deep dive.

  // Re-assembling the "Deep Dive" part from previous logic
  const distilled = buildDistilledPrompt(input);
  let archetypeText = `Primary Archetype: ${input.q4_archetype_primary || 'Undefined'}`;
  const primary = input.q4_archetype_primary ? ARCHETYPES[input.q4_archetype_primary] : null;

  if (primary) archetypeText += ` - ${primary.description}`;

  const detailedContent = `
## DETAILED BRAND CONTEXT
**Mission:** ${input.q6_mission_why}
**Audience:** ${input.q2_audience_who}
**Differentiation:** ${input.q7_competitors_differentiation}
**Archetypes:** ${archetypeText}
  `.trim();

  // FINAL OUTPUT CONSTRUCTION
  let finalOutput = distilled;

  if (tier !== 'Free') {
    finalOutput += `\n\n---\n\n${detailedContent}`;
  }

  if (tier === 'Free') {
    finalOutput += `\n\n---\n*Generated with dlytful.com*`;
  }

  return finalOutput;
};

export const enhancePromptTemplate = (field: string, rawInput: string) => {
  return `
You are an expert brand strategist. Your goal is to refine raw user thoughts into polished, professional brand strategy language.
Field: ${field}
Raw Input: "${rawInput}"

Instructions:
1. Improve clarity and impact.
2. Maintain the core meaning (do not halllucinate facts).
3. Use professional, concise terminology.
4. Return ONLY the enhanced text. No preamble.
  `.trim();
};
