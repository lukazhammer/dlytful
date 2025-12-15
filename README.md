# dlytful
Deterministic brand identity compiler.

## What it is
- Accepts raw founder answers as input.
- Compiles them into a strict BrandSpec JSON object and a markdown summary.
- Enforces strict determinism: the same input always yields the same output.
- Strictly adheres to the BrandSpecSchema with no extra or missing keys.
- Includes a specHash (SHA-256) of the stable BrandSpec JSON for drift detection.

## Non-negotiables
- Determinism.
- Strict schema conformity.
- No semantic drift (no alphabetical sorting that changes meaning).
- No external calls required in the hot path.

## Tech
- Nuxt 3 (SSR disabled).
- Supabase (PostgreSQL).
- Brand Compiler in lib/brand (pure TypeScript).

## Commands
```bash
npm install
```

```bash
npm run dev
```

```bash
npm run test
```

```bash
npm run typecheck
```

```bash
npm run build
```

```bash
npm run preview
```

## Environment variables
Required:
- SUPABASE_URL
- SUPABASE_ANON_KEY

Optional:
- GEMINI_API_KEY

## Project layout
- `lib/brand/schema.ts` (BrandSpecSchema + schema-derived BrandSpec type)
- `lib/brand/compile.ts` (compileBrandSpec -> { brandSpec, markdown, specHash })
- `lib/brand/extract.ts`, `normalize.ts`, `hedge.ts`, `utils.ts`
- `server/api` endpoints:
  - `/api/supabase-ping`
  - `/api/gemini-ping`
  - `/api/waitlist`

## CI
The CI workflow runs typecheck, tests, and build on every push and pull request to ensure code quality and regression prevention.
"# dlytful" 
