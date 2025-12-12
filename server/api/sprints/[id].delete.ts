import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// DELETE /api/sprints/[id] - Delete a sprint
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

    // Verify ownership
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

    // Delete sprint
    const { error } = await client
        .from('sprints')
        .delete()
        .eq('id', id)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete sprint'
        })
    }

    return { success: true }
})
