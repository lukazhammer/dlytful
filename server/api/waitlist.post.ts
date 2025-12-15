import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'
import { handleSupabaseError } from '../lib/db'

type WaitlistInsert = Database['public']['Tables']['waitlist']['Insert']

function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null
}

function toEmail(value: unknown): string | null {
    if (typeof value !== 'string') return null
    const email = value.trim().toLowerCase()
    if (!email) return null
    if (!email.includes('@')) return null
    if (email.length > 320) return null
    return email
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!isRecord(body)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
    }

    const email = toEmail(body.email)
    if (!email) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
    }

    const client = await serverSupabaseClient<Database>(event)

    const payload: WaitlistInsert = { email }

    const { error } = await client
        .from('waitlist')
        .upsert(payload as never, { onConflict: 'email' })

    if (error) return handleSupabaseError(error)

    return { ok: true }
})
