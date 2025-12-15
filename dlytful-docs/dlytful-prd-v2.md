# Dlytful PRD v2

## The Philosophy Shift

**Old mental model**: Questionnaire → Wait → Results  
**New mental model**: Input → Instant preview → Input → Preview evolves → Unlock depth

Dlytful feels like a game, not a form. Users see their brand prompt building in real-time. Every answer unlocks something visible. The "Aha!" moment happens in the first 5 minutes, then keeps happening.

---

## 0. Stack & Architecture

### Target Stack
- **Framework**: Nuxt 3 (Vue 3, Composition API, TypeScript)
- **State**: Pinia (reactive, drives live preview)
- **Server**: Nitro (Nuxt /server/api)
- **Styling**: Tailwind CSS
- **Database**: Supabase (Postgres + Auth)
- **AI**: Google Gemini 2.5 (`gemini-2.5-flash-preview-05-20`)
- **Email**: Resend
- **Hosting**: Vercel

### Core Architecture Principle
```
User Input → Reactive State → Live Preview + AI Enhancement → Validated Output
     ↑                              ↓
     └──── Micro-feedback loop ─────┘
```

Every input triggers visible change. AI enhances in background. User always feels in control.

---

## 1. The Brand Prompt System

### What is a Brand Prompt?

A **Brand Prompt** is the deliverable users paste into Bolt, Lovable, or Replit. It's structured text that transforms their app's visual identity and voice without touching functionality.

**Brand Prompt types by tier:**

| Type | Purpose | Tier |
|------|---------|------|
| Quick Transform | Basic visual refresh | dlytful zero |
| Full Rebrand | Complete visual + voice overhaul | dlytful one |
| Foundation | Start a new build with brand DNA | dlytful one |
| Discoverability | SEO/metadata injection | dlytful max |
| Agent Voice | System prompt for AI features | dlytful max |

### Brand Prompt Anatomy

Every Brand Prompt follows this structure (deterministic):

```markdown
## Product Identity
[Positioning statement - follows strict template]

## Target User
[Persona summary]
They would describe this as: "[user's words]"

## Brand Energy
Primary: [Archetype] — [Description]
Secondary: [Archetype] — [Description]

## Visual Direction
Colors: [With psychological rationale]
Typography: [With personality rationale]
Energy: [Derived from "perfect day" input]

## Voice Rules
Sounds like: [List]
Never sounds like: [List]
Never use: [Word list]

## Transform Guidelines
[Specific component guidance]
```

---

## 2. The Progressive Unlock System

### Core Concept: Visible Value at Every Step

Users don't fill out a form and wait. They see their Brand Prompt building live.

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Quick Win (0-2 min)                                    │
│  ├─ Q1: What does it do? (one sentence)                         │
│  │   → UNLOCK: Basic positioning preview appears                │
│  │   → UNLOCK: "Paste this now" button activates                │
│  └─ User can STOP HERE and get value (dlytful zero)            │
├─────────────────────────────────────────────────────────────────┤
│  STEP 2: The Moment (2-4 min)                                   │
│  ├─ Q2: The "this is good" moment                               │
│  │   → UNLOCK: Voice preview appears                            │
│  │   → UNLOCK: Color suggestions emerge                         │
│  ├─ Q3: What it looks like now (URL or description)             │
│  │   → UNLOCK: "Before/After" concept preview                   │
│  └─ User can STOP HERE with basic Brand Prompt                  │
├─────────────────────────────────────────────────────────────────┤
│  STEP 3: Your People (4-6 min) — dlytful one                    │
│  ├─ Q4: Who gets it immediately?                                │
│  │   → UNLOCK: Persona card appears                             │
│  ├─ Q5: What they'd tell friends                                │
│  │   → UNLOCK: Copy angles preview                              │
│  ├─ Q6: Their prior frustration                                 │
│  │   → UNLOCK: Positioning sharpens                             │
│  └─ User can STOP HERE with stronger Brand Prompt               │
├─────────────────────────────────────────────────────────────────┤
│  STEP 4: Your Edge (6-8 min) — dlytful one                      │
│  ├─ Q7: What you're NOT                                         │
│  │   → UNLOCK: Anti-patterns list appears                       │
│  │   → UNLOCK: Voice "never" rules populate                     │
│  ├─ Q8: Jargon check (solution/leverage?)                       │
│  │   → UNLOCK: Banned words list                                │
│  ├─ Q9: The opposite of what you're building                    │
│  │   → UNLOCK: Positioning contrast sharpens                    │
│  └─ Archetype suggestions begin highlighting                    │
├─────────────────────────────────────────────────────────────────┤
│  STEP 5: Your Vibe (8-10 min) — dlytful one                     │
│  ├─ Q10: Perfect day feeling                                    │
│  │   → UNLOCK: Brand energy description                         │
│  │   → UNLOCK: Color palette finalizes                          │
│  ├─ Archetype Wheel interaction                                 │
│  │   → UNLOCK: Full persona + voice rules                       │
│  └─ Full Brand Prompt complete                                  │
├─────────────────────────────────────────────────────────────────┤
│  STEP 6: Validation (10-12 min) — dlytful max                   │
│  ├─ "Here's what I'm hearing..."                                │
│  │   → User confirms/adjusts                                    │
│  ├─ Advanced outputs unlock:                                    │
│  │   → Discoverability Prompt                                   │
│  │   → Agent Voice Prompt                                       │
│  │   → Sprint comparison                                        │
│  └─ Export + full archetype access                              │
└─────────────────────────────────────────────────────────────────┘
```

### The Live Preview Panel

On desktop: split-screen. Left = inputs, Right = live preview.
On mobile: swipeable panels or bottom sheet preview.

```
┌──────────────────────┬──────────────────────┐
│                      │                      │
│    DISCOVERY         │    BRAND PROMPT      │
│    QUESTIONS         │    PREVIEW           │
│                      │                      │
│  ┌────────────────┐  │  ┌────────────────┐  │
│  │ Q: What does   │  │  │ ## Product     │  │
│  │ your product   │  │  │                │  │
│  │ do?            │  │  │ For [builds    │  │
│  │                │  │  │ as you type]   │  │
│  │ [input field]  │  │  │                │  │
│  └────────────────┘  │  │ ## Voice       │  │
│                      │  │ 🔒 Answer Q2   │  │
│  [Continue →]        │  │ to unlock      │  │
│                      │  │                │  │
│                      │  │ ## Colors      │  │
│                      │  │ 🔒 Answer Q2   │  │
│                      │  │ to unlock      │  │
│                      │  └────────────────┘  │
│                      │                      │
│                      │  [Copy Prompt]       │
│                      │  (available early!)  │
└──────────────────────┴──────────────────────┘
```

---

## 3. Deterministic vs. Probabilistic Split

### Hard Rules (Deterministic) — Always Enforced

These frameworks come from proven branding methodology. They're non-negotiable structure.

#### 1. Positioning Statement Template
```
For {targetAudience}, {brandName} is the {category} that {differentiation} because {reasonToBelieve}.
```
- AI fills the blanks
- Structure never changes
- User sees template building as they answer

#### 2. Voice Rules Structure
Always three categories, always populated:
```typescript
interface VoiceRules {
  sounds_like: string[]      // 3-5 descriptors
  never_like: string[]       // 3-5 anti-descriptors  
  never_words: string[]      // 5-10 banned words
}
```

#### 3. Archetype System
- Fixed 12 archetypes (Jungian)
- Primary + optional Secondary
- Each has defined characteristics, not AI-invented

#### 4. Color Psychology Anchors
Colors must include rationale tied to established psychology:
```typescript
const COLOR_PSYCHOLOGY = {
  '#FF9A00': { name: 'Warm Orange', meaning: 'energy, warmth, approachability', best_for: 'friendly, accessible brands' },
  '#007FFF': { name: 'Clear Blue', meaning: 'trust, stability, calm', best_for: 'reliable, professional brands' },
  '#79B972': { name: 'Soft Green', meaning: 'growth, health, balance', best_for: 'sustainable, wellness brands' },
  // ... etc
}
```

#### 5. Promise Validation Gates
Every promise must pass (shown as checklist to user):
- ✓ Believable — Can you deliver this today?
- ✓ Simple — One sentence or less
- ✓ Meaningful — Addresses what audience values
- ✓ Inspiring — Worth working toward

#### 6. Banned Words (Hard Block in Outputs)
```typescript
const BANNED_WORDS = [
  'synergy', 'leverage', 'solution', 'cutting-edge', 'innovative',
  'seamless', 'robust', 'best-in-class', 'thought leader', 'disrupt',
  'game-changing', 'paradigm', 'holistic', 'scalable', 'turnkey',
  'bleeding edge', 'move the needle', 'circle back', 'deep dive'
]
```

### Soft Rules (Probabilistic) — AI-Generated, User-Controlled

These are personalized to user inputs. AI generates, user approves.

1. **Specific language** within templates
2. **Metaphors and analogies** from their inputs
3. **Copy angles** (creative interpretations)
4. **"Perfect day" → Brand energy** translation
5. **Archetype recommendations** (suggestions, not mandates)
6. **Social bio and one-liner** variations
7. **Color palette specifics** (within psychology guidelines)

---

## 4. Validation & Flagging System

### Philosophy
- Never block users
- Always explain rationale
- Let them override with understanding

### Validation Tiers

#### Tier 1: Structural Validation (Hard)
Ensures output follows required frameworks.

```typescript
interface StructuralValidation {
  positioningComplete: boolean    // All template fields filled
  voiceRulesComplete: boolean     // All 3 categories populated
  archetypeValid: boolean         // From valid set
  noBannedWords: boolean          // Output clean
}
```

**If fails**: Auto-fix silently (e.g., regenerate without banned words)

#### Tier 2: Quality Validation (Soft Flags)
Warns user of potential issues.

```typescript
interface QualityFlags {
  positioningVague?: string       // "Your differentiation could be more specific"
  promiseUndeliverable?: string   // "This promise may be hard to consistently deliver"
  archetypeMismatch?: string      // "Explorer archetype seems to contradict your 'reliable' positioning"
  audienceTooWide?: string        // "Your target audience might be too broad"
}
```

**If flagged**: Show inline warning with explanation. User can proceed or adjust.

#### Tier 3: Contradiction Detection (Warnings)
Catches logical conflicts.

```typescript
interface ContradictionWarnings {
  archetype_vs_positioning?: {
    issue: string
    suggestion: string
  }
  promise_vs_capability?: {
    issue: string
    suggestion: string
  }
  voice_vs_archetype?: {
    issue: string
    suggestion: string
  }
}
```

**Example warning UI**:
```
⚠️ Heads up: You selected "Rebel" archetype but your positioning 
   emphasizes "reliability and trust." These can work together, 
   but you'll want to be intentional about how rebellion shows 
   up in a trustworthy way.
   
   [Keep my choices] [Help me reconcile]
