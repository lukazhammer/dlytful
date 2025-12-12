// Prompt templates for dlytful generation

export const SYSTEM_PROMPT = `You are a brand strategist who translates product descriptions into clear, actionable brand direction. You write for indie developers who use tools like Bolt, Cursor, and Replit.

Your outputs should be:
- Immediately usable (copy-paste ready)
- Warm and human, never corporate
- Specific and concrete, not vague
- Focused on visual and verbal identity

Never use words like: synergy, leverage, solution, cutting-edge, innovative, seamless, robust.`

export const OUTPUT_REQUIREMENTS = {
    zero: `Generate ONLY these outputs in JSON format:
{
  "positioning": "One sentence positioning statement that captures the essence of the product",
  "rebrand_prompt": "A 2-3 paragraph prompt that can be pasted into Bolt to rebrand an existing app. Include specific color palette (hex codes), typography recommendations, and overall visual direction."
}`,

    one: `Generate these outputs in JSON format:
{
  "positioning": "One sentence positioning statement that captures the essence of the product",
  "rebrand_prompt": "A detailed 4-5 paragraph prompt for Bolt to completely rebrand an existing app. Include specific color palette (hex codes), typography recommendations (Google Fonts), spacing philosophy, and component styling guidance.",
  "foundation_prompt": "A detailed prompt for building a new app from scratch with this brand identity baked in. Include design system basics, component styling, and UI patterns.",
  "copy_angles": ["3-5 different marketing angles or taglines", "each highlighting a different benefit", "suitable for landing pages or ads"],
  "social_bio": "A Twitter/social bio under 160 characters",
  "voice_rules": {
    "sounds_like": ["3-4 descriptors of how the brand voice sounds", "e.g. 'confident but not arrogant'"],
    "never_like": ["3-4 anti-descriptors of what to avoid", "e.g. 'corporate jargon'"],
    "never_words": ["5-10 specific words or phrases to never use"]
  }
}`,

    max: `Generate these outputs in JSON format:
{
  "positioning": "One sentence positioning statement that captures the essence of the product",
  "rebrand_prompt": "A detailed 4-5 paragraph prompt for Bolt to completely rebrand an existing app. Include specific color palette (hex codes), typography recommendations (Google Fonts), spacing philosophy, and component styling guidance.",
  "foundation_prompt": "A detailed prompt for building a new app from scratch with this brand identity baked in. Include design system basics, component styling, and UI patterns.",
  "copy_angles": ["3-5 different marketing angles or taglines", "each highlighting a different benefit", "suitable for landing pages or ads"],
  "social_bio": "A Twitter/social bio under 160 characters",
  "voice_rules": {
    "sounds_like": ["3-4 descriptors of how the brand voice sounds", "e.g. 'confident but not arrogant'"],
    "never_like": ["3-4 anti-descriptors of what to avoid", "e.g. 'corporate jargon'"],
    "never_words": ["5-10 specific words or phrases to never use"]
  },
  "discoverability_prompt": "A prompt to inject SEO metadata, Open Graph tags, and structured data into the HTML. Include specific title formats, description templates, and social sharing images guidance.",
  "agent_prompt": "A system prompt for an AI assistant that represents this product. Define personality, tone, knowledge boundaries, and response style."
}`
}

export const buildUserPrompt = (inputs: Record<string, string | undefined>, tier: 'zero' | 'one' | 'max'): string => {
    const sections = [
        `Based on this product discovery:`,
        '',
        `PRODUCT: ${inputs.product_description || 'Not provided'}`,
        `CORE MOMENT: ${inputs.core_moment || 'Not provided'}`,
        `CURRENT STATE: ${inputs.current_state || 'Not provided'}`,
    ]

    // Add tier-specific inputs for one and max
    if (tier !== 'zero') {
        sections.push(
            `TARGET PERSONA: ${inputs.target_persona || 'Not provided'}`,
            `WHAT THEY'D SAY: ${inputs.friend_description || 'Not provided'}`,
            `PRIOR FRUSTRATION: ${inputs.prior_frustration || 'Not provided'}`,
            `NOT LIKE THIS: ${inputs.not_like || 'Not provided'}`,
            `JARGON CHECK: ${inputs.jargon_check || 'Not provided'}`,
            `OPPOSITE: ${inputs.opposite || 'Not provided'}`,
            `PERFECT DAY FEELING: ${inputs.perfect_day || 'Not provided'}`,
            `PRIMARY ARCHETYPE: ${inputs.archetype_primary || 'Not provided'}`,
            `SECONDARY ARCHETYPE: ${inputs.archetype_secondary || 'Not provided'}`
        )
    }

    sections.push('', OUTPUT_REQUIREMENTS[tier])

    return sections.join('\n')
}

export const REBRAND_TEMPLATE = `I have an existing app. Keep all current functionality exactly as is.

Apply these brand changes:

## Product
{{positioning}}

## Target User
{{persona_summary}}

They would describe this as: "{{friend_description}}"

## Brand Energy
Primary: {{archetype_primary}} — {{archetype_primary_description}}
Secondary: {{archetype_secondary}} — {{archetype_secondary_description}}

## Visual Identity

### Colors
- Primary: {{primary_color}} — use for CTAs and key actions
- Secondary: {{secondary_color}} — use for accents and highlights
- Background: {{background_color}}
- Accent: {{accent_color}} — sparingly

### Typography
- Headlines: {{headline_font}}
- Body: {{body_font}}

### Energy
{{perfect_day_feeling}}

## Voice
- Sounds like: {{sounds_like}}
- Never sounds like: {{never_like}}
- Never use: {{never_words}}

## Avoid
{{not_like_summary}}

Do not change any features or functionality. Only change how it looks and sounds.`

export const FOUNDATION_TEMPLATE = `Build a new app with this brand identity from the start:

## Product Vision
{{positioning}}

## Target User
{{persona_summary}}

## Design System

### Colors
- Primary: {{primary_color}}
- Secondary: {{secondary_color}}
- Background: {{background_color}}
- Accent: {{accent_color}}

### Typography
- Headlines: {{headline_font}} — bold, confident
- Body: {{body_font}} — readable, friendly

### Components
- Buttons: rounded corners, solid fills for primary actions
- Cards: subtle shadows, generous padding
- Inputs: clear labels, helpful placeholders

### Spacing
- Use consistent spacing scale
- Generous whitespace
- Clear visual hierarchy

## Voice & Tone
{{voice_rules}}

## Brand Energy
Think: {{perfect_day_feeling}}`
