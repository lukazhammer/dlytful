# dlytful Build Prompts

Complete prompt set for building dlytful with an AI-assisted IDE (Antigravity, Kilo, Cursor, etc.)

---

## Prompt 1: Project Initialization

```
Create a new Nuxt 3 project with the following configuration:

## Stack
- Nuxt 3 with TypeScript
- Tailwind CSS for styling
- Pinia for state management
- Supabase for auth and database

## Initial Setup
1. Initialize Nuxt 3 project
2. Install dependencies: @nuxtjs/supabase, @pinia/nuxt, @nuxtjs/tailwindcss
3. Configure nuxt.config.ts with these modules
4. Set up Tailwind with custom theme colors:
   - dlytful-sun: #FF9A00
   - dlytful-sky: #007FFF
   - dlytful-cream: #FAF7F2
   - dlytful-herb: #79B972
5. Configure default font: Poppins (Google Fonts)
6. Add Fraunces as secondary font for headings

## Folder Structure
Create this structure:
├── pages/
│   ├── index.vue
│   ├── login.vue
│   ├── register.vue
│   └── sprint/
│       ├── new.vue
│       └── [id].vue
├── layouts/
│   ├── default.vue
│   ├── auth.vue
│   └── app.vue
├── components/
│   ├── ui/
│   ├── waitlist/
│   ├── discovery/
│   └── results/
├── composables/
├── stores/
├── server/
│   └── api/
├── types/
├── constants/
└── middleware/

## Environment Variables Template
Create .env.example with:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ANTHROPIC_API_KEY
- RESEND_API_KEY
- NUXT_PUBLIC_APP_URL

Do not add any placeholder content to pages yet. Just create the file structure.
```

---

## Prompt 2: Type Definitions

```
Create TypeScript type definitions for the dlytful app in the types/ folder:

## types/user.ts
export interface User {
  id: string
  email: string
  tier: 'free' | 'one' | 'max'
  sprints_count: number
  created_at: string
}

export type Tier = User['tier']

## types/sprint.ts
export interface Sprint {
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

export interface DiscoveryInputs {
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

export interface GeneratedOutputs {
  positioning?: string
  rebrand_prompt?: string
  foundation_prompt?: string
  discoverability_prompt?: string
  agent_prompt?: string
  copy_angles?: string[]
  social_bio?: string
  voice_rules?: VoiceRules
}

export interface VoiceRules {
  sounds_like: string[]
  never_like: string[]
  never_words: string[]
}

## types/archetype.ts
export interface Archetype {
  id: string
  name: string
  description: string
  energy: string
  examples: string[]
  color: string
}

export type ArchetypeId = 
  | 'innocent' | 'sage' | 'explorer' | 'outlaw'
  | 'magician' | 'hero' | 'lover' | 'jester'
  | 'everyman' | 'caregiver' | 'ruler' | 'creator'

## types/index.ts
Export all types from a single entry point.
```

---

## Prompt 3: Constants

```
Create constants files for the dlytful app:

## constants/archetypes.ts
Define all 12 brand archetypes with this structure for each:
- id (lowercase, e.g., 'explorer')
- name (e.g., 'The Explorer')
- description (one sentence about the archetype)
- energy (e.g., 'Bold & independent')
- examples (3 real brand examples like 'Figma, Supabase, Notion')
- color (hex color for the wheel segment)

The 12 archetypes are:
1. Innocent - Simple & trustworthy - Notion, Linear - #F5E6D3
2. Sage - Smart & authoritative - Stripe, Vercel - #E8DCC4
3. Explorer - Bold & independent - Figma, Supabase - #9FB97A
4. Outlaw - Disruptive & edgy - Gumroad, Basecamp - #7CB342
5. Magician - Transformative & wow - OpenAI, Midjourney - #26A69A
6. Hero - Empowering & driven - Shopify, GitHub - #4DB6AC
7. Lover - Premium & beautiful - Apple, Framer - #4FC3F7
8. Jester - Fun & irreverent - Discord, Duolingo - #BA68C8
9. Everyman - Relatable & friendly - Slack, Mailchimp - #F48FB1
10. Caregiver - Supportive & helpful - Intercom, Calendly - #EF5350
11. Ruler - Premium & exclusive - Salesforce, AWS - #FF7043
12. Creator - Innovative & expressive - Adobe, Webflow - #FFA726

Export as ARCHETYPES array and a getArchetype(id) helper function.

## constants/questions.ts
Define discovery questions grouped by part:

export interface Question {
  id: string
  part: 1 | 2 | 3 | 4 | 5
  text: string
  placeholder: string
  type: 'textarea' | 'text' | 'select' | 'archetype'
  minTier: 'free' | 'one' | 'max'
}

Questions:
Part 1 (free):
- product_description: "What does your product do? One sentence."
- core_moment: "Walk me through the moment someone uses this and thinks 'this is good.' What's happening?"
- current_state: "Paste your current app URL, or describe what it looks like now."

Part 2 (one):
- target_persona: "Who immediately understands what you've built? Not age and job title. Who are they actually?"
- friend_description: "What would they say about your product to their friends?"
- prior_frustration: "What were they frustrated with before they found you?"

Part 3 (one):
- not_like: "What do you absolutely NOT want your brand to feel like?"
- jargon_check: "Would you ever use words like 'solution' or 'leverage' to describe your product?"
- opposite: "What's the opposite of what you're building?"

Part 4 (one):
- perfect_day: "Describe the feeling of a perfect day. The kind you mention to friends weeks later."
- archetype_selection: (archetype wheel component)

Part 5 (max):
- validation_feedback: "Here's what I'm hearing: [summary]. Does this feel right? What's missing?"

Export as QUESTIONS array and helpers: getQuestionsByPart(part), getQuestionsForTier(tier)

## constants/tiers.ts
export const TIERS = {
  free: {
    name: 'dlytful zero',
    price: 0,
    features: ['3 discovery questions', 'Basic rebrand prompt', 'Watermarked output'],
    maxArchetypes: 0,
    canSave: false,
    canFork: false,
    canExport: false
  },
  one: {
    name: 'dlytful one', 
    price: 14,
    features: ['Full discovery flow', 'Complete rebrand prompt', 'Foundation prompt', '6 archetypes', 'Unlimited saves', 'Fork & iterate'],
    maxArchetypes: 6,
    canSave: true,
    canFork: true,
    canExport: false
  },
  max: {
    name: 'dlytful max',
    price: 29,
    features: ['Everything in dlytful one', '12 archetypes', 'Discoverability prompt', 'Agent system prompt', 'Markdown export', 'Sprint comparison'],
    maxArchetypes: 12,
    canSave: true,
    canFork: true,
    canExport: true
  }
} as const

export type TierKey = keyof typeof TIERS
```

