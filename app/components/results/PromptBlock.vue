<script setup lang="ts">
import CopyButton from '~/components/ui/CopyButton.vue'

interface Props {
  title: string
  content: string | string[]
  type?: 'text' | 'code' | 'list'
  locked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  locked: false
})

const formattedContent = computed(() => {
  if (Array.isArray(props.content)) {
    return props.content.join('\n')
  }
  return props.content
})

const displayList = computed(() => {
  if (props.type === 'list' && Array.isArray(props.content)) {
    return props.content
  }
  return null
})
</script>

<template>
  <div class="relative group">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-serif text-lg font-semibold text-gray-900">{{ title }}</h3>
      <CopyButton 
        v-if="!locked" 
        :content="formattedContent" 
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>

    <!-- Content -->
    <div 
      class="relative rounded-xl p-5 transition-all duration-200"
      :class="{
        'bg-gray-50': type === 'code',
        'bg-white border border-gray-100': type !== 'code'
      }"
    >
      <!-- Locked Overlay -->
      <div 
        v-if="locked" 
        class="absolute inset-0 backdrop-blur-sm bg-white/60 rounded-xl flex flex-col items-center justify-center z-10"
      >
        <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p class="text-gray-600 font-medium mb-2">Upgrade to unlock</p>
        <NuxtLink to="/pricing">
          <button class="text-sm text-dlytful-sun hover:underline font-medium">
            See plans →
          </button>
        </NuxtLink>
      </div>

      <!-- Code Block -->
      <template v-if="type === 'code'">
        <pre 
          class="font-mono text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto"
          :class="{ 'blur-sm select-none': locked }"
        >{{ formattedContent }}</pre>
      </template>

      <!-- List -->
      <template v-else-if="type === 'list' && displayList">
        <ul 
          class="space-y-2"
          :class="{ 'blur-sm select-none': locked }"
        >
          <li 
            v-for="(item, index) in displayList" 
            :key="index"
            class="flex items-start gap-2 text-gray-700"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-dlytful-sun mt-2 flex-shrink-0"></span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </template>

      <!-- Text -->
      <template v-else>
        <p 
          class="text-gray-700 leading-relaxed whitespace-pre-wrap"
          :class="{ 'blur-sm select-none': locked }"
        >{{ formattedContent }}</p>
      </template>
    </div>
  </div>
</template>
