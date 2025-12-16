<template>
  <div class="relative flex items-center justify-center pointer-events-none" :class="$attrs.class">
    <!-- Outer Ring (Amber) -->
    <div 
      class="rounded-full border-[3px] opacity-85"
      :style="{
        borderColor: 'var(--accent, #B88A2A)',
        width: size + 'px',
        height: size + 'px'
      }"
    ></div>

    <!-- Inner Rotating Segment (Navy) -->
    <div 
        class="absolute rounded-full border-[3px] border-t-transparent border-r-transparent border-b-transparent animate-spin-slow"
        :style="{
            borderColor: 'var(--ink, #0B1020)',
            width: (size - 6) + 'px',
            height: (size - 6) + 'px',
            borderLeftColor: 'var(--ink, #0B1020)'
        }"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: Number,
    default: 44
  }
});
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 1s linear infinite;
}
</style>
