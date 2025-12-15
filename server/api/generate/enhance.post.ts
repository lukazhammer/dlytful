

import { generateStructuredJSON } from '../../lib/ai';
import { enhancePromptTemplate, ENHANCE_SCHEMA } from '../../lib/prompts';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { field, rawInput, context } = body;

  const prompt = enhancePromptTemplate(field, rawInput, context);
  const result = await generateStructuredJSON(prompt, ENHANCE_SCHEMA);

  if (!result) {
    return { enhanced_value: rawInput, rationale: "Original input (AI unavailable)", category_tag: "Original" };
  }

  return result;
});
