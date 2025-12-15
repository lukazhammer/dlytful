<template>
  <div class="font-mono text-sm leading-relaxed space-y-6 relative pb-20">
    <div v-if="!store.unlocks.has_started" class="text-textMuted italic opacity-50 text-center mt-20">
      <div class="i-lucide-lock w-8 h-8 mx-auto mb-2 opacity-50"/>
      Start answering to unlock your Brand Prompt.
    </div>

    <div v-else class="space-y-6 animate-in fade-in duration-500">
      <!-- Section 1: Foundation (Context) -->
      <section class="group relative p-4 border border-transparent hover:border-surfaceHighlight rounded-lg transition-colors">
        <h4 class="text-xs text-textMuted uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>/ Project Context</span>
          <span v-if="!store.inputs.q1_core_what" class="text-[10px] text-accent">IN PROGRESS</span>
        </h4>
        <div class="text-text font-mono text-xs opacity-90">
            <span class="text-accent">Objective:</span> Build a {{ store.inputs.q1_core_what || '[Product]' }} for {{ store.inputs.q2_audience_who || '[Audience]' }}.
        </div>
      </section>

      <!-- Section 2: Positioning (Strategy) -->
      <section 
        class="group relative p-4 border border-transparent rounded-lg transition-all duration-500"
        :class="store.inputs.q2_audience_who ? 'opacity-100 hover:border-surfaceHighlight' : 'opacity-40 select-none'"
      >
        <h4 class="text-xs text-textMuted uppercase tracking-wider mb-2 flex items-center gap-2">
           / Strategy
           <div v-if="!store.inputs.q2_audience_who" class="i-lucide-lock w-3 h-3"/>
        </h4>
        <div class="text-text font-mono text-xs" :class="{'blur-sm': !store.inputs.q2_audience_who}">
           <span class="text-accent">Positioning:</span> For {{ store.inputs.q2_audience_who || '...' }}, this is the {{ store.inputs.q1_core_what || '...' }} that {{ store.inputs.q7_competitors_differentiation || '...' }}.
        </div>
      </section>

      <!-- Section 3: Design Tokens (Derived) -->
      <section 
        class="group relative p-4 border border-transparent rounded-lg transition-all duration-500"
         :class="store.unlocks.archetype_revealed ? 'opacity-100 hover:border-surfaceHighlight' : 'opacity-40 select-none'"
      >
         <h4 class="text-xs text-textMuted uppercase tracking-wider mb-2 flex items-center gap-2">
           / Design Tokens
           <div v-if="!store.unlocks.archetype_revealed" class="i-lucide-lock w-3 h-3"/>
         </h4>
         
         <div v-if="store.unlocks.archetype_revealed" class="animate-in zoom-in duration-500">
             <!-- Dynamic Color Swatch -->
             <div class="flex items-center gap-3 mb-2">
                <div class="w-6 h-6 rounded border border-white/10" :style="{ backgroundColor: getArchetypeColor(store.inputs.q4_archetype_primary) }"/>
                <div class="text-xs text-textMuted">Primary: {{ getArchetypeColor(store.inputs.q4_archetype_primary) }}</div>
             </div>
             
             <div class="text-xs text-text font-mono">
                <div>Radius: {{ getRadius(store.inputs.q3_vibe_adjectives) }}</div>
                <div>Font: {{ getFont(store.inputs.q3_vibe_adjectives) }}</div>
             </div>
         </div>
         <div v-else class="text-text blur-sm text-xs font-mono">
            Primary: #3B82F6<br>
            Radius: 0.5rem<br>
            Font: Inter
         </div>
      </section>

      <!-- Copy Action (Sticky Bottom) -->
      <div 
        class="fixed md:absolute bottom-6 left-0 w-full px-6 md:px-0 flex justify-center transition-all duration-500"
        :class="store.unlocks.q1_complete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'"
      >
        <button 
          class="bg-accent text-black font-mono font-bold text-xs uppercase px-6 py-3 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          @click="copyPrompt"
        >
          <span class="i-lucide-copy w-4 h-4"/>
          {{ copied ? 'Copied!' : 'Copy Brand Prompt' }}
        </button>
      </div>

      <!-- Watermark -->
      <div v-if="store.unlocks.has_started" class="pt-10 pb-20 text-[10px] text-textMuted uppercase tracking-widest opacity-30 text-center">
        Generated with dlytful.com
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDiscoveryStore } from '~/stores/discovery';
import { ARCHETYPES } from '~/utils/archetypes';
import { buildBrandPrompt } from '~/utils/prompts';

const store = useDiscoveryStore();



const getArchetypeColor = (name) => {
    return name && ARCHETYPES[name] ? ARCHETYPES[name].color : '#333';
}

const getRadius = (vibes) => {
    if (!vibes) return '0.5rem';
    const s = vibes.join(' ').toLowerCase();
    if (s.includes('playful')) return '1rem (Rounded)';
    if (s.includes('serious')) return '0px (Sharp)';
    return '0.5rem';
}

const getFont = (vibes) => {
    if (!vibes) return 'Inter';
    const s = vibes.join(' ').toLowerCase();
    if (s.includes('playful')) return 'Outfit';
    if (s.includes('luxury')) return 'Cormorant';
    return 'Inter';
}

const copied = ref(false)
const copyPrompt = () => {
  const content = buildBrandPrompt(store.inputs, 'Free'); // Default to Free for now
  navigator.clipboard.writeText(content);
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>
