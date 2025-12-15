import { getEnv } from '../lib/env';

export default defineEventHandler((_event) => {
    // Validate runtime presence
    const url = getEnv('NUXT_PUBLIC_SUPABASE_URL');
    const key = getEnv('NUXT_PUBLIC_SUPABASE_ANON_KEY');

    return {
        ok: true,
        checks: {
            url: !!url,
            key: !!key
        }
    };
});
