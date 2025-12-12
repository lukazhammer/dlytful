<script setup lang="ts">
import SprintCard from './SprintCard.vue'
import type { Sprint } from '~/types/sprint'

interface Props {
  sprints: Sprint[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'fork', id: string): void
}>()

interface TreeNode {
  sprint: Sprint
  children: TreeNode[]
  expanded: boolean
}

// Build tree structure from sprints
const tree = computed(() => {
  const sprintMap = new Map<string, Sprint>()
  const childrenMap = new Map<string, Sprint[]>()
  
  // Index all sprints
  props.sprints.forEach(sprint => {
    sprintMap.set(sprint.id, sprint)
    
    if (sprint.parent_id) {
      const siblings = childrenMap.get(sprint.parent_id) || []
      siblings.push(sprint)
      childrenMap.set(sprint.parent_id, siblings)
    }
  })
  
  // Build tree nodes
  const buildNode = (sprint: Sprint): TreeNode => ({
    sprint,
    children: (childrenMap.get(sprint.id) || []).map(buildNode),
    expanded: true
  })
  
  // Get root sprints (no parent)
  const roots = props.sprints
    .filter(s => !s.parent_id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  
  return roots.map(buildNode)
})

// Track expanded state
const expandedNodes = ref<Set<string>>(new Set())

const toggleExpand = (id: string) => {
  if (expandedNodes.value.has(id)) {
    expandedNodes.value.delete(id)
  } else {
    expandedNodes.value.add(id)
  }
}

const isExpanded = (id: string) => {
  return !expandedNodes.value.has(id) // Default expanded
}
</script>

<template>
  <div class="space-y-2">
    <template v-for="node in tree" :key="node.sprint.id">
      <!-- Root node -->
      <div class="relative">
        <div class="flex items-start gap-2">
          <!-- Expand toggle if has children -->
          <button 
            v-if="node.children.length > 0"
            @click.stop="toggleExpand(node.sprint.id)"
            class="mt-4 p-1 hover:bg-gray-100 rounded text-gray-400"
          >
            <svg 
              class="w-4 h-4 transition-transform" 
              :class="{ 'rotate-90': isExpanded(node.sprint.id) }"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div v-else class="w-6"></div>
          
          <div class="flex-1">
            <SprintCard 
              :sprint="node.sprint"
              @delete="emit('delete', node.sprint.id)"
              @fork="emit('fork', node.sprint.id)"
            />
          </div>
        </div>
        
        <!-- Children (indented) -->
        <div 
          v-if="node.children.length > 0 && isExpanded(node.sprint.id)"
          class="ml-8 mt-2 pl-4 border-l-2 border-gray-100 space-y-2"
        >
          <template v-for="child in node.children" :key="child.sprint.id">
            <div class="relative">
              <!-- Connector line -->
              <div class="absolute -left-4 top-5 w-4 h-0.5 bg-gray-100"></div>
              
              <div class="flex items-start gap-2">
                <button 
                  v-if="child.children.length > 0"
                  @click.stop="toggleExpand(child.sprint.id)"
                  class="mt-4 p-1 hover:bg-gray-100 rounded text-gray-400"
                >
                  <svg 
                    class="w-4 h-4 transition-transform" 
                    :class="{ 'rotate-90': isExpanded(child.sprint.id) }"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div v-else class="w-6"></div>
                
                <div class="flex-1">
                  <SprintCard 
                    :sprint="child.sprint"
                    compact
                    @delete="emit('delete', child.sprint.id)"
                    @fork="emit('fork', child.sprint.id)"
                  />
                </div>
              </div>
              
              <!-- Grandchildren -->
              <div 
                v-if="child.children.length > 0 && isExpanded(child.sprint.id)"
                class="ml-8 mt-2 pl-4 border-l-2 border-gray-100 space-y-2"
              >
                <div v-for="grandchild in child.children" :key="grandchild.sprint.id" class="relative">
                  <div class="absolute -left-4 top-4 w-4 h-0.5 bg-gray-100"></div>
                  <SprintCard 
                    :sprint="grandchild.sprint"
                    compact
                    @delete="emit('delete', grandchild.sprint.id)"
                    @fork="emit('fork', grandchild.sprint.id)"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
