<template>
  <div class="absolute inset-0 w-full h-full overflow-hidden">
    <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#7FA6D6" /> <!-- SkyDay -->
                <stop offset="60%" stop-color="#4D6C93" /> <!-- SkyMid -->
                <stop offset="100%" stop-color="#223A66" /> <!-- SkyDeep -->
            </linearGradient>
        </defs>
        
        <!-- Sky Wash -->
        <rect width="100%" height="100%" fill="url(#skyGrad)" />
        
        <!-- Minimalist Stars (Visible bottom blending to deep) -->
        <g fill="#E9ECF3" fill-opacity="0.2">
            <circle cx="20%" cy="15%" r="1" />
            <circle cx="80%" cy="10%" r="0.8" />
            <circle cx="90%" cy="25%" r="1.5" />
            <circle cx="50%" cy="5%" r="0.8" />
            <circle cx="10%" cy="30%" r="1" />
        </g>
        
        <!-- Subtle Wind Lines (Thin strokes, very low opacity) -->
        <g stroke="#E9ECF3" stroke-opacity="0.1" stroke-width="0.5" stroke-linecap="round">
            <path d="M100 200 L250 200" />
            <path d="M1200 150 L1400 150" />
            <path d="M600 100 L800 100" />
            <path d="M300 300 L450 300" />
        </g>

        <!-- Birds (Small V shapes, reduced scale) -->
        <g stroke="#0B0F1A" stroke-width="1" fill="none" opacity="0.3">
            <!-- Cluster 1 -->
            <path d="M900 300 L906 303 L912 300" />
            <path d="M915 308 L921 311 L927 308" />
            <path d="M890 310 L896 313 L902 310" />
        </g>
    </svg>
  </div>
</template>
