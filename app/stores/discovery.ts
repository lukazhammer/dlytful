import { defineStore } from 'pinia';
import type { DiscoveryInput, BrandPrompt, Unlocks, ContradictionWarning, BrandArchetype } from '~/types';

export const useDiscoveryStore = defineStore('discovery', {
    state: () => ({
        inputs: {
            q1_core_what: '',
            q2_audience_who: '',
            q3_vibe_adjectives: [],
            q4_archetype_primary: null,
            q5_archetype_secondary: null,
            q6_mission_why: '',
            q7_competitors_differentiation: '',
            q8_banned_words: [],
            q9_voice_tone: '',
            q10_visual_style: '',
        } as DiscoveryInput,

        brandPrompt: null as BrandPrompt | null,

        unlocks: {
            has_started: false,
            q1_complete: false,
            archetype_revealed: false,
            visuals_unlocked: false,
            full_prompt_ready: false,
        } as Unlocks,

        warnings: [] as ContradictionWarning[],
        compiledPromptMarkdown: '',

        currentStep: 1,
        isGenerating: false,
    }),

    actions: {
        updateInput<K extends keyof DiscoveryInput>(key: K, value: DiscoveryInput[K]) {
            this.inputs[key] = value;
            this.checkUnlocks();
            this.unlocks.has_started = true;
        },

        checkUnlocks() {
            if (this.inputs.q1_core_what.length > 10) {
                this.unlocks.q1_complete = true;
            }
            if (this.inputs.q4_archetype_primary) {
                this.unlocks.archetype_revealed = true;
            }
            if (this.inputs.q10_visual_style.length > 5) {
                this.unlocks.visuals_unlocked = true;
            }
        },

        setArchetype(primary: BrandArchetype, secondary?: BrandArchetype) {
            this.inputs.q4_archetype_primary = primary;
            if (secondary) this.inputs.q5_archetype_secondary = secondary;
            this.checkUnlocks();
        },

        // AI Enhancement
        async enhanceInput(field: keyof DiscoveryInput) {
            if (!this.inputs[field] || this.inputs[field].toString().length < 3) return;

            this.isGenerating = true;
            try {
                const { data } = await useFetch('/api/generate/enhance', {
                    method: 'POST',
                    body: {
                        field,
                        rawInput: this.inputs[field],
                        context: this.inputs // Send full context for better relevance
                    }
                });

                if (data.value) {
                    // In a full app, we'd show a "Suggestion" bubble. 
                    // For Dlytful Zero, we might just subtly accept it if it's a "fix", 
                    // or just store it. 
                    // Let's store it in a volatile map for debug/future UI
                    // this.enhancements[field] = data.value;
                    console.log(`[Enhance] ${field} ->`, data.value);
                }
            } catch (e) {
                console.error("Enhance failed", e);
            } finally {
                this.isGenerating = false;
            }
        },

        async compileBrandPrompt() {
            this.isGenerating = true;
            try {
                const { data } = await useFetch('/api/brand/compile', {
                    method: 'POST',
                    body: { inputs: this.inputs }
                });

                const response = data.value as unknown as { brandSpec: BrandPrompt; compiledPromptMarkdown: string } | null;
                if (response && response.compiledPromptMarkdown) {
                    this.brandPrompt = response.brandSpec;
                    this.compiledPromptMarkdown = response.compiledPromptMarkdown;
                }
            } catch (e) {
                console.error("Compile failed", e);
            } finally {
                this.isGenerating = false;
            }
        },

        async generatePreview() {
            // Trigger compile
            await this.compileBrandPrompt();
        }
    },

    getters: {
        progressPercent: (state) => {
            // Simple logic: 10 steps, 10% each
            return Math.min(100, (state.currentStep - 1) * 10 + (state.inputs.q1_core_what ? 5 : 0));
        }
    }
})
