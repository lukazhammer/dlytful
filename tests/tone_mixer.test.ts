
import { describe, it, expect } from 'vitest';
import { mixToneSheets } from '../lib/brand/tone/mixToneSheets';
import type { ToneStyleSheet } from '../lib/brand/tone/schema';
import fs from 'fs';
import path from 'path';

// Load Fixtures
const fixturesPath = path.resolve(__dirname, 'tone_style_sheets.v1.json');
const fixtures: ToneStyleSheet[] = JSON.parse(fs.readFileSync(fixturesPath, 'utf-8'));

const sage = fixtures.find(t => t.id === 'sage')!;
const creator = fixtures.find(t => t.id === 'creator')!;
const jester = fixtures.find(t => t.id === 'jester')!;

describe('Tone Mixer', () => {

    it('should calculate weighted average for sliders', () => {
        // Formality: Sage(0.9) vs Jester(0.1)
        const result = mixToneSheets([sage, jester], [0.5, 0.5]);
        expect(result.sliders.formality).toBe(0.5);
    });

    it('should enforce strictest constraints (MIN)', () => {
        // Sage Max Words: 25, Creator: 18
        // Mix Equal -> 18 (MIN)
        const r1 = mixToneSheets([sage, creator], [0.5, 0.5]);
        expect(r1.constraints.max_words_per_sentence).toBe(18);

        // Sage Avg: 15, Creator Avg: 10 -> Avg=12.5 -> Round 13
        expect(r1.constraints.min_avg_words_per_sentence).toBe(13);
    });

    it('should use weighted vote for structure (Lists)', () => {
        // Sage: medium, Creator: high, Jester: low
        // Mix Sage(0.4) + Creator(0.4) + Jester(0.2)
        // Scores: Medium=0.4, High=0.4, Low=0.2
        // Tie (Med/High) -> Default Medium
        const r1 = mixToneSheets([sage, creator, jester], [0.4, 0.4, 0.2]);
        expect(r1.structure.prefer_lists).toBe(false); // medium isn't true? check implementation
        // medium is default, mapped to prefer_lists boolean? 
        // Logic: if high -> true. Implementation: `listStance === 'high'`.
        // So Medium -> false. Correct.

        // Mix: Creator(0.6), Jester(0.4)
        // High(0.6) vs Low(0.4) -> High wins.
        const r2 = mixToneSheets([creator, jester], [0.6, 0.4]);
        expect(r2.structure.prefer_lists).toBe(true);

        // Mix to ensure Vote Sum works:
        // Mock Tones A(High), B(High), C(Low)
        // Weights: 0.33, 0.33, 0.33
        // High=0.66, Low=0.33 -> High wins.
        const mockA = { ...creator, paragraph_rules: { same: 'high', prefer_lists: 'high' } } as any;
        const mockB = { ...creator, paragraph_rules: { same: 'high', prefer_lists: 'high' } } as any;
        const mockC = { ...creator, paragraph_rules: { same: 'low', prefer_lists: 'low' } } as any;
        const r3 = mixToneSheets([mockA, mockB, mockC], [0.33, 0.33, 0.33]);
        expect(r3.structure.prefer_lists).toBe(true);
    });

    it('should always ban em dashes', () => {
        const result = mixToneSheets([sage], [1.0]);
        expect(result.constraints.punctuation_bans).toContain('—');
        expect(result.constraints.punctuation_bans).toContain('–');
        expect(result.instructions.join(' ')).toContain('Never use punctuation: — –');
    });

    it('should generate concrete instructions', () => {
        const result = mixToneSheets([sage, creator], [0.5, 0.5]);
        const text = result.instructions.join('\n');

        expect(text).toContain('max 18 words'); // Creator (18) vs Sage (25) -> Min is 18
        expect(text).toContain('No emojis');    // Sage (never) vs Creator (rare) -> Strict is never
    });

    it('should unite banned words and preferred lexicon', () => {
        // Sage lexicon + Creator lexicon
        const result = mixToneSheets([sage, creator], [0.5, 0.5]);
        expect(result.banned_lexicon).toContain('stuff');
        expect(result.preferred_lexicon).toContain('analyze'); // verb
        expect(result.preferred_lexicon).toContain('from scratch'); // phrase
    });

    it('should be deterministic', () => {
        const r1 = mixToneSheets([sage, creator, jester], [0.3, 0.3, 0.4]);
        const r2 = mixToneSheets([sage, creator, jester], [0.3, 0.3, 0.4]);
        expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
    });

});
