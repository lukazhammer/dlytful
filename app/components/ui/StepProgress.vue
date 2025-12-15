<template>
  <div class="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-white/5 py-4 mb-8">
      <div class="max-w-xl mx-auto flex items-center justify-between text-xs font-mono uppercase tracking-wider mb-2">
           <span class="text-textMuted">Progress</span>
           <span class="text-text">{{ current }} / {{ total }}</span>
      </div>
      <div class="max-w-xl mx-auto h-0.5 bg-surfaceHighlight rounded-full overflow-hidden">
           <div 
             class="h-full bg-accent transition-all duration-500 ease-out" 
             :style="{ width: `${(current / total) * 100}%` }"
           />
      </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  current: number;
  total: number;
}>();
</script>
