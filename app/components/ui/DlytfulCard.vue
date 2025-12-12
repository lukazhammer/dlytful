<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated' | 'bordered'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'default':
      return 'bg-white shadow-sm border border-transparent'
    case 'elevated':
      return 'bg-white shadow-lg border border-transparent'
    case 'bordered':
      return 'bg-white border-2 border-gray-100'
    default:
      return 'bg-white'
  }
})
</script>

<template>
  <div 
    class="rounded-xl p-6 transition-all duration-150"
    :class="variantClasses"
  >
    <slot />
  </div>
</template>
