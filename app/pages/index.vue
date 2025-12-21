<template>
  <div class="min-h-screen bg-background text-text font-sans selection:bg-accent selection:text-black">
    
    <!-- 1. HERO -->
    <header class="relative min-h-[90vh] flex flex-col items-center justify-center p-6 text-center border-b border-white/5">
       <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(192,138,43,0.08)_0%,transparent_70%)] pointer-events-none"></div>
       
       <div class="max-w-3xl w-full space-y-8 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/50 border border-white/5 backdrop-blur-sm mx-auto">
            <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"/>
            <span class="text-[10px] uppercase tracking-widest text-textMuted font-bold">dlytful</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
            Your product works. <br>
            <span class="text-accent">Nobody remembers it.</span>
          </h1>

          <p class="text-xl text-textMuted font-light max-w-xl mx-auto leading-relaxed">
            AI builders ship features fast. They also ship defaults. Without a brand, your app sounds and looks like the last ten MVPs.
          </p>

          <p class="text-sm text-textMuted/60 font-mono">
            Prompts and rules you paste into Lovable, Bolt, v0, or Cursor.
          </p>

          <div class="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink to="/demo" class="px-8 py-4 rounded-xl bg-accent text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-all shadow-[0_0_30px_rgba(192,138,43,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
              Launch Demo
            </NuxtLink>
             <button @click="scrollTo('#problem')" class="px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-text font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
              See how it works
            </button>
          </div>
          
          <p class="text-xs text-textMuted/40">
             No marketing background required.
          </p>
       </div>
    </header>

    <!-- 2. THE PROBLEM -->
    <section id="problem" class="py-24 px-6 border-b border-white/5">
      <div class="max-w-2xl mx-auto space-y-12">
        <div class="space-y-4">
          <h2 class="text-3xl font-bold tracking-tight">The problem isn't your idea. <br>It's the output.</h2>
          <div class="h-1 w-20 bg-accent rounded-full"></div>
        </div>

        <div class="prose prose-invert prose-lg text-textMuted leading-relaxed">
          <p>
            Good products get ignored every day.
          </p>
          <p>
            In a crowded market, "good" is table stakes. Generic is the default.
          </p>
          <p>
            Builders call it AI slop (and so does your audience).
          </p>
          <p>
            Same layouts. Same copy. Same tone. Different idea. Same result.
          </p>
          
          <div class="not-prose grid sm:grid-cols-2 gap-8 py-8">
              <ul class="space-y-3 text-sm text-textMuted">
                 <li class="flex gap-2 text-red-400 font-bold uppercase text-xs tracking-widest">Symptoms</li>
                 <li class="flex gap-2">• Generic language and placeholder copy</li>
                 <li class="flex gap-2">• Template UI decisions</li>
                 <li class="flex gap-2">• Tone drift across screens</li>
              </ul>
               <ul class="space-y-3 text-sm text-textMuted">
                 <li class="flex gap-2 text-red-400 font-bold uppercase text-xs tracking-widest">Cost</li>
                 <li class="flex gap-2">• More rewrites and dead end iterations</li>
                 <li class="flex gap-2">• More time explaining what the product is</li>
                 <li class="flex gap-2">• Lower trust at first glance</li>
                 <li class="flex gap-2">• Harder to build recognition over time</li>
              </ul>
          </div>

          <p class="text-text font-bold text-center pt-4 border-t border-white/5">
            dlytful gives you a brand system your AI builder can actually follow.
          </p>
        </div>
      </div>
    </section>

    <!-- 3. WHAT IT IS -->
    <section class="py-24 px-6 bg-surface/30 border-b border-white/5">
      <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
        <div class="space-y-6">
          <div class="text-accent text-xs uppercase tracking-widest font-bold">Definition</div>
          <h2 class="text-3xl font-bold">What dlytful is</h2>
          <ul class="space-y-4 text-textMuted">
            <li class="flex gap-3">
              <span class="text-accent">→</span> A brand system your builder can follow (implemented as a recognition layer)
            </li>
            <li class="flex gap-3">
              <span class="text-accent">→</span> A deterministic compiler for product intent
            </li>
            <li class="flex gap-3">
              <span class="text-accent">→</span> A stable source of truth for language and UI decisions
            </li>
          </ul>
        </div>
        <div class="space-y-6 text-textMuted leading-relaxed">
          <p>
            You input what you are building, who it is for, and why it exists. dlytful compiles this into a structured context block. Downstream AI tools follow it.
          </p>
          <p>
            Same input produces the same output. No drift. No reinterpretation.
          </p>
          <p class="font-bold text-text">
            You see the effect immediately in your AI builder.
          </p>
        </div>
      </div>
    </section>

    <!-- 4. WHAT IT IS NOT -->
    <section class="py-24 px-6 border-b border-white/5">
      <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
        <div class="space-y-6">
          <div class="text-red-400 text-xs uppercase tracking-widest font-bold">Negative Space</div>
          <h2 class="text-3xl font-bold">What dlytful is not</h2>
          <ul class="space-y-4 text-textMuted">
            <li class="flex gap-3">
              <span class="text-red-400">×</span> Not a branding agency
            </li>
            <li class="flex gap-3">
              <span class="text-red-400">×</span> Not a copy generator
            </li>
            <li class="flex gap-3">
              <span class="text-red-400">×</span> Not a prompt library
            </li>
             <li class="flex gap-3">
              <span class="text-red-400">×</span> Not a creative AI
            </li>
             <li class="flex gap-3">
              <span class="text-red-400">×</span> Not a one off exercise
            </li>
          </ul>
        </div>
        <div class="space-y-6 text-textMuted leading-relaxed">
           <p>
            dlytful reduces guesswork. Creativity happens later, inside constraints.
          </p>
        </div>
      </div>
    </section>

    <!-- 5. HOW IT WORKS -->
    <section class="py-24 px-6 border-b border-white/5 bg-surface/30">
      <div class="max-w-4xl mx-auto space-y-16">
         <h2 class="text-3xl font-bold text-center">How it works</h2>
         
         <div class="grid md:grid-cols-3 gap-8">
            <div class="p-6 rounded-2xl bg-surface border border-white/5 space-y-4">
              <div class="text-4xl font-black text-white/10">01</div>
              <p class="font-bold text-text">Define</p>
              <p class="text-sm text-textMuted">You describe the product and the problem in plain language.</p>
            </div>
             <div class="p-6 rounded-2xl bg-surface border border-white/5 space-y-4">
              <div class="text-4xl font-black text-white/10">02</div>
              <p class="font-bold text-text">Shape</p>
              <p class="text-sm text-textMuted">dlytful turns your intent into a brand system your builder can follow.</p>
            </div>
             <div class="p-6 rounded-2xl bg-surface border border-white/5 space-y-4">
              <div class="text-4xl font-black text-white/10">03</div>
              <p class="font-bold text-text">Reuse</p>
              <p class="text-sm text-textMuted">You paste that context into Lovable, Bolt, v0, or Cursor.</p>
            </div>
         </div>

         <div class="text-center">
            <span class="inline-block px-4 py-2 rounded bg-accent/10 text-accent text-xs font-mono">
              Your brand stays stable as you iterate.
            </span>
         </div>
      </div>
    </section>

    <!-- 6. WHY IT MATTERS -->
    <section class="py-24 px-6 border-b border-white/5">
       <div class="max-w-2xl mx-auto space-y-8 text-center">
           <h2 class="text-3xl font-bold">Why this matters if you build with AI</h2>
          <div class="grid sm:grid-cols-2 gap-4 text-left">
             <div class="p-4 border-l-2 border-accent bg-surface/20 text-sm text-textMuted">Fewer rewrites and manual fixes.</div>
             <div class="p-4 border-l-2 border-accent bg-surface/20 text-sm text-textMuted">Less explaining the same thing repeatedly.</div>
             <div class="p-4 border-l-2 border-accent bg-surface/20 text-sm text-textMuted">Consistent language across screens.</div>
             <div class="p-4 border-l-2 border-accent bg-surface/20 text-sm text-textMuted">UI decisions that feel intentional.</div>
          </div>
          <p class="text-lg text-text font-medium">
             dlytful does not make AI smarter. It makes your product recognizable.
          </p>
       </div>
    </section>

    <!-- 7. DEMO PREVIEW -->
    <section class="py-24 px-6 bg-black border-b border-white/5">
       <div class="max-w-4xl mx-auto text-center space-y-8">
          <h2 class="text-3xl font-bold">See the brand system</h2>
          <p class="text-textMuted">
             The demo shows what gets compiled. Structure, constraints, and a context block you can paste into your builder.
          </p>
          <div class="text-accent text-lg font-bold">
            This is the first time your product feels like it has a point of view.
          </div>
          <div class="pt-4">
             <NuxtLink to="/demo" class="inline-flex items-center gap-2 text-accent hover:brightness-110 font-bold uppercase tracking-widest text-sm">
                Open the demo <span>→</span>
             </NuxtLink>
          </div>
       </div>
    </section>

    <!-- 8. PRICING -->
    <section class="py-24 px-6 border-b border-white/5">
      <div class="max-w-5xl mx-auto space-y-12">
        <h2 class="text-3xl font-bold text-center">Pricing</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
           <!-- FREE -->
           <div class="p-8 rounded-3xl bg-surface/30 border border-white/5 space-y-6">
              <div class="space-y-2">
                 <div class="text-xl font-bold">Free</div>
                 <div class="text-3xl font-mono">€0</div>
              </div>
              <ul class="space-y-3 text-sm text-textMuted">
                 <li>• Compile recognition layers</li>
                 <li>• Use the demo freely</li>
                 <li>• Copy context blocks manually</li>
              </ul>
           </div>

           <!-- PRO -->
           <div class="relative p-8 rounded-3xl bg-surface border border-accent/30 space-y-6 shadow-[0_0_30px_rgba(192,138,43,0.05)]">
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-black text-[10px] uppercase font-bold tracking-widest rounded-full">
                Early Access
              </div>
              <div class="space-y-2">
                 <div class="text-xl font-bold text-accent">Pro</div>
                 <div class="text-3xl font-mono">€15<span class="text-sm text-textMuted">/mo</span></div>
              </div>
              <ul class="space-y-3 text-sm text-textMuted">
                 <li>• Save recognition layers</li>
                 <li>• Version history</li>
                 <li>• Export formats for tools</li>
              </ul>
           </div>

           <!-- STUDIO -->
           <div class="p-8 rounded-3xl bg-surface/30 border border-white/5 space-y-6 opacity-50 grayscale">
              <div class="space-y-2">
                 <div class="text-xl font-bold">Studio</div>
                 <div class="text-sm font-mono text-textMuted">Coming later</div>
              </div>
              <ul class="space-y-3 text-sm text-textMuted">
                 <li>• Multiple products</li>
                 <li>• Shared team constraints</li>
                 <li>• API Access</li>
              </ul>
           </div>
        </div>

        <p class="text-center text-xs text-textMuted">
           No usage-based pricing. No token math. You pay for stability.
        </p>
      </div>
    </section>

    <!-- 9. AUDIENCE -->
    <section class="py-24 px-6 bg-surface/30 border-b border-white/5">
       <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
          <div class="space-y-6">
             <h3 class="text-lg font-bold">Who this is for</h3>
             <ul class="space-y-3 text-sm text-textMuted">
                <li class="flex gap-2"><span class="text-green-400">✓</span> Indie developers shipping AI-built products</li>
                <li class="flex gap-2"><span class="text-green-400">✓</span> Builders who care about consistency</li>
                <li class="flex gap-2"><span class="text-green-400">✓</span> People tired of "same-looking" apps</li>
             </ul>
          </div>
          <div class="space-y-6">
             <h3 class="text-lg font-bold">Who this is NOT for</h3>
             <ul class="space-y-3 text-sm text-textMuted">
                <li class="flex gap-2"><span class="text-red-400">×</span> Agencies selling branding services</li>
                <li class="flex gap-2"><span class="text-red-400">×</span> People looking for creative copy</li>
                <li class="flex gap-2"><span class="text-red-400">×</span> Teams who want AI to invent identity</li>
             </ul>
          </div>
       </div>
    </section>

    <!-- 10. FINAL CTA -->
    <footer class="py-32 px-6 text-center space-y-8">
       <h2 class="text-4xl md:text-5xl font-black tracking-tight">
          Build faster without <br>losing identity.
       </h2>
       <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <NuxtLink to="/demo" class="px-8 py-4 rounded-xl bg-accent text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-all shadow-[0_0_30px_rgba(192,138,43,0.2)]">
              Launch Demo
          </NuxtLink>
           <button class="text-sm text-textMuted hover:text-white underline underline-offset-4 decoration-white/20">
              Read the PRD
           </button>
       </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
const scrollTo = (selector: string) => {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
</script>
