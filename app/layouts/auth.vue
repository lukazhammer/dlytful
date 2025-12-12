<script setup lang="ts">
import DlytfulLogo from '~/components/ui/DlytfulLogo.vue'
</script>

<template>
  <div class="min-h-screen bg-dlytful-linen flex flex-col items-center justify-center px-6 py-12 font-sans text-dlytful-ink">
    <!-- Logo: Quiet anchor -->
    <div class="mb-10">
      <NuxtLink to="/" class="block hover:opacity-80 transition-opacity">
        <DlytfulLogo size="md" />
      </NuxtLink>
    </div>
    
    <!-- Card: Simple container, not attention-seeking -->
    <div class="w-full max-w-sm">
      <div class="bg-white rounded-card border border-dlytful-border-subtle p-8 shadow-soft">
        <slot />
      </div>
    </div>
    
    <!-- Back link: Always a way home -->
    <div class="mt-8">
      <NuxtLink 
        to="/" 
        class="text-sm text-dlytful-ink-muted hover:text-dlytful-ink transition-colors"
      >
        ← Back to home
      </NuxtLink>
    </div>
  </div>
</template>
