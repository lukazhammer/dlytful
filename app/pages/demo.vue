<template>
  <div class="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-black bg-background text-text">
    <main class="flex-grow flex flex-col lg:flex-row h-screen overflow-hidden">
      
      <!-- LEFT: Inputs (Scrollable) -->
      <div class="w-full lg:w-1/2 flex flex-col p-6 lg:p-12 overflow-y-auto z-10 relative border-r border-white/5 bg-background">
        
        <!-- Debug Toggle (Dev Only) -->
        <button @click="showDebug = !showDebug" class="absolute top-2 left-2 text-[10px] text-white/10 hover:text-white/50 uppercase tracking-widest font-mono z-50">
            {{ showDebug ? 'Hide Debug' : 'Debug' }}
        </button>
        
        <div v-if="showDebug && result && result.debug" class="absolute top-8 left-2 right-2 bg-black/90 text-green-400 font-mono text-[10px] p-4 rounded z-50 border border-green-900 overflow-auto max-h-64 shadow-2xl">
            <div class="grid grid-cols-2 gap-4">
                <div>
                     <strong>LLM Used:</strong> {{ result.debug.llmUsed || result.debug.model }}<br>
                     <strong>Endpoint:</strong> {{ result.debug.endpointName || 'compile' }}<br>
                     <strong>LLM OK:</strong> <span :class="result.debug.llmOk ? 'text-green-400' : 'text-red-400'">{{ result.debug.llmOk }}</span><br>
                     <strong>Fallback:</strong> {{ result.debug.fallbackReason || 'None' }}<br>
                     <strong>Attempts:</strong> {{ result.debug.llmAttempts }}<br>
                     <strong>Domain:</strong> {{ result.debug.domain }}<br>
                     <strong>Cached:</strong> {{ result.debug.cached || false }}
                     <br>
                     <span v-if="result.debug.inferredName" class="text-[10px] block mt-1 pt-1 border-t border-white/10">
                        <strong>Inferred:</strong> {{ result.debug.inferredName }}
                        <span :class="{
                            'text-green-400': result.debug.inferredConfidence === 'high',
                            'text-yellow-400': result.debug.inferredConfidence === 'medium',
                            'text-red-400': result.debug.inferredConfidence === 'low'
                        }">({{ result.debug.inferredConfidence }})</span>
                     </span>
                </div>
                <div>
                     <strong>ValidDraft:</strong> {{ result.debug.draftUsed }}<br>
                     <strong>Overrides:</strong> {{ result.debug.overrides?.join(', ') || 'None' }}<br>
                     <span :class="{'text-green-400': result.debug.inferredNameConfidence === 'high', 'text-yellow-400': result.debug.inferredNameConfidence === 'medium', 'text-red-400': result.debug.inferredNameConfidence === 'low'}">
                        <strong>Name:</strong> {{ result.debug.inferredNameConfidence }}
                     </span><br>
                     <div v-if="result.debug.positioningDebug" class="mt-2 pt-2 border-t border-white/10">
                         <strong>Pos. LLM:</strong> {{ result.debug.positioningDebug.llmUsed ? 'Yes' : 'No' }}<br>
                         <strong>Issues:</strong> {{ result.debug.positioningDebug.validationIssues?.length || 0 }}<br>
                     </div>
                </div>
            </div>
             <details class="mt-2">
                <summary class="cursor-pointer hover:text-white">Draft Raw</summary>
                <pre class="mt-1 text-white/70">{{ result.debug.finalKeyFields }}</pre>
            </details>
             <details v-if="result.debug.positioningDebug" class="mt-2">
                <summary class="cursor-pointer hover:text-white">Pos. Raw</summary>
                <div class="mt-1 flex flex-col gap-1 text-[10px]">
                    <span class="text-white/50">Model: {{ result.debug.positioningDebug.model }}</span>
                    <pre class="text-white/70 whitespace-pre-wrap">{{ result.debug.positioningDebug.rawText }}</pre>
                </div>
            </details>
        </div>

        <div class="max-w-xl mx-auto w-full space-y-10 pb-20">
            
            <!-- Header -->
            <div class="space-y-6">
                <div class="space-y-2">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/50 border border-white/5 backdrop-blur-sm">
                      <span class="w-2 h-2 rounded-full bg-accent animate-pulse"/>
                      <span class="text-xs uppercase tracking-widest text-textMuted font-bold">DLYTFUL ZERO</span>
                    </div>
                    <h1 class="text-4xl lg:text-5xl font-black tracking-tighter leading-[0.9]">
                      Instant Brand <br>
                      <span class="text-accent">manifesto.</span>
                    </h1>
                    <p class="text-lg text-textMuted font-light">
                      ChatGPT chats. Dlytful compiles a spec you can reuse.
                    </p>
                </div>

                <!-- Benefits -->
                <ul class="space-y-2 text-sm text-textMuted border-l-2 border-white/5 pl-4 py-2">
                    <li class="flex items-center gap-2">
                        <span class="text-accent">✓</span> Brand prompt for your builder
                    </li>
                    <li class="flex items-center gap-2">
                        <span class="text-accent">✓</span> Voice rules & tone profile
                    </li>
                    <li class="flex items-center gap-2">
                        <span class="text-accent">✓</span> Palette & type tokens
                    </li>
                    <li class="flex items-center gap-2">
                        <span class="text-accent">✓</span> One-liner & headlines
                    </li>
                </ul>

                <!-- Primary CTA -->
                <button 
                  @click="useExample"
                  class="group flex items-center gap-3 px-5 py-3 rounded-lg bg-surface/10 border border-white/10 hover:bg-surface/20 hover:border-accent/30 transition-all text-sm font-bold uppercase tracking-widest text-text"
                >
                    <span>Use example & compile</span>
                    <span class="text-accent group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>

            <hr class="border-white/5" />

            <!-- Input Flow -->
            <div class="space-y-8">
                
                <!-- Q1 -->
                <div class="space-y-3 transition-opacity duration-500">
                    <label class="text-xs uppercase text-textMuted tracking-widest font-bold flex justify-between">
                        1. The Product <span class="text-accent/50 text-[10px]" v-if="activeStep === 0">Starts Draft</span>
                    </label>
                    <textarea 
                        v-model="inputs.q1_core_what" 
                        @input="onInputQ1"
                        rows="2" 
                        placeholder="e.g. A deterministic brand compiler for developers."
                        class="w-full bg-surface/10 border border-white/10 rounded-lg p-5 text-lg text-text placeholder:text-textMuted/20 focus:border-accent outline-none transition-all resize-none shadow-sm focus:bg-surface/20"
                        :class="{'border-accent/50': activeStep === 0}"
                    ></textarea>
                </div>

                <!-- Product Type Dropdown -->
                <div class="space-y-3 transition-opacity duration-500">
                    <label class="text-xs uppercase text-textMuted tracking-widest font-bold flex justify-between">
                         1b. Product Type <span class="text-accent/50 text-[10px]" v-if="inputs.product_type">Refines Logic</span>
                    </label>
                    <div class="relative">
                        <select 
                            v-model="inputs.product_type"
                            @change="onInputQ1" 
                            class="w-full bg-surface/10 border border-white/10 rounded-lg p-4 pr-10 text-base text-text focus:border-accent outline-none appearance-none cursor-pointer transition-all shadow-sm focus:bg-surface/20"
                        >
                            <option value="" disabled class="bg-surface text-textMuted">Select type...</option>
                            <option value="devtools" class="bg-surface text-text">Developer Tool / API</option>
                            <option value="saas" class="bg-surface text-text">B2B SaaS</option>
                            <option value="mobile" class="bg-surface text-text">Mobile App</option>
                            <option value="consumer" class="bg-surface text-text">Consumer Product</option>
                            <option value="marketplace" class="bg-surface text-text">Marketplace</option>
                            <option value="service" class="bg-surface text-text">Agency / Service</option>
                            <option value="other" class="bg-surface text-text">Other</option>
                        </select>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-textMuted">
                            ▼
                        </div>
                    </div>
                </div>

                <!-- Q2 (Progressive) -->
                <div class="space-y-3">
                    <label class="text-xs uppercase text-textMuted tracking-widest font-bold flex justify-between">
                        <span>2. The Moment</span>
                        <span v-if="activeStep < 1" class="text-textMuted/50 text-[10px]">Unlocks Voice</span>
                        <span v-else class="text-accent/50 text-[10px]">Upgrades Draft</span>
                    </label>
                    <textarea 
                        v-model="inputs.q2_moment" 
                        @input="onInputQ2"
                        rows="4" 
                        placeholder="e.g. A founder is stuck writing copy. They paste their messy notes into Dlytful, hit compile, and suddenly they have a professional brand spec. They feel relieved."
                        class="w-full bg-surface/10 border border-white/10 rounded-lg p-5 text-base text-text placeholder:text-textMuted/20 focus:border-accent outline-none transition-all resize-none shadow-sm focus:bg-surface/20"
                        :class="{'border-accent/50': activeStep === 1}"
                    ></textarea>
                </div>

                <!-- Q3 (Progressive) -->
                 <div class="space-y-3">
                    <label class="text-xs uppercase text-textMuted tracking-widest font-bold flex justify-between">
                        <span>3. Visuals (Optional)</span>
                        <span v-if="activeStep < 2" class="text-textMuted/50 text-[10px]">Unlocks Refinement</span>
                        <span v-else class="text-accent/50 text-[10px]">Refines Look</span>
                    </label>
                     <textarea 
                        v-model="inputs.q3_url_or_desc" 
                        @input="onInputQ3"
                        rows="2" 
                        placeholder="e.g. Minimal, dark mode, linear-style, sans-serif."
                        class="w-full bg-surface/10 border border-white/10 rounded-lg p-5 text-base text-text placeholder:text-textMuted/20 focus:border-accent outline-none transition-all resize-none shadow-sm focus:bg-surface/20"
                         :class="{'border-accent/50': activeStep === 2}"
                    ></textarea>
                </div>

                <!-- Footer Actions -->
                 <div class="pt-4 flex gap-6 items-center border-t border-white/5">
                    <button @click="reset" class="text-xs text-textMuted hover:text-red-400 transition-colors uppercase tracking-widest">Reset</button>
                    <button @click="resumeLast" class="text-xs text-textMuted hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-2">
                         Resume Last
                    </button>
                    <button v-if="activeStep >= 2" @click="() => generateFull(true)" class="text-xs text-textMuted hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-2">
                        Remix Vibe
                        <span class="text-accent/50">⟳</span>
                    </button>
                 </div>
            </div>
        </div>
      </div>

      <!-- RIGHT: Preview (Sticky/Scrollable) -->
      <div class="w-full lg:w-1/2 bg-surface/5 backdrop-blur-xl relative flex flex-col h-full overflow-hidden border-l border-white/5">
        
        <!-- Status Indicator -->
        <div class="absolute top-6 right-6 z-20 flex items-center gap-3 pointer-events-none">
            <template v-if="loading">
                 <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-accent/20 text-[10px] uppercase tracking-widest text-accent backdrop-blur-md shadow-xl">
                    <span class="w-1.5 h-1.5 rounded-full bg-accent animate-spin" />
                    {{ statusLabel }}
                </div>
            </template>
            <template v-else-if="result">
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 text-[10px] uppercase tracking-widest text-textMuted backdrop-blur-md">
                    <span class="w-1.5 h-1.5 rounded-full" :class="activeStep >= 2 ? 'bg-accent' : 'bg-white/50'" />
                    {{ activeStep >= 2 ? 'Refined' : (activeStep >= 1 ? 'Upgraded' : 'Draft') }}
                </div>
            </template>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-grow overflow-y-auto p-6 lg:p-12 space-y-12 scroll-smooth">
            
            <!-- 1. Identity (Always Valid or Skeleton) -->
            <section class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div class="flex items-center gap-3 text-accent text-[10px] uppercase tracking-widest font-bold opacity-70">
                    <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    Identity {{ result ? '' : '(Pending)' }}
                </div>
                
                <div v-if="result">
                     <h2 class="text-5xl lg:text-7xl font-black text-text tracking-tighter leading-[0.9] break-words">{{ result.brandSpec.productName }}</h2>
                     <p class="text-xl text-textMuted font-light mt-4 border-l-2 border-accent/20 pl-4">{{ result.brandSpec.category }}</p>
                </div>
                <!-- Skeleton -->
                <div v-else class="space-y-4 animate-pulse">
                     <div class="h-16 lg:h-20 w-3/4 bg-white/5 rounded-lg"></div>
                     <div class="h-6 w-1/3 bg-white/5 rounded"></div>
                </div>
            </section>

            <!-- 2. Voice & Tone (Upgrades with Q2) -->
            <section class="space-y-6 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div class="flex items-center gap-3 text-accent text-[10px] uppercase tracking-widest font-bold opacity-70">
                    <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    Voice & Vibe {{ activeStep >= 1 ? '' : '(Draft)' }}
                </div>

                <div v-if="result && result.brandSpec" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <!-- Archetype (Locked) -->
                     <button @click="openLockedModal('Archetype')" class="p-5 bg-surface/10 rounded-xl border border-white/5 hover:border-accent/20 transition-all group text-left w-full relative overflow-hidden">
                         <div class="text-[10px] text-textMuted uppercase mb-2 tracking-wider flex justify-between">
                            Archetype
                            <span class="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 opacity-50">LOCKED</span>
                         </div>
                         <div class="text-xl font-bold text-text group-hover:text-accent transition-colors">{{ result.brandSpec.archetypePrimary }}</div>
                         <div class="text-xs text-textMuted mt-1 opacity-70">The main character energy</div>
                     </button>
                     
                     <!-- Palette (Locked) -->
                     <button @click="openLockedModal('Palette')" class="p-5 bg-surface/10 rounded-xl border border-white/5 hover:border-accent/20 transition-all text-left w-full group relative overflow-hidden" v-if="result.brandSpec.designTokens">
                        <div class="text-[10px] text-textMuted uppercase mb-2 tracking-wider flex justify-between">
                            Palette
                            <span class="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 opacity-50">LOCKED</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="flex -space-x-2">
                                <div class="w-8 h-8 rounded-full shadow-lg border-2 border-background" :style="{ backgroundColor: result.brandSpec.designTokens.accent }"></div>
                                <div class="w-8 h-8 rounded-full shadow-lg border-2 border-background" :style="{ backgroundColor: result.brandSpec.designTokens.base }"></div>
                                <div class="w-8 h-8 rounded-full shadow-lg border-2 border-background" :style="{ backgroundColor: result.brandSpec.designTokens.ink }"></div>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-sm font-bold text-text truncate max-w-[100px]" :style="{ fontFamily: result.brandSpec.designTokens.font }">{{ result.brandSpec.designTokens.font }}</span>
                                <span class="text-[10px] text-textMuted">Radius: {{ result.brandSpec.designTokens.radius }}rem</span>
                            </div>
                        </div>
                    </button>
                </div>

                <!-- Skeleton / Placeholder -->
                <div v-else class="grid grid-cols-2 gap-4 opacity-30">
                     <div class="h-24 bg-white/5 rounded-xl border border-white/5 dashed"></div>
                     <div class="h-24 bg-white/5 rounded-xl border border-white/5 dashed"></div>
                </div>

                 <!-- Adjectives -->
                 <div v-if="result && result.brandSpec.voice" class="space-y-2 cursor-pointer group" @click="openLockedModal('Tone')">
                    <div class="text-[10px] text-textMuted uppercase tracking-wider flex justify-between">
                        Tone
                        <span class="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 opacity-50">LOCKED</span>
                    </div>
                    <div class="flex flex-wrap gap-2 group-hover:opacity-80 transition-opacity">
                        <span v-for="t in result.brandSpec.voice.soundsLike" :key="t" class="px-3 py-1.5 rounded-md bg-white/5 text-xs text-text border border-white/5 font-medium">
                            {{ t }}
                        </span>
                    </div>
                </div>
                 <div v-else class="flex gap-2 opacity-20">
                    <div class="w-16 h-8 bg-white/10 rounded-md"></div>
                    <div class="w-20 h-8 bg-white/10 rounded-md"></div>
                    <div class="w-12 h-8 bg-white/10 rounded-md"></div>
                 </div>
            </section>

            <!-- 3. Quick Transform (Assets) -->
             <section class="relative space-y-6 pt-8 border-t border-white/5 flex-grow pb-24 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                 
                 <div class="flex items-center gap-3 text-accent text-[10px] uppercase tracking-widest font-bold opacity-70">
                    <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    Brand Prompt {{ result ? '' : '(Waiting)' }}
                </div>

                <!-- Content -->
                <div v-if="result && result.assets" class="space-y-6">
                    
                    <!-- Loading State -->
                    <div v-if="isPolishedLoading" class="flex flex-col items-center justify-center min-h-[300px] space-y-4 animate-in fade-in duration-500">
                        <LoadingSpinnerRing :size="44" />
                        <p class="text-[10px] uppercase tracking-widest text-accent/50 animate-pulse font-bold">Polishing Copy...</p>
                    </div>

                    <!-- Real Content -->
                    <div v-else class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div class="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 space-y-6 relative overflow-hidden group hover:border-accent/20 transition-colors">
                            <div class="space-y-2">
                                <div class="text-[10px] text-textMuted uppercase tracking-wider">One Liner</div>
                                <p class="text-lg md:text-xl text-text leading-relaxed font-light font-serif italic opacity-90">"{{ result.assets.oneLiner }}"</p>
                            </div>
                            <div class="h-px bg-white/5 w-full"></div>
                             <div class="space-y-2">
                                <div class="text-[10px] text-textMuted uppercase tracking-wider">Positioning Declaration</div>
                                <p class="text-sm text-textMuted leading-loose">
                                    <span v-if="result.assets.positioningParts" class="space-y-2 block">
                                         <span class="block">
                                            For <strong class="text-text">{{ result.assets.positioningParts.target }}</strong>, 
                                            <strong class="text-text">{{ result.brandSpec.productName }}</strong> is a 
                                            <strong class="text-text">{{ result.assets.positioningParts.category }}</strong> that 
                                            <strong class="text-text">{{ result.assets.positioningParts.value }}</strong>.
                                         </span>
                                         <span class="block">
                                            Unlike <span class="text-text/70 border-b border-white/10">{{ result.assets.positioningParts.alternative || 'alternatives' }}</span>, 
                                            it <strong class="text-text">{{ result.assets.positioningParts.differentiator }}</strong>.
                                         </span>
                                         <span class="block text-xs uppercase tracking-wider opacity-70 mt-4">
                                            Proof: <span class="text-text italic">{{ result.assets.positioningParts.proof }}</span>
                                         </span>
                                    </span>
                                    <span v-else>
                                        {{ result.assets.positioning }}
                                    </span>
                                </p>
                            </div>
                        </div>
                        
                        <!-- Headlines -->
                        <div class="space-y-3 pt-2">
                            <div class="text-[10px] text-textMuted uppercase tracking-wider">Headline Options</div>
                            <ul class="space-y-2">
                                 <li v-for="h in result.assets.heroHeadlines" :key="h" class="text-sm text-text flex items-start gap-2">
                                    <span class="text-accent mt-1">›</span> {{ h }}
                                 </li>
                            </ul>
                        </div>
                    </div>

                <!-- Brand Prompt Export -->
                <div v-if="result && result.brandPrompt" class="space-y-3 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                    <div class="flex items-center justify-between">
                         <div class="text-[10px] text-textMuted uppercase tracking-wider font-bold">Builder Prompt</div>
                         <div class="text-[10px] text-accent opacity-70">Use in Lovable / v0 / Replit</div>
                    </div>
                    
                    <div class="relative group">
                        <div class="absolute inset-0 bg-black/50 rounded-xl"></div>
                        <pre class="relative z-10 p-4 h-32 overflow-y-auto text-[10px] font-mono text-textMuted bg-black/40 rounded-xl border border-white/10 scrollbar-thin scrollbar-thumb-white/10">{{ result.brandPrompt.text }}</pre>
                        
                        <div class="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span class="text-[10px] bg-black/80 px-2 py-1 rounded text-white">Preview</span>
                        </div>
                    </div>

                    <button 
                        @click="copyPrompt(result.brandPrompt.text)" 
                        :disabled="isPolishedLoading"
                        class="w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(204,255,0,0.15)] flex items-center justify-center gap-2"
                        :class="promptCopied ? 'bg-green-500 text-black shadow-[0_0_30px_rgba(0,255,0,0.3)] scale-[1.02]' : (isPolishedLoading ? 'bg-surface/20 text-textMuted cursor-wait border border-white/5 shadow-none' : 'bg-accent text-black hover:brightness-110 active:scale-[0.98]')"
                    >
                         <span v-if="isPolishedLoading">Generating...</span>
                         <span v-else-if="promptCopied">Copied to Clipboard!</span>
                         <span v-else>Copy Brand Prompt</span>
                         <svg v-if="!isPolishedLoading && !promptCopied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                         <svg v-if="promptCopied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </button>
                </div>
                
                </div> <!-- End Brand Prompt Wrapper -->
                
             </section>

        </div>
      </div>

    </main>

    <!-- Locked Modal (Demo) -->
    <div v-if="lockedModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" @click.self="lockedModalOpen = false">
        <div class="w-full max-w-sm bg-surface rounded-2xl border border-white/10 p-8 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
             <div class="w-12 h-12 mx-auto rounded-full bg-accent/20 flex items-center justify-center text-accent text-xl font-bold mb-4">
                 🔒
             </div>
             <h3 class="text-2xl font-bold text-text">Unlock Full Customization</h3>
             <p class="text-textMuted text-sm leading-relaxed">
                 Manual <span class="text-white font-bold">{{ lockedFeature }}</span> selection is available in the paid plan. For this demo, we auto-assign the best matching vibe.
             </p>
             <div class="pt-4 flex gap-3 justify-center">
                 <button @click="lockedModalOpen = false" class="px-5 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-medium transition-colors text-text">Close</button>
             </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import LoadingSpinnerRing from '../../components/ui/LoadingSpinnerRing.vue';

