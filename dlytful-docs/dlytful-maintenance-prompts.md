# Dlytful Maintenance & Debugging Prompts

A comprehensive guide for auditing, debugging, refactoring, and maintaining code quality throughout the dlytful development lifecycle.

---

## How to Use This Document

### When to Run Audits

| Interval | Audit Type |
|----------|------------|
| Every commit | Quick lint + type check |
| Daily | Component audit, console.log cleanup |
| Every feature | DRY check, dead code removal |
| Weekly | Full codebase audit, dependency check |
| Before deploy | Security audit, performance audit, accessibility audit |
| Monthly | Architecture review, technical debt assessment |

### Prompt Format

Each section contains:
1. **When to use** — Trigger conditions
2. **The prompt** — Copy-paste into your AI assistant
3. **What to look for** — Expected findings
4. **Common fixes** — Solutions for typical issues
5. **Verification** — How to confirm the fix worked

---

## Table of Contents

1. [Quick Health Check](#1-quick-health-check)
2. [Bug Detection & Debugging](#2-bug-detection--debugging)
3. [DRY Audit (Don't Repeat Yourself)](#3-dry-audit-dont-repeat-yourself)
4. [Dead Code Removal](#4-dead-code-removal)
5. [Type Safety Audit](#5-type-safety-audit)
6. [Component Architecture Audit](#6-component-architecture-audit)
7. [State Management Audit](#7-state-management-audit)
8. [API & Data Flow Audit](#8-api--data-flow-audit)
9. [Performance Audit](#9-performance-audit)
10. [Security Audit](#10-security-audit)
11. [Accessibility Audit](#11-accessibility-audit)
12. [Error Handling Audit](#12-error-handling-audit)
13. [Console & Debug Cleanup](#13-console--debug-cleanup)
14. [Dependency Audit](#14-dependency-audit)
15. [Test Coverage Audit](#15-test-coverage-audit)
16. [Documentation Audit](#16-documentation-audit)
17. [Pre-Deploy Checklist](#17-pre-deploy-checklist)
18. [Post-Incident Review](#18-post-incident-review)
19. [Technical Debt Tracker](#19-technical-debt-tracker)
20. [Refactoring Workflows](#20-refactoring-workflows)

---

## 1. Quick Health Check

### When to Use
- Start of each coding session
- Before committing code
- After pulling changes

### The Prompt

```
Run a quick health check on the dlytful codebase:

1. Check for TypeScript errors: `npx nuxi typecheck`
2. Check for linting errors: `npm run lint`
3. Check for unused imports in recently changed files
4. Verify all environment variables are set
5. Confirm Supabase connection works
6. Confirm Gemini API responds

Report any issues found with severity (critical/warning/info).
```

### Quick Commands

```bash
# TypeScript check
npx nuxi typecheck

# Lint check
npm run lint

# Check for unused exports
npx ts-prune

# Verify env vars
node -e "console.log(Object.keys(process.env).filter(k => k.startsWith('NUXT') || k.startsWith('SUPABASE') || k.startsWith('GEMINI')))"
```

### What to Look For
- TypeScript errors (critical)
- ESLint errors (critical) vs warnings (address later)
- Missing environment variables
- Failed API connections

---

## 2. Bug Detection & Debugging

### When to Use
- User reports unexpected behavior
- Console shows errors
- Feature doesn't work as expected
- Tests fail

### The Prompt: General Bug Hunt

```
I'm experiencing a bug in dlytful. Help me debug:

**Observed behavior:** [What's happening]
**Expected behavior:** [What should happen]
**Steps to reproduce:** [How to trigger]
**Relevant file(s):** [File paths]

Please:
1. Identify potential root causes
2. Add strategic console.logs to trace data flow
3. Check for common issues:
   - Null/undefined access
   - Async timing issues
   - State not updating
   - Props not passed correctly
   - Reactive dependencies missing
4. Suggest fixes with explanation
```

### The Prompt: Nuxt/Vue Specific

```
Debug this Vue/Nuxt issue:

**Component:** [component name]
**Issue:** [description]

Check for:
1. Reactivity issues (ref vs reactive, missing .value)
2. Lifecycle timing (onMounted vs setup)
3. Computed dependency tracking
4. Watch not triggering
5. Props validation and defaults
6. Emit typing and handling
7. Composable state sharing issues
8. SSR vs client-side hydration mismatches

Show me the problematic code and the fix.
```

### The Prompt: State Management Bug

```
Debug this Pinia state issue in dlytful:

**Store:** [store name]
**Action/Getter:** [name]
**Issue:** [description]

Check for:
1. State mutations outside actions
2. Getters not recomputing
3. Actions not awaited properly
4. Store not properly initialized
5. Circular dependencies between stores
6. Persistence issues (if using pinia-plugin-persistedstate)

Trace the data flow and identify where it breaks.
```

### The Prompt: API/Network Bug

```
Debug this API issue:

**Endpoint:** [route]
**Request:** [method, body]
**Response:** [what's returned vs expected]

Check for:
1. Request payload format (JSON structure)
2. Authentication headers
3. CORS issues
4. Rate limiting
5. Error response handling
6. Network timeout
7. Supabase RLS policies blocking access
8. Gemini API error responses

Provide the fix and verification steps.
```

### Debugging Utilities to Add

```typescript
// utils/debug.ts
export const debug = {
  // Trace function calls
  trace: (name: string, fn: Function) => {
    return (...args: any[]) => {
      console.group(`🔍 ${name}`);
      console.log('Args:', args);
      const result = fn(...args);
      console.log('Result:', result);
      console.groupEnd();
      return result;
    };
  },
  
  // Log state changes
  watchState: (name: string, state: any) => {
    if (process.dev) {
      watch(state, (newVal, oldVal) => {
        console.log(`📊 ${name} changed:`, { old: oldVal, new: newVal });
      }, { deep: true });
    }
  },
  
  // Performance timing
  time: async (name: string, fn: () => Promise<any>) => {
    const start = performance.now();
    const result = await fn();
    console.log(`⏱️ ${name}: ${(performance.now() - start).toFixed(2)}ms`);
    return result;
  }
};
```

---

## 3. DRY Audit (Don't Repeat Yourself)

### When to Use
- After completing a feature
- When you notice copy-pasted code
- Weekly codebase review
- Before major refactoring

### The Prompt: Full DRY Audit

```
Perform a DRY (Don't Repeat Yourself) audit on the dlytful codebase:

Scan for:

1. **Duplicate Logic**
   - Similar functions across files
   - Repeated validation patterns
   - Duplicate API call structures
   - Repeated error handling

2. **Duplicate Components**
   - Similar UI patterns that should be abstracted
   - Repeated form field structures
   - Duplicate modal/dialog patterns
   - Similar card/list layouts

3. **Duplicate Styles**
   - Repeated Tailwind class combinations
   - Similar component styling patterns
   - Inline styles that should be extracted

4. **Duplicate Constants**
   - Magic numbers
   - Repeated strings
   - Duplicate type definitions
   - Repeated configuration

5. **Duplicate API Patterns**
   - Similar fetch/error handling
   - Repeated request structures
   - Duplicate response processing

For each finding:
- Show the duplicated code locations
- Suggest extraction/abstraction approach
- Provide refactored code
- Estimate effort (low/medium/high)
```

### The Prompt: Specific File DRY Check

```
Check this file for DRY violations:

[paste file content]

Identify:
1. Functions that could be extracted to utils
2. Repeated code blocks
3. Magic strings/numbers to extract as constants
4. Patterns that should become composables
5. Logic that belongs in a store

Provide refactored version.
```

### Common DRY Extractions for Dlytful

```typescript
// ❌ Before: Repeated validation
if (!inputs.product_description || inputs.product_description.length < 10) {
  errors.push('Product description too short');
}
if (!inputs.core_moment || inputs.core_moment.length < 10) {
  errors.push('Core moment too short');
}

// ✅ After: Extracted validation
const validateMinLength = (value: string | undefined, field: string, min: number) => {
  if (!value || value.length < min) {
    return `${field} must be at least ${min} characters`;
  }
  return null;
};

// ❌ Before: Repeated API calls
const response1 = await $fetch('/api/generate/enhance', {
  method: 'POST',
  body: { field: 'positioning', value },
  headers: { 'Content-Type': 'application/json' }
}).catch(handleApiError);

// ✅ After: Extracted API utility
const api = useApi();
const response = await api.post('/generate/enhance', { field: 'positioning', value });

// ❌ Before: Repeated unlock checks
if (userStore.tier === 'free' && step > 3) { /* block */ }
if (userStore.tier === 'free' && feature === 'archetype') { /* block */ }

// ✅ After: Extracted tier utility
const { canAccess, requiresTier } = useTier();
if (!canAccess('step', step)) { /* block */ }
```

### DRY Checklist

- [ ] No function is duplicated across files
- [ ] No component code is copy-pasted
- [ ] All magic numbers are constants
- [ ] All repeated strings are constants
- [ ] Validation logic is centralized
- [ ] API calls use shared utility
- [ ] Error handling is consistent
- [ ] Type definitions are not duplicated

---

## 4. Dead Code Removal

### When to Use
- After removing a feature
- After refactoring
- Weekly cleanup
- Before major releases

### The Prompt

```
Scan the dlytful codebase for dead code:

1. **Unused Exports**
   - Functions exported but never imported
   - Components never used
   - Types/interfaces never referenced
   - Constants never used

2. **Unused Variables**
   - Declared but never read
   - Parameters never used
   - Destructured but unused

3. **Unreachable Code**
   - Code after return/throw
   - Conditions that are always true/false
   - Dead branches in conditionals

4. **Commented Code**
   - Large blocks of commented code
   - TODO comments for removed features
   - Debug code left in

5. **Orphaned Files**
   - Files not imported anywhere
   - Test files for removed components
   - Stale migration files

6. **Unused Dependencies**
   - npm packages installed but not imported
   - Dev dependencies not used in scripts

For each finding, recommend: DELETE, REVIEW, or KEEP (with reason).
```

### Commands for Dead Code Detection

```bash
# Find unused exports
npx ts-prune

# Find unused dependencies
npx depcheck

# Find unused files (requires manual review)
find . -name "*.vue" -o -name "*.ts" | xargs grep -L "import\|from" 

# ESLint unused vars (if configured)
npm run lint -- --rule 'no-unused-vars: error'
```

### The Prompt: Specific Dead Code Check

```
Check these files for dead code:

[list files or paste content]

Flag:
1. Unused imports
2. Unused functions
3. Unused variables
4. Commented code blocks (> 3 lines)
5. Console.log statements
6. TODO/FIXME comments

Provide cleaned version with deletions noted.
```

---

## 5. Type Safety Audit

### When to Use
- After adding new features
- When experiencing runtime type errors
- Before major releases
- When integrating new APIs

### The Prompt

```
Perform a TypeScript type safety audit on dlytful:

Check for:

1. **`any` Usage**
   - Explicit `any` types
   - Implicit `any` from missing types
   - `any` in function parameters
   - `any` in return types

2. **Type Assertions**
   - Unsafe `as` casts
   - Non-null assertions `!` without validation
   - Type predicates without proper checks

3. **Optional Chaining Gaps**
   - Accessing potentially undefined without `?.`
   - Missing null checks before operations

4. **Generic Type Issues**
   - Untyped generics defaulting to unknown
   - Over-broad generic constraints

5. **API Response Types**
   - Untyped API responses
   - Missing error type handling
   - Assumed response shapes

6. **Event Handler Types**
   - Untyped event parameters
   - Missing emit type definitions

7. **Pinia Store Types**
   - State types incomplete
   - Action return types missing
   - Getter types not inferred correctly

For each issue:
- Show the problematic code
- Explain the risk
- Provide the typed solution
```

### Type Safety Patterns for Dlytful

```typescript
// ❌ Unsafe
const data = response as GeneratedOutputs;

// ✅ Safe with validation
function isGeneratedOutputs(data: unknown): data is GeneratedOutputs {
  return (
    typeof data === 'object' &&
    data !== null &&
    'positioning' in data &&
    'voice_rules' in data
  );
}

const data = response;
if (!isGeneratedOutputs(data)) {
  throw new Error('Invalid response format');
}

// ❌ Unsafe API call
const result = await $fetch('/api/generate');

// ✅ Typed API call
interface GenerateResponse {
  outputs: GeneratedOutputs;
  flags: QualityFlags;
}

const result = await $fetch<GenerateResponse>('/api/generate');

// ❌ Unsafe event handler
const handleClick = (e) => { ... }

// ✅ Typed event handler
const handleClick = (e: MouseEvent) => { ... }

// ❌ Unsafe optional access
const name = user.profile.name;

// ✅ Safe optional access
const name = user?.profile?.name ?? 'Anonymous';
```

### Type Checking Commands

```bash
# Full type check
npx nuxi typecheck

# Strict mode check (add to tsconfig.json)
# "strict": true,
# "noImplicitAny": true,
# "strictNullChecks": true

# Find all 'any' usage
grep -r ": any" --include="*.ts" --include="*.vue" .
grep -r "as any" --include="*.ts" --include="*.vue" .
```

---

## 6. Component Architecture Audit

### When to Use
- After building multiple components
- When components become complex (>200 lines)
- When prop drilling becomes painful
- Weekly architecture review

### The Prompt

```
Audit the Vue component architecture in dlytful:

**Single Responsibility Check:**
- Does each component do ONE thing?
- Are there components trying to do too much?
- Should any component be split?

**Props Analysis:**
- Are props well-typed?
- Are there too many props (>7)?
- Is there prop drilling (>2 levels)?
- Are defaults sensible?

**Emit Analysis:**
- Are emits properly typed?
- Are event names consistent (kebab-case)?
- Are there missing emit declarations?

**Composable Usage:**
- Is logic properly extracted to composables?
- Are composables focused (single concern)?
- Is there composable state that should be in Pinia?

**Component Size:**
- Components >200 lines need review
- Template >100 lines needs splitting
- Script >150 lines needs extraction

**Slot Usage:**
- Are slots used for customization points?
- Are named slots well-documented?
- Should any hard-coded content become a slot?

For each finding, provide:
- Current structure
- Recommended structure
- Refactored code
```

### Component Checklist

```
For each component, verify:

[ ] Name is PascalCase and descriptive
[ ] Props are typed with interface
[ ] Props have sensible defaults
[ ] Emits are declared and typed
[ ] Template is <100 lines
[ ] Script is <150 lines
[ ] No business logic in template
[ ] Computed used instead of methods for derived state
[ ] Watchers have clear purpose
[ ] No direct DOM manipulation
[ ] Accessibility attributes present
[ ] Loading and error states handled
```

### The Prompt: Single Component Review

```
Review this Vue component for architecture issues:

[paste component]

Check:
1. Does it follow single responsibility?
2. Are props/emits properly typed?
3. Should any logic be extracted to composable?
4. Is the template clean and readable?
5. Are there performance issues (unnecessary re-renders)?
6. Is state management appropriate (local vs store)?

Provide improved version with explanations.
```

---

## 7. State Management Audit

### When to Use
- When state bugs appear
- After adding new stores
- When performance degrades
- When state becomes hard to track

### The Prompt

```
Audit Pinia state management in dlytful:

**Store Structure:**
- Is state shape well-defined and typed?
- Are there circular dependencies between stores?
- Is state normalized (no deep nesting)?

**Actions:**
- Are async actions handling errors?
- Are actions atomic or doing too much?
- Is there action duplication across stores?

**Getters:**
- Are expensive computations cached in getters?
- Are getter dependencies correct?
- Are there getters that should be actions?

**Reactivity:**
- Is reactive state being mutated correctly?
- Are there stale closures capturing old state?
- Is $patch used for batch updates?

**Persistence:**
- Is persisted state secure (no tokens in localStorage)?
- Are there hydration issues on SSR?
- Is persistence selective (not storing too much)?

**Store Boundaries:**
- Is each store focused on one domain?
- Should any store be split?
- Is there state that belongs in component local state?

For the dlytful stores specifically:
- `user` store: auth state, tier
- `sprint` store: current sprint, inputs, outputs, flags
- `ui` store: toasts, modals, loading states

Identify issues and provide fixes.
```

### State Management Patterns

```typescript
// ❌ Anti-pattern: Mutating state directly
state.user.name = 'New Name';

// ✅ Pattern: Use actions
actions: {
  updateUserName(name: string) {
    this.user.name = name;
  }
}

// ❌ Anti-pattern: Storing derived state
state: {
  items: [],
  filteredItems: [], // This is derived!
}

// ✅ Pattern: Use getters for derived state
getters: {
  filteredItems: (state) => state.items.filter(i => i.active)
}

// ❌ Anti-pattern: Large state object
state: {
  user: { profile: { settings: { preferences: { ... } } } }
}

// ✅ Pattern: Normalized state
state: {
  userId: '123',
}
// with separate stores for profile, settings, preferences

// ❌ Anti-pattern: Not handling async errors
actions: {
  async fetchData() {
    const data = await api.get('/data');
    this.data = data;
  }
}

// ✅ Pattern: Proper async error handling
actions: {
  async fetchData() {
    this.loading = true;
    this.error = null;
    try {
      this.data = await api.get('/data');
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      this.loading = false;
    }
  }
}
```

---

## 8. API & Data Flow Audit

### When to Use
- After adding new API routes
- When data isn't flowing correctly
- Before security review
- When debugging request/response issues

### The Prompt

```
Audit the API layer and data flow in dlytful:

**Server Routes (/server/api/):**
- Are all routes authenticated where needed?
- Is input validation present?
- Are responses typed?
- Is error handling consistent?
- Are there N+1 query issues with Supabase?

**Client API Calls:**
- Is there a centralized API utility?
- Are all calls using the utility?
- Is error handling consistent?
- Are loading states managed?
- Is there request deduplication?

**Data Transformation:**
- Is data transformed at the right layer?
- Are there unnecessary transformations?
- Is the shape consistent between API and frontend?

**Caching:**
- Are appropriate requests cached?
- Is cache invalidation handled?
- Are there stale data issues?

**Gemini API Specific:**
- Is the API key secure (server-side only)?
- Are requests rate-limited?
- Is response validation present?
- Are errors from Gemini handled gracefully?

**Supabase Specific:**
- Are RLS policies correct?
- Are there missing indexes?
- Is data being fetched efficiently?
- Are real-time subscriptions cleaned up?

Trace the data flow for:
1. User answers question → Preview updates
2. User generates brand prompt → AI responds
3. User saves sprint → Database persists

Identify bottlenecks and issues.
```

### API Patterns for Dlytful

```typescript
// Server route pattern
// /server/api/sprint/generate.post.ts

export default defineEventHandler(async (event) => {
  // 1. Auth check
  const user = await requireAuth(event);
  
  // 2. Input validation
  const body = await readBody(event);
  const { sprint_id } = validateInput(body, {
    sprint_id: z.string().uuid()
  });
  
  // 3. Authorization (user owns this sprint?)
  const sprint = await getSprint(sprint_id);
  if (sprint.user_id !== user.id) {
    throw createError({ statusCode: 403, message: 'Forbidden' });
  }
  
  // 4. Business logic
  const outputs = await generateBrandPrompt(sprint);
  
  // 5. Typed response
  return {
    success: true,
    outputs
  } satisfies GenerateResponse;
});

// Client utility pattern
// composables/useApi.ts

export const useApi = () => {
  const handleError = (error: any) => {
    const uiStore = useUIStore();
    
    if (error.statusCode === 401) {
      navigateTo('/login');
      return;
    }
    
    if (error.statusCode === 402) {
      uiStore.openModal('upgrade');
      return;
    }
    
    uiStore.showToast('error', error.data?.message || 'Something went wrong');
  };

  return {
    post: async <T>(url: string, body: any): Promise<T> => {
      try {
        return await $fetch<T>(url, { method: 'POST', body });
      } catch (error) {
        handleError(error);
        throw error;
      }
    }
  };
};
```

---

## 9. Performance Audit

### When to Use
- When app feels slow
- Before launch
- After adding complex features
- Monthly review

### The Prompt

```
Perform a performance audit on dlytful:

**Bundle Size:**
- What's the total bundle size?
- Are there large dependencies that could be replaced?
- Is tree-shaking working?
- Are images optimized?

**Runtime Performance:**
- Are there unnecessary re-renders?
- Are expensive computations memoized?
- Are lists virtualized if >100 items?
- Is there layout thrashing?

**Network Performance:**
- Are API calls batched where possible?
- Is there request waterfall (sequential instead of parallel)?
- Are responses compressed?
- Is there unnecessary data fetching?

**Vue-Specific:**
- Are v-for keys stable and unique?
- Are v-if/v-show used correctly?
- Are computed properties used instead of methods?
- Are watchers necessary (vs computed)?

**Pinia-Specific:**
- Are getters caching derived state?
- Are store subscriptions cleaned up?
- Is there over-subscription to state?

**Nuxt-Specific:**
- Is SSR working correctly?
- Are pages lazy-loaded?
- Is useAsyncData used for data fetching?
- Are components auto-imported?

**Gemini API:**
- Is response time acceptable (<3s)?
- Is debouncing implemented (800ms)?
- Are requests cancelled on new input?

Provide specific optimizations with before/after metrics.
```

### Performance Patterns

```typescript
// ❌ Performance issue: Unnecessary re-renders
<template>
  <div v-for="item in filteredItems" :key="item.id">
    {{ formatDate(item.created_at) }} <!-- Called every render -->
  </div>
</template>

// ✅ Fix: Computed property
const formattedItems = computed(() => 
  filteredItems.value.map(item => ({
    ...item,
    formattedDate: formatDate(item.created_at)
  }))
);

// ❌ Performance issue: Watchers instead of computed
watch(items, () => {
  filteredItems.value = items.value.filter(i => i.active);
});

// ✅ Fix: Computed
const filteredItems = computed(() => items.value.filter(i => i.active));

// ❌ Performance issue: Sequential API calls
const user = await fetchUser();
const sprints = await fetchSprints();
const settings = await fetchSettings();

// ✅ Fix: Parallel API calls
const [user, sprints, settings] = await Promise.all([
  fetchUser(),
  fetchSprints(),
  fetchSettings()
]);

// ❌ Performance issue: No debounce on rapid input
watch(searchQuery, async (query) => {
  results.value = await search(query);
});

// ✅ Fix: Debounced search
const debouncedSearch = useDebounceFn(async (query: string) => {
  results.value = await search(query);
}, 300);

watch(searchQuery, debouncedSearch);
```

### Performance Commands

```bash
# Analyze bundle size
npx nuxi analyze

# Lighthouse audit (requires build)
npx nuxi build && npx lighthouse http://localhost:3000

# Check for large dependencies
npx bundle-phobia [package-name]
```

---

## 10. Security Audit

### When to Use
- Before any deployment
- After adding authentication features
- After adding payment features
- When handling user data
- Quarterly review

### The Prompt

```
Perform a security audit on dlytful:

**Authentication:**
- Is Supabase Auth configured correctly?
- Are all protected routes actually protected?
- Is session handling secure?
- Are tokens stored securely?

**Authorization:**
- Are RLS policies enforced on all tables?
- Can users access other users' data?
- Are tier restrictions enforced server-side?

**API Security:**
- Is input validation present on ALL endpoints?
- Are SQL injection vectors covered by Supabase?
- Is there rate limiting on expensive operations?
- Are API keys server-side only?

**Data Security:**
- Is sensitive data encrypted at rest?
- Are passwords properly hashed (Supabase handles this)?
- Is PII minimized?
- Is there data retention policy?

**XSS Prevention:**
- Is user content sanitized before display?
- Are v-html usages safe?
- Is CSP configured?

**CSRF Prevention:**
- Are mutations protected?
- Is SameSite cookie attribute set?

**Environment:**
- Are all secrets in environment variables?
- Is .env in .gitignore?
- Are production keys different from dev?

**Third-Party:**
- Is Gemini API key secured?
- Are Supabase service role keys server-only?
- Are dependencies up to date (no known vulnerabilities)?

For each vulnerability found:
- Severity (critical/high/medium/low)
- Exploitation scenario
- Remediation steps
- Verification method
```

### Security Patterns

```typescript
// ❌ Vulnerable: No input validation
export default defineEventHandler(async (event) => {
  const { sprint_id } = await readBody(event);
  const sprint = await supabase.from('sprints').select().eq('id', sprint_id);
  return sprint;
});

// ✅ Secure: With validation and auth
import { z } from 'zod';

const schema = z.object({
  sprint_id: z.string().uuid()
});

export default defineEventHandler(async (event) => {
  // Auth check
  const user = await requireAuth(event);
  
  // Input validation
  const body = await readBody(event);
  const { sprint_id } = schema.parse(body);
  
  // Authorization (RLS also enforces this)
  const { data: sprint, error } = await supabase
    .from('sprints')
    .select()
    .eq('id', sprint_id)
    .eq('user_id', user.id)
    .single();
    
  if (error || !sprint) {
    throw createError({ statusCode: 404 });
  }
  
  return sprint;
});

// ❌ Vulnerable: API key in client
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Secure: API key server-side only
// /server/api/generate.post.ts
const gemini = new GoogleGenerativeAI(useRuntimeConfig().geminiApiKey);

// ❌ Vulnerable: v-html with user content
<div v-html="userBio"></div>

// ✅ Secure: Sanitized or text-only
<div>{{ userBio }}</div>
// or
<div v-html="sanitize(userBio)"></div>
```

### Security Commands

```bash
# Check for known vulnerabilities in dependencies
npm audit

# Check for secrets in code
npx gitleaks detect

# Check Supabase RLS policies
# (run in Supabase SQL editor)
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

---

## 11. Accessibility Audit

### When to Use
- After building UI components
- Before launch
- When receiving accessibility complaints
- Quarterly review

### The Prompt

```
Perform an accessibility (a11y) audit on dlytful:

**Semantic HTML:**
- Are headings hierarchical (h1 → h2 → h3)?
- Are landmarks used (main, nav, aside)?
- Are lists using ul/ol/li?
- Are buttons <button> not <div>?

**Keyboard Navigation:**
- Can all interactive elements be reached by Tab?
- Is focus visible?
- Are custom components keyboard accessible?
- Is focus trapped in modals?

**ARIA:**
- Are ARIA labels present where needed?
- Are ARIA roles correct?
- Are live regions used for dynamic content?
- Are required fields marked with aria-required?

**Color & Contrast:**
- Is contrast ratio ≥4.5:1 for text?
- Is information conveyed by more than just color?
- Is there a skip-to-content link?

**Forms:**
- Are all inputs labeled?
- Are errors announced to screen readers?
- Is autocomplete attribute present?
- Are required fields indicated?

**Images:**
- Do all images have alt text?
- Are decorative images marked aria-hidden?

**Motion:**
- Is there a prefers-reduced-motion check?
- Can animations be paused?

**Dlytful Specific:**
- Is the archetype wheel accessible?
- Can the live preview be navigated?
- Are unlock celebrations not disruptive?
- Can all prompts be copied via keyboard?

For each issue:
- WCAG criterion violated
- Current code
- Fixed code
- Testing method
```

### Accessibility Patterns

```vue
<!-- ❌ Inaccessible: Div as button -->
<div @click="submit" class="btn">Submit</div>

<!-- ✅ Accessible: Semantic button -->
<button @click="submit" class="btn">Submit</button>

<!-- ❌ Inaccessible: No label -->
<input v-model="email" type="email" placeholder="Email">

<!-- ✅ Accessible: With label -->
<label for="email">Email address</label>
<input id="email" v-model="email" type="email" autocomplete="email">

<!-- ❌ Inaccessible: Icon-only button -->
<button @click="copy"><CopyIcon /></button>

<!-- ✅ Accessible: With aria-label -->
<button @click="copy" aria-label="Copy to clipboard">
  <CopyIcon aria-hidden="true" />
</button>

<!-- ❌ Inaccessible: No live region for updates -->
<div>{{ statusMessage }}</div>

<!-- ✅ Accessible: Live region -->
<div role="status" aria-live="polite">{{ statusMessage }}</div>

<!-- ❌ Inaccessible: Color-only error indication -->
<input :class="{ 'border-red': hasError }">

<!-- ✅ Accessible: Multiple indicators -->
<input 
  :class="{ 'border-red': hasError }"
  :aria-invalid="hasError"
  :aria-describedby="hasError ? 'error-msg' : undefined"
>
<span v-if="hasError" id="error-msg" class="text-red">
  {{ errorMessage }}
</span>
```

### Accessibility Testing

```bash
# Automated testing
npx axe-cli http://localhost:3000

# Manual testing checklist
# 1. Navigate entire app using only Tab key
# 2. Use screen reader (VoiceOver on Mac, NVDA on Windows)
# 3. Zoom to 200% and verify layout
# 4. Use browser's accessibility inspector
# 5. Test with prefers-reduced-motion enabled
```

---

## 12. Error Handling Audit

### When to Use
- After adding new features
- When users report crashes
- Before launch
- After API changes

### The Prompt

```
Audit error handling throughout dlytful:

**Client-Side Errors:**
- Are all async operations wrapped in try/catch?
- Are errors displayed to users appropriately?
- Is there a global error handler?
- Are errors logged for debugging?

**Server-Side Errors:**
- Do all API routes handle errors?
- Are error responses consistent?
- Are errors logged?
- Are sensitive details hidden from responses?

**Network Errors:**
- Is offline state handled?
- Are timeouts configured?
- Is retry logic implemented where appropriate?

**Form Errors:**
- Are validation errors shown inline?
- Is error state cleared on re-input?
- Are errors accessible (announced to screen readers)?

**State Errors:**
- Are store actions handling errors?
- Is error state tracked?
- Can users recover from errors?

**Gemini API Errors:**
- Are rate limits handled?
- Are malformed responses handled?
- Is there fallback when AI fails?

**Supabase Errors:**
- Are auth errors handled?
- Are RLS errors handled gracefully?
- Are constraint violations handled?

Error boundary pattern check:
- Is there a global error boundary?
- Are critical sections wrapped?
- Do error boundaries have fallback UI?

For each unhandled error path:
- Show the code
- Show what happens on error
- Provide the fix
```

### Error Handling Patterns

```typescript
// Global error handler (plugins/error-handler.ts)
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue error:', error, info);
    
    const uiStore = useUIStore();
    uiStore.showToast('error', 'Something went wrong. Please try again.');
    
    // Send to error tracking service
    // errorTracker.capture(error);
  };
});

// API error handling pattern
const handleApiError = (error: any): never => {
  const uiStore = useUIStore();
  
  const statusCode = error.statusCode || error.status || 500;
  const message = error.data?.message || error.message || 'Unknown error';
  
  switch (statusCode) {
    case 400:
      uiStore.showToast('error', `Invalid request: ${message}`);
      break;
    case 401:
      uiStore.showToast('error', 'Please log in to continue');
      navigateTo('/login');
      break;
    case 402:
      uiStore.openModal('upgrade');
      break;
    case 403:
      uiStore.showToast('error', 'You don\'t have access to this');
      break;
    case 404:
      uiStore.showToast('error', 'Not found');
      break;
    case 429:
      uiStore.showToast('error', 'Too many requests. Please wait a moment.');
      break;
    default:
      uiStore.showToast('error', 'Something went wrong. Please try again.');
  }
  
  throw error;
};

// Form error handling
const errors = ref<Record<string, string>>({});

const validate = () => {
  errors.value = {};
  
  if (!form.email) {
    errors.value.email = 'Email is required';
  } else if (!isValidEmail(form.email)) {
    errors.value.email = 'Please enter a valid email';
  }
  
  return Object.keys(errors.value).length === 0;
};

// Component with error boundary
<template>
  <ErrorBoundary>
    <template #default>
      <ComplexComponent />
    </template>
    <template #error="{ error, reset }">
      <div class="error-state">
        <p>Something went wrong loading this section.</p>
        <button @click="reset">Try again</button>
      </div>
    </template>
  </ErrorBoundary>
</template>
```

---

## 13. Console & Debug Cleanup

### When to Use
- Before every commit
- Before deployment
- Code review

### The Prompt

```
Clean up debug code in dlytful:

Find and address:

1. **Console statements**
   - console.log
   - console.warn
   - console.error (keep if intentional error logging)
   - console.debug
   - console.info
   - console.table
   - console.trace

2. **Debug code**
   - debugger statements
   - Commented-out code blocks
   - TODO/FIXME for shipped features
   - Temporary test values
   - Hard-coded test credentials

3. **Development-only code**
   - Code that should be wrapped in `if (process.dev)`
   - Test data that shouldn't be in production
   - Mock implementations

4. **Verbose logging**
   - Excessive logging in loops
   - Logging sensitive data
   - Logging large objects

For each finding:
- File and line number
- The code
- Recommendation (remove/keep/wrap in dev check)

Provide a clean version of affected files.
```

### Cleanup Commands

```bash
# Find console statements
grep -rn "console\." --include="*.ts" --include="*.vue" . | grep -v node_modules

# Find debugger statements
grep -rn "debugger" --include="*.ts" --include="*.vue" . | grep -v node_modules

# Find TODO/FIXME
grep -rn "TODO\|FIXME" --include="*.ts" --include="*.vue" . | grep -v node_modules

# ESLint rule (add to .eslintrc)
{
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error"
  }
}
```

### Production-Safe Logging

```typescript
// utils/logger.ts
export const logger = {
  debug: (...args: any[]) => {
    if (process.dev) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (process.dev) {
      console.info('[INFO]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
    // Could send to error tracking
  },
  
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
    // Send to error tracking
  }
};

// Usage
logger.debug('Sprint inputs:', inputs); // Only in dev
logger.error('Failed to generate:', error); // Always logged
```

---

## 14. Dependency Audit

### When to Use
- Weekly
- Before major releases
- When security advisories are published
- When upgrading Node.js

### The Prompt

```
Audit npm dependencies in dlytful:

**Security:**
- Are there known vulnerabilities? (npm audit)
- Are all dependencies from trusted sources?
- Are there unnecessary dependencies with broad access?

**Version Currency:**
- Are major versions up to date?
- Are there deprecated packages?
- Are there packages with no recent updates (abandoned)?

**Bundle Impact:**
- Which dependencies are largest?
- Are there lighter alternatives?
- Are dev dependencies properly marked?

**Necessity:**
- Are all dependencies actually used?
- Can any be replaced with native features?
- Are there duplicate packages (e.g., lodash and underscore)?

**License:**
- Are all licenses compatible with commercial use?
- Are there GPL dependencies that could be problematic?

Provide:
- List of updates needed (with breaking change warnings)
- Packages to remove
- Packages to replace
- Security patches needed (urgent)
```

### Dependency Commands

```bash
# Security audit
npm audit
npm audit fix

# Check for outdated packages
npm outdated

# Check for unused dependencies
npx depcheck

# Check bundle size impact
npx bundle-phobia [package-name]

# Check package info (last update, downloads, etc.)
npm info [package-name]

# Interactive update
npx npm-check -u
```

### Recommended Dependency Practices

```json
// package.json
{
  "dependencies": {
    // Pin exact versions for stability
    "@nuxt/devtools": "1.0.0",
    
    // Or use ~ for patch updates only
    "vue": "~3.4.0",
    
    // Avoid ^ in production for critical deps
  },
  "overrides": {
    // Force specific version of nested dependency
    "vulnerable-package": "2.0.0"
  }
}
```

---

## 15. Test Coverage Audit

### When to Use
- After adding new features
- When bugs slip through
- Before major releases
- Monthly review

### The Prompt

```
Audit test coverage for dlytful:

**Unit Tests:**
- Are utility functions tested?
- Are composables tested?
- Are store actions/getters tested?
- Are validation functions tested?

**Component Tests:**
- Are components rendering correctly?
- Are user interactions tested?
- Are edge cases covered?
- Are error states tested?

**Integration Tests:**
- Are API endpoints tested?
- Is authentication flow tested?
- Is the full discovery flow tested?

**E2E Tests:**
- Can a user complete the happy path?
- Are error scenarios tested?
- Is the copy-paste flow tested?

**Critical Paths to Test:**
1. User signup/login
2. Discovery flow completion (all tiers)
3. Brand prompt generation
4. Copy to clipboard
5. Sprint save/load
6. Tier upgrade prompt

For areas lacking coverage:
- Identify the gap
- Write the test
- Explain what it covers
```

### Test Patterns for Dlytful

```typescript
// Unit test for validation (vitest)
import { describe, it, expect } from 'vitest';
import { validatePositioning } from '@/utils/validation';

describe('validatePositioning', () => {
  it('returns error for empty positioning', () => {
    const result = validatePositioning('');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Positioning is required');
  });
  
  it('returns error for missing "because"', () => {
    const result = validatePositioning('For developers, we make tools');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Positioning should include "because"');
  });
  
  it('passes for valid positioning', () => {
    const result = validatePositioning(
      'For indie developers, dlytful is the brand tool that translates because...'
    );
    expect(result.valid).toBe(true);
  });
});

// Component test
import { mount } from '@vue/test-utils';
import QuestionStep from '@/components/discovery/QuestionStep.vue';

describe('QuestionStep', () => {
  it('emits update:modelValue on input', async () => {
    const wrapper = mount(QuestionStep, {
      props: {
        question: { id: 'q1', text: 'Test?', type: 'textarea' },
        modelValue: ''
      }
    });
    
    await wrapper.find('textarea').setValue('Test answer');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Test answer']);
  });
  
  it('shows error state', () => {
    const wrapper = mount(QuestionStep, {
      props: {
        question: { id: 'q1', text: 'Test?', type: 'text' },
        modelValue: '',
        error: 'This field is required'
      }
    });
    
    expect(wrapper.find('.error-message').text()).toBe('This field is required');
  });
});

// API integration test
import { describe, it, expect } from 'vitest';
import { $fetch } from '@nuxt/test-utils';

describe('POST /api/sprint/generate', () => {
  it('returns 401 without auth', async () => {
    await expect($fetch('/api/sprint/generate', {
      method: 'POST',
      body: { sprint_id: 'test' }
    })).rejects.toThrow('401');
  });
  
  it('returns outputs with valid sprint', async () => {
    const result = await $fetch('/api/sprint/generate', {
      method: 'POST',
      body: { sprint_id: 'valid-sprint-id' },
      headers: { Authorization: 'Bearer valid-token' }
    });
    
    expect(result.outputs).toBeDefined();
    expect(result.outputs.positioning).toBeDefined();
  });
});
```

---

## 16. Documentation Audit

### When to Use
- After adding new features
- When onboarding new developers
- Quarterly review
- Before open-sourcing any code

### The Prompt

```
Audit documentation in dlytful:

**Code Documentation:**
- Are complex functions documented?
- Are public APIs documented?
- Are types self-documenting or need comments?
- Are magic numbers explained?
- Are workarounds explained?

**README:**
- Is setup process documented?
- Are environment variables listed?
- Is the architecture explained?
- Are contribution guidelines present?

**API Documentation:**
- Are all endpoints documented?
- Are request/response shapes documented?
- Are error codes documented?

**Component Documentation:**
- Are props documented?
- Are emits documented?
- Are slots documented?
- Are usage examples provided?

**Architecture Documentation:**
- Is the overall structure explained?
- Are key decisions documented?
- Is the state flow documented?
- Is the deployment process documented?

For each gap:
- What's missing
- Draft documentation
- Where it should live
```

### Documentation Patterns

```typescript
/**
 * Generates a complete Brand Prompt from discovery inputs.
 * 
 * @param inputs - User's discovery answers
 * @param tier - User's subscription tier (affects output depth)
 * @returns Generated outputs including positioning, voice rules, etc.
 * 
 * @example
 * const outputs = await generateBrandPrompt(
 *   { product_description: 'A meal planning app', ... },
 *   'one'
 * );
 * 
 * @throws {ValidationError} If inputs fail validation
 * @throws {GeminiError} If AI generation fails
 */
export async function generateBrandPrompt(
  inputs: DiscoveryInputs,
  tier: Tier
): Promise<GeneratedOutputs> {
  // ...
}

/**
 * Discovery question step component.
 * 
 * @component
 * @example
 * <QuestionStep
 *   :question="currentQuestion"
 *   v-model="answer"
 *   :error="validationError"
 *   @next="handleNext"
 * />
 */
```

---

## 17. Pre-Deploy Checklist

### When to Use
- Before every deployment to production
- No exceptions

### The Prompt

```
Run pre-deploy checklist for dlytful:

**Build:**
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] No console.log in production code

**Environment:**
- [ ] All env vars set in production
- [ ] API keys are production keys (not dev)
- [ ] Database is production database
- [ ] Gemini API key is valid

**Security:**
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] No secrets in code
- [ ] RLS policies are enabled
- [ ] CORS is configured correctly

**Functionality:**
- [ ] Auth flow works (signup, login, logout)
- [ ] Discovery flow completes
- [ ] Brand prompt generates
- [ ] Copy to clipboard works
- [ ] Tier restrictions enforced
- [ ] Payments work (if enabled)

**Performance:**
- [ ] Initial page load <3s
- [ ] Time to interactive <5s
- [ ] No major bundle size regressions

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast passes

**Database:**
- [ ] Migrations applied
- [ ] Indexes in place
- [ ] Backup verified

**Monitoring:**
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Uptime monitoring configured

**Rollback:**
- [ ] Previous version tagged
- [ ] Rollback procedure documented
- [ ] Database rollback possible if needed

Sign-off: _____________ Date: _____________
```

---

## 18. Post-Incident Review

### When to Use
- After any production incident
- After any data loss
- After any security issue

### The Prompt

```
Conduct post-incident review:

**Incident Summary:**
- What happened?
- When did it start?
- When was it detected?
- When was it resolved?
- Who was affected?

**Timeline:**
- [ ] First error occurred at: _____
- [ ] First alert triggered at: _____
- [ ] Team notified at: _____
- [ ] Investigation started at: _____
- [ ] Root cause identified at: _____
- [ ] Fix deployed at: _____
- [ ] Incident closed at: _____

**Root Cause Analysis:**
- What was the direct cause?
- What was the underlying cause?
- Why wasn't this caught earlier?

**Impact:**
- Users affected: _____
- Data affected: _____
- Revenue impact: _____
- Reputation impact: _____

**What Went Well:**
- What helped in detection?
- What helped in resolution?
- What processes worked?

**What Went Wrong:**
- What delayed detection?
- What delayed resolution?
- What processes failed?

**Action Items:**
- [ ] Immediate fix: _____
- [ ] Prevent recurrence: _____
- [ ] Improve detection: _____
- [ ] Update documentation: _____
- [ ] Add tests: _____

**Lessons Learned:**
- What do we know now that we didn't before?
- What would we do differently?
```

---

## 19. Technical Debt Tracker

### When to Use
- When you know you're cutting corners
- During architecture reviews
- When planning sprints

### The Prompt

```
Document technical debt in dlytful:

For each debt item, capture:

**ID:** TD-001
**Area:** [Component/API/Database/Infrastructure]
**Description:** What is the shortcut/issue?
**Impact:** How does this affect development/users?
**Effort:** [Low/Medium/High]
**Priority:** [P0-Critical/P1-High/P2-Medium/P3-Low]
**Created:** Date
**Owner:** Who knows about this?

**Current Technical Debt:**

| ID | Area | Description | Impact | Effort | Priority |
|----|------|-------------|--------|--------|----------|
| TD-001 | | | | | |

**Debt Categories:**

1. **Code Quality**
   - Missing tests
   - Poor naming
   - Complex functions
   - Missing documentation

2. **Architecture**
   - Wrong abstractions
   - Tight coupling
   - Missing layers

3. **Infrastructure**
   - Manual processes
   - Missing monitoring
   - Inadequate logging

4. **Dependencies**
   - Outdated packages
   - Deprecated APIs
   - Version conflicts

5. **Performance**
   - Unoptimized queries
   - Missing caching
   - Large bundles

Plan to address:
- Quick wins (low effort, high impact): address immediately
- Strategic (high effort, high impact): plan for next sprint
- Nice-to-have (low effort, low impact): do when convenient
- Defer (high effort, low impact): document and revisit later
```

---

## 20. Refactoring Workflows

### When to Use
- When code becomes hard to change
- When bugs cluster in certain areas
- When adding features is slow
- Scheduled improvement sprints

### The Prompt: Safe Refactoring

```
Help me refactor this code safely:

[paste code]

**Goal:** [what improvement]

**Constraints:**
- Must maintain existing behavior
- Must not break existing tests
- Must not introduce breaking changes to API

**Process:**
1. Document current behavior
2. Add tests if missing
3. Make incremental changes
4. Verify tests pass after each change
5. Review for unintended side effects

**Provide:**
- The refactored code
- Explanation of changes
- Tests to add/verify
- Rollback plan if issues arise
```

### The Prompt: Extract Composable

```
Extract a composable from this component:

[paste component]

**Logic to extract:** [describe]

**Requirements:**
- Maintain reactivity
- Proper TypeScript types
- Clear interface
- Reusable across components

**Provide:**
- The extracted composable
- The updated component
- Usage documentation
```

### The Prompt: Extract Utility

```
Extract utility functions from this code:

[paste code]

**Functions to extract:**
- [function 1]
- [function 2]

**Requirements:**
- Pure functions where possible
- Proper TypeScript types
- Unit test friendly
- Well-documented

**Provide:**
- The utility module
- The updated original code
- Unit tests for utilities
```

### The Prompt: Simplify Complex Function

```
Simplify this complex function:

[paste function]

**Current complexity issues:**
- Too many lines
- Too many responsibilities
- Hard to understand
- Hard to test

**Provide:**
- Broken down into smaller functions
- Each function with single responsibility
- Clear names that explain intent
- Tests for each function
```

### The Prompt: Improve Type Safety

```
Improve type safety in this code:

[paste code]

**Current issues:**
- Using `any`
- Missing null checks
- Unsafe type assertions
- Untyped function parameters

**Provide:**
- Properly typed version
- Type guards where needed
- Explanation of type decisions
```

---

## Quick Reference Commands

```bash
# === BUILD & CHECK ===
npm run build              # Production build
npm run dev                # Development server
npx nuxi typecheck         # TypeScript check
npm run lint               # ESLint check
npm run lint -- --fix      # Auto-fix lint issues

# === TESTING ===
npm run test               # Run tests
npm run test:coverage      # With coverage report

# === SECURITY ===
npm audit                  # Check vulnerabilities
npm audit fix              # Fix automatically
npx gitleaks detect        # Check for secrets

# === DEPENDENCIES ===
npm outdated               # Check for updates
npx depcheck               # Find unused deps
npx npm-check -u           # Interactive update

# === BUNDLE ===
npx nuxi analyze           # Bundle analysis

# === SEARCH ===
grep -rn "console\." --include="*.ts" --include="*.vue" .  # Find console.log
grep -rn "TODO\|FIXME" --include="*.ts" --include="*.vue" . # Find TODOs
grep -rn ": any" --include="*.ts" .                         # Find any types

# === DATABASE ===
npx supabase db diff       # Check migration needs
npx supabase db push       # Apply migrations
```

---

## Maintenance Schedule

### Daily
- [ ] Quick health check before coding
- [ ] Console.log cleanup before commits
- [ ] Type errors fixed immediately

### Weekly
- [ ] Full codebase audit
- [ ] Dependency security check
- [ ] Dead code removal
- [ ] Technical debt review

### Before Each Deploy
- [ ] Full pre-deploy checklist
- [ ] Security audit
- [ ] Performance audit
- [ ] Accessibility spot-check

### Monthly
- [ ] Architecture review
- [ ] Full dependency audit
- [ ] Test coverage review
- [ ] Documentation update

### Quarterly
- [ ] Full accessibility audit
- [ ] Full security audit
- [ ] Technical debt paydown sprint
- [ ] Performance benchmark comparison

---

## Dlytful-Specific Audits

### Live Preview Engine Audit

```
Audit the live preview system:

1. **Reactivity Chain:**
   - User input → Store update → Preview recompute
   - Are there any broken links?
   - Is debouncing working correctly (800ms)?

2. **Optimistic Updates:**
   - Is the preview showing immediately on input?
   - Does AI enhancement replace correctly?
   - Is there flickering or content jumping?

3. **State Synchronization:**
   - Are inputs and preview always in sync?
   - What happens on rapid input changes?
   - Is there race condition potential?

4. **Error Recovery:**
   - What shows if AI generation fails?
   - Does the preview degrade gracefully?
   - Can the user continue if Gemini is down?
```

### Brand Prompt Generation Audit

```
Audit Brand Prompt generation:

1. **Hard Rules Enforcement:**
   - Is positioning template always followed?
   - Are voice rules always 3 categories?
   - Are banned words being filtered?
   - Is color psychology rationale always included?

2. **Quality Consistency:**
   - Are outputs consistently useful?
   - Is there variation without sacrificing quality?
   - Are edge cases handled (minimal input, unusual products)?

3. **Tier Restrictions:**
   - Is dlytful zero limited correctly?
   - Are dlytful one features gated?
   - Are dlytful max features exclusive?

4. **Copy-Paste Ready:**
   - Can outputs be pasted directly into Bolt?
   - Is formatting correct?
   - Are there any characters that break when pasted?
```

### Unlock System Audit

```
Audit the progressive unlock system:

1. **Trigger Accuracy:**
   - Does each question unlock the correct features?
   - Are unlocks happening at the right time?
   - Is the order correct?

2. **Visual Feedback:**
   - Are unlock animations smooth?
   - Are celebration messages showing?
   - Is the unlocked content clearly visible?

3. **State Persistence:**
   - Are unlocks remembered on page refresh?
   - Are unlocks tied to sprint correctly?
   - Can unlocks be reset for testing?

4. **Tier Integration:**
   - Are free tier unlocks limited correctly?
   - Do paid features show as locked for free users?
   - Is upgrade prompt triggered appropriately?
```

### Validation System Audit

```
Audit the validation and flagging system:

1. **Quality Flags:**
   - Are flags appearing at correct times?
   - Is the rationale clear and helpful?
   - Can users dismiss flags?
   - Are dismissed flags remembered?

2. **Contradiction Warnings:**
   - Is archetype tension detected correctly?
   - Are warnings informative, not blocking?
   - Do "Keep my choices" and "Help me reconcile" work?

3. **Input Flags:**
   - Is jargon being detected in real-time?
   - Are hints helpful, not annoying?
   - Is flagging consistent across fields?

4. **Hard Rule Enforcement:**
   - Are banned words never in outputs?
   - Is positioning template enforced?
   - Are voice categories always complete?
```

---

## Final Note

This document is a living reference. Update it as:
- New patterns emerge
- New issues are discovered
- Better approaches are learned
- The codebase evolves

The goal is not perfection on day one. The goal is continuous improvement with clear processes.

**Remember:** The best time to fix a bug is before you write it. The second best time is right after you find it.
