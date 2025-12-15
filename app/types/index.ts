export type BrandArchetype =
    | 'The Innocent' | 'The Sage' | 'The Explorer' | 'The Outlaw'
    | 'The Magician' | 'The Hero' | 'The Lover' | 'The Jester'
    | 'The Everyman' | 'The Caregiver' | 'The Ruler' | 'The Creator';

export interface DiscoveryInput {
    q1_core_what: string;
    q2_audience_who: string;
    q3_vibe_adjectives: string[];
    q4_archetype_primary: BrandArchetype | null;
    q5_archetype_secondary: BrandArchetype | null;
    q6_mission_why: string;
    q7_competitors_differentiation: string;
    q8_banned_words: string[];
    q9_voice_tone: string;
    q10_visual_style: string;
}

export interface BrandPrompt {
    foundation: string; // The core mission/vision statement
    positioning: string; // How it sits in the market
    voice_guidelines: string[]; // Do's and Don'ts
    archetype_mix: string; // Description of the primary/secondary blend
    visual_direction: string; // Color psychology & visual metaphors
    brand_story: string; // The narrative arc
    taglines: string[]; // 3-4 generated taglines
}

export interface Unlocks {
    has_started: boolean;
    q1_complete: boolean;
    archetype_revealed: boolean;
    visuals_unlocked: boolean;
    full_prompt_ready: boolean;
}

export interface ContradictionWarning {
    id: string;
    message: string;
    field: keyof DiscoveryInput;
    severity: 'low' | 'medium' | 'high';
}