---

## Prompt 4: UI Components

```
Create base UI components for dlytful following the brand guidelines:

## Brand Guidelines Reference
- Primary color: dlytful-sun (#FF9A00) - warm, approachable
- Secondary: dlytful-sky (#007FFF) - clear, calm
- Background: dlytful-cream (#FAF7F2) - off-white, lived-in
- Accent: dlytful-herb (#79B972) - earthy green, sparingly
- Font: Poppins (body), Fraunces (headings)
- Voice: Warm, direct, human. Never corporate.

## components/ui/DlytfulButton.vue
- Props: variant ('primary' | 'secondary' | 'ghost'), disabled, loading, size ('sm' | 'md' | 'lg')
- Primary variant: dlytful-sun background, white text, hover darken
- Secondary variant: dlytful-sky background, white text
- Ghost variant: transparent, dlytful-sun text, hover background
- Loading state shows subtle spinner
- Generous padding, rounded-lg, font-medium
- Emits: click

## components/ui/DlytfulInput.vue
- Props: label, placeholder, error, modelValue, type ('text' | 'email' | 'password' | 'textarea')
- Clean input with dlytful-cream background
- Label above in Poppins
- Error state with red border and message below
- Focus ring in dlytful-sun
- Emits: update:modelValue

## components/ui/DlytfulCard.vue
- Props: variant ('default' | 'elevated' | 'bordered')
- Default: white background, subtle shadow
- Elevated: larger shadow
- Bordered: border instead of shadow
- Rounded-xl, generous padding
- Slot for content

## components/ui/CopyButton.vue
- Props: content (string to copy)
- Shows copy icon, changes to checkmark on success
- Tooltip: "Copy" / "Copied!"
- Uses useClipboard composable
- Emits: copied

## components/ui/DlytfulLogo.vue
- Props: size ('sm' | 'md' | 'lg'), variant ('full' | 'mark')
- Full variant: "dlytful" wordmark in Fraunces
- Mark variant: stylized "D" 
- Uses dlytful-sun as primary color

All components should:
- Use Tailwind classes
- Be fully typed with TypeScript
- Include subtle transitions (150ms ease)
- Feel warm and approachable, not cold/corporate
```

---

## Prompt 5: Composables

```
Create composables for the dlytful app:

## composables/useApi.ts
Unified HTTP client wrapping $fetch:
- Methods: get<T>, post<T>, put<T>, del<T>
- Automatically includes auth token from user store
- Error handling with toast notifications
- Returns typed responses

## composables/useAuth.ts
Authentication state and methods:
- State: user (User | null), isAuthenticated (computed)
- Methods: login(email, password), register(email, password), logout()
- Uses Supabase auth
- Updates user store on auth changes
- Handles session persistence

## composables/useDiscovery.ts
Discovery flow state management:
- State: currentStep, answers (DiscoveryInputs), isComplete
- Methods: 
  - setAnswer(questionId, value)
  - nextStep()
  - prevStep()
  - canProceed (computed based on required fields)
  - getQuestionsForCurrentTier()
- Integrates with sprint store
- Validates required fields before proceeding

## composables/useGenerate.ts
Trigger prompt generation:
- State: loading, error, outputs
- Methods: generate(sprintId) - calls API and updates sprint store
- Handles streaming response display (optional)

## composables/useClipboard.ts
Copy to clipboard utility:
- State: copied (boolean, resets after 2s)
- Methods: copy(text)
- Uses navigator.clipboard API

## composables/useTier.ts
User tier checks:
- State: tier (from user store)
- Methods:
  - canAccess(feature: string): boolean
  - isFreeTier: computed
  - isPaidTier: computed
  - tierConfig: returns TIERS[tier]

All composables should:
- Be fully typed
- Handle errors gracefully
- Use Pinia stores where appropriate
```

---

## Prompt 6: Pinia Stores

```
Create Pinia stores for the dlytful app:

## stores/user.ts
interface UserState {
  user: User | null
  token: string | null
}

- Actions: setUser, clearUser, updateTier
- Getters: isAuthenticated, tier, canSave, canFork, canExport
- Persist to localStorage (user and token)

## stores/sprint.ts
interface SprintState {
  currentSprint: Sprint | null
  sprints: Sprint[]
  draftInputs: DiscoveryInputs
}

- Actions:
  - setDraftInput(key, value) - updates draftInputs
  - createSprint(inputs) - creates new sprint via API
  - loadSprint(id) - fetches single sprint
  - loadSprints() - fetches user's sprints
  - updateSprint(id, data) - updates sprint
  - setOutputs(outputs) - sets generated outputs on currentSprint
  - forkSprint(id) - creates new sprint with parent_id
- Getters:
  - sprintTree - organizes sprints by parent relationships
  - hasUnsavedChanges

## stores/ui.ts
interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface UIState {
  toasts: Toast[]
  loading: boolean
  modal: string | null
}

- Actions:
  - showToast(type, message) - adds toast, auto-removes after 3s
  - removeToast(id)
  - setLoading(value)
  - openModal(name)
  - closeModal()
- No persistence
```

---

## Prompt 7: Layouts

```
Create layouts for the dlytful app following brand guidelines:

## layouts/default.vue
Landing page layout:
- Full-width, dlytful-cream background
- Minimal nav: DlytfulLogo on left, "Get Early Access" button on right (links to email form)
- Footer: "For indie builders who ship with intention." + copyright
- Slot in center
- Clean, spacious, warm feeling

## layouts/auth.vue
Login/register layout:
- Centered card on dlytful-cream background
- DlytfulLogo above the card
- Card contains slot (form content)
- Link below card to switch between login/register
- No nav, minimal distractions

## layouts/app.vue
Authenticated app shell:
- Sidebar on left (collapsible on mobile):
  - DlytfulLogo at top
  - Nav items: "New Sprint", "My Sprints" (if paid), "Settings"
  - User email and tier badge at bottom
  - Logout button
- Main content area with slot
- dlytful-cream background
- Warm, productive feeling

All layouts should:
- Use Tailwind
- Include smooth transitions
- Be responsive (mobile-first)
- Feel cohesive with dlytful brand
```

