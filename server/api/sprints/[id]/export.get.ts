import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Sprint, DiscoveryInputs, GeneratedOutputs } from '~/types/sprint'
import type { Tier } from '~/types/user'
import { getArchetype } from '~/constants/archetypes'

// GET /api/sprints/[id]/export - Export sprint as markdown
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

    // Fetch user tier
    const { data: userProfile } = await client
        .from('users')
        .select('tier')
        .eq('id', user.id)
        .single()

    const tier: Tier = (userProfile?.tier as Tier) || 'free'

    if (tier !== 'max') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Export is only available for dlytful max users'
        })
    }

    // Fetch sprint
    const { data: sprint, error } = await client
        .from('sprints')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error || !sprint) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Sprint not found'
        })
    }

    const inputs = sprint.inputs as DiscoveryInputs
    const outputs = sprint.outputs as GeneratedOutputs

    // Build markdown
    const primaryArchetype = inputs.archetype_primary ? getArchetype(inputs.archetype_primary) : null
    const secondaryArchetype = inputs.archetype_secondary ? getArchetype(inputs.archetype_secondary) : null

    const soundsLike = outputs.voice_rules?.sounds_like?.join('\n- ') || 'Not specified'
    const neverLike = outputs.voice_rules?.never_like?.join('\n- ') || 'Not specified'
    const neverWords = outputs.voice_rules?.never_words?.join(', ') || 'Not specified'
    const copyAngles = outputs.copy_angles?.map((a, i) => `${i + 1}. ${a}`).join('\n') || 'Not generated'

    const markdown = `# Brand Foundation — ${inputs.product_description || 'Your Product'}

*Generated with dlytful*

---

## Positioning

${outputs.positioning || 'Not generated'}

## Target Audience

${inputs.target_persona || 'Not specified'}

They would describe this as: "${inputs.friend_description || 'Not specified'}"

## Brand Archetype

**Primary:** ${primaryArchetype?.name || 'Not selected'} ${primaryArchetype ? `— ${primaryArchetype.description}` : ''}

**Secondary:** ${secondaryArchetype?.name || 'Not selected'} ${secondaryArchetype ? `— ${secondaryArchetype.description}` : ''}

## Voice & Tone

### Sounds Like
- ${soundsLike}

### Never Sounds Like
- ${neverLike}

### Words to Avoid
${neverWords}

---

## Prompts

### Rebrand Prompt

\`\`\`
${outputs.rebrand_prompt || 'Not generated'}
\`\`\`

### Foundation Prompt

\`\`\`
${outputs.foundation_prompt || 'Not generated'}
\`\`\`

### Discoverability Metadata

\`\`\`
${outputs.discoverability_prompt || 'Not generated'}
\`\`\`

### Agent System Prompt

\`\`\`
${outputs.agent_prompt || 'Not generated'}
\`\`\`

---

## Copy Angles

${copyAngles}

## Social Bio

${outputs.social_bio || 'Not generated'}

---

*Exported on ${new Date().toLocaleDateString()}*
`

    // Set headers for file download
    setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
    setHeader(event, 'Content-Disposition', `attachment; filename="brand-foundation-${id}.md"`)

    return markdown
})
