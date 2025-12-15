
import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~/types/database.types';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);
    const { data: { user } } = await client.auth.getUser();

    if (!user) {
        return { found: false };
    }

    const { data, error } = await client
        .from('sprints')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message });
    }

    if (!data) {
        return { found: false };
    }

    return {
        found: true,
        sprint: data
    };
});
