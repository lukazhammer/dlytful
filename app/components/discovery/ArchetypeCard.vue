<script setup lang="ts">
import type { Archetype } from '~/types/archetype'

interface Props {
  archetype: Archetype
  isRecommended?: boolean
  isSelected?: boolean
  isSecondary?: boolean
  isLocked?: boolean
  reasoning?: string
}

const props = withDefaults(defineProps<Props>(), {
  isRecommended: false,
  isSelected: false,
  isSecondary: false,
  isLocked: false
})

const emit = defineEmits<{
  (e: 'select'): void
}>()

const handleClick = () => {
  if (!props.isLocked) {
    emit('select')
  }
}
</script>

<template>
  <div
    class="relative rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group"
    :class="{
      'ring-2 ring-dlytful-sun shadow-lg': isSelected && !isSecondary,
      'ring-2 ring-dlytful-sky shadow-md': isSecondary,
      'opacity-50 cursor-not-allowed': isLocked,
      'hover:shadow-lg hover:-translate-y-0.5': !isLocked,
      'shadow-md': isRecommended && !isSelected
    }"
    @click="handleClick"
  >
    <!-- Colored Header -->
    <div 
      class="h-2 w-full"
      :style="{ backgroundColor: archetype.color }"
    />
    
    <!-- Content -->
    <div class="bg-white p-4">
      <!-- Recommended Badge -->
      <div v-if="isRecommended" class="absolute top-4 right-3">
        <span class="text-xs font-semibold text-dlytful-sun bg-dlytful-sun/10 px-2 py-0.5 rounded-full">
          Recommended
        </span>
      </div>
      
      <!-- Lock Icon -->
      <div v-if="isLocked" class="absolute top-4 right-3">
        <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      
      <!-- Name -->
      <h3 class="font-serif text-lg font-bold text-gray-900 mb-1 pr-16">
        {{ archetype.name }}
      </h3>
      
      <!-- Energy -->
      <p class="text-sm font-medium mb-2" :style="{ color: archetype.color }">
        {{ archetype.energy }}
      </p>
      
      <!-- Description -->
      <p class="text-sm text-gray-600 mb-3">
        {{ archetype.description }}
      </p>
      
      <!-- Reasoning (if recommended) -->
      <p v-if="reasoning" class="text-sm text-gray-500 italic border-t border-gray-100 pt-3 mt-3">
        "{{ reasoning }}"
      </p>
      
      <!-- Examples -->
      <div class="flex flex-wrap gap-1.5 mt-3">
        <span
          v-for="example in archetype.examples"
          :key="example"
          class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
        >
          {{ example }}
        </span>
      </div>
      
      <!-- Selection Indicator -->
      <div v-if="isSelected || isSecondary" class="mt-3 pt-3 border-t border-gray-100">
        <span 
          class="text-xs font-semibold uppercase tracking-wide"
          :class="isSecondary ? 'text-dlytful-sky' : 'text-dlytful-sun'"
        >
          {{ isSecondary ? 'Secondary' : 'Primary' }} archetype
        </span>
      </div>
    </div>
  </div>
</template>
