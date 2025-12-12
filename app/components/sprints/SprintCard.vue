<script setup lang="ts">
import type { Sprint } from '~/types/sprint'
import { getArchetype } from '~/constants/archetypes'

interface Props {
  sprint: Sprint
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'fork'): void
}>()

const router = useRouter()

// Format relative date
const relativeDate = computed(() => {
  const date = new Date(props.sprint.created_at)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

// Archetypes
const primaryArchetype = computed(() => {
  const id = props.sprint.archetype_primary || props.sprint.inputs?.archetype_primary
  return id ? getArchetype(id) : null
})

const secondaryArchetype = computed(() => {
  const id = props.sprint.archetype_secondary || props.sprint.inputs?.archetype_secondary
  return id ? getArchetype(id) : null
})

const handleClick = () => {
  router.push(`/sprint/${props.sprint.id}`)
}

const showActions = ref(false)
</script>

<template>
  <div
    class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group relative"
    :class="{ 'p-3': compact }"
    @click="handleClick"
    @mouseenter="showActions = true"
    @mouseleave="showActions = false"
  >
    <!-- Fork indicator -->
    <div v-if="sprint.parent_id" class="text-xs text-gray-400 mb-2 flex items-center gap-1">
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
      Forked
    </div>

    <!-- Main content -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <!-- Label -->
        <h3 class="font-serif font-semibold text-gray-900 truncate" :class="compact ? 'text-base' : 'text-lg'">
          {{ sprint.label || 'Untitled Sprint' }}
        </h3>
        
        <!-- Meta row -->
        <div class="flex items-center gap-3 mt-1 text-sm text-gray-500">
          <span>{{ relativeDate }}</span>
          <span 
            class="px-1.5 py-0.5 rounded text-xs font-medium"
            :class="{
              'bg-amber-100 text-amber-700': sprint.status === 'draft',
              'bg-green-100 text-green-700': sprint.status === 'complete'
            }"
          >
            {{ sprint.status === 'complete' ? 'Complete' : 'Draft' }}
          </span>
        </div>
        
        <!-- Archetypes -->
        <div v-if="primaryArchetype || secondaryArchetype" class="flex items-center gap-2 mt-2">
          <div 
            v-if="primaryArchetype"
            class="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
            :style="{ backgroundColor: primaryArchetype.color + '20', color: primaryArchetype.color }"
          >
            <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: primaryArchetype.color }"></span>
            {{ primaryArchetype.name.replace('The ', '') }}
          </div>
          <div 
            v-if="secondaryArchetype"
            class="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
            :style="{ backgroundColor: secondaryArchetype.color + '20', color: secondaryArchetype.color }"
          >
            <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: secondaryArchetype.color }"></span>
            {{ secondaryArchetype.name.replace('The ', '') }}
          </div>
        </div>
      </div>

      <!-- Quick actions (on hover) -->
      <div 
        v-if="showActions && !compact"
        class="flex items-center gap-1"
        @click.stop
      >
        <button 
          @click="emit('fork')"
          class="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          title="Fork"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button 
          @click="emit('delete')"
          class="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
