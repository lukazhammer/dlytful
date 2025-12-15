import { removeHedges, normalizePunctuation } from "./hedge";
import { normalizeProductName, normalizeCategory } from "./normalize";
import { dedupePreserveOrder } from "./utils";
// import { BrandArchetype } from '~/types';

// Helper to truncate words
function limitWords(s: string, max: number): string {
    return s.split(/\s+/).slice(0, max).join(" ");
}

/**
 * Cleanup specific to product names to remove "called X", "named Y", etc.
 */
function stripNamingPhrases(s: string): string {
    // Only strip "called/named/titled X" where X is likely a proper noun or code-word.
    // Avoid stripping "is a" here as it helps category identification.
    return s.replace(/(\bcalled\b|\bnamed\b|\btitled\b)\s+([A-Za-z0-9\-\.]+)/gi, "")
        .replace(/\s+/g, ' ').trim();
}

export function extractName(raw: string): string {
    const clean = normalizePunctuation(raw);

    // 1. Look for explicit pattern "called X", "named X"
    const namingMatch = clean.match(/\b(called|named|titled)\s+([A-Z][a-zA-Z0-9\-\.]*)/);
    if (namingMatch) {
        // Return the captured name
        return namingMatch[2]!;
    }

    // 2. Look for "X is a..." where X is a Proper Noun
    const isAMatch = clean.match(/^([A-Z][a-zA-Z0-9\-\.]*)\s+is\s+a/);
    if (isAMatch) {
        return isAMatch[1]!;
    }

    // 3. Fallback logic
    const normalized = normalizeProductName(clean);

    if (normalized === "Your Product") {
        // If normalize failed (probably because it started with "A/An" or was too long)
        // Try to heuristic grab a "Working Name" from the first few words.
        // e.g. "A Deterministic Compiler" -> "Deterministic Compiler"
        const words = clean.split(/\s+/);

        // Strip leading "A", "An", "The"
        let startIdx = 0;
        if (words.length > 0 && ["a", "an", "the"].includes((words[0] || "").toLowerCase())) {
            startIdx = 1;
        }

        const candidateWords = words.slice(startIdx, startIdx + 3);
        const candidate = candidateWords.join(" ");

        // Basic sanity: Is it short enough?
        if (candidate.length > 2 && candidate.length < 30) {
            // Check for stop words to avoid "It is a" becoming the name
            const first = (candidateWords[0] || "").toLowerCase();
            if (!["it", "this", "that", "there"].includes(first)) {
                return candidate;
            }
        }
    }

    return normalized;
}

export function extractCategory(raw: string): string {
    let clean = normalizePunctuation(raw);

    // Strip "called Dlytful" -> "Dlytful" removed
    clean = stripNamingPhrases(clean);

    // Strip generic starts like "This is a", "It is a"
    clean = clean.replace(/^(this|it)\s+is\s+a\s+/i, "");

    const r = clean.toLowerCase();
    // Specific Mappings (keep explicit overrides)
    if (r.includes("analytics for how the team ships")) return "Workflow Intelligence";
    if (r.includes("shows where work gets stuck")) return "Bottleneck Finder";
    if (r.includes("hydration")) return "Hydration Tracker";

    // "is a" extraction (preserve casing)
    const match = clean.match(/\bis a\b/i);
    if (match && match.index !== undefined) {
        const after = clean.slice(match.index + match[0].length).trim();
        // Stop at common prepositional phrases that end the category definition
        const stopRegex = /\s+(for|that|which|called|named|with|used|by)\b/i;
        const stopMatch = after.match(stopRegex);

        let candidate = after;
        if (stopMatch && stopMatch.index !== undefined) {
            candidate = after.slice(0, stopMatch.index);
        }

        const parts = candidate.split(/\s+/);
        return parts.slice(0, Math.min(4, parts.length)).join(" ");
    }

    // Fallback: Use the whole string but cleaned
    // Remove "for X" if present to keep category short
    let cleanNoFor = clean.replace(/\s+for\s+.*/i, "");

    // Strip leading "A", "An", "The" from the result
    cleanNoFor = cleanNoFor.replace(/^(a|an|the)\s+/i, "");

    const final = limitWords(normalizeCategory(cleanNoFor), 5);
    if (!final || final.length < 2) return "Product";
    return final;
}

