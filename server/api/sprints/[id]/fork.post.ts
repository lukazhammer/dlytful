import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// POST /api/sprints/[id]/fork - Fork a sprint
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

    // Fetch the original sprint
    const { data: original, error: fetchError } = await client
        .from('sprints')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !original) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Sprint not found'
        })
    }

    // Create a new sprint with the same inputs but as a child
    const { data: forked, error: insertError } = await client
        .from('sprints')
        .insert([{
            user_id: user.id,
            parent_id: original.id,
            inputs: original.inputs,
            outputs: {}, // Reset outputs
            label: original.label ? `${original.label} (fork)` : null,
            status: 'draft'
        }])
        .select()
        .single()

    if (insertError) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fork sprint'
        })
    }

    return forked
})
