<template>
  <ClientOnly>
    <SplitPane>
      <template #input>
        <StepProgress :current="store.progressPercent / 10" :total="10" />
        
        <div class="max-w-xl mx-auto pb-64 space-y-12">
          <h1 class="text-2xl font-bold mb-8 text-brand sr-only">Discovery</h1>
          
          <!-- Q1: Core What -->
          <QuestionCard 
            id="q-1"
            :step="1" 
            question="What is it?" 
            description="Describe your product or service in plain language. No marketing fluff yet."
            :show-next="!!store.inputs.q1_core_what"
            :completed="!!store.inputs.q1_core_what"
            :answer="store.inputs.q1_core_what"
            @next="handleNext('q-2')"
          >
            <textarea 
              ref="q1Ref"
              v-model="store.inputs.q1_core_what"
              rows="1"
              class="w-full bg-surface border-b border-surfaceHighlight p-0 py-3 text-lg text-text focus:border-accent focus:outline-none transition-colors resize-none overflow-hidden placeholder:text-textMuted/50"
              placeholder="e.g. An automated plant watering system..."
              @input="update('q1_core_what', $event.target.value)"
              @keydown.enter.prevent="handleNext('q-2')"
            />
          </QuestionCard>

          <!-- Q2: Audience -->
          <QuestionCard 
            id="q-2"
            :step="2" 
            question="Who is it for?" 
            description="Be specific. 'Everyone' is not an audience."
            :show-next="!!store.inputs.q2_audience_who"
            :locked="!store.inputs.q1_core_what"
            :completed="!!store.inputs.q2_audience_who"
            :answer="store.inputs.q2_audience_who"
            @next="handleNext('q-3')"
          >
             <textarea 
              ref="q2Ref"
              v-model="store.inputs.q2_audience_who"
              rows="1"
              class="w-full bg-surface border-b border-surfaceHighlight p-0 py-3 text-lg text-text focus:border-accent focus:outline-none transition-colors resize-none overflow-hidden placeholder:text-textMuted/50"
              placeholder="e.g. Urban millennials who travel frequently."
              @input="update('q2_audience_who', $event.target.value)"
              @keydown.enter.prevent="handleNext('q-3')"
            />
          </QuestionCard>

          <!-- Q3: Vibes -->
          <QuestionCard 
            id="q-3"
            :step="3" 
            question="What's the vibe?" 
            description="Pick up to 5 adjectives that describe the feeling."
            :show-next="store.inputs.q3_vibe_adjectives.length > 0"
            :locked="!store.inputs.q2_audience_who"
            :completed="store.inputs.q3_vibe_adjectives.length > 0"
            :answer="store.inputs.q3_vibe_adjectives"
            @next="handleNext('q-4')"
          >
             <VibeSelector />
          </QuestionCard>

          <!-- Q4: Archetype -->
          <QuestionCard 
            id="q-4"
            :step="4" 
            question="Which character leads?" 
            description="Select the primary archetype that represents your brand's soul."
            :show-next="!!store.inputs.q4_archetype_primary"
            :locked="store.inputs.q3_vibe_adjectives.length === 0"
            :completed="!!store.inputs.q4_archetype_primary"
            :answer="store.inputs.q4_archetype_primary"
            @next="handleNext('q-6')"
          >
            <ArchetypeWheel />
          </QuestionCard>

           <!-- Q6: Mission -->
           <QuestionCard 
            id="q-6"
            :step="5" 
            question="Why does it exist?" 
            description="The deeper purpose beyond making money."
            :show-next="!!store.inputs.q6_mission_why"
            :locked="!store.inputs.q4_archetype_primary"
            :completed="!!store.inputs.q6_mission_why"
            :answer="store.inputs.q6_mission_why"
            @next="handleNext('q-7')"
          >
             <textarea 
              ref="q6Ref"
              v-model="store.inputs.q6_mission_why"
              rows="1"
              class="w-full bg-surface border-b border-surfaceHighlight p-0 py-3 text-lg text-text focus:border-accent focus:outline-none transition-colors resize-none overflow-hidden placeholder:text-textMuted/50"
              placeholder="e.g. To ensure no plant dies of neglect."
              @input="update('q6_mission_why', $event.target.value)"
              @keydown.enter.prevent="handleNext('q-7')"
            />
          </QuestionCard>

          <!-- Q7: Differentiation -->
          <QuestionCard 
            id="q-7"
            :step="6" 
            question="How is it different?" 
            description="The one thing competitors don't do."
            :show-next="!!store.inputs.q7_competitors_differentiation"
            :locked="!store.inputs.q6_mission_why"
            :completed="!!store.inputs.q7_competitors_differentiation"
            :answer="store.inputs.q7_competitors_differentiation"
            @next="handleNext('q-9')"
          >
             <textarea 
              ref="q7Ref"
              v-model="store.inputs.q7_competitors_differentiation"
              rows="1"
              class="w-full bg-surface border-b border-surfaceHighlight p-0 py-3 text-lg text-text focus:border-accent focus:outline-none transition-colors resize-none overflow-hidden placeholder:text-textMuted/50"
              placeholder="e.g. It talks to you like a friend, not a machine."
              @input="update('q7_competitors_differentiation', $event.target.value)"
              @keydown.enter.prevent="handleNext('q-9')"
            />
          </QuestionCard>

          <!-- Q9: Voice -->
          <QuestionCard 
            id="q-9"
            :step="7" 
            question="How does it sound?" 
            description="Describe the tone of voice (e.g. Witty, Professional, Academic)."
            :show-next="!!store.inputs.q9_voice_tone"
            :locked="!store.inputs.q7_competitors_differentiation"
            :completed="!!store.inputs.q9_voice_tone"
            :answer="store.inputs.q9_voice_tone"
            @next="handleNext('q-10')"
          >
             <textarea 
              ref="q9Ref"
              v-model="store.inputs.q9_voice_tone"
              rows="1"
              class="w-full bg-surface border-b border-surfaceHighlight p-0 py-3 text-lg text-text focus:border-accent focus:outline-none transition-colors resize-none overflow-hidden placeholder:text-textMuted/50"
              placeholder="e.g. Calm, encouraging, and scientific."
              @input="update('q9_voice_tone', $event.target.value)"
              @keydown.enter.prevent="handleNext('q-10')"
            />
          </QuestionCard>

          <!-- Q10: Visuals -->
          <QuestionCard 
            id="q-10"
            :step="8" 
            question="How does it look?" 
            description="Visual style cues (e.g. Dark mode, Glassmorphism, Brutalist)."
            :show-next="!!store.inputs.q10_visual_style"
            :locked="!store.inputs.q9_voice_tone"
            :completed="!!store.inputs.q10_visual_style"
            :answer="store.inputs.q10_visual_style"
            @next="handleNext('q-8')"
          >
             <textarea 
              ref="q10Ref"
              v-model="store.inputs.q10_visual_style"
              rows="1"
              class="w-full bg-surface border-b border-surfaceHighlight p-0 py-3 text-lg text-text focus:border-accent focus:outline-none transition-colors resize-none overflow-hidden placeholder:text-textMuted/50"
              placeholder="e.g. Futuristic greenhouse, neon greens, dark background."
              @input="update('q10_visual_style', $event.target.value)"
              @keydown.enter.prevent="handleNext('q-8')"
            />
          </QuestionCard>

          <!-- Q8: Banned Words (Constraint) -->
          <QuestionCard 
            id="q-8"
            :step="9" 
            question="What is forbidden?" 
            description="Words or vibes you never want to see (Comma separated)."
            :show-next="true"
             warning="Optional"
            :locked="!store.inputs.q10_visual_style"
            :completed="store.inputs.q8_banned_words.length > 0"
            :answer="store.inputs.q8_banned_words"
            @next="handleNext('finish')"
          >
             <textarea 
              ref="q8Ref"
              :value="store.inputs.q8_banned_words.join(', ')"
              rows="1"
              class="w-full bg-surface border-b border-surfaceHighlight p-0 py-3 text-lg text-text focus:border-accent focus:outline-none transition-colors resize-none overflow-hidden placeholder:text-textMuted/50"
              placeholder="e.g. Synergy, Leverage, 'System error'"
              @input="updateArray('q8_banned_words', $event.target.value)"
              @keydown.enter.prevent="handleNext('finish')"
            />
          </QuestionCard>
        </div>
      </template>

      <template #preview>
        <PreviewDoc />
      </template>
      
      <template #actions>
         <span v-if="store.isGenerating" class="text-[10px] uppercase text-accent animate-pulse">
           Enhancing...
         </span>
         <span v-else-if="isSaved" class="text-[10px] uppercase text-green-400 animate-in fade-in slide-in-from-bottom-1">
           Saved
         </span>
         <span v-else class="text-[10px] uppercase text-textMuted opacity-50">
           ...
         </span>
      </template>
    </SplitPane>
  </ClientOnly>
