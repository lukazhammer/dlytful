<script setup lang="ts">
import ProgressBar from '~/components/discovery/ProgressBar.vue'
import QuestionStep from '~/components/discovery/QuestionStep.vue'
import DiscoverySummary from '~/components/discovery/DiscoverySummary.vue'
import ArchetypeWheel from '~/components/discovery/ArchetypeWheel.vue'
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import DlytfulCard from '~/components/ui/DlytfulCard.vue'
import DlytfulLogo from '~/components/ui/DlytfulLogo.vue'
import { useDiscovery } from '~/composables/useDiscovery'
import { useSprintStore } from '~/stores/sprint'
import { useUserStore } from '~/stores/user'
import { useApi } from '~/composables/useApi'
import type { DiscoveryInputs } from '~/types/sprint'
import { TIERS } from '~/constants/tiers'

definePageMeta({
  layout: false // Custom minimal layout for focus
})

const router = useRouter()
const route = useRoute()
const sprintStore = useSprintStore()
const userStore = useUserStore()
const api = useApi()

const {
  currentStep,
  currentQuestion,
  answers,
  totalParts,
  globalQuestionIndex,
  totalQuestions,
  isLastQuestion,
  shouldShowUpgradePrompt,
  canProceed,
  setAnswer,
  nextQuestion,
  prevQuestion,
  reset,
  initFromSprint
} = useDiscovery()

const generating = ref(false)
const showSummary = ref(false)

// Archetype selection state
const archetypeSelection = ref<{ primary: string | null, secondary: string | null }>({
  primary: null,
  secondary: null
})
const archetypeRecommended = ref<string[]>([])
const archetypeReasoning = ref<Record<string, string>>({})
const loadingRecommendations = ref(false)

// Check for fork parameter
const forkId = computed(() => route.query.fork as string | undefined)

// Available archetypes based on tier
const availableArchetypes = computed(() => TIERS[userStore.tier].maxArchetypes)

onMounted(async () => {
  if (forkId.value) {
    // Load the sprint to fork from
    await sprintStore.loadSprint(forkId.value)
    if (sprintStore.currentSprint) {
      initFromSprint(sprintStore.currentSprint.inputs)
    }
  }
})

// Fetch archetype recommendations when reaching archetype step
watch(() => currentQuestion.value?.type, async (type) => {
  if (type === 'archetype' && archetypeRecommended.value.length === 0) {
    loadingRecommendations.value = true
    try {
      const result = await api.post<{ recommended: string[], reasoning: Record<string, string> }>('/archetype/recommend', {
        inputs: answers.value
      })
      if (result) {
        archetypeRecommended.value = result.recommended
        archetypeReasoning.value = result.reasoning
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error)
    } finally {
      loadingRecommendations.value = false
    }
  }
})

// Sync archetype selection to answers
watch(archetypeSelection, (selection) => {
  if (selection.primary) {
    setAnswer('archetype_primary', selection.primary)
  }
  if (selection.secondary) {
    setAnswer('archetype_secondary', selection.secondary)
  }
}, { deep: true })

const handleNext = () => {
  if (isLastQuestion.value) {
    // For max tier, show summary first
    if (userStore.tier === 'max' && !showSummary.value) {
      showSummary.value = true
    } else {
      handleGenerate()
    }
  } else {
    nextQuestion()
  }
}

const handleBack = () => {
  if (showSummary.value) {
    showSummary.value = false
  } else if (globalQuestionIndex.value === 0) {
    router.push('/')
  } else {
    prevQuestion()
  }
}

const handleGenerate = async () => {
  generating.value = true
  
  try {
    const sprint = await sprintStore.createSprint()
    if (sprint) {
      router.push(`/sprint/${sprint.id}`)
    }
  } catch (error) {
    console.error('Failed to create sprint:', error)
  } finally {
    generating.value = false
  }
}

const handleSummaryUpdate = (key: keyof DiscoveryInputs, value: string) => {
  setAnswer(key, value)
}