```

### User Input Flagging (Soft)

When user inputs contain jargon:

```typescript
function flagJargonInInput(input: string): JargonFlag | null {
  const found = BANNED_WORDS.filter(word => 
    input.toLowerCase().includes(word.toLowerCase())
  )
  
  if (found.length > 0) {
    return {
      words: found,
      message: `Words like "${found[0]}" can feel corporate. We'll translate this into more human language.`,
      severity: 'info' // Not blocking
    }
  }
  return null
}
```

**UI treatment**: Subtle inline hint, not blocking

---

## 5. The Live Preview Engine

### Reactive State Architecture

```typescript
// stores/sprint.ts

interface SprintState {
  // Raw inputs (what user types)
  inputs: DiscoveryInputs
  
  // Derived/generated content (updates reactively)
  preview: {
    positioning: string | null
    positioningParts: {
      targetAudience: string | null
      category: string | null
      differentiation: string | null
      reasonToBelieve: string | null
    }
    voiceRules: VoiceRules | null
    colorSuggestions: ColorSuggestion[] | null
    archetypeRecommendations: ArchetypeRec[] | null
    personaSummary: string | null
    copyAngles: string[] | null
    brandEnergy: string | null
  }
  
  // Unlock state
  unlocks: {
    basicPositioning: boolean      // After Q1
    voicePreview: boolean          // After Q2
    colorPreview: boolean          // After Q2
    personaCard: boolean           // After Q4
    copyAngles: boolean            // After Q5
    antiPatterns: boolean          // After Q7
    fullArchetypeWheel: boolean    // After Q9
    brandEnergy: boolean           // After Q10
    advancedPrompts: boolean       // After validation (max only)
  }
  
  // Validation state
  flags: QualityFlags
  warnings: ContradictionWarnings
}
```

### Debounced Generation

Don't call AI on every keystroke. Debounce intelligently.

```typescript
// composables/useLivePreview.ts

export const useLivePreview = () => {
  const sprint = useSprintStore()
  const { pending, generate } = useGemini()
  
  // Debounce input changes
  const debouncedGenerate = useDebounceFn(async (field: string, value: string) => {
    // Update local preview immediately with template
    sprint.updatePreviewOptimistic(field, value)
    
    // Then enhance with AI
    const enhanced = await generate({
      type: 'enhance_field',
      field,
      value,
      context: sprint.inputs
    })
    
    sprint.updatePreview(field, enhanced)
  }, 500)
  
  // Watch for input changes
  watch(() => sprint.inputs, (newInputs, oldInputs) => {
    const changedField = findChangedField(newInputs, oldInputs)
    if (changedField) {
      debouncedGenerate(changedField.key, changedField.value)
    }
  }, { deep: true })
  
  return { pending }
}
```

### Optimistic Updates

Show something immediately, enhance with AI.

```typescript
// stores/sprint.ts - actions

