# Dlytful PRD

A fast-moving Nuxt PRD for shipping in one week.

---

## 0. Stack Assumptions (Nuxt Baseline)

**Target stack:**
- Nuxt 3 (Vue 3, Composition API)
- TypeScript: Yes
- State: Pinia
- Server: Nitro (Nuxt server /server/api)
- Styling: Tailwind CSS
- Database: Supabase (Postgres + Auth)
- AI: Claude API (Anthropic)
- Payments: Stripe (Phase 2)
- Email: Resend
- Hosting: Vercel

**Non-negotiables:**
- Composition API only (no Options API)
- Typed APIs, typed stores, typed composables
- All async logic wrapped in a shared API utility
- No "AI" language in UI copy

---

## 1. Product Essence (The Why)

**One-sentence principle:**
> Dlytful translates what you built into what people see. The aha moment is the product.

**Problem being solved:**
- Indie developers ship functional apps that look like generic templates
- Founders can't describe what "looks right" until they see it
- Branding is an afterthought, disconnected from the build process

**Primary outcomes (success definition):**
- User pastes Rebrand prompt into Bolt, sees immediate visual transformation
- User recognizes their app as what they *meant* to build
- Conversion from free to paid tiers

---

## 2. Core User Workflows

### Workflow: Waitlist Signup (Phase 1)

**What the user does:**
1. Lands on homepage
2. Enters email
3. Receives PDF via email
4. Sees "Dlytful is coming" teaser

**What they see:**
- `/` (landing page with email capture)
- Email with PDF attachment

**What state changes:**
- New row in `waitlist` table

**What the server does:**
- Validates email
- Inserts into Supabase
- Triggers Resend email with PDF

**Edge cases:**
- Duplicate email: show friendly message, don't re-send
- Invalid email: client-side validation

---

### Workflow: Discovery Sprint (Phase 2)

**What the user does:**
1. Signs up / logs in
2. Starts new sprint
3. Answers discovery questions (tiered by plan)
4. Reviews archetype recommendations
5. Receives generated outputs
6. Copies Rebrand prompt
7. Pastes into Bolt

**What they see:**
- `/login` or `/register`
- `/sprint/new` (discovery flow)
- `/sprint/[id]` (results page)
- `/sprints` (history, paid tiers)

**What state changes:**
- New user in `users` table
- New sprint in `sprints` table with inputs/outputs JSON
- Sprint count incremented

**What the server does:**
- Authenticates user
- Validates tier access for question depth
- Calls Claude API with discovery inputs
- Parses and stores structured outputs
- Returns formatted prompts

**Edge cases:**
- Free user tries to access paid features: show upgrade prompt
- API failure: retry once, then show error with save-draft option
- User abandons mid-flow: auto-save progress

---

### Workflow: Fork Sprint

**What the user does:**
1. Views existing sprint
2. Clicks "Fork"
3. Modifies inputs
4. Generates new outputs

**What they see:**
- `/sprint/[id]` with Fork button
- `/sprint/new?fork=[parent_id]` (pre-filled inputs)

**What state changes:**
- New sprint with `parent_id` reference

**Edge cases:**
- Free users cannot fork (no save)

---

## 3. Feature Set

### Feature: Email Waitlist

**Goal:** Collect emails, deliver PDF, build launch list

**Inputs:** Email address

**Outputs:** Confirmation message, PDF delivered via email

**Dependencies:**
- Supabase (database)
- Resend (email)

**Nuxt implementation:**
- Pages: `pages/index.vue`
- Components: `components/waitlist/EmailForm.vue`
- Server/API: `server/api/waitlist.post.ts`

---

### Feature: Authentication

**Goal:** User accounts with email/password

**Inputs:** Email, password

**Outputs:** Authenticated session, user record

**Dependencies:**
- Supabase Auth

**Nuxt implementation:**
- Pages: `pages/login.vue`, `pages/register.vue`
- Components: `components/auth/LoginForm.vue`, `components/auth/RegisterForm.vue`
- Composables: `composables/useAuth.ts`
- Stores: `stores/user.ts`
- Middleware: `middleware/auth.global.ts`, `middleware/guestOnly.ts`

---

### Feature: Discovery Flow

**Goal:** Guided question sequence that extracts brand essence

**Inputs:** User answers to discovery questions (3-12 depending on tier)

**Outputs:** Structured brand data stored in sprint

