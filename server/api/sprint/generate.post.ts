import Anthropic from '@anthropic-ai/sdk'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { SYSTEM_PROMPT, buildUserPrompt } from '~/constants/prompts'
import type { GeneratedOutputs, Sprint, DiscoveryInputs } from '~/types/sprint'
import type { User, Tier } from '~/types/user'

interface GenerateRequest {
    sprint_id: string
}

interface GenerateResponse {
    outputs: GeneratedOutputs
}

export default defineEventHandler(async (event): Promise<GenerateResponse> => {
    const body = await readBody<GenerateRequest>(event)

    // 1. Validate request
    if (!body.sprint_id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'sprint_id is required'
        })
    }

    // 2. Validate user authentication
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required'
        })
    }

    const client = await serverSupabaseClient(event)

    // 3. Fetch sprint and verify ownership
    const { data: sprint, error: sprintError } = await client
        .from('sprints')
        .select('*')
        .eq('id', body.sprint_id)
        .single()

    if (sprintError || !sprint) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Sprint not found'
        })
    }

    if (sprint.user_id !== user.id) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Access denied'
        })
    }

    // 4. Fetch user profile to check tier
    const { data: userProfile } = await client
        .from('users')
        .select('tier')
        .eq('id', user.id)
        .single()

    const tier: Tier = (userProfile?.tier as Tier) || 'free'

    // Map tier to prompt tier
    const promptTier = tier === 'free' ? 'zero' : tier === 'one' ? 'one' : 'max'

    // 5. Validate required inputs based on tier
    const inputs = sprint.inputs as DiscoveryInputs

    const requiredFields = ['product_description', 'core_moment', 'current_state']
    const missingFields = requiredFields.filter(field => !inputs[field as keyof DiscoveryInputs])

    if (missingFields.length > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: `Missing required fields: ${missingFields.join(', ')}`
        })
    }

    // 6. Build and call Claude API
    const config = useRuntimeConfig()
    const apiKey = config.anthropicApiKey || process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
        // Return mock data for development
        console.warn('ANTHROPIC_API_KEY not set, returning mock outputs')
        const mockOutputs = generateMockOutputs(inputs, promptTier)

        // Save mock outputs
        await client
            .from('sprints')
            .update({
                outputs: mockOutputs,
                status: 'complete'
            })
            .eq('id', body.sprint_id)

        return { outputs: mockOutputs }
    }

    const anthropic = new Anthropic({ apiKey })

    const userPrompt = buildUserPrompt(inputs as Record<string, string | undefined>, promptTier)

    try {
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4000,
            messages: [
                {
                    role: 'user',
                    content: userPrompt
                }
            ],
            system: SYSTEM_PROMPT
        })

        // 7. Parse response
        const textContent = message.content.find(c => c.type === 'text')
        if (!textContent || textContent.type !== 'text') {
            throw new Error('No text response from Claude')
        }

        // Extract JSON from response
        const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('Could not parse JSON from response')
        }

        const outputs = JSON.parse(jsonMatch[0]) as GeneratedOutputs

        // 8. Save outputs to sprint
        const { error: updateError } = await client
            .from('sprints')
            .update({
                outputs,
                status: 'complete',
                archetype_primary: inputs.archetype_primary || null,
                archetype_secondary: inputs.archetype_secondary || null
            })
            .eq('id', body.sprint_id)

        if (updateError) {
            console.error('Failed to save outputs:', updateError)
        }

        // 9. Return outputs
        return { outputs }

    } catch (error: any) {
        console.error('Claude API error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Generation failed. Please try again.'
        })
    }
})

// Mock outputs for development without API key
function generateMockOutputs(inputs: DiscoveryInputs, tier: 'zero' | 'one' | 'max'): GeneratedOutputs {
    const baseOutputs: GeneratedOutputs = {
        positioning: `${inputs.product_description || 'Your product'} — built for people who care about doing things right.`,
        rebrand_prompt: `# Brand Refresh for Your App

## Visual Identity

**Color Palette:**
- Primary: #FF9A00 (Warm amber for CTAs and key actions)
- Secondary: #007FFF (Clear blue for links and secondary elements)
- Background: #FAF7F2 (Warm cream that feels lived-in)
- Accent: #79B972 (Earthy green for success states)

**Typography:**
- Headlines: Fraunces (serif, bold, characterful)
- Body: Poppins (clean, readable, friendly)

**Component Styling:**
- Buttons: Rounded-lg, generous padding, subtle hover states
- Cards: White backgrounds, subtle shadows, rounded-xl
- Inputs: Light background, clear focus states

## Voice & Tone
Speak like a knowledgeable friend, not a corporation. Be direct, warm, and helpful.

Do not change any features or functionality. Only change how it looks and sounds.`
    }

    if (tier === 'zero') {
        return baseOutputs
    }

    // Add one-tier outputs
    const oneOutputs: GeneratedOutputs = {
        ...baseOutputs,
        foundation_prompt: `# Building ${inputs.product_description || 'Your App'} From Scratch

Start with a warm, approachable design system:

## Design Tokens
- Colors: Primary amber (#FF9A00), secondary blue (#007FFF), cream background
- Spacing: 4px base unit, generous padding
- Border radius: 8px for buttons, 12px for cards

## Typography Scale
- Display: 48px Fraunces
- H1: 36px Fraunces
- H2: 24px Fraunces
- Body: 16px Poppins
- Small: 14px Poppins

## Layout Principles
- Max content width: 1200px
- Generous whitespace between sections
- Clear visual hierarchy
- Mobile-first responsive design`,
        copy_angles: [
            `${inputs.product_description || 'Build'} without the complexity`,
            'Finally, something that just works',
            'Made for builders who ship',
            'Your secret weapon for getting things done'
        ],
        social_bio: `Building ${inputs.product_description || 'tools'} for indie makers. Ship with intention.`,
        voice_rules: {
            sounds_like: ['Knowledgeable friend', 'Confident but humble', 'Direct and clear', 'Warm and approachable'],
            never_like: ['Corporate speak', 'Buzzword soup', 'Overly formal', 'Condescending'],
            never_words: ['leverage', 'synergy', 'solution', 'robust', 'scalable', 'cutting-edge', 'innovative']
        }
    }

    if (tier === 'one') {
        return oneOutputs
    }

    // Add max-tier outputs
    return {
        ...oneOutputs,
        discoverability_prompt: `# SEO & Discoverability Setup

## Meta Tags
- Title format: "[Page Name] | ${inputs.product_description || 'Your Product'}"
- Description: Start with the benefit, end with a call to action
- Keywords: Focus on what users search for, not what you call it

## Open Graph
- og:title: Same as page title
- og:description: Compelling one-liner about the value
- og:image: 1200x630px with your logo and a clear visual

## Structured Data
Add JSON-LD for:
- Organization
- Product (if applicable)
- FAQPage for common questions`,
        agent_prompt: `You are the AI assistant for ${inputs.product_description || 'this product'}.

## Personality
- Friendly and helpful, like a knowledgeable coworker
- Direct and practical, focused on solutions
- Patient with beginners, efficient with experts

## Knowledge Boundaries
- You know everything about the product and its features
- For pricing questions, direct to the pricing page
- For bugs, help troubleshoot then suggest contacting support

## Response Style
- Keep answers concise (2-3 paragraphs max)
- Use bullet points for lists
- Include relevant links when helpful
- End with a follow-up question or next step

## Tone
Match the brand voice: warm, direct, never corporate.`
    }
}
