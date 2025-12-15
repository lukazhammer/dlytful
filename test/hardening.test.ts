
import { describe, expect, test } from 'vitest';
import { compileBrandSpec, renderMarkdown, generateAssets } from '../lib/brand/compile';

/**
 * HARDENING TEST SUITE
 * Verifies that the new quality engine cleans text and enforces grammar.
 */
describe('Hardening Quality Engine', () => {

    // CASE 1: Grammar Repair (3rd Person)
    test('Case 1: Outcome Grammar Repair', () => {
        const input = {
            q1_core_what: 'A tool for writing code',
            q2_audience_who: 'Developers',
            outcome: 'ship faster' // Input from "LLM" (simulated)
        };
        const { brandSpec, assets } = compileBrandSpec(input);

        // Outcome should be "ships faster"
        expect(brandSpec.outcome).toBe('ships faster');

        // Positioning should use it correctly
        // "is the tool that ships faster."
        expect(assets.oneLiner).toContain('ships faster');
    });

    // CASE 2: Pain Sanitization (Product Name Leak)
    test('Case 2: Pain Safety (No Product Name)', () => {
        const input = {
            q1_core_what: 'Dlytful is a branding tool',
            q2_audience_who: 'Founders',
            pain: 'struggle using Dlytful properly' // Leak
        };
        const { brandSpec } = compileBrandSpec(input);

        // Should trigger fallback or clean
        expect(brandSpec.pain).not.toContain('Dlytful');
        expect(brandSpec.pain).toBe('chaotic workflows'); // The hardcoded fallback for leakage
    });

    // CASE 3: Pain Sanitization (Self Check "is a...")
    test('Case 3: Pain Safety (Definition Leak)', () => {
        const input = {
            q1_core_what: 'XyzProduct',
            q2_audience_who: 'Users',
            pain: 'is a tool for branding' // LLM hallucination
        };
        const { brandSpec } = compileBrandSpec(input);
        expect(brandSpec.pain).toBe('fragmented tools'); // Fallback
    });

    // CASE 4: Outcome Length Repair
    test('Case 4: Outcome Length', () => {
        const input = {
            q1_core_what: 'Tool',
            q2_audience_who: 'Users',
            outcome: 'efficiency' // Single word noun
        };
        const { brandSpec } = compileBrandSpec(input);
        // "efficiency" -> "efficiencies" (naive verb) + "consistently" (length fix)
        expect(brandSpec.outcome).toBe('efficiencies consistently');
    });

    // CASE 5: Proof Grammar (It ...)
    test('Case 5: Proof Grammar', () => {
        const input = {
            q1_core_what: 'Tool',
            q2_audience_who: 'Users',
            proof: 'works with Jira'
        };
        const { brandSpec } = compileBrandSpec(input);
        expect(brandSpec.proof).toBe('It works with Jira'); // Added "It"
    });

});
