import { describe, it, expect } from 'vitest';
import { extractName } from '../lib/brand/extract';

// Mocking $fetch is hard in unit tests without extensive setup.
// We will test the logic concepts or if possible import the handler?
// Handlers are default exports. 

// Actually, let's write an integration-style test that mocks the event?
// Or better, let's just test the properties we expect via `fetch` if the server was running?
// The user has `npm run dev` running. We can try to fetch against localhost:3000?
// But that depends on port.

// Alternatively, we can unit test the logic if we extract it.
// But the logic is inside `defineEventHandler`.

// Let's rely on manual verification for the full flow, but we can test valid inputs against a local fetch if we assume port 3000.
// "Running terminal commands: npm run dev (in c:\Users\lucas\dlytful, running for 21h11m31s)"
// So the server IS running.

const BASE_URL = 'http://localhost:3000';

describe('API: /api/generate/demo', () => {

    it('returns valid schema for minimal input', async () => {
        const res: any = await fetch(`${BASE_URL}/api/generate/demo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q1_core_what: 'A tool for testing',
                remix_nonce: '123'
            })
        }).then(r => r.json());

        // Check Identity
        expect(res.identity.productName).toBeTruthy();
        expect(res.identity.category).toBeTruthy();

        // Check Vibe
        expect(res.vibe.archetype).toBeTruthy();
        expect(res.vibe.palette.accent).toMatch(/^#[0-9A-F]{6}$/i);
        expect(res.vibe.toneTags.length).toBe(3);

        // Check Debug
        expect(res.debug.demo).toBeUndefined(); // We didn't set demo:true in backend, we set it in frontend map.
        // Wait, backend returns debug object.
        expect(res.debug.seed).toBeTypeOf('number');
    });

    it('changes vibe when nonce changes (Remix)', async () => {
        const body = { q1_core_what: 'A tool', remix: true };

        const res1: any = await fetch(`${BASE_URL}/api/generate/demo`, {
            method: 'POST',
            body: JSON.stringify({ ...body, remix_nonce: 'A' })
        }).then(r => r.json());

        const res2: any = await fetch(`${BASE_URL}/api/generate/demo`, {
            method: 'POST',
            body: JSON.stringify({ ...body, remix_nonce: 'B' })
        }).then(r => r.json());

        // Vibe should likely be different (Archetype or Palette)
        // There is a small chance of collision, but very small.
        const different =
            res1.vibe.archetype !== res2.vibe.archetype ||
            res1.vibe.palette.id !== res2.vibe.palette.id;

        expect(different).toBe(true);
    });

    it('infers name correctly', async () => {
        const res: any = await fetch(`${BASE_URL}/api/generate/demo`, {
            method: 'POST',
            body: JSON.stringify({
                q1_core_what: 'I use Doggr to walk dogs',
                remix_nonce: '123'
            })
        }).then(r => r.json());

        expect(res.identity.productName).toBe('Doggr');
    });

});

describe('API: /api/llm_ping', () => {
    it('responses with PONG and model', async () => {
        const res: any = await fetch(`${BASE_URL}/api/llm_ping`).then(r => r.json());
        expect(res.ok).toBe(true);
        expect(res.text).toContain('PONG');
        expect(res.match).toBe(true);
    });
});
