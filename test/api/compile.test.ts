import { describe, it, expect, vi } from 'vitest'
import { compileBrandSpec } from '../../lib/brand/compile'

// We cannot easily mock the full Nitro/Nuxt environment in a unit test context for the handler
// but we CAN verify that our compile logic is importable and works, and that the persistence logic
// structure is correct.

// Ideally, this file would be an integration test hitting the running server, but
// `npm run test` is currently unit tests.
// So we will verify the core function that the endpoint calls is the correct one 
// and that valid inputs produce the expected structure.

describe('API Logic: Compile', () => {
    it('compileBrandSpec produces expected output keys for the endpoint', () => {
        const input = {
            q1_core_what: 'Test Product',
            q2_audience_who: 'Testers',
            q3_vibe_adjectives: ['Fast']
        }

        const result = compileBrandSpec(input)

        expect(result).toHaveProperty('brandSpec')
        expect(result).toHaveProperty('markdown')
        expect(result).toHaveProperty('specHash')

        expect(typeof result.specHash).toBe('string')
        expect(result.specHash.length).toBeGreaterThan(0)
    })

    // Test that specHash is deterministic here as well, just in case
    it('produces deterministic hash', () => {
        const input = { q1_core_what: 'A' }
        const r1 = compileBrandSpec(input)
        const r2 = compileBrandSpec(input)
        expect(r1.specHash).toBe(r2.specHash)
    })
})
