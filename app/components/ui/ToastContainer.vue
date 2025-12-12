<script setup lang="ts">
import Toast from './Toast.vue'
import { useUIStore } from '~/stores/ui'

const uiStore = useUIStore()

// Limit to 3 visible toasts
const visibleToasts = computed(() => {
  return uiStore.toasts.slice(0, 3)
})

const dismissToast = (id: string) => {
  uiStore.dismissToast(id)
}
</script>

<template>
  <Teleport to="body">
    <div 
      class="fixed z-[100] pointer-events-none"
      :class="[
        'bottom-4 right-4 left-4 md:left-auto md:right-6 md:bottom-6',
        'flex flex-col items-center md:items-end gap-2'
      ]"
    >
      <TransitionGroup
        enter-active-class="transform transition-all duration-300 ease-out"
        enter-from-class="translate-x-full md:translate-x-8 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transform transition-all duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-y-2 opacity-0"
        move-class="transition-all duration-200"
      >
        <div 
          v-for="toast in visibleToasts" 
          :key="toast.id"
          class="pointer-events-auto"
        >
          <Toast 
            :toast="toast" 
            @dismiss="dismissToast(toast.id)"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
