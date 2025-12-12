<script setup lang="ts">
import EmailForm from '~/components/waitlist/EmailForm.vue'
import DlytfulLogo from '~/components/ui/DlytfulLogo.vue'

definePageMeta({
  layout: 'default'
})

// Scroll animation logic
const observer = ref<IntersectionObserver | null>(null)
const animatedElements = ref<Set<Element>>(new Set())

onMounted(() => {
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up')
        observer.value?.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.value?.observe(el)
  })
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<template>
  <div class="flex flex-col gap-24 md:gap-32">
    <!-- Hero Section -->
    <section class="text-center pt-8 md:pt-16 max-w-4xl mx-auto px-4 reveal-on-scroll opacity-0 translate-y-4 transition-all duration-700">
      <h1 class="font-serif text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
        You built something.<br class="hidden md:block" />
        Now make it look like<br class="hidden md:block" />
        <span class="text-dlytful-sun">it has a soul.</span>
      </h1>
      <p class="font-sans text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Paste one prompt into Bolt. See the difference.
      </p>
      
      <div class="max-w-md mx-auto mb-12">
        <EmailForm variant="hero" />
      </div>
    </section>

    <!-- Problem Section -->
    <section class="max-w-3xl mx-auto px-4 text-center reveal-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100">
      <h2 class="font-serif text-2xl font-semibold text-dlytful-sky mb-6">The Gap</h2>
      <p class="font-sans text-xl md:text-2xl text-gray-800 leading-relaxed font-light">
        You shipped with Cursor, Bolt, or Replit. It works. But it looks like... <span class="italic font-serif">a template</span>. 
        Same fonts as everyone else. No clear message. No reason to remember you.
      </p>
    </section>

    <!-- Solution Section -->
    <section class="max-w-3xl mx-auto px-4 text-center reveal-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100">
      <h2 class="font-serif text-2xl font-semibold text-dlytful-herb mb-6">The Translation</h2>
      <p class="font-sans text-xl md:text-2xl text-gray-800 leading-relaxed font-light">
        <span class="font-bold">dlytful</span> translates what you meant into what people see. 
        Answer a few questions. Get a prompt. Paste it. Watch your app transform.
      </p>
    </section>

    <!-- How It Works Section -->
    <section class="max-w-5xl mx-auto px-4 reveal-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100">
      <div class="grid md:grid-cols-3 gap-8 md:gap-12">
        <div class="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
          <div class="w-12 h-12 bg-dlytful-sun/10 text-dlytful-sun rounded-full flex items-center justify-center mx-auto mb-4 font-serif font-bold text-xl">1</div>
          <h3 class="font-serif text-xl font-bold mb-3">Tell us about your product</h3>
          <p class="text-gray-600">Answer 3-5 simple questions about what you built and who it's for. (2 min)</p>
        </div>
        <div class="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
          <div class="w-12 h-12 bg-dlytful-sky/10 text-dlytful-sky rounded-full flex items-center justify-center mx-auto mb-4 font-serif font-bold text-xl">2</div>
          <h3 class="font-serif text-xl font-bold mb-3">Get your translation</h3>
          <p class="text-gray-600">We generate a comprehensive brand prompt including colors, fonts, and vibe.</p>
        </div>
        <div class="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
          <div class="w-12 h-12 bg-dlytful-herb/10 text-dlytful-herb rounded-full flex items-center justify-center mx-auto mb-4 font-serif font-bold text-xl">3</div>
          <h3 class="font-serif text-xl font-bold mb-3">Paste and transform</h3>
          <p class="text-gray-600">Drop the prompt into your AI builder and watch your app come to life.</p>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="text-center py-12 md:py-24 max-w-3xl mx-auto px-4 reveal-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100">
      <h2 class="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-8">
        Join the waitlist. <br />
        <span class="text-gray-500 text-2xl md:text-3xl font-medium mt-2 block">Get the free brand kit immediately.</span>
      </h2>
      <div class="max-w-md mx-auto">
        <EmailForm variant="footer" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
</style>