---

## Prompt 8: Landing Page + Waitlist

```
Create the landing page and waitlist functionality for dlytful:

## pages/index.vue

A single-page landing that captures emails and delivers the free PDF.

### Hero Section
- Headline: "You built something. Now make it look like it has a soul."
- Subhead: "Paste one prompt into Bolt. See the difference."
- Email input + "Get Early Access" button (DlytfulButton primary)
- Below button: "Get the free brand kit instantly"

### Problem Section
- Small heading: "The gap"
- Text: "You shipped with Cursor, Bolt, or Replit. It works. But it looks like... a template. Same fonts as everyone else. No clear message. No reason to remember you."
- Keep it short, 2-3 sentences max

### Solution Section
- Small heading: "The translation"
- Text: "dlytful translates what you meant into what people see. Answer a few questions about your product. Get a prompt. Paste it. Watch your app transform."

### How It Works Section
Three steps, simple icons or numbers:
1. "Tell us about your product" (2 min)
2. "Get your brand translation"
3. "Paste into Bolt, see it come to life"

### Final CTA Section
- Repeat email capture form
- "Join the waitlist. Get the free brand kit immediately."

### Design Notes
- Use dlytful-cream background
- Generous whitespace between sections
- Text in dark gray (#1a1a1a), not pure black
- Headings in Fraunces, body in Poppins
- Subtle animations on scroll (fade in)
- Mobile responsive
- No images needed, let the copy breathe

## components/waitlist/EmailForm.vue

- Props: variant ('hero' | 'footer') for slight styling differences
- State: email, loading, success, error
- On submit:
  - Validate email client-side
  - Call /api/waitlist POST
  - On success: show confirmation message, hide form
  - On error: show error message
- Success message: "Check your inbox. The brand kit is on its way."
- Use DlytfulInput and DlytfulButton components

## server/api/waitlist.post.ts

// Expected request body
interface WaitlistRequest {
  email: string
}

// Response
interface WaitlistResponse {
  success: boolean
  message?: string
}

Endpoint logic:
1. Validate email format
2. Check if email already exists in waitlist table
   - If exists: return { success: true } (don't reveal duplicate)
3. Insert into Supabase waitlist table
4. Trigger email via Resend with PDF attachment
5. Return { success: true }

Error handling:
- Invalid email: 400 { error: "Please enter a valid email" }
- Server error: 500 { error: "Something went wrong. Please try again." }

## server/api/send-welcome.ts (helper, called internally)

Sends the welcome email with PDF:
- Use Resend SDK
- From: "dlytful <hello@dlytful.com>" (or your domain)
- Subject: "Your brand kit is here"
- Body: Simple, warm welcome + PDF attached
- PDF file: store in /public/brand-kit.pdf or fetch from assets

Email copy:
Hey,

Thanks for joining the dlytful waitlist.

Attached is "The I Built This in a Weekend Brand Kit" — a quick framework to give your app a real identity.

Inside:
- 1-sentence positioning template
- 4-question mission builder  
- Brand archetype selector
- 24-hour brand sprint checklist

When dlytful launches, you'll be first to know. We're building something that makes this whole process even faster.

Talk soon.

No HTML template needed — plain text is fine for v1, feels more personal anyway.
```

---

## Prompt 9: Supabase Schema Setup

```
Create the Supabase database schema for dlytful:

## SQL Migration

Run this in Supabase SQL editor:

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Waitlist table (Phase 1)
create table public.waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  source text default 'landing',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Allow inserts from anon (for waitlist signups)
create policy "Allow anonymous waitlist signups" on public.waitlist
  for insert with check (true);

-- Users table (Phase 2)
create table public.users (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  tier text default 'free' check (tier in ('free', 'one', 'max')),
  sprints_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.users enable row level security;

create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Sprints table
create table public.sprints (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  parent_id uuid references public.sprints on delete set null,
  label text,
  inputs jsonb default '{}'::jsonb,
  outputs jsonb default '{}'::jsonb,
  archetype_primary text,
  archetype_secondary text,
  status text default 'draft' check (status in ('draft', 'complete')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.sprints enable row level security;

create policy "Users can view own sprints" on public.sprints
  for select using (auth.uid() = user_id);

create policy "Users can insert own sprints" on public.sprints
  for insert with check (auth.uid() = user_id);

create policy "Users can update own sprints" on public.sprints
  for update using (auth.uid() = user_id);

create policy "Users can delete own sprints" on public.sprints
  for delete using (auth.uid() = user_id);

-- Indexes
create index sprints_user_id_idx on public.sprints(user_id);
create index sprints_parent_id_idx on public.sprints(parent_id);
create index sprints_created_at_idx on public.sprints(created_at desc);

-- Function to auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger for sprint updates
create trigger sprints_updated_at
  before update on public.sprints
  for each row execute procedure public.update_updated_at();

## Supabase Configuration Notes

1. Enable Email Auth in Authentication settings
2. Disable email confirmation for faster testing (optional, re-enable for production)
3. Set up your site URL in Auth settings
4. Add redirect URLs for your local and production domains
```

---

## Prompt 10: Auth Pages

