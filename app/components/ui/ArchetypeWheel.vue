<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
    <button 
      v-for="(details, name) in archetypes" 
      :key="name"
      :class="[
        'p-3 rounded-lg border text-left transition-all relative overflow-hidden group',
        isSelected(name) 
          ? 'bg-accent text-black border-accent' 
          : 'bg-surface border-surfaceHighlight hover:border-textMuted text-textMuted hover:text-text'
      ]"
      @click="select(name)"
    >
      <div class="text-xs font-bold uppercase mb-1">{{ name }}</div>
      <div class="text-[10px] leading-tight opacity-80">{{ details.motto }}</div>
      
      <!-- Selection Indicator -->
      <div v-if="isSelected(name)" class="absolute top-1 right-1 w-2 h-2 rounded-full bg-black"/>
    </button>
  </div>
</template>

<script setup>
import { ARCHETYPES } from '~/utils/archetypes';
import { useDiscoveryStore } from '~/stores/discovery';

const store = useDiscoveryStore();
const archetypes = ARCHETYPES;

const isSelected = (name) => store.inputs.q4_archetype_primary === name;

const select = (name) => {
  store.setArchetype(name);
};
</script>
