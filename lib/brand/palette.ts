
export const CURATED_PALETTES = [
    {
        id: 'midnight-neon',
        name: 'Midnight Neon',
        accent: '#CCFF00', // Electric Lime
        base: '#0A0A0A',   // Deep Black
        ink: '#FFFFFF',
        font: 'Outfit',
        radius: 1,
        tags: ['bold', 'tech', 'future', 'disruptive']
    },
    {
        id: 'swiss-design',
        name: 'Swiss Design',
        accent: '#FF3333', // Swiss Red
        base: '#FFFFFF',   // White
        ink: '#000000',
        font: 'Inter',
        radius: 0,
        tags: ['clean', 'objective', 'classic', 'efficient']
    },
    {
        id: 'warm-paper',
        name: 'Warm Paper',
        accent: '#D97706', // Amber
        base: '#FBFBF3',   // Warm Off-white
        ink: '#292524',    // Stone 800
        font: 'Cormorant',
        radius: 0.25,
        tags: ['organic', 'human', 'literary', 'thoughtful']
    },
    {
        id: 'slate-glass',
        name: 'Slate Glass',
        accent: '#38BDF8', // Sky Blue
        base: '#0F172A',   // Slate 900
        ink: '#F1F5F9',    // Slate 100
        font: 'Inter',
        radius: 0.75,
        tags: ['modern', 'saas', 'trustworthy', 'crisp']
    },
    {
        id: 'luxury-mono',
        name: 'Luxury Mono',
        accent: '#D4D4D4', // Neutral Silver
        base: '#171717',   // Neutral 900
        ink: '#FAFAFA',
        font: 'Cormorant',
        radius: 0,
        tags: ['premium', 'exclusive', 'timeless', 'minimal']
    },
    {
        id: 'forest-calm',
        name: 'Forest Calm',
        accent: '#34D399', // Emerald
        base: '#022C22',   // Deep Green
        ink: '#ECFDF5',
        font: 'Outfit',
        radius: 1.5,
        tags: ['growth', 'nature', 'peaceful', 'friendly']
    },
    {
        id: 'violet-haze',
        name: 'Violet Haze',
        accent: '#A78BFA', // Soft Violet
        base: '#2E1065',   // Deep Violet
        ink: '#F5F3FF',
        font: 'Outfit',
        radius: 0.5,
        tags: ['creative', 'imaginative', 'magic', 'soft']
    },
    {
        id: 'corporate-blue',
        name: 'Corporate Stability',
        accent: '#2563EB', // Royal Blue
        base: '#FFFFFF',
        ink: '#1E3A8A',    // Dark Blue
        font: 'Inter',
        radius: 0.125,
        tags: ['stable', 'professional', 'corporate', 'secure']
    }
];

export function getPaletteById(id: string) {
    return CURATED_PALETTES.find(p => p.id === id) || CURATED_PALETTES[0];
}

export function getAllPaletteOptions() {
    return CURATED_PALETTES.map(p => `- ID: "${p.id}" (${p.tags.join(', ')})`).join('\n');
}
