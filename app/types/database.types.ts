export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

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
                    user_id: string
                    inputs: Json
                    current_step: number
                    unlocks: Json
                    brand_prompt: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    user_id: string
                    inputs?: Json
                    current_step?: number
                    unlocks?: Json
                    brand_prompt?: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string
                    inputs?: Json
                    current_step?: number
                    unlocks?: Json
                    brand_prompt?: string
                }
            }
        }
    }
}
