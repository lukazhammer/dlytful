import { buildBrandPrompt } from '../../lib/prompts';
import { validateInput } from '../../lib/validation';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { inputs, tier } = body;

    // 1. Validation & Quality Flags
    const { flags, warnings } = validateInput(inputs);

    // 2. Deterministic Generation
    // Note: Banned words are filtered inside buildBrandPrompt
    const markdown = buildBrandPrompt(inputs, tier || 'Free');

    return {
        markdown,
        flags,
        warnings,
        framework: 'dlytful-v1'
    };
});
