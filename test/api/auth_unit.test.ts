import { describe, it, expect, vi } from 'vitest'
import type { H3Event } from 'h3'

// Mock global createError
vi.stubGlobal('createError', (err: any) => err)

// Mock the #supabase/server module
vi.mock('#supabase/server', () => ({
    serverSupabaseUser: vi.fn()
}))

import { serverSupabaseUser } from '#supabase/server'
// Import the function under test AFTER mocking
import { requireUser } from '../../server/utils/auth'

describe('requireUser', () => {
    it('throws 401 if user is not authenticated', async () => {
        // Mock serverSupabaseUser to return null
        vi.mocked(serverSupabaseUser).mockResolvedValue(null)

        const mockEvent = {} as H3Event

        try {
            await requireUser(mockEvent)
            expect.fail('Should have thrown an error')
        } catch (error: any) {
            expect(error.statusCode).toBe(401)
            expect(error.statusMessage).toBe('Unauthorized')
        }
    })

    it('returns user if authenticated', async () => {
        const mockUser = { id: 'user-123', email: 'test@example.com' }
        // Mock serverSupabaseUser to return user
        vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)

        const mockEvent = {} as H3Event

        const user = await requireUser(mockEvent)
        expect(user).toEqual(mockUser)
    })
})
