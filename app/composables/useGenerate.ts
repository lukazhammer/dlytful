import { ref } from 'vue'
import type { GeneratedOutputs } from '~/types/sprint'
import { useApi } from './useApi'

export const useGenerate = () => {
    const api = useApi()
    const loading = ref(false)
    const error = ref<string | null>(null)
    const outputs = ref<GeneratedOutputs | null>(null)

    const generate = async (sprintId: string) => {
        loading.value = true
        error.value = null

        try {
            // In a real stream, we'd handle the chunks. 
            // For now, simple await.
            const result = await api.post<GeneratedOutputs>(`/sprints/${sprintId}/generate`)
            outputs.value = result
            return result
        } catch (err: any) {
            error.value = err.message || 'Failed to generate sprint'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        outputs,
        generate
    }
}
