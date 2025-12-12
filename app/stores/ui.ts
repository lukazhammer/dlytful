import { defineStore } from 'pinia'

interface Toast {
    id: string
    type: 'success' | 'error' | 'info'
    message: string
}

interface UIState {
    toasts: Toast[]
    loading: boolean
    modal: string | null
}

export const useUIStore = defineStore('ui', {
    state: (): UIState => ({
        toasts: [],
        loading: false,
        modal: null
    }),

    actions: {
        showToast(type: Toast['type'], message: string) {
            const id = Date.now().toString() + Math.random().toString(36).substring(2, 9)
            this.toasts.unshift({ id, type, message }) // Add to front for newest-first

            // Limit to 5 toasts max
            if (this.toasts.length > 5) {
                this.toasts = this.toasts.slice(0, 5)
            }
        },

        dismissToast(id: string) {
            this.toasts = this.toasts.filter(t => t.id !== id)
        },

        removeToast(id: string) {
            this.dismissToast(id)
        },

        setLoading(value: boolean) {
            this.loading = value
        },

        openModal(name: string) {
            this.modal = name
        },

        closeModal() {
            this.modal = null
        }
    }
})
