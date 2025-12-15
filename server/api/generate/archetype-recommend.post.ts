

import { generateStructuredJSON } from '../../lib/ai';
import { archetypeRecommendPrompt, ARCHETYPE_SCHEMA } from '../../lib/prompts';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { q1_core_what, q6_mission_why, q3_vibe_adjectives } = body;

  const prompt = archetypeRecommendPrompt(q1_core_what, q6_mission_why, q3_vibe_adjectives);
  const result = await generateStructuredJSON(prompt, ARCHETYPE_SCHEMA);

  return result || { recommendations: [] }; // Graceful fallback
});
