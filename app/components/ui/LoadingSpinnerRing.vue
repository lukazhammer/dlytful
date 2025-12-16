<template>
  <div class="relative w-12 h-12 flex items-center justify-center">
    <!-- Outer Ring (Accent) -->
    <div class="absolute inset-0 border-4 border-[var(--accent)]/30 rounded-full"></div>
    <!-- Inner Ring (Spinning) -->
    <div class="absolute inset-0 border-4 border-transparent border-t-[var(--ink)] border-l-[var(--ink)] rounded-full animate-spin"></div>
  </div>
</template>

<style scoped>
.animate-spin {
    animation: spin 1.1s linear infinite;
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
