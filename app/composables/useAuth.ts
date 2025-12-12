import type { User } from '~/types/user'
import { useUserStore } from '~/stores/user'

export const useAuth = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const router = useRouter()
    const userStore = useUserStore()

    const isAuthenticated = computed(() => !!user.value)

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error

        // Fetch user profile from our users table
        if (data.user) {
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single()

            if (profile) {
                userStore.setUser(profile as User, data.session?.access_token || '')
            }
        }

        return true
    }

    const register = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })

        if (error) throw error

        // The trigger will auto-create the user profile
        // Fetch it after a brief delay to ensure trigger has run
        if (data.user) {
            // Small delay to let trigger execute
            await new Promise(resolve => setTimeout(resolve, 500))

            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single()

            if (profile) {
                userStore.setUser(profile as User, data.session?.access_token || '')
            }
        }

        return true
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        userStore.clearUser()
        router.push('/login')
    }

    return {
        user,
        isAuthenticated,
        login,
        register,
        logout
    }
}
