import { serverSupabaseServiceRole, serverSupabaseClient } from '#supabase/server'
import { requireUser } from '../../utils/requireUser'


export default defineEventHandler(async (event) => {
    const user = await requireUser(event)

    // 1. Delete profile row explicitly (User context)
    // Even with cascade, deleting it explicitly ensures we can return errors if RLS fails
    // or if we want to log it.
    const userClient = await serverSupabaseClient(event)
    const { error: profileError } = await userClient
        .from('profiles')
        .delete()
        .eq('id', user.id)

    // We don't throw here if it fails, maybe it doesn't exist? 
    // But strict compliance might want it gone.
    // If cascade is on, the next step will kill it anyway.
    // We proceed to kill the account.

    // 2. Use service role to delete user from auth.users
    // This requires generating a client with the service key
    const serviceKey = useRuntimeConfig().supabaseServiceKey

    if (!serviceKey) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server configuration error: Missing service key'
        })
    }

    const adminClient = serverSupabaseServiceRole(event)

    // Verify it's the same user or just use user.id
    const { error: authError } = await adminClient.auth.admin.deleteUser(user.id)

    if (authError) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete account: ' + authError.message
        })
    }

    return { success: true }
})
