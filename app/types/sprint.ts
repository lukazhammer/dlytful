export interface Sprint {
    id: string
    user_id: string
    parent_id: string | null
    label: string | null
    inputs: DiscoveryInputs
    outputs: GeneratedOutputs
    archetype_primary: string | null
    archetype_secondary: string | null
    status: 'draft' | 'complete'
    created_at: string
    updated_at: string
}

export interface DiscoveryInputs {
    product_description?: string
    core_moment?: string
    current_state?: string
    target_persona?: string
    friend_description?: string
    prior_frustration?: string
    not_like?: string
    jargon_check?: string
    opposite?: string
    perfect_day?: string
    archetype_primary?: string
    archetype_secondary?: string
    validation_feedback?: string
}

export interface GeneratedOutputs {
    positioning?: string
    rebrand_prompt?: string
    foundation_prompt?: string
    discoverability_prompt?: string
    agent_prompt?: string
    copy_angles?: string[]
    social_bio?: string
    voice_rules?: VoiceRules
}

export interface VoiceRules {
    sounds_like: string[]
    never_like: string[]
    never_words: string[]
}
