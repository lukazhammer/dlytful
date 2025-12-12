<script setup lang="ts">
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import { TIERS, type TierKey } from '~/constants/tiers'

interface Props {
  tier: TierKey
  isCurrent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCurrent: false
})

const emit = defineEmits<{
  (e: 'upgrade'): void
}>()

const tierData = computed(() => TIERS[props.tier])

// Features to display
const features = computed(() => {
  const t = props.tier
  const base = ['Basic rebrand prompt', 'Positioning statement']
  
  if (t === 'free') {
    return [...base, '3 discovery questions', '1 archetype match']
  }
  
  if (t === 'one') {
    return [
      ...base,
      'Full discovery (11 questions)',
      '6 archetype options',
      'Foundation prompt',
      'Copy angles & social bio',
      'Voice rules',
      'Sprint history & forking'
    ]
  }
  
  // max
  return [
    ...base,
    'Full discovery (12 questions)',
    'All 12 archetypes',
    'Foundation prompt',
    'Copy angles & social bio',
    'Voice rules',
    'Sprint history & forking',
    'Discoverability prompt',
    'AI agent system prompt',
    'Markdown export'
  ]
})
</script>

<template>
  <div 
    class="rounded-xl p-6 transition-all"
    :class="{
      'border-2 border-dlytful-sun bg-dlytful-sun/5': isCurrent,
      'border border-gray-200 bg-white hover:border-gray-300': !isCurrent
    }"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="font-serif text-xl font-bold text-gray-900">
          {{ tierData.name }}
        </h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          {{ tierData.price }}
          <span v-if="tier !== 'free'" class="text-sm font-normal text-gray-500">/month</span>
        </p>
      </div>
      <span 
        v-if="isCurrent"
        class="px-2 py-1 rounded-full text-xs font-semibold bg-dlytful-sun text-white"
      >
        Current
      </span>
    </div>

    <!-- Features -->
    <ul class="space-y-2 mb-6">
      <li 
        v-for="(feature, index) in features" 
        :key="index"
        class="flex items-start gap-2 text-sm text-gray-600"
      >
        <svg class="w-5 h-5 text-dlytful-herb flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ feature }}
      </li>
    </ul>

    <!-- CTA -->
    <DlytfulButton 
      v-if="!isCurrent"
      variant="primary"
      size="lg"
      class="w-full"
      @click="emit('upgrade')"
    >
      Upgrade to {{ tierData.name }}
    </DlytfulButton>
    
    <p v-else class="text-center text-sm text-gray-500">
      You're on this plan
    </p>
  </div>
</template>
