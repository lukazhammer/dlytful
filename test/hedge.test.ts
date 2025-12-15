import { describe, it, expect } from 'vitest';
import { removeHedges, normalizePunctuation } from '../lib/brand/hedge';

describe('Hedge and Punctuation Logic', () => {

    describe('removeHedges', () => {
        it('should remove known hedges case-insensitively', () => {
            const input = "It is basically, kind of, MAYBE a tool.";
            const result = removeHedges(input);
            // "It is , , a tool." -> collapsed spaces -> "It is , , a tool." -> wait, punctuation logic is separate.
            // removeHedges just removes the words.
            // "It is , ,  a tool." -> collapse whitespace -> "It is , , a tool."
            expect(result).toBe("It is , , a tool.");
        });

        it('should NOT remove text inside other words', () => {
            // "unsure" is a hedge. "ensure" contains "sure" but "unsure" is distinct.
            // "likelihood" contains "like" (if it were still a hedge)
            // "essentially" is a hedge. "confidentially" is not.

            const input = "We will ensure normalization essentially works.";
            // ensure stays. essentially goes.
            expect(removeHedges(input)).toBe("We will ensure normalization works.");
        });

        it('should preserve "like" and "literally" (removed from blacklist)', () => {
            const input = "It is literally like a dream.";
            expect(removeHedges(input)).toBe("It is literally like a dream.");
        });

        it('should collapse whitespace', () => {
            expect(removeHedges("  maybe   value  ")).toBe("value");
        });
    });

    describe('normalizePunctuation', () => {
        it('should convert em dashes to comma space', () => {
            expect(normalizePunctuation("Hello—world")).toBe("Hello, world");
            expect(normalizePunctuation("Hello--world")).toBe("Hello, world");
        });

        it('should collapse repeated punctuation', () => {
            expect(normalizePunctuation("Really??!!")).toBe("Really?!"); // Regex replaces .{2,} per type
            // The implementation has:
            // clean.replace(/\.{2,}/g, ".")
            // clean.replace(/!{2,}/g, "!")
            // clean.replace(/\?{2,}/g, "?")
            // It doesn't merge ?! sequences together, just collapses homogeneous runs.

            expect(normalizePunctuation("Done..")).toBe("Done.");
            expect(normalizePunctuation("Go!!")).toBe("Go!");
        });

        it('should remove space before punctuation', () => {
            expect(normalizePunctuation("Hello , world !")).toBe("Hello, world!");
        });
    });

});
