<template>
  <svg :width="width" :height="height" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" class="cloud-drift" :style="{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }">
    <defs>
      <filter id="cloud-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feOffset dx="0" dy="4" result="offsetblur"/>
        <feFlood flood-color="var(--cloudShadow)" flood-opacity="1"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <g class="cloud-shape" filter="url(#cloud-shadow)" :fill="color" :opacity="opacity">
      <!-- Shape 1: Uneven Lobe Stack -->
      <path v-if="variant === 1" d="M20 80 L180 80 Q170 40 140 50 Q120 20 80 40 Q50 30 20 60 Z" />
      
      <!-- Shape 2: Flat Bottom Heavy Left -->
      <path v-if="variant === 2" d="M10 85 L150 85 Q140 55 110 65 Q90 35 50 45 Q30 55 10 85 Z" />
      
      <!-- Shape 3: Long Flat Stretch -->
      <path v-if="variant === 3" d="M10 75 L190 75 Q180 55 150 60 Q120 45 80 55 Q40 50 10 75 Z" />
      
      <!-- Shape 4: Double Peak Asymmetric -->
      <path v-if="variant === 4" d="M30 80 L160 80 Q150 50 120 60 Q100 30 60 50 Q40 60 30 80 Z" />
      
      <!-- Shape 5: Small Cluster -->
      <path v-if="variant === 5" d="M40 70 L120 70 Q110 50 90 55 Q70 40 50 55 L40 70 Z" />
      
      <!-- Shape 6: Large Lobe Right -->
      <path v-if="variant === 6" d="M20 75 L170 75 Q160 35 120 50 Q90 40 60 60 L20 75 Z" />

      <!-- Shape 7: Low Profile -->
      <path v-if="variant === 7" d="M10 80 L180 80 Q160 65 120 70 Q80 60 40 70 L10 80 Z" />

      <!-- Shape 8: Whispy End -->
      <path v-if="variant === 8" d="M30 70 L150 70 Q140 50 110 55 Q80 40 50 60 Z" />
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  variant: {
    type: Number,
    default: 1
  },
  width: {
    type: [Number, String],
    default: 200
  },
  height: {
    type: [Number, String],
    default: 120
  },
  color: {
    type: String,
    default: 'var(--cloud)'
  },
  opacity: {
    type: [Number, String],
    default: 0.8
  },
  duration: {
    type: Number,
    default: 20
  },
  delay: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.cloud-drift {
    animation-name: drift;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
}
</style>
