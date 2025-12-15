# DEVLOG

## 1) Product intent
**dlytful** compiles raw founder inputs into two layers:

1) **Deterministic BrandSpec** (stable, schema-valid, drift-proof)
2) **LLM-generated “creative layer”** (fast, high quality, cached where it matters)

The demo experience (“Zero”) should feel like a brand strategist in 3 seconds: name, one-liner, archetype, tone, palette, headlines, positioning.

---

## 2) Non-negotiables
### Deterministic core
- **Zero drift:** Deterministic extraction/normalization for BrandSpec.
- **Deterministic:** Same inputs → identical BrandSpec + identical markdown + identical specHash.
- **Strict schema:** BrandSpec must match `BrandSpecSchema` exactly.
- **Fast path:** Core compile requires no external API calls.

### LLM layer (Zero demo)
- **Guardrailed:** Prompt-injection resistant, disallowed categories blocked.
- **Visible proof-of-life:** Debug exposes model, attempts, rawText snippet, validation issues.
- **Graceful fallback:** If LLM fails, user still gets a coherent result.
- **Remixable:** Remix must produce a new archetype/tone/palette combo (even if other inputs unchanged).

---

## 3) Architecture snapshot

### A) Deterministic Brand Compiler (`lib/brand`)
Standalone functional pipeline.

1) **Input safety**
- Accepts `Record<string, unknown>`
- `asText` is strict: non-strings become `""`

2) **Extraction (`extract.ts`)**
- Grammar hardening: strip “called X”, remove self-referential leakage, normalize fragments.
- Robust fallbacks: never returns empty strings for required assets.
- Smart extraction: category and name inference hardened.

3) **Normalization (`normalize.ts`, `hedge.ts`)**
- Deterministic punctuation normalization (em dash → comma).
- Conservative hedge removal (does not damage identity fields).

4) **Compilation (`compile.ts`)**
- Maps extracted values into strict `BrandSpec`
- Uses deterministic utilities (`dedupePreserveOrder`, `ensureLen`)
- Enforces list lengths deterministically

5) **Validation (`schema.ts`)**
- `BrandSpecSchema` enforces strict shape (extra keys rejected)
- Word limits enforced deterministically

6) **Output**
- Returns `{ brandSpec, markdown, specHash }`
- `specHash` = SHA-256 of stable-stringified BrandSpec (drift detection)

### Key files
- `lib/brand/schema.ts` — source of truth (Zod schema + schema-derived type)
- `lib/brand/compile.ts` — compiler orchestrator
- `lib/brand/extract.ts` — extraction rules
- `lib/brand/normalize.ts` — normalization helpers
- `lib/brand/hedge.ts` — punctuation + hedge normalization
- `lib/brand/utils.ts` — deterministic utilities

---

### B) Zero demo “hybrid” generation layer
The demo is intentionally **not** purely deterministic. It is a controlled hybrid:

**LLM Draft → Validation/Repair → Compile/Merge → Render UI**

- `/api/generate/zero` (Interpreter + compiler merge)
  - Phase A: Gemini produces a soft JSON draft (name/category/audience/pain/outcome/proof/voice/archetype/paletteId/vibeTags)
  - Phase B: Repair loop retries on invalid JSON or failing validators
  - Phase C: `compileBrandSpec()` deterministically merges + sanitizes and generates assets

- `/api/generate/positioning` (Positioning generator)
  - Gemini generates structured positioning JSON:
    - brandName, targetAudience, category, differentiation, reasonToBelieve, positioning
  - Validator enforces format and anti-buzzword/mechanism requirements
  - Repair loop attempts a fix before falling back

- `/api/generate/demo` (Demo bundling / orchestration)
  - Demo UI may call multiple endpoints (compile/zero/positioning)
  - Sequencing matters (avoid race conditions; avoid rendering stale fallbacks)

---

## 4) System guarantees (enforced by tests + CI)

### Deterministic core guarantees
- **Schema compliance:** BrandSpec always passes strict validation
- **Determinism:** identical fixtures yield bit-identical BrandSpec/markdown/specHash
- **Priority-preserving:** arrays keep intended order (no alphabetical sorting)
- **Input resilience:** null/undefined/non-strings cannot crash compilation

### LLM layer guarantees (operational)
- **Debuggable:** every response can explain what happened (model, attempts, issues, rawText)
- **Safe fallback:** if LLM fails, return a coherent positioning and/or core BrandSpec
- **Remix works:** remix changes output combos reliably

---

## 5) Endpoints + data model (current)

### Endpoints
| Route | Method | Purpose | Auth |
| --- | --- | --- | --- |
| `/api/supabase-ping` | GET | Verify DB connection | None |
| `/api/gemini-ping` | GET | Verify Gemini API & model | None |
| `/api/waitlist` | POST | Capture emails `{ email }` | None |
| `/api/generate/zero` | POST | Hybrid “Zero” draft → compile → assets | Optional (cache if authed) |
| `/api/generate/positioning` | POST | LLM positioning JSON + guardrails | None |
| `/api/compile` | POST | Deterministic BrandSpec compile | None |

