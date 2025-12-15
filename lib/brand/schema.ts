import { z } from 'zod';

// Helper for word limits
const maxWords = (n: number) => z.string().refine(
    (s) => s.trim().split(/\s+/).filter(Boolean).length <= n,
    { message: `Must be ${n} words or fewer.` }
);

export const BrandSpecSchema = z.object({
    // Core Identity
    productName: z.string().min(1),
    category: maxWords(6).describe("Max 6 words"),
    audience: maxWords(12).describe("Max 12 words"),
    pain: maxWords(14).describe("Max 14 words"),
    outcome: maxWords(12).describe("Max 12 words"),
    differentiation: maxWords(14).describe("Max 14 words"),
    proof: maxWords(16).describe("Max 16 words"),
    promise: maxWords(12).describe("Max 12 words"),
    taglineOptions: z.array(maxWords(10)).length(3), // Allowing slightly more for templates (e.g. 7-10) but request said 7. Let's check templates.

    // Voice & Tone
    voice: z.object({
        soundsLike: z.array(z.string()).length(3),
        neverLike: z.array(z.string()).length(3),
        neverWords: z.array(z.string()).max(8),
    }),

    // Archetype
    archetypePrimary: z.string(),
    archetypeSecondary: z.string().optional(),

    // Visuals
    visualDirection: z.object({
        vibeTags: z.array(z.string()).max(5),
        uiPrinciples: z.array(z.string()).max(5),
        do: z.array(z.string()).length(6),
        avoid: z.array(z.string()).length(6),
    }),

    // Design System Tokens
    designTokens: z.object({
        accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
        ink: z.string().regex(/^#[0-9a-fA-F]{6}$/),
        base: z.string().regex(/^#[0-9a-fA-F]{6}$/),
        radius: z.number().min(0).max(2),
        font: z.enum(["Inter", "Outfit", "Cormorant"]),
    }),

    // SEO Helpers
    seo: z.object({
        primaryKeyword: maxWords(6).describe("Max 6 words"), // Typically short
        secondaryKeywords: z.array(maxWords(6)).max(5),
        oneSentenceMeta: z.string().max(160),
    }),

    // Raw Sources (for debugging/context)
    sourceNotes: z.object({
        rawWhat: z.string(),
        rawWho: z.string(),
        rawWhy: z.string(),
        rawDifferent: z.string(),
        rawSound: z.string(),
        rawLook: z.string(),
        rawForbidden: z.string()
    })
}).strict(); // Enforce strictness at the source

export type BrandSpec = z.infer<typeof BrandSpecSchema>;
