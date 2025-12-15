
import { describe, it, expect } from 'vitest';
import { inferProductName } from '../lib/brand/inferName';

describe('Robust Product Name Inference', () => {

    // 1. Explicit Naming
    it('Detects explicit "called X" phrases', () => {
        const res = inferProductName({ q1: 'A tool called Bladr for cutting.' });
        expect(res.name).toBe('Bladr');
        expect(res.confidence).toBe('high');
    });

    it('Detects "brand is X"', () => {
        const res = inferProductName({ q1: 'My brand is SuperApp.' });
        expect(res.name).toBe('SuperApp');
    });

    // 2. Parentheses
    it('Detects name in parentheses with verb context', () => {
        const res = inferProductName({ q2: 'Users download (Doggr) to walk dogs.' });
        expect(res.name).toBe('Doggr');
        expect(res.confidence).toBe('high'); // Score is sufficient for high (double dipping signals)
    });

    it('Ignores parentheses if generic', () => {
        // "tool" is generic
        const res = inferProductName({ q2: 'Users use this (tool).' });
        expect(res.name).not.toBe('tool');
    });

    // 3. Quoted Strings
    it('Detects quoted names', () => {
        const res = inferProductName({ q1: 'We are building "RouteBuddy".' });
        expect(res.name).toBe('RouteBuddy');
    });

    it('Detects single quoted names', () => {
        const res = inferProductName({ q1: "It's known as 'FastTrack'." });
        expect(res.name).toBe('FastTrack');
    });

    // 4. Cross-Field Frequency
    it('Prioritizes name appearing in multiple fields', () => {
        // "Alpha" appears twice, "Beta" once
        const res = inferProductName({
            q1: 'We are building Alpha.',
            q2: 'Users love Alpha.',
            q3: 'Beta.com'
        });
        expect(res.name).toBe('Alpha');
    });

    // 5. Domain Tokens
    it('Extracts name from URL in Q3', () => {
        const res = inferProductName({ q3: 'getbetter.com' });
        expect(res.name).toBe('getbetter');
    });

    it('Extracts name from .app domain', () => {
        const res = inferProductName({ q3: 'super.app' });
        expect(res.name).toBe('super');
    });

    // 6. Generic Blacklist
    it('Rejects "App" as a name', () => {
        const res = inferProductName({ q1: 'This App is great.', q2: 'Open the App.' });
        expect(res.name).toBe('Your Product');
        expect(res.confidence).toBe('low');
    });

    it('Rejects "Dashboard" even if capitalized', () => {
        const res = inferProductName({ q1: 'Log into Dashboard.' });
        expect(res.name).toBe('Your Product');
    });

    // 7. Draft Influence
    it('Uses draft name if valid and no better signal', () => {
        const res = inferProductName({ q1: 'A scheduling tool.', draftName: 'SchedulerPro' });
        expect(res.name).toBe('SchedulerPro');
    });

    it('Overrides draft name if explicit signal contradicts', () => {
        const res = inferProductName({ q1: 'Called RealName.', draftName: 'WrongName' });
        expect(res.name).toBe('RealName');
    });

    // 8. Edge Cases
    it('Handles PascalCase token pattern', () => {
        const res = inferProductName({ q1: 'ZenTask helps you focus.' });
        expect(res.name).toBe('ZenTask');
    });

    it('Rejects person name heuristic (if obvious)', () => {
        // "John" might be tricky without NLP, but let's see if generic penalizing helps or just low score
        // Only "John" -> Score 2 (Pascal) - ??? (Person check not implemented robustly yet but let's check basic sanity)
        const res = inferProductName({ q1: 'John uses it.' });
        // Should ideally be "Your Product" or low confidence
        if (res.name === 'John') {
            expect(res.confidence).toBe('low'); // Acceptable if low confidence
        } else {
            expect(res.name).toBe('Your Product');
        }
    });

    it('Handles tie-break: Explicit > Quoted', () => {
        // "Beta" is explicit, "Alpha" is quoted
        const res = inferProductName({ q1: 'Called Beta. Context "Alpha".' });
        expect(res.name).toBe('Beta');
    });

    it('Handles empty inputs', () => {
        const res = inferProductName({});
        expect(res.name).toBe('Your Product');
    });

    it('Handles implied context in Q2 only', () => {
        const res = inferProductName({ q1: 'A CRM.', q2: 'They open PipeFlow and close deals.' });
        expect(res.name).toBe('PipeFlow');
    });

    it('Handles App suffix carefully', () => {
        const res = inferProductName({ q1: 'Use FlowApp.' });
        expect(res.name).toBe('FlowApp'); // Or 'Flow', but 'FlowApp' is valid too.
    });
});