```
Create authentication pages for dlytful:

## pages/login.vue

Using auth layout:
- Heading: "Welcome back"
- Subhead: "Continue building your brand"
- Form fields:
  - Email (DlytfulInput, type="email")
  - Password (DlytfulInput, type="password")
- Submit button: "Sign in" (DlytfulButton primary, full width)
- Below form: "Don't have an account? Sign up" (link to /register)
- Error display for invalid credentials

On submit:
- Call useAuth().login(email, password)
- On success: redirect to /sprint/new
- On error: show error message

## pages/register.vue

Using auth layout:
- Heading: "Start translating"
- Subhead: "Create your dlytful account"
- Form fields:
  - Email (DlytfulInput, type="email")
  - Password (DlytfulInput, type="password")
  - Confirm password (DlytfulInput, type="password")
- Submit button: "Create account" (DlytfulButton primary, full width)
- Below form: "Already have an account? Sign in" (link to /login)
- Password validation: minimum 8 characters
- Error display for validation and server errors

On submit:
- Validate passwords match
- Call useAuth().register(email, password)
- On success: redirect to /sprint/new
- On error: show error message

## middleware/auth.global.ts

Global middleware that:
- Checks if user is authenticated via useAuth()
- Protected routes: /sprint/*, /sprints
- If not authenticated and accessing protected route: redirect to /login
- Store intended destination for post-login redirect

## middleware/guestOnly.ts

Named middleware for auth pages:
- If authenticated: redirect to /sprint/new
- Apply to /login and /register pages

## Design Notes
- Forms centered in viewport
- DlytfulLogo above the card
- Card uses DlytfulCard elevated variant
- Warm, minimal, focused on the task
- Loading state on button during submission
- Smooth transitions between login/register
```

---

## Prompt 11: Discovery Flow

```
Create the discovery flow for dlytful:

## pages/sprint/new.vue

The main discovery experience. A multi-step form that feels like a conversation, not a survey.

### Page Structure
- Progress bar at top (ProgressBar component)
- Single question displayed at a time
- Large, generous spacing
- "Back" link (subtle, top left) and "Continue" button (bottom right)
- Auto-save draft inputs to sprint store

### Flow Logic
- Load questions based on user tier using getQuestionsForTier()
- Track currentStep in useDiscovery composable
- Validate current answer before allowing "Continue"
- On final step: show "Generate" button instead of "Continue"
- On generate: call API, redirect to /sprint/[id]

### Special Steps
- Archetype selection (Part 4): render ArchetypeWheel component instead of text input
- Validation step (Part 5, dlytful max only): show summary of their answers with editable confirmation

### Transitions
- Smooth fade/slide between questions
- No jarring page reloads
- Feel like a guided conversation

### Free Tier Handling
- After Part 1 (3 questions): show "Generate" button
- Display upgrade prompt: "Unlock deeper insights with dlytful one" (non-blocking, subtle)

### URL Structure
- /sprint/new - fresh start
- /sprint/new?fork=[id] - pre-populate from existing sprint

## components/discovery/ProgressBar.vue

- Props: current (number), total (number), parts (array of part labels)
- Visual: horizontal bar with segments for each part
- Current part highlighted in dlytful-sun
- Completed parts in dlytful-herb
- Future parts in gray
- Part labels below: "Your Product", "Your Audience", "Your Edge", "Your Vibe", "Confirm"
- Responsive: hide labels on mobile, show dots only

## components/discovery/QuestionStep.vue

- Props: question (Question type), modelValue (string), isLast (boolean)
- Display:
  - Question text large, in Fraunces (like a conversation prompt)
  - Placeholder text in the input
  - Helper text below if provided
- Input type based on question.type:
  - 'text': DlytfulInput
  - 'textarea': DlytfulInput with type="textarea", auto-growing
  - 'select': styled select dropdown
  - 'archetype': slot for ArchetypeWheel
- Emits: update:modelValue, next, back

## components/discovery/DiscoverySummary.vue (for Part 5)

- Props: inputs (DiscoveryInputs)
- Displays all previous answers in a readable format
- Grouped by part with subtle headings
- Each answer editable inline (click to edit)
- "This is what I'm hearing..." framing
- Warm, reflective tone

### Design Notes
- Background: white or very light, not dlytful-cream (differentiate from landing)
- Centered content, max-width 640px
- Question text: 24-28px, dark, Fraunces
- Input fields: generous size, easy to type in
- Feels calm, focused, intentional
- No distractions, no sidebar during flow
```

---

## Prompt 12: Archetype Wheel

```
Create the archetype wheel component for dlytful:

## components/discovery/ArchetypeWheel.vue

A visual wheel showing all 12 brand archetypes with intelligent recommendations.

### Props
- recommended: string[] (archetype IDs recommended based on inputs)
- selected: { primary: string | null, secondary: string | null }
- available: number (6 for dlytful one, 12 for dlytful max)
- disabled: boolean (true for dlytful zero, shows result only)

### Emits
- update:selected ({ primary, secondary })

### Visual Design
- Circular wheel divided into 12 segments
- Each segment is one archetype with:
  - Color fill from ARCHETYPES constant
  - Archetype name around the outer edge
  - Icon or symbol in the center of segment (optional, can use initials)
- Wheel size: 400px desktop, 300px mobile

### States
- Recommended archetypes: full saturation, subtle glow/pulse
- Non-recommended: desaturated (40% opacity), still visible
- Selected primary: bold ring/border in dlytful-sun
- Selected secondary: thinner ring in dlytful-sky
- Unavailable (tier-locked): grayed out with lock icon, tooltip "Upgrade to dlytful max"

### Interaction
- Click segment to select as primary
- Click again to deselect
- Shift+click or second click on different segment to select secondary
- Or: explicit "Set as secondary" button appears after primary selected
- Hover shows archetype name + one-line description

### Recommendation Panel
Below or beside the wheel:
- "Based on what you've shared..." 
- List 2-3 recommended archetypes with reasoning
- Example: "Explorer — because you value independence and finding your own path"
- Reasoning derived from their inputs (passed from parent)

### Mobile Adaptation
- Wheel may be too complex for small screens
- Alternative: horizontal scrolling cards for mobile
- Each card shows archetype name, description, examples
- Recommended cards highlighted
- Tap to select

## components/discovery/ArchetypeCard.vue

For mobile view and detail panel:

- Props: archetype (Archetype), isRecommended, isSelected, isLocked
- Display:
  - Colored header bar
  - Name in Fraunces
  - Energy tagline (e.g., "Bold & independent")
  - Description
  - Example brands
- States: normal, recommended (subtle glow), selected (border), locked (grayed)
- Click to select (if not locked)

## server/api/archetype/recommend.post.ts

Analyzes discovery inputs and returns recommended archetypes:

interface RecommendRequest {
  inputs: Partial<DiscoveryInputs>
}

interface RecommendResponse {
  recommended: string[] // archetype IDs, max 3
  reasoning: Record<string, string> // archetype ID -> reason
}

Logic:
- Use Claude API to analyze inputs
- Prompt: "Based on these product discovery answers, which 2-3 brand archetypes fit best? Explain why in one sentence each."
- Parse response into structured format
- Return top 3 with reasoning

Keep it fast — this should feel instant. Cache if same inputs seen before.
```

