<template>
    <div class="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 backdrop-blur-[2px] bg-[#0B0F1A]/60">
        <!-- Lock Icon -->
        <div class="mb-3 p-2 rounded-full bg-[#121624] border border-[#7FA6D6]/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#7FA6D6]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        
        <!-- Text Content -->
        <div class="max-w-[280px] space-y-3">
            <p class="text-sm font-bold text-[#E9ECF3]">{{ title }}</p>
            <p class="text-[10px] text-[#7FA6D6] leading-relaxed opacity-90">{{ description }}</p>
            
            <!-- Feature List -->
            <ul v-if="features && features.length" class="text-[10px] text-[#7FA6D6]/70 text-left space-y-1.5 py-2 pl-2">
                <li v-for="f in features" :key="f" class="flex items-start gap-2">
                    <span class="mt-0.5 w-1 h-1 rounded-full bg-[#C08A2B]"/>
                    <span>{{ f }}</span>
                </li>
            </ul>

            <!-- CTA -->
            <button 
                class="w-full mt-2 py-2 px-4 rounded bg-[#C08A2B]/10 hover:bg-[#C08A2B]/20 border border-[#C08A2B]/30 hover:border-[#C08A2B]/50 text-[#C08A2B] text-[10px] font-bold uppercase tracking-widest transition-all"
                @click="$emit('click')"
            >
                {{ cta }}
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    description: String,
    features: Array,
    cta: String
});
</script>