updatePreviewOptimistic(field: string, value: string) {
  // Immediately show user's words in template
  switch(field) {
    case 'product_description':
      this.preview.positioningParts.category = extractCategory(value)
      this.preview.positioning = buildPositioningPreview(this.preview.positioningParts)
      break
    case 'target_persona':
      this.preview.positioningParts.targetAudience = value
      this.preview.positioning = buildPositioningPreview(this.preview.positioningParts)
      break
    // ... etc
  }
}

updatePreview(field: string, enhanced: EnhancedContent) {
  // Replace optimistic with AI-enhanced version
  // But keep structure intact
}
```

---

## 6. Gemini 2.5 Integration

### API Configuration

```typescript
// server/utils/gemini.ts

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const gemini = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash-preview-05-20',
  generationConfig: {
    temperature: 0.7,        // Balance creativity/consistency
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
  }
})

// For structured outputs
export const geminiStructured = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-preview-05-20',
  generationConfig: {
    temperature: 0.3,        // More deterministic for frameworks
    responseMimeType: 'application/json',
  }
})
```

### System Prompt Architecture

```typescript
// server/utils/prompts.ts

export const SYSTEM_PROMPT = `You are a brand strategist for indie developers. You help translate product descriptions into clear, human brand language.

## HARD RULES (Never violate)

1. POSITIONING STRUCTURE: Always use this exact template:
   "For [target audience], [brand name] is the [category] that [point of differentiation] because [reason to believe]."

2. VOICE RULES: Always output exactly three categories:
   - sounds_like: 3-5 human descriptors
   - never_like: 3-5 anti-descriptors
   - never_words: 5-10 specific words to avoid

3. BANNED WORDS: Never use these in any output:
   synergy, leverage, solution, cutting-edge, innovative, seamless, robust, 
   best-in-class, thought leader, disrupt, game-changing, paradigm, holistic,
   scalable, turnkey, bleeding edge, move the needle, circle back, deep dive

4. ARCHETYPES: Only reference these 12:
   Innocent, Sage, Explorer, Rebel, Magician, Hero, 
   Everyman, Lover, Jester, Caregiver, Ruler, Creator

5. COLOR RATIONALE: Every color suggestion must include psychological reasoning.

## SOFT GUIDELINES (Apply with judgment)

- Sound like a real person, never corporate
- Be specific and concrete, not vague
- Respect user's original language and intent
- When uncertain, ask for clarification
- Flag contradictions gently, don't block

## OUTPUT FORMAT

Always respond in valid JSON matching the requested schema.`
```

### Generation Endpoints

#### Quick Enhancement (Single Field)

```typescript
// server/api/generate/enhance.post.ts

export default defineEventHandler(async (event) => {
  const { field, value, context } = await readBody(event)
  
  const prompt = buildEnhancePrompt(field, value, context)
  
  const result = await geminiStructured.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: SYSTEM_PROMPT,
  })
  
  const enhanced = JSON.parse(result.response.text())
  
  // Validate against hard rules
  const validated = validateEnhancement(enhanced, field)
  
  return validated
})

function buildEnhancePrompt(field: string, value: string, context: DiscoveryInputs): string {
  switch(field) {
    case 'product_description':
      return `
        User described their product as: "${value}"
        
        Extract and enhance:
        {
          "category": "the product category in 2-4 words",
          "positioning_preview": "draft positioning using template",
          "suggested_archetypes": ["archetype1", "archetype2"]
        }
      `
    case 'core_moment':
      return `
        User described their product's "aha moment" as: "${value}"
        Context - Product: "${context.product_description}"
        
        Generate:
        {
          "voice_preview": {
            "sounds_like": ["descriptor1", "descriptor2", "descriptor3"],
            "tone": "brief tone description"
          },
          "color_suggestions": [
            {"hex": "#XXXXXX", "name": "Color Name", "rationale": "why this fits"}
          ],
          "brand_energy": "one sentence energy description"
        }
      `
    // ... other fields
  }
}
```

#### Full Brand Prompt Generation

```typescript
// server/api/generate/brand-prompt.post.ts

export default defineEventHandler(async (event) => {
  const { inputs, tier, archetypes } = await readBody(event)
  
  // Step 1: Extract framework (deterministic)
  const framework = extractFramework(inputs, archetypes)
  
  // Step 2: Validate framework
  const frameworkValidation = validateFramework(framework)
  if (!frameworkValidation.complete) {
    return { 
      error: 'incomplete',
      missing: frameworkValidation.missing 
    }
  }
  
  // Step 3: Generate within constraints
  const prompt = buildBrandPromptGeneration(framework, tier)
  
  const result = await gemini.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: SYSTEM_PROMPT,
  })
  
  const generated = JSON.parse(result.response.text())
  
  // Step 4: Hard validation (auto-fix)
  const cleaned = enforceHardRules(generated)
  
  // Step 5: Soft validation (flags)
  const flags = detectQualityIssues(cleaned, framework)
  const warnings = detectContradictions(cleaned, framework)
  
  return {
    outputs: cleaned,
    flags,
    warnings,
    framework // Return for transparency
  }
})
```

#### Archetype Recommendation

```typescript
// server/api/generate/archetype-recommend.post.ts

export default defineEventHandler(async (event) => {
  const { inputs } = await readBody(event)
  
  const prompt = `
    Based on these discovery inputs, recommend 2-3 brand archetypes.
    
    Product: "${inputs.product_description}"
    Core moment: "${inputs.core_moment}"
    Target user: "${inputs.target_persona}"
    Not like: "${inputs.not_like}"
    Opposite: "${inputs.opposite}"
    Perfect day feeling: "${inputs.perfect_day}"
    
    ONLY recommend from these 12 archetypes:
    ${ARCHETYPES.map(a => `- ${a.name}: ${a.description}`).join('\n')}
    
    Return:
    {
      "recommendations": [
        {
          "archetype": "archetype_id",
          "confidence": 0.0-1.0,
          "reasoning": "why this fits based on their inputs"
        }
      ],
      "suggested_combination": {
        "primary": "archetype_id",
        "secondary": "archetype_id or null",
        "combination_rationale": "how these work together"
      }
    }
  `
  
  const result = await geminiStructured.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: SYSTEM_PROMPT,
  })
  
  return JSON.parse(result.response.text())
})
```

---

## 7. Micro-Interaction Patterns

### Unlock Animations

When user completes a question that unlocks new content:

```vue
<!-- components/discovery/UnlockReveal.vue -->
<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
  >
    <div v-if="unlocked" class="relative">
      <!-- Unlock badge -->
      <div class="absolute -top-2 -right-2 bg-dlytful-sun text-white text-xs px-2 py-1 rounded-full animate-bounce">
        ✨ Unlocked!
      </div>
      <slot />
    </div>
  </Transition>
  
  <!-- Locked state -->
  <div v-if="!unlocked" class="relative opacity-50 pointer-events-none">
    <div class="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
      <div class="text-center">
        <LockIcon class="w-6 h-6 mx-auto text-gray-400" />
        <p class="text-sm text-gray-500 mt-1">{{ unlockHint }}</p>
      </div>
    </div>
    <slot name="preview" />
  </div>
