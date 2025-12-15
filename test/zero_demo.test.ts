import { describe, it, expect } from 'vitest';
import { compileBrandSpec, stableHash } from '../lib/brand/compile';
import { BrandSpecSchema } from '../lib/brand/schema';

describe('Dlytful Zero Realignments', () => {

    it('1. Positioning Grammar - Should be two sentences with "It..."', () => {
        const input = {
            q1_core_what: 'A tool for testing',
            q2_audience_who: 'Testers',
            q7_competitors_differentiation: 'integrates with everything' // proof source
        };
        const { markdown } = compileBrandSpec(input);
        // Find Positioning line. It's under "## Transform Guidelines" now? No, wait, markdown render changed.
        // Let's check the markdown content directly.
        // Matches "**Positioning:** For Users, Dlytful..."
        const posSection = markdown.match(/Positioning:.*? (.*)/);
        expect(posSection).toBeTruthy();
        const text = posSection![1];

        // "For {audience}, {product} is the {category} that {outcome}. {proof}."
        // We expect a period inside.
        expect(text).toMatch(/.*\.\s*It.*/);
    });

    it('2. Category Stripping - Removes "called X"', () => {
        const input = {
            q1_core_what: 'A specialized tool called SuperTool for analyzing data',
            q2_audience_who: 'Analysts'
        };
        const { brandSpec } = compileBrandSpec(input);
        expect(brandSpec.category.toLowerCase()).not.toContain('called');
        expect(brandSpec.category.toLowerCase()).not.toContain('supertool');
        expect(brandSpec.productName).toBe('SuperTool'); // extractName logic
    });

    it('3. Assets - Never yields blank headlines/bullets', () => {
        const input = {
            q1_core_what: 'Simple thing',
            q2_audience_who: 'Users'
        };
        const { assets } = compileBrandSpec(input);
        assets.heroHeadlines.forEach(h => expect(h.length).toBeGreaterThan(0));
        assets.benefitBullets.forEach(b => expect(b.length).toBeGreaterThan(0));
        expect(assets.oneLiner).toBeTruthy();
    });

    it('4. Schema Validation - Passes for baseline', () => {
        const input = { q1_core_what: 'Test', q2_audience_who: 'User' };
        const { brandSpec } = compileBrandSpec(input);
        expect(() => BrandSpecSchema.parse(brandSpec)).not.toThrow();
    });

    it('5. Stable Hashing - Same input, same hash', () => {
        const input = { q1_core_what: 'Foo', q2_audience_who: 'Bar' };
        const res1 = compileBrandSpec(input);
        const res2 = compileBrandSpec(input);
        expect(res1.specHash).toBe(res2.specHash);
    });

    it('6. Input Hash - Order independence', () => {
        // We reuse stableHash for inputs in zero.post.ts. Let's verify stableHash works on objects broadly.
        const obj1 = { a: 1, b: 2 };
        const obj2 = { b: 2, a: 1 };
        expect(stableHash(obj1)).toBe(stableHash(obj2));
    });

    it('7. Palette Fallback - Deterministic', () => {
        const input = {
            q1_core_what: 'Test',
            q4_archetype_primary: 'The Sage'
        };
        const { brandSpec } = compileBrandSpec(input);
        // Sage -> slate-glass -> #38BDF8 accent
        expect(brandSpec.designTokens.accent).toBe('#38BDF8');
        expect(brandSpec.designTokens.font).toBe('Inter');
    });

    it('8. Palette Override - Respects paletteId', () => {
        const input = {
            q1_core_what: 'Test',
            paletteId: 'midnight-neon'
        };
        const { brandSpec } = compileBrandSpec(input);
        // Midnight Neon -> #CCFF00
        expect(brandSpec.designTokens.accent).toBe('#CCFF00');
    });

});
