import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT, buildUserPrompt } from '~/constants/prompts'
import type { GeneratedOutputs, DiscoveryInputs } from '~/types/sprint'
import type { Tier } from '~/types/user'

// POST /api/sprints/[id]/generate - Generate outputs for a sprint
export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required'
        })
    }

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Sprint ID required'
        })
    }

    const client = await serverSupabaseClient(event)

    // Fetch sprint
    const { data: sprint, error: sprintError } = await client
        .from('sprints')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (sprintError || !sprint) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Sprint not found'
        })
    }

    // Fetch user tier
    const { data: userProfile } = await client
        .from('users')
        .select('tier')
        .eq('id', user.id)
        .single()

    const tier: Tier = (userProfile?.tier as Tier) || 'free'
    const promptTier = tier === 'free' ? 'zero' : tier === 'one' ? 'one' : 'max'

    const inputs = sprint.inputs as DiscoveryInputs

    // Validate required inputs
    if (!inputs.product_description || !inputs.core_moment) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required inputs: product_description and core_moment are required'
        })
    }

    const config = useRuntimeConfig()
    const apiKey = config.anthropicApiKey || process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
        // Return mock data for development
        const mockOutputs = generateMockOutputs(inputs, promptTier)

        await client
            .from('sprints')
            .update({ outputs: mockOutputs, status: 'complete' })
            .eq('id', id)

        return { outputs: mockOutputs }
    }

    const anthropic = new Anthropic({ apiKey })
    const userPrompt = buildUserPrompt(inputs as Record<string, string | undefined>, promptTier)

    try {
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4000,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userPrompt }]
        })

        const textContent = message.content.find(c => c.type === 'text')
        if (!textContent || textContent.type !== 'text') {
            throw new Error('No text in response')
        }

        const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('No JSON in response')
        }

        const outputs = JSON.parse(jsonMatch[0]) as GeneratedOutputs

        await client
            .from('sprints')
            .update({
                outputs,
                status: 'complete',
                archetype_primary: inputs.archetype_primary,
                archetype_secondary: inputs.archetype_secondary
            })
            .eq('id', id)

        return { outputs }

    } catch (error: any) {
        console.error('Generation error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Generation failed. Please try again.'
        })
    }
})

function generateMockOutputs(inputs: DiscoveryInputs, tier: 'zero' | 'one' | 'max'): GeneratedOutputs {
    const base: GeneratedOutputs = {
        positioning: `${inputs.product_description} — built for people who care.`,
        rebrand_prompt: `# Brand Refresh

## Colors
- Primary: #FF9A00 (Warm amber)
- Secondary: #007FFF (Clear blue)
- Background: #FAF7F2 (Cream)

## Typography
- Headlines: Fraunces
- Body: Poppins

## Style
Warm, approachable, not corporate. Focus on clarity and craft.`
    }

    if (tier === 'zero') return base

    const one: GeneratedOutputs = {
        ...base,
        foundation_prompt: `Build with warmth and intention. Use the color palette and typography above.`,
        copy_angles: ['Built different', 'For builders who ship', 'Finally, it just works'],
        social_bio: 'Building tools for makers. Ship with intention.',
        voice_rules: {
            sounds_like: ['Helpful friend', 'Confident', 'Clear'],
            never_like: ['Corporate', 'Salesy', 'Jargon-heavy'],
            never_words: ['leverage', 'synergy', 'solution']
        }
    }

    if (tier === 'one') return one

    return {
        ...one,
        discoverability_prompt: 'Add clear meta tags, OG images, and structured data.',
        agent_prompt: 'You are a helpful assistant. Be clear, friendly, and concise.'
    }
}