</template>
```

### Live Typing Effect

Brand Prompt preview shows text appearing as if being typed:

```typescript
// composables/useTypewriter.ts

export const useTypewriter = (text: Ref<string>, speed = 30) => {
  const displayed = ref('')
  const isTyping = ref(false)
  
  watch(text, async (newText) => {
    if (!newText) {
      displayed.value = ''
      return
    }
    
    isTyping.value = true
    displayed.value = ''
    
    for (let i = 0; i < newText.length; i++) {
      displayed.value += newText[i]
      await new Promise(r => setTimeout(r, speed))
    }
    
    isTyping.value = false
  })
  
  return { displayed, isTyping }
}
```

### Progress Celebration

```vue
<!-- components/discovery/ProgressCelebration.vue -->
<template>
  <Transition>
    <div v-if="showCelebration" class="fixed inset-0 pointer-events-none z-50">
      <!-- Confetti or subtle particle effect -->
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="text-center animate-scale-in">
          <div class="text-4xl mb-2">{{ emoji }}</div>
          <p class="text-lg font-medium text-dlytful-sun">{{ message }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const celebrations = {
  firstUnlock: { emoji: '🎨', message: 'Your brand is taking shape!' },
  halfwayDone: { emoji: '🚀', message: 'Halfway there!' },
  voiceUnlocked: { emoji: '🗣️', message: 'Your voice is emerging!' },
  promptReady: { emoji: '✨', message: 'Your Brand Prompt is ready!' },
}
</script>
```

### Copy Feedback

```vue
<!-- components/ui/CopyButton.vue -->
<template>
  <button 
    @click="copy"
    class="relative group"
    :class="{ 'text-dlytful-herb': copied }"
  >
    <Transition mode="out-in">
      <CheckIcon v-if="copied" class="w-5 h-5" />
      <ClipboardIcon v-else class="w-5 h-5" />
    </Transition>
    
    <!-- Ripple effect on copy -->
    <span 
      v-if="copied" 
      class="absolute inset-0 animate-ping bg-dlytful-herb/20 rounded-full"
    />
    
    <!-- Tooltip -->
    <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
      {{ copied ? 'Copied!' : 'Copy to clipboard' }}
    </span>
  </button>
</template>
```

---

## 8. The Preview Panel Component

### Desktop Split View

```vue
<!-- components/discovery/BrandPromptPreview.vue -->
<template>
  <div class="h-full flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
      <h3 class="font-medium text-gray-700">Your Brand Prompt</h3>
      <div class="flex items-center gap-2">
        <span v-if="isGenerating" class="text-sm text-gray-500 flex items-center gap-1">
          <LoadingSpinner class="w-4 h-4" />
          Enhancing...
        </span>
        <CopyButton :content="fullPrompt" :disabled="!canCopy" />
      </div>
    </div>
    
    <!-- Preview Content -->
    <div class="flex-1 overflow-y-auto p-4 font-mono text-sm">
      <!-- Product Identity Section -->
      <PreviewSection 
        title="Product Identity" 
        :unlocked="unlocks.basicPositioning"
        unlock-hint="Answer the first question"
      >
        <template #content>
          <p class="text-gray-800">{{ preview.positioning || 'Building...' }}</p>
        </template>
        <template #preview>
          <p class="text-gray-400">For [target], [product] is the [category] that [difference] because [reason].</p>
        </template>
      </PreviewSection>
      
      <!-- Voice Section -->
      <PreviewSection 
        title="Voice Rules" 
        :unlocked="unlocks.voicePreview"
        unlock-hint="Describe the 'aha moment'"
      >
        <template #content>
          <div v-if="preview.voiceRules">
            <p><strong>Sounds like:</strong> {{ preview.voiceRules.sounds_like.join(', ') }}</p>
            <p><strong>Never like:</strong> {{ preview.voiceRules.never_like.join(', ') }}</p>
            <p><strong>Never use:</strong> {{ preview.voiceRules.never_words.join(', ') }}</p>
          </div>
        </template>
      </PreviewSection>
      
      <!-- Color Section -->
      <PreviewSection 
        title="Visual Direction" 
        :unlocked="unlocks.colorPreview"
        unlock-hint="Describe the 'aha moment'"
      >
        <template #content>
          <div class="flex gap-2 mb-2">
            <div 
              v-for="color in preview.colorSuggestions" 
              :key="color.hex"
              class="w-8 h-8 rounded-lg shadow-inner"
              :style="{ backgroundColor: color.hex }"
              :title="color.rationale"
            />
          </div>
          <p class="text-gray-600 text-xs">{{ preview.brandEnergy }}</p>
        </template>
      </PreviewSection>
      
      <!-- Archetype Section -->
      <PreviewSection 
        title="Brand Energy" 
        :unlocked="unlocks.fullArchetypeWheel"
        unlock-hint="Complete 'Your Edge' questions"
      >
        <template #content>
          <div v-if="selectedArchetypes.primary">
            <p><strong>Primary:</strong> {{ selectedArchetypes.primary.name }} — {{ selectedArchetypes.primary.energy }}</p>
            <p v-if="selectedArchetypes.secondary">
              <strong>Secondary:</strong> {{ selectedArchetypes.secondary.name }}
            </p>
          </div>
        </template>
      </PreviewSection>
      
      <!-- Validation Flags -->
      <div v-if="Object.keys(flags).length > 0" class="mt-4 space-y-2">
        <ValidationFlag 
          v-for="(message, key) in flags" 
          :key="key"
          :message="message"
          @dismiss="dismissFlag(key)"
        />
      </div>
      
      <!-- Contradiction Warnings -->
      <div v-if="Object.keys(warnings).length > 0" class="mt-4 space-y-2">
        <ContradictionWarning
          v-for="(warning, key) in warnings"
          :key="key"
          :issue="warning.issue"
          :suggestion="warning.suggestion"
          @keep="keepChoice(key)"
          @reconcile="openReconciliation(key)"
        />
      </div>
    </div>
    
    <!-- Footer CTA -->
    <div class="px-4 py-3 border-t bg-gray-50">
      <button
        @click="copyAndPrompt"
        :disabled="!canCopy"
        class="w-full py-2 px-4 bg-dlytful-sun text-white rounded-lg font-medium 
               hover:bg-dlytful-sun/90 disabled:opacity-50 disabled:cursor-not-allowed
               transition-all"
      >
        {{ canCopy ? '📋 Copy & Paste into Bolt' : '🔒 Answer more to unlock' }}
      </button>
      <p class="text-xs text-center text-gray-500 mt-2">
        {{ completionPercentage }}% complete
      </p>
    </div>
  </div>
</template>
```

---

## 9. Question Flow Components

### Single Question Display

```vue
<!-- components/discovery/QuestionCard.vue -->
<template>
  <div class="max-w-xl mx-auto">
    <!-- Progress dots -->
    <div class="flex justify-center gap-2 mb-8">
      <button
        v-for="(q, i) in questions"
        :key="q.id"
        @click="canJumpTo(i) && goTo(i)"
        class="w-2 h-2 rounded-full transition-all"
        :class="{
          'bg-dlytful-sun w-6': i === currentIndex,
          'bg-dlytful-herb': isComplete(i) && i !== currentIndex,
          'bg-gray-200': !isComplete(i) && i !== currentIndex,
          'cursor-pointer hover:scale-125': canJumpTo(i),
          'cursor-default': !canJumpTo(i)
        }"
      />
    </div>
    
    <!-- Question -->
    <Transition mode="out-in" name="slide">
      <div :key="currentQuestion.id" class="text-center">
        <!-- Part label -->
        <span class="text-sm text-dlytful-sky font-medium uppercase tracking-wide">
          {{ currentPart.label }}
        </span>
        
        <!-- Question text -->
        <h2 class="text-2xl md:text-3xl font-serif text-gray-900 mt-2 mb-6">
          {{ currentQuestion.text }}
        </h2>
        
        <!-- Input -->
        <div class="mt-6">
          <textarea
            v-if="currentQuestion.type === 'textarea'"
            v-model="answer"
            :placeholder="currentQuestion.placeholder"
            rows="4"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl 
                   focus:ring-2 focus:ring-dlytful-sun focus:border-transparent
                   resize-none text-lg"
            @input="onInput"
          />
          
          <input
            v-else
            v-model="answer"
            :type="currentQuestion.type"
            :placeholder="currentQuestion.placeholder"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl 
                   focus:ring-2 focus:ring-dlytful-sun focus:border-transparent
                   text-lg text-center"
            @input="onInput"
          />
          
          <!-- Jargon flag (soft) -->
          <Transition>
            <p v-if="jargonFlag" class="mt-2 text-sm text-amber-600 flex items-center justify-center gap-1">
              <InfoIcon class="w-4 h-4" />
              {{ jargonFlag.message }}
            </p>
          </Transition>
        </div>
        
        <!-- Navigation -->
        <div class="flex justify-between items-center mt-8">
          <button
            v-if="currentIndex > 0"
            @click="prev"
            class="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <ChevronLeftIcon class="w-4 h-4" />
            Back
          </button>
          <div v-else />
          
          <button
            @click="next"
            :disabled="!canProceed"
            class="px-6 py-2 bg-dlytful-sun text-white rounded-lg font-medium
                   hover:bg-dlytful-sun/90 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center gap-2"
          >
            {{ isLastInTier ? 'Generate Brand Prompt' : 'Continue' }}
            <ChevronRightIcon class="w-4 h-4" />
          </button>
        </div>
        
        <!-- Skip hint for free tier -->
        <p v-if="canSkipToResult" class="mt-4 text-sm text-gray-500">
          <button @click="skipToResult" class="underline hover:text-dlytful-sun">
            Skip ahead
          </button>
          and get a basic Brand Prompt now
        </p>
      </div>
    </Transition>
  </div>
