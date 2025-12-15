<template>
  <div class="relative w-12 h-12 flex items-center justify-center pointer-events-none select-none" :style="{ opacity: 0.5 + progress * 0.5 }">
    <!-- Outer Ring (Flat Glow) -->
    <div 
      class="absolute inset-0 rounded-full border border-accent/20 transition-opacity duration-700 scale-125"
      :class="progress > 0.8 ? 'opacity-100' : 'opacity-20'"
    />
    
    <!-- The Sun (Gold Ring) -->
    <div class="absolute inset-0 rounded-full border-[2px] border-accent shadow-[0_0_20px_rgba(192,138,43,0.4)] bg-[#0B0F1A] overflow-hidden">
        <!-- Inner flat fill (Ink) -->
    </div>
    
    <!-- The Eclipse (Shadow Disk) -->
    <!-- Progress 0 = Sun (Shadow far right) -->
    <!-- Progress 1 = Eclipse (Shadow centered) -->
    <div 
        class="absolute inset-0 rounded-full bg-background transform transition-transform duration-700 ease-out border border-transparent"
        :style="{ transform: `translateX(${40 - (progress * 40)}%) scale(0.95)` }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  progress: {
    type: Number,
    default: 0
  }
})
</script>