**Dependencies:**
- User authentication
- Tier validation

**Nuxt implementation:**
- Pages: `pages/sprint/new.vue`
- Components:
  - `components/discovery/QuestionStep.vue`
  - `components/discovery/ProgressBar.vue`
  - `components/discovery/ArchetypeWheel.vue`
- Composables: `composables/useDiscovery.ts`
- Stores: `stores/sprint.ts`

**Question mapping by tier:**

| Part | Questions | dlytful zero | dlytful one | dlytful max |
|------|-----------|-----------|----------|-------------|
| 1 | Product in Practice | ✓ | ✓ | ✓ |
| 2 | Person Who Gets It | - | ✓ | ✓ |
| 3 | What You're Not | - | ✓ | ✓ |
| 4 | The Moment | - | ✓ | ✓ |
| 5 | Validation | - | - | ✓ |

---

### Feature: Prompt Generation

**Goal:** Transform discovery inputs into Bolt-ready prompts

**Inputs:** Sprint data (inputs JSON)

**Outputs:** Rebrand prompt, Foundation prompt, metadata prompt (tier-dependent)

**Dependencies:**
- Claude API
- Sprint data

**Nuxt implementation:**
- Server/API: `server/api/sprint/generate.post.ts`
- Composables: `composables/useGenerate.ts`

**Prompt types by tier:**

| Output | dlytful zero | dlytful one | dlytful max |
|--------|-----------|----------|------------|
| Rebrand prompt (basic) | ✓ | - | - |
| Rebrand prompt (full) | - | ✓ | ✓ |
| Foundation prompt | - | ✓ | ✓ |
| Discoverability prompt | - | - | ✓ |
| Agent system prompt | - | - | ✓ |

---

### Feature: Archetype Wheel

**Goal:** Visual archetype selector with AI-driven recommendations

**Inputs:** Discovery answers (Parts 1-3)

**Outputs:** Highlighted archetype recommendations, user selection

**Dependencies:**
- Discovery flow completion (Part 3 minimum)

**Nuxt implementation:**
- Components:
  - `components/discovery/ArchetypeWheel.vue`
  - `components/discovery/ArchetypeCard.vue`
- Server/API: `server/api/archetype/recommend.post.ts`

**Behavior:**
- Show full wheel (12 archetypes)
- Highlight 2-3 recommended based on inputs
- Desaturate non-recommended
- Display reasoning for recommendations
- Allow user override

**Tier limits:**
- dlytful zero: Show result only, no selection
- dlytful one: 6 archetypes selectable
- dlytful max: Full 12 with combo explanations

---

### Feature: Sprint Results

**Goal:** Display generated outputs with copy functionality

**Inputs:** Sprint ID

**Outputs:** Formatted prompts, copy buttons, export options

**Dependencies:**
- Completed sprint generation

**Nuxt implementation:**
- Pages: `pages/sprint/[id].vue`
- Components:
  - `components/results/PromptBlock.vue`
  - `components/results/CopyButton.vue`
  - `components/results/ExportMenu.vue`

---

### Feature: Sprint History

**Goal:** View and manage past sprints

**Inputs:** User ID

**Outputs:** List of sprints with fork/view actions

**Dependencies:**
- User authentication
- Paid tier (dlytful one or dlytful max)

**Nuxt implementation:**
- Pages: `pages/sprints/index.vue`
- Components:
  - `components/sprints/SprintCard.vue`
  - `components/sprints/SprintTree.vue` (shows fork relationships)

---

### Feature: Export (dlytful max)

**Goal:** Export brand foundation as markdown

**Inputs:** Sprint ID

**Outputs:** Downloadable .md file, Notion-importable format

**Dependencies:**
- dlytful max tier
- Completed sprint

**Nuxt implementation:**
- Server/API: `server/api/sprint/[id]/export.get.ts`
- Components: `components/results/ExportMenu.vue`

---

## 4. Architecture Overview

### 4.1 Routing & Pages

| Route | File | Layout | Middleware | Notes |
|-------|------|--------|------------|-------|
| `/` | `pages/index.vue` | default | - | Landing/waitlist |
| `/login` | `pages/login.vue` | auth | guestOnly | Login |
| `/register` | `pages/register.vue` | auth | guestOnly | Register |
| `/sprint/new` | `pages/sprint/new.vue` | app | auth | Discovery flow |
| `/sprint/[id]` | `pages/sprint/[id].vue` | app | auth | Results |
| `/sprints` | `pages/sprints/index.vue` | app | auth, paidOnly | History |

