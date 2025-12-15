<template>
  <div class="absolute inset-0 w-full h-full overflow-hidden">
    <svg width="100%" height="100%" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <!-- Flat Clouds: Simple 2-3 puff silhouettes -->
      <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="0" dy="4" result="offsetblur"/>
            <feFlood flood-color="#223A66" flood-opacity="0.2"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
      </defs>

      <g fill="#E9ECF3" filter="url(#shadow)" opacity="0.9">
        <!-- Cloud 1 Left -->
        <path d="M100 240 Q120 200 160 220 Q200 200 240 240 Z" /> 
        
        <!-- Cloud 2 Right -->
        <path d="M1000 200 Q1050 150 1100 200 Q1150 180 1200 200 L1200 210 L1000 210 Z" transform="translate(0, 20)"/>

        <!-- Cloud 3 Center Low -->
        <path d="M500 350 Q550 300 600 330 Q650 310 700 350 Z" />
      </g>
    </svg>
  </div>
</template>
