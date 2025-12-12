<script setup lang="ts">
import DlytfulLogo from '~/components/ui/DlytfulLogo.vue'
import DlytfulCard from '~/components/ui/DlytfulCard.vue'
</script>

<template>
  <div class="min-h-screen bg-dlytful-cream flex flex-col items-center justify-center p-4 font-sans text-gray-900">
    <div class="mb-8 transform hover:scale-105 transition-transform duration-300">
      <NuxtLink to="/">
        <DlytfulLogo size="lg" />
      </NuxtLink>
    </div>
    
    <div class="w-full max-w-md">
      <DlytfulCard variant="elevated">
        <slot />
      </DlytfulCard>
    </div>
  </div>
</template>
