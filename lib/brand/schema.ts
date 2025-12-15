import { z } from 'zod';

export const BrandSpecSchema = z.object({
    productName: z.string(),
    category: z.string(), // max 6 words
    audience: z.string(), // max 12 words
    pain: z.string(), // max 14 words
    outcome: z.string(), // max 12 words
    differentiation: z.string(), // max 14 words
    proof: z.string(), // max 16 words
    promise: z.string(), // max 12 words
    taglineOptions: z.array(z.string()).length(3), // 3 items, each max 7 words
    voice: z.object({
        soundsLike: z.array(z.string()).length(3),
        neverLike: z.array(z.string()).length(3),
        neverWords: z.array(z.string()).max(8), // up to 8 strictly
    }),
    archetypePrimary: z.string(), // one of 12 fixed values
    archetypeSecondary: z.string().optional(),
    visualDirection: z.object({
        vibeTags: z.array(z.string()).max(5),
        uiPrinciples: z.array(z.string()).length(5),
        do: z.array(z.string()).length(6),
        avoid: z.array(z.string()).length(6),
    }),
    designTokens: z.object({
        accent: z.string(), // hex
        base: z.string(), // hex
        ink: z.string(), // hex
        radius: z.number(),
        font: z.string(),
    }),
    seo: z.object({
        primaryKeyword: z.string(), // max 4 words
        secondaryKeywords: z.array(z.string()).length(5), // 5, each max 4 words
        oneSentenceMeta: z.string().max(160), // slightly bumped standard limit to safe 160, user asked 155
    }),
    sourceNotes: z.object({
        rawWhat: z.string(),
        rawWho: z.string(),
        rawWhy: z.string(),
        rawDifferent: z.string(),
        rawSound: z.string(),
        rawLook: z.string(),
        rawForbidden: z.string(),
    })
});

export type BrandSpec = z.infer<typeof BrandSpecSchema>;
