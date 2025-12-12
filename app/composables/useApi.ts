import { type UseFetchOptions } from 'nuxt/app'
import { useUIStore } from '~/stores/ui'
import { useAuth } from '~/composables/useAuth'
import { TOAST_MESSAGES } from '~/constants/messages'

export const useApi = () => {
    const user = useSupabaseUser()
    const router = useRouter()

    const handleError = (error: any) => {
        const uiStore = useUIStore()
        const status = error?.response?.status || error?.status || error?.statusCode

        // Session expired
        if (status === 401) {
            uiStore.showToast('error', TOAST_MESSAGES.AUTH_REQUIRED)
            router.push('/login')
            return
        }

        // Upgrade required
        if (status === 402 || status === 403) {
            // The upgrade modal will be triggered by the calling code
            // Just show a toast here
            uiStore.showToast('info', TOAST_MESSAGES.UPGRADE_REQUIRED)
            return
        }

        // Rate limited
        if (status === 429) {
            uiStore.showToast('error', 'Too many requests. Please wait a moment.')
            return
        }

        // Server error
        if (status >= 500) {
            uiStore.showToast('error', 'Server error. Please try again later.')
            return
        }

        // Network error
        if (error.message === 'Failed to fetch' || error.code === 'ECONNREFUSED') {
            uiStore.showToast('error', TOAST_MESSAGES.NETWORK_ERROR)
            return
        }

        // Generic error with message
        const message = error?.data?.message || error?.data?.statusMessage || error?.message
        if (message) {
            uiStore.showToast('error', message)
            return
        }

        // Fallback
        uiStore.showToast('error', 'Something went wrong. Please try again.')
    }

    const fetch = async <T>(url: string, options: UseFetchOptions<T> = {}, showErrors = true) => {
        const defaults: UseFetchOptions<T> = {
            baseURL: '/api',
            headers: user.value ? { Authorization: `Bearer ${user.value.id}` } : {},
            ...options
        }

        try {
            return await $fetch<T>(url, defaults as any)
        } catch (error: any) {
            console.error('API Error:', error)

            if (showErrors) {
                handleError(error)
            }

            throw error
        }
    }

    return {
        get: <T>(url: string, options?: UseFetchOptions<T>) => fetch<T>(url, { ...options, method: 'GET' }),
        post: <T>(url: string, body?: any, options?: UseFetchOptions<T>) => fetch<T>(url, { ...options, method: 'POST', body }),
        put: <T>(url: string, body?: any, options?: UseFetchOptions<T>) => fetch<T>(url, { ...options, method: 'PUT', body }),
        del: <T>(url: string, options?: UseFetchOptions<T>) => fetch<T>(url, { ...options, method: 'DELETE' }),
        // Silent versions that don't show toasts
        silentGet: <T>(url: string, options?: UseFetchOptions<T>) => fetch<T>(url, { ...options, method: 'GET' }, false),
        silentPost: <T>(url: string, body?: any, options?: UseFetchOptions<T>) => fetch<T>(url, { ...options, method: 'POST', body }, false),
        handleError
    }
}
