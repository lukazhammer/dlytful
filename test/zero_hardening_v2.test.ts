import { describe, it, expect } from 'vitest';
import { compileBrandSpec, sanitizeCategory, repairOutcome, ensureThirdPerson } from '../lib/brand/compile';

describe('Deep Hardening Zero Pipeline (V2)', () => {

    describe('Grammar Split (Outcome)', () => {
        it('One-Liner uses Base Form ("helps X reduce anxiety")', () => {
            const res = compileBrandSpec({
                productName: 'Foo', outcome: 'reduce anxiety', category: 'Tool'
            });
            // "Foo helps Users reduce anxiety with a Tool."
            expect(res.assets.oneLiner).toBe('Foo helps Users reduce anxiety with a Tool.');
        });

        it('Positioning uses 3rd Person ("that reduces anxiety")', () => {
            const res = compileBrandSpec({
                productName: 'Foo', outcome: 'reduce anxiety', category: 'Tool'
            });
            // "For Users, Foo is the Tool that reduces anxiety. It stays simple and reliable."
            expect(res.assets.positioning).toMatch(/that reduces anxiety\./);
        });

        it('Bullet uses Base Form ("Reduce anxiety fast")', () => {
            const res = compileBrandSpec({
                productName: 'Foo', outcome: 'reduce anxiety', category: 'Tool'
            });
            expect(res.assets.benefitBullets).toContain('Reduce anxiety fast.');
        });
    });

    describe('Sanitization Redux', () => {
        it('Strips "calls", "named" from Category', () => {
            expect(sanitizeCategory('App called Dlytful')).toBe('App');
            expect(sanitizeCategory('System named X')).toBe('System');
            expect(sanitizeCategory('Tool calls itself')).toBe('Tool');
        });

        it('Capitalizes Category', () => {
            expect(sanitizeCategory('app')).toBe('App');
        });
    });

    describe('Domain Logic (Anti-Sameness)', () => {
        it('Trip Planner (Consumer) gets "Live better/Enjoy more"', () => {
            const res = compileBrandSpec({
                q1_core_what: 'Trip Planner for friends',
                product_type: 'consumer'
            });
            // Should NOT have "Ship with confidence"
            expect(res.assets.heroHeadlines).not.toContain('Ship with confidence.');
            // Should have "Live better." or "Feel the difference."
            const consumerHeadlines = ["Live better.", "Feel the difference."];
            const hasConsumer = res.assets.heroHeadlines.some(h => consumerHeadlines.includes(h));
            expect(hasConsumer).toBe(true);
        });

        it('Devtool gets "Ship with confidence"', () => {
            const res = compileBrandSpec({
                q1_core_what: 'CI/CD Pipeline',
                product_type: 'devtools'
            });
            expect(res.assets.heroHeadlines).toContain('Ship with confidence.');
        });

        it('App Name in outcome does not leak', () => {
            // If LLM fails and outcome is empty, fallback shouldn't contain product name
            const res = compileBrandSpec({
                productName: 'Dlytful',
                q1_core_what: 'Dlytful App',
                product_type: 'other' // General
            });
            // Default outcome is "get results without guesswork"
            expect(res.assets.oneLiner).not.toContain('Dlytful helps Users Dlytful');
        });
    });

});