---

## Prompt 13: Prompt Generation API

```
Create the prompt generation backend for dlytful:

## server/api/sprint/generate.post.ts

The core API that transforms discovery inputs into Bolt-ready prompts.

### Request
interface GenerateRequest {
  sprint_id: string
}

### Response
interface GenerateResponse {
  outputs: GeneratedOutputs
}

### Logic Flow

1. Validate user authentication
2. Fetch sprint by ID, verify ownership
3. Check user tier for output access
4. Build prompt for Claude based on tier:
   - dlytful zero: basic rebrand prompt only
   - dlytful one: full rebrand + foundation + copy angles
   - dlytful max: everything + discoverability + agent prompt
5. Call Claude API with structured prompt
6. Parse response into GeneratedOutputs shape
7. Save outputs to sprint record
8. Update sprint status to 'complete'
9. Return outputs

### Claude Prompt Structure

System prompt:
You are a brand strategist who translates product descriptions into clear, actionable brand direction. You write for indie developers who use tools like Bolt, Cursor, and Replit.

Your outputs should be:
- Immediately usable (copy-paste ready)
- Warm and human, never corporate
- Specific and concrete, not vague
- Focused on visual and verbal identity

Never use words like: synergy, leverage, solution, cutting-edge, innovative, seamless, robust.

User prompt (constructed from inputs):
Based on this product discovery:

PRODUCT: {product_description}
CORE MOMENT: {core_moment}
CURRENT STATE: {current_state}
TARGET PERSONA: {target_persona}
WHAT THEY'D SAY: {friend_description}
PRIOR FRUSTRATION: {prior_frustration}
NOT LIKE THIS: {not_like}
JARGON CHECK: {jargon_check}
OPPOSITE: {opposite}
PERFECT DAY FEELING: {perfect_day}
PRIMARY ARCHETYPE: {archetype_primary}
SECONDARY ARCHETYPE: {archetype_secondary}

Generate the following outputs in JSON format:
{output_requirements_based_on_tier}

### Output Requirements by Tier

**dlytful zero:**
{
  "positioning": "One sentence positioning statement",
  "rebrand_prompt": "Basic prompt for Bolt to rebrand existing app"
}

**dlytful one:**
{
  "positioning": "One sentence positioning statement",
  "rebrand_prompt": "Full detailed prompt for Bolt rebrand",
  "foundation_prompt": "Prompt for building new app with brand",
  "copy_angles": ["angle 1", "angle 2", "angle 3"],
  "social_bio": "Twitter/social bio",
  "voice_rules": {
    "sounds_like": ["descriptor 1", "descriptor 2"],
    "never_like": ["anti-descriptor 1", "anti-descriptor 2"],
    "never_words": ["word 1", "word 2", "word 3"]
  }
}

**dlytful max:**
All of the above, plus:
{
  "discoverability_prompt": "Prompt to inject metadata into HTML",
  "agent_prompt": "System prompt for product's AI assistant"
}

### Prompt Templates

Store in constants/prompts.ts and import here.

**Rebrand Prompt Template (Full):**
I have an existing app. Keep all current functionality exactly as is.

Apply these brand changes:

## Product
{positioning}

## Target User
{persona_summary}
They would describe this as: "{friend_description}"

## Brand Energy
Primary: {archetype_primary} — {archetype_description}
Secondary: {archetype_secondary} — {archetype_description}

## Visual Identity
Colors:
- Primary: {color_hex} — {color_usage}
- Secondary: {color_hex} — {color_usage}
- Background: {color_hex}
- Accent: {color_hex} — sparingly

Typography:
- Headlines: {font}
- Body: {font}

Energy: {perfect_day_feeling}

## Voice
Sounds like: {sounds_like}
Never sounds like: {never_like}
Never use: {never_words}

## Avoid
{not_like_summary}

Do not change any features or functionality. Only change how it looks and sounds.

### Error Handling
- Missing required inputs: 400 with specific field errors
- Tier access denied: 402 with upgrade prompt
- Claude API failure: 500 with retry suggestion
- Sprint not found: 404
```

---

## Prompt 14: Results Page

```
Create the sprint results page for dlytful:

## pages/sprint/[id].vue

Displays generated outputs with copy functionality.

### Page Structure
- Header: Sprint label (editable) + created date
- Tier badge showing what tier generated this
- Tab navigation for different outputs (if multiple)
- Main content: prompt blocks
- Sidebar (desktop) or bottom bar (mobile): actions

### Output Display

Each output in a PromptBlock component:
1. **Positioning Statement** — always visible first
2. **Rebrand Prompt** — the main deliverable, prominent
3. **Foundation Prompt** — for new builds (dlytful one+)
4. **Copy Angles** — 3 bullets (dlytful one+)
5. **Social Bio** — short, copy-ready (dlytful one+)
6. **Voice Rules** — formatted list (dlytful one+)
7. **Discoverability Prompt** — code block (dlytful max)
8. **Agent System Prompt** — code block (dlytful max)

### Locked Content Display
For outputs user's tier can't access:
- Show blurred preview
- Overlay: "Unlock with dlytful one/max"
- Upgrade button

### Actions Sidebar
- "Copy All" — copies main rebrand prompt
- "Fork & Iterate" — creates new sprint from this one (paid tiers)
- "Export" — downloads markdown (dlytful max)
- "Share" — future feature, show "coming soon"

### Sprint Label
- Click to edit inline
- Default: "Sprint — {date}"
- Saves on blur

## components/results/PromptBlock.vue

- Props: title, content, type ('text' | 'code' | 'list'), locked
- Display:
  - Title in Fraunces
  - Content in monospace for code, Poppins for text
  - Syntax highlighting for code blocks (optional, subtle)
  - Copy button top-right
- Locked state:
  - Content blurred (CSS filter)
  - Lock icon overlay
  - "Upgrade to unlock" text

## components/results/CopyAllButton.vue

- Copies the main rebrand prompt
- Large, prominent button
- State: default → copying → copied (with checkmark)
- "Paste this into Bolt" helper text below

## components/results/ExportMenu.vue (dlytful max)

- Dropdown with export options:
  - "Download Markdown" — .md file
  - "Copy for Notion" — markdown formatted for Notion paste
- Triggers /api/sprint/[id]/export endpoint

## server/api/sprint/[id]/export.get.ts

Generates markdown export:

// GET /api/sprint/:id/export
// Returns: markdown file download

Logic:
1. Verify user owns sprint
2. Verify user is dlytful max tier
3. Build markdown from sprint outputs
4. Return as file download with Content-Disposition header

Markdown template:
# Brand Foundation — {product_name}

Generated with dlytful

---

## Positioning
{positioning}

## Target Audience
{persona_summary}

## Brand Archetype
**Primary:** {archetype_primary}
**Secondary:** {archetype_secondary}

## Voice & Tone

### Sounds Like
{sounds_like_list}

### Never Sounds Like
{never_like_list}

### Words to Avoid
{never_words_list}

---

## Prompts

### Rebrand Prompt
{rebrand_prompt}

### Foundation Prompt
{foundation_prompt}

### Discoverability Metadata
{discoverability_prompt}

### Agent System Prompt
{agent_prompt}

---

## Copy Angles
{copy_angles_list}

## Social Bio
{social_bio}

### Design Notes
- Clean, scannable layout
- Prompts are the hero — make them easy to copy
- Generous whitespace
- Subtle background differentiation for code blocks
- Mobile: stack everything vertically, full-width copy buttons
- Success feedback on every copy action (toast or inline)
```

