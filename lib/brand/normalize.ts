export function normalizeProductName(text: string): string {
    const t = text.trim();
    if (!t) return "Your Product";

    // 1. "called X" extraction
    const calledMatch = t.match(/\bcalled\s+([A-Z][a-zA-Z0-9\s]*)/);
    if (calledMatch && calledMatch[1]) {
        return calledMatch[1].trim();
    }

    // 2. First capitalized token sequence (simple heuristic)
    const capMatch = t.match(/([A-Z][a-zA-Z0-9]*(\s+[A-Z][a-zA-Z0-9]*)*)/);
    if (capMatch && capMatch[1] && capMatch[1].length > 1) {
        return capMatch[1].trim();
    }

    // Fallback: Use first 3 words
    const words = t.split(/\s+/).slice(0, 3).join(" ");
    if (words) {
        // Capitalize title case for fallback
        return words.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    }

    return "Your Product";
}

export function normalizeCategory(text: string): string {
    const t = text.toLowerCase().trim();
    if (!t) return "Digital Product";

    // Map common phrases
    if (t.includes('how the team ships') || t.includes('analytics')) return 'Workflow Intelligence';
    if (t.includes('hydration')) return 'Hydration Tracker';
    if (t.includes('todo') || t.includes('task')) return 'Productivity Tool';
    if (t.includes('plant')) return 'Plant Monitor';

    // Default: first noun phrase-ish (first 3 words)
    const words = t.split(/\s+/).slice(0, 3).join(" ");
    return words.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

export function normalizeAudience(text: string): string {
    const t = text.trim();
    if (!t) return "users";

    // Remove hedges
    const cleaned = t.replace(/\b(probably|maybe|i guess|basically|kind of|sort of|unsure)\b/gi, "").replace(/\s+/g, " ").trim();

    // Compress to ~6-12 words max (taking first sentence or clause)
    const firstSentence = cleaned.split(/[.!?]/)[0] || "";
    const words = firstSentence.split(/\s+/).slice(0, 12);
    return words.join(" ");
}

export function normalizeClause(text: string, maxWords: number = 12): string {
    const t = text.trim();
    if (!t) return "";

    // Remove hedges
    const cleaned = t.replace(/\b(probably|maybe|i guess|basically|kind of|sort of|unsure)\b/gi, "").replace(/\s+/g, " ").trim();

    // Extract first concrete clause (simple split by punctuation)
    const clause = (cleaned.split(/[,.!?]/)[0] || "").trim();

    const words = clause.split(/\s+/).slice(0, maxWords);
    return words.join(" ");
}

export function normalizeBannedWords(text: string): string[] {
    if (!text) return ["crush it", "hustle", "growth hack", "synergy", "disrupt", "leverage", "utilize", "innovative"];

    const list = text.split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    // Add defaults if list is short
    if (list.length < 5) {
        list.push("crush it", "hustle", "growth hack");
    }

    return list.slice(0, 8); // Max 8
}
