# dlytful Dev Log

## 0) Snapshot
- Date: 2025-12-13
- Current branch: Unknown (local workspace)
- App status: Core flow functional (Landing -> Discovery -> Waitlist), but type safety and linting are not 100% clean.
- Known blockers: None blocking execution, but "Supabase Client Type Mismatch" prevents clean `npx nuxi typecheck`.

## 1) Product Intent
- **What dlytful is**: An automated brand positioning engine for developers who build functional apps but fail at storytelling.
- **What it is not**: Not a GPT wrapper (uses structured extraction), not a chat UI (uses "Question Cards").
- **Audience**: Technical founders, indie hackers, "build-first" developers.
- **Core hook**: "Your app works. Your brand doesn't."
- **Definition of a dlytful brand**: One that is Consistent (no franken-voice), Memorable (distinct archetype), and Machine Readable (exportable prompt).

## 2) UX and Creative Direction
- **Concept**: Tool Layer (floating glass panels) vs Environment Layer (parallax background).
- **Narrative**: Journey from "Earth" (grounded, messy input) to "Sky" (clarity, high-level strategy).
- **Solar Eclipse Motif**: Used as a progress indicator and "North Star" visual.
- **Palette Tokens**: 
  - Accent: `#C08A2B` (Amber/Gold)
  - Ink: `#0B0F1A` (Deep Background)
  - SkyTop: `#94A8C0`, SkyMid: `#6B7C90`, SkyDeep: `#1B2432`
  - Cloud: `#E9ECF3`
- **Rules**: 
  - DO use monospaced fonts for labels/data. 
  - AVOID blurred gradient orbs (overused AI trope). 
  - AVOID standard "chat bubbles".

## 3) Current Pages and Flows
- **`/` (Landing)**
  - Purpose: Convert visitors to waitlist or demo.
  - Components: `EnvironmentLayer`, `ExampleOutputLoop` (hero widget).
  - UX: "Join Waitlist" (email capture) + "Open live demo" link.
  - Status: Functional.
- **`/app` (Discovery)**
  - Purpose: The main interactive tool.
  - Components: `SplitPane`, `QuestionCard`, `ArchetypeWheel`, `BrandPromptPreview`.
  - UX: 10-step wizard. Left side inputs, Right side real-time preview.
  - Status: Functional.
- **`/login`**
  - Purpose: Supabase Auth entry point.
  - Status: Exists, basic email login.
- **`/pricing`**
  - Purpose: Tier display (Free vs Pro).
  - Status: Static page exists.

## 4) Data Model and Storage
- **Tables**:
  - `waitlist` (columns: `email`)
  - `sprints` (columns: `user_id`, `inputs`, `current_step`, `unlocks`, `brand_prompt`)
- **Type Source**: `app/types/database.types.ts` (Manually defined/Generated).
- **RLS**: Row Level Security should be enabled on Supabase (users can only read/write their own sprints).

## 5) API Surface
- **`/api/waitlist` (POST)**: 
  - Input: `{ email: string }`. 
  - Logic: `server/api/waitlist.post.ts`. Strict validation.
  - Output: `{ ok: true }`.
- **`/api/sprints` (POST)**:
  - Input: `{ currentStep, inputs, unlocks, brandPrompt }`.
  - Logic: `server/api/sprints/index.post.ts`.
  - Output: `{ ok: true, sprint: SprintRow }`.
- **`/api/brand/compile` (POST)**:
  - Input: `{ inputs: Record<string, unknown> }`.
  - Logic: `server/api/brand/compile.post.ts` -> `lib/brand/compile.ts`.
  - Output: `{ markdown: string, brandSpec: BrandSpec }`.
- **`/api/supabase-ping` (GET)**:
  - Input: None.
  - Logic: Uses `server/lib/env.ts` to check vars.
  - Output: `{ ok: true, checks: { url: bool, key: bool } }`.
- **`/api/gemini-ping` (GET)**:
  - Input: None.
  - Logic: Checks API key + generic model availability.
  - Output: `{ ok: true, model: string }`.
