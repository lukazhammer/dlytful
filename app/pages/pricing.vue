<template>
  <div class="container mx-auto px-6 py-20 text-center">
    <h1 class="text-3xl font-bold mb-10 text-brand">Pricing</h1>
    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <!-- Free -->
      <div class="bg-surface/50 border border-surfaceHighlight rounded-xl p-8 hover:border-textMuted transition-colors">
        <h3 class="text-xl font-bold mb-2">dlytful <span class="text-textMuted">zero</span></h3>
        <div class="text-3xl font-bold mb-6">$0</div>
        <ul class="space-y-3 text-sm text-textMuted text-left mb-8">
          <li>✓ 3 Brand Sprints</li>
          <li>✓ Watermarked Exports</li>
          <li>✓ Basic Archetypes</li>
        </ul>
        <button class="w-full bg-surfaceHighlight border border-textMuted text-text py-2 rounded-lg hover:bg-white hover:text-black hover:border-white transition-all">Start Free</button>
      </div>

      <!-- One -->
      <div class="relative bg-surface/80 border border-accent rounded-xl p-8 transform md:-translate-y-4 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-black text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</div>
        <h3 class="text-xl font-bold mb-2">dlytful <span class="text-accent">one</span></h3>
        <div class="text-3xl font-bold mb-6">$19<span class="text-sm font-normal text-textMuted">/mo</span></div>
        <ul class="space-y-3 text-sm text-text text-left mb-8">
          <li>✓ Unlimited Sprints</li>
          <li>✓ No Watermarks</li>
          <li>✓ Full exports (PDF/Notion)</li>
          <li>✓ Deep Archetype Analysis</li>
        </ul>
        <button class="w-full bg-accent text-black font-bold py-2 rounded-lg hover:scale-105 transition-transform">Get Started</button>
      </div>

      <!-- Max -->
      <div class="bg-surface/50 border border-surfaceHighlight rounded-xl p-8 hover:border-textMuted transition-colors">
        <h3 class="text-xl font-bold mb-2">dlytful <span class="text-brand">max</span></h3>
        <div class="text-3xl font-bold mb-6">$49<span class="text-sm font-normal text-textMuted">/mo</span></div>
        <ul class="space-y-3 text-sm text-textMuted text-left mb-8">
          <li>✓ Everything in One</li>
          <li>✓ Agent Voice Configuration</li>
          <li>✓ Team Collaboration</li>
          <li>✓ API Access</li>
        </ul>
        <button class="w-full bg-surfaceHighlight border border-textMuted text-text py-2 rounded-lg hover:bg-white hover:text-black hover:border-white transition-all">Contact Sales</button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>
