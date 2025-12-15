import type { User, Session } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        session: null as Session | null,
        loading: false,
    }),

    actions: {
        async initialize() {
            const supabase = useSupabaseClient();
            const { data } = await supabase.auth.getSession();
            this.session = data.session;
            this.user = data.session?.user || null;

            supabase.auth.onAuthStateChange((_event, session) => {
                this.session = session;
                this.user = session?.user || null;
            });
        },

        async textLogin(email: string) {
            // Magic link login
            const supabase = useSupabaseClient();
            this.loading = true;
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin + '/app/sprints'
                }
            });
            this.loading = false;
            return error;
        },

        async logout() {
            const supabase = useSupabaseClient();
            await supabase.auth.signOut();
            this.user = null;
            this.session = null;
            return navigateTo('/');
        }
    }
})
