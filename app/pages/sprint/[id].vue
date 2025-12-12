<script setup lang="ts">
import PromptBlock from '~/components/results/PromptBlock.vue'
import CopyAllButton from '~/components/results/CopyAllButton.vue'
import ExportMenu from '~/components/results/ExportMenu.vue'
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import DlytfulLogo from '~/components/ui/DlytfulLogo.vue'
import DlytfulInput from '~/components/ui/DlytfulInput.vue'
import { useSprintStore } from '~/stores/sprint'
import { useUserStore } from '~/stores/user'
import { useUIStore } from '~/stores/ui'
import { TIERS } from '~/constants/tiers'
import { getArchetype } from '~/constants/archetypes'
import type { GeneratedOutputs } from '~/types/sprint'

definePageMeta({
  layout: 'app'
})

const route = useRoute()
const router = useRouter()
const sprintStore = useSprintStore()
const userStore = useUserStore()
const uiStore = useUIStore()

const sprintId = computed(() => route.params.id as string)
const loading = ref(true)
const generating = ref(false)
const editingLabel = ref(false)
const labelInput = ref('')

// Fetch sprint on mount
onMounted(async () => {
  await sprintStore.loadSprint(sprintId.value)
  loading.value = false
  
  if (sprintStore.currentSprint) {
    labelInput.value = sprintStore.currentSprint.label || ''
  }
})

const sprint = computed(() => sprintStore.currentSprint)
const outputs = computed(() => sprint.value?.outputs as GeneratedOutputs | null)
const tier = computed(() => userStore.tier)

// Check if output is locked based on tier
const isLocked = (feature: 'foundation' | 'voice' | 'discoverability' | 'agent') => {
  if (tier.value === 'max') return false
  if (tier.value === 'one') {
    return feature === 'discoverability' || feature === 'agent'
  }
  // free tier
  return feature !== 'foundation' || true // foundation is locked for free
}

// Tier badge
const tierBadge = computed(() => {
  const t = sprint.value?.status === 'complete' ? tier.value : 'draft'
  return TIERS[t === 'draft' ? 'free' : t]?.name || 'Draft'
})

// Format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Label editing
const startEditLabel = () => {
  labelInput.value = sprint.value?.label || ''
  editingLabel.value = true
}

const saveLabel = async () => {
  if (sprint.value) {
    await sprintStore.updateSprint(sprint.value.id, { label: labelInput.value })
  }
  editingLabel.value = false
}

// Actions
const handleFork = async () => {
  if (!sprint.value) return
  
  const forked = await sprintStore.forkSprint(sprint.value.id)
  if (forked) {
    router.push(`/sprint/new?fork=${forked.id}`)
  }
}

const handleGenerate = async () => {
  if (!sprint.value) return
  
  generating.value = true
  try {
    await sprintStore.generateSprint(sprint.value.id)
    uiStore.showToast('success', 'Generation complete!')
  } catch (error) {
    uiStore.showToast('error', 'Generation failed. Please try again.')
  } finally {
    generating.value = false
  }
}