---

## Prompt 15: Sprint History

```
Create the sprint history page for dlytful (paid tiers only):

## pages/sprints/index.vue

List of user's sprints with fork relationships visible.

### Access Control
- Apply paidOnly middleware
- If free tier visits: show upgrade prompt, not the page

### Page Structure
- Header: "Your Sprints"
- Subhead: "Fork and iterate on your brand translations"
- Filter/sort options: "Recent" | "Oldest" | "By Project" (future)
- Sprint list or tree view

### Sprint Display

Two view options (toggle):

**List View (default):**
- Cards in reverse chronological order
- Each card shows:
  - Label (or "Untitled Sprint")
  - Created date
  - Status badge (draft/complete)
  - Archetype chips (primary + secondary)
  - Forked from indicator (if applicable)
- Click to open /sprint/[id]

**Tree View:**
- Visual representation of fork relationships
- Parent sprints with children indented/connected
- Shows iteration history
- Useful for seeing evolution

### Empty State
- "No sprints yet"
- "Start your first brand translation"
- Button to /sprint/new

### Actions per Sprint
- Hover/click reveals: Open, Fork, Delete
- Delete requires confirmation

## components/sprints/SprintCard.vue

- Props: sprint (Sprint)
- Display:
  - Label with edit icon
  - Relative date ("2 days ago")
  - Status: draft (yellow) / complete (green)
  - Archetype badges
  - Fork indicator: "Forked from {parent_label}"
- Click: navigate to sprint
- Compact but informative

## components/sprints/SprintTree.vue

- Props: sprints (Sprint[])
- Builds tree from parent_id relationships
- Visual:
  - Root sprints at top
  - Lines connecting parents to children
  - Indentation for depth
  - Collapse/expand for large trees
- Each node is a mini SprintCard

## middleware/paidOnly.ts

Named middleware:
- Check user tier via useTier()
- If tier === 'free': redirect to /sprint/new with upgrade modal trigger
- Allow 'one' and 'max' tiers through

### Design Notes
- Clean table/card layout
- Easy scanning
- Quick actions on hover
- Mobile: simplified list, no tree view
- Loading skeleton while fetching
```

---

## Prompt 16: Toast Notifications

```
Create the toast notification system for dlytful:

## components/ui/ToastContainer.vue

Global container for toast notifications, rendered at app level.

### Structure
- Fixed position: bottom-right on desktop, bottom-center on mobile
- Stack toasts vertically, newest on top
- Max 3 visible at once (older ones hidden)
- Z-index above everything else

### Animation
- Enter: slide in from right + fade in (300ms ease-out)
- Exit: fade out + slide down (200ms ease-in)
- Use Vue Transition or TransitionGroup

## components/ui/Toast.vue

Individual toast component.

### Props
- toast: { id, type, message }

### Types & Styling
- success: dlytful-herb background, white text, checkmark icon
- error: red-500 background, white text, X icon
- info: dlytful-sky background, white text, info icon

### Structure
- Icon left
- Message center (Poppins, 14px)
- Dismiss X button right
- Rounded-lg, subtle shadow
- Max-width: 360px

### Behavior
- Auto-dismiss after 3 seconds (success/info) or 5 seconds (error)
- Click X to dismiss immediately
- Hover pauses auto-dismiss timer
- Click toast body does nothing (prevents accidental dismiss)

## Integration in app.vue or layouts

Add ToastContainer to root layout:
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ToastContainer />
  </div>
</template>

## Usage via composable

The useApi and other composables should use ui store:
const uiStore = useUIStore()
uiStore.showToast('success', 'Copied to clipboard')
uiStore.showToast('error', 'Something went wrong')

## Common toast messages

Define in constants/messages.ts:
export const TOAST_MESSAGES = {
  COPIED: 'Copied to clipboard',
  SAVED: 'Changes saved',
  SPRINT_CREATED: 'Sprint created',
  SPRINT_DELETED: 'Sprint deleted',
  GENERATION_COMPLETE: 'Your brand translation is ready',
  GENERATION_FAILED: 'Generation failed. Please try again.',
  EXPORT_READY: 'Export downloaded',
  NETWORK_ERROR: 'Connection error. Please check your internet.',
  UPGRADE_REQUIRED: 'Upgrade to unlock this feature'
}
```

---

## Prompt 17: Settings Page

