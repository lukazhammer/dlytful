export interface BrandSpec {
    name: string;
    category: string;
    audience: string;
    pain: string;
    outcome: string;
    differentiation: string;
    proof: string;
    promise: string;
    taglineOptions: string[];
    voice: {
        soundsLike: string[];
        neverLike: string[];
        neverWords: string[];
    };
    archetypePrimary: string;
    vibeTags: string[];
    visualDo: string[];
    visualAvoid: string[];
    tokens: {
        accent: string;
        ink: string;
        base: string;
        radius: number;
        font: string;
    };
    warnings: string[];
}
