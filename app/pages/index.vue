<script setup lang="ts">
import EmailForm from '~/components/waitlist/EmailForm.vue'

definePageMeta({
  layout: 'default'
})

const observer = ref<IntersectionObserver | null>(null)

onMounted(() => {
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        observer.value?.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.reveal').forEach(el => {
    observer.value?.observe(el)
  })
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<template>
  <div class="min-h-screen">
    
    <!-- ═══════════════════════════════════════════════════════════
         I. MOTIF DECLARATION (HERO)
         Withheld, cool, unresolved — minor key
         ═══════════════════════════════════════════════════════════ -->
    <section class="hero-section min-h-[90vh] flex flex-col justify-center px-6 relative overflow-hidden bg-dlytful-cool">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 via-transparent to-dlytful-cool-muted/20"></div>
      </div>
      
      <div class="max-w-2xl relative z-10">
        <!-- Note 1: The calm assertion -->
        <p class="text-dlytful-ink-cool hero-text leading-[1.1] tracking-tight font-serif mb-8">
          You made something real.
        </p>
        
        <!-- Note 2: The heavier realization -->
        <p class="motif-line mt-32 mb-4">
          It just doesn’t look like yours yet.
        </p>
        
        <!-- Commentary (secondary) -->
        <p class="hero-subtext text-dlytful-ink-distant mt-12 max-w-md leading-relaxed">
          Not a branding problem. Not a design problem.
          <span class="block mt-1">A recognition problem.</span>
        </p>

        <p class="text-dlytful-ink-distant/60 mt-20 text-sm max-w-sm">
          This isn't for people building companies. 
          It's for people who built something they can't stop thinking about.
        </p>

        <div class="mt-14">
          <NuxtLink 
            to="#join" 
            class="group inline-flex flex-col items-start"
          >
            <span class="text-dlytful-ink-cool text-sm border-b border-dlytful-border-cool pb-1 group-hover:border-dlytful-ink-cool transition-colors">
              Let me see it
            </span>
            <span class="mt-2 text-[10px] text-dlytful-ink-distant/80 tracking-wide">
              Start the translation
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Drift (not a hard reset) -->
    <div class="h-32 md:h-44 bg-gradient-to-b from-dlytful-cool via-dlytful-cool-muted/30 to-dlytful-linen"></div>

    <!-- ═══════════════════════════════════════════════════════════
         II. RECOGNITION — tension stabilizes
         ═══════════════════════════════════════════════════════════ -->
    <section class="px-6 pt-24 pb-32 md:pb-44 bg-dlytful-linen">
      <div class="max-w-md mx-auto">
        <p class="text-[11px] text-dlytful-ink-muted uppercase tracking-[0.2em] mb-20">
          The familiar feeling
        </p>
        
        <p class="text-dlytful-ink leading-[2.2]">
          The thing you built works. People use it. 
          But when you look at it, you feel the distance 
          between what you meant and what they see.
        </p>
        
        <p class="text-dlytful-ink leading-[2.2] mt-12">
          It's not broken. It just doesn't feel like you made it.
        </p>

        <p class="font-serif italic text-dlytful-ink mt-28 leading-relaxed text-lg">
          That happens to everyone who ships before they're ready. 
          Which is everyone who ships.
        </p>
      </div>
    </section>

    <!-- The exhale -->
    <section class="relative">
      <div class="absolute inset-0 bg-gradient-to-b from-dlytful-linen via-[#F8F6F1] to-dlytful-warmth/40"></div>
      
      <div class="relative h-[70vh] min-h-[450px] flex items-center">
        <p class="text-dlytful-ink-muted/15 text-[11px] tracking-wide" style="margin-left: 11%; margin-top: 18%;">
          (you're allowed to take your time)
        </p>
      </div>
    </section>

    <!-- The shift -->
    <div class="h-28 md:h-36 bg-gradient-to-b from-dlytful-warmth/40 via-[#F9F6F0] to-[#F8F5EE]"></div>

    <!-- The mechanism -->
    <section class="pt-28 px-6 bg-[#F8F5EE]">
      <div class="max-w-sm mx-auto reveal">
        <p class="text-dlytful-ink text-base leading-relaxed">
          We extract what you meant to build. Bolt gets a prompt. Now it feels like yours.
        </p>
      </div>
    </section>

    <!-- The aside -->
    <section class="pt-16 pb-28 md:pb-36 px-6 bg-[#F8F5EE]">
      <div class="max-w-sm mx-auto reveal">
        <p class="text-sm text-dlytful-ink-muted leading-loose">
          name what matters.
          <span class="block mt-3 text-dlytful-ink-light/70">trace what you meant.</span>
          <span class="block mt-3 text-dlytful-ink-light/60">translate it.</span>
          <span class="block mt-3 text-dlytful-ink-light/50">see it take form.</span>
        </p>
      </div>
    </section>

    <!-- Same breath continues -->
    <section class="pt-8 pb-32 md:pt-12 md:pb-40 px-6 bg-gradient-to-b from-[#F8F5EE] to-dlytful-cream">
      <div class="max-w-lg reveal" style="margin-left: 10%;">
        <p class="text-dlytful-ink-light leading-relaxed">
          Most AI-built apps look the same because most people 
          skip the hard part: deciding what they want to say.
        </p>
        <p class="text-dlytful-ink-light mt-12">
          If you haven't figured that out yet, no prompt will help. 
          <span class="block mt-2">Come back when you have.</span>
        </p>
      </div>
    </section>

    <section class="py-36 md:py-44 px-6 bg-dlytful-cream">
      <div class="max-w-md mx-auto reveal">
        <p class="text-dlytful-ink leading-[2]">
          Some people will never notice the difference.
        </p>
        <p class="text-dlytful-ink leading-[2] mt-1">
          They'll use it. They'll move on.
        </p>
        
        <p class="text-dlytful-ink font-medium mt-12 leading-[2]">
          But you will.
        </p>
        
        <p class="text-dlytful-ink leading-[2] mt-12">
          You'll see where the edges feel wrong.
        </p>
        <p class="text-dlytful-ink leading-[2] mt-1">
          You'll know when something almost says what you meant.
        </p>
        
        <p class="text-dlytful-ink leading-[2] mt-12">
          That's not obsession.
        </p>
        <p class="text-dlytful-ink leading-[2] mt-1">
          That's care.
        </p>
        
        <!-- The residue -->
        <p class="font-serif text-dlytful-ink mt-16 text-lg">
          And care leaves a trace.
        </p>
      </div>
    </section>

    <!-- Linger -->
    <div class="h-24 md:h-32 bg-dlytful-cream"></div>

    <section id="join" class="py-20 md:py-28 px-6 bg-dlytful-cream-dark">
      <div class="max-w-sm mx-auto reveal text-center">
        <p class="text-[10px] text-dlytful-ink-muted/50 uppercase tracking-widest mb-4">
          Early access
        </p>
        <EmailForm variant="footer" />
      </div>
    </section>

  </div>
</template>

<style scoped>
/* The statement: grounded, factual, calm before impact */
.hero-text {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  line-height: 1.0;
  letter-spacing: -0.01em;
}

.hero-subtext {
  font-size: clamp(1rem, 2vw, 1.25rem);
}

/* THE PUNCH — the only accent color on the page */
.motif-line {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: clamp(2.75rem, 9vw, 5rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #5A9BC9; /* dlytful-sky — confidence entering late */
}



.reveal {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 1.2s ease, transform 1.2s ease;
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>
