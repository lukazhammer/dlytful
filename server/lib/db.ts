import { createError } from 'h3';

export function handleSupabaseError(error: unknown) {
    if (!error) return;

    if (!error) return;

    const code = (error as { code?: string })?.code;
    const message = (error as { message?: string })?.message || 'Database error';

    // Unique violation
    if (code === '23505') {
        return { success: true, message: 'Already registered' }; // Or explicit code to let caller decide
    }

    throw createError({
        statusCode: 500,
        statusMessage: message,
    });
}