```
Create the settings page for dlytful:

## pages/settings.vue

User account settings with tier management.

### Access
- Protected route (auth middleware)
- Available to all tiers

### Page Structure

Using app layout with settings-specific styling:

**Section 1: Account**
- Email (display only, with change option future)
- Member since date
- "Sign out" button (secondary/ghost)

**Section 2: Your Plan**
Current plan card:
- Plan name: "dlytful zero/one/max"
- Price: "Free" / "$14/month" / "$29/month"
- Features list (checkmarks)
- If free: "Upgrade" button (prominent)
- If paid: "Manage subscription" button (links to Stripe portal, future)

Upgrade cards (if not on max):
- Show next tier(s) available
- Feature comparison
- "Upgrade to dlytful one/max" buttons

**Section 3: Data**
- "Export all data" — download all sprints as JSON (future)
- "Delete account" — danger zone, confirmation required

### Upgrade Flow Trigger
- Clicking upgrade opens upgrade modal (or redirects to /upgrade)
- For v1 without Stripe: show "Coming soon — join waitlist for early pricing"

## components/settings/PlanCard.vue

- Props: tier (TierKey), isCurrent (boolean), onUpgrade (function)
- Display:
  - Tier name in Fraunces
  - Price
  - Features with checkmarks
  - CTA button (if not current)
- Current plan: highlighted border in dlytful-sun
- Other plans: subtle border

## components/settings/DangerZone.vue

- Delete account section
- Red warning styling
- Requires typing "DELETE" to confirm
- Calls delete account API
- Signs out and redirects to landing

### Design Notes
- Clean, organized sections
- Cards for visual grouping
- Generous spacing
- Mobile: full-width cards, stacked
- No sidebar on mobile for settings
```

---

## Prompt 18: Upgrade Flow

```
Create the upgrade flow for dlytful:

## components/upgrade/UpgradeModal.vue

Modal that appears when user tries to access tier-locked features.

### Trigger Points
- Accessing Part 2-4 questions on free tier
- Clicking locked output on results page
- Visiting /sprints on free tier
- Fork action on free tier
- Export action on dlytful one tier

### Props
- isOpen: boolean
- requiredTier: 'one' | 'max'
- feature: string (what they were trying to access)
- onClose: function
- onUpgrade: function

### Modal Content

Header:
- "Unlock {feature}" or "Upgrade to dlytful {tier}"
- Close X button

Body:
- Brief explanation of what they get
- Feature comparison (current vs. required tier)
- Price: "$14/month" or "$29/month"

For dlytful one:
Unlock the full discovery flow.

✓ Deep persona insights
✓ Voice and tone rules  
✓ Complete rebrand prompt
✓ Save unlimited sprints
✓ Fork and iterate

$14/month

For dlytful max:
Get the complete brand system.

✓ Everything in dlytful one
✓ All 12 archetypes
✓ Discoverability metadata
✓ Custom agent prompt
✓ Markdown export

$29/month

Footer:
- "Upgrade now" button (primary)
- "Maybe later" link (closes modal)

### Stripe Integration (Phase 2)

For v1 without Stripe:
- "Upgrade now" shows: "We're launching soon. Get early access pricing."
- Email capture or "Join waitlist" button
- Store interest in database for outreach

When Stripe is ready:
- Redirect to Stripe Checkout
- Success URL: /settings?upgraded=true
- Cancel URL: back to current page

## composables/useUpgrade.ts

export const useUpgrade = () => {
  const showUpgradeModal = ref(false)
  const requiredTier = ref<'one' | 'max'>('one')
  const blockedFeature = ref('')

  const promptUpgrade = (tier: 'one' | 'max', feature: string) => {
    requiredTier.value = tier
    blockedFeature.value = feature
    showUpgradeModal.value = true
  }

  const closeUpgrade = () => {
    showUpgradeModal.value = false
  }

  return {
    showUpgradeModal,
    requiredTier,
    blockedFeature,
    promptUpgrade,
    closeUpgrade
  }
}

Provide at app level, inject where needed.

## Integration Examples

In discovery flow:
const { promptUpgrade } = useUpgrade()
const tier = useTier()

const handleNext = () => {
  if (currentStep.value >= 3 && tier.isFreeTier) {
    promptUpgrade('one', 'full discovery flow')
    return
  }
  // proceed normally
}

In results page:
const handleExport = () => {
  if (!tier.canExport) {
    promptUpgrade('max', 'markdown export')
    return
  }
  // proceed with export
}

### Design Notes
- Modal centered, max-width 480px
- Backdrop blur/dim
- Smooth fade in/out
- Not pushy — easy to dismiss
- Clear value proposition
- Mobile: nearly full-width with padding
```

---

## Prompt 19: Error States and Loading

```
Create consistent error and loading states for dlytful:

## components/ui/LoadingSpinner.vue

- Props: size ('sm' | 'md' | 'lg'), color (default: dlytful-sun)
- Simple animated spinner
- CSS-only, no external dependencies
- Centered by default

## components/ui/LoadingSkeleton.vue

- Props: variant ('text' | 'card' | 'button' | 'circle'), width, height
- Animated shimmer effect
- Matches component shapes
- dlytful-cream base with lighter shimmer

## components/ui/ErrorState.vue

- Props: title, message, retryable, onRetry
- Display:
  - Icon (warning or error)
  - Title: "Something went wrong" (default)
  - Message: specific error or generic
  - "Try again" button (if retryable)
- Centered in container
- Warm, not alarming (it's okay, these things happen)

## components/ui/EmptyState.vue

- Props: icon, title, message, actionLabel, onAction
- Display:
  - Illustration or icon
  - Title: "No sprints yet"
  - Message: "Start your first brand translation"
  - Action button
- Used in: sprint history, empty results

## Page-Level Loading States

### Discovery Flow Loading
- Show skeleton for question area while loading user data
- Smooth transition when ready

### Results Page Loading
- Skeleton cards for each output block
- Stagger animation (first block, then second, etc.)

### Sprint History Loading
- Skeleton cards in grid/list
- Match SprintCard dimensions

### Generation Loading
- Full-page takeover with:
  - dlytful logo (subtle animation)
  - "Translating your brand..." text
  - Progress indication (optional, or just spinner)
  - Estimated time: "Usually takes about 10 seconds"
- Prevent navigation during generation

## Error Handling Patterns

### API Errors
// In useApi composable
const handleError = (error: any) => {
  const uiStore = useUIStore()
  
  if (error.status === 401) {
    // Session expired
    useAuth().logout()
    navigateTo('/login')
    return
  }
  
  if (error.status === 402) {
    // Upgrade required
    const { promptUpgrade } = useUpgrade()
    promptUpgrade(error.data.required_tier, error.data.feature)
    return
  }
  
  if (error.status === 429) {
    uiStore.showToast('error', 'Too many requests. Please wait a moment.')
    return
  }
  
  // Generic error
  uiStore.showToast('error', error.data?.message || 'Something went wrong')
}

### Form Validation Errors
- Inline errors below fields (red text)
- Focus first error field
- Scroll into view if needed

### Network Errors
- Toast: "Connection error. Please check your internet."
- Retry button in context

### Design Notes
- Loading states should feel calm, not anxious
- Errors should be helpful, not blaming
- Always provide a way forward (retry, go back, contact support)
- Use dlytful-sun for spinners/progress (warmth, not sterile)
```

