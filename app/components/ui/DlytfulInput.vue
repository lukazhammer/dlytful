<script setup lang="ts">
interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'textarea'
  error?: string
  disabled?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  rows: 4
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const inputClasses = computed(() => {
  return [
    'w-full px-4 py-3 rounded-lg bg-dlytful-cream border transition-all duration-150 ease-in-out font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dlytful-sun/50 focus:border-dlytful-sun',
    props.error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 hover:border-gray-300',
    props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
  ]
})
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" class="text-sm font-medium text-gray-700 font-sans ml-1">
      {{ label }}
    </label>
    
    <textarea
      v-if="type === 'textarea'"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      @input="updateValue"
    />
    
    <input
      v-else
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      @input="updateValue"
    />

    <span v-if="error" class="text-sm text-red-500 font-sans ml-1">
      {{ error }}
    </span>
  </div>
</template>
