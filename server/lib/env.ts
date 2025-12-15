export const getEnv = (key: string): string => {
    // Try process.env first (standard Node)
    const val = process.env[key];
    if (val) return val;

    // Optional: Try runtime config if we passed event or useRuntimeConfig (but outside event handler context useRuntimeConfig might behave differently depending on call site).
    // However, server/lib is usually imported by api routes where useRuntimeConfig works.
    try {
        const config = useRuntimeConfig();
        // naive mapping check, e.g. GEMINI_API_KEY -> geminiApiKey
        // But for strictness, let's rely on standard process.env which is what we used before or keys explicitly set in nuxt.config.
        // Actually, nuxt auto-imports useRuntimeConfig in server dir.

        // Let's stick to process.env for standard .env file reading which Nuxt loads.
        // If the user uses runtimeConfig values defined in nuxt.config.ts that default to '' and are overridden by NUXT_... env vars, process.env might not have the NUXT_ var if Nuxt consumes it?
        // Actually Nuxt populates process.env with loaded .env in dev.
    } catch {
        // ignore
    }

    throw new Error(`MISSING_ENV_VAR: ${key} is required but was not found.`);
};
