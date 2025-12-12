<script setup lang="ts">
import { useClipboard } from '~/composables/useClipboard'
import { useUIStore } from '~/stores/ui'

interface Props {
  sprintId: string
  markdown: string
}

const props = defineProps<Props>()
const { copy } = useClipboard()
const uiStore = useUIStore()

const isOpen = ref(false)
const downloading = ref(false)

const handleDownload = async () => {
  downloading.value = true
  
  try {
    const response = await $fetch(`/api/sprints/${props.sprintId}/export`, {
      method: 'GET',
      responseType: 'blob'
    })
    
    // Create download link
    const blob = new Blob([response as BlobPart], { type: 'text/markdown' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `brand-foundation-${props.sprintId}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    uiStore.showToast('success', 'Downloaded!')
    isOpen.value = false
  } catch (error) {
    uiStore.showToast('error', 'Download failed. Please try again.')
  } finally {
    downloading.value = false
  }
}

const handleCopyForNotion = async () => {
  await copy(props.markdown)
  uiStore.showToast('success', 'Copied for Notion!')
  isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export
    </button>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-if="isOpen"
        class="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-100 py-2 z-20"
      >
        <button
          @click="handleDownload"
          :disabled="downloading"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 disabled:opacity-50"
        >
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{{ downloading ? 'Downloading...' : 'Download Markdown' }}</span>
        </button>
        
        <button
          @click="handleCopyForNotion"
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
        >
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy for Notion</span>
        </button>
      </div>
    </transition>

    <!-- Backdrop -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-10" 
      @click="isOpen = false"
    />
  </div>
</template>
