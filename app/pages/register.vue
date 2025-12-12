<script setup lang="ts">
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import DlytfulInput from '~/components/ui/DlytfulInput.vue'
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
    <!-- Header -->
    <div>
      <h1 class="font-serif text-headline text-dlytful-ink mb-1">Create your account</h1>
      <p class="text-dlytful-ink-muted">Start translating your brand.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Error -->
      <div v-if="error" class="bg-dlytful-cream rounded-soft px-4 py-3 text-sm text-dlytful-ink">
        {{ error }}
      </div>

      <div class="space-y-3">
        <DlytfulInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          :disabled="loading"
          autocomplete="email"
        />

        <DlytfulInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          :disabled="loading"
          autocomplete="new-password"
        />

        <DlytfulInput
          v-model="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          :disabled="loading"
          autocomplete="new-password"
        />
      </div>

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

    <p class="text-center text-sm text-dlytful-ink-muted">
      Already have an account?
      <NuxtLink to="/login" class="text-dlytful-ink hover:text-dlytful-sun transition-colors">
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>
