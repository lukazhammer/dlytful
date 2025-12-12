import { ref, computed } from 'vue'
import { QUESTIONS, getQuestionsForTier } from '~/constants/questions'
import type { DiscoveryInputs } from '~/types/sprint'
import { useUserStore } from '~/stores/user'
import { useSprintStore } from '~/stores/sprint'

export const useDiscovery = () => {
    const userStore = useUserStore()
    const sprintStore = useSprintStore()

    // Use store's draft inputs for persistence
    const answers = computed({
        get: () => sprintStore.draftInputs,
        set: (val) => {
            Object.keys(val).forEach(key => {
                sprintStore.setDraftInput(key as keyof DiscoveryInputs, val[key as keyof DiscoveryInputs] || '')
            })
        }
    })

    const currentStep = ref(1)
    const currentQuestionIndex = ref(0)

    // Get tier from user store
    const tier = computed(() => userStore.tier)

    const relevantQuestions = computed(() => {
        return getQuestionsForTier(tier.value)
    })

    // Group questions by part for stepper logic
    const questionsByPart = computed(() => {
        const grouped: Record<number, typeof QUESTIONS> = {}
        relevantQuestions.value.forEach(q => {
            if (!grouped[q.part]) grouped[q.part] = []
            grouped[q.part].push(q)
        })
        return grouped
    })

    const totalParts = computed(() => {
        const parts = Object.keys(questionsByPart.value).map(Number)
        return Math.max(...parts, 1)
    })

    const currentPartQuestions = computed(() => {
        return questionsByPart.value[currentStep.value] || []
    })

    // Current single question (for one-at-a-time display)
    const currentQuestion = computed(() => {
        return currentPartQuestions.value[currentQuestionIndex.value] || null
    })

    // Total questions across all parts
    const totalQuestions = computed(() => relevantQuestions.value.length)

    // Global question index (for progress)
    const globalQuestionIndex = computed(() => {
        let count = 0
        for (let part = 1; part < currentStep.value; part++) {
            count += (questionsByPart.value[part] || []).length
        }
        return count + currentQuestionIndex.value
    })

    const canProceed = computed(() => {
        if (!currentQuestion.value) return false
        const val = answers.value[currentQuestion.value.id as keyof DiscoveryInputs]
        // Archetype type doesn't require validation in the same way
        if (currentQuestion.value.type === 'archetype') return true
        return val && val.toString().trim().length > 0
    })

    const isLastQuestion = computed(() => {
        const isLastInPart = currentQuestionIndex.value >= currentPartQuestions.value.length - 1
        const isLastPart = currentStep.value >= totalParts.value
        return isLastInPart && isLastPart
    })

    const isLastQuestionInPart = computed(() => {
        return currentQuestionIndex.value >= currentPartQuestions.value.length - 1
    })

    // For free tier: check if we're at the end of Part 1
    const shouldShowUpgradePrompt = computed(() => {
        return tier.value === 'free' && currentStep.value === 1 && isLastQuestionInPart.value
    })

    const setAnswer = (questionId: keyof DiscoveryInputs, value: string) => {
        sprintStore.setDraftInput(questionId, value)
    }

    const nextQuestion = () => {
        if (!canProceed.value) return

        if (currentQuestionIndex.value < currentPartQuestions.value.length - 1) {
            // Move to next question in current part
            currentQuestionIndex.value++
        } else if (currentStep.value < totalParts.value) {
            // Move to next part
            currentStep.value++
            currentQuestionIndex.value = 0
        }
        // If at the very end, do nothing (caller should trigger generate)
    }

    const prevQuestion = () => {
        if (currentQuestionIndex.value > 0) {
            currentQuestionIndex.value--
        } else if (currentStep.value > 1) {
            currentStep.value--
            currentQuestionIndex.value = (questionsByPart.value[currentStep.value] || []).length - 1
        }
    }

    const reset = () => {
        currentStep.value = 1
        currentQuestionIndex.value = 0
        sprintStore.clearDraftInputs()
    }

    // Initialize from existing sprint (for forking)
    const initFromSprint = (inputs: DiscoveryInputs) => {
        Object.keys(inputs).forEach(key => {
            const value = inputs[key as keyof DiscoveryInputs]
            if (value) {
                sprintStore.setDraftInput(key as keyof DiscoveryInputs, value)
            }
        })
    }

    return {
        currentStep,
        currentQuestionIndex,
        answers,
        currentQuestion,
        currentPartQuestions,
        totalParts,
        totalQuestions,
        globalQuestionIndex,
        isLastQuestion,
        isLastQuestionInPart,
        shouldShowUpgradePrompt,
        canProceed,
        setAnswer,
        nextQuestion,
        prevQuestion,
        reset,
        initFromSprint
    }
}
