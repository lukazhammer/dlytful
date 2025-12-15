# DEVLOG

## 1) Product intent
**dlytful** compiles raw founder inputs into a deterministic **BrandSpec** JSON + paste-ready markdown. No “creative” generation in the core path. Same inputs must yield the same outputs.

## 2) Non-negotiables
- **Zero drift:** No reinterpretation of user intent. Extract, normalize, template.
- **Deterministic:** Same input → identical BrandSpec + identical markdown (+ identical specHash).
- **Strict schema:** Output must match `BrandSpecSchema` exactly (no extra keys).
- **Fast path:** No external API calls required for core compilation.

## 3) Architecture snapshot
Brand Compiler lives in `lib/brand` and is a standalone functional pipeline:

1) **Input safety**
- Accepts `Record<string, unknown>`
- `asText` is strict: non-strings become `""` (prevents garbage like `"true"` from polluting spec fields)

2) **Extraction (`extract.ts`)**
- [x] **Grammar Hardening**: Added `stripCalledSegment`, `stripProductName`, `ensureClause`, and `normalizeFragment` to ensure natural phrasing.
- [x] **Robust Fallbacks**: Guaranteed non-empty assets for headlines, benefits, and differentiators even with empty/malformed inputs.
- [x] **Smart Extraction**: Category extraction now intelligently removes "called X" leakage and self-referential product names.
- [x] **Frontend Polish**: Hidden example fields (`archetype`, `mission`, `diff`, `banned words`) now correctly populated in `sanitizedInputs`.
- [x] **Verification**: Added rigorous test suite for output quality, ensuring no empty strings and correct grammar structures.

## Phase 31: Demo Architecture Fix & UI Upgrade
- [x] **Architecture Split**: Separated `assets` from strict `BrandSpecSchema` to prevent validation errors while enabling rich creative output.
- [x] **UI Upgrade**: Added visible Differentiation, Archetype, and Tone inputs to the demo interface.
- [x] **New Endpoints**: Created `/api/copy` for cached, LLM-generated creative assets.
- [x] **Strict Determinism**: Verified `compile` remains purely deterministic; LLM layer is additive and cached.
- [x] **Tests**: Updated test suite to verify the new split architecture and strict schema compliance.

3) **Normalization (`normalize.ts`, `hedge.ts`)**
- Punctuation normalization is deterministic (e.g. em dash → comma)
- Hedge removal is conservative (removed destructive tokens like `like` / `literally`) and regex inputs are escaped

4) **Compilation (`compile.ts`)**
- Maps extracted values into strict `BrandSpec` shape
- Uses deterministic utilities (e.g. `dedupePreserveOrder`, `ensureLen`)
- Enforces required array lengths via deterministic padding/truncation (no alphabetical sorting that changes meaning)

5) **Validation (`schema.ts`)**
- `BrandSpecSchema` enforces strict shape (extra keys rejected)
- Word-limit refinements are enforced where defined (deterministic checks)

6) **Output**
- Returns `{ brandSpec, markdown, specHash }`
- `specHash` is SHA-256 of stable-stringified BrandSpec (drift detection)

### Key files
- `lib/brand/schema.ts` — single source of truth (Zod schema + schema-derived BrandSpec type)
- `lib/brand/compile.ts` — compiler orchestrator
- `lib/brand/extract.ts` — extraction rules (semantic safety included)
- `lib/brand/normalize.ts` — normalization helpers (name + banned words)
- `lib/brand/hedge.ts` — punctuation + hedge normalization
- `lib/brand/utils.ts` — deterministic shared utilities

## 4) System guarantees (enforced by tests + CI)
- **Schema compliance:** output always passes strict schema validation and contains no unknown keys
- **Determinism:** repeated compilation of the same fixture yields identical BrandSpec, markdown, and specHash (stress-test loop)
- **Priority-preserving order:** arrays preserve intentional priority order (no alphabetical “cleanup”)
- **Input resilience:** null/undefined/non-string inputs cannot crash compilation and are normalized safely

## 5) Endpoints + data model (current)
### Endpoints
| Route | Method | Purpose | Auth |
| --- | --- | --- | --- |
| `/api/supabase-ping` | GET | Verify DB connection | None |
| `/api/gemini-ping` | GET | Verify Gemini API & model | None |
| `/api/waitlist` | POST | Capture emails `{ email }` | None |

### Tables
**waitlist**
- `id` (uuid, pk)
- `created_at` (timestamptz)
- `email` (text, unique)

**sprints**
- `id` (uuid, pk)
- `created_at` (timestamptz)
- `user_id` (uuid, fk)
- `inputs` (jsonb)
- `current_step` (int4)
- `unlocks` (jsonb)
- `brand_prompt` (text)

## 6) Changelog

### 2025-12-14
**Infra + endpoints**
- Fixed unused config lint in `server/lib/env.ts`
- Fixed Supabase insert/upsert typing issues for waitlist/sprints endpoints
- Updated env handling for standard `SUPABASE_URL`
- Verified: `npm run typecheck`, `supabase-ping`, `gemini-ping`
- Added CI workflow (`.github/workflows/ci.yml`) running typecheck, tests, build

**Deterministic compiler**
- Added Vitest suite under `test/` with fixtures, determinism checks, and snapshots
- Added stress-test loop to guarantee idempotency (bit-perfect output)
- Centralized deterministic helpers in `lib/brand/utils.ts` (`dedupePreserveOrder`, etc.)
- Added `ensureLen` to guarantee exact schema array lengths deterministically
- Removed meaning-destroying alphabetical sorting (priority order preserved)
- Enforced strict schema parsing and schema-derived BrandSpec typing (single source of truth)

**Semantic safety + normalization**
- Scoped hedge removal away from identity fields (name/category)
- Hardened hedge logic: removed destructive hedge tokens and escaped regex inputs
- Improved product name extraction:
  - `extractCalledName` is case-insensitive
  - stops at hard-stop phrases (`is a`, `for`, `with`, etc.)
  - strips quotes deterministically and caps word count
- Added `specHash` (SHA-256 of stable BrandSpec JSON) and verified it in tests

## 7) Next actions
- **Frontend integration:** connect UI to `{ brandSpec, markdown, specHash }`
- **Results view:** render markdown + design tokens cleanly (avoid “nice looking” drift)
- **E2E:** verify full flow Form → compile → Results page

### 2025-12-14 (Realignment)
**Zero Demo Rebuild**
- **Frontend Refactor**: Split-screen, progressive unlock UI.
  - Q1: Product -> Identity (Deterministic).
  - Q2: Moment -> Voice/Palette (LLM, cached).
  - Q3: Context -> Visuals.
- **Backend Architecture**:
  - `input_hash`: Added column and logic for stable input hashing `sha256(stableStringify({q1, q2, q3}))`.
  - `/api/generate/zero`: New hybrid endpoint. Checks DB cache for authenticated users.
  - **Palette System**: Added `CURATED_PALETTES` (8 options). LLM selects ID, backend applies tokens.
  - **Determinism**: Baseline is 100% deterministic. LLM layer is cached per `(user_id, input_hash)`.
- **Copy Quality**:
  - Validated "For X, Y is the Z..." grammar.
  - Removed "called X" leakage.
  - Ensured "It works..." clause structure.
- **Tests**:
  - Added `test/zero_demo.test.ts` covering grammar, palette fallback, and hashing stability.


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
