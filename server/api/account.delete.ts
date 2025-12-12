import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// DELETE /api/account - Delete user account
export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required'
        })
    }

    const client = await serverSupabaseClient(event)

    try {
        // Delete all user's sprints first
        await client
            .from('sprints')
            .delete()
            .eq('user_id', user.id)

        // Delete user profile
        await client
            .from('users')
            .delete()
            .eq('id', user.id)

        // Note: The actual auth user deletion requires admin privileges
        // In a production app, you'd use a server-side Supabase admin client
        // For now, we delete the profile data and recommend signing out

        return { success: true }
    } catch (error: any) {
        console.error('Account deletion error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete account'
        })
    }
})
