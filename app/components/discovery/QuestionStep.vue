<script setup lang="ts">
import DlytfulInput from '~/components/ui/DlytfulInput.vue'
import type { Question } from '~/constants/questions'

interface Props {
  question: Question
  modelValue: string
  isLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLast: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'next'): void
  (e: 'back'): void
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Handle keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey && props.question.type !== 'textarea') {
    e.preventDefault()
    emit('next')
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Question Text -->
    <h2 class="font-serif text-2xl md:text-3xl text-gray-900 leading-relaxed">
      {{ question.text }}
    </h2>
    
    <!-- Input based on type -->
    <div class="space-y-2">
      <!-- Textarea -->
      <template v-if="question.type === 'textarea'">
        <DlytfulInput
          v-model="localValue"
          type="textarea"
          :placeholder="question.placeholder"
          :rows="4"
          class="text-lg"
        />
      </template>
      
      <!-- Text Input -->
      <template v-else-if="question.type === 'text'">
        <DlytfulInput
          v-model="localValue"
          type="text"
          :placeholder="question.placeholder"
          class="text-lg"
          @keydown="handleKeydown"
        />
      </template>
      
      <!-- Select -->
      <template v-else-if="question.type === 'select'">
        <select
          v-model="localValue"
          class="w-full px-4 py-3 rounded-lg bg-dlytful-cream border border-gray-200 font-sans text-lg focus:outline-none focus:ring-2 focus:ring-dlytful-sun/50 focus:border-dlytful-sun transition-all duration-150"
        >
          <option value="" disabled>{{ question.placeholder || 'Select an option' }}</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="sometimes">Sometimes</option>
        </select>
      </template>
      
      <!-- Archetype (slot for ArchetypeWheel) -->
      <template v-else-if="question.type === 'archetype'">
        <slot name="archetype" />
      </template>
      
      <!-- Hint -->
      <p v-if="question.placeholder && question.type === 'textarea'" class="text-sm text-gray-500 font-sans">
        {{ question.placeholder }}
      </p>
    </div>
  </div>
</template>
