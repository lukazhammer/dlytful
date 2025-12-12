<script setup lang="ts">
import DlytfulInput from '~/components/ui/DlytfulInput.vue'
import type { DiscoveryInputs } from '~/types/sprint'
import { QUESTIONS } from '~/constants/questions'

interface Props {
  inputs: DiscoveryInputs
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update', key: keyof DiscoveryInputs, value: string): void
}>()

// Group questions by part for display
const groupedQuestions = computed(() => {
  const groups: Record<number, { label: string; questions: typeof QUESTIONS }> = {
    1: { label: 'Your Product', questions: [] },
    2: { label: 'Your Audience', questions: [] },
    3: { label: 'Your Edge', questions: [] },
    4: { label: 'Your Vibe', questions: [] }
  }
  
  QUESTIONS.forEach(q => {
    if (q.part <= 4 && groups[q.part]) {
      groups[q.part].questions.push(q)
    }
  })
  
  return groups
})

// Track which fields are being edited
const editingField = ref<string | null>(null)

const startEditing = (fieldId: string) => {
  editingField.value = fieldId
}

const stopEditing = () => {
  editingField.value = null
}

const getDisplayValue = (key: string): string => {
  const value = props.inputs[key as keyof DiscoveryInputs]
  return value || '(not answered)'
}
</script>

<template>
  <div class="space-y-10">
    <div class="text-center mb-8">
      <h2 class="font-serif text-2xl md:text-3xl text-gray-900 mb-3">
        This is what I'm hearing...
      </h2>
      <p class="text-gray-600 font-sans">
        Click any answer to edit. Does this feel right?
      </p>
    </div>

    <!-- Grouped Answers -->
    <div
      v-for="(group, partNum) in groupedQuestions"
      :key="partNum"
      class="space-y-4"
    >
      <h3 class="text-sm font-semibold text-dlytful-sky uppercase tracking-wide font-sans">
        {{ group.label }}
      </h3>
      
      <div class="space-y-3">
        <div
          v-for="question in group.questions"
          :key="question.id"
          class="bg-white rounded-xl p-4 border border-gray-100 hover:border-dlytful-sun/30 transition-colors cursor-pointer group"
          @click="startEditing(question.id)"
        >
          <p class="text-sm text-gray-500 font-sans mb-1">{{ question.text }}</p>
          
          <!-- Display Mode -->
          <div v-if="editingField !== question.id" class="flex items-start justify-between gap-4">
            <p class="text-gray-900 font-sans" :class="{ 'italic text-gray-400': !inputs[question.id as keyof DiscoveryInputs] }">
              {{ getDisplayValue(question.id) }}
            </p>
            <svg class="w-4 h-4 text-gray-300 group-hover:text-dlytful-sun transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          
          <!-- Edit Mode -->
          <div v-else @click.stop class="mt-2">
            <DlytfulInput
              :model-value="inputs[question.id as keyof DiscoveryInputs] || ''"
              :type="question.type === 'textarea' ? 'textarea' : 'text'"
              :placeholder="question.placeholder"
              :rows="3"
              @update:model-value="emit('update', question.id as keyof DiscoveryInputs, $event as string)"
              @blur="stopEditing"
              @keydown.enter.prevent="stopEditing"
            />
            <p class="text-xs text-gray-400 mt-1 font-sans">Press Enter or click outside to save</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
