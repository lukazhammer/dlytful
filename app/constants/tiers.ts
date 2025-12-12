export const TIERS = {
    free: {
        name: 'dlytful zero',
        price: 0,
        features: ['3 discovery questions', 'Basic rebrand prompt', 'Watermarked output'],
        maxArchetypes: 0,
        canSave: false,
        canFork: false,
        canExport: false
    },
    one: {
        name: 'dlytful one',
        price: 14,
        features: ['Full discovery flow', 'Complete rebrand prompt', 'Foundation prompt', '6 archetypes', 'Unlimited saves', 'Fork & iterate'],
        maxArchetypes: 6,
        canSave: true,
        canFork: true,
        canExport: false
    },
    max: {
        name: 'dlytful max',
        price: 29,
        features: ['Everything in dlytful one', '12 archetypes', 'Discoverability prompt', 'Agent system prompt', 'Markdown export', 'Sprint comparison'],
        maxArchetypes: 12,
        canSave: true,
        canFork: true,
        canExport: true
    }
} as const

export type TierKey = keyof typeof TIERS