</template>
```

---

## 10. Database Schema (Updated)

```sql
-- Core tables remain similar, but add unlock tracking

-- sprints table
create table public.sprints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users on delete cascade not null,
  parent_id uuid references public.sprints on delete set null,
  label text,
  
  -- Inputs (user answers)
  inputs jsonb default '{}'::jsonb,
  
  -- Generated outputs
  outputs jsonb default '{}'::jsonb,
  
  -- Framework extraction (deterministic)
  framework jsonb default '{}'::jsonb,
  
  -- Validation state
  flags jsonb default '{}'::jsonb,
  warnings jsonb default '{}'::jsonb,
  
  -- Archetype selection
  archetype_primary text,
  archetype_secondary text,
  
  -- Progress tracking
  current_step integer default 1,
  unlocks jsonb default '{
    "basicPositioning": false,
    "voicePreview": false,
    "colorPreview": false,
    "personaCard": false,
    "copyAngles": false,
    "antiPatterns": false,
    "fullArchetypeWheel": false,
    "brandEnergy": false,
    "advancedPrompts": false
  }'::jsonb,
  
  -- Timestamps
  status text default 'draft' check (status in ('draft', 'complete')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- User engagement tracking (for gamification)
create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users on delete cascade not null,
  achievement_type text not null,
  achieved_at timestamp with time zone default now(),
  metadata jsonb default '{}'::jsonb,
  
  unique(user_id, achievement_type)
);

-- Achievement types:
-- 'first_prompt' - Generated first Brand Prompt
-- 'first_paste' - Clicked copy (we can track this)
-- 'full_discovery' - Completed all questions
-- 'archetype_explorer' - Tried 3+ different archetype combos
-- 'iteration_master' - Forked a sprint
-- 'perfectionist' - Addressed all flags/warnings
```

---

## 11. Constants & Rules

```typescript
// constants/rules.ts

export const POSITIONING_TEMPLATE = 
  'For {targetAudience}, {brandName} is the {category} that {differentiation} because {reasonToBelieve}.'

export const VOICE_CATEGORIES = ['sounds_like', 'never_like', 'never_words'] as const

export const BANNED_WORDS = [
  'synergy', 'leverage', 'solution', 'cutting-edge', 'innovative',
  'seamless', 'robust', 'best-in-class', 'thought leader', 'disrupt',
  'game-changing', 'paradigm', 'holistic', 'scalable', 'turnkey',
  'bleeding edge', 'move the needle', 'circle back', 'deep dive',
  'empower', 'revolutionize', 'streamline', 'optimize', 'utilize',
  'synergize', 'incentivize', 'actionable', 'bandwidth', 'ideate'
]

export const COLOR_PSYCHOLOGY: Record<string, ColorPsychology> = {
  // Warm colors
  '#FF9A00': { 
    name: 'Dlytful Sun', 
    meaning: 'warmth, energy, optimism, approachability',
    best_for: 'friendly, accessible, energetic brands',
    avoid_for: 'luxury, serious, corporate brands'
  },
  '#FF6B6B': {
    name: 'Coral Red',
    meaning: 'passion, excitement, urgency, boldness',
    best_for: 'action-oriented, youthful, bold brands',
    avoid_for: 'calming, trustworthy, healthcare brands'
  },
  
  // Cool colors
  '#007FFF': {
    name: 'Dlytful Sky',
    meaning: 'trust, reliability, calm, professionalism',
    best_for: 'trustworthy, professional, tech brands',
    avoid_for: 'playful, rebellious, warm brands'
  },
  '#79B972': {
    name: 'Dlytful Herb',
    meaning: 'growth, health, balance, sustainability',
    best_for: 'eco-friendly, wellness, balanced brands',
    avoid_for: 'luxury, urgency, tech-forward brands'
  },
  
  // ... more colors with rationale
}

