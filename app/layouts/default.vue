<template>
  <div class="min-h-screen bg-background text-text selection:bg-accent selection:text-black">
    <EnvironmentLayer />
    <div class="relative z-10 min-h-screen flex flex-col">
       <slot />
    </div>
  </div>
</template>

<script setup>
import EnvironmentLayer from '~/components/EnvironmentLayer.vue';
</script>
