import Anthropic from '@anthropic-ai/sdk'
import type { DiscoveryInputs } from '~/types/sprint'
import { ARCHETYPES } from '~/constants/archetypes'

interface RecommendRequest {
    inputs: Partial<DiscoveryInputs>
}

interface RecommendResponse {
    recommended: string[]
    reasoning: Record<string, string>
}

export default defineEventHandler(async (event): Promise<RecommendResponse> => {
    const body = await readBody<RecommendRequest>(event)

    if (!body.inputs || Object.keys(body.inputs).length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Discovery inputs are required'
        })
    }

    const config = useRuntimeConfig()
    const apiKey = config.anthropicApiKey || process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
        console.warn('ANTHROPIC_API_KEY not set, returning mock recommendations')
        // Return mock data for development
        return {
            recommended: ['explorer', 'creator', 'magician'],
            reasoning: {
                explorer: 'Your product encourages users to discover new possibilities',
                creator: 'You\'re building tools that help people create',
                magician: 'You aim to transform how people work'
            }
        }
    }

    const client = new Anthropic({ apiKey })

    // Build context from inputs
    const inputSummary = Object.entries(body.inputs)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')

    // Build archetype reference
    const archetypeRef = ARCHETYPES.map(a =>
        `- ${a.id} (${a.name}): ${a.description}. Energy: ${a.energy}. Examples: ${a.examples.join(', ')}`
    ).join('\n')

    const prompt = `You are a brand strategist helping indie builders find their brand archetype.

Based on these discovery answers about a product:

${inputSummary}

And these 12 brand archetypes:

${archetypeRef}

Which 2-3 archetypes fit this product best? For each, give ONE short sentence explaining why (max 15 words).

Respond ONLY in this exact JSON format, no other text:
{
  "recommended": ["archetype_id_1", "archetype_id_2"],
  "reasoning": {
    "archetype_id_1": "Reason in one sentence",
    "archetype_id_2": "Reason in one sentence"
  }
}

Use only these valid archetype IDs: innocent, sage, explorer, outlaw, magician, hero, lover, jester, everyman, caregiver, ruler, creator`

    try {
        const message = await client.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 300,
            messages: [{ role: 'user', content: prompt }]
        })

        // Extract text content
        const textContent = message.content.find(c => c.type === 'text')
        if (!textContent || textContent.type !== 'text') {
            throw new Error('No text response from Claude')
        }

        // Parse JSON response
        const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('Could not parse JSON from response')
        }

        const result = JSON.parse(jsonMatch[0]) as RecommendResponse

        // Validate archetype IDs
        const validIds = ARCHETYPES.map(a => a.id)
        result.recommended = result.recommended.filter(id => validIds.includes(id)).slice(0, 3)

        return result
    } catch (error: any) {
        console.error('Claude API error:', error)

        // Fallback to simple keyword matching
        const text = Object.values(body.inputs).join(' ').toLowerCase()
        const fallbackRecommended: string[] = []

        if (text.includes('independent') || text.includes('freedom') || text.includes('adventure')) {
            fallbackRecommended.push('explorer')
        }
        if (text.includes('create') || text.includes('build') || text.includes('make')) {
            fallbackRecommended.push('creator')
        }
        if (text.includes('simple') || text.includes('honest') || text.includes('trust')) {
            fallbackRecommended.push('innocent')
        }
        if (text.includes('fun') || text.includes('playful') || text.includes('joy')) {
            fallbackRecommended.push('jester')
        }

        // Ensure we have at least one recommendation
        if (fallbackRecommended.length === 0) {
            fallbackRecommended.push('creator', 'explorer')
        }

        return {
            recommended: fallbackRecommended.slice(0, 3),
            reasoning: Object.fromEntries(
                fallbackRecommended.map(id => [id, ARCHETYPES.find(a => a.id === id)?.description || ''])
            )
        }
    }
})
