<template>
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]" aria-hidden="true">
    <!-- --- LAYER 1: STARS (Space - Top) --- -->
    <div 
        class="absolute inset-0 w-full h-full"
        :style="{ 
            opacity: Math.max(0, 1 - scrollY / 600),
            transform: `translateY(${scrollY * 0.05}px)` 
        }"
    >
        <img src="~/assets/env/stars.svg" class="w-full h-full object-cover opacity-60" alt="" >
    </div>

    <!-- --- LAYER 2: CLOUDS (Sky - Upper Mid) --- -->
    <div 
        class="absolute top-[5vh] left-0 w-full h-[60vh] transition-opacity duration-300"
        :style="{ 
            opacity: Math.min(1, Math.max(0, (scrollY - 100) / 400)) - Math.max(0, (scrollY - 900) / 400),
            transform: `translateY(${scrollY * 0.15}px)`
        }"
    >
       <img src="~/assets/env/clouds.svg" class="w-full h-full object-cover object-top opacity-40" alt="" >
    </div>

    <!-- --- LAYER 3: HORIZON (Distance - Mid) --- -->
    <div
        class="absolute top-[30vh] left-0 w-full h-[50vh] transition-opacity duration-300"
        :style="{ 
             opacity: Math.min(1, Math.max(0, (scrollY - 500) / 400)),
             transform: `translateY(${-scrollY * 0.02}px)` 
        }"
    >
         <img src="~/assets/env/horizon.svg" class="w-full h-full object-cover object-top opacity-60" alt="" >
    </div>

    <!-- --- LAYER 4: GROUND (Earth - Bottom) --- -->
    <div 
        class="absolute bottom-[-10vh] left-0 w-full h-[50vh] transition-transform duration-75 ease-out"
         :style="{ 
             opacity: Math.min(1, Math.max(0, (scrollY - 800) / 300)),
             transform: `translateY(${ Math.max(0, 150 - (scrollY - 800) * 0.2) }px)` 
         }"
    >
        <img src="~/assets/env/ground.svg" class="w-full h-full object-cover object-bottom opacity-90" alt="" >
    </div>

    <!-- ECLIPSE INDICATOR (Global) -->
    <div class="absolute top-6 left-6 z-50 transition-opacity duration-1000 opacity-100">
        <EclipseEclipse :progress="store.progressPercent / 100" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useDiscoveryStore } from '~/stores/discovery';
import EclipseEclipse from '~/components/visuals/EclipseEclipse.vue';

const store = useDiscoveryStore();
const scrollY = ref(0);

const handleScroll = () => {
    scrollY.value = window.scrollY;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>
