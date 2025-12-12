export interface User {
    id: string
    email: string
    tier: 'free' | 'one' | 'max'
    sprints_count: number
    created_at: string
}

export type Tier = User['tier']
