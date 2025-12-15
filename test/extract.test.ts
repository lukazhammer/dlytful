import { describe, it, expect } from 'vitest';
import { extractVoice, extractCategory } from '../lib/brand/extract';

describe('Extract Logic Determinism', () => {

    describe('extractVoice', () => {
        const archetypeData = { voice: ['Optimistic', 'Honest', 'Simple'] };

        it('should prioritize keyword overrides ("Direct") over archetype defaults', () => {
            const result = extractVoice('', 'We are very direct', archetypeData);
            // "Direct" found in input -> pushed first
            // Then archetype defaults
            expect(result.soundsLike[0]).toBe('Direct');
            expect(result.soundsLike).toEqual(['Direct', 'Optimistic', 'Honest']); // Max 3
        });

        it('should prioritized multiple keywords in stable order', () => {
            const result = extractVoice('', 'Direct and professional', archetypeData);
            // Both "direct" and "professional" found
            expect(result.soundsLike).toEqual(['Direct', 'Professional', 'Optimistic']);
        });

        it('should dedupe case-insensitively', () => {
            // Archetype says 'Optimistic'
            // Input says 'optimistic' (which implementation shouldn't explicitly grab unless mapped, 
            // but let's assume we pass archetype data that conflicts)

            const conflictArchetype = { voice: ['Direct', 'Honest'] };
            const result = extractVoice('', 'Very direct', conflictArchetype);
            // "Direct" (from keywrod match) is added first.
            // "Direct" (from archetype) is processed next.
            // Should valid dedupe.
            expect(result.soundsLike).toEqual(['Direct', 'Honest']);
            expect(result.soundsLike.length).toBe(2);
        });

        it('should never exceed max length of 3', () => {
            const longArch = { voice: ['A', 'B', 'C', 'D'] };
            const result = extractVoice('', 'professional', longArch);
            // Professional + A + B = 3
            expect(result.soundsLike).toEqual(['Professional', 'A', 'B']);
        });
    });

    describe('extractCategory', () => {
        it('should preserve casing when using "is a" extractor', () => {
            // Regular input 'MyApp is a Super Cool Tool'
            // We want 'Super Cool Tool' not 'super cool tool'
            // We want 'Super Cool Tool' not 'super cool tool'
            const result = extractCategory('MyApp is a Super Cool Tool for devs');
            // 'is a' strips prefix. 'for' strips suffix.
            expect(result).toBe('Super Cool Tool');
        });

        it('should handle case-insensitive "is a" triggler but output original case', () => {
            const result = extractCategory('This IS A Magic Wand');
            expect(result).toBe('Magic Wand');
        });

        it('should still respect specific mappings (case insensitive)', () => {
            expect(extractCategory('My app tracks hydration')).toBe('Hydration Tracker');
        });
    });

});
