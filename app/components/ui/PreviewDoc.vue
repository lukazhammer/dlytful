<template>
  <div class="relative h-full flex flex-col font-mono text-sm">
    <!-- Scrollable Content Area -->
    <div class="flex-1 overflow-y-auto px-6 py-8 pb-32 scrollbar-hide">
      
      <!-- Empty State -->
      <div v-if="!store.unlocks.has_started" class="flex flex-col items-center justify-center h-full opacity-50 text-textMuted space-y-4">
        <div class="i-lucide-file-code w-12 h-12 opacity-50"/>
        <div class="text-center">
            <p>Start answering to unlock</p>
            <p class="text-xs font-bold mt-1">BRAND PROMPT DOC</p>
        </div>
      </div>

      <!-- Compiled Markdown Output -->
      <div v-else class="animate-in fade-in duration-500">
          <div v-if="store.isGenerating" class="text-accent text-xs mb-4 flex items-center gap-2">
              <div class="i-lucide-loader-2 animate-spin"/>
              Compiling...
          </div>
          <pre class="whitespace-pre-wrap font-mono text-text/80 text-xs leading-relaxed">{{ store.compiledPromptMarkdown || '...' }}</pre>
      </div>
    </div>

    <!-- Sticky Footer Actions -->
    <div 
        class="absolute bottom-6 right-6 transition-all duration-500 z-20"
        :class="store.unlocks.q1_complete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'"
    >
        <button 
          class="bg-accent hover:bg-accent/90 text-black font-bold text-xs uppercase px-5 py-3 rounded shadow-xl flex items-center gap-2 transition-transform active:scale-95"
          @click="startCopy"
        >
          <span class="i-lucide-copy w-4 h-4"/>
          {{ copied ? 'Copied!' : 'COPY BRAND PROMPT' }}
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDiscoveryStore } from '~/stores/discovery';
import { useDebounceFn } from '@vueuse/core';

const store = useDiscoveryStore();
const copied = ref(false);

const compile = useDebounceFn(() => {
    store.compileBrandPrompt();
}, 800);

watch(() => store.inputs, () => {
    if (store.unlocks.has_started) {
        compile();
    }
}, { deep: true, immediate: true });

const startCopy = () => {
    // Fallback if compile hasn't run yet
    const text = store.compiledPromptMarkdown;
    if (!text) return;
    
    navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
