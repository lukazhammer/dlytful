import { describe, it, expect, vi } from 'vitest'

// Stub global defineEventHandler immediately
// Note: This works here because we won't import the handler statically
vi.stubGlobal('defineEventHandler', (handler: any) => handler)

// Mock the #supabase/server module
vi.mock('#supabase/server', () => ({
    serverSupabaseClient: vi.fn(),
    serverSupabaseServiceRole: vi.fn(),
    serverSupabaseUser: vi.fn()
}))

// Mock console to keep output clean
vi.spyOn(console, 'error').mockImplementation(() => { })

describe('Account Export API', () => {
    it('returns user profile data', async () => {
        // Import dependencies to mock them
        const { serverSupabaseUser, serverSupabaseClient } = await import('#supabase/server')

        // Setup mocks
        vi.mocked(serverSupabaseUser).mockResolvedValue({
            id: 'user-123',
            email: 'test@example.com',
            created_at: '2023-01-01',
            last_sign_in_at: '2023-01-02'
        } as any)

        vi.mocked(serverSupabaseClient).mockResolvedValue({
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: () => Promise.resolve({ data: { full_name: 'Test User' } })
                    })
                })
            })
        } as any)

        // Dynamic import of the handler AFTER globals/mocks are set
        const { default: MyExportHandler } = await import('../../server/api/account/export.get')

        const response = await MyExportHandler({ context: {} } as any)

        expect(response.user.id).toBe('user-123')
        expect(response.profile.full_name).toBe('Test User')
        expect(response.exported_at).toBeDefined()
    })
})
