import { z } from 'zod';

// --- ENUMS & LEVELS ---

export const SentenceLengthPrefs = ['short', 'medium', 'long', 'varied'] as const;
export const StructurePrefs = ['lists', 'paragraphs', 'headings'] as const;

// Strictness: no (0) > some (1) > yes (2). Pick strictest implies ??
// Wait, prompt says: "contractions strictness: no > some > yes (pick strictest)".
// usually "strictest" means the most restrictive. "No" is most restrictive.
// So strictness order: No=0, Some=1, Yes=2. Pick LOWEST.
export const ContractionPrefs = ['no', 'some', 'yes'] as const;

// Emojis: never > rare > some > frequent. Pick strictest = LOWEST.
export const EmojiPrefs = ['never', 'rare', 'some', 'frequent'] as const;

// Numbers: avoid > use. Pick strictest = LOWEST (avoid).
export const NumberPrefs = ['avoid', 'use'] as const;

// Passive Voice: avoid > rare > allow. Pick strictest = LOWEST.
export const PassiveVoicePrefs = ['avoid', 'rare', 'allow'] as const;

// Stance Hedging: none > low > medium > high. Pick strictest = LOWEST (none/low hedging = strict facts).
export const HedgingPrefs = ['none', 'low', 'medium', 'high'] as const;

// Stance Evidence: optional > preferred > required. Pick strictest = HIGHEST (required).
export const EvidencePrefs = ['optional', 'preferred', 'required'] as const;

// Stance Claims: measured > confident > strong. Pick strongest = HIGHEST (strong).
// User said "pick strongest = HIGHEST".
export const ClaimPrefs = ['measured', 'confident', 'strong'] as const;

// Lists/Headings (Structure): low/med/high likelihood.
export const StructureLikelihood = ['low', 'medium', 'high'] as const;


// --- ZOD SCHEMAS ---

export const ToneStyleSheetSchema = z.object({
    id: z.string(),
    name: z.string(),
    // Sliders (0-1 floats)
    sliders: z.object({
        formality: z.number().min(0).max(1),
        authority: z.number().min(0).max(1),
    }),
    // Numeric Rules
    sentence_rules: z.object({
        avg_words: z.number(),
        max_words: z.number(),
        max_clauses: z.number(),
    }),
    paragraph_rules: z.object({
        max_sentences: z.number(),
        prefer_lists: z.enum(StructureLikelihood),
        prefer_headings: z.enum(StructureLikelihood)
    }),
    // Frequencies (per 100 sentences)
    rhythm: z.object({
        questions_per_100: z.number(),
        exclamations_per_100: z.number(),
    }),
    // Usage Preferences
    micro_style: z.object({
        contractions: z.enum(ContractionPrefs),
        emojis: z.enum(EmojiPrefs),
        numbers: z.enum(NumberPrefs),
        passive_voice: z.enum(PassiveVoicePrefs)
    }),
    // Stance
    stance: z.object({
        hedging: z.enum(HedgingPrefs),
        evidence_requirement: z.enum(EvidencePrefs),
        claims: z.enum(ClaimPrefs)
    }),
    // Lexicon
    lexicon: z.object({
        preferred_verbs: z.array(z.string()),
        preferred_phrases: z.array(z.string()),
        banned_words: z.array(z.string()),
        banned_phrases: z.array(z.string())
    })
});

export type ToneStyleSheet = z.infer<typeof ToneStyleSheetSchema>;


// --- MIXED OUTPUT SCHEMA ---

export const MixedStyleSpecSchema = z.object({
    sliders: z.object({
        formality: z.number(),
        authority: z.number(),
    }),
    constraints: z.object({
        min_avg_words_per_sentence: z.number(),
        max_words_per_sentence: z.number(),
        max_clauses_per_sentence: z.number(),
        max_sentences_para: z.number(),

        questions_per_100: z.number(), // Added
        exclamations_per_100: z.number(), // Added

        punctuation_bans: z.array(z.string()), // e.g. ["!", ";"]

        allow_contractions: z.boolean(),
        allow_emojis: z.boolean(),
        allow_numbers: z.boolean(),
        allow_passive: z.boolean(),

        hedging: z.enum(HedgingPrefs),
        evidence: z.enum(EvidencePrefs),
        claims: z.enum(ClaimPrefs)
    }),
    structure: z.object({
        prefer_lists: z.boolean(),
        prefer_headings: z.boolean(),
    }),
    banned_lexicon: z.array(z.string()),
    preferred_lexicon: z.array(z.string()),
    instructions: z.array(z.string()) // Human-readable summary for Prompt
});

export type MixedStyleSpec = z.infer<typeof MixedStyleSpecSchema>;
