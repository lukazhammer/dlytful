import { describe, it, expect } from 'vitest';
import { extractName, extractCategory } from '../lib/brand/extract';
import { compileBrandSpec } from '../lib/brand/compile';

describe('Extraction Fixes (Part B)', () => {

    it('extractName should strip "called X"', () => {
        const input = "A deterministic brand compiler called Dlytful for developers";
        const name = extractName(input);
        expect(name).toBe("Dlytful");
    });

    it('extractCategory should strip "called X" leakage', () => {
        const input = "A deterministic brand compiler called Dlytful for developers";
        const cat = extractCategory(input);

        expect(cat.toLowerCase()).not.toContain('called');
        expect(cat.toLowerCase()).not.toContain('dlytful');
        expect(cat.toLowerCase()).toBe("deterministic brand compiler");
    });

    it('extractCategory should handle "Is a X" patterns cleanly', () => {
        const input = "Dlytful is a brand compiler used by founders";
        const cat = extractCategory(input);
        expect(cat.toLowerCase()).toBe("brand compiler");
    });

    it('compileBrandSpec should integrate fixes', () => {
        const input = {
            q1_core_what: "A deterministic brand compiler named Dlytful",
            q2_audience_who: "Devs"
        };
        const { brandSpec } = compileBrandSpec(input);

        expect(brandSpec.productName).toBe("Dlytful");
        expect(brandSpec.category.toLowerCase()).not.toContain("named");
        expect(brandSpec.category.toLowerCase()).toContain("brand compiler");
    });

});
