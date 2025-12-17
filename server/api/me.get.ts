import { serverSupabaseClient } from '#supabase/server'
// Nuxt auto-imports server utils, but we can explicit import if needed.
// requireUser is now in server/utils/requireUser.ts, auto-imported as requireUser

export default defineEventHandler(async (event) => {
    const user = await requireUser(event)
    const client = await serverSupabaseClient(event)

    const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return {
        user: {
            id: user.id,
            email: user.email,
            created_at: user.created_at
        },
        profile
    }
})
