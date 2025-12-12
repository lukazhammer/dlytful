<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'dlytful-sun'
})

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3'
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div 
      class="rounded-full animate-spin"
      :class="[
        sizeClasses[size],
        `border-${color}`,
        'border-t-transparent'
      ]"
      :style="{ borderColor: `var(--color-${color}, #FF9A00)`, borderTopColor: 'transparent' }"
    />
  </div>
</template>

<style scoped>
/* Fallback for custom colors */
div > div {
  border-color: #FF9A00;
  border-top-color: transparent;
}
</style>
