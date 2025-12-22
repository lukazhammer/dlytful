import signals from './archetype_signals.v1.json';

export type ArchetypeName =
    | 'The Innocent'
    | 'The Sage'
    | 'The Explorer'
    | 'The Outlaw'
    | 'The Magician'
    | 'The Hero'
    | 'The Lover'
    | 'The Jester'
    | 'The Caregiver'
    | 'The Ruler'
    | 'The Creator'
    | 'The Everyman';

type Signal = {
    type: 'regex' | 'phrase';
    pattern: string;
    weight: number;
};

type ArchetypeConfig = {
    description?: string;
    signals?: Signal[];
    anti_signals?: Signal[];
};

type ScoreHit = {
    archetype: ArchetypeName;
    pattern: string;
    weight: number;
    matched: string;
};

export type ArchetypeScoreResult = {
    archetype: ArchetypeName;
    score: number;
    scores: Record<ArchetypeName, number>;
    alternatives: { name: ArchetypeName; score: number; matchCount: number }[];
    topHits: ScoreHit[];
    chosenHits: ScoreHit[];
    tieBreakUsed: boolean;
};

function normalizeText(input: string): string {
    let s = input ?? '';
    s = s.toLowerCase();
    s = s.replace(/[^a-z0-9\s-]+/g, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
}

function applyFluffDampeners(text: string): { multiplier: number } {
    const dampeners: { pattern: string; multiplier: number }[] = (signals as any).global?.fluff_dampeners ?? [];
    let multiplier = 1;
    for (const d of dampeners) {
        const rx = new RegExp(d.pattern, 'i');
        if (rx.test(text)) multiplier = Math.min(multiplier, d.multiplier);
    }
    return { multiplier };
}

function stableTieBreak(inputHash: string, options: ArchetypeName[]): ArchetypeName {
    const h = (inputHash || '').slice(0, 8);
    const n = Number.parseInt(h || '0', 16);
    const idx = options.length ? (n % options.length) : 0;
    return options[idx] ?? options[0] ?? 'The Everyman';
}

function execSignal(text: string, sig: Signal): { matched: boolean; matchedText: string } {
    if (sig.type === 'phrase') {
        const needle = sig.pattern.toLowerCase().trim();
        if (!needle) return { matched: false, matchedText: '' };
        const i = text.indexOf(needle);
        if (i === -1) return { matched: false, matchedText: '' };
        return { matched: true, matchedText: needle };
    }

    const rx = new RegExp(sig.pattern, 'i');
    const m = text.match(rx);
    if (!m) return { matched: false, matchedText: '' };
    return { matched: true, matchedText: m[0] ?? '' };
}

export function scoreArchetype(params: {
    q1_core_what: string;
    q2_moment?: string;
    q3_url_or_desc?: string;
    product_type?: string;
    inputHash: string;
}): ArchetypeScoreResult {
    const combinedRaw = [
        params.q1_core_what ?? '',
        params.q2_moment ?? '',
        params.q3_url_or_desc ?? '',
        params.product_type ?? ''
    ].join(' | ');

    const normalized = normalizeText(combinedRaw);
    const { multiplier } = applyFluffDampeners(normalized);

    const archetypesObj: Record<string, ArchetypeConfig> = (signals as any).archetypes ?? {};
    const archetypeNames = Object.keys(archetypesObj) as ArchetypeName[];

    const scores = {} as Record<ArchetypeName, number>;
    for (const name of archetypeNames) scores[name] = 0;

    const hits: ScoreHit[] = [];

    for (const name of archetypeNames) {
        const cfg = archetypesObj[name] ?? {};

        for (const sig of cfg.signals ?? []) {
            const res = execSignal(normalized, sig);
            if (!res.matched) continue;
            const w = Math.round(sig.weight * multiplier * 100) / 100;
            scores[name] += w;
            hits.push({ archetype: name, pattern: sig.pattern, weight: w, matched: res.matchedText });
        }

        for (const sig of cfg.anti_signals ?? []) {
            const res = execSignal(normalized, sig);
            if (!res.matched) continue;
            const w = Math.round(sig.weight * 100) / 100;
            scores[name] += w;
            hits.push({ archetype: name, pattern: sig.pattern, weight: w, matched: res.matchedText });
        }
    }

    let bestScore = -Infinity;
    for (const name of archetypeNames) bestScore = Math.max(bestScore, scores[name]);

    let best = archetypeNames.filter(a => scores[a] === bestScore);

    let tieBreakUsed = false;

    if (bestScore === 0) best = ['The Everyman'];

    let chosen: ArchetypeName;
    if (best.length === 1) {
        chosen = best[0]!;
    } else {
        tieBreakUsed = true;
        chosen = stableTieBreak(params.inputHash, best);
    }

    const chosenHits = hits
        .filter(h => h.archetype === chosen)
        .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
        .slice(0, 6);

    const matchCount: Record<string, number> = {};
    for (const h of hits) {
        matchCount[h.archetype] = (matchCount[h.archetype] || 0) + 1;
    }

    const alternatives = archetypeNames
        .filter(a => a !== chosen)
        .sort((a, b) => scores[b] - scores[a])
        .slice(0, 2)
        .map(a => ({
            name: a,
            score: Math.round(scores[a] * 10) / 10, // Round to 1 decimal
            matchCount: matchCount[a] || 0
        }));

    // Also include winner score in result for ease
    const winnerScore = Math.round(scores[chosen] * 10) / 10;

    const topHits = hits
        .slice()
        .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
        .slice(0, 12);

    return { archetype: chosen, score: winnerScore, scores, topHits, chosenHits, alternatives, tieBreakUsed };
}
