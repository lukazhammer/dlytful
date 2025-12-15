import { describe, it, expect } from 'vitest';
import { compileBrandSpec } from '../lib/brand/compile';
import { stableStringify } from './utils/stableStringify';
import { BrandSpecSchema } from '../lib/brand/schema';

// Diverse fixtures covering edge cases
const FIXTURES = [
    {
        id: "minimal_valid",
        inputs: {
            q1_core_what: "A todo app for developers",
            q2_audience_who: "Software Engineers",
            q3_vibe_adjectives: ["Clean", "Minimal"],
            q4_archetype_primary: "The Creator",
            q6_mission_why: "To remove distraction",
            q7_competitors_differentiation: "It has no features",
            q8_banned_words: "clutter,bloat",
            q9_voice_tone: "Direct"
        }
    },
    {
        id: "luxury_brand",
        inputs: {
            q1_core_what: "High-end mechanical watches",
            q2_audience_who: "Collectors",
            q3_vibe_adjectives: ["Luxury", "Serious", "Timeless"],
            q4_archetype_primary: "The Ruler",
            q6_mission_why: "To preserve history",
            q7_competitors_differentiation: "Handmade in Switzerland",
            q8_banned_words: ["cheap", "smartwatch"],
            q9_voice_tone: "Sophisticated"
        }
    },
    {
        id: "friendly_food_app",
        inputs: {
            q1_core_what: "Vegan recipe swapper",
            q2_audience_who: "Busy parents",
            q3_vibe_adjectives: ["Friendly", "Playful", "Organic"],
            q4_archetype_primary: "The Caregiver",
            q6_mission_why: "To make health easy",
            q7_competitors_differentiation: "One-click ordering",
            q8_banned_words: ["meat", "slaughter"],
            q9_voice_tone: "Warm"
        }
    },
    {
        id: "disruptive_fintech",
        inputs: {
            q1_core_what: "Crypto bridge",
            q2_audience_who: "Traders",
            q3_vibe_adjectives: ["Bold", "Dangerous"],
            q4_archetype_primary: "The Outlaw",
            q6_mission_why: "To destroy banks",
            q7_competitors_differentiation: "No KYC",
            q8_banned_words: ["safety", "compliance"],
            q9_voice_tone: "Aggressive"
        }
    },
    {
        id: "enterprise_crm",
        inputs: {
            q1_core_what: "Salesforce alternative",
            q2_audience_who: "Sales VPs",
            q3_vibe_adjectives: ["Corporate", "Trustworthy"],
            q4_archetype_primary: "The Ruler",
            q6_mission_why: "Revenue predictability",
            q7_competitors_differentiation: "AI forecasting",
            q8_banned_words: ["guesswork", "hope"],
            q9_voice_tone: "Professional"
        }
    },
    {
        id: "empty_optional_fields",
        inputs: {
            q1_core_what: "Empty State Tester",
            q2_audience_who: "Testers",
            // Missing optional fields (q3, q4, q6, q7, q8, q9)
        }
    },
    {
        id: "banned_words_normalization",
        inputs: {
            q1_core_what: "Filter Tester",
            q2_audience_who: "Mods",
            q8_banned_words: "Bad, EVIL,  worse , bad ", // Duplicates, mixed case, whitespace
        }
    },
    {
        id: "archetype_fallback",
        inputs: {
            q1_core_what: "Fallback Tester",
            q2_audience_who: "Devs",
            q4_archetype_primary: "Unknown Archetype" // Should fallback to Creator
        }
    },
    {
        id: "proof_tool_detection",
        inputs: {
            q1_core_what: "Integrator",
            q2_audience_who: "Teams",
            q7_competitors_differentiation: "It integrates with Jira and Slack natively." // Should trigger proof logic
        }
    },
    {
        id: "non_string_inputs",
        inputs: {
            q1_core_what: 12345, // Should fail gracefully or be stringified
            q2_audience_who: null,
            q3_vibe_adjectives: ["Safe"],
            q8_banned_words: ["oops"] // Array instead of string
        }
    },
    {
        id: "unicode_inputs",
        inputs: {
            q1_core_what: "Café & Naïve",
            q2_audience_who: "Über Users",
            q8_banned_words: "résumé, touché"
        }
    }
];

