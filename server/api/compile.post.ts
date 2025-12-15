import { compileBrandSpec } from '../../lib/brand/compile'
import { serverSupabaseClient } from '#supabase/server'
import type { Database, Json } from '~/types/database.types'

type SprintInsert = Database['public']['Tables']['sprints']['Insert']

const KNOWN_INPUT_KEYS = [
    'q1_core_what',
    'q2_audience_who',
    'q3_vibe_adjectives',
    'q4_archetype_primary',
    'q6_mission_why',
    'q7_competitors_differentiation',
    'q8_banned_words',
    'q9_voice_tone'
];

function pickInputs(body: Record<string, unknown>): Record<string, unknown> {
    const picked: Record<string, unknown> = {};
    for (const key of KNOWN_INPUT_KEYS) {
        if (key in body) {
            picked[key] = body[key];
        }
    }
    return picked;
}

function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (!isRecord(body)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
    }

    // 1. Compile Deterministically
    const { brandSpec, markdown, specHash, assets } = compileBrandSpec(body)

    // 2. Persist (if authenticated)
    const client = await serverSupabaseClient<Database>(event)
    const { data: { user } } = await client.auth.getUser()

    if (user) {
        // Shape matches SprintInsert but we omit explicit type to avoid TS inference issues with Json fields
        const payload = {
            user_id: user.id,
            inputs: pickInputs(body) as Json,
            // Store strict spec + separate assets in unlocks 
            // (We wrap safely or merge? Merging keeps simple frontend access if it uses loose types, 
            // but wrapper is cleaner. Let's merge for now to minimize frontend breakage, 
            // or better: store { brandSpec, assets } matching the API response structure? 
            // Existing frontend expects attributes at top level of result.brandSpec. 
            // Let's store { ...brandSpec, assets } so it looks like the old object?)
            // Actually, the prompt wants to fix the server crash. 
            // If the crash was strictly caused by validation somewhere, separating is key.
            // Let's store a merged object to be helpful to "Resume". 
            // But w/ strict types removed from schema, we must be careful.
            // Let's just store the brandSpec for now. If assets are deterministic, they can be re-derived or we add them.
            // Wait, "Resume" logic is just a GET /latest. If that returns just JSON, we need assets there too.
            // Let's store merged for utility, assuming DB schema constraint isn't Zod-enforced on write.
            unlocks: { ...brandSpec, assets } as unknown as Json,
            brand_prompt: markdown,
            // Mark as complete since this is a compiler run
            current_step: 99,
            is_complete: true,
            // Added via migration; types now reflect this
            spec_hash: specHash
        }

        // UPSERT: If same user+specHash exists, update it (e.g. timestamp via trigger)
        // or just ensure it exists.
        // TypeScript inference fails for Supabase client despite manual type patch, so we cast to any.
        const { error } = await client
            .from('sprints')
            .upsert(payload as any, { onConflict: 'user_id,spec_hash' })

        if (error) {
            console.error('Sprint persistence failed', error)
            // We do not fail the request if persistence fails, just log it.
        }
    }

    return { brandSpec, markdown, specHash, assets }
})
