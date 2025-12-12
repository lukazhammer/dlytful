<script setup lang="ts">
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import DlytfulInput from '~/components/ui/DlytfulInput.vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'auth',
  middleware: ['guest-only']
})

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  error.value = null
  
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  loading.value = true
  
  try {
    await login(email.value, password.value)
    router.push('/sprint/new')
  } catch (err: any) {
    error.value = err.message || 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header: Calm greeting -->
    <div>
      <h1 class="font-serif text-headline text-dlytful-ink mb-1">Welcome back</h1>
      <p class="text-dlytful-ink-muted">Continue where you left off.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Error: Gentle, not alarming -->
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
          placeholder="••••••••"
          :disabled="loading"
          autocomplete="current-password"
        />
      </div>

      <DlytfulButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="loading"
        class="w-full"
      >
        Sign in
      </DlytfulButton>
    </form>

    <p class="text-center text-sm text-dlytful-ink-muted">
      Don't have an account?
      <NuxtLink to="/register" class="text-dlytful-ink hover:text-dlytful-sun transition-colors">
        Sign up
      </NuxtLink>
    </p>
  </div>
</template>