// Debug State
const showDebug = ref(false);
const lockedModalOpen = ref(false);
const lockedFeature = ref('');

const openLockedModal = (feature) => {
    lockedFeature.value = feature;
    lockedModalOpen.value = true;
};

const promptCopied = ref(false);
const copyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    promptCopied.value = true;
    setTimeout(() => promptCopied.value = false, 2000);
};

// State
const inputs = ref({
    q1_core_what: '',
    q1_product_type: '', // for backward compat/consistency or just product_type? Template used inputs.product_type
    product_type: '', 
    q2_moment: '',
    q3_url_or_desc: ''
});

const result = ref(null);
const loading = ref(false);
const isPolishedLoading = ref(false); // New state for Section 3
const statusLabel = ref('Processing...');

// Computed Step
const activeStep = computed(() => {
    if (inputs.value.q2_moment.trim().length > 2) return 2; // Moment exists -> Step 2 (Upgrade)
    return 0; // Start
});

// -- VIBE CONSTANTS --
const ARCHETYPES = [
    'The Innocent', 'The Sage', 'The Explorer', 'The Outlaw', 'The Magician', 'The Hero',
    'The Lover', 'The Jester', 'The Caregiver', 'The Ruler', 'The Creator', 'The Everyman'
];
const TONE_OPTIONS = [
    'sage', 'creator', 'jester', 'professional', 'empathetic', 'bold', 'minimal', 'witty'
];
// Simplified Palette list (Just IDs or basic objects to pick from? Backend has full data. 
// We'll just pick an ID or index. Random seed in backend handled this before.
// Requirement: "state.paletteId". Let's use a simple ID if backend supports it, or just random index.
// Actually backend `demo.post.ts` used `CURATED_PALETTES`. Let's just send `palette_idx` or `palette_seed`?
// User asked for "paletteId". I will assume backend can handle an index or ID.
// I'll pick a random number 0-100 as palette_id/seed for now, or just let backend handle palette if strictly not required to be full ID.
// Wait, User said "state.paletteId". I will use a string ID 'p1'...'p5'.
const PALETTE_IDS = ['p1', 'p2', 'p3', 'p4', 'p5']; // Mock IDs, backend will map or ignore if not implemented yet. 
// Actually, backend `demo.post.ts` picks from `CURATED_PALETTES`. 
// I will let backend continue to pick Palette RANDOMLY if I don't send explicit one, OR I send a seed.
// Requirement B: "palette_sig = palette_id string".
// I'll define `paletteId` as a random string hash for now to ensure cache uniqueness.
// And `demo.post.ts` can use it to seed the palette picker.

