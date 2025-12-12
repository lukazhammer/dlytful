<script setup lang="ts">
import LoadingSkeleton from '~/components/ui/LoadingSkeleton.vue'

interface Props {
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 3
})
</script>

<template>
  <div class="space-y-3">
    <div 
      v-for="i in count" 
      :key="i"
      class="bg-white rounded-xl border border-gray-100 p-4"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 space-y-3">
          <!-- Title -->
          <LoadingSkeleton variant="text" height="20px" width="60%" />
          
          <!-- Meta row -->
          <div class="flex items-center gap-3">
            <LoadingSkeleton variant="text" height="16px" width="60px" />
            <LoadingSkeleton variant="button" height="20px" width="70px" />
          </div>
          
          <!-- Archetype chips -->
          <div class="flex items-center gap-2">
            <LoadingSkeleton variant="button" height="24px" width="80px" />
            <LoadingSkeleton variant="button" height="24px" width="70px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