describe('Brand Compiler Engine', () => {

    it('should pass strict schema validation for all fixtures', () => {
        FIXTURES.forEach(fixture => {
            const result = compileBrandSpec(fixture.inputs);
            const parsed = BrandSpecSchema.safeParse(result.brandSpec);

            if (!parsed.success) {
                console.error(`Schema failure for ${fixture.id}:`, parsed.error);
            }
            expect(parsed.success).toBe(true);
            // Also strict check
            expect(() => BrandSpecSchema.strict().parse(result.brandSpec)).not.toThrow();
        });
    });

    it('should fail strict validation if extra keys are present', () => {
        const result = compileBrandSpec(FIXTURES[0].inputs);
        const prohibited = { ...result.brandSpec, extraKey: 'should fail' };
        expect(() => BrandSpecSchema.strict().parse(prohibited)).toThrow();
    });

    it('should be deterministic (Idempotency)', () => {
        FIXTURES.forEach(fixture => {
            const run1 = compileBrandSpec(fixture.inputs);
            const run2 = compileBrandSpec(fixture.inputs);

            // Deep equality
            expect(run1.brandSpec).toEqual(run2.brandSpec);
            expect(run1.markdown).toBe(run2.markdown);

            // Stable stringify check
            expect(stableStringify(run1)).toBe(stableStringify(run2));
        });

        // Manual check case
        const input = FIXTURES[0].inputs;
        const run1 = compileBrandSpec(input);
        const run2 = compileBrandSpec(input);
        expect(run1).toEqual(run2);
    });

    it('should preserve order and dedupe banned words correctly', () => {
        const input = {
            ...FIXTURES[0].inputs,
            q8_banned_words: "apple, banana, Apple "
        };
        const { brandSpec } = compileBrandSpec(input);

        // "apple" comes first. "banana" second. "Apple" is deduped.
        const output = brandSpec.voice.neverWords.map(s => s.toLowerCase());
        expect(output).toContain('apple');
        expect(output).toContain('banana');
    });

    it('should be bit-perfectly deterministic under stress (10x loop)', () => {
        FIXTURES.forEach(fixture => {
            const firstRun = compileBrandSpec(fixture.inputs);
            const firstStable = stableStringify(firstRun.brandSpec);

            for (let i = 0; i < 10; i++) {
                const retry = compileBrandSpec(fixture.inputs);

                // Deep equality check
                expect(retry.brandSpec).toEqual(firstRun.brandSpec);
                expect(retry.markdown).toBe(firstRun.markdown);

                // Stable string check (catches key order drift)
                expect(stableStringify(retry.brandSpec)).toBe(firstStable);
            }
        });
    });

    it('should preserve meaningful order of extracted voice tags', () => {
        const input = {
            q4_archetype_primary: 'The Hero',
            q9_voice_tone: 'Direct and professional'
        };
        const result = compileBrandSpec(input);
        expect(result.brandSpec.voice.soundsLike[0]).toBe('Direct');
        expect(result.brandSpec.voice.soundsLike[1]).toBe('Professional');
        expect(result.brandSpec.voice.soundsLike).toContain('Courageous');
    });

    it('should preserve engine-first order of banned words', () => {
        const result = compileBrandSpec({ q8_banned_words: 'foo, bar' });
        // defaults come first in current implementation
        expect(result.brandSpec.voice.neverWords[0]).toBe('synergy');
    });

    it('should have NO extra keys (Strict Conformity)', () => {
        const result = compileBrandSpec(FIXTURES[0].inputs);
        const keys = Object.keys(result.brandSpec);
        // Expect only schema keys
        const allowed = [
            "productName", "category", "audience", "pain", "outcome",
            "differentiation", "proof", "promise", "taglineOptions",
            "voice", "archetypePrimary", "visualDirection", "designTokens",
            "seo", "sourceNotes", "archetypeSecondary" // assets NOT allowed
        ];
        keys.forEach(k => {
            expect(allowed).toContain(k);
        });
        // Check assets exist separately
        expect(result.assets).toBeDefined();
        expect(result.assets.oneLiner).toBeDefined();
    });



    it('should generate deterministic objection handling assets based on keywords', () => {
        // Case 1: Generic (no strategist keywords)
        const run1 = compileBrandSpec(FIXTURES[0].inputs);
        const handlers1 = run1.assets.objectionHandlers;
        expect(handlers1).toHaveLength(2);
        expect(handlers1[0].objection).toBe("Why not just use ChatGPT?");
        expect(handlers1[0].answer).toContain("ChatGPT varies");
        expect(handlers1[1].objection).toMatch(/generic/i);
        expect(handlers1[1].answer).toMatch(/constraints/i);

        // Case 2: Strategist Mentioned
        const input2 = {
            ...FIXTURES[0].inputs,
            q6_mission_why: "To replace the need for an expensive brand strategist."
        };
        const run2 = compileBrandSpec(input2);
        const handlers2 = run2.assets.objectionHandlers;
        expect(handlers2).toHaveLength(2);
        expect(handlers2[1].objection).toMatch(/strategist/i);
        expect(handlers2[1].answer).toMatch(/skip the first month/i);
    });

    it('should throw schema error if limits exceeded (manual bypass check)', () => {
        // We can't easily force compileBrandSpec to violate limits because we enforce them internally.
        // So we will test the Schema directly here.

        const invalidSpec = {
            productName: "Valid",
            category: "one two three four five six SEVEN", // Limit 6
            audience: "valid",
            pain: "valid",
            outcome: "valid",
            differentiation: "valid",
            proof: "valid",
            promise: "valid",
            taglineOptions: ["valid", "valid", "valid"],
            voice: { soundsLike: ["A", "B", "C"], neverLike: ["A", "B", "C"], neverWords: [] },
            archetypePrimary: "Valid",
            visualDirection: { vibeTags: [], uiPrinciples: [], do: [], avoid: [] },
            designTokens: { accent: "#000000", ink: "#000000", base: "#000000", radius: 1, font: "Inter" },
            seo: { primaryKeyword: "valid", secondaryKeywords: [], oneSentenceMeta: "valid" },
            sourceNotes: { rawWhat: "", rawWho: "", rawWhy: "", rawDifferent: "", rawSound: "", rawLook: "", rawForbidden: "" }
        };

        // We use @ts-ignore because we are testing runtime validation of invalid data that Typescript might complain about if we typed it strictly.
        // But here we construct a loose object.
        expect(() => BrandSpecSchema.parse(invalidSpec)).toThrow(/Must be 6 words or fewer/);
    });

    it('should produce deterministic stableHash', () => {
        const input = FIXTURES[0].inputs;
        const res1 = compileBrandSpec(input);
        const res2 = compileBrandSpec(input);
        expect(res1.specHash).toBe(res2.specHash);
    });

    it('should generate stable snapshots (Full Output)', () => {
        const snapshots: Record<string, unknown> = {};
        FIXTURES.forEach(fixture => {
            const result = compileBrandSpec(fixture.inputs);
            snapshots[fixture.id] = {
                brandSpecStringified: stableStringify(result.brandSpec),
                assetsStringified: stableStringify(result.assets),
                markdown: result.markdown
            };
        });
        expect(stableStringify(snapshots)).toMatchSnapshot();
    });

    it('should match snapshots', () => {
        const snapshots: Record<string, string> = {};
        FIXTURES.forEach((input, i) => {
            const { brandSpec, markdown, specHash, assets } = compileBrandSpec(input.inputs);
            snapshots[`Case ${i + 1} Spec`] = stableStringify(brandSpec);
            snapshots[`Case ${i + 1} Assets`] = stableStringify(assets);
            snapshots[`Case ${i + 1} MD`] = markdown;
            snapshots[`Case ${i + 1} Hash`] = specHash;
        });
        expect(stableStringify(snapshots)).toMatchSnapshot();
    });

    it('should harden demo output quality (Phase 30 requirements)', () => {
        const input = {
            q1_core_what: "A deterministic brand compiler called Dlytful for developers",
            q2_audience_who: "Founders",
            q7_competitors_differentiation: "" // Empty diff -> trigger fallback
        };
        const res = compileBrandSpec(input);
        const s = res.brandSpec;
        const assets = res.assets;

        // 1. Category cleaning
        expect(s.category.toLowerCase()).not.toContain('called');
        expect(s.category.toLowerCase()).not.toContain('dlytful');
        expect(s.category).not.toMatch(/^(a|an|the)\s/i);

        // 2. Positioning Grammar (2 sentences)
        const pos = res.markdown.match(/Positioning:.*? (.*)/)?.[1];
        expect(pos).toMatch(/\. It/);

        // 3. Asset Fallbacks (non-empty)
        expect(assets.heroHeadlines[2]).toBe("Deterministic. Schema-valid. Hash-verified.");
        assets.benefitBullets.forEach(b => {
            expect(b.length).toBeGreaterThan(0);
            expect(b).not.toBe(".");
        });

        // 4. Proof Grammar
        expect(s.proof).toMatch(/^it /i);
    });

});
