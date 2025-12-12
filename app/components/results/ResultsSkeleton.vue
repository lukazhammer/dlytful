<script setup lang="ts">
import LoadingSkeleton from '~/components/ui/LoadingSkeleton.vue'

interface Props {
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 4
})
</script>

<template>
  <div class="space-y-6">
    <!-- Copy button skeleton -->
    <LoadingSkeleton variant="button" height="56px" width="100%" />
    
    <!-- Output blocks skeleton -->
    <div 
      v-for="i in count" 
      :key="i"
      class="space-y-3"
      :style="{ animationDelay: `${i * 100}ms` }"
    >
      <!-- Title -->
      <LoadingSkeleton variant="text" height="24px" width="40%" />
      
      <!-- Content -->
      <LoadingSkeleton variant="card" height="120px" />
    </div>
  </div>
</template>
