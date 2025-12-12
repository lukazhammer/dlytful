<script setup lang="ts">
import DlytfulLogo from '~/components/ui/DlytfulLogo.vue'
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
</script>

<template>
  <div class="min-h-screen bg-dlytful-cream flex flex-col font-sans text-gray-900">
    <header class="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
      <NuxtLink to="/">
        <DlytfulLogo size="md" />
      </NuxtLink>
      <div class="flex gap-4">
        <NuxtLink to="/login">
            <DlytfulButton variant="ghost" size="md">Log in</DlytfulButton>
        </NuxtLink>
        <NuxtLink to="/waitlist">
            <DlytfulButton variant="secondary" size="md">Get Early Access</DlytfulButton>
        </NuxtLink>
      </div>
    </header>

    <main class="flex-grow w-full max-w-7xl mx-auto px-6 py-12">
      <slot />
    </main>

    <footer class="w-full py-8 text-center text-gray-500 text-sm border-t border-gray-200/50 mt-auto">
      <p class="font-medium text-gray-600">For indie builders who ship with intention.</p>
      <p class="mt-2 text-gray-400">&copy; {{ new Date().getFullYear() }} dlytful.</p>
    </footer>
  </div>
</template>
