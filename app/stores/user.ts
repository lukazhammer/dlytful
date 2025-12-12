import { defineStore } from 'pinia'
import type { User, Tier } from '~/types/user'
import { TIERS } from '~/constants/tiers'

interface UserState {
    user: User | null
    token: string | null
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        user: null,
        token: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.user && !!state.token,
        tier: (state): Tier => state.user?.tier || 'free',
        tierConfig: (state) => TIERS[state.user?.tier || 'free'],

        canSave(): boolean {
            return this.tierConfig.canSave
        },

        canFork(): boolean {
            return this.tierConfig.canFork
        },

        canExport(): boolean {
            return this.tierConfig.canExport
        }
    },

    actions: {
        setUser(user: User, token: string) {
            this.user = user
            this.token = token

            // Simple manual persistence
            if (process.client) {
                localStorage.setItem('dlytful-user', JSON.stringify(user))
                localStorage.setItem('dlytful-token', token)
            }
        },

        clearUser() {
            this.user = null
            this.token = null

            if (process.client) {
                localStorage.removeItem('dlytful-user')
                localStorage.removeItem('dlytful-token')
            }
        },

        updateTier(tier: Tier) {
            if (this.user) {
                this.user.tier = tier
                if (process.client) {
                    localStorage.setItem('dlytful-user', JSON.stringify(this.user))
                }
            }
        },

        // Initialize from local storage on app start
        init() {
            if (process.client) {
                const userStr = localStorage.getItem('dlytful-user')
                const token = localStorage.getItem('dlytful-token')

                if (userStr && token) {
                    try {
                        this.user = JSON.parse(userStr)
                        this.token = token
                    } catch (e) {
                        console.error('Failed to parse stored user', e)
                        this.clearUser()
                    }
                }
            }
        }
    }
})
