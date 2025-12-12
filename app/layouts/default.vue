<script setup lang="ts">
import DlytfulLogo from '~/components/ui/DlytfulLogo.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans">
    <!-- Header: Transparent, sits on hero's cool background -->
    <header class="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between max-w-content mx-auto w-full">
      <NuxtLink to="/" class="hover:opacity-70 transition-opacity">
        <DlytfulLogo size="md" />
      </NuxtLink>
      
      <NuxtLink 
        to="/login" 
        class="text-sm text-dlytful-ink-distant hover:text-dlytful-ink-cool transition-colors"
      >
        Sign in <span class="text-[10px] opacity-70 ml-0.5">(early access)</span>
      </NuxtLink>
    </header>

    <!-- Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer: The sound fading -->
    <footer class="px-6 py-20 text-center bg-dlytful-cream-dark">
      <p class="text-xs text-dlytful-ink-muted/40">
        For indie builders who ship with intention.
      </p>
      <p class="text-[10px] text-dlytful-ink-muted/25 mt-4">
        &copy; {{ new Date().getFullYear() }} dlytful
      </p>
    </footer>
  </div>
</template>