export const PROMISE_VALIDATION = {
  believable: {
    question: 'Can you point to specific systems or capabilities that deliver this promise today?',
    fail_message: 'This promise might be aspirational. Consider what you can deliver right now.',
  },
  simple: {
    question: 'Can you express this in one clear sentence?',
    fail_message: 'This promise might be too complex. Simplify to the core commitment.',
  },
  meaningful: {
    question: 'Does this address something your target audience actually values?',
    fail_message: 'This promise might not resonate. Connect it to real audience needs.',
  },
  inspiring: {
    question: 'Does this make your team proud to deliver it?',
    fail_message: 'This promise might be too generic. Find what makes it worth committing to.',
  }
}

// Archetype contradiction matrix
export const ARCHETYPE_TENSIONS: Record<string, string[]> = {
  'rebel': ['ruler', 'caregiver', 'innocent'],      // Rebellion vs authority/nurturing/purity
  'ruler': ['rebel', 'jester', 'everyman'],         // Authority vs rebellion/playfulness/common
  'innocent': ['rebel', 'magician', 'lover'],       // Purity vs rebellion/complexity/sensuality
  'sage': ['jester', 'lover', 'rebel'],             // Wisdom vs playfulness/emotion/chaos
  'explorer': ['ruler', 'caregiver'],               // Freedom vs control/attachment
  'hero': ['jester', 'lover'],                      // Achievement vs play/intimacy
  // ... etc
}

// When these combos are selected, show warning (but allow)
export function checkArchetypeTension(primary: string, secondary: string): TensionWarning | null {
  const tensions = ARCHETYPE_TENSIONS[primary] || []
  if (tensions.includes(secondary)) {
    return {
      issue: `${primary} and ${secondary} archetypes have natural tension`,
      suggestion: `This can work if intentional. Consider how ${primary}'s energy and ${secondary}'s traits complement rather than contradict.`
    }
  }
  return null
}
```

---

## 12. Validation Logic

```typescript
// server/utils/validation.ts

// HARD VALIDATION (auto-fix, don't show to user)
export function enforceHardRules(output: GeneratedOutput): GeneratedOutput {
  const cleaned = { ...output }
  
  // Remove banned words from all text fields
  const textFields = ['positioning', 'personaSummary', 'brandEnergy', 'copyAngles', 'socialBio']
  
  for (const field of textFields) {
    if (cleaned[field]) {
      if (Array.isArray(cleaned[field])) {
        cleaned[field] = cleaned[field].map(text => removeBannedWords(text))
      } else {
        cleaned[field] = removeBannedWords(cleaned[field])
      }
    }
  }
  
  // Remove banned words from voice rules
  if (cleaned.voiceRules) {
    cleaned.voiceRules.sounds_like = cleaned.voiceRules.sounds_like.map(removeBannedWords)
    cleaned.voiceRules.never_like = cleaned.voiceRules.never_like.map(removeBannedWords)
    // never_words can contain banned words (that's the point)
  }
  
  // Ensure voice rules has all categories
  if (!cleaned.voiceRules?.sounds_like?.length) {
    cleaned.voiceRules = cleaned.voiceRules || {}
    cleaned.voiceRules.sounds_like = ['authentic', 'clear', 'human']
  }
  if (!cleaned.voiceRules?.never_like?.length) {
    cleaned.voiceRules.never_like = ['corporate', 'salesy', 'jargon-heavy']
  }
  if (!cleaned.voiceRules?.never_words?.length) {
    cleaned.voiceRules.never_words = ['synergy', 'leverage', 'solution', 'innovative', 'disrupt']
  }
  
  return cleaned
}

function removeBannedWords(text: string): string {
  let cleaned = text
  for (const word of BANNED_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    cleaned = cleaned.replace(regex, '')
  }
  // Clean up double spaces
  return cleaned.replace(/\s+/g, ' ').trim()
}

// SOFT VALIDATION (show flags to user)
export function detectQualityIssues(
  output: GeneratedOutput, 
  framework: ExtractedFramework
): QualityFlags {
  const flags: QualityFlags = {}
  
  // Check positioning specificity
  if (output.positioning) {
    if (output.positioning.length < 50) {
      flags.positioningVague = 'Your positioning could be more specific. What makes you truly different?'
    }
    if (!output.positioning.includes('because')) {
      flags.positioningIncomplete = 'Strong positioning includes a "because" — the reason to believe.'
    }
  }
  
  // Check audience breadth
  if (framework.positioning.targetAudience) {
    const vagueAudiences = ['everyone', 'people', 'users', 'customers', 'businesses', 'companies']
    if (vagueAudiences.some(v => framework.positioning.targetAudience.toLowerCase().includes(v))) {
      flags.audienceTooWide = 'Your target audience might be too broad. Who specifically gets the most value?'
    }
  }
  
  // Check promise deliverability
  if (output.positioning) {
    const strongClaims = ['best', 'only', 'first', 'fastest', 'cheapest', 'most']
    if (strongClaims.some(claim => output.positioning.toLowerCase().includes(claim))) {
      flags.promiseUndeliverable = 'Strong claims like "best" or "only" are hard to prove. Can you deliver this consistently?'
    }
  }
  
  return flags
}

// CONTRADICTION DETECTION (show warnings to user)
export function detectContradictions(
  output: GeneratedOutput,
  framework: ExtractedFramework
): ContradictionWarnings {
  const warnings: ContradictionWarnings = {}
  
  // Check archetype tension
  if (framework.archetype.primary && framework.archetype.secondary) {
    const tension = checkArchetypeTension(
      framework.archetype.primary,
      framework.archetype.secondary
    )
    if (tension) {
      warnings.archetype_tension = tension
    }
  }
  
  // Check archetype vs positioning alignment
  if (framework.archetype.primary && output.positioning) {
    const archetypeAlignments = ARCHETYPE_POSITIONING_HINTS[framework.archetype.primary]
    
    // Check if positioning contradicts archetype
    const contradictions = archetypeAlignments?.contradicts || []
    for (const term of contradictions) {
      if (output.positioning.toLowerCase().includes(term)) {
        warnings.archetype_vs_positioning = {
          issue: `Your "${framework.archetype.primary}" archetype typically doesn't emphasize "${term}"`,
          suggestion: `Consider if this creates intentional tension or if a different archetype might fit better.`
        }
        break
      }
    }
  }
  
  // Check voice vs archetype
  if (framework.archetype.primary && output.voiceRules) {
    const expectedTone = ARCHETYPE_VOICE_MAP[framework.archetype.primary]
    const actualTone = output.voiceRules.sounds_like.join(' ').toLowerCase()
    
    if (expectedTone && !hasOverlap(expectedTone, actualTone)) {
      warnings.voice_vs_archetype = {
        issue: `${framework.archetype.primary} brands typically sound "${expectedTone.join(', ')}"`,
        suggestion: `Your voice rules might not fully express your archetype. This can work if intentional.`
      }
    }
  }
  
  return warnings
}