// Build markdown for export/copy
const markdownExport = computed(() => {
  if (!outputs.value) return ''
  
  const o = outputs.value
  return `# Brand Foundation

## Positioning
${o.positioning || ''}

## Rebrand Prompt
\`\`\`
${o.rebrand_prompt || ''}
\`\`\`

${o.foundation_prompt ? `## Foundation Prompt\n\`\`\`\n${o.foundation_prompt}\n\`\`\`\n` : ''}
${o.copy_angles ? `## Copy Angles\n${o.copy_angles.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n` : ''}
${o.social_bio ? `## Social Bio\n${o.social_bio}\n` : ''}
`
})

// Primary archetype info
const primaryArchetype = computed(() => {
  const id = sprint.value?.archetype_primary || sprint.value?.inputs?.archetype_primary
  return id ? getArchetype(id) : null
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin w-8 h-8 border-2 border-dlytful-sun border-t-transparent rounded-full"></div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!sprint" class="text-center py-20">
      <h2 class="font-serif text-2xl text-gray-900 mb-4">Sprint not found</h2>
      <NuxtLink to="/sprint/new">
        <DlytfulButton variant="primary">Start a new sprint</DlytfulButton>
      </NuxtLink>
    </div>

    <!-- Sprint Content -->
    <div v-else class="space-y-8">
      <!-- Header -->
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <!-- Label -->
          <div class="flex items-center gap-2 mb-1">
            <template v-if="editingLabel">
              <input
                v-model="labelInput"
                type="text"
                class="font-serif text-2xl md:text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-dlytful-sun focus:outline-none"
                @blur="saveLabel"
                @keydown.enter="saveLabel"
                autofocus
              />
            </template>
            <template v-else>
              <h1 
                class="font-serif text-2xl md:text-3xl font-bold text-gray-900 cursor-pointer hover:text-dlytful-sun transition-colors"
                @click="startEditLabel"
              >
                {{ sprint.label || `Sprint — ${formatDate(sprint.created_at)}` }}
              </h1>
              <button @click="startEditLabel" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </template>
          </div>
          
          <!-- Meta -->
          <div class="flex items-center gap-3 text-sm text-gray-500">
            <span>{{ formatDate(sprint.created_at) }}</span>
            <span 
              class="px-2 py-0.5 rounded-full text-xs font-semibold uppercase"
              :class="{
                'bg-gray-100 text-gray-600': sprint.status === 'draft',
                'bg-dlytful-sun/10 text-dlytful-sun': sprint.status === 'complete'
              }"
            >
              {{ sprint.status === 'complete' ? tierBadge : 'Draft' }}
            </span>
            <span v-if="primaryArchetype" class="flex items-center gap-1">
              <span 
                class="w-2 h-2 rounded-full" 
                :style="{ backgroundColor: primaryArchetype.color }"
              ></span>
              {{ primaryArchetype.name }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <ExportMenu 
            v-if="tier === 'max' && outputs"
            :sprint-id="sprint.id"
            :markdown="markdownExport"
          />
          
          <DlytfulButton 
            v-if="userStore.canFork"
            variant="ghost" 
            size="sm"
            @click="handleFork"
          >
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Fork
          </DlytfulButton>
        </div>
      </header>

      <!-- Draft State - No outputs yet -->
      <div v-if="sprint.status === 'draft' && !outputs?.rebrand_prompt" class="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <h2 class="font-serif text-xl font-semibold text-gray-900 mb-4">Ready to generate</h2>
        <p class="text-gray-600 mb-6">Your discovery inputs are saved. Generate your brand prompts now.</p>
        <DlytfulButton 
          variant="primary" 
          size="lg"
          :loading="generating"
          @click="handleGenerate"
        >
          Generate Prompts
        </DlytfulButton>
      </div>

      <!-- Outputs -->
      <template v-else-if="outputs">
        <!-- Copy All Button -->
        <CopyAllButton 
          v-if="outputs.rebrand_prompt"
          :content="outputs.rebrand_prompt" 
        />

        <!-- Output Blocks -->
        <div class="space-y-6">
          <PromptBlock 
            v-if="outputs.positioning"
            title="Positioning Statement" 
            :content="outputs.positioning"
            type="text"
          />

          <PromptBlock 
            v-if="outputs.rebrand_prompt"
            title="Rebrand Prompt" 
            :content="outputs.rebrand_prompt"
            type="code"
          />

          <PromptBlock 
            v-if="outputs.foundation_prompt || tier !== 'free'"
            title="Foundation Prompt" 
            :content="outputs.foundation_prompt || 'Generate with dlytful one to unlock this prompt.'"
            type="code"
            :locked="!outputs.foundation_prompt && tier === 'free'"
          />

          <PromptBlock 
            v-if="outputs.copy_angles || tier !== 'free'"
            title="Copy Angles" 
            :content="outputs.copy_angles || ['Upgrade to see copy angles']"
            type="list"
            :locked="!outputs.copy_angles && tier === 'free'"
          />

          <PromptBlock 
            v-if="outputs.social_bio || tier !== 'free'"
            title="Social Bio" 
            :content="outputs.social_bio || 'Upgrade to see your social bio.'"
            type="text"
            :locked="!outputs.social_bio && tier === 'free'"
          />

          <PromptBlock 
            v-if="outputs.voice_rules || tier !== 'free'"
            title="Voice Rules" 
            :content="outputs.voice_rules 
              ? `Sounds like: ${outputs.voice_rules.sounds_like?.join(', ')}\n\nNever like: ${outputs.voice_rules.never_like?.join(', ')}\n\nNever use: ${outputs.voice_rules.never_words?.join(', ')}`
              : 'Upgrade to see voice rules.'"
            type="text"
            :locked="!outputs.voice_rules && tier === 'free'"
          />

          <PromptBlock 
            v-if="outputs.discoverability_prompt || tier === 'max'"
            title="Discoverability Prompt" 
            :content="outputs.discoverability_prompt || 'Upgrade to dlytful max to unlock.'"
            type="code"
            :locked="!outputs.discoverability_prompt"
          />

          <PromptBlock 
            v-if="outputs.agent_prompt || tier === 'max'"
            title="Agent System Prompt" 
            :content="outputs.agent_prompt || 'Upgrade to dlytful max to unlock.'"
            type="code"
            :locked="!outputs.agent_prompt"
          />
        </div>
      </template>
    </div>
  </div>
</template>
