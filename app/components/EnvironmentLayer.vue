<template>
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0B0F1A]">
      <!-- 1. Sky Gradient (Desaturated Slate) -->
      <div 
        class="absolute inset-0 w-full h-[120vh] transition-transform duration-75 ease-out will-change-transform"
        :style="{ transform: `translateY(${scrollY * 0.1}px)` }"
      >
        <div class="w-full h-full bg-gradient-to-b from-[var(--skyTop)] via-[var(--skyMid)] to-[var(--skyDeep)]"/>
        
        <!-- Premium Noise Texture (Generated SVG Data URI) -->
        <div 
            class="absolute inset-0 opacity-[0.08]" 
            style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E'); mix-blend-mode: overlay;"
        />

        <!-- Scrim for Text Legibility (Radial darker center to top) -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(11,15,26,0.2)] to-[rgba(11,15,26,0.6)]"/>
      </div>

      <!-- Eclipse Motif (Smaller, Offset, Subtle) -->
      <!-- Ring: Accent, Disc: Ink -->
      <div 
        class="absolute top-12 left-1/2 -ml-[90px] w-[140px] h-[140px] transition-all duration-75 ease-out will-change-transform z-0"
        :style="{ 
            transform: `translate(0, ${scrollY * 0.3}px) scale(${Math.max(0.9, 1 - scrollY * 0.0005)})`,
            opacity: Math.max(0.2, 0.55 - scrollY * 0.001)
        }"
      >
         <!-- Glow Ring (Subtle) -->
         <div class="absolute inset-0 rounded-full border border-[var(--accent)] shadow-[0_0_30px_rgba(192,138,43,0.15)] bg-transparent opacity-100"/>
         <!-- Inner Disc -->
         <div class="absolute inset-[1px] rounded-full bg-[var(--ink)]"/>
      </div>

      <!-- 2. Parallax Cloud Layers (Minimalist, 5 Max) -->
      
      <!-- FAR Clouds (Blurry, Haze) -->
      <div 
        class="absolute inset-0 w-full h-[120vh] transition-transform duration-75 will-change-transform"
        :style="{ transform: `translateY(${scrollY * 0.05}px)` }"
      >
         <div class="absolute top-[12%] -left-[10%] opacity-20 blur-[1.5px]"><OrganicCloud :variant="1" width="300" :duration="60" /></div>
         <div class="absolute top-[8%] -right-[5%] opacity-20 blur-[1.5px]"><OrganicCloud :variant="3" width="250" :duration="70" :delay="5" /></div>
      </div>


      <!-- NEAR Clouds (Distinct but Peripheral) -->
      <div 
        class="absolute inset-0 w-full h-[120vh] transition-transform duration-75 will-change-transform"
        :style="{ transform: `translateY(${scrollY * 0.2}px)` }"
      >
         <div class="absolute top-[35%] -right-[10%] opacity-25"><OrganicCloud :variant="7" width="400" :duration="45" /></div>
         <div class="absolute top-[45%] -left-[5%] opacity-25"><OrganicCloud :variant="6" width="350" :duration="50" :delay="10" /></div>
         <div class="absolute top-[60%] right-[10%] opacity-15"><OrganicCloud :variant="8" width="200" :duration="55" /></div>
      </div>


      <!-- 3. Ground Layers (Fade in) -->
      
      <!-- Far Ground Silhouette -->
      <div 
         class="absolute bottom-0 w-full h-[500px] transition-transform duration-75 ease-out will-change-transform"
         :style="{ transform: `translateY(${-150 + scrollY * 0.1}px)` }"
      >
         <EnvHorizon />
      </div>

      <!-- Near Ground Silhouette -->
      <div 
         class="absolute bottom-[-50px] w-full h-[400px] transition-transform duration-75 ease-out will-change-transform"
         :style="{ transform: `translateY(${-100 + scrollY * 0.15}px)` }"
      >
         <EnvGround />
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import EnvHorizon from '~/components/env/EnvHorizon.vue';
import EnvGround from '~/components/env/EnvGround.vue';
import OrganicCloud from '~/components/env/OrganicCloud.vue';

const scrollY = ref(0);

const handleScroll = () => {
    requestAnimationFrame(() => {
        scrollY.value = window.scrollY;
    });
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>
