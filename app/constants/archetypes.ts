import type { Archetype } from '~/types/archetype'

export const ARCHETYPES: Archetype[] = [
    {
        id: 'innocent',
        name: 'The Innocent',
        description: 'Simple & trustworthy',
        energy: 'Optimistic & honest',
        examples: ['Notion', 'Linear', 'Dove'],
        color: '#F5E6D3'
    },
    {
        id: 'sage',
        name: 'The Sage',
        description: 'Smart & authoritative',
        energy: 'Analytical & wise',
        examples: ['Stripe', 'Vercel', 'Google'],
        color: '#E8DCC4'
    },
    {
        id: 'explorer',
        name: 'The Explorer',
        description: 'Bold & independent',
        energy: 'Adventurous & brave',
        examples: ['Figma', 'Supabase', 'Patagonia'],
        color: '#9FB97A'
    },
    {
        id: 'outlaw',
        name: 'The Outlaw',
        description: 'Disruptive & edgy',
        energy: 'Rebellious & wild',
        examples: ['Gumroad', 'Basecamp', 'Liquid Death'],
        color: '#7CB342'
    },
    {
        id: 'magician',
        name: 'The Magician',
        description: 'Transformative & wow',
        energy: 'Visionary & charismatic',
        examples: ['OpenAI', 'Midjourney', 'Disney'],
        color: '#26A69A'
    },
    {
        id: 'hero',
        name: 'The Hero',
        description: 'Empowering & driven',
        energy: 'Courageous & mastery',
        examples: ['Shopify', 'GitHub', 'Nike'],
        color: '#4DB6AC'
    },
    {
        id: 'lover',
        name: 'The Lover',
        description: 'Premium & beautiful',
        energy: 'Passionate & sensual',
        examples: ['Apple', 'Framer', 'Chanel'],
        color: '#4FC3F7'
    },
    {
        id: 'jester',
        name: 'The Jester',
        description: 'Fun & irreverent',
        energy: 'Playful & humorous',
        examples: ['Discord', 'Duolingo', 'Old Spice'],
        color: '#BA68C8'
    },
    {
        id: 'everyman',
        name: 'The Everyman',
        description: 'Relatable & friendly',
        energy: 'Down-to-earth & supportive',
        examples: ['Slack', 'Mailchimp', 'IKEA'],
        color: '#F48FB1'
    },
    {
        id: 'caregiver',
        name: 'The Caregiver',
        description: 'Supportive & helpful',
        energy: 'Caring & nurturing',
        examples: ['Intercom', 'Calendly', 'Unicef'],
        color: '#EF5350'
    },
    {
        id: 'ruler',
        name: 'The Ruler',
        description: 'Premium & exclusive',
        energy: 'Authoritative & controlling',
        examples: ['Salesforce', 'AWS', 'Rolex'],
        color: '#FF7043'
    },
    {
        id: 'creator',
        name: 'The Creator',
        description: 'Innovative & expressive',
        energy: 'Creative & imaginative',
        examples: ['Adobe', 'Webflow', 'Lego'],
        color: '#FFA726'
    }
]

export const getArchetype = (id: string): Archetype | undefined => {
    return ARCHETYPES.find(archetype => archetype.id === id)
}
