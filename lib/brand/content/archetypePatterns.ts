
// Deterministic Patterns for Deep Remix
// Keyed by Archetype ID (normalized lowercase or Title Case as needed)

export interface PositioningPattern {
    template: string;
    description: string;
}

export const ARCHETYPE_PATTERNS: Record<string, PositioningPattern[]> = {
    'The Hero': [
        {
            template: "For [Audience] facing [Challenge], [Product] is the [Category] that [Triumphs]. Because [Proof], you [Win].",
            description: "Overcoming adversity with strength."
        },
        {
            template: "Stop letting [Enemy] hold you back. [Product] empowers [Audience] to [Conquer]. With [Feature], victory is the only option.",
            description: "Direct confrontation and empowerment."
        }
    ],
    'The Sage': [
        {
            template: "For [Audience] seeking clarity, [Product] provides [Solution] by [Method]. Logic dictates that [Proof] leads to [Outcome].",
            description: "Logical deduction and truth."
        },
        {
            template: "[Product] is the intelligent [Category] for [Audience] who value [Truth]. By analyzing [Data], we guarantee [Result].",
            description: "Intelligence and analysis."
        }
    ],
    'The Creator': [
        {
            template: "For [Audience] building the future, [Product] unlocks [Capability]. Built to [Stand Out], it turns [Vision] into reality.",
            description: "Unlocked potential and vision."
        },
        {
            template: "Craft [Masterpiece] with [Product]. For [Audience] who refuse to compromise, this is the [Category] that honors your [Craft].",
            description: "Craftsmanship and uncompromising quality."
        }
    ],
    'The Jester': [
        {
            template: "Why so serious? [Product] makes [Task] actually fun for [Audience]. With [Feature], you can [Enjoyment] while you work.",
            description: "Playful and irreverent."
        },
        {
            template: "For [Audience] tired of boring [Category], [Product] is here to shake things up. [Benefit] without the headache.",
            description: "Disrupting boredom."
        }
    ],
    'The Ruler': [
        {
            template: "For [Audience] who demand excellence, [Product] is the industry standard for [Domain]. Control your [Asset] with [Authority].",
            description: "Authority and standards."
        },
        {
            template: "Lead the market with [Product]. The definitive [Category] for [Audience] who need [Stability] and [Power].",
            description: "Market leadership."
        }
    ],
    'The Caregiver': [
        {
            template: "For [Audience] needing support, [Product] is the [Category] that truly cares. We handle [Burden] so you can [Relief].",
            description: "Support and relief."
        },
        {
            template: "[Product] is your partner in [Domain]. For [Audience], we provide [Safety] and [Comfort] through [Feature].",
            description: "Partnership and safety."
        }
    ],
    'The Innocent': [
        {
            template: "[Product] makes [Task] simple for [Audience]. It just works. Because [Proof], you can enjoy [Happiness].",
            description: "Simplicity and optimism."
        },
        {
            template: "For [Audience], [Product] is the pure, easy way to [Goal]. No clutter, just [Benefit].",
            description: "Purity and ease."
        }
    ],
    'The Explorer': [
        {
            template: "For [Audience] charting new territory, [Product] is the [Category] that goes further. Discover [Discovery] with [Feature].",
            description: "Discovery and freedom."
        },
        {
            template: "Break free from [Constraint]. [Product] gives [Audience] the freedom to [Explore]. The unknown awaits.",
            description: "Freedom from constraints."
        }
    ],
    'The Rebel': [
        {
            template: "The [Industry] is broken. [Product] is the fix for [Audience] who want [Change]. Smash [Barrier] and [Rebel Action].",
            description: "Revolution and disruption."
        },
        {
            template: "Stop settling for [Status Quo]. [Product] creates a new rulebook for [Audience]. [Benefit] on your own terms.",
            description: "Rejecting the status quo."
        }
    ],
    'The Lover': [
        {
            template: "For [Audience] who cherish [Value], [Product] is the [Category] that connects. Feel [Emotion] with every [Interaction].",
            description: "Intimacy and connection."
        },
        {
            template: "Indulge in [Benefit]. [Product] treats [Audience] to a [Sensory] experience. Because you deserve [Luxury].",
            description: "Sensory indulgence."
        }
    ],
    'The Magician': [
        {
            template: "For [Audience], [Product] transforms [State A] into [State B]. Experience the magic of [Feature] instantly.",
            description: "Transformation and wonder."
        },
        {
            template: "[Product] makes [Impossible] possible. The [Category] that turns [Dream] into [Reality] for [Audience].",
            description: "Making the impossible possible."
        }
    ],
    'The Everyman': [
        {
            template: "For regular [Audience], [Product] is the [Category] that gets the job done. Authentic [Benefit] without the hype.",
            description: "Relatability and honesty."
        },
        {
            template: "[Product] understands [Audience]. We provide real [Solution] for real problems. No nonsense, just [Result].",
            description: "Real solutions for real people."
        }
    ]
};

export const HEADLINE_MOVES = [
    {
        name: "The Punch",
        instruction: "Short (max 4 words). Verifying. A direct, undeniable claim.",
        example: "It just works."
    },
    {
        name: "The Metaphor",
        instruction: "Use an analogy: 'Like X for Y'. Or 'The X of Y'. Only if tone permits.",
        example: "The autopilot for sales."
    },
    {
        name: "The Imperative",
        instruction: "Start with a command verb. Tell the user what to do.",
        example: "Start shipping today."
    },
    {
        name: "The Benefit",
        instruction: "Focus purely on the outcome/gain for the user.",
        example: "Double your revenue."
    },
    {
        name: "The Identity",
        instruction: "Label the user or the product clearly.",
        example: "The CRM for Builders."
    }
];

export function getPositioningPattern(archetype: string, seed: number): PositioningPattern {
    const key = Object.keys(ARCHETYPE_PATTERNS).find(k => k.toLowerCase() === archetype.toLowerCase()) || 'The Sage';
    const patterns = ARCHETYPE_PATTERNS[key];
    const index = Math.floor(Math.abs(Math.sin(seed) * patterns.length)) % patterns.length;
    return patterns[index];
}

export function getHeadlineMoves(seed: number, count: number = 3): typeof HEADLINE_MOVES {
    // Deterministically shuffle and pick strict moves
    const shuffled = [...HEADLINE_MOVES].sort((a, b) => {
        const ra = Math.sin(seed + a.name.length);
        const rb = Math.sin(seed + b.name.length);
        return ra - rb;
    });
    // Ensure "The Punch" or "The Imperative" is usually included as they are strong
    // But for pure random variability, a shuffle is fine.
    return shuffled.slice(0, count);
}
