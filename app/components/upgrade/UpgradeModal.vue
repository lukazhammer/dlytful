<script setup lang="ts">
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import DlytfulInput from '~/components/ui/DlytfulInput.vue'
import { useUIStore } from '~/stores/ui'
import { TIERS } from '~/constants/tiers'

interface Props {
  isOpen: boolean
  requiredTier: 'one' | 'max'
  feature: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'upgrade'): void
}>()

const uiStore = useUIStore()
const email = ref('')
const submitting = ref(false)
const submitted = ref(false)

const tierData = computed(() => TIERS[props.requiredTier])

// Features for each tier
const tierFeatures = {
  one: [
    'Deep persona insights',
    'Voice and tone rules',
    'Complete rebrand prompt',
    'Save unlimited sprints',
    'Fork and iterate'
  ],
  max: [
    'Everything in dlytful one',
    'All 12 archetypes',
    'Discoverability metadata',
    'Custom agent prompt',
    'Markdown export'
  ]
}

const features = computed(() => tierFeatures[props.requiredTier])

const handleClose = () => {
  emit('close')
  // Reset state
  email.value = ''
  submitted.value = false
}

const handleUpgradeClick = async () => {
  // For v1, show waitlist capture
  // This will be replaced with Stripe checkout when ready
  emit('upgrade')
}

const handleWaitlistSubmit = async () => {
  if (!email.value) return
  
  submitting.value = true
  
  try {
    await $fetch('/api/waitlist', {
      method: 'POST',
      body: { 
        email: email.value,
        source: 'upgrade_modal',
        interested_tier: props.requiredTier
      }
    })
    
    submitted.value = true
    uiStore.showToast('success', "You're on the list! We'll reach out with early pricing.")
  } catch (error) {
    uiStore.showToast('error', 'Something went wrong. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleClose"
        />
        
        <!-- Modal -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="isOpen"
            class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <!-- Header -->
            <div class="p-6 pb-4">
              <button 
                @click="handleClose"
                class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 class="font-serif text-2xl font-bold text-gray-900">
                Unlock {{ feature }}
              </h2>
              <p class="text-gray-600 mt-1">
                Upgrade to {{ tierData.name }}
              </p>
            </div>
            
            <!-- Body -->
            <div class="px-6 pb-6">
              <!-- Features -->
              <ul class="space-y-3 mb-6">
                <li 
                  v-for="(feat, index) in features" 
                  :key="index"
                  class="flex items-center gap-3 text-gray-700"
                >
                  <svg class="w-5 h-5 text-dlytful-herb flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ feat }}
                </li>
              </ul>
              
              <!-- Price -->
              <div class="text-center mb-6">
                <span class="text-3xl font-bold text-gray-900">{{ tierData.price }}</span>
                <span class="text-gray-500">/month</span>
              </div>
              
              <!-- Waitlist Form (v1 without Stripe) -->
              <div v-if="!submitted" class="space-y-4">
                <div class="bg-dlytful-cream rounded-lg p-4 text-center">
                  <p class="text-sm text-gray-700">
                    🚀 We're launching soon. Get <span class="font-semibold text-dlytful-sun">early access pricing</span>.
                  </p>
                </div>
                
                <div class="flex gap-2">
                  <DlytfulInput
                    v-model="email"
                    type="email"
                    placeholder="your@email.com"
                    class="flex-1"
                  />
                  <DlytfulButton
                    variant="primary"
                    :loading="submitting"
                    @click="handleWaitlistSubmit"
                  >
                    Notify me
                  </DlytfulButton>
                </div>
              </div>
              
              <!-- Success state -->
              <div v-else class="bg-dlytful-herb/10 rounded-lg p-4 text-center">
                <svg class="w-8 h-8 text-dlytful-herb mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="text-dlytful-herb font-medium">You're on the list!</p>
                <p class="text-sm text-gray-600 mt-1">We'll email you when upgrades are available.</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="px-6 pb-6 text-center">
              <button 
                @click="handleClose"
                class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
