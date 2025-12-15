import { describe, it, expect } from 'vitest';
import { normalizeProductName } from '../lib/brand/normalize';

describe('normalizeProductName', () => {
    it('returns explicitly called names', () => {
        expect(normalizeProductName('We are called "Dlytful"')).toBe('Dlytful');
        expect(normalizeProductName('It is called Supabase, and...')).toBe('Supabase');
    });

    it('returns quoted names if present', () => {
        expect(normalizeProductName('"Linear" is a tool...')).toBe('Linear');
    });

    it('returns capitalized phrase if looks like name', () => {
        expect(normalizeProductName('Dlytful is a tool')).toBe('Dlytful is a tool'); // Fallback takes 4 words by default
    });

    it('returns "Your Product" for indefinite article starting phrases', () => {
        expect(normalizeProductName('A deterministic brand compiler for developers.')).toBe('Your Product');
        expect(normalizeProductName('An automated tool for logic.')).toBe('Your Product');
        // Case insensitive
        expect(normalizeProductName('a small app.')).toBe('Your Product');
    });

    it('returns "Your Product" for empty/null', () => {
        expect(normalizeProductName('')).toBe('Your Product');
    });
});
