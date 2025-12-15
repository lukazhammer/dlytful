<template>
  <div class="absolute inset-0 w-full h-full overflow-hidden">
     <svg width="100%" height="100%" viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <!-- Horizon Layer: Single curved ridge (Far Ground) -->
      <!-- Removed all horizontal stripes -->
      
      <g fill="var(--groundFar)" opacity="0.9">
         <!-- Main distant ridge silhouette -->
         <path d="M0 300 Q200 280 400 290 T800 280 T1200 290 T1440 280 L1440 500 L0 500 Z" />
         
         <!-- Optional: Subtle "mist" layer behind -->
         <path d="M0 290 Q300 270 600 285 T1440 270 L1440 320 L0 320 Z" fill="var(--skyMid)" opacity="0.3"/>
      </g>
    </svg>
  </div>
</template>
