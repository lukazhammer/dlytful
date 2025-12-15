<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-background text-text p-6">
    <div class="max-w-2xl w-full space-y-8 text-center">
      
      <!-- Brand Badge -->
      <div class="flex items-center justify-center">
         <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/50 border border-white/5 backdrop-blur-sm">
            <span class="w-2 h-2 rounded-full bg-accent animate-pulse"/>
            <span class="text-xs uppercase tracking-widest text-textMuted font-bold">Dlytful Zero</span>
        </div>
      </div>

      <!-- Headline -->
      <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
        Turn messy notes into a <br>
        <span class="text-accent">brand manifesto.</span>
      </h1>

      <!-- Subtitle -->
      <p class="text-xl text-textMuted font-light max-w-lg mx-auto leading-relaxed">
        Stop chatting with standard AI. Feed your raw ideas into Dlytful’s deterministic compiler and get a production-ready brand spec in seconds.
      </p>

      <!-- CTA -->
      <div class="pt-8">
        <NuxtLink 
          to="/demo"
          class="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-accent text-black hover:bg-white transition-all text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(204,255,0,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
        >
            <span>Launch Demo</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="stroke-black stroke-2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </NuxtLink>
      </div>

      <!-- Social Proof / Footer -->
      <div class="pt-12 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div class="h-8 w-24 bg-white/10 rounded"></div>
          <div class="h-8 w-24 bg-white/10 rounded"></div>
          <div class="h-8 w-24 bg-white/10 rounded"></div>
      </div>

    </div>
  </div>
</template>
