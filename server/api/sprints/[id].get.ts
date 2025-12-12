import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// GET /api/sprints/[id] - Get single sprint
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

    return sprint
})