---

### 4.2 Layouts

| Layout | File | Purpose |
|--------|------|---------|
| default | `layouts/default.vue` | Landing page, minimal nav |
| auth | `layouts/auth.vue` | Login/register, centered form |
| app | `layouts/app.vue` | Authenticated app shell |

---

### 4.3 Component Map

| Component | Responsibility | Props | Emits | Folder |
|-----------|---------------|-------|-------|--------|
| `DlytfulButton.vue` | Brand button | `variant`, `disabled`, `loading` | `click` | `components/ui/` |
| `DlytfulInput.vue` | Brand input | `label`, `error`, `modelValue` | `update:modelValue` | `components/ui/` |
| `DlytfulCard.vue` | Content card | `variant` | - | `components/ui/` |
| `EmailForm.vue` | Waitlist capture | - | `submit` | `components/waitlist/` |
| `QuestionStep.vue` | Single discovery question | `question`, `modelValue` | `update:modelValue`, `next` | `components/discovery/` |
| `ProgressBar.vue` | Flow progress | `current`, `total` | - | `components/discovery/` |
| `ArchetypeWheel.vue` | Visual selector | `recommended`, `selected`, `available` | `select` | `components/discovery/` |
| `PromptBlock.vue` | Copyable output | `title`, `content`, `locked` | - | `components/results/` |
| `CopyButton.vue` | Copy to clipboard | `content` | `copied` | `components/ui/` |

---

### 4.4 Composables Map

| Composable | Responsibility | Returns | Depends on |
|------------|---------------|---------|------------|
| `useAuth` | Auth state + actions | `{ user, login, logout, register, isAuthenticated }` | `useApi`, `user` store |
| `useApi` | Unified HTTP client | `{ get, post, put, del }` | `$fetch`, runtime config |
| `useDiscovery` | Discovery flow state | `{ currentStep, answers, next, back, submit }` | `sprint` store |
| `useGenerate` | Trigger prompt generation | `{ generate, loading, error }` | `useApi` |
| `useClipboard` | Copy to clipboard | `{ copy, copied }` | - |
| `useTier` | User tier checks | `{ tier, canAccess, isFreeTier }` | `user` store |

---

### 4.5 Stores (Pinia)

| Store | State | Actions | Persistence |
|-------|-------|---------|-------------|
| `user` | `user`, `token`, `tier` | `setUser`, `clearUser`, `setTier` | localStorage |
| `sprint` | `currentSprint`, `sprints` | `createSprint`, `updateInputs`, `setOutputs`, `loadSprints` | no |
| `ui` | `toasts`, `loading` | `showToast`, `setLoading` | no |

---

### 4.6 Server/API (Nitro)

**POST /api/waitlist**
```
Request: { "email": "string" }
Response 200: { "success": true }
Response 400: { "error": "Invalid email" }
Response 409: { "error": "Already registered" }
```

**POST /api/auth/register**
```
Request: { "email": "string", "password": "string" }
Response 200: { "user": User, "token": "string" }
Response 400: { "error": "..." }
```

**POST /api/auth/login**
```
Request: { "email": "string", "password": "string" }
Response 200: { "user": User, "token": "string" }
Response 401: { "error": "Invalid credentials" }
```

**POST /api/sprint**
```
Request: { "inputs": DiscoveryInputs, "parent_id?": "string" }
Response 200: { "id": "string", "created_at": "string" }
```

**POST /api/sprint/generate**
```
Request: { "sprint_id": "string" }
Response 200: { "outputs": GeneratedOutputs }
Response 402: { "error": "Upgrade required", "required_tier": "string" }
```

**GET /api/sprint/:id**
```
Response 200: { "sprint": Sprint }
Response 404: { "error": "Not found" }
```

**GET /api/sprints**
```
Response 200: { "sprints": Sprint[] }
```

**POST /api/archetype/recommend**
```
Request: { "inputs": PartialDiscoveryInputs }
Response 200: { "recommended": Archetype[], "reasoning": string[] }
```

**GET /api/sprint/:id/export**
```
Response 200: Markdown file download
Response 402: { "error": "Upgrade required" }
```

---

### 4.7 Middleware

