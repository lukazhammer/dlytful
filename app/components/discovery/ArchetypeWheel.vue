<script setup lang="ts">
import { ARCHETYPES } from '~/constants/archetypes'
import ArchetypeCard from './ArchetypeCard.vue'
import type { Archetype } from '~/types/archetype'

interface Selection {
  primary: string | null
  secondary: string | null
}

interface Props {
  recommended?: string[]
  selected: Selection
  available?: number
  disabled?: boolean
  reasoning?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  recommended: () => [],
  available: 12,
  disabled: false,
  reasoning: () => ({})
})

const emit = defineEmits<{
  (e: 'update:selected', value: Selection): void
}>()

// Wheel calculations
const wheelSize = ref(360)
const segmentAngle = 360 / 12

// Check window size for responsive behavior
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
    wheelSize.value = isMobile.value ? 280 : 360
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  onUnmounted(() => window.removeEventListener('resize', checkMobile))
})

// Calculate segment path for SVG
const getSegmentPath = (index: number) => {
  const radius = wheelSize.value / 2
  const innerRadius = radius * 0.35
  const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
  const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)
  
  const x1 = radius + Math.cos(startAngle) * radius
  const y1 = radius + Math.sin(startAngle) * radius
  const x2 = radius + Math.cos(endAngle) * radius
  const y2 = radius + Math.sin(endAngle) * radius
  const x3 = radius + Math.cos(endAngle) * innerRadius
  const y3 = radius + Math.sin(endAngle) * innerRadius
  const x4 = radius + Math.cos(startAngle) * innerRadius
  const y4 = radius + Math.sin(startAngle) * innerRadius
  
  return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`
}

// Get label position for each segment
const getLabelPosition = (index: number) => {
  const radius = wheelSize.value / 2
  const labelRadius = radius * 0.72
  const angle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180)
  
  return {
    x: radius + Math.cos(angle) * labelRadius,
    y: radius + Math.sin(angle) * labelRadius,
    rotation: (index + 0.5) * segmentAngle
  }
}

const isArchetypeLocked = (index: number) => {
  return index >= props.available
}

const isArchetypeRecommended = (id: string) => {
  return props.recommended.includes(id)
}

const isArchetypeSelected = (id: string) => {
  return props.selected.primary === id
}

const isArchetypeSecondary = (id: string) => {
  return props.selected.secondary === id
}

const handleSegmentClick = (archetype: Archetype, index: number, event: MouseEvent) => {
  if (props.disabled || isArchetypeLocked(index)) return
  
  const isShiftClick = event.shiftKey
  
  if (isArchetypeSelected(archetype.id)) {
    // Deselect primary
    emit('update:selected', { ...props.selected, primary: null })
  } else if (isArchetypeSecondary(archetype.id)) {
    // Deselect secondary
    emit('update:selected', { ...props.selected, secondary: null })
  } else if (isShiftClick && props.selected.primary) {
    // Set as secondary
    emit('update:selected', { ...props.selected, secondary: archetype.id })
  } else if (props.selected.primary && !props.selected.secondary) {
    // Second click sets secondary
    emit('update:selected', { ...props.selected, secondary: archetype.id })
  } else {
    // Set as primary
    emit('update:selected', { primary: archetype.id, secondary: props.selected.secondary })
  }
}

// Hovered archetype for tooltip
const hoveredArchetype = ref<Archetype | null>(null)

// Get recommended archetypes for panel
const recommendedArchetypes = computed(() => {
  return ARCHETYPES.filter(a => props.recommended.includes(a.id))
})
</script>

<template>
  <div class="space-y-8">
    <!-- Desktop: Wheel View -->
    <div v-if="!isMobile" class="flex flex-col items-center">
      <div 
        class="relative"
        :style="{ width: wheelSize + 'px', height: wheelSize + 'px' }"
      >
        <svg 
          :width="wheelSize" 
          :height="wheelSize" 
          class="transform -rotate-[15deg]"
        >
          <g v-for="(archetype, index) in ARCHETYPES" :key="archetype.id">
            <!-- Segment -->
            <path
              :d="getSegmentPath(index)"
              :fill="archetype.color"
              :class="{
                'opacity-40': !isArchetypeRecommended(archetype.id) && !isArchetypeSelected(archetype.id) && !isArchetypeSecondary(archetype.id),
                'opacity-20 cursor-not-allowed': isArchetypeLocked(index),
                'cursor-pointer hover:brightness-110 transition-all': !disabled && !isArchetypeLocked(index)
              }"
              :stroke="isArchetypeSelected(archetype.id) ? '#FF9A00' : isArchetypeSecondary(archetype.id) ? '#007FFF' : 'white'"
              :stroke-width="isArchetypeSelected(archetype.id) || isArchetypeSecondary(archetype.id) ? 4 : 1"
              @click="handleSegmentClick(archetype, index, $event)"
              @mouseenter="hoveredArchetype = archetype"
              @mouseleave="hoveredArchetype = null"
            />
            
            <!-- Lock icon for unavailable -->
            <text
              v-if="isArchetypeLocked(index)"
              :x="getLabelPosition(index).x"
              :y="getLabelPosition(index).y"
              text-anchor="middle"
              dominant-baseline="middle"
              class="text-gray-500 text-lg pointer-events-none"
            >
              🔒
            </text>
          </g>
        </svg>
        
        <!-- Center Circle -->
        <div 
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg flex flex-col items-center justify-center text-center p-4"
          :style="{ width: (wheelSize * 0.35) + 'px', height: (wheelSize * 0.35) + 'px' }"
        >
          <template v-if="hoveredArchetype">
            <p class="font-serif font-bold text-sm text-gray-900">{{ hoveredArchetype.name }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ hoveredArchetype.description }}</p>
          </template>
          <template v-else-if="selected.primary">
            <p class="text-xs text-gray-400 uppercase tracking-wide">Selected</p>
            <p class="font-serif font-bold text-sm text-gray-900">{{ ARCHETYPES.find(a => a.id === selected.primary)?.name }}</p>
          </template>
          <template v-else>
            <p class="text-xs text-gray-400">Click to select</p>
          </template>
        </div>
      </div>
      
      <!-- Labels around wheel -->
      <div class="mt-4 text-center text-sm text-gray-500">
        <p v-if="!selected.primary">Click an archetype to select it as your primary</p>
        <p v-else-if="!selected.secondary">Click another to set your secondary (optional)</p>
        <p v-else class="text-dlytful-herb">Both archetypes selected ✓</p>
      </div>
    </div>
    
    <!-- Mobile: Card View -->
    <div v-else class="space-y-4">
      <p class="text-sm text-gray-500 text-center mb-4">
        Tap to select your primary archetype
      </p>
      
      <!-- Recommended First -->
      <div v-if="recommendedArchetypes.length > 0" class="space-y-3">
        <p class="text-xs font-semibold text-dlytful-sun uppercase tracking-wide">Recommended for you</p>
        <ArchetypeCard
          v-for="archetype in recommendedArchetypes"
          :key="archetype.id"
          :archetype="archetype"
          :is-recommended="true"
          :is-selected="isArchetypeSelected(archetype.id)"
          :is-secondary="isArchetypeSecondary(archetype.id)"
          :reasoning="reasoning[archetype.id]"
          @select="handleSegmentClick(archetype, ARCHETYPES.findIndex(a => a.id === archetype.id), $event as any)"
        />
      </div>
      
      <!-- All Others -->
      <div class="space-y-3 mt-6">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">All archetypes</p>
        <ArchetypeCard
          v-for="(archetype, index) in ARCHETYPES"
          :key="archetype.id"
          :archetype="archetype"
          :is-recommended="isArchetypeRecommended(archetype.id)"
          :is-selected="isArchetypeSelected(archetype.id)"
          :is-secondary="isArchetypeSecondary(archetype.id)"
          :is-locked="isArchetypeLocked(index)"
          @select="handleSegmentClick(archetype, index, $event as any)"
        />
      </div>
    </div>
    
    <!-- Recommendation Panel (Desktop) -->
    <div v-if="!isMobile && recommendedArchetypes.length > 0" class="bg-dlytful-cream/50 rounded-xl p-6 max-w-lg mx-auto">
      <p class="font-serif text-lg font-semibold text-gray-900 mb-4">
        Based on what you've shared...
      </p>
      <div class="space-y-3">
        <div 
          v-for="archetype in recommendedArchetypes" 
          :key="archetype.id"
          class="flex items-start gap-3"
        >
          <div 
            class="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
            :style="{ backgroundColor: archetype.color }"
          />
          <div>
            <p class="font-medium text-gray-900">{{ archetype.name }}</p>
            <p v-if="reasoning[archetype.id]" class="text-sm text-gray-600">
              {{ reasoning[archetype.id] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Pulse animation for recommended segments */
@keyframes subtle-pulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.1); }
}

path.recommended {
  animation: subtle-pulse 2s ease-in-out infinite;
}
</style>
