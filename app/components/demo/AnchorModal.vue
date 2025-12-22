<template>
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-[#0B0F1A]/90 backdrop-blur-sm transition-opacity" @click="$emit('close')"/>
        
        <!-- Modal Content -->
        <div class="relative w-full max-w-md bg-[#121624] border border-[#7FA6D6]/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <!-- Header -->
            <div class="p-6 border-b border-[#7FA6D6]/10">
                <h3 class="text-xl font-bold text-[#E9ECF3]">{{ content.title }}</h3>
            </div>
            
            <!-- Body -->
            <div class="p-6 space-y-6">
                <!-- Main Body Text -->
                <div class="space-y-4 text-sm text-[#7FA6D6] leading-relaxed whitespace-pre-wrap">
                    <p v-for="(paragraph, idx) in content.body" :key="idx">{{ paragraph }}</p>
                </div>
                
                <!-- Unlocking Benefits List -->
                <div v-if="content.unlocking && content.unlocking.length" class="space-y-3 p-4 bg-[#0B0F1A] rounded-lg border border-[#7FA6D6]/10">
                    <div class="text-[10px] uppercase tracking-widest text-[#C08A2B] font-bold">What unlocking does</div>
                    <ul class="space-y-2">
                        <li v-for="item in content.unlocking" :key="item" class="flex items-start gap-2 text-xs text-[#E9ECF3]">
                            <span class="mt-1 w-1 h-1 rounded-full bg-[#C08A2B]"/>
                            <span>{{ item }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <!-- Footer Actions -->
            <div class="p-6 pt-0 flex flex-col gap-3">
                <button 
                    class="w-full py-3 px-4 rounded-lg bg-[#C08A2B] hover:brightness-110 text-[#0B0F1A] font-bold uppercase tracking-widest text-xs transition-all" 
                    @click="$emit('primary')"
                >
                    {{ content.primaryCta }}
                </button>
                <button 
                    class="w-full py-2 px-4 rounded-lg bg-transparent hover:bg-[#7FA6D6]/5 text-[#7FA6D6] hover:text-[#E9ECF3] text-xs font-bold uppercase tracking-widest transition-all" 
                    @click="$emit('close')"
                >
                    {{ content.secondaryCta }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    isOpen: Boolean,
    content: Object
});

defineEmits(['close', 'primary']);
</script>