---

## Prompt 20: Final Polish and Deployment

```
Final polish and deployment preparation for dlytful:

## SEO and Meta

### nuxt.config.ts additions
app: {
  head: {
    title: 'dlytful — Brand translation for indie builders',
    meta: [
      { name: 'description', content: 'Transform your app from generic template to memorable brand. Paste one prompt into Bolt. See the difference.' },
      { property: 'og:title', content: 'dlytful — Brand translation for indie builders' },
      { property: 'og:description', content: 'Transform your app from generic template to memorable brand.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'dlytful' },
      { name: 'twitter:description', content: 'Brand translation for indie builders' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
    ]
  }
}

### Create static assets
- /public/favicon.ico — dlytful mark in dlytful-sun
- /public/og-image.png — 1200x630, dlytful branding + tagline
- /public/brand-kit.pdf — the free download

## Performance Optimization

### Lazy loading
- Archetype wheel: dynamic import (heavy component)
- Results page outputs: render on demand
- Sprint history: paginate, 20 per page

### Image optimization
- Use Nuxt Image if adding images later
- Optimize og-image.png

### Bundle analysis
npx nuxi analyze

Review and code-split large dependencies.

## Environment Configuration

### .env.production
SUPABASE_URL=your_production_url
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
ANTHROPIC_API_KEY=your_production_key
RESEND_API_KEY=your_production_key
NUXT_PUBLIC_APP_URL=https://dlytful.com

### Runtime config in nuxt.config.ts
runtimeConfig: {
  supabaseServiceKey: '',
  anthropicApiKey: '',
  resendApiKey: '',
  public: {
    supabaseUrl: '',
    supabaseAnonKey: '',
    appUrl: ''
  }
}

## Vercel Deployment

### vercel.json (if needed)
{
  "framework": "nuxt",
  "buildCommand": "nuxt build",
  "devCommand": "nuxt dev",
  "installCommand": "npm install"
}

### Steps
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy
4. Set up custom domain when ready

### Preview deployments
- Automatic for PRs
- Use for testing before production

## Pre-Launch Checklist

### Functionality
- [ ] Waitlist signup works, email delivers
- [ ] Auth flow complete (register, login, logout)
- [ ] Discovery flow works for all tiers
- [ ] Generation returns valid outputs
- [ ] Copy buttons work
- [ ] Archetype wheel renders and selects
- [ ] Sprint save/load works (paid tiers)
- [ ] Fork creates new sprint with parent
- [ ] Export downloads markdown (dlytful max)

### Design
- [ ] All pages responsive
- [ ] Fonts loading correctly (Poppins, Fraunces)
- [ ] Colors consistent with brand
- [ ] Loading states present
- [ ] Error states helpful
- [ ] Toasts appearing correctly

### Edge Cases
- [ ] Empty states display properly
- [ ] Long text doesn't break layouts
- [ ] Free tier blocks work, show upgrade
- [ ] Session expiry handled gracefully
- [ ] API errors show user-friendly messages

### SEO/Meta
- [ ] Title and description set
- [ ] OG image displays in social previews
- [ ] Favicon visible

### Security
- [ ] RLS policies active on Supabase
- [ ] API routes validate auth
- [ ] No secrets exposed client-side
- [ ] Rate limiting on waitlist endpoint

## Post-Launch Monitoring

### Add basic analytics (optional, phase 2)
- Plausible or Fathom (privacy-friendly)
- Track: signups, sprint starts, completions, upgrades

### Error tracking (optional, phase 2)  
- Sentry for error reporting
- Monitor API failures

### Uptime
- Vercel provides basic monitoring
- Set up Supabase alerts for database issues
```

---

## Quick Reference

| Prompt | Focus | Key Deliverables |
|--------|-------|------------------|
| 1 | Project Init | Nuxt setup, folder structure, Tailwind config |
| 2 | Types | User, Sprint, Archetype TypeScript interfaces |
| 3 | Constants | Archetypes, questions, tier definitions |
| 4 | UI Components | Button, Input, Card, Logo components |
| 5 | Composables | useApi, useAuth, useDiscovery, useTier |
| 6 | Stores | user, sprint, ui Pinia stores |
| 7 | Layouts | default, auth, app layouts |
| 8 | Landing | Waitlist page, email capture, PDF delivery |
| 9 | Database | Supabase schema, RLS policies, triggers |
| 10 | Auth | Login, register pages, middleware |
| 11 | Discovery | Multi-step question flow, progress bar |
| 12 | Archetypes | Visual wheel, recommendations, selection |
| 13 | Generation | Claude API integration, prompt templates |
| 14 | Results | Output display, copy functionality, export |
| 15 | History | Sprint list, tree view, fork management |
| 16 | Toasts | Notification system, auto-dismiss |
| 17 | Settings | Account page, plan management |
| 18 | Upgrade | Modal, tier gating, Stripe prep |
| 19 | States | Loading, error, empty state components |
| 20 | Deploy | SEO, performance, Vercel, checklist |

---

## Brand Reference

**Colors:**
- dlytful-sun: #FF9A00 (primary)
- dlytful-sky: #007FFF (secondary)
- dlytful-cream: #FAF7F2 (background)
- dlytful-herb: #79B972 (accent)

**Typography:**
- Headings: Fraunces
- Body: Poppins

**Tiers:**
- dlytful zero (free)
- dlytful one ($14/mo)
- dlytful max ($29/mo)

**Voice:**
- Warm, direct, human
- Never corporate
- No jargon
