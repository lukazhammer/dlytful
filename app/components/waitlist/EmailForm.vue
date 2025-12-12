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
  <div class="w-full max-w-md mx-auto">
    <transition name="fade" mode="out-in">
      <div v-if="success" class="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-green-800 font-serif font-semibold text-lg mb-2">You're on the list</h3>
        <p class="text-green-700 font-sans">Check your inbox. The brand kit is on its way.</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-3">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-grow">
            <DlytfulInput 
              v-model="email" 
              placeholder="name@company.com" 
              type="email"
              :error="error || undefined"
              :disabled="loading"
              class="h-full"
            />
          </div>
          <DlytfulButton 
            type="submit" 
            :loading="loading"
            :variant="variant === 'hero' ? 'primary' : 'secondary'"
            size="md"
            class="whitespace-nowrap"
          >
            Get Early Access
          </DlytfulButton>
        </div>
        <p v-if="variant === 'hero'" class="text-center text-sm text-gray-500 font-sans">
          Get the free brand kit instantly
        </p>
      </form>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
