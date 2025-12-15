
interface InferenceResult {
    name: string;
    confidence: "high" | "medium" | "low";
    evidence: string;
}

const GENERIC_BLACKLIST = [
    "app", "application", "platform", "tool", "toolkit", "marketplace", "website", "site", "service",
    "software", "solution", "dashboard", "system", "engine", "compiler", "generator", "builder",
    "product", "project", "brand", "company", "startup", "demo", "prototype",
    "interface", "api", "wrapper", "cli", "saas", "devtool", "plugin", "extension",
    "dog", "walking", "trip", "planner", "health", "supplement", "crm", "analytics", "finance", "tracker"
];

const WEAK_TERMS = [
    "this", "that", "it", "they", "we", "our", "my", "your", "the", "a", "an",
    "use", "open", "log", "sign", "start", "click", "tap", "go", "get", "try"
];

export function isGeneric(s: string): boolean {
    const lower = s.toLowerCase();
    if (GENERIC_BLACKLIST.includes(lower)) return true;
    // Check if it's just a common generic term + "app" (e.g. "Calendar App")
    // Keep it simple: if it contains any blacklist word as a full token, penalize
    const tokens = lower.split(/[^a-z0-9]+/);
    if (tokens.every(t => GENERIC_BLACKLIST.includes(t) || WEAK_TERMS.includes(t))) return true;
    return false;
}

function scoreCandidate(candidate: string, sourceScore: number, context: string): number {
    let score = sourceScore;
    const clean = candidate.trim();

    // Length sanity
    if (clean.length < 2 || clean.length > 30) return -100;

    // Penalize generics
    if (isGeneric(clean)) score -= 5;

    // Penalize weak terms
    if (WEAK_TERMS.includes(clean.toLowerCase())) return -100;

    // Bonus for Token Patterns
    if (clean.match(/^[A-Z][a-zA-Z0-9]+$/)) score += 2; // PascalCase
    // if (clean.includes('.')) score += 1; // Domain-ish (but check if valid domain)
    if (!clean.includes(' ')) score += 1; // Single word is better usually

    // Penalize pure category descriptions (multi-word, all lowercase or mixed generic)
    if (clean.includes(' ') && isGeneric(clean)) score -= 3;

    // Person name avoidance (heuristic: simple First Name usually bad if just "John")
    // Hard to do strictly without NLP, but "Use John" is unlikely product name.

    return score;
}

