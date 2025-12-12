<script setup lang="ts">
import { useClipboard } from '~/composables/useClipboard'
import DlytfulButton from '~/components/ui/DlytfulButton.vue'

interface Props {
  content: string
}

const props = defineProps<Props>()
const emit = defineEmits(['copied'])
const { copy, copied, isSupported } = useClipboard()

const handleCopy = async () => {
  if (!props.content) return
  await copy(props.content)
  emit('copied')
}
</script>

<template>
  <DlytfulButton 
    v-if="isSupported"
    variant="ghost" 
    size="sm"
    class="relative group !px-2 !py-2"
    @click="handleCopy"
    :aria-label="copied ? 'Copied to clipboard' : 'Copy to clipboard'"
  >
    <!-- Copy Icon -->
    <svg 
      v-if="!copied" 
      class="w-5 h-5 transition-colors group-hover:text-dlytful-sun" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>

    <!-- Check Icon -->
    <svg 
      v-else 
      class="w-5 h-5 text-dlytful-herb scale-110 transition-transform" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>

    <!-- Tooltip (preserved but using dlytful colors) -->
    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dlytful-ink text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-sans shadow-soft">
      {{ copied ? 'Copied!' : 'Copy' }}
    </span>
  </DlytfulButton>
</template>
