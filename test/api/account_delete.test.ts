import { describe, it, expect, vi } from 'vitest'

// Stub global defineEventHandler
vi.stubGlobal('defineEventHandler', (handler: any) => handler)
// Stub global useRuntimeConfig
vi.stubGlobal('useRuntimeConfig', () => ({ supabaseServiceKey: 'mock-service-key' }))
// Stub global createError
vi.stubGlobal('createError', (err: any) => err)

// Mock the #supabase/server module
vi.mock('#supabase/server', () => ({
    serverSupabaseClient: vi.fn(),
    serverSupabaseServiceRole: vi.fn(),
    serverSupabaseUser: vi.fn()
}))

// Mock console
vi.spyOn(console, 'error').mockImplementation(() => { })

describe('Account Delete API', () => {
    it('deletes profile and user', async () => {
        // Import dependencies to mock them
        const { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } = await import('#supabase/server')

        // Mock user
        vi.mocked(serverSupabaseUser).mockResolvedValue({ id: 'user-123' } as any)

        // Mock client / DB response
        const mockDelete = vi.fn().mockResolvedValue({ error: null })
        vi.mocked(serverSupabaseClient).mockResolvedValue({
            from: () => ({
                delete: () => ({
                    eq: mockDelete
                })
            })
        } as any)

        // Mock admin client
        const mockDeleteUser = vi.fn().mockResolvedValue({ error: null })
        vi.mocked(serverSupabaseServiceRole).mockReturnValue({
            auth: {
                admin: {
                    deleteUser: mockDeleteUser
                }
            }
        } as any)

        // Dynamic import
        const { default: MyDeleteHandler } = await import('../../server/api/account/delete.post')

        const response = await MyDeleteHandler({ context: {} } as any)

        expect(response.success).toBe(true)
        // Check if profile delete was called
        expect(mockDelete).toHaveBeenCalledWith('id', 'user-123')
        // Check if admin delete was called
        expect(mockDeleteUser).toHaveBeenCalledWith('user-123')
    })
})
