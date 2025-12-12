import { defineStore } from 'pinia'
import type { Sprint, DiscoveryInputs, GeneratedOutputs } from '~/types/sprint'
import { useApi } from '~/composables/useApi'

interface SprintState {
    currentSprint: Sprint | null
    sprints: Sprint[]
    draftInputs: DiscoveryInputs
}

export const useSprintStore = defineStore('sprint', {
    state: (): SprintState => ({
        currentSprint: null,
        sprints: [],
        draftInputs: {}
    }),

    getters: {
        sprintTree: (state) => {
            // Basic implementation: group by parent_id
            // In a real app, you might want a recursive tree structure
            const roots = state.sprints.filter(s => !s.parent_id)
            return roots.map(root => ({
                ...root,
                children: state.sprints.filter(s => s.parent_id === root.id)
            }))
        },

        // Check if draft inputs differ from current sprint inputs
        hasUnsavedChanges: (state) => {
            if (!state.currentSprint) return Object.keys(state.draftInputs).length > 0

            // Simple shallow comparison for this example
            return JSON.stringify(state.draftInputs) !== JSON.stringify(state.currentSprint.inputs)
        }
    },

    actions: {
        setDraftInput(key: keyof DiscoveryInputs, value: string) {
            this.draftInputs[key] = value
        },

        clearDraftInputs() {
            this.draftInputs = {}
        },

        async loadSprints() {
            const api = useApi()
            const sprints = await api.get<Sprint[]>('/sprints')
            if (sprints) {
                this.sprints = sprints
            }
        },

        async loadSprint(id: string) {
            const api = useApi()
            const sprint = await api.get<Sprint>(`/sprints/${id}`)
            if (sprint) {
                this.currentSprint = sprint
                // Initialize draft inputs with existing inputs
                this.draftInputs = { ...sprint.inputs }
            }
        },

        async createSprint(inputs?: DiscoveryInputs) {
            const api = useApi()
            const payload = inputs || this.draftInputs
            const newSprint = await api.post<Sprint>('/sprints', { inputs: payload })

            if (newSprint) {
                this.sprints.unshift(newSprint)
                this.currentSprint = newSprint
                this.draftInputs = { ...newSprint.inputs }
            }
            return newSprint
        },

        async updateSprint(id: string, data: Partial<Sprint>) {
            const api = useApi()
            const updated = await api.put<Sprint>(`/sprints/${id}`, data)

            if (updated) {
                this.currentSprint = updated
                const index = this.sprints.findIndex(s => s.id === id)
                if (index !== -1) {
                    this.sprints[index] = updated
                }
            }
            return updated
        },

        async forkSprint(id: string) {
            const api = useApi()
            const forked = await api.post<Sprint>(`/sprints/${id}/fork`)

            if (forked) {
                this.sprints.unshift(forked)
                this.currentSprint = forked
                this.draftInputs = { ...forked.inputs }
            }
            return forked
        },

        setOutputs(outputs: GeneratedOutputs) {
            if (this.currentSprint) {
                this.currentSprint.outputs = outputs
                // assume outputs are automatically saved to DB in backend during generation
                // but we update local state here

                const index = this.sprints.findIndex(s => s.id === this.currentSprint?.id)
                if (index !== -1) {
                    this.sprints[index].outputs = outputs
                }
            }
        },

        async generateSprint(id: string) {
            const api = useApi()
            const result = await api.post<{ outputs: GeneratedOutputs }>(`/sprints/${id}/generate`)

            if (result?.outputs) {
                this.setOutputs(result.outputs)
                if (this.currentSprint) {
                    this.currentSprint.status = 'complete'
                }
            }
            return result?.outputs
        }
    }
})
