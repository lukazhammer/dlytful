<script setup lang="ts">
import LoadingSkeleton from '~/components/ui/LoadingSkeleton.vue'
</script>

<template>
  <div class="space-y-6">
    <!-- Question skeleton -->
    <div class="space-y-4">
      <LoadingSkeleton variant="text" height="32px" width="80%" />
      <LoadingSkeleton variant="text" height="20px" width="60%" />
    </div>
    
    <!-- Input skeleton -->
    <LoadingSkeleton variant="card" height="56px" />
    
    <!-- Button skeleton -->
    <div class="flex justify-end">
      <LoadingSkeleton variant="button" width="120px" height="48px" />
    </div>
  </div>
</template>
