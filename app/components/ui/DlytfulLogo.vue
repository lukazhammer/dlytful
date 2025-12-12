<script setup lang="ts">
interface Props {
  variant?: 'full' | 'mark'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'full',
  size: 'md'
})

const sizeClasses = computed(() => {
  if (props.variant === 'mark') {
    switch (props.size) {
      case 'sm': return 'text-xl'
      case 'md': return 'text-3xl'
      case 'lg': return 'text-5xl'
      default: return 'text-3xl'
    }
  } else {
    // Full
    switch (props.size) {
      case 'sm': return 'text-lg'
      case 'md': return 'text-2xl'
      case 'lg': return 'text-4xl'
      default: return 'text-2xl'
    }
  }
})
</script>

<template>
  <div 
    class="font-serif font-bold tracking-tight text-dlytful-sun select-none"
    :class="sizeClasses"
  >
    <template v-if="variant === 'full'">
      dlytful
    </template>
    <template v-else>
      D
    </template>
  </div>
</template>