| Middleware | Type | Responsibility |
|------------|------|-----------------|
| `auth.global` | global | Redirect unauthenticated to login for protected routes |
| `guestOnly` | named | Redirect authenticated away from auth pages |
| `paidOnly` | named | Redirect free tier away from paid features |

---

### 4.8 Plugins

| Plugin | Injects | Purpose |
|--------|---------|---------|
| `plugins/supabase.client.ts` | `$supabase` | Supabase client |
| `plugins/api.client.ts` | `$api` | Typed API wrapper |

---

## 5. Database Schema

```sql
-- waitlist (phase 1)
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text default 'landing',
  created_at timestamp with time zone default now()
);

-- users (phase 2)
create table users (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  tier text default 'free' check (tier in ('free', 'one', 'max')),
  sprints_count int default 0,
  created_at timestamp with time zone default now()
);

-- sprints
create table sprints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users on delete cascade not null,
  parent_id uuid references sprints on delete set null,
  label text,
  inputs jsonb default '{}',
  outputs jsonb default '{}',
  archetype_primary text,
  archetype_secondary text,
  status text default 'draft' check (status in ('draft', 'complete')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- indexes
create index sprints_user_id_idx on sprints(user_id);
create index sprints_parent_id_idx on sprints(parent_id);
```

---

## 6. Discovery Questions

### Part 1: Product in Practice (All tiers)

1. **What does your product do?** (one sentence)
2. **Walk me through the moment someone uses this and thinks "this is good." What's happening?**
3. **Paste your current app URL, or describe what it looks like now.**

### Part 2: Person Who Gets It (dlytful one, dlytful max)

4. **Who immediately understands what you've built? Not age and job title. Who are they actually?**
5. **What would they say about your product to their friends?**
6. **What were they frustrated with before they found you?**

### Part 3: What You're Not (dlytful one, dlytful max)

7. **What do you absolutely NOT want your brand to feel like?**
8. **Would you ever use words like "solution" or "leverage" to describe your product?**
9. **What's the opposite of what you're building?**

### Part 4: The Moment (dlytful one, dlytful max)

10. **Describe the feeling of a perfect day. The kind you mention to friends weeks later. What moment is it?**
11. **[Archetype wheel selection]**

### Part 5: Validation (dlytful max only)

12. **Here's what I'm hearing: [summary]. Does this feel right? What's missing?**

---

## 7. Prompt Templates

### Rebrand Prompt (Basic - dlytful zero)

```
I have an existing app. Keep all current functionality exactly as is.

Apply these brand changes:

## Product
[One-liner from Q1]

## Visual Direction
- Warm, approachable colors (suggest earth tones, avoid cold blues)
- Clean typography (suggest Google Fonts pairing)
- Generous whitespace
- Confident but not aggressive

## Voice
- Sound like a person, not a company
- Direct and clear
- No jargon... Do not change any features or functionality. Only change how it looks and sounds.
```

### Rebrand Prompt (Full - dlytful one, dlytful max)

```
I have an existing app. Keep all current functionality exactly as is.

Apply these brand changes:

## Product
[Positioning statement]

## Target User
[Persona from Part 2]
They would describe this as: "[Q5 answer]"
Their frustration before: [Q6 answer]

## Brand Energy
Primary archetype: [Selected] - [Description]
Secondary archetype: [Selected] - [Description]

## Visual Identity
Colors:
- Primary: [Hex] - [Usage]
- Secondary: [Hex] - [Usage]
- Background: [Hex]
- Accent: [Hex] - sparingly

Typography:
- Headlines: [Font]
- Body: [Font]

Energy reference: [Q10 answer - the moment]

## Voice
Sounds like: [Derived from inputs]
Never sounds like: [Q7, Q9 answers]
Never use these words: [Derived NO list]

## What This Should NOT Look Like
[Q7, Q8, Q9 derivatives]

Do not change any features or functionality. Only change how it looks and sounds.
```

### Discoverability Prompt (dlytful max)

```
Add the following metadata to my app's HTML head. Do not change any functionality or visible UI.

## Head Metadata
<meta name="description" content="[Positioning]">
<meta name="keywords" content="[Semantic keywords]">

## Open Graph
<meta property="og:title" content="[Product + hook]">
<meta property="og:description" content="[One-liner]">
<meta property="og:type" content="website">

## Schema.org
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "[Product]",
  "description": "[Positioning]",
  "applicationCategory": "[Category]",
  "audience": {
    "@type": "Audience",
    "audienceType": "[Persona descriptor]"
  }
}
</script>

## Discovery Attributes
<meta name="product:solves" content="[Problems]">
<meta name="product:ideal-for" content="[Persona]">
<meta name="product:differentiator" content="[Unique aspects]">
```

