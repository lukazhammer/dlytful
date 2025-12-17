import { serverSupabaseClient } from '#supabase/server'
import { requireUser } from '../../utils/requireUser'


export default defineEventHandler(async (event) => {
    const user = await requireUser(event)
    const client = await serverSupabaseClient(event)

    // Fetch profile
    const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch other relevant user data here if needed
    // e.g., projects, generations, etc.

    return {
        user: {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            last_sign_in: user.last_sign_in_at,
        },
        profile,
        exported_at: new Date().toISOString()
    }
})
