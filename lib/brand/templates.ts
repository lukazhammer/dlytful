import type { BrandSpec } from "./schema";

export function templatePositioning(spec: BrandSpec): string {
    return `For ${spec.audience}, ${spec.productName} is the ${spec.category} that ${spec.outcome} because ${spec.proof}.`;
}

export function templatePromise(spec: BrandSpec): string {
    return `We promise to ${spec.promise}.`;
}

export function templateStrategyBullets(spec: BrandSpec): string[] {
    return [
        `Deliver ${spec.outcome} consistently.`,
        `Focus on ${spec.audience} needs.`,
        `Differentiate via ${spec.differentiation}.`,
        `Maintain the ${spec.archetypePrimary} character.`,
        `Never compromise on ${spec.designTokens.font} typography.` // Dynamic filler for demo
    ];
}

export function templateSeoMeta(spec: BrandSpec): string {
    const meta = `${spec.productName}: The ${spec.category} for ${spec.audience}. ${spec.outcome}.`;
    return meta.length > 155 ? meta.substring(0, 152) + "..." : meta;
}

export function templateDoAvoid(spec: BrandSpec): { do: string[], avoid: string[] } {
    return {
        do: [
            `Use ${spec.designTokens.accent} for primary actions.`,
            `Keep layouts clean with ${spec.designTokens.radius}px radius.`,
            `Speak like a ${spec.archetypePrimary}.`,
            `Emphasize ${spec.outcome}.`,
            `Use high contrast for readability.`,
            `Keep it ${spec.visualDirection.vibeTags[0] || 'minimal'}.`
        ],
        avoid: [
            `Don't use complex gradients.`,
            `Avoid ambiguous language.`,
            `Never say exclude ${spec.audience}.`,
            `No low contrast text.`,
            `Don't clutter the view.`,
            `Never look cheap.`
        ]
    };
}
