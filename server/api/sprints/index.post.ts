import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { DiscoveryInputs } from '~/types/sprint'

interface CreateSprintRequest {
    inputs: DiscoveryInputs
    parent_id?: string
    label?: string
}

// POST /api/sprints - Create new sprint
export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required'
        })
    }

    const body = await readBody<CreateSprintRequest>(event)

    if (!body.inputs) {
        throw createError({
            statusCode: 400,
            statusMessage: 'inputs are required'
        })
    }

    const client = await serverSupabaseClient(event)

    const { data: sprint, error } = await client
        .from('sprints')
        .insert([{
            user_id: user.id,
            inputs: body.inputs,
            parent_id: body.parent_id || null,
            label: body.label || null,
            status: 'draft'
        }])
        .select()
        .single()

    if (error) {
        console.error('Create sprint error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create sprint'
        })
    }

    // Update user's sprint count
    await client.rpc('increment_sprint_count', { user_id: user.id }).catch(console.error)

    return sprint
})
