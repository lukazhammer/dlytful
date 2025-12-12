<script setup lang="ts">
import { useClipboard } from '~/composables/useClipboard'
import { useUIStore } from '~/stores/ui'

interface Props {
  content: string
}

const props = defineProps<Props>()
const { copy, copied } = useClipboard()
const uiStore = useUIStore()

const handleCopy = async () => {
  await copy(props.content)
  uiStore.showToast('success', 'Prompt copied! Paste it into Bolt.')
}
</script>

<template>
  <div class="space-y-2">
    <button
      @click="handleCopy"
      class="w-full py-4 px-6 rounded-xl font-medium text-lg transition-all duration-200 flex items-center justify-center gap-3"
      :class="copied 
        ? 'bg-dlytful-herb text-white' 
        : 'bg-dlytful-sun text-white hover:bg-[#E68A00] shadow-lg shadow-dlytful-sun/20'"
    >
      <template v-if="copied">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Copied!
      </template>
      <template v-else>
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copy All
      </template>
    </button>
    <p class="text-center text-sm text-gray-500">
      Paste this into Bolt, Cursor, or any AI builder
    </p>
  </div>
</template>
