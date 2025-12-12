<script setup lang="ts">
import DlytfulLogo from './DlytfulLogo.vue'

interface Props {
  isOpen: boolean
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Translating your brand...'
})

// Animated dots for loading text
const dots = ref('')

onMounted(() => {
  const interval = setInterval(() => {
    dots.value = dots.value.length >= 3 ? '' : dots.value + '.'
  }, 400)
  
  onUnmounted(() => clearInterval(interval))
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        class="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center"
      >
        <!-- Background pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0" style="background-image: radial-gradient(#FF9A00 1px, transparent 1px); background-size: 24px 24px;"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 text-center">
          <!-- Animated Logo -->
          <div class="mb-8 animate-pulse">
            <DlytfulLogo size="lg" />
          </div>
          
          <!-- Spinner -->
          <div class="w-12 h-12 mx-auto mb-6">
            <div class="w-full h-full border-3 border-dlytful-sun border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <!-- Message -->
          <p class="font-serif text-xl text-gray-900 mb-2">
            {{ message }}<span class="inline-block w-6 text-left">{{ dots }}</span>
          </p>
          
          <!-- Time estimate -->
          <p class="text-sm text-gray-500">
            Usually takes about 10 seconds
          </p>
        </div>

        <!-- Prevent interaction hint -->
        <p class="absolute bottom-8 text-xs text-gray-400">
          Please don't close this page
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.border-3 {
  border-width: 3px;
}
</style>
