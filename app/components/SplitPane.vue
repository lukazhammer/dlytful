<template>
  <div class="flex flex-col md:flex-row h-screen">
    <!-- Left Pane: Input/Discovery -->
    <div class="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto border-b md:border-b-0 md:border-r border-surfaceHighlight bg-background z-20">
       <slot name="input" />
    </div>

    <!-- Right Pane: Preview/Output -->
    <div class="hidden md:flex w-full md:w-1/2 bg-surface p-6 md:p-10 overflow-y-auto flex-col z-10">
       <div class="sticky top-0 bg-surface/95 backdrop-blur py-2 mb-4 border-b border-surfaceHighlight flex justify-between items-center">
         <h2 class="text-sm font-mono text-textMuted uppercase tracking-widest">Brand Prompt Preview</h2>
         <slot name="actions" />
       </div>
       <slot name="preview" />
    </div>

    <!-- Mobile Bottom Sheet for Preview -->
    <div
class="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-surfaceHighlight z-50 transition-transform duration-300 transform"
         :class="showMobilePreview ? 'translate-y-0 h-[80vh]' : 'translate-y-[calc(100%-60px)] h-[80vh]'">
      <div class="h-[60px] flex items-center justify-between px-6 cursor-pointer bg-surfaceHighlight/50" @click="toggleMobilePreview">
        <span class="text-xs font-mono text-accent uppercase tracking-wider">
          {{ showMobilePreview ? 'Hide Preview' : 'Show Brand Prompt' }}
        </span>
        <div class="w-8 h-1 bg-textMuted rounded-full"/>
      </div>
      <div class="p-6 h-full overflow-y-auto pb-20">
         <slot name="preview" />
      </div>
    </div>
  </div>
</template>

<script setup>
const showMobilePreview = ref(false)
const toggleMobilePreview = () => showMobilePreview.value = !showMobilePreview.value
</script>
