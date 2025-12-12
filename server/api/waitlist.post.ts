import { serverSupabaseClient } from '#supabase/server'
import { sendWelcomeEmail } from '../utils/sendWelcome'

interface WaitlistRequest {
    email: string
    source?: string
    interested_tier?: string
}

export default defineEventHandler(async (event) => {
    const body = await readBody<WaitlistRequest>(event)

    // 1. Validate email
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Please enter a valid email'
        })
    }

    const client = await serverSupabaseClient(event)

    // 2. Check overlap (idempotency)
    // Assuming 'waitlist' table exists. unique constraint on email usually handles this too,
    // but checking helps avoid error logs.
    const { data: existing } = await client
        .from('waitlist')
        .select('email')
        .eq('email', body.email)
        .single()

    if (existing) {
        // Already registered, pretend success to avoid leaking status
        // Maybe trigger email again if they lost it? 
        // For now, simpler to just return success.
        return { success: true }
    }

    // 3. Insert into Supabase
    const { error: dbError } = await client
        .from('waitlist')
        .insert([{
            email: body.email,
            source: body.source || 'landing',
            interested_tier: body.interested_tier || null
        }])

    if (dbError) {
        console.error('Supabase Insert Error:', dbError)
        throw createError({
            statusCode: 500,
            statusMessage: 'Something went wrong. Please try again.'
        })
    }

    // 4. Trigger email
    // Fire and forget so we don't block response? 
    // Or await to ensure it sends?
    // Let's await to be safe for this MVP phase.
    await sendWelcomeEmail(body.email)

    return { success: true }
})