// Input flagging (soft, informational)
export function flagInputIssues(field: string, value: string): InputFlag | null {
  // Check for jargon
  const jargonFound = BANNED_WORDS.filter(word => 
    value.toLowerCase().includes(word.toLowerCase())
  )
  
  if (jargonFound.length > 0) {
    return {
      type: 'jargon',
      severity: 'info',
      words: jargonFound,
      message: `Words like "${jargonFound[0]}" can feel corporate. We'll translate this into more human language.`
    }
  }
  
  // Check for vague language
  const vagueTerms = ['good', 'better', 'best', 'great', 'nice', 'quality', 'value']
  const vagueFound = vagueTerms.filter(term => 
    value.toLowerCase().split(' ').includes(term)
  )
  
  if (vagueFound.length > 1) {
    return {
      type: 'vague',
      severity: 'info',
      words: vagueFound,
      message: `Try to be more specific than "${vagueFound.join(', ')}". What exactly makes it good?`
    }
  }
  
  return null
}
```

---

## 13. User Flow States

```typescript
// stores/discovery.ts

export const useDiscoveryStore = defineStore('discovery', {
  state: () => ({
    // Current position in flow
    currentStep: 1,
    currentPartIndex: 0,
    
    // User's tier determines available steps
    tier: 'free' as Tier,
    
    // Answers
    inputs: {} as DiscoveryInputs,
    
    // Live preview state
    preview: {
      positioning: null as string | null,
      positioningParts: {
        targetAudience: null,
        category: null,
        differentiation: null,
        reasonToBelieve: null,
      },
      voiceRules: null as VoiceRules | null,
      colorSuggestions: [] as ColorSuggestion[],
      archetypeRecommendations: [] as ArchetypeRec[],
      personaSummary: null as string | null,
      copyAngles: [] as string[],
      brandEnergy: null as string | null,
    },
    
    // What's been unlocked
    unlocks: {
      basicPositioning: false,
      voicePreview: false,
      colorPreview: false,
      personaCard: false,
      copyAngles: false,
      antiPatterns: false,
      fullArchetypeWheel: false,
      brandEnergy: false,
      advancedPrompts: false,
    },
    
    // Archetype selection
    selectedArchetypes: {
      primary: null as ArchetypeId | null,
      secondary: null as ArchetypeId | null,
    },
    
    // Validation state
    flags: {} as QualityFlags,
    warnings: {} as ContradictionWarnings,
    
    // UI state
    isGenerating: false,
    lastGeneratedAt: null as Date | null,
    
    // Achievements earned in this session
    achievementsEarned: [] as string[],
  }),
  
  getters: {
    // Available questions based on tier
    availableQuestions(): Question[] {
      return QUESTIONS.filter(q => {
        if (this.tier === 'free') return q.part === 1
        if (this.tier === 'one') return q.part <= 4
        return true // max gets all
      })
    },
    
    // Current question
    currentQuestion(): Question | null {
      return this.availableQuestions[this.currentStep - 1] || null
    },
    
    // Completion percentage
    completionPercentage(): number {
      const answered = Object.keys(this.inputs).filter(k => this.inputs[k]?.trim()).length
      const total = this.availableQuestions.length
      return Math.round((answered / total) * 100)
    },
    
    // Can generate a usable Brand Prompt
    canGenerate(): boolean {
      // Minimum: Q1 answered
      return !!this.inputs.product_description?.trim()
    },
    
    // Full Brand Prompt text
    fullBrandPrompt(): string {
      return buildBrandPrompt(this.preview, this.selectedArchetypes, this.tier)
    },
    
    // Has actionable flags
    hasFlags(): boolean {
      return Object.keys(this.flags).length > 0
    },
    
    // Has warnings to address
    hasWarnings(): boolean {
      return Object.keys(this.warnings).length > 0
    },
  },
  
  actions: {
    // Update answer and trigger unlocks
    async setAnswer(questionId: string, value: string) {
      this.inputs[questionId] = value
      
      // Trigger unlock check
      this.checkUnlocks(questionId)
      
      // Flag input issues (soft)
      const flag = flagInputIssues(questionId, value)
      if (flag) {
        // Show inline, don't block
        this.currentInputFlag = flag
      }
      
      // Trigger live preview update (debounced in composable)
    },
    
    // Check what should unlock based on answered questions
    checkUnlocks(questionId: string) {
      const unlockMap: Record<string, keyof typeof this.unlocks> = {
        'product_description': 'basicPositioning',
        'core_moment': 'voicePreview',
        'core_moment': 'colorPreview',
        'target_persona': 'personaCard',
        'friend_description': 'copyAngles',
        'not_like': 'antiPatterns',
        'opposite': 'fullArchetypeWheel',
        'perfect_day': 'brandEnergy',
      }
      
      const unlock = unlockMap[questionId]
      if (unlock && !this.unlocks[unlock]) {
        this.unlocks[unlock] = true
        this.triggerUnlockCelebration(unlock)
      }
    },
    
    triggerUnlockCelebration(unlock: string) {
      // Emit event for UI celebration
      const celebrations: Record<string, { emoji: string, message: string }> = {
        basicPositioning: { emoji: '🎯', message: 'Positioning unlocked!' },
        voicePreview: { emoji: '🗣️', message: 'Your voice is emerging!' },
        colorPreview: { emoji: '🎨', message: 'Colors revealed!' },
        personaCard: { emoji: '👤', message: 'Persona taking shape!' },
        copyAngles: { emoji: '✍️', message: 'Copy angles ready!' },
        fullArchetypeWheel: { emoji: '🎡', message: 'Full archetypes unlocked!' },
        brandEnergy: { emoji: '⚡', message: 'Brand energy defined!' },
      }
      
      if (celebrations[unlock]) {
        useNuxtApp().$bus.emit('celebration', celebrations[unlock])
      }
    },
    
    // Dismiss a flag (user acknowledged)
    dismissFlag(key: string) {
      delete this.flags[key]
    },
    
    // Keep choice despite warning
    keepChoice(key: string) {
      delete this.warnings[key]
      // Log for analytics - user made intentional choice
    },
    
    // Navigate
    nextStep() {
      if (this.currentStep < this.availableQuestions.length) {
        this.currentStep++
      }
    },
    
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    
    goToStep(step: number) {
      if (step >= 1 && step <= this.availableQuestions.length) {
        this.currentStep = step
      }
    },
  }
})
```

---

## 14. API Routes Summary

| Endpoint | Method | Purpose | Returns |
|----------|--------|---------|---------|
| `/api/generate/enhance` | POST | Live preview enhancement | Enhanced field content |
| `/api/generate/brand-prompt` | POST | Full Brand Prompt generation | Complete outputs + flags |
| `/api/generate/archetype-recommend` | POST | Archetype suggestions | Recommendations + reasoning |
| `/api/sprint` | POST | Create new sprint | Sprint ID |
| `/api/sprint/[id]` | GET | Load sprint | Sprint data |
| `/api/sprint/[id]` | PUT | Update sprint | Updated sprint |
| `/api/sprint/[id]/fork` | POST | Fork existing sprint | New sprint ID |
| `/api/sprints` | GET | List user's sprints | Sprint array |
| `/api/waitlist` | POST | Join waitlist | Success/error |

---

## 15. Environment Variables

```bash
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Gemini API
GEMINI_API_KEY=

