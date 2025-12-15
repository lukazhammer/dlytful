<template>
  <div class="flex flex-wrap gap-3">
    <button
      v-for="vibe in vibes"
      :key="vibe"
      class="px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300"
      :class="isSelected(vibe) 
        ? 'bg-accent text-black border-accent hover:opacity-90' 
        : 'bg-surface/50 border-surfaceHighlight text-textMuted hover:border-text hover:text-text'"
      @click="toggle(vibe)"
    >
      {{ vibe }}
    </button>
    
    <!-- Custom Input -->
    <div class="relative flex items-center min-w-[120px]">
       <input 
         v-model="customVibe" 
         type="text"
         placeholder="+ Add own"
         class="w-full bg-transparent border-b border-surfaceHighlight py-2 text-sm text-text focus:outline-none focus:border-accent placeholder:text-textMuted/50"
         @keydown.enter.prevent="addCustom"
         @blur="addCustom"
       >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDiscoveryStore } from '~/stores/discovery';

const store = useDiscoveryStore();
const customVibe = ref('');

const vibes = [
  'Modern', 'Minimal', 'Playful', 'Serious', 'Luxury', 
  'Organic', 'Tech', 'Friendly', 'Bold', 'Calm',
  'Retro', 'Corporate', 'Futuristic', 'Elegant'
];

const isSelected = (vibe: string) => store.inputs.q3_vibe_adjectives.includes(vibe);

const toggle = (vibe: string) => {
  const current = [...store.inputs.q3_vibe_adjectives];
  if (current.includes(vibe)) {
    store.updateInput('q3_vibe_adjectives', current.filter(v => v !== vibe));
  } else {
    if (current.length >= 5) return; // Max 5
    store.updateInput('q3_vibe_adjectives', [...current, vibe]);
  }
};

const addCustom = () => {
  const val = customVibe.value.trim();
  if (val && !store.inputs.q3_vibe_adjectives.includes(val)) {
     if (store.inputs.q3_vibe_adjectives.length >= 5) return;
     store.updateInput('q3_vibe_adjectives', [...store.inputs.q3_vibe_adjectives, val]);
     customVibe.value = '';
  }
}
</script>
