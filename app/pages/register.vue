<script setup lang="ts">
import DlytfulInput from '~/components/ui/DlytfulInput.vue'
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'auth',
  middleware: ['guest-only']
})

const { register } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  error.value = null
  
  // Validation
  if (!email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  loading.value = true
  
  try {
    await register(email.value, password.value)
    router.push('/sprint/new')
  } catch (err: any) {
    error.value = err.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="font-serif text-3xl font-bold text-gray-900 mb-2">Start translating</h1>
      <p class="text-gray-600 font-sans">Create your dlytful account</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="bg-red-50 border border-red-100 rounded-lg p-4 text-red-600 text-sm font-sans">
        {{ error }}
      </div>

      <DlytfulInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        :disabled="loading"
      />

      <DlytfulInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        :disabled="loading"
      />

      <DlytfulInput
        v-model="confirmPassword"
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        :disabled="loading"
      />

      <DlytfulButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="loading"
        class="w-full"
      >
        Create account
      </DlytfulButton>
    </form>

    <p class="text-center text-sm text-gray-600 font-sans">
      Already have an account?
      <NuxtLink to="/login" class="text-dlytful-sun hover:underline font-medium">
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>
