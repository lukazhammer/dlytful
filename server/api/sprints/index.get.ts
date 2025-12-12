import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// GET /api/sprints - List user's sprints
export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required'
        })
    }

    const client = await serverSupabaseClient(event)

    const { data: sprints, error } = await client
        .from('sprints')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch sprints'
        })
    }

    return sprints
})
