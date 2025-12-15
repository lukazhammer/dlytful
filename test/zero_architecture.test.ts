import { describe, expect, test } from 'vitest';
import { generateAssets, compileBrandSpec } from '../lib/brand/compile';

/**
 * ARCHITECTURE VERIFICATION
 */
describe('Refactored Zero Pipeline Architecture', () => {

    // 1. Domain Awareness (No dev phrases for non-dev)
    test('Domain Awareness: Non-Dev Product shuns dev slang', () => {
        const spec = {
            productName: "TravelBuddy",
            audience: "Travelers",
            outcome: "explores freely",
            category: "Planner",
            proof: "It matches styles.",
            pain: "getting lost",
            differentiation: "It maps offline.",
            voice: { soundsLike: [], neverLike: [], neverWords: [] },
            designTokens: { accent: '#000', font: 'Inter' }
        };

        // Pass 'other' domain
        const assets = generateAssets(spec, 'other');

        // Assert NO dev defaults
        expect(assets.benefitBullets).not.toContain("Ship faster.");
        expect(assets.heroHeadlines).not.toContain("Ship with confidence.");
        expect(assets.subheadlines).not.toContain("Works inside your workflow.");

        // Assert "General" defaults instead
        expect(assets.benefitBullets).toContain("Save time.");
        expect(assets.subheadlines[2]).toBe("Designed for efficiency.");
    });

    test('Domain Awareness: Dev Product gets dev slang', () => {
        const spec = {
            productName: "ApiKit",
            audience: "Devs",
            outcome: "ships code",
            category: "SDK",
            proof: "It validates JSON.",
            pain: "broken apis",
            differentiation: "It typesafe.",
            voice: { soundsLike: [], neverLike: [], neverWords: [] },
            designTokens: { accent: '#000', font: 'Inter' }
        };

        const assets = generateAssets(spec, 'devtools');
        expect(assets.heroHeadlines).toContain("Ship with confidence.");
    });

    // 2. Category Sanitization
    test('Compiler: Category Sanitization', () => {
        const input = {
            productName: "MyTool",
            category: "A Tool that helps you win"
        };
        const { brandSpec } = compileBrandSpec(input);
        // Should strip "A " and "that helps you win"
        expect(brandSpec.category).toBe("Tool");
    });

    test('Compiler: Category Sanitization (Called X)', () => {
        const input = {
            productName: "MyTool",
            category: "Platform called MyTool"
        };
        const { brandSpec } = compileBrandSpec(input);
        expect(brandSpec.category).toBe("Platform");
    });

    // 3. Proof Sanitization
    test('Compiler: Proof Sanitization', () => {
        const input = {
            productName: "MyTool",
            proof: "integrates with linear" // Lowercase, no It
        };
        const { brandSpec } = compileBrandSpec(input);
        expect(brandSpec.proof).toBe("It integrates with linear.");
    });

    // 4. Product Type Integration
    test('Compiler: Respects product_type for defaults', () => {
        const input = {
            productName: "Test",
            product_type: "saas" // -> 'other' domain
        };
        const { assets } = compileBrandSpec(input);
        expect(assets.heroHeadlines).not.toContain("Ship with confidence.");
    });

});
