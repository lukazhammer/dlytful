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
      case 'sm': return 'text-lg'
      case 'md': return 'text-2xl'
      case 'lg': return 'text-4xl'
      default: return 'text-2xl'
    }
  } else {
    switch (props.size) {
      case 'sm': return 'text-base'
      case 'md': return 'text-xl'
      case 'lg': return 'text-2xl'
      default: return 'text-xl'
    }
  }
})
</script>

<template>
  <span 
    class="font-serif font-semibold tracking-tight text-dlytful-ink select-none"
    :class="sizeClasses"
  >
    <template v-if="variant === 'full'">
      d<span class="text-dlytful-sun">lyt</span>ful
    </template>
    <template v-else>
      d
    </template>
  </span>
</template>
