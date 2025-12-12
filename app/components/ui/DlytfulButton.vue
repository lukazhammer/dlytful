<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      // Warm amber, not aggressive orange
      return 'bg-dlytful-sun text-white hover:bg-dlytful-sun/90 shadow-soft'
    case 'secondary':
      // Subtle border, no fill
      return 'bg-transparent text-dlytful-ink border border-dlytful-border hover:border-dlytful-ink-muted'
    case 'soft':
      // Very subtle background
      return 'bg-dlytful-cream text-dlytful-ink hover:bg-dlytful-cream-dark'
    case 'ghost':
      return 'bg-transparent text-dlytful-ink-light hover:text-dlytful-ink'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-2 text-sm'
    case 'md':
      return 'px-5 py-2.5 text-sm'
    case 'lg':
      return 'px-6 py-3 text-base'
    default:
      return ''
  }
})
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium font-sans rounded-soft transition-all duration-200 ease-out disabled:opacity-40 disabled:cursor-not-allowed',
      variantClasses,
      sizeClasses
    ]"
    :disabled="disabled || loading"
    @click="(e) => emit('click', e)"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <slot />
  </button>
</template>