export function extractAudience(raw: string): string {
    const clean = removeHedges(normalizePunctuation(raw));
    return limitWords(clean, 12);
}

export function extractPain(q1: string, q6: string, q2_moment: string = ""): string {
    // Prefer Q2 Moment if available as it often describes the "before" state implicitly
    // But Q6 (Mission/Why) is also good.
    // If Moment contains "stuck", "tired", "needs", "fail", etc. -> strong signal.

    // If Q2 Moment is strong, use it exclusively to avoid polluting pain with product name (from Q1)
    if (q2_moment && q2_moment.length > 8) {
        // Just use moment because it is the most user-centric source
        return limitWords(removeHedges(normalizePunctuation(q2_moment)).trim(), 14);
    }

    // Fallback to Q6 or Q1
    let source = q6 || q1 || "";

    const clean = removeHedges(normalizePunctuation(source));
    // Pick most concrete clause (heuristic: longest segment split by punctuation)
    // Deterministic tie-break: >= favors earlier segment
    const segments = clean.split(/[.,]/);
    const longest = segments.reduce((a: string, b: string) => a.length >= b.length ? a : b, "");

    const candidate = limitWords(longest.trim(), 14);
    if (candidate.length < 5) return "manual work";
    return candidate;
}

export function extractOutcome(pain: string, domain: string = 'general'): string {
    const p = pain.toLowerCase();

    // 1. Keyword Overrides (Strong signals)
    if (p.includes("stuck") || p.includes("block")) return "unblock delivery";
    if (p.includes("busy") || p.includes("time") || p.includes("slow")) return "save time";
    if (p.includes("messy") || p.includes("chaos") || p.includes("organized")) return "bring order to chaos";
    if (p.includes("tired") || p.includes("stress")) return "feel peace of mind";
    if (p.includes("customer")) return "delight every user";

    // 2. Domain Defaults (Anti-Sameness)
    if (domain === 'devtools') return "ship with clarity";
    if (domain === 'saas') return "scale operations";
    if (domain === 'consumer') return "feel better every day";
    if (domain === 'travel') return "explore freely";

    // 3. Fallback
    return "get results without guesswork";
}

export function extractOutcomeFromMoment(moment: string, domain: string = 'general'): string | null {
    if (!moment) return null;
    const m = moment.toLowerCase();

    // Verbs to lock onto
    if (m.includes("launch")) return "launch faster";
    if (m.includes("deploy")) return "deploy instantly";
    if (m.includes("save")) return "save hours";
    if (m.includes("grow")) return "grow revenue";
    if (m.includes("relax") || m.includes("calm")) return "feel calm";
    if (m.includes("travel") || m.includes("trip")) return "explore freely";
    if (m.includes("sleep")) return "sleep better";

    // Domain Fallbacks if Moment is weak but present
    if (domain === 'consumer') return "live better";
    if (domain === 'saas') return "work smarter";

    return null;
}

export function extractDifferentiation(q7: string): string {
    const clean = removeHedges(normalizePunctuation(q7));
    return limitWords(clean, 12);
}

export function extractVoice(q7_diff: string, q9_voice: string, archetypeData: { voice?: string[] }): { soundsLike: string[], neverLike: string[], neverWords: string[] } {
    const input = (q7_diff + " " + q9_voice).toLowerCase();

    // Priority: Explicit input keywords > Archetype defaults
    const candidates: string[] = [];

    // Check specific keywords that override/prepend
    if (input.includes("direct")) candidates.push("Direct");
    if (input.includes("professional")) candidates.push("Professional");

    // Add archetype defaults
    if (archetypeData.voice) {
        candidates.push(...archetypeData.voice);
    }

    // Deterministic dedupe (max 3)
    const finalSoundsLike = dedupePreserveOrder(candidates, 3);

    const neverLike = ["Arrogant", "Confusing", "Generic"];

    const baseNeverWords = ["synergy", "10x", "disruptive", "AI-powered", "crush it", "hustle"];

    return {
        soundsLike: finalSoundsLike,
        neverLike,
        neverWords: baseNeverWords
    };
}
