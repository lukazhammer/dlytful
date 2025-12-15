<template>
  <div class="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-black">
    <!-- Hero Section -->
    <main class="flex-grow flex flex-col items-center justify-center relative px-6 overflow-hidden pt-20 pb-16">
      
      <div class="z-10 text-center space-y-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/50 border border-white/5 backdrop-blur-sm mb-4">
          <span class="w-2 h-2 rounded-full bg-accent animate-pulse"/>
          <span class="text-xs uppercase tracking-widest text-textMuted">DLYTFUL ZERO</span>
        </div>

        <h1 class="text-6xl md:text-8xl font-black text-text tracking-tighter leading-[0.9]">
          Your app works.<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/50">Your brand doesn't.</span>
        </h1>
        
        <div class="space-y-6 max-w-lg mx-auto">
            <p class="text-lg md:text-xl text-textMuted font-light leading-relaxed">
              AI-built apps have flooded the market. A clean UI gets you judged, not remembered. If people cannot describe your product in one sentence, they will not share it, search for it, or come back.
            </p>

            <!-- Supporting Bullets -->
            <ul class="text-left text-sm text-text space-y-2 inline-block mx-auto border-l-2 border-accent/20 pl-4 py-1">
                <li class="flex items-center gap-2"><span class="text-accent">•</span> Positioning that makes sense fast</li>
                <li class="flex items-center gap-2"><span class="text-accent">•</span> Voice rules you can actually follow</li>
                <li class="flex items-center gap-2"><span class="text-accent">•</span> Design direction with a spine</li>
                <li class="flex items-center gap-2"><span class="text-accent">•</span> A paste-ready Brand Prompt for your builder</li>
            </ul>
        </div>

        <!-- CTA Form -->
        <div class="pt-4 w-full max-w-sm mx-auto">
          <form class="flex flex-col gap-4" @submit.prevent="joinWaitlist">
            <div class="relative group">
              <input 
                v-model="email"
                type="email" 
                placeholder="Enter your email" 
                class="w-full bg-surface/50 border border-white/10 rounded-lg py-4 px-5 text-center text-text placeholder:text-textMuted/50 focus:outline-none focus:border-accent focus:bg-surface transition-all backdrop-blur-sm"
                required
                :disabled="status === 'loading' || status === 'success'"
              >
              <div class="absolute inset-0 rounded-lg bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"/>
            </div>
            
            <button 
              type="submit"
              class="w-full bg-text text-background font-bold uppercase tracking-wider py-4 rounded-lg hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="status === 'loading' || status === 'success'"
            >
              <span v-if="status === 'loading'">Joining...</span>
              <span v-else-if="status === 'success'">You're on the list</span>
              <span v-else>Join waitlist</span>
            </button>
          </form>
           
           <div class="mt-3 text-xs text-textMuted opacity-60">
             One email when it is ready. No drip campaigns.
           </div>
           
           <!-- Proof / Secondary -->
                <div class="relative w-full max-w-lg lg:max-w-xl mx-auto lg:mx-0 mt-8">
                   <ExampleOutputLoop />
                </div>
                
           <div class="mt-8 text-xs text-textMuted">
             <NuxtLink to="/app" class="underline hover:text-accent transition-colors">Open the live demo</NuxtLink>
           </div>
        </div>
      </div>
 
       <!-- Below the Fold -->
       <section class="max-w-2xl mx-auto mt-32 text-center space-y-8 pb-32 opacity-80 z-10">
           <h2 class="text-3xl font-bold text-text">Nice is not a strategy.</h2>
           <div class="space-y-6 text-lg text-textMuted leading-relaxed font-light">
               <p>
                   Most founders stop at functionality. Then they wonder why traction feels random.
                   In a crowded market, fine is invisible.
               </p>
               <p>
                   Brand is the constant that holds everything together. What you promise. What you sound like. What people remember. When your brand is clear, your product feels real.
               </p>
           </div>
           <p class="text-sm font-mono text-accent pt-4 border-t border-white/5 inline-block">
               It is not a design problem. It is a recognition problem.
           </p>
       </section>
 
     </main>
 
     <!-- Footer -->
     <footer class="relative z-10 py-6 text-center text-[10px] text-textMuted uppercase tracking-widest opacity-50">
       &copy; {{ new Date().getFullYear() }} dlytful. All rights reserved.
     </footer>
   </div>
 </template>
 
 <script setup>
 import { ref } from 'vue';

 import ExampleOutputLoop from '~/components/ExampleOutputLoop.vue';
 
 definePageMeta({
  layout: 'default'
})

const email = ref('')
const status = ref('idle') // idle, loading, success, error

const joinWaitlist = async () => {
    status.value = 'loading';
    try {
        await $fetch('/api/waitlist', {
            method: 'POST',
            body: { email: email.value }
        });
        status.value = 'success';
        email.value = '';
    } catch {
        status.value = 'error';
        setTimeout(() => status.value = 'idle', 3000);
    }
}
</script>
