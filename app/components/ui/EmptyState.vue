<script setup lang="ts">
import DlytfulButton from './DlytfulButton.vue'

interface Props {
  icon?: 'folder' | 'search' | 'sprint' | 'star'
  title: string
  message?: string
  actionLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'folder',
  message: ''
})

const emit = defineEmits<{
  (e: 'action'): void
}>()

const iconPaths = {
  folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  sprint: 'M13 10V3L4 14h7v7l9-11h-7z',
  star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <!-- Icon -->
    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="iconPaths[icon]" />
      </svg>
    </div>

    <!-- Title -->
    <h3 class="font-serif text-xl font-semibold text-gray-900 mb-2">
      {{ title }}
    </h3>

    <!-- Message -->
    <p v-if="message" class="text-gray-600 max-w-sm mb-6">
      {{ message }}
    </p>

    <!-- Action button -->
    <DlytfulButton 
      v-if="actionLabel"
      variant="primary"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </DlytfulButton>
  </div>
</template>
