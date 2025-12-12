<script setup lang="ts">
interface Props {
  modelValue: string | number
  label?: string // Optional internal label handling
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'textarea'
  disabled?: boolean
  required?: boolean
  autocomplete?: string
  rows?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  rows: 4
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur', event: FocusEvent): void
}>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

// Source of truth from login.vue:
// w-full px-4 py-3 bg-white border border-dlytful-border rounded-soft text-dlytful-ink placeholder:text-dlytful-ink-muted/50 focus:outline-none focus:border-dlytful-sun/50 focus:ring-2 focus:ring-dlytful-sun/10 transition-all disabled:opacity-50
const inputClasses = computed(() => {
  return [
    // Base layout & typography
    'w-full px-4 py-3 font-sans',
    // Colors & Borders
    'bg-white border border-dlytful-border rounded-soft',
    'text-dlytful-ink placeholder:text-dlytful-ink-muted/50',
    // Focus States
    'focus:outline-none focus:border-dlytful-sun/50 focus:ring-2 focus:ring-dlytful-sun/10',
    // Transitions & States
    'transition-all disabled:opacity-50',
    props.class
  ]
})
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" class="block text-sm text-dlytful-ink-light mb-1.5">
      {{ label }}
    </label>
    
    <textarea
      v-if="type === 'textarea'"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      @input="updateValue"
      @blur="(e) => emit('blur', e)"
    />
    
    <input
      v-else
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :class="inputClasses"
      @input="updateValue"
      @blur="(e) => emit('blur', e)"
    />
  </div>
</template>
