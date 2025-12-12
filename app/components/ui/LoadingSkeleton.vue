<script setup lang="ts">
interface Props {
  variant?: 'text' | 'card' | 'button' | 'circle' | 'block'
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'circle':
      return 'rounded-full aspect-square'
    case 'card':
      return 'rounded-xl'
    case 'button':
      return 'rounded-lg'
    case 'block':
      return 'rounded-lg'
    case 'text':
    default:
      return 'rounded'
  }
})

const defaultDimensions = computed(() => {
  switch (props.variant) {
    case 'circle':
      return { width: '48px', height: '48px' }
    case 'card':
      return { width: '100%', height: '120px' }
    case 'button':
      return { width: '100px', height: '40px' }
    case 'block':
      return { width: '100%', height: '24px' }
    case 'text':
    default:
      return { width: '100%', height: '16px' }
  }
})

const style = computed(() => ({
  width: props.width || defaultDimensions.value.width,
  height: props.height || defaultDimensions.value.height
}))
</script>

<template>
  <div 
    class="skeleton-shimmer bg-gray-100"
    :class="variantClasses"
    :style="style"
  />
</template>

<style scoped>
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
