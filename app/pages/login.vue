<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] px-6">
    <div class="w-full max-w-sm bg-surface/50 border border-surfaceHighlight p-8 rounded-xl backdrop-blur-sm">
      <h2 class="text-2xl font-bold text-center mb-6 text-brand">Welcome back</h2>
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm text-textMuted mb-2">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full bg-surface border border-surfaceHighlight rounded-lg px-4 py-3 text-text focus:outline-none focus:border-accent"
            placeholder="you@company.com"
            required
          >
        </div>
        <button 
          type="submit" 
          :disabled="auth.loading"
          class="w-full bg-text text-black font-bold py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
        >
          {{ auth.loading ? 'Sending Magic Link...' : 'Continue with Email' }}
        </button>
      </form>
      <div v-if="message" class="mt-4 text-center text-sm text-green-400">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'default'
})

const auth = useAuthStore();
const email = ref('');
const message = ref('');

const handleLogin = async () => {
  const error = await auth.textLogin(email.value);
  if (error) {
    alert(error.message);
  } else {
    message.value = 'Check your email for the login link.';
  }
}
</script>