# Resend (email)
RESEND_API_KEY=

# App
NUXT_PUBLIC_APP_URL=
```

---

## 16. One-Week Build Plan (Updated)

| Day | Focus | Key Deliverables |
|-----|-------|------------------|
| **1** | Foundation + Live Preview | Nuxt setup, Pinia stores, split-screen layout, basic reactive preview |
| **2** | Discovery Flow | Question components, unlock system, progress tracking, celebrations |
| **3** | Gemini Integration | API routes, enhance endpoint, structured generation, validation |
| **4** | Brand Prompt Builder | Template system, full generation, copy functionality |
| **5** | Archetype System | Wheel component, recommendations, selection, tension warnings |
| **6** | Validation + Polish | Flags UI, warnings UI, input flagging, micro-interactions |
| **7** | Auth + Tiers + Deploy | Supabase auth, tier gating, waitlist, Vercel deployment |

---

## 17. Success Metrics (Updated)

**Primary**: Time to first "Copy Prompt" click (target: < 5 minutes)

**Secondary**:
- Unlock completion rate (how many unlocks do users reach?)
- Flag acknowledgment rate (do users read/address flags?)
- Return rate (do users come back to iterate?)
- Paste-to-improvement correlation (can we track Bolt usage? partnership?)

**North Star**: Users who paste, see improvement, and tell someone about it.

---

## 18. Out of Scope (v1)

- Payments/Stripe (validate first)
- Before/after visual comparison tool
- Direct Bolt/Lovable/Replit integration
- Team collaboration
- Version history beyond basic fork
- Mobile app

---

## 19. Open Questions

1. **Can we partner with Bolt/Lovable/Replit?** Direct integration would be magic. Even a "powered by dlytful" badge when they paste our prompt would be huge.

2. **Should free tier have a watermark?** "Brand prompt generated by dlytful.com" at the end. Subtle growth hack.

3. **How do we track "success"?** We can see copies. Can we see what happens after? User survey? Follow-up email?

4. **Archetype wheel interaction** - Is drag/drop better than click? Mobile implications?

---

## Appendix A: Brand Prompt Templates

### Quick Transform (dlytful zero)

```markdown
I have an existing app. Keep all current functionality exactly as is.

Apply these visual and voice changes:

## Product
{positioning_preview}

## Visual Direction
- Warm, approachable colors (avoid cold, corporate blues)
- Clean, readable typography
- Generous whitespace
- Confident but not aggressive

## Voice
- Sound like a person, not a company
- Direct and clear
- No jargon

Do not change any features or functionality. Only change how it looks and sounds.

---
Generated with dlytful.com
```

### Full Rebrand (dlytful one)

```markdown
I have an existing app. Keep all current functionality exactly as is.

Apply these brand changes:

## Product Identity
{positioning_statement}

## Target User
{persona_summary}
They would describe this as: "{friend_description}"
Their frustration before: {prior_frustration}

## Brand Energy
Primary: {archetype_primary} — {archetype_description}
Secondary: {archetype_secondary} — {archetype_description}

## Visual Identity
Colors:
- Primary: {color_1_hex} — {color_1_rationale}
- Secondary: {color_2_hex} — {color_2_rationale}
- Background: {background_hex}
- Accent: {accent_hex} — use sparingly

Typography:
- Headlines: {headline_font} — {headline_rationale}
- Body: {body_font} — {body_rationale}

Energy: {brand_energy}

## Voice Rules
Sounds like: {sounds_like}
Never sounds like: {never_like}
Never use these words: {never_words}

## What This Should NOT Look Like
{not_like_summary}

Do not change any features or functionality. Only change how it looks and sounds.
```

### Foundation (dlytful one - new builds)

```markdown
Build a new application with this brand foundation:

## Product Identity
{positioning_statement}

## Target User
{persona_summary}

## Brand Energy
Primary: {archetype_primary} — {archetype_description}
Secondary: {archetype_secondary} — {archetype_description}

## Visual Identity
Colors:
- Primary: {color_1_hex} — {color_1_rationale}
- Secondary: {color_2_hex} — {color_2_rationale}
- Background: {background_hex}
- Accent: {accent_hex}

Typography:
- Headlines: {headline_font}
- Body: {body_font}

## Voice Rules
Sounds like: {sounds_like}
Never sounds like: {never_like}
Never use: {never_words}

## Core Functionality
[User to fill in what the app should DO]

Apply the brand identity above to all visual elements, copy, and user interactions.
```

### Discoverability (dlytful max)

```markdown
Add the following metadata to my app's HTML head. Do not change any functionality or visible UI.

## Head Metadata
<meta name="description" content="{positioning_short}">
<meta name="keywords" content="{semantic_keywords}">

## Open Graph
<meta property="og:title" content="{product_name} — {hook}">
<meta property="og:description" content="{one_liner}">
<meta property="og:type" content="website">

## Schema.org
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "{product_name}",
  "description": "{positioning_short}",
  "applicationCategory": "{category}",
  "audience": {
    "@type": "Audience",
    "audienceType": "{persona_type}"
  }
}
</script>

## Discovery Attributes
<meta name="product:solves" content="{problems}">
<meta name="product:ideal-for" content="{persona_type}">
<meta name="product:differentiator" content="{differentiation}">
```

### Agent Voice (dlytful max)

```markdown
You are {product_name}'s assistant.

## Voice
You sound {sounds_like}. Direct, helpful, human.

You never use words like: {never_words}

## Personality
Your brand archetype is {archetype_primary} with {archetype_secondary} undertones.
This means you {archetype_behavioral_description}.

## Behavior
- Keep responses concise
- Match the user's energy
- Be helpful without being eager
- Sound like {sounds_like_short}

## What You Know
{product_description}

## What You Help With
{use_cases}
```

---

This PRD is the foundation. Want me to start generating the actual component code for the live preview system, or flesh out any specific section further?