</template>

<script setup>
import { ref, toRef } from 'vue';
import { useDiscoveryStore } from '~/stores/discovery';
import { useTextareaAutosize } from '~/composables/useTextareaAutosize';
import SplitPane from '~/components/SplitPane.vue';
import QuestionCard from '~/components/ui/QuestionCard.vue';
import ArchetypeWheel from '~/components/ui/ArchetypeWheel.vue';
import PreviewDoc from '~/components/ui/PreviewDoc.vue';
import VibeSelector from '~/components/ui/VibeSelector.vue';
import StepProgress from '~/components/ui/StepProgress.vue';

definePageMeta({
  layout: 'default'
})

const store = useDiscoveryStore();

// Autosize Refs
const q1Ref = ref(null);
const q2Ref = ref(null);
const q6Ref = ref(null);
const q7Ref = ref(null);
const q9Ref = ref(null);
const q10Ref = ref(null);
const q8Ref = ref(null);

useTextareaAutosize(q1Ref, toRef(store.inputs, 'q1_core_what'));
useTextareaAutosize(q2Ref, toRef(store.inputs, 'q2_audience_who'));
useTextareaAutosize(q6Ref, toRef(store.inputs, 'q6_mission_why'));
useTextareaAutosize(q7Ref, toRef(store.inputs, 'q7_competitors_differentiation'));
useTextareaAutosize(q9Ref, toRef(store.inputs, 'q9_voice_tone'));
useTextareaAutosize(q10Ref, toRef(store.inputs, 'q10_visual_style'));
useTextareaAutosize(q8Ref, ref('')); // Q8 is array based, we just want autosize on the textarea

// Saved Indicator Logic
const isSaved = ref(false);
let saveTimeout;

const update = (key, val) => {
  store.updateInput(key, val);
  triggerSave(key);
}

const updateArray = (key, val) => {
    // Split by comma
    const arr = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    store.updateInput(key, arr);
    triggerSave(key);
}

const triggerSave = (key) => {
  isSaved.value = false;
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
     isSaved.value = true;
     // Hide after a bit
     setTimeout(() => isSaved.value = false, 2000);
     
     // Trigger enhancement on stop typing
     store.enhanceInput(key);
  }, 1000);
}

// Navigation Logic
const handleNext = (nextId) => {
  if (nextId === 'finish') return; // Or scroll to bottom/show confetti
  
  const el = document.getElementById(nextId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Attempt focus on textarea within that card if exists
    // We add a small delay to allow scroll to start
    setTimeout(() => {
        const textarea = el.querySelector('textarea');
        if (textarea) textarea.focus();
    }, 500);
  }
}
</script>
