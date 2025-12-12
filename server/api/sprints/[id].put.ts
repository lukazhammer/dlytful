import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// PUT /api/sprints/[id] - Update sprint
export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required'
        })
    }

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Sprint ID required'
        })
    }

    const client = await serverSupabaseClient(event)

    // Verify ownership first
    const { data: existing } = await client
        .from('sprints')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!existing) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Sprint not found'
        })
    }

    // Only allow updating certain fields
    const allowedFields = ['inputs', 'outputs', 'label', 'status', 'archetype_primary', 'archetype_secondary']
    const updateData: Record<string, any> = {}

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updateData[field] = body[field]
        }
    }

    const { data: sprint, error } = await client
        .from('sprints')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update sprint'
        })
    }

    return sprint
})
