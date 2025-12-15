import type { BrandArchetype } from '~/types';

export const ARCHETYPES: Record<BrandArchetype, { description: string; motto: string; color: string }> = {
    'The Innocent': {
        description: "Optimistic, honest, and humble. Seeks happiness and simplicity.",
        motto: "Free to be you and me.",
        color: "#87CEEB" // Sky blue
    },
    'The Sage': {
        description: "Seeker of truth, knowledge, and wisdom. Analytical and objective.",
        motto: "The truth will set you free.",
        color: "#708090" // Slate gray
    },
    'The Explorer': {
        description: "Adventurous, independent, and pioneering. Values freedom above all.",
        motto: "Don't fence me in.",
        color: "#228B22" // Forest green
    },
    'The Outlaw': {
        description: "Rebellious, disruptive, and liberating. Wants to overturn what isn't working.",
        motto: "Rules are made to be broken.",
        color: "#8B0000" // Dark red
    },
    'The Magician': {
        description: "Visionary, transformative, and charismatic. Makes the impossible possible.",
        motto: "I make things happen.",
        color: "#800080" // Purple
    },
    'The Hero': {
        description: "Courageous, bold, and competent. Proven worth through difficult acts.",
        motto: "Where there's a will, there's a way.",
        color: "#FF4500" // Orange red
    },
    'The Lover': {
        description: "Passionate, intimate, and appreciative. Seeking bliss and togetherness.",
        motto: "You're the only one.",
        color: "#FF1493" // Deep pink
    },
    'The Jester': {
        description: "Playful, humorous, and light-hearted. Lives in the moment.",
        motto: "You only live once.",
        color: "#FFD700" // Gold
    },
    'The Everyman': {
        description: "Relatable, grounded, and authentic. Belongs to the community.",
        motto: "All men and women are created equal.",
        color: "#A0522D" // Sienna
    },
    'The Caregiver': {
        description: "Compassionate, nurturing, and generous. Protects people from harm.",
        motto: "Love your neighbor as yourself.",
        color: "#FFB6C1" // Light pink
    },
    'The Ruler': {
        description: "Commanding, controlling, and responsible. Creates order from chaos.",
        motto: "Power isn't everything, it's the only thing.",
        color: "#000000" // Black/Dark
    },
    'The Creator': {
        description: "Imaginative, artistic, and enduring. Realizes a vision.",
        motto: "If you can imagine it, it can be done.",
        color: "#FF8C00" // Dark orange
    }
};
