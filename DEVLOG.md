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
**Fixing "Sameness" + Positioning Guardrails**
- **Bug Fix**: Addressed "Sameness" bug where UI looked identical across inputs.
  - Root: Frontend parallel race condition (positioning called before name inferred) + weak name inference on visuals.
  - Fix: Enforced sequential API calls (`Demo` -> wait -> `Positioning`) in `demo.vue`.
  - Fix: Hardened `inferProductName` to ignore visual descriptors (Q3) unless explicit "called X" markers exist.
- **Positioning Generator**:
  - New Endpoint: `/api/generate/positioning` with strict Zod schema.
  - **Guardrails**: Banned buzzwords ("synergy", "cutting-edge"), enforced "For X, Y is Z..." template.
  - **Repair Loop**: Backend retries generation up to 2x with specific validation errors (e.g. "Audience too broad") before falling back to deterministic template.
  - **Safety**: Heuristic injection checks + banned category filters (weapons, medical).
- **Demo UI**:
  - Added hidden Debug Panel (toggle in top-left) for inspecting raw LLM output + model stats.
  - "Premium" features (Archetype/Palette) shown as "LOCKED" to drive conversion, but fully rendered.

**Tomorrow Handoff**:
- [ ] **Inference Regression**: Test 20+ "noisy" inputs (e.g. "Red App") to ensure name isn't hallucinated.
- [ ] **Injection Hardening**: Verify `INJECTION_PHRASES` against known jailbreaks.
- [ ] **Quality Scoring**: Implement 1-10 scoring for positioning specificity beyond binary Pass/Fail.
