export interface Archetype {
    id: string
    name: string
    description: string
    energy: string
    examples: string[]
    color: string
}

export type ArchetypeId =
    | 'innocent' | 'sage' | 'explorer' | 'outlaw'
    | 'magician' | 'hero' | 'lover' | 'jester'
    | 'everyman' | 'caregiver' | 'ruler' | 'creator'
