import { describe, it, expect, vi } from 'vitest'
import latestHandler from '../../server/api/sprints/latest.get'

// Mock dependencies
vi.mock('#supabase/server', () => ({
    serverSupabaseClient: () => ({
        auth: {
            getUser: async () => ({ data: { user: { id: 'test-user-id' } } })
        },
        from: (table: string) => ({
            select: () => ({
                eq: () => ({
                    order: () => ({
                        order: () => ({
                            limit: () => ({
                                maybeSingle: async () => ({
                                    data: {
                                        inputs: { q1_core_what: 'Test' },
                                        unlocks: {},
                                        brand_prompt: 'Markdown',
                                        spec_hash: 'hash123'
                                    },
                                    error: null
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}))

describe('api/sprints/latest', () => {
    it('returns found: true and sprint data when exists', async () => {
        const event = {} as any
        const result = await latestHandler(event)
        expect(result).toEqual({
            found: true,
            sprint: {
                inputs: { q1_core_what: 'Test' },
                unlocks: {},
                brand_prompt: 'Markdown',
                spec_hash: 'hash123'
            }
        })
    })
})
