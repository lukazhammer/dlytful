import { defineEventHandler, readBody } from 'h3';
import { compileBrandSpec } from '../../../lib/brand/compile';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { inputs } = body;

    try {
        const { brandSpec, markdown } = compileBrandSpec(inputs);

        return {
            success: true,
            brandSpec,
            compiledPromptMarkdown: markdown,
            warnings: [],
            flags: []
        };
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown compilation error';
        return {
            success: false,
            error: message
        };
    }
});
