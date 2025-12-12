import { ref } from 'vue'

export const useClipboard = () => {
    const copied = ref(false)
    const isSupported = typeof navigator !== 'undefined' && 'clipboard' in navigator

    const copy = async (text: string) => {
        if (!isSupported) {
            console.warn('Clipboard API not supported')
            return
        }
        try {
            await navigator.clipboard.writeText(text)
            copied.value = true
            setTimeout(() => {
                copied.value = false
            }, 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
            copied.value = false
        }
    }

    return {
        copy,
        copied,
        isSupported
    }
}