// Current answer for the question
const currentAnswer = computed({
  get: () => {
    if (!currentQuestion.value) return ''
    return answers.value[currentQuestion.value.id as keyof DiscoveryInputs] || ''
  },
  set: (val: string) => {
    if (currentQuestion.value) {
      setAnswer(currentQuestion.value.id as keyof DiscoveryInputs, val)
    }
  }
})

// Button text
const continueButtonText = computed(() => {
  if (generating.value) return 'Generating...'
  if (showSummary.value || isLastQuestion.value) return 'Generate'
  return 'Continue'
})

// Progress calculation
const progressPercent = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round((globalQuestionIndex.value / totalQuestions.value) * 100)
})

// For archetype step, allow proceeding if primary is selected (or skip validation)
const canProceedArchetype = computed(() => {
  if (currentQuestion.value?.type === 'archetype') {
    return archetypeSelection.value.primary !== null
  }
  return canProceed.value
})
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col font-sans">
    <!-- Header -->
    <header class="p-4 md:p-6 flex items-center justify-between border-b border-gray-100">
      <button 
        v-if="globalQuestionIndex > 0 || showSummary"
        @click="handleBack" 
        class="text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="hidden sm:inline">Back</span>
      </button>
      <div v-else class="w-16"></div>
      
      <NuxtLink to="/">
        <DlytfulLogo size="sm" />
      </NuxtLink>
      
      <div class="w-16 text-right text-sm text-gray-400 font-sans">
        {{ globalQuestionIndex + 1 }}/{{ totalQuestions }}
      </div>
    </header>
    
    <!-- Progress Bar -->
    <div class="px-4 md:px-6 py-4 max-w-2xl mx-auto w-full">
      <ProgressBar :current="currentStep" :total="totalParts" />
    </div>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col items-center justify-center px-4 md:px-6 py-8">
      <div class="w-full max-w-xl">
        <transition name="slide-fade" mode="out-in">
          <!-- Summary View (Part 5 / Max tier) -->
          <div v-if="showSummary" key="summary">
            <DiscoverySummary 
              :inputs="answers" 
              @update="handleSummaryUpdate"
            />
          </div>
          
          <!-- Question View -->
          <div v-else-if="currentQuestion" :key="currentQuestion.id">
            <QuestionStep
              :question="currentQuestion"
              v-model="currentAnswer"
              :is-last="isLastQuestion"
            >
              <template #archetype>
                <div v-if="loadingRecommendations" class="flex items-center justify-center py-12">
                  <div class="animate-spin w-8 h-8 border-2 border-dlytful-sun border-t-transparent rounded-full"></div>
                </div>
                <ArchetypeWheel
                  v-else
                  v-model:selected="archetypeSelection"
                  :recommended="archetypeRecommended"
                  :reasoning="archetypeReasoning"
                  :available="availableArchetypes"
                  :disabled="false"
                />
              </template>
            </QuestionStep>
          </div>
        </transition>
        
        <!-- Upgrade Prompt (Free tier after Part 1) -->
        <transition name="fade">
          <DlytfulCard v-if="shouldShowUpgradePrompt && isLastQuestion" variant="bordered" class="mt-8">
            <div class="text-center">
              <p class="text-gray-600 font-sans mb-4">
                Unlock deeper insights with <span class="font-semibold text-dlytful-sun">dlytful one</span>
              </p>
              <NuxtLink to="/pricing">
                <DlytfulButton variant="ghost" size="sm">
                  See what's included →
                </DlytfulButton>
              </NuxtLink>
            </div>
          </DlytfulCard>
        </transition>
      </div>
    </main>

    <!-- Footer with Continue Button -->
    <footer class="p-4 md:p-6 border-t border-gray-100">
      <div class="max-w-xl mx-auto flex justify-end">
        <DlytfulButton
          variant="primary"
          size="lg"
          :disabled="!canProceedArchetype && !showSummary"
          :loading="generating"
          @click="handleNext"
        >
          {{ continueButtonText }}
        </DlytfulButton>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