const vibeState = ref({
    toneIds: [],
    archetype: '',
    paletteId: ''
});

const randomizeVibe = () => {
    // Pick Archetype
    vibeState.value.archetype = ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)];
    
    // Pick 3 unique Tones
    const shuffled = [...TONE_OPTIONS].sort(() => 0.5 - Math.random());
    vibeState.value.toneIds = shuffled.slice(0, 3).sort(); // Sort for stability in display/cache if needed
    
    // Pick Palette ID (Random Seed)
    vibeState.value.paletteId = Math.random().toString(36).substring(7);
};

// -- API ACTIONS --

// 1. Deterministic Baseline (Fast)
const compileBaseline = async () => {
    if (!inputs.value.q1_core_what) return;
    
    // If we are already displaying a Demo result, do not overwrite with baseline
    if (result.value?.debug?.demo) return;
    
    // Only set loading if we don't have a result yet to avoid flicker
    if (!result.value) {
        loading.value = true;
        statusLabel.value = 'Drafting...';
    }

    try {
        const res = await $fetch('/api/compile', {
            method: 'POST',
            body: { 
                q1_core_what: inputs.value.q1_core_what,
                product_type: inputs.value.product_type || 'other',
                // Dummies to satisfy schema, but won't be displayed if they are bad
                q2_audience_who: 'Customers', 
                q7_competitors_differentiation: 'Generic' 
            }
        });
        
        // If we already have a "rich" result (with real LLM audience/tokens), preserve them?
        // Actually, if user types in Q1, they are changing Identity. 
        // We should update Identity fields but maybe keep the "Soft" fields if they exist?
        // Simpler: Just update the Identity parts if result exists.
        
        if (result.value && result.value.brandSpec) {
             result.value.brandSpec.productName = res.brandSpec.productName;
             result.value.brandSpec.category = res.brandSpec.category;
             // Update One-liner derived from new name? Yes.
             if (activeStep.value < 2) {
                 result.value.assets = res.assets; // Reset assets to baseline if we haven't unlocked Q2 yet
             }
        } else {
            result.value = res;
        }
    } catch (e) {
        console.error(e);
    } finally {
        if (activeStep.value < 2) loading.value = false;
    }
}

