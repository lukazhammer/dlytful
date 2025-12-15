export type Json =
    | string
    | number
    | boolean
    | null
    | Record<string, unknown>
    | unknown[]

export interface Database {
    public: {
        Tables: {
            waitlist: {
                Row: {
                    id: string
                    created_at: string
                    email: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    email: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    email?: string
                }
            }
            sprints: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    user_id: string
                    inputs: Json
                    current_step: number
                    unlocks: Json
                    brand_prompt: string | null
                    is_complete: boolean
                    spec_hash: string
                    input_hash: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    user_id: string
                    inputs?: Json
                    current_step?: number
                    unlocks?: Json
                    brand_prompt?: string | null
                    is_complete?: boolean
                    spec_hash: string
                    input_hash: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    user_id?: string
                    inputs?: Json
                    current_step?: number
                    unlocks?: Json
                    brand_prompt?: string | null
                    is_complete?: boolean
                    spec_hash?: string
                    input_hash?: string
                }
            }
        }
    }
}