export function inferProductName(args: {
    q1?: string;
    q2?: string;
    q3?: string;
    draftName?: string;
}): InferenceResult {
    const candidates: Map<string, { score: number; evidence: string[] }> = new Map();

    const addCandidate = (name: string, points: number, reason: string) => {
        const n = name.replace(/^['"]|['"]$/g, '').trim(); // Strip quotes
        if (!n) return;

        const existing = candidates.get(n);
        if (existing) {
            existing.score += 3; // Frequency bonus (seen again)
            // existing.score += points; // Accumulate or just frequency? Let's accumulate.
            existing.evidence.push(reason); // Track sources
        } else {
            // Calculate base score
            const baseScore = scoreCandidate(n, points, reason);
            if (baseScore > -50) {
                candidates.set(n, { score: baseScore, evidence: [reason] });
            }
        }
    };

    const sources = [
        { text: args.q1 || '', label: 'Q1' },
        { text: args.q2 || '', label: 'Q2' },
        { text: args.q3 || '', label: 'Q3' }
    ];

    sources.forEach(({ text, label }) => {
        if (!text) return;

        // 1. Explicit Phrases (+5)
        const explicitRegex = /\b(called|named|titled|brand is|product is|we call it|known as)\s+([A-Z][a-zA-Z0-9\-\.]*)/gi;
        let match;
        while ((match = explicitRegex.exec(text)) !== null) {
            const clean = match[2].replace(/[.,!?)]+$/, '');
            addCandidate(clean, 5, `${label}:explicit`);
        }

        // 2. Parentheses (+4 if near verbs)
        const parenRegex = /\(([A-Za-z0-9\.\-\s]+)\)/g;
        while ((match = parenRegex.exec(text)) !== null) {
            const content = match[1];
            if (isGeneric(content)) continue;

            const contextStart = Math.max(0, match.index - 20);
            const contextEnd = Math.min(text.length, match.index + match[0].length + 20);
            const contextStr = text.slice(contextStart, contextEnd).toLowerCase();

            let pts = 3;
            if (contextStr.match(/\b(use|launch|open|download|visit|try)\b/)) {
                pts = 4;
            }
            if (content.split(' ').length < 4) {
                addCandidate(content, pts, `${label}:parens`);
            }
        }

        // 3. Quoted Strings (+3)
        const quoteRegex = /(['"])([\w\s\-\.]+)\1/g;
        while ((match = quoteRegex.exec(text)) !== null) {
            const content = match[2];
            if (content.length > 1 && content.split(' ').length < 4 && !isGeneric(content)) {
                addCandidate(content, 3, `${label}:quotes`);
            }
        }

        // 4. Token Patterns
        const tokens = text.split(/\s+/);
        tokens.forEach(t => {
            let clean = t.replace(/^[('"]+|[).!?,;:'"]+$/g, '');

            // Domain Pattern (+2.5)
            if (clean.match(/^[a-zA-Z0-9-]+\.(com|app|io|ai|co|net|org)$/i)) {
                const core = clean.split('.')[0];
                if (!isGeneric(core)) {
                    addCandidate(core, 2.5, `${label}:domain_core`);
                }
                addCandidate(clean, 2.5, `${label}:domain_full`);
                return;
            }

            // PascalCase Pattern (+2)
            if (clean.match(/^[A-Z][a-zA-Z0-9]+$/)) {
                if (!isGeneric(clean) && !WEAK_TERMS.includes(clean.toLowerCase())) {
                    // Expanded blacklist of common verbs/nouns often capitalized at start
                    const commonStartVerbs = [
                        "Use", "Open", "Try", "Get", "Download", "Launch", "Visit", "Click", "See", "Watch", "Read",
                        "Log", "Sign", "Start", "Create", "Build", "Make", "This"
                    ];
                    if (commonStartVerbs.includes(clean)) {
                        addCandidate(clean, 0.5, `${label}:pascal_weak`);
                    } else {
                        addCandidate(clean, 2, `${label}:pascal`);
                    }
                }
            }
        });
    });

    // Process Draft Name (+3 if exists)
    if (args.draftName && !isGeneric(args.draftName)) {
        addCandidate(args.draftName, 3, 'draft');
    }

    // Selection
    let bestName = "Your Product";
    let bestScore = -100;
    let bestEvidence = "none";

    if (candidates.size === 0) {
        return { name: bestName, confidence: "low", evidence: "no_valid_candidates" };
    }

    for (const [name, data] of candidates.entries()) {
        const personNames = ["John", "Jane", "Alice", "Bob", "Mike", "Sarah"];
        if (personNames.some(p => p.toLowerCase() === name.toLowerCase())) {
            data.score -= 4; // Stronger penalty to overcome bonuses
        }

        if (data.score > bestScore) {
            bestScore = data.score;
            bestName = name;
            bestEvidence = data.evidence.join(',');
        } else if (data.score === bestScore) {
            const priority = (ev: string) => {
                if (ev.includes('explicit')) return 5;
                if (ev.includes('parens')) return 4;
                if (ev.includes('quotes')) return 3;
                if (ev.includes('domain')) return 2;
                return 1;
            };
            if (priority(data.evidence.join(',')) > priority(bestEvidence)) {
                bestName = name;
                bestEvidence = data.evidence.join(',');
            }
        }
    }

    if (bestScore < 2) {
        return {
            name: "Your Product",
            confidence: "low",
            evidence: `best_was_weak:${bestName}[${bestScore}]`
        };
    }

    let confidence: "high" | "medium" | "low" = "low";
    if (bestScore >= 5) confidence = "high";
    else if (bestScore >= 2.5) confidence = "medium";

    if (isGeneric(bestName)) {
        return { name: "Your Product", confidence: "low", evidence: `best_was_generic:${bestName}` };
    }

    return { name: bestName, confidence, evidence: `${bestName}[${bestScore}] via ${bestEvidence}` };
}
