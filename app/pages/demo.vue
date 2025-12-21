<template>
  <div class="min-h-screen flex flex-col font-sans selection:bg-[#C08A2B] selection:text-black bg-[#0B0F1A] text-[#E9ECF3] isolate">
    <main class="flex-grow flex flex-col lg:flex-row h-screen overflow-hidden">
      
      <!-- LEFT: Inputs (Scrollable) -->
      <div class="w-full lg:w-1/2 flex flex-col p-6 lg:p-12 overflow-y-auto z-10 relative border-r border-[#7FA6D6]/10 bg-[#0B0F1A]">
        
        <!-- Debug Toggle (Dev Only) -->
        <button class="absolute top-2 left-2 text-[10px] text-[#7FA6D6]/20 hover:text-[#7FA6D6] uppercase tracking-widest font-mono z-50" @click="showDebug = !showDebug">
            {{ showDebug ? 'Hide Debug' : 'Debug' }}
        </button>
        
        <div v-if="showDebug && result" class="absolute top-8 left-2 right-2 bg-[#0B0F1A]/95 text-green-400 font-mono text-[10px] p-4 rounded z-50 border border-green-900 overflow-auto max-h-64 shadow-2xl">
           <pre>{{ result.debug }}</pre>
        </div>

        <div class="max-w-xl mx-auto w-full space-y-10 pb-20">
            
            <!-- Header -->
            <div class="space-y-6">
                <div class="space-y-2">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121624] border border-[#7FA6D6]/10 backdrop-blur-sm">
                      <span class="w-2 h-2 rounded-full bg-[#C08A2B] animate-pulse"/>
                      <span class="text-xs uppercase tracking-widest text-[#7FA6D6] font-bold">dlytful</span>
                    </div>
                    <div class="space-y-1">
                        <h1 class="text-4xl lg:text-5xl font-black tracking-tighter leading-[0.9] text-[#E9ECF3]">
                          Build your <br>
                          <span class="text-[#C08A2B]">brand system.</span>
                        </h1>
                    </div>
                    <p class="text-lg text-[#7FA6D6] font-light">
                      Answer a few questions. See the change immediately in your AI builder.
                    </p>
                </div>

                <!-- Example Action -->
            <!-- Example Action -->
            <div class="flex items-center gap-2">
                 <div class="relative group">
                    <button class="flex items-center gap-3 px-5 py-3 rounded-lg bg-[#121624] border border-[#7FA6D6]/20 hover:border-[#C08A2B]/40 transition-all text-sm font-bold uppercase tracking-widest text-[#E9ECF3]">
                        <span>Examples</span>
                        <span class="text-[#7FA6D6] group-hover:text-[#C08A2B] transition-colors">▼</span>
                    </button>
                    <!-- Dropdown -->
                    <div class="absolute left-0 top-full mt-2 w-64 max-h-96 overflow-y-auto bg-[#0B0F1A] border border-[#7FA6D6]/20 rounded-lg shadow-xl z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                        <div class="p-2 space-y-1">
                            <button v-for="ex in EXAMPLES" :key="ex.title" class="w-full text-left px-3 py-2 rounded text-xs text-[#7FA6D6] hover:bg-[#121624] hover:text-[#E9ECF3] transition-colors" @click="loadExample(ex)">
                                <span class="block font-bold">{{ ex.title }}</span>
                                <span class="text-[10px] opacity-70 uppercase">{{ ex.type }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <button class="px-3 py-3 rounded-lg border border-[#7FA6D6]/10 hover:border-[#7FA6D6]/30 hover:bg-[#121624] transition-all text-[#7FA6D6] hover:text-[#E9ECF3] text-xs font-bold uppercase tracking-widest" title="Random Example" @click="loadRandomExample">
                    Random
                </button>
            </div>
            </div>

            <hr class="border-[#7FA6D6]/10" >

            <!-- Input Flow -->
            <div class="space-y-8">
                
                <!-- Q1 -->
                <div class="space-y-3 transition-opacity duration-500">
                    <label class="text-xs uppercase text-[#7FA6D6] tracking-widest font-bold flex justify-between">
                        1. What are you building? <span v-if="activeStep === 0" class="text-[#C08A2B]/50 text-[10px]">Required</span>
                    </label>
                    <textarea 
                        v-model="inputs.q1_core_what" 
                        rows="2"
                        placeholder="Describe the product in plain language. Not marketing copy." 
                        class="w-full bg-[#121624] border border-[#7FA6D6]/10 rounded-lg p-5 text-lg text-[#E9ECF3] placeholder:text-[#7FA6D6]/30 focus:border-[#C08A2B] outline-none transition-all resize-none shadow-sm focus:bg-[#1A1F30] font-mono text-sm"
                        :class="{'border-[#C08A2B]/50': activeStep === 0}"
                        @input="onInputQ1"
                    />
                </div>

                <!-- Product Type Dropdown -->
                <div class="space-y-3 transition-opacity duration-500">
                    <label class="text-xs uppercase text-[#7FA6D6] tracking-widest font-bold flex justify-between">
                         1b. Product category
                    </label>
                    <div class="relative">
                        <select 
                            v-model="inputs.product_type"
                            class="w-full bg-[#121624] border border-[#7FA6D6]/10 rounded-lg p-4 pr-10 text-base text-[#E9ECF3] focus:border-[#C08A2B] outline-none appearance-none cursor-pointer transition-all shadow-sm focus:bg-[#1A1F30] font-mono text-sm" 
                            @change="onInputQ1"
                        >
                            <option value="" disabled class="bg-[#0B0F1A] text-[#7FA6D6]">Select type...</option>
                            <option value="devtools" class="bg-[#0B0F1A] text-[#E9ECF3]">Developer Tool / API</option>
                            <option value="saas" class="bg-[#0B0F1A] text-[#E9ECF3]">B2B SaaS</option>
                            <option value="mobile" class="bg-[#0B0F1A] text-[#E9ECF3]">Mobile App</option>
                            <option value="consumer" class="bg-[#0B0F1A] text-[#E9ECF3]">Consumer Product</option>
                            <option value="marketplace" class="bg-[#0B0F1A] text-[#E9ECF3]">Marketplace</option>
                            <option value="service" class="bg-[#0B0F1A] text-[#E9ECF3]">Agency / Service</option>
                            <option value="other" class="bg-[#0B0F1A] text-[#E9ECF3]">Other</option>
                        </select>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7FA6D6]">
                            ▼
                        </div>
                    </div>
                </div>

                <!-- Q2 (Progressive) -->
                <div class="space-y-3">
                    <label class="text-xs uppercase text-[#7FA6D6] tracking-widest font-bold flex justify-between">
                        <span>2. Why does it exist?</span>
                        <span v-if="activeStep === 1" class="text-[#C08A2B]/50 text-[10px] animate-pulse">Next Step</span>
                    </label>
                    <textarea 
                        v-model="inputs.q2_moment" 
                        rows="4"
                        placeholder="What problem does it solve, or what frustration does it remove?" 
                        class="w-full bg-[#121624] border border-[#7FA6D6]/10 rounded-lg p-5 text-base text-[#E9ECF3] placeholder:text-[#7FA6D6]/30 focus:border-[#C08A2B] outline-none transition-all resize-none shadow-sm focus:bg-[#1A1F30] font-mono text-sm"
                        :class="{'border-[#C08A2B]/50': activeStep === 1}"
                        @input="onInputQ2"
                    />
                </div>

                <!-- Q3 (Progressive) -->
                 <div class="space-y-3">
                    <label class="text-xs uppercase text-[#7FA6D6] tracking-widest font-bold flex justify-between">
                        <span>3. How should it feel?</span>
                        <span v-if="activeStep === 2" class="text-[#C08A2B]/50 text-[10px] animate-pulse">Optional</span>
                    </label>
                     <textarea 
                        v-model="inputs.q3_url_or_desc" 
                        rows="2"
                        placeholder="Tone, vibe, references, or things you want to avoid." 
                        class="w-full bg-[#121624] border border-[#7FA6D6]/10 rounded-lg p-5 text-base text-[#E9ECF3] placeholder:text-[#7FA6D6]/30 focus:border-[#C08A2B] outline-none transition-all resize-none shadow-sm focus:bg-[#1A1F30] font-mono text-sm"
                        :class="{'border-[#C08A2B]/50': activeStep === 2}"
                         @input="onInputQ3"
                    />
                </div>

                <!-- Footer Actions -->
                 <div class="pt-6 flex flex-col gap-4 border-t border-[#7FA6D6]/10">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                            <button class="w-full py-3 px-4 rounded-lg bg-[#C08A2B] text-[#0B0F1A] font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all" @click="() => generateFull(false)">
                                Shape brand
                            </button>
                            <div class="text-[9px] text-center text-[#7FA6D6]/30 uppercase tracking-widest">Deterministic</div>
                        </div>
                        
                        <div v-if="activeStep >= 2" class="flex flex-col gap-2">
                            <button class="w-full py-3 px-4 rounded-lg bg-[#121624] border border-[#7FA6D6]/20 text-[#7FA6D6] font-bold uppercase tracking-widest text-xs hover:text-[#C08A2B] hover:border-[#C08A2B]/40 transition-all flex items-center justify-center gap-2" @click="() => generateFull(true)">
                                Remix expression
                                <span class="text-[#C08A2B]/50">⟳</span>
                            </button>
                            <div class="text-[9px] text-center text-[#C08A2B]/50 uppercase tracking-widest">Variation allowed</div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center text-[10px] text-[#7FA6D6]/50">
                        <span>Remix adjusts expression, not identity.</span>
                        <button class="hover:text-red-400 transition-colors uppercase tracking-widest" @click="reset">Reset</button>
                    </div>
                    <!-- Remix Advice -->
                    <div v-if="activeStep >= 2" class="text-[10px] text-[#7FA6D6]/40 text-center italic">
                        Remix changes tone expression only. If inputs are sparse, results may look similar.
                    </div>
                 </div>

                <!-- Recognition Timeline (Locked) -->
                 <div class="space-y-4 pt-8 border-t border-[#7FA6D6]/10">
                    <div class="text-[10px] uppercase tracking-widest text-[#7FA6D6] font-bold">Recognition Timeline</div>
                    <div class="relative pl-2 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-[#7FA6D6]/20">
                        <div class="relative flex items-center gap-3">
                            <div class="w-1.5 h-1.5 rounded-full bg-[#C08A2B] relative z-10 ring-4 ring-[#0B0F1A]"/>
                            <div class="text-xs text-[#E9ECF3]">Raw inputs</div>
                        </div>
                        <div class="relative flex items-center gap-3">
                            <div class="w-1.5 h-1.5 rounded-full bg-[#C08A2B] relative z-10 ring-4 ring-[#0B0F1A]"/>
                            <div class="text-xs text-[#E9ECF3]">Recognition layer</div>
                        </div>
                        <div class="relative flex items-center gap-3 opacity-50 group cursor-pointer hover:opacity-100 transition-opacity" @click="openModal('recognition')">
                            <div class="w-1.5 h-1.5 rounded-full bg-[#7FA6D6] relative z-10 ring-4 ring-[#0B0F1A]"/>
                            <div class="flex items-center gap-2 text-xs text-[#7FA6D6] group-hover:text-[#C08A2B] transition-colors">
                                <span>Anchors</span>
                                <LockIcon class="w-3 h-3" />
                            </div>
                        </div>
                        <div class="relative flex items-center gap-3 opacity-50">
                            <div class="w-1.5 h-1.5 rounded-full bg-[#7FA6D6] relative z-10 ring-4 ring-[#0B0F1A]"/>
                            <div class="flex items-center gap-2 text-xs text-[#7FA6D6]">
                                <span>Expression</span>
                                <LockIcon class="w-3 h-3" />
                            </div>
                        </div>
                        <div class="relative flex items-center gap-3 opacity-50">
                            <div class="w-1.5 h-1.5 rounded-full bg-[#7FA6D6] relative z-10 ring-4 ring-[#0B0F1A]"/>
                            <div class="flex items-center gap-2 text-xs text-[#7FA6D6]">
                                <span>Consistency</span>
                                <LockIcon class="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <!-- RIGHT: Preview (Sticky/Scrollable) -->
      <div class="w-full lg:w-1/2 bg-[#0B0F1A] relative flex flex-col h-full overflow-hidden border-l border-[#7FA6D6]/10">
        
        <!-- Status Indicator -->
        <div class="absolute top-6 right-6 z-20 flex items-center gap-3 pointer-events-none">
            <template v-if="loading">
                 <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121624] border border-[#C08A2B]/20 text-[10px] uppercase tracking-widest text-[#C08A2B] backdrop-blur-md shadow-xl">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#C08A2B] animate-spin" />
                    {{ statusLabel }}
                </div>
            </template>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-grow overflow-y-auto p-6 lg:p-12 space-y-12 scroll-smooth">
            
            <!-- 1. Recognition Layer Summary -->
            <section class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div class="flex items-center gap-3 text-[#C08A2B] text-[10px] uppercase tracking-widest font-bold opacity-70">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#C08A2B]"/>
                    Recognition Layer Summary {{ result ? '' : '(Pending)' }}
                </div>
                
                <div v-if="result" class="p-4 bg-[#121624] rounded-xl border border-[#7FA6D6]/10 font-mono text-sm space-y-2">
                     <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                        <span class="text-[#7FA6D6] text-xs uppercase tracking-wide">Name</span>
                        <span class="text-[#E9ECF3]">{{ valOr(result.identity.productName) }}</span>
                     </div>
                     <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                        <span class="text-[#7FA6D6] text-xs uppercase tracking-wide">Category</span>
                        <span class="text-[#E9ECF3]">{{ valOr(result.identity.category) }}</span>
                     </div>
                     <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                        <span class="text-[#7FA6D6] text-xs uppercase tracking-wide">Audience</span>
                        <span class="text-[#E9ECF3]">{{ valOr(result.copy.positioningParts.target) }}</span>
                     </div>
                     <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                        <span class="text-[#7FA6D6] text-xs uppercase tracking-wide">Primary behavior</span>
                        <span class="text-[#E9ECF3]">{{ valOr(result.identity.outcome) }}</span>
                     </div>
                     <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                        <span class="text-[#7FA6D6] text-xs uppercase tracking-wide">Deterministic fingerprint</span>
                        <span class="text-[#E9ECF3] font-mono text-[10px] break-all">{{ result.inputHash }}</span>
                     </div>
                </div>

                <div v-else class="h-32 w-full bg-[#121624] rounded-lg border border-[#7FA6D6]/10 dashed animate-pulse opacity-30"/>
            </section>

            <!-- 2. Product Definition -->
            <section v-if="result" class="space-y-4 pt-6 border-t border-[#7FA6D6]/10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div class="flex items-center gap-3 text-[#C08A2B] text-[10px] uppercase tracking-widest font-bold opacity-70">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#C08A2B]"/>
                    Product Definition
                </div>

                <div class="p-4 bg-[#121624] rounded-xl border border-[#7FA6D6]/10 font-mono text-xs space-y-3">
                     <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                        <span class="text-[#7FA6D6] uppercase tracking-wide">Problem</span>
                        <span class="text-[#E9ECF3] leading-relaxed">{{ valOr(result.copy.positioningParts.alternative) }}</span>
                     </div>
                     <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                        <span class="text-[#7FA6D6] uppercase tracking-wide">Core behavior</span>
                        <span class="text-[#E9ECF3] leading-relaxed">{{ valOr(result.copy.positioningParts.value) }}</span>
                     </div>
                     <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                        <span class="text-[#7FA6D6] uppercase tracking-wide">Mechanism</span>
                        <span class="text-[#E9ECF3] opacity-50">Not specified</span>
                     </div>
                     <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                        <span class="text-[#7FA6D6] uppercase tracking-wide">Non goals</span>
                        <span class="text-[#E9ECF3] opacity-50">Not specified</span>
                     </div>
                     <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                        <span class="text-[#7FA6D6] uppercase tracking-wide">Constraints</span>
                        <span class="text-[#E9ECF3] opacity-50">Not specified</span>
                     </div>
                </div>
            </section>

             <!-- 3. Recognition Constraints -->
            <section v-if="result" class="space-y-4 pt-6 border-t border-[#7FA6D6]/10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                 <div class="flex items-center gap-3 text-[#C08A2B] text-[10px] uppercase tracking-widest font-bold opacity-70">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#C08A2B]"/>
                    Recognition Constraints
                </div>

                <div class="relative group overflow-hidden rounded-xl">
                    <div class="p-4 bg-[#121624] border border-[#7FA6D6]/10 font-mono text-xs space-y-3 filter blur-[1px] opacity-70">
                         <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                            <span class="text-[#7FA6D6] uppercase tracking-wide">Must preserve</span>
                            <span class="text-[#E9ECF3]">{{ valOr(result.vibe.archetype) }}</span>
                         </div>
                         <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                            <span class="text-[#7FA6D6] uppercase tracking-wide">Must avoid</span>
                            <span class="text-[#E9ECF3]">{{ (result.constraints.banned_terms || []).slice(0, 5).join(', ') }}{{ result.constraints.banned_terms?.length > 5 ? '...' : '' }}</span>
                         </div>
                          <div class="grid grid-cols-[140px_1fr] gap-2 items-baseline">
                            <span class="text-[#7FA6D6] uppercase tracking-wide">Allowed variation</span>
                            <span class="text-[#E9ECF3]">{{ (result.vibe.toneTags || []).join(', ') || 'Not specified' }}</span>
                         </div>
                    </div>
                    
                    <!-- ANCHOR OVERLAY -->
                    <AnchorOverlay
                        title="These constraints are inferred."
                        description="Unlock to edit what must be preserved, define what must never appear, and lock constraints across all outputs."
                        cta="Anchor constraints"
                        @click="openModal('constraints')"
                    />
                </div>
            </section>

             <!-- 4. Open Questions -->
             <section v-if="openQuestions.length > 0" class="space-y-4 pt-6 border-t border-[#7FA6D6]/10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div class="flex items-center gap-3 text-yellow-500 text-[10px] uppercase tracking-widest font-bold opacity-90">
                    <span class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"/>
                    Open Questions
                </div>
                <div class="relative overflow-hidden rounded-lg">
                    <div class="bg-yellow-500/10 border border-yellow-500/20 p-4 space-y-2 filter blur-[1px] opacity-80">
                        <div v-for="q in openQuestions" :key="q.label" class="flex justify-between items-start text-sm">
                            <span class="text-yellow-200">{{ q.label }}?</span>
                        </div>
                    </div>
                    <AnchorOverlay
                        title="This data shapes your product."
                        description="Unlock to answer them once, turn answers into constraints, and remove ambiguity from future outputs."
                        cta="Anchor recognition"
                        @click="openModal('questions')"
                    />
                </div>
             </section>

             <!-- 5. Optional Derived Copy -->
             <section v-if="result" class="space-y-6 pt-12 border-t border-[#7FA6D6]/10 animate-in fade-in slide-in-from-bottom duration-700 opacity-100 transition-opacity">
                 <div class="space-y-1">
                    <div class="flex items-center gap-3 text-[#7FA6D6] text-[10px] uppercase tracking-widest font-bold">
                        Optional derived copy
                    </div>
                    <p class="text-[10px] text-[#7FA6D6]/50 italic">
                        This section may vary on remix.
                    </p>
                 </div>

                 <!-- Archetype Card -->
                 <div class="col-span-1 md:col-span-2 relative group overflow-visible rounded-lg"> <!-- Removed styling from container, handled by inner/overlay -->
                       <!-- Blurred Content Layer -->
                       <div class="p-4 bg-[#121624] rounded-lg border border-[#7FA6D6]/10 space-y-3 filter blur-[1px] opacity-80 transition-all duration-300">
                            <div class="flex items-center gap-2">
                                <div class="text-[10px] text-[#7FA6D6] uppercase tracking-wider font-bold">Brand archetype</div>
                            </div>
                            <div class="flex flex-col gap-1">
                                    <div class="text-xl font-bold text-[#E9ECF3]">{{ result.vibe.archetype }}</div>
                                    <p class="text-[10px] text-[#7FA6D6] leading-tight opacity-70">
                                    This guides tone, language, and UI decisions.
                                </p>
                            </div>

                            <!-- Why this archetype -->
                            <div class="mt-4 pt-3 border-t border-[#7FA6D6]/10 space-y-3">
                                <!-- Score -->
                                <div class="flex items-center justify-between text-[10px]">
                                    <span class="text-[#7FA6D6]/60 uppercase tracking-widest">Confidence Score</span>
                                    <span class="font-mono text-[#C08A2B] font-bold">{{ result.vibe.score }}</span>
                                </div>
                                <!-- Content truncated effectively by blur -->
                            </div>
                     </div>

                     <!-- ANCHOR OVERLAY -->
                     <AnchorOverlay
                        title="This archetype is inferred."
                        description="Unlock to manually select an archetype, blend multiple archetypes, and prevent drift across remixes."
                        cta="Unlock archetype anchor"
                        @click="openModal('archetype')"
                     />
                 </div>

                 <!-- Drift Preview -->
                 <div class="p-4 bg-[#0B0F1A] border border-[#7FA6D6]/20 rounded-lg space-y-3 cursor-pointer hover:border-[#C08A2B]/40 transition-colors group" @click="openModal('drift')">
                     <div class="flex items-center justify-between">
                         <span class="text-[10px] text-[#C08A2B] font-bold uppercase tracking-widest">Why anchors matter</span>
                     </div>
                     <div class="grid grid-cols-2 gap-4">
                         <div class="space-y-1 opacity-50">
                             <div class="text-[9px] text-[#7FA6D6] uppercase">Unanchored Input</div>
                             <div class="text-[10px] text-[#E9ECF3] font-mono leading-tight">"A tool for focus."</div>
                         </div>
                         <div class="space-y-1">
                             <div class="text-[9px] text-[#C08A2B] uppercase flex items-center gap-1 group-hover:text-[#C08A2B] transition-colors">Anchored <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                             <div class="text-[10px] text-[#E9ECF3] font-mono leading-tight">"Helps users maintain deep focus via time-blocking."</div>
                         </div>
                     </div>
                     <div class="pt-2 text-[10px] text-[#7FA6D6]/60 italic border-t border-[#7FA6D6]/10 group-hover:text-[#7FA6D6] transition-colors">
                         With anchors, recognition does not drift.
                     </div>
                 </div>

                 <!-- Copiable Prompt -->
                <div v-if="result.brandPrompt" class="space-y-3">
                    <div class="relative group">
                        <div class="absolute inset-0 bg-[#0B0F1A]/80 rounded-xl"/>
                        <pre class="relative z-10 p-4 h-48 overflow-y-auto text-[10px] font-mono text-[#7FA6D6] bg-[#0B0F1A]/60 rounded-xl border border-[#7FA6D6]/10 scrollbar-thin scrollbar-thumb-[#7FA6D6]/20 select-all">{{ result.brandPrompt.text }}</pre>
                    </div>
                     <button 
                        :disabled="isPolishedLoading" 
                        class="w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs border border-[#7FA6D6]/20 hover:border-[#C08A2B]/50 hover:text-[#C08A2B] transition-all flex items-center justify-center gap-2"
                        @click="copyPrompt(result.brandPrompt.text)"
                    >
                         <span v-if="isPolishedLoading">Shaping brand system...</span>
                         <span v-else-if="promptCopied">Copied!</span>
                         <span v-else>Copy full system</span>
                     </button>
                </div>

                <!-- Recognition Time Card -->
                <div class="p-5 bg-gradient-to-br from-[#121624] to-[#0B0F1A] border border-[#7FA6D6]/10 rounded-xl flex items-center justify-between gap-4 cursor-pointer hover:border-[#7FA6D6]/30 transition-all group" @click="openModal('continuity')">
                    <div class="space-y-1">
                         <div class="text-xs font-bold text-[#E9ECF3]">Recognition over time</div>
                         <p class="text-[10px] text-[#7FA6D6] max-w-[200px] leading-relaxed">
                            Six months from now, when you add new pages or campaigns, your recognition stays anchored.
                         </p>
                    </div>
                    <button class="px-3 py-2 bg-[#121624] hover:bg-[#1A1F30] border border-[#7FA6D6]/20 rounded text-[10px] font-bold text-[#C08A2B] uppercase tracking-widest transition-colors group-hover:bg-[#C08A2B]/10">
                        See how continuity works
                    </button>
                </div>
             </section>

             <!-- 6. AI Context Block (New) -->
             <section v-if="result" class="space-y-4 pt-12 pb-24 border-t border-[#7FA6D6]/10 animate-in fade-in slide-in-from-bottom duration-700">
                  <div class="flex items-center gap-3 text-[#C08A2B] text-[10px] uppercase tracking-widest font-bold opacity-70">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#C08A2B]"/>
                    AI Context Block
                </div>
                <div class="relative group">
                    <pre class="p-4 bg-[#0B0F1A] border border-[#7FA6D6]/20 rounded-lg text-[10px] text-[#7FA6D6] font-mono whitespace-pre-wrap leading-relaxed select-all">{{ aiContextBlock }}</pre>
                    <button 
                        class="absolute top-2 right-2 p-2 rounded bg-[#121624] text-[#7FA6D6] hover:text-[#E9ECF3] border border-[#7FA6D6]/10 text-[10px] uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="copyPrompt(aiContextBlock)"
                    >
                        Copy
                    </button>
                </div>
             </section>

        </div>
      </div>
    </main>
    
    <!-- Modals -->
    <client-only>
        <AnchorModal 
            :is-open="!!activeModalId"
            :content="activeModalContent"
            @close="closeModal"
            @primary="closeModal"
        />
    </client-only>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import AnchorOverlay from '~/components/demo/AnchorOverlay.vue';
import AnchorModal from '~/components/demo/AnchorModal.vue';
import { LockIcon } from 'lucide-vue-next';

// Modal State
const activeModalId = ref(null);
const activeModalContent = computed(() => activeModalId.value ? ANCHOR_MODALS[activeModalId.value] : null);

const openModal = (id) => {
    activeModalId.value = id;
};

const closeModal = () => {
    activeModalId.value = null;
};

const ANCHOR_MODALS = {
    recognition: {
        title: 'Anchor your recognition',
        body: [
            'Right now, your product’s recognition is inferred from what you typed in this session.',
            'That works for exploration.\nIt does not last.',
            'When you anchor recognition, dlytful treats your product’s identity as fixed input, not a suggestion.',
            'This means:\n• The same inputs always produce the same interpretation\n• New outputs inherit the same identity\n• Recognition does not drift over time or remix',
            'Without an anchor, recognition resets.'
        ],
        unlocking: [
            'Locks your product’s core identity',
            'Preserves meaning across sessions',
            'Turns inference into a stable reference point'
        ],
        primaryCta: 'Anchor recognition',
        secondaryCta: 'Keep exploring without anchoring'
    },
    archetype: {
        title: 'Anchor your archetype',
        body: [
            'Your archetype is currently inferred from language patterns and emotional cues.',
            'That inference is accurate.\nBut it is not authoritative.',
            'When you anchor your archetype, you decide how your product should be recognized, not just how it happens to read.',
            'With an archetype anchor, you can:\n• Manually select your primary archetype\n• Blend multiple archetypes with intent\n• Prevent archetype drift across remixes and future inputs',
            'Without an anchor, archetype may shift as wording changes.'
        ],
        unlocking: [
            'Gives you direct control over identity signals',
            'Stabilizes tone, language, and design decisions',
            'Ensures consistency across all expressions'
        ],
        primaryCta: 'Anchor archetype',
        secondaryCta: 'Leave inferred for now'
    },
    constraints: {
        title: 'Anchor your constraints',
        body: [
            'These constraints are currently inferred from your inputs.',
            'They are sensible defaults.\nThey are not boundaries.',
            'When you anchor constraints, you tell dlytful exactly what must always be preserved and what must never appear, no matter the context.',
            'With constraint anchors, you can:\n• Edit what must be preserved\n• Define what must be avoided\n• Apply constraints across all future outputs',
            'Without anchors, constraints may soften or disappear as context changes.'
        ],
        unlocking: [
            'Turns preferences into rules',
            'Eliminates unwanted language and tone',
            'Protects your product from subtle drift'
        ],
        primaryCta: 'Anchor constraints',
        secondaryCta: 'View inferred constraints only'
    },
    questions: {
        title: 'Resolve open questions',
        body: [
            'These questions represent ambiguity in how your product is recognized.',
            'Right now, dlytful keeps them visible so you can see where meaning is still undefined.',
            'When you answer and anchor these questions, dlytful stops guessing.',
            'Answering these questions allows you to:\n• Define your core value explicitly\n• Clarify differentiation and alternatives\n• Turn uncertainty into recognition rules',
            'Until then, these areas remain intentionally open.'
        ],
        unlocking: [
            'Lets you answer each question once',
            'Converts answers into recognition constraints',
            'Removes ambiguity from future outputs'
        ],
        primaryCta: 'Anchor recognition clarity',
        secondaryCta: 'Leave questions open'
    },
    drift: {
        title: 'Why anchors matter',
        body: [
            'Without anchors, small wording changes can shift how your product is interpreted.',
            'That shift is subtle.\nBut over time, it compounds.',
            'Anchors prevent this by treating identity as fixed input, not something to reinterpret each time.',
            'With anchors:\n• Recognition stays consistent\n• Expression can vary safely\n• Your product remains recognizable'
        ],
        unlocking: [],
        primaryCta: 'See anchors in action',
        secondaryCta: 'Close'
    },
    continuity: {
        title: 'Recognition over time',
        body: [
            'Six months from now, when you add new pages or campaigns, your recognition stays anchored.',
            'This ensures that as your product grows, your brand system remains the single source of truth.',
            'No matter how many times you remix or generate new assets, the core identity will not drift.'
        ],
        unlocking: [
            'Keeps your brand system as the source of truth',
            'Prevents drift over months of usage',
            'Ensures long-term consistency'
        ],
        primaryCta: 'Anchor your brand',
        secondaryCta: 'Close'
    }
};

// Debug State
const showDebug = ref(false);

const promptCopied = ref(false);
const copyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    promptCopied.value = true;
    setTimeout(() => promptCopied.value = false, 2000);
};

// State
const inputs = ref({
    q1_core_what: '',
    product_type: '', 
    q2_moment: '',
    q3_url_or_desc: ''
});

const result = ref(null);
const loading = ref(false);
const isPolishedLoading = ref(false); 
const statusLabel = ref('Processing...');

// Computed Step
const activeStep = computed(() => {
    if (inputs.value.q3_url_or_desc.trim().length > 0) return 3;
    if (inputs.value.q2_moment.trim().length > 0) return 2;
    if (inputs.value.q1_core_what.trim().length > 0) return 1;
    return 0;
});

const FIELD_LABELS = {
    target: 'Target Audience',
    product: 'Product Name',
    category: 'Category',
    value: 'Core Value',
    alternative: 'Alternative',
    differentiator: 'Differentiation',
    proof: 'Proof Point'
};


const EXAMPLES = [
    { title: "Patchwork", q1: "A tiny product site builder for indie apps.", q2: "Founders ship fast but their landing pages look templated. They want a distinct look without design skills.", q3: "Simple, crisp, confident. Swiss grid. Warm accent.", type: "saas" },
    { title: "LogLens", q1: "A log viewer that turns noisy traces into readable incidents.", q2: "On-call engineers waste time digging through raw logs and missing the real cause.", q3: "Terminal feel, calm urgency, minimal UI.", type: "devtools" },
    { title: "ShipKit", q1: "A release checklist tool that lives in GitHub issues.", q2: "Teams forget steps and ship broken releases. They want consistency without process overhead.", q3: "Strict, reliable, no fluff.", type: "devtools" },
    { title: "MintRun", q1: "A budgeting app for people who hate budgeting.", q2: "Users fall off because tracking feels like punishment and guilt.", q3: "Gentle, supportive, soft colors, short sentences.", type: "mobile" },
    { title: "StrideNote", q1: "A walking habit app that turns walks into small story chapters.", q2: "People know walking helps but they get bored and stop after a week.", q3: "Playful, light, cozy, illustrated vibe.", type: "mobile" },
    { title: "MealMap", q1: "A recipe organizer that generates shopping lists by pantry.", q2: "Home cooks lose recipes across screenshots, tabs, and notes. Grocery trips become chaotic.", q3: "Warm, homey, handwritten feel without being messy.", type: "consumer" },
    { title: "GardenGauge", q1: "A garden planner that tracks watering, sunlight, and harvest dates.", q2: "New gardeners kill plants because they cannot remember schedules and conditions.", q3: "Natural, earthy, calm, quiet confidence.", type: "consumer" },
    { title: "FocusNest", q1: "A focus timer for people who spiral when they procrastinate.", q2: "Users feel anxious and shame when they fall behind. They want structure without pressure.", q3: "Reassuring, soft, safe, minimal.", type: "mobile" },
    { title: "TutorTrail", q1: "A study planner that turns topics into short daily drills.", q2: "Students cram, forget, and lose motivation. They need a steady routine.", q3: "Clear, encouraging, structured.", type: "consumer" },
    { title: "ClipForge", q1: "A video clipper that auto-finds highlights for short content.", q2: "Creators spend hours searching footage and miss posting windows.", q3: "Bold, punchy, kinetic.", type: "saas" },
    { title: "PetPulse", q1: "A pet care tracker for feeding, meds, and vet visits.", q2: "Households forget schedules and duplicate tasks. Pets suffer quietly.", q3: "Friendly, trustworthy, warm.", type: "mobile" },
    { title: "TripThread", q1: "A trip planner that turns bookings into a clean itinerary.", q2: "Travel plans live in emails and screenshots. People miss details and feel stressed.", q3: "Calm, organized, premium but not flashy.", type: "consumer" },
    { title: "ChordRoom", q1: "A practice app that turns riffs into bite-sized loops.", q2: "Guitarists practice randomly and plateau. They want progress without theory overload.", q3: "Cool, playful, slightly rebellious.", type: "mobile" },
    { title: "QueueKind", q1: "A waitlist and booking tool for small barbers and salons.", q2: "No-shows and chaotic scheduling hurt revenue and reputation.", q3: "Professional, modern, friendly.", type: "saas" },
    { title: "InvoiceSprout", q1: "An invoicing tool for freelancers who want it done in one minute.", q2: "Invoices pile up. People avoid billing because it feels tedious and awkward.", q3: "Direct, clean, confident.", type: "saas" },
    { title: "ReadRidge", q1: "A reading tracker that nudges you with tiny, specific prompts.", q2: "People buy books and never finish them. They want momentum.", q3: "Quiet, literate, minimal.", type: "mobile" },
    { title: "CrewBoard", q1: "A small community hub for niche hobby groups.", q2: "Groups are scattered across chats. Knowledge gets lost and newcomers feel excluded.", q3: "Welcoming, simple, human.", type: "saas" },
    { title: "BugBard", q1: "A bug report widget that turns complaints into reproducible steps.", q2: "Users send vague issues. Developers cannot reproduce them.", q3: "Dry, precise, slightly witty.", type: "devtools" },
    { title: "SleepSignal", q1: "A sleep journal that links patterns to simple changes.", q2: "People try random advice and give up. They want clear cause and effect.", q3: "Calm, scientific, reassuring.", type: "mobile" },
    { title: "CleanSlate", q1: "A cleaning routine app that assigns tiny tasks daily.", q2: "Homes slowly get messy, then cleaning becomes a weekend disaster.", q3: "Light, optimistic, non-judgmental.", type: "mobile" }
];


const openQuestions = computed(() => {
    if (!result.value?.copy?.positioningParts) return [];
    const parts = result.value.copy.positioningParts;
    return Object.entries(parts)
        .filter(([_k, v]) => !v || v.toLowerCase().includes('not specified'))
        .map(([k, v]) => ({
            label: FIELD_LABELS[k] || k, // Map to human readable
            key: k,
            value: v
        }));
});

const valOr = (v, fallback = 'Not specified') => {
    if (!v || (typeof v === 'string' && v.trim() === '')) return fallback;
    if (typeof v === 'string' && v.toLowerCase().includes('not specified')) return fallback;
    return v;
}

const aiContextBlock = computed(() => {
    if (!result.value) return '';
    
    // Helper to get text
    const r = result.value;
    const ident = r.identity || {};
    const parts = r.copy?.positioningParts || {};
    const constr = r.constraints || {};
    
    // Constraints formatting
    const banned = constr.must_avoid || [];
    const bannedDisplay = banned.slice(0, 5).join(', ');
    const bannedMore = banned.length > 5 ? ` (+${banned.length - 5} more)` : '';

    return `RECOGNITION LAYER SUMMARY
Name: ${valOr(ident.productName)}
Category: ${valOr(ident.category)}
Audience: ${valOr(ident.audience)}
Primary behavior: ${valOr(ident.behavior)}
Deterministic fingerprint: ${r.inputHash || 'pending'}

PRODUCT DEFINITION
Problem: ${valOr(parts.alternative)}
Core behavior: ${valOr(ident.outcome)}
Mechanism: ${valOr(parts.differentiator)}
Non goals: Not specified
Constraints: Not specified

RECOGNITION CONSTRAINTS
Must preserve: ${constr.must_preserve ? constr.must_preserve.join(', ') : 'None'}
Must avoid: ${bannedDisplay}${bannedMore}
Tone rails: ${r.vibe?.toneTags ? r.vibe.toneTags.join(', ') : 'Not specified'}
Archetype seed: ${r.vibe?.archetype || 'Not specified'}`;
});


// -- API ACTIONS --

// 1. Deterministic Baseline (Fast)
const compileBaseline = async () => {
    if (!inputs.value.q1_core_what) return;
    if (result.value?.debug?.demo) return;
    
    if (!result.value) {
        loading.value = true;
        statusLabel.value = 'Shaping Draft...';
    }

    try {
        const res = await $fetch('/api/compile', {
            method: 'POST',
            body: { 
                q1_core_what: inputs.value.q1_core_what,
                product_type: inputs.value.product_type || 'other',
                q2_audience_who: 'Users', 
                q7_competitors_differentiation: 'Generic' 
            }
        });
        
        // Only update minimal structure if we are in early draft
         if (result.value && result.value.brandSpec) {
             result.value.brandSpec.productName = res.brandSpec.productName;
             result.value.brandSpec.category = res.brandSpec.category;
        } else {
            // Map legacy compile response to new demo structure locally for skeleton?
            // Actually, let's just wait for full gen.
        }
    } catch (e) {
        console.error(e);
    } finally {
        if (activeStep.value < 2) loading.value = false;
    }
}

// 2. Full Compiler Run
const generateFull = async (isRemix = false) => {
    // Only run if we have enough context (Step 2+ or explicit remix)
    if (activeStep.value < 2 && !isRemix) return;
    
    loading.value = true;
    isPolishedLoading.value = true;
    statusLabel.value = 'Shaping brand system...';
    
    try {
        const payload = { 
            q1_core_what: inputs.value.q1_core_what,
            product_type: inputs.value.product_type || 'other',
            q2_moment: inputs.value.q2_moment,
            q3_url_or_desc: inputs.value.q3_url_or_desc,
            remix: isRemix,
            remix_nonce: isRemix ? crypto.randomUUID() : undefined
        };

        const res = await $fetch('/api/generate/demo', {
            method: 'POST',
            body: payload,
            headers: { 'Cache-Control': 'no-store' }
        });
        
        result.value = res;
        
        // No custom palette override for strict landing-page-match mode

    } catch (e) {
        console.error(e);
        statusLabel.value = 'Error Shaping Brand';
    } finally {
        loading.value = false;
        isPolishedLoading.value = false;
    }
}

// -- DEBOUNCED INPUT HANDLERS --
const onInputQ1 = useDebounceFn(() => {
    compileBaseline();
}, 500);

const onInputQ2 = useDebounceFn(() => {
    // Trigger compilation when entering Step 2 behavior
    if (activeStep.value >= 2) generateFull(false);
}, 1500);

const onInputQ3 = useDebounceFn(() => {
    // Optional re-compile for visual signal
    if (activeStep.value >= 3) generateFull(false);
}, 1500);


// -- USER ACTIONS --





const reset = () => {
    inputs.value = { q1_core_what: '', product_type: '', q2_moment: '', q3_url_or_desc: '' };
    result.value = null;
    isPolishedLoading.value = false;
}

const loadExample = (ex) => {
    inputs.value = {
        q1_core_what: ex.q1,
        product_type: ex.type || 'other',
        q2_moment: ex.q2,
        q3_url_or_desc: ex.q3
    };
    loading.value = true;
    statusLabel.value = 'Loading Example...';
    setTimeout(() => generateFull(false), 500);
}

const loadRandomExample = () => {
    const random = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
    loadExample(random);
}

</script>
