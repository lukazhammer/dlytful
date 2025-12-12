export interface Question {
    id: string
    part: 1 | 2 | 3 | 4 | 5
    text: string
    placeholder: string
    type: 'textarea' | 'text' | 'select' | 'archetype'
    minTier: 'free' | 'one' | 'max'
}

export const QUESTIONS: Question[] = [
    // Part 1 (free)
    {
        id: 'product_description',
        part: 1,
        text: "What does your product do? One sentence.",
        placeholder: "e.g., We help companies manage their cloud infrastructure.",
        type: 'textarea',
        minTier: 'free'
    },
    {
        id: 'core_moment',
        part: 1,
        text: "Walk me through the moment someone uses this and thinks 'this is good.' What's happening?",
        placeholder: "e.g., When they deploy a database in 2 minutes instead of 2 days.",
        type: 'textarea',
        minTier: 'free'
    },
    {
        id: 'current_state',
        part: 1,
        text: "Paste your current app URL, or describe what it looks like now.",
        placeholder: "https://...",
        type: 'text',
        minTier: 'free'
    },

    // Part 2 (one)
    {
        id: 'target_persona',
        part: 2,
        text: "Who immediately understands what you've built? Not age and job title. Who are they actually?",
        placeholder: "e.g., Developers who are tired of AWS console complexity.",
        type: 'textarea',
        minTier: 'one'
    },
    {
        id: 'friend_description',
        part: 2,
        text: "What would they say about your product to their friends?",
        placeholder: "e.g., 'Bro, you have to try this. It just works.'",
        type: 'textarea',
        minTier: 'one'
    },
    {
        id: 'prior_frustration',
        part: 2,
        text: "What were they frustrated with before they found you?",
        placeholder: "e.g., Spending hours configuring IAM roles.",
        type: 'textarea',
        minTier: 'one'
    },

    // Part 3 (one)
    {
        id: 'not_like',
        part: 3,
        text: "What do you absolutely NOT want your brand to feel like?",
        placeholder: "e.g., Corporate, enterprise, boring, old.",
        type: 'textarea',
        minTier: 'one'
    },
    {
        id: 'jargon_check',
        part: 3,
        text: "Would you ever use words like 'solution' or 'leverage' to describe your product?",
        placeholder: "Yes/No",
        type: 'text',
        minTier: 'one'
    },
    {
        id: 'opposite',
        part: 3,
        text: "What's the opposite of what you're building?",
        placeholder: "e.g., IBM, Oracle.",
        type: 'textarea',
        minTier: 'one'
    },

    // Part 4 (one)
    {
        id: 'perfect_day',
        part: 4,
        text: "Describe the feeling of a perfect day. The kind you mention to friends weeks later.",
        placeholder: "e.g., Waking up without an alarm, shipping a new feature...",
        type: 'textarea',
        minTier: 'one'
    },
    {
        id: 'archetype_selection',
        part: 4,
        text: "Choose your primary archetype",
        placeholder: "",
        type: 'archetype',
        minTier: 'one'
    },

    // Part 5 (max)
    {
        id: 'validation_feedback',
        part: 5,
        text: "Here's what I'm hearing: [summary]. Does this feel right? What's missing?",
        placeholder: "It feels spot on, but maybe a bit more...",
        type: 'textarea',
        minTier: 'max'
    }
]

export const getQuestionsByPart = (part: number): Question[] => {
    return QUESTIONS.filter(q => q.part === part)
}

export const getQuestionsForTier = (tier: 'free' | 'one' | 'max'): Question[] => {
    const tiers = ['free', 'one', 'max']
    const tierIndex = tiers.indexOf(tier)

    return QUESTIONS.filter(q => {
        const qTierIndex = tiers.indexOf(q.minTier)
        return qTierIndex <= tierIndex
    })
}
