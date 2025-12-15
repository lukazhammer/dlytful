export const getEnv = (key: string): string => {
    // Try process.env first (standard Node)
    const val = process.env[key];
    if (val) return val;

    // Optional: Try runtime config if we passed event or useRuntimeConfig (but outside event handler context useRuntimeConfig might behave differently depending on call site).
    // However, server/lib is usually imported by api routes where useRuntimeConfig works.
    // Optional: Try runtime config if we passed event or useRuntimeConfig
    // But for strictness, let's rely on standard process.env which is what we used before or keys explicitly set in nuxt.config.
    // actually Nuxt populates process.env with loaded .env in dev.

    throw new Error(`MISSING_ENV_VAR: ${key} is required but was not found.`);
};
