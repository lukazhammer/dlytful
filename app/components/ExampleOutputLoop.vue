<template>
  <div class="flex flex-col items-center w-full max-w-lg mx-auto" @mouseenter="pause" @mouseleave="resume">
    <!-- Header Labels -->
    <div class="text-center mb-6 space-y-1">
        <h3 class="text-[10px] tracking-widest uppercase font-bold text-accent">Watch it build itself</h3>
        <p class="text-[10px] text-textMuted uppercase font-mono">Two minutes. Real example.</p>
    </div>
    
    <div class="text-[10px] tracking-widest uppercase mb-2 font-mono text-text/50">Example Output</div>

    <!-- Main Card -->
    <div class="w-full relative bg-surface border border-surfaceHighlight rounded-xl overflow-hidden shadow-2xl h-[320px] transition-all duration-500 hover:border-accent/30">
        
        <!-- State 1: Input -->
        <div v-if="activeState === 0" class="absolute inset-0 p-6 animate-in fade-in zoom-in-95 duration-500">
            <div class="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <div class="i-lucide-pencil-line w-4 h-4 text-textMuted"/>
                <span class="text-xs font-bold uppercase tracking-wider text-textMuted">Raw Input</span>
            </div>
            <div class="font-mono text-sm leading-relaxed text-text/80 whitespace-pre-wrap">
I made a habit tracker for people who start routines then fall off.
I do not want it to feel like a productivity cult.
No streak shame. No "grind" language.
It should feel calm, human, forgiving, a little witty.
The point is consistency, not intensity.
Audience is busy adults who want small wins.
I want it to feel like a companion, not a coach.
            </div>
        </div>

        <!-- State 2: Positioning (Logic) -->
        <div v-if="activeState === 1" class="absolute inset-0 p-6 animate-in fade-in zoom-in-95 duration-500">
             <div class="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <div class="i-lucide-brain-circuit w-4 h-4 text-accent"/>
                <span class="text-xs font-bold uppercase tracking-wider text-accent">Logic Extracted</span>
            </div>
            <div class="font-mono text-sm leading-relaxed text-text">
                <p class="mb-4">
For busy adults who want small wins, <span class="text-white font-bold">Drift</span> is a calm habit tracker that helps you return to routines without guilt, because it rewards consistency and recovery instead of streaks and shame.
                </p>
                <div class="p-3 bg-accent/10 border border-accent/20 rounded text-xs">
                    <span class="text-accent uppercase font-bold text-[10px] block mb-1">Promise</span>
                    Miss a day. Come back anyway.
                </div>
            </div>
        </div>

        <!-- State 3: Brand Prompt (Formatted output) -->
        <div v-if="activeState === 2" class="absolute inset-0 bg-[#0B0F1A] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500">
             <div class="flex items-center justify-between p-3 border-b border-white/10 bg-[#0F1320]">
                <span class="text-[10px] font-bold uppercase tracking-wider text-green-400 flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-green-400"/>
                    Ready to build
                </span>
                <div class="i-lucide-file-code w-3 h-3 text-textMuted"/>
            </div>
            
            <div class="p-5 font-mono text-[11px] leading-relaxed text-blue-100 overflow-y-auto scrollbar-hide">
<span class="text-gray-500">You are writing and designing for a habit tracker called Drift.</span>

<span class="text-purple-300 font-bold block mt-3 mb-1">Positioning:</span>
For busy adults who want small wins, Drift is a calm habit tracker that helps you return to routines without guilt, because it rewards consistency and recovery instead of streaks and shame.

<span class="text-purple-300 font-bold block mt-3 mb-1">Promise:</span>
Miss a day. Come back anyway.

<span class="text-purple-300 font-bold block mt-3 mb-1">Voice rules:</span>
Sounds like: <span class="text-orange-300">calm, human, lightly witty</span>
Never like: <span class="text-red-300">hustle culture, shame, toxic optimism</span>
Never words: <span class="text-red-300">crush it, grind, beast mode, discipline, no excuses, optimize, hack, win</span>

<span class="text-purple-300 font-bold block mt-3 mb-1">UI direction:</span>
- Make returning frictionless. Default to "resume" instead of "restart."
- Celebrate recovery, not perfection.
- Avoid streak obsession and red warning states.
- Use warm, low pressure microcopy.

<span class="text-purple-300 font-bold block mt-3 mb-1">Design tokens:</span>
Accent <span class="text-[#C08A2B]">#C08A2B</span>, Ink #0B0F1A, Base #223A66, Radius 0.75rem, Font Inter
            </div>
        </div>
    </div>

    <!-- Dots -->
    <div class="flex justify-center gap-3 mt-4">
        <button 
            v-for="i in [0, 1, 2]" 
            :key="i"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="activeState === i ? 'bg-accent w-6' : 'bg-white/20 hover:bg-white/40'"
            @click="jumpTo(i)"
        />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const activeState = ref(0);
let timer = null;

const startCycle = () => {
    timer = setInterval(() => {
        activeState.value = (activeState.value + 1) % 3;
    }, 3000); // 3 seconds per state
};

const pause = () => {
    if (timer) clearInterval(timer);
};

const resume = () => {
    pause(); // ensure clean
    startCycle();
};

const jumpTo = (i) => {
    activeState.value = i;
    pause();
    // Resume auto-cycle after interaction delay if desired, or let user resume via mouseleave
    // Logic says "Pause on hover", but click implies manual control. Let's just rely on mouseleave to resume.
};

onMounted(() => {
    startCycle();
});

onUnmounted(() => {
    pause();
});
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