// 2. Full LLM Upgrade (Demo Mode Aware)
const generateFull = async (isRemix = false) => {
    if (activeStep.value < 2) return;
    
    loading.value = true;
    isPolishedLoading.value = true; // START LOADING FOR SECTION 3
    statusLabel.value = isRemix ? 'Remixing...' : (inputs.value.q3_url_or_desc ? 'Refining...' : 'Upgrading...');
    
    // If Remix or First Run (and no vibe set), randomize
    if (isRemix || !vibeState.value.archetype) {
        randomizeVibe();
    }
    
    // Clear Assets to prevent flash of old content
    if (result.value) {
        result.value.assets = {
            oneLiner: null,
            heroHeadlines: null,
            positioning: null
        };
    }

    try {
        const payload = { 
            q1_core_what: inputs.value.q1_core_what,
            product_type: inputs.value.product_type || 'other',
            q2_moment: inputs.value.q2_moment,
            q3_url_or_desc: inputs.value.q3_url_or_desc,
            remix: isRemix,
            remix_nonce: crypto.randomUUID(),
            knownProductName: result.value?.brandSpec?.productName,
            // Vibe State
            tone_ids: vibeState.value.toneIds,
            archetype: vibeState.value.archetype,
            palette_id: vibeState.value.paletteId
        };

        const res = await $fetch('/api/generate/demo', {
            method: 'POST',
            body: payload,
            headers: { 'Cache-Control': 'no-store' }
        });
        
        // Map Response to State compatible with Template
        // res shape: { identity, vibe, oneLiner, debug }
        
        const mappedResult = {
            brandSpec: {
                productName: res.identity.productName,
                category: res.identity.category,
                // These are needed by template
                archetypePrimary: res.vibe.archetype,
                audience: "Users", // Fallback/Dummy for template
                outcome: res.identity.outcome || "achieve goal",
                proof: res.identity.proof || "",
                designTokens: {
                    accent: res.vibe.palette.accent,
                    base: res.vibe.palette.base,
                    ink: res.vibe.palette.ink,
                    font: res.vibe.palette.font,
                    radius: res.vibe.palette.radius
                },
                voice: {
                    soundsLike: res.vibe.toneTags,
                    neverLike: [],
                    neverWords: []
                }
            },
            assets: {
                oneLiner: res.oneLiner, 
                heroHeadlines: res.headlines, 
                positioning: res.positioning 
            },
            markdown: res.brandPromptMarkdown, // Binding for Copy Button
            brandPrompt: res.brandPrompt,      // Legacy object
            debug: {
                ...res.debug,
                demo: true // Ensure baseline guard still works
            }, 
            assignment: {
                 // For compatibility if needed, but we used it for prevAssignment logic which is now obsolete
                designTokens: res.vibe.palette // For CSS vars
            }
        };

        // Explicitly map positioningParts if present for the robust display
        if (res.copy && res.copy.positioningParts) {
             mappedResult.assets.positioningParts = res.copy.positioningParts;
        }

        // Merge strategy: Replace result entirely
        result.value = mappedResult;
        
        // Apply CSS Variables relative to document root for global theme
        if (mappedResult.brandSpec.designTokens) {
            const root = document.documentElement;
            const t = mappedResult.brandSpec.designTokens;
            root.style.setProperty('--accent', t.accent);
            root.style.setProperty('--base', t.base);
            root.style.setProperty('--ink', t.ink);
            root.style.setProperty('--radius', `${t.radius}rem`);
            root.style.setProperty('--font', t.font);
        }

        // NO SECONDARY CALL: Positioning is now fully integrated in /api/generate/demo
        // This ensures Tone Consistency and prevents content flashing.

    } catch (e) {
        console.error(e);
        // Toast?
    } finally {
        loading.value = false;
        isPolishedLoading.value = false; // END LOADING
    }
}

