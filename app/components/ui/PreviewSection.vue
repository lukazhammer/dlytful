<template>
  <section 
    class="group relative border border-transparent rounded-lg transition-all duration-500"
    :class="isLocked 
      ? 'opacity-40 select-none pb-8' 
      : 'opacity-100 pb-8 hover:border-surfaceHighlight bg-surface/30 p-4 border-white/5'"
  >
    <div class="flex items-center justify-between mb-4">
       <h4 class="text-xs text-textMuted uppercase tracking-wider font-semibold flex items-center gap-2">
         {{ title }}
         <div v-if="isLocked" class="i-lucide-lock w-3 h-3 text-textMuted"/>
       </h4>
       <div v-if="status" class="text-[10px] text-accent uppercase font-mono">{{ status }}</div>
    </div>

    <div v-if="!isLocked" class="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <slot />
    </div>
    
    <div v-else class="flex items-center gap-2 text-sm text-textMuted font-mono leading-relaxed mt-2 opacity-60">
      <div class="i-lucide-lock w-3 h-3"/>
      {{ teaser }}
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  isLocked?: boolean;
  teaser?: string;
  status?: string;
}>();
</script>
