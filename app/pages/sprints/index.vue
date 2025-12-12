<script setup lang="ts">
import SprintCard from '~/components/sprints/SprintCard.vue'
import SprintTree from '~/components/sprints/SprintTree.vue'
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import DlytfulCard from '~/components/ui/DlytfulCard.vue'
import { useSprintStore } from '~/stores/sprint'
import { useUserStore } from '~/stores/user'
import { useUIStore } from '~/stores/ui'

definePageMeta({
  layout: 'app',
  middleware: ['paid-only']
})

const router = useRouter()
const sprintStore = useSprintStore()
const userStore = useUserStore()
const uiStore = useUIStore()

const loading = ref(true)
const viewMode = ref<'list' | 'tree'>('list')
const sortBy = ref<'recent' | 'oldest'>('recent')
const deleteConfirm = ref<string | null>(null)

// Check tier access
const hasAccess = computed(() => userStore.tier !== 'free')

// Load sprints
onMounted(async () => {
  if (hasAccess.value) {
    await sprintStore.loadSprints()
  }
  loading.value = false
})

// Sorted sprints
const sortedSprints = computed(() => {
  const sprints = [...sprintStore.sprints]
  
  if (sortBy.value === 'recent') {
    return sprints.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } else {
    return sprints.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }
})

// Actions
const handleFork = async (id: string) => {
  const forked = await sprintStore.forkSprint(id)
  if (forked) {
    router.push(`/sprint/new?fork=${forked.id}`)
  }
}

const handleDelete = async (id: string) => {
  deleteConfirm.value = id
}

const confirmDelete = async () => {
  if (!deleteConfirm.value) return
  
  try {
    const api = useApi()
    await api.del(`/sprints/${deleteConfirm.value}`)
    sprintStore.sprints = sprintStore.sprints.filter(s => s.id !== deleteConfirm.value)
    uiStore.showToast('success', 'Sprint deleted')
  } catch (error) {
    uiStore.showToast('error', 'Failed to delete sprint')
  }
  
  deleteConfirm.value = null
}

const cancelDelete = () => {
  deleteConfirm.value = null
}
</script>

<template>
  <div>
    <!-- Upgrade Gate for Free Users -->
    <div v-if="!hasAccess" class="text-center py-20">
      <DlytfulCard variant="bordered" class="max-w-md mx-auto">
        <div class="p-6">
          <div class="w-16 h-16 bg-dlytful-sun/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-dlytful-sun" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="font-serif text-2xl font-bold text-gray-900 mb-3">Unlock Sprint History</h2>
          <p class="text-gray-600 mb-6">
            Save, iterate, and compare your brand translations with dlytful one or max.
          </p>
          <NuxtLink to="/pricing">
            <DlytfulButton variant="primary" size="lg" class="w-full">
              See Plans
            </DlytfulButton>
          </NuxtLink>
        </div>
      </DlytfulCard>
    </div>

    <!-- Sprint List -->
    <div v-else>
      <!-- Header -->
      <header class="mb-8">
        <h1 class="font-serif text-3xl font-bold text-gray-900 mb-2">Your Sprints</h1>
        <p class="text-gray-600">Fork and iterate on your brand translations</p>
      </header>

      <!-- Controls -->
      <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
        <!-- Sort -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Sort:</span>
          <button 
            @click="sortBy = 'recent'"
            class="px-3 py-1.5 rounded-lg text-sm transition-colors"
            :class="sortBy === 'recent' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            Recent
          </button>
          <button 
            @click="sortBy = 'oldest'"
            class="px-3 py-1.5 rounded-lg text-sm transition-colors"
            :class="sortBy === 'oldest' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            Oldest
          </button>
        </div>

        <!-- View toggle (desktop only) -->
        <div class="hidden md:flex items-center gap-2">
          <span class="text-sm text-gray-500">View:</span>
          <button 
            @click="viewMode = 'list'"
            class="p-2 rounded-lg transition-colors"
            :class="viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button 
            @click="viewMode = 'tree'"
            class="p-2 rounded-lg transition-colors"
            :class="viewMode === 'tree' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-xl h-24 animate-pulse"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedSprints.length === 0" class="text-center py-20">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 class="font-serif text-xl font-semibold text-gray-900 mb-2">No sprints yet</h2>
        <p class="text-gray-600 mb-6">Start your first brand translation</p>
        <NuxtLink to="/sprint/new">
          <DlytfulButton variant="primary">Start New Sprint</DlytfulButton>
        </NuxtLink>
      </div>

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="space-y-3">
        <SprintCard 
          v-for="sprint in sortedSprints"
          :key="sprint.id"
          :sprint="sprint"
          @fork="handleFork(sprint.id)"
          @delete="handleDelete(sprint.id)"
        />
      </div>

      <!-- Tree View -->
      <SprintTree 
        v-else
        :sprints="sortedSprints"
        @fork="handleFork"
        @delete="handleDelete"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div 
        v-if="deleteConfirm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="cancelDelete"
      >
        <DlytfulCard variant="elevated" class="max-w-sm w-full">
          <div class="p-6 text-center">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 class="font-serif text-xl font-semibold text-gray-900 mb-2">Delete Sprint?</h3>
            <p class="text-gray-600 mb-6">This action cannot be undone. All outputs will be lost.</p>
            <div class="flex gap-3">
              <DlytfulButton variant="ghost" class="flex-1" @click="cancelDelete">
                Cancel
              </DlytfulButton>
              <button 
                @click="confirmDelete"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </DlytfulCard>
      </div>
    </Teleport>
  </div>
</template>
