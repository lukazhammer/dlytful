
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Replicating the schema logic from the handler for testing
const PositioningPartsSchema = z.object({
    target: z.string().min(3),
    product: z.string().min(1),
    category: z.string().min(3),
    value: z.string().min(5),
    alternative: z.string().min(3).optional(),
    differentiator: z.string().min(5),
    proof: z.string().min(5).refine(val => !val.toLowerCase().includes('generic'), { message: "Proof cannot be generic" })
});

const MARKETING_BANS = ['you', 'your', 'buy', 'now', 'click'];
const MarketingCheck = z.object({
    target: z.string().refine(val => !MARKETING_BANS.some(ban => val.toLowerCase().includes(ban)), { message: "Target uses second person/marketing language" }),
    value: z.string().refine(val => !MARKETING_BANS.some(ban => val.toLowerCase().includes(ban)), { message: "Value uses second person/marketing language" })
});

describe('Positioning Validation Rules', () => {
    it('fails if any part is missing', () => {
        const invalid = { target: 'Devs', product: 'X' }; // Missing others
        const result = PositioningPartsSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });

    it('fails if proof is generic', () => {
        const invalid = {
            // meets min length reqs
            target: 'users', product: 'brandX', category: 'tool', value: 'works', alternative: 'alternatives', differentiator: 'better',
            proof: 'It is generic and simple'
        };
        const result = PositioningPartsSchema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('Proof cannot be generic');
        }
    });

    it('fails if second person language is used (marketing check)', () => {
        const invalid = { target: 'You', value: 'Boost your sales' };
        const result = MarketingCheck.safeParse(invalid);
        expect(result.success).toBe(false);
    });

    it('passes valid internal spec', () => {
        const valid = {
            target: 'DevOps Engineers', product: 'Bolt', category: 'CI Tool',
            value: 'automates deployments', alternative: 'Jenkins',
            differentiator: 'runs locally', proof: 'used by 500 teams'
        };
        const result = PositioningPartsSchema.safeParse(valid);
        expect(result.success).toBe(true);
    });
});
