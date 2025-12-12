<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
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
      return 'bg-dlytful-sun text-white hover:bg-[#E68A00] shadow-sm'
    case 'secondary':
      return 'bg-dlytful-sky text-white hover:opacity-90 shadow-sm'
    case 'ghost':
      return 'bg-transparent text-dlytful-sun hover:bg-dlytful-sun/10'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'md':
      return 'px-5 py-2.5 text-base'
    case 'lg':
      return 'px-8 py-3.5 text-lg'
    default:
      return ''
  }
})
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium font-sans rounded-lg transition-all duration-150 ease-in-out box-border disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]',
      variantClasses,
      sizeClasses
    ]"
    :disabled="disabled || loading"
    @click="(e) => emit('click', e)"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <slot />
  </button>
</template>
