<template>
  <div class="container mx-auto px-6 py-10">
    <div class="flex items-center justify-between mb-10">
      <h1 class="text-2xl font-bold text-brand">Your Sprints</h1>
      <NuxtLink to="/app" class="bg-accent text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-white transition-colors">
        + New Sprint
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div class="text-center py-20 border border-dashed border-surfaceHighlight rounded-xl">
      <div class="text-textMuted mb-4">No sprints yet.</div>
      <NuxtLink to="/app" class="text-accent hover:underline">Start your first discovery</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>