### Agent System Prompt (dlytful max)

```
You are [Product]'s assistant.

## Voice
You sound like [tone descriptors]. Direct, helpful, human.

You never use words like: [NO list]

## Personality
Your brand archetype is [Primary] with [Secondary] undertones.
This means you [archetype behavioral description].

## Behavior
- Keep responses concise
- Match the user's energy
- Be helpful without being eager
- Sound like [the "sounds like" descriptor]
```

---

## 8. One Week Build Plan

| Day | Focus | Deliverables |
|-----|-------|-------------|
| 1 | Landing + Waitlist | Branded landing page, email capture, Supabase setup, PDF delivery via Resend |
| 2 | Auth + Database | User registration/login, Supabase Auth, database schema |
| 3 | Discovery Flow UI | Question components, progress tracking, state management |
| 4 | Claude Integration | API route for generation, prompt templates, output parsing |
| 5 | Archetype Wheel | Visual component, recommendation logic, selection UI |
| 6 | Results + History | Sprint results page, copy functionality, sprint listing, fork logic |
| 7 | Polish + Deploy | Tier gating, error states, final QA, Vercel deployment |

---

## 9. DRY Rules

- Business logic duplicated → move to `composables/`
- UI repeated → move to `components/ui/`
- Discovery questions → `constants/questions.ts`
- Prompt templates → `constants/prompts.ts`
- Archetype data → `constants/archetypes.ts`
- Tier feature flags → `constants/tiers.ts`
- No direct `$fetch` in components → always via `useApi`
- Types in `types/` and reused everywhere

---

## 10. Out of Scope (v1)

- Stripe payments (Phase 2, after validation)
- Team/sharing features
- Multi-language (i18n)
- Mobile app
- Real-time collaboration
- Advanced analytics
- Custom domains

---

## 11. Known Unknowns

- Will users want to compare multiple archetype combinations?
- How much iteration do users do before settling on a result?
- Is markdown export enough or do users want formatted PDF?
- Do dlytful max users actually use the agent system prompt?

---

## 12. Type Definitions

```typescript
// types/user.ts
interface User {
  id: string
  email: string
  tier: 'free' | 'one' | 'max'
  sprints_count: number
  created_at: string
}

// types/sprint.ts
interface Sprint {
  id: string
  user_id: string
  parent_id: string | null
  label: string | null
  inputs: DiscoveryInputs
  outputs: GeneratedOutputs
  archetype_primary: string | null
  archetype_secondary: string | null
  status: 'draft' | 'complete'
  created_at: string
  updated_at: string
}

interface DiscoveryInputs {
  product_description?: string
  core_moment?: string
  current_state?: string
  target_persona?: string
  friend_description?: string
  prior_frustration?: string
  not_like?: string
  jargon_check?: string
  opposite?: string
  perfect_day?: string
  archetype_primary?: string
  archetype_secondary?: string
  validation_feedback?: string
}

interface GeneratedOutputs {
  positioning?: string
  rebrand_prompt?: string
  foundation_prompt?: string
  discoverability_prompt?: string
  agent_prompt?: string
  copy_angles?: string[]
  social_bio?: string
  voice_rules?: VoiceRules
}

interface VoiceRules {
  sounds_like: string[]
  never_like: string[]
  never_words: string[]
}

// types/archetype.ts
interface Archetype {
  id: string
  name: string
  description: string
  energy: string
  examples: string[]
  color: string
}
```

---

## 13. Environment Variables

```bash
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Claude API
ANTHROPIC_API_KEY=

# Resend
RESEND_API_KEY=

# App
NUXT_PUBLIC_APP_URL=
```

---

## 14. Performance Expectations

- Landing page: < 1s TTFB
- Discovery flow: instant transitions, no spinners between questions
- Generation: show streaming progress, < 10s total
- Results page: instant copy, < 100ms feedback

---

## 15. UX Philosophy

- Fast over fancy
- No blocking spinners. Skeleton loaders where needed.
- Progress indicators for multi-step flows
- Instant feedback on copy actions
- Keyboard navigation for forms
- Error states that help, not blame
- Upgrade prompts that inform, not pressure

---

# End of Dlytful PRD