- **Other**:
  - `/api/sys/health` (System status)
  - `/api/gemini-models` (List models)
  - `/api/generate/enhance` (AI rewrite of inputs)
  - `/api/generate/archetype-recommend` (AI suggestion)

## 6) Brand Compiler Engine
- **Logic Path**: `lib/brand/compile.ts` is the orchestrator.
- **Components**:
  - `extract.ts`: Deterministic regex/string extraction.
  - `hedge.ts`: Removes "AI slop" words (hedging).
  - `normalize.ts`: Cleans text.
  - `templates.ts`: Markdown structures.
  - `brandSpec.ts`: TypeScript interfaces.
- **Strategy**: Deterministic first. AI is only used to *enhance* inputs, not to generate the core brand logic, ensuring consistency.
- **Failure Modes**: Missing `inputs` keys might result in "[Undefined]" strings in output.

## 7) Configuration and Environment
- **Env Helper**: `server/lib/env.ts` (exported as `getEnv`). enforces strictness.
- **Required Vars**:
  - `NUXT_PUBLIC_SUPABASE_URL`
  - `NUXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GEMINI_API_KEY`
  - `RESEND_API_KEY` (Not currently used in logic but listed in .env.example)
- **Validation**: `npm run dev` will fail at runtime if `getEnv` is called for a missing key.

## 8) Quality Gate Results
- **Typecheck (`npx nuxi typecheck`)**: **FAIL** (8 errors).
  - Mostly `Type mismatch` in Supabase `insert()` calls due to complex generic inference.
- **Lint (`npm run lint`)**: **FAIL** (1 error).
  - `server/lib/env.ts`: `config` is assigned but never used.
- **Lint Fix**: `npm run lint:fix` was run, cleared most issues.

## 9) Critical Fixes Completed Today
- **Strict Waitlist API**:
  - Rewrote `server/api/waitlist.post.ts`.
  - Removed all `any` casts.
  - Added `isRecord` and `toEmail` validation helpers.
- **Config Hardening**:
  - Created `server/lib/env.ts`.
  - Refactored `gemini-ping` and `supabase-ping` to use it.
  - Updated `.env.example`.
- **Lint Stabilization**:
  - Fixed unused vars in `QuestionCard.vue`, `BrandPromptPreview.vue`.
  - Fixed `auth.ts` `any` types.

## 10) Known Bugs and TODOs
- **[Medium] Lint Error in env.ts**: 
  - Symptom: `config` unused var.
  - Fix: Remove the `try/catch` block or the variable declaration in `server/lib/env.ts`.
- **[High] Supabase Type Mismatch**:
  - Symptom: `Argument of type ... is not assignable to parameter of type 'never'`.
  - Cause: `@nuxtjs/supabase` client generic does not perfectly map to `database.types.ts` generated structure in strict mode.
  - Fix: Re-generate types or create a wrapper helper for `insert` that casts strictly.
- **[Medium] Unused "Resend" Key**:
  - Symptom: `.env.example` lists `RESEND_API_KEY`, but no code uses it yet.
  - Fix: Implement email sending or remove key.

## 11) Tomorrow Plan
1.  **Fix Lint Error**: Open `server/lib/env.ts`, remove unused `config`. Run `npm run lint`.
2.  **Fix Supabase Types**: Open `server/api/waitlist.post.ts` (and others), investigate `database.types.ts` alignment or add `as unknown as ...` cast with specific comment if inference fails.
3.  **Verify Demo Flow**: Open `app/pages/app/index.vue`, run through full wizard to ensure no regression from strict types.
4.  **Connect Sprints API**: Verify `server/api/sprints/index.post.ts` is actually called by the frontend (currently maybe checking `useDiscoveryStore`).
5.  **Release Prep**: Run `npm run build` locally to verify production build.

## 12) Handoff Notes
- **Start Here**: Run `npm run dev`, then check `http://localhost:3000/api/sys/health` to confirm config.
- **Constraints**: No em dashes. No "AI" prefix in UI copy. No Chat UI.
- **Glossary**:
  - *Sprint*: A user's session of defining a brand.
  - *Archetype*: The psycho-demographic persona (e.g. "The Creator").
  - *Brand Prompt*: The final markdown output meant for LLMs.
