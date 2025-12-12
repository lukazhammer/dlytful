<script setup lang="ts">
interface Props {
  current: number
  total: number
  parts?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  parts: () => ['Your Product', 'Your Audience', 'Your Edge', 'Your Vibe', 'Confirm']
})

const visibleParts = computed(() => {
  return props.parts.slice(0, props.total)
})
</script>

<template>
  <div class="w-full">
    <!-- Progress Bar -->
    <div class="flex gap-1.5 mb-3">
      <div
        v-for="(part, index) in visibleParts"
        :key="index"
        class="h-1.5 rounded-full flex-1 transition-all duration-300"
        :class="{
          'bg-dlytful-herb': index + 1 < current,
          'bg-dlytful-sun': index + 1 === current,
          'bg-gray-200': index + 1 > current
        }"
      />
    </div>
    
    <!-- Part Labels (hidden on mobile) -->
    <div class="hidden md:flex justify-between">
      <span
        v-for="(part, index) in visibleParts"
        :key="index"
        class="text-xs font-sans transition-colors duration-300"
        :class="{
          'text-dlytful-herb font-medium': index + 1 < current,
          'text-dlytful-sun font-semibold': index + 1 === current,
          'text-gray-400': index + 1 > current
        }"
      >
        {{ part }}
      </span>
    </div>
    
    <!-- Mobile: Dots Only -->
    <div class="flex md:hidden justify-center gap-2 mt-2">
      <div
        v-for="(_, index) in visibleParts"
        :key="index"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="{
          'bg-dlytful-herb': index + 1 < current,
          'bg-dlytful-sun scale-125': index + 1 === current,
          'bg-gray-300': index + 1 > current
        }"
      />
    </div>
  </div>
</template>
