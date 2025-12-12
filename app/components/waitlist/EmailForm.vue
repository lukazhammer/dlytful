<script setup lang="ts">
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import DlytfulInput from '~/components/ui/DlytfulInput.vue'
import { useApi } from '~/composables/useApi'

interface Props {
  variant?: 'hero' | 'footer'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'hero'
})

const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref<string | null>(null)
const api = useApi()

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const handleSubmit = async () => {
  error.value = null
  
  if (!email.value) {
    error.value = 'Please enter your email'
    return
  }
  
  if (!validateEmail(email.value)) {
    error.value = 'Please enter a valid email'
    return
  }
  
  loading.value = true
  
  try {
    await api.post('/waitlist', { email: email.value })
    success.value = true
    email.value = ''
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full">
    <transition name="fade" mode="out-in">
      <!-- Success: Calm confirmation -->
      <div v-if="success" class="bg-dlytful-cream rounded-card p-6 text-center">
        <div class="w-10 h-10 bg-dlytful-herb/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-5 h-5 text-dlytful-herb" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="text-dlytful-ink font-serif">You're on the list.</p>
        <p class="text-dlytful-ink-muted text-sm mt-1">Check your inbox for the brand kit.</p>
      </div>

      <!-- Form: Simple, unhurried -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-3">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-grow">
            <DlytfulInput
              v-model="email"
              type="email"
              placeholder="your@email.com"
              :disabled="loading"
              autocomplete="email"
              required
            />
          </div>
          <DlytfulButton 
            type="submit" 
            :loading="loading"
            variant="primary"
            size="lg"
            class="whitespace-nowrap"
          >
            Join the waitlist
          </DlytfulButton>
        </div>
        
        <!-- Error: Gentle, not alarming -->
        <p v-if="error" class="text-sm text-dlytful-sun">
          {{ error }}
        </p>
        

      </form>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
