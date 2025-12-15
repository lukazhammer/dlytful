import { getEnv } from '../lib/env';

export default defineEventHandler((_event) => {
    // Validate runtime presence with fallbacks
    let url: string | undefined;
    let key: string | undefined;

    try {
        url = getEnv('NUXT_PUBLIC_SUPABASE_URL');
    } catch {
        try { url = getEnv('SUPABASE_URL'); } catch { /* ignore */ }
    }

    try {
        key = getEnv('NUXT_PUBLIC_SUPABASE_ANON_KEY');
    } catch {
        try { key = getEnv('SUPABASE_ANON_KEY'); } catch { /* ignore */ }
    }

    if (!url || !key) {
        return {
            ok: false,
            checks: {
                url: !!url,
                key: !!key,
                missing: [!url && 'URL', !key && 'KEY'].filter(Boolean)
            }
        };
    }

    return {
        ok: true,
        checks: {
            url: !!url,
            key: !!key
        }
    };
});
