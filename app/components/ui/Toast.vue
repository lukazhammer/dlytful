<script setup lang="ts">
interface Props {
  toast: {
    id: string
    type: 'success' | 'error' | 'info'
    message: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

const isHovered = ref(false)
const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null)

// Auto-dismiss timing
const dismissDelay = computed(() => {
  return props.toast.type === 'error' ? 5000 : 3000
})

const startTimer = () => {
  if (timeoutId.value) clearTimeout(timeoutId.value)
  timeoutId.value = setTimeout(() => {
    emit('dismiss')
  }, dismissDelay.value)
}

const pauseTimer = () => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
    timeoutId.value = null
  }
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }
})

watch(isHovered, (hovered) => {
  if (hovered) {
    pauseTimer()
  } else {
    startTimer()
  }
})

// Icon based on type
const iconPath = computed(() => {
  switch (props.toast.type) {
    case 'success':
      return 'M5 13l4 4L19 7' // Checkmark
    case 'error':
      return 'M6 18L18 6M6 6l12 12' // X
    case 'info':
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' // Info circle
  }
})

// Background color based on type
const bgClass = computed(() => {
  switch (props.toast.type) {
    case 'success':
      return 'bg-dlytful-herb'
    case 'error':
      return 'bg-red-500'
    case 'info':
    default:
      return 'bg-dlytful-sky'
  }
})
</script>

<template>
  <div
    class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-[360px] w-full text-white"
    :class="bgClass"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Icon -->
    <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
    </svg>

    <!-- Message -->
    <p class="flex-1 text-sm font-sans font-medium">
      {{ toast.message }}
    </p>

    <!-- Dismiss button -->
    <button 
      @click.stop="emit('dismiss')"
      class="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
