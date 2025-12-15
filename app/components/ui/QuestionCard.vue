<template>
  <div 
    class="transition-all duration-500"
    :class="[
      isLocked ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100',
      isCollapsed ? 'mb-4 border-b border-surfaceHighlight pb-4' : 'mb-12'
    ]"
  >
    <!-- Header / Summary Row -->
    <div class="flex items-start justify-between group">
        <div 
          class="flex items-center gap-3 mb-3 cursor-pointer"
          @click="toggleCollapse"
        >
           <span class="text-xs font-mono" :class="isCompleted ? 'text-accent' : 'text-textMuted'">0{{ step }}</span>
           
           <div class="flex flex-col">
               <h3 class="text-lg font-medium text-text transition-colors" :class="isCollapsed && !isLocked ? 'group-hover:text-accent' : ''">{{ question }}</h3>
               <!-- Summary Answer -->
               <div v-if="isCollapsed && answer" class="text-sm text-textMuted font-light mt-1 line-clamp-1">
                   {{ formatAnswer(answer) }}
               </div>
           </div>
        </div>

        <!-- Edit Action -->
        <button 
            v-if="isCollapsed && !isLocked" 
            class="text-[10px] uppercase tracking-widest text-textMuted hover:text-accent opacity-0 group-hover:opacity-100 transition-all font-mono"
            @click="isCollapsed = false"
        >
            Edit
        </button>
    </div>
    
    <!-- Collapsed State (Hidden Content) -->
    <div v-show="!isCollapsed" class="animate-in fade-in slide-in-from-top-2 duration-300">
        <p v-if="description" class="text-sm text-textMuted mb-4">{{ description }}</p>

        <div class="relative">
          <slot />
          
          <!-- Validation Flag (Optional) -->
          <div v-if="warning" class="absolute -bottom-6 left-0 text-xs text-orange-400 flex items-center gap-1">
            <span class="i-lucide-alert-triangle w-3 h-3"/>
            {{ warning }}
          </div>

          <!-- Next Indication -->
          <div v-if="showNext" class="mt-4 flex justify-end">
              <button 
                 class="text-xs font-mono text-textMuted hover:text-accent flex items-center gap-2 transition-colors group"
                 @click="$emit('next')"
              >
                 Press Enter <span class="i-lucide-corner-down-left w-3 h-3 group-hover:translate-x-1 transition-transform"/>
              </button>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  step: { type: Number, default: 0 },
  question: { type: String, default: '' },
  description: { type: String, default: '' },
  warning: { type: String, default: '' },
  showNext: { type: Boolean, default: false },
  locked: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  answer: { type: [String, Array], default: '' }
})

defineEmits(['next'])

const isLocked = computed(() => props.locked);
const isCompleted = computed(() => props.completed);
const isCollapsed = ref(false);

// Auto-collapse when completed changes to true (and we move away)
watch(() => props.completed, (newVal) => {
    if (newVal) {
        // slight delay to allow user to see "Saved" or feel completion
        // But strict auto-collapse might be annoying if they are still typing.
        // We only collapse if lost focus? Logic usually handled by parent focus shift.
        // Let's default to collapse only if explicitly instructed or on load
    }
});

// Initialize collapsed state based on completion (restoring session)
onMounted(() => {
    if (props.completed) {
        isCollapsed.value = true;
    }
});

// Exposed helper
const toggleCollapse = () => {
    if (!props.locked) isCollapsed.value = !isCollapsed.value;
}

const formatAnswer = (val) => {
    if (Array.isArray(val)) return val.join(', ');
    return val;
}
</script>
