<template>
  <div class="flex flex-col items-center gap-3">
    <!-- Top Label -->
    <div class="text-[10px] uppercase tracking-widest text-textMuted opacity-60">Example output</div>

    <!-- Card Container -->
    <div class="relative w-full max-w-[340px] aspect-[16/10] bg-surface bg-opacity-80 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl overflow-hidden font-mono text-xs select-none group ring-1 ring-white/5">
        
        <!-- State A: Messy Input -->
        <div
class="absolute inset-0 p-8 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
             :class="activeState === 0 ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 -translate-y-4 scale-95 blur-sm'">
             <div class="space-y-4 opacity-70">
                <div class="pl-3 border-l-2 border-white/10">
                   <span class="text-textMuted block mb-1">// Input</span>
                   <span class="text-text text-sm">"app for plants water reminder... ppl who kill plants"</span>
                </div>
                <div class="flex gap-2">
                    <span class="w-12 h-2 rounded bg-white/10"/>
                    <span class="w-8 h-2 rounded bg-white/10"/>
                </div>
             </div>
        </div>

        <!-- State B: Positioning -->
        <div
class="absolute inset-0 p-8 flex flex-col justify-center items-center text-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
             :class="activeState === 1 ? 'opacity-100 translate-y-0 scale-100 blur-0' : activeState > 1 ? 'opacity-0 -translate-y-4 scale-95 blur-sm' : 'opacity-0 translate-y-4 scale-105 blur-sm'">
             <div class="text-accent/90 text-lg font-sans font-light leading-snug">
                "The minimalist hydration companion for the urban jungle."
             </div>
        </div>

        <!-- State C: Structured Output -->
        <div
class="absolute inset-0 p-6 bg-surfaceHighlight/10 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
             :class="activeState === 2 ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-4 scale-105 blur-sm'">
             <div class="space-y-2.5">
                <div class="text-textMuted text-[10px] uppercase tracking-wider mb-2 pb-2 border-b border-white/5"># Brand Core</div>
                
                <div class="grid grid-cols-[80px_1fr] items-center">
                    <span class="text-purple-400">Archetype</span>
                    <span class="text-text">Caregiver</span>
                </div>
                
                <div class="grid grid-cols-[80px_1fr] items-center">
                    <span class="text-blue-400">Voice</span>
                    <span class="text-text">Warm, Concise</span>
                </div>
                
                <div class="grid grid-cols-[80px_1fr] items-center">
                     <span class="text-yellow-400">Tokens</span>
                     <div class="flex gap-1.5">
                        <div class="w-3 h-3 rounded-full bg-[#34D399] ring-1 ring-white/10"/>
                        <div class="w-3 h-3 rounded-full bg-[#FBBF24] ring-1 ring-white/10"/>
                        <div class="w-3 h-3 rounded-full bg-[#1F2937] border border-white/20"/>
                     </div>
                </div>

                <div class="mt-2 p-2 bg-black/20 rounded border border-white/5 text-[10px] text-textMuted">
                    // Paste-ready config...
                </div>
             </div>
        </div>
        
        <!-- Progress Indicators -->
        <div class="absolute bottom-3 left-0 w-full flex justify-center gap-1.5">
            <div class="w-1 h-1 rounded-full bg-white transition-opacity duration-300" :class="activeState === 0 ? 'opacity-50' : 'opacity-10'"/>
            <div class="w-1 h-1 rounded-full bg-white transition-opacity duration-300" :class="activeState === 1 ? 'opacity-50' : 'opacity-10'"/>
            <div class="w-1 h-1 rounded-full bg-white transition-opacity duration-300" :class="activeState === 2 ? 'opacity-50' : 'opacity-10'"/>
        </div>
    </div>

    <!-- Bottom Label -->
    <div class="text-[10px] text-textMuted opacity-50 font-light">
        Positioning, voice, tokens, paste-ready prompt
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const activeState = ref(0);
let interval: ReturnType<typeof setInterval>;

onMounted(() => {
    interval = setInterval(() => {
        activeState.value = (activeState.value + 1) % 3;
    }, 3000);
});

onUnmounted(() => {
    if (interval) clearInterval(interval);
});
</script>