// -- DEBOUNCED INPUT HANDLERS --

const onInputQ1 = useDebounceFn(() => {
    compileBaseline();
}, 500);

const onInputQ2 = useDebounceFn(() => {
    if (activeStep.value >= 2) generateFull(false);
}, 1500);

const onInputQ3 = useDebounceFn(() => {
    if (activeStep.value >= 2) generateFull(false);
}, 1500);


// -- USER ACTIONS --

const route = useRoute();

onMounted(() => {
    if (route.query.example) {
        // slight delay to ensure hydration
        setTimeout(() => useExample(), 500);
    }
});

const useExample = () => {
    inputs.value = {
        q1_core_what: "Dlytful is a deterministic brand compiler that turns messy notes into production-ready brand specs.",
        product_type: "devtools",
        q2_moment: "A founder is staring at a blank page, overwhelmed by 'brand strategy'. They paste their raw thoughts into Dlytful, hit compile, and instantly get a reusable brand system they can hand to their designers and AI tools. They feel clarity and relief.",
        q3_url_or_desc: "Minimal, dark mode, high contrast, clean typography, neon accents."
    };
    // Trigger compilation sequence
    loading.value = true;
    statusLabel.value = 'Compiling...';
    // Cascading calls to simulate progression
    setTimeout(() => compileBaseline(), 100);
    setTimeout(() => generateFull(false), 1200);
}

const reset = () => {
    inputs.value = { q1_core_what: '', product_type: '', q2_moment: '', q3_url_or_desc: '' };
    result.value = null;
    isPolishedLoading.value = false;
}

const resumeLast = async () => {
    loading.value = true;
    statusLabel.value = 'Resuming...';
    try {
        const { found, sprint } = await $fetch('/api/sprints/latest');
        if (found && sprint) {
            const saved = sprint.inputs || {};
            // Map saved inputs correctly 
            inputs.value = {
                q1_core_what: saved.q1 || saved.q1_core_what || '',
                product_type: saved.product_type || 'other',
                q2_moment: saved.q2 || saved.q2_moment || '',
                q3_url_or_desc: saved.q3 || saved.q3_url_or_desc || ''
            };
            if (sprint.unlocks) {
                 result.value = {
                    brandSpec: sprint.unlocks.brandSpec || sprint.unlocks, 
                    assets: sprint.unlocks.assets,
                    specHash: sprint.spec_hash,
                    markdown: sprint.brand_prompt
                };
            } else {
                await generateFull(false);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
}

const copy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
}
</script>
