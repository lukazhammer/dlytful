<script setup lang="ts">
import DlytfulButton from './DlytfulButton.vue'

interface Props {
  title?: string
  message?: string
  retryable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  message: "Don't worry, these things happen. Let's try again.",
  retryable: true
})

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <!-- Icon -->
    <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
      <svg class="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>

    <!-- Title -->
    <h3 class="font-serif text-xl font-semibold text-gray-900 mb-2">
      {{ title }}
    </h3>

    <!-- Message -->
    <p class="text-gray-600 max-w-sm mb-6">
      {{ message }}
    </p>

    <!-- Retry button -->
    <DlytfulButton 
      v-if="retryable"
      variant="primary"
      @click="emit('retry')"
    >
      Try again
    </DlytfulButton>

    <!-- Support link -->
    <p class="text-sm text-gray-500 mt-4">
      Still having trouble? 
      <a href="mailto:hey@dlytful.com" class="text-dlytful-sun hover:underline">
        Get in touch
      </a>
    </p>
  </div>
</template>
