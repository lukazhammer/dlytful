import { describe, it, expect } from 'vitest';
import { extractName, extractCategory, extractAudience, extractDifferentiation } from '../lib/brand/extract';

describe('Extract Semantic Safety', () => {

    describe('extractName', () => {
        it('should NOT remove hedges from product name', () => {
            // "Likeable" contains "like" (which we removed from hedges anyway, but good to test structural safety)
            // Let's use "Maybe" which IS a hedge.
            const raw = 'We are called Maybe Baby';
            expect(extractName(raw)).toBe('Maybe');
        });

        it('should still normalize punctuation', () => {
            const raw = 'called  "Maybe Baby" ...';
            expect(extractName(raw)).toBe('Maybe Baby');
        });
    });

    describe('extractCategory', () => {
        it('should NOT remove hedges from category', () => {
            // "Kind Of" is a hedge.
            const raw = 'It is a Kind Of Monitor';
            // normalizeCategory usually Title Cases words.
            // If we stripped hedges, "Kind Of" would be gone -> "Monitor".
            // With hedges kept -> "Kind Of Monitor"
            expect(extractCategory(raw)).toBe('Kind Of Monitor');
        });
    });

    describe('extractAudience (Description Field)', () => {
        it('SHOULD remove hedges', () => {
            const raw = 'Probably indie founders and maybe marketers';
            // "Probably" and "maybe" should go.
            // Whitespace normalized.
            expect(extractAudience(raw)).toBe('indie founders and marketers');
        });
    });

    describe('extractDifferentiation (Description Field)', () => {
        it('SHOULD remove hedges', () => {
            const raw = 'We basically sort of do it better';
            // "basically", "sort of" removed.
            expect(extractDifferentiation(raw)).toBe('We do it better');
        });
    });

});