### Tables
**waitlist**
- `id` (uuid, pk)
- `created_at` (timestamptz)
- `email` (text, unique)

**sprints**
- `id` (uuid, pk)
- `created_at` (timestamptz)
- `user_id` (uuid, fk)
- `input_hash` (text)
- `inputs` (jsonb)
- `unlocks` (jsonb) — includes compiled BrandSpec (+ assets attached for demo)
- `brand_prompt` (text)
- `spec_hash` (text)
- `current_step` (int4)
- `is_complete` (bool)

---

## 6) Changelog

### 2025-12-14
**Infra + endpoints**
- Fixed env/config lint and Supabase typing.
- Verified: typecheck, supabase-ping, gemini-ping.
- Added CI workflow running typecheck/tests/build.

**Deterministic compiler**
- Added Vitest fixtures + determinism stress tests.
- Centralized deterministic helpers (`utils.ts`).
- Enforced strict schema parsing and schema-derived typing.
- Added `specHash` (sha256 stable stringification) verified in tests.

**Zero Demo rebuild**
- Split-screen progressive unlock UI.
- Added `input_hash` caching for authenticated users.
- Added curated palettes; LLM selects palette ID, backend applies tokens.
- Validated grammar and removed “called X” leakage.
- Tests for hashing stability and baseline grammar.

---

### 2025-12-15
**Zero pipeline hardening (what actually fixed quality)**
- Migrated from “hard determinism everywhere” to **hybrid**:
  - LLM generates *specific* content (one-liners, headlines, archetype/palette selection)
  - Compiler guarantees shape + sanitation
- Added “LLM HIT” visibility during testing to verify the LLM path is being used.
- Fixed “UI looks identical” issue by ensuring remix truly changes assignments and UI is not dominated by fallback copy.

**Remix behavior (conversion-driven)**
- Remix now produces a new **randomized** archetype + tone + palette combination.
- Locked controls (archetype/palette/tone selection) display as disabled with microcopy (“unlock with paid subscription”) while still rendering the assigned result.

**Name inference**
- Improved name inference to consider all fields (q1/q2/q3), not just Product field.
- Goal: product name should be captured even if introduced only in the “Moment”.

**One-liner generation**
- Stopped forcing early over-guardrailed deterministic one-liners that produced boilerplate.
- Let Gemini generate one-liners using a clear marketing brief.
- Result: outputs began matching “expert brand strategist” expectations (short, punchy, customer-win framing).

**Palette behavior**
- Visual input now influences palette selection effectively when explicit color cues exist.
- Remaining gap: semantic mapping (e.g. “BBQ colors”) should produce BBQ-associated palettes even without explicit hex or color words.

**Positioning generator**
- Added `/api/generate/positioning` endpoint with strict Zod schema output.
- Implemented:
  - banned buzzwords list
  - generic phrase avoidance
  - mechanism requirement in RTB
  - template enforcement (“For X, Y is the Z that… because…”)
  - repair loop across models (2.5 flash → 2.5 pro → 1.5 flash fallback)
- Debug includes: llmAttempts, model used, validation issues, rawText snippet.

**Debugging approach that worked**
- Confirmed success/failure via DevTools Network Response JSON, not UI assumptions.
- Captured and surfaced the actual LLM response and validation decisions.
- Resolved “positioning not working” confusion by verifying endpoint returned valid JSON even when UI wasn’t rendering it yet.

---

## 7) Current state (end of day)
- Remix reliably changes archetype/tone/palette.
- One-liner generation produces high-quality results when LLM path is active.
- Positioning endpoint returns valid structured drafts; UI can render it.
- Deterministic core remains intact and testable.

---

## 8) Next actions
### Highest priority
- **Semantic palette mapping:** if q3 contains vibes like “BBQ / smokey / rust / cast iron”, infer an appropriate palette (not random cool blues).
- **Name inference stress-test:** run 100 noisy variants (names embedded in any field; “called X”; parentheses; CamelCase; quoted names).
- **Injection hardening:** expand `INJECTION_PHRASES` and add “ignore prior instructions” / “system prompt” detection to all LLM endpoints.
- **Positioning quality scoring:** add a 1–10 rubric (specificity, differentiation clarity, proof concreteness) beyond pass/fail.

### Nice-to-have
- Add a “Debug” toggle in UI that shows:
  - inferred name + confidence
  - palette rationale
  - model/attempts
  - validator failures (if any)
- Add a `tests/quality_matrix` runner to generate 100+ cases and track pass-rate.

---

## 9) Handoff notes
- If UI looks “same” again, do not guess. Check:
  1) Network Response JSON (is the LLM being used?)
  2) debug payload (issues / rawText)
  3) caching (input_hash + remix_nonce)
  4) frontend hardcoded defaults (payload skew)
  5) validation thresholds (too strict → fallback spam)
