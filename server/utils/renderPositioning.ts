interface PositioningParts {
    target: string;
    product: string;
    category: string;
    value: string;
    alternative?: string;
    differentiator: string;
    proof: string;
}

export const renderPositioningDeclaration = (parts: PositioningParts): string => {
    // "For {target}, {product} is a {category} that {value}. Unlike {alternative}, it {differentiator}. Proof: {proof}."

    // Clean inputs
    const clean = (s: string) => (s || '').trim().replace(/\.$/, '');

    const target = clean(parts.target);
    const product = clean(parts.product);
    const category = clean(parts.category);
    const value = clean(parts.value);
    const alt = clean(parts.alternative || 'alternatives');
    const diff = clean(parts.differentiator);
    const proof = clean(parts.proof);

    return `For ${target}, ${product} is a ${category} that ${value}. Unlike ${alt}, it ${diff}. Proof: ${proof}.`;
}
