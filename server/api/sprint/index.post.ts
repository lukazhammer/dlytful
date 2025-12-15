import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'
import { handleSupabaseError } from '../../lib/db'

type SprintInsert = Database['public']['Tables']['sprints']['Insert']
type SprintRow = Database['public']['Tables']['sprints']['Row']

function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null
}

function asObject(v: unknown): Record<string, unknown> {
    return isRecord(v) ? v : {}
}

function asNumber(v: unknown, fallback: number): number {
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string') {
        const n = Number(v)
        if (Number.isFinite(n)) return n
    }
    return fallback
}

function asString(v: unknown, fallback = ''): string {
    return typeof v === 'string' ? v : fallback
}

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event)

    const { data: authData, error: authError } = await client.auth.getUser()
    if (authError) return handleSupabaseError(authError)

    const user = authData.user
    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const body = await readBody(event)
    if (!isRecord(body)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
    }

    // Accept both currentStep and current_step from clients, normalize to DB column current_step.
    const currentStep = asNumber(body.currentStep ?? body.current_step, 1)

    const payload: SprintInsert = {
        user_id: user.id,
        inputs: asObject(body.inputs),
        current_step: currentStep,
        unlocks: asObject(body.unlocks),
        brand_prompt: asString(body.brandPrompt ?? body.brand_prompt, ''),
    }

    const { data, error } = await client
        .from('sprints')
        .insert(payload)
        .select()
        .single<SprintRow>()

    if (error) return handleSupabaseError(error)

    return { ok: true, sprint: data }
})
