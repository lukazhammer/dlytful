import { dedupePreserveOrder } from "./utils";

function extractCalledName(text: string): string | null {
    // 1. Find "called " case-insensitively, capture until punctuation/newline
    const match = text.match(/\bcalled\s+([^\.,;:\!\?\n]+)/i);
    if (!match || !match[1]) return null;

    let captured = match[1].trim();

    // 2. Stop at hard punctuation (comma, period, newline)
    // "called "Dlytful", the..." -> "Dlytful"
    // We apply this to the already captured part.
    const stopAtPunct = captured.match(/[^.,\n]+/)?.[0] || "";

    // 2. Stop at hard stop phrases
    const STOP_PHRASES = [" is a ", " is an ", " is the ", " which ", " that ", " for ", " with ", " to "];
    // "called Dlytful for teams" -> "Dlytful"
    // We check purely for " word " boundaries or start/end
    const lower = stopAtPunct.toLowerCase();
    let bestIndex = lower.length;

    for (const phrase of STOP_PHRASES) {
        // We look for " phrase " or " phrase" at end, etc.
        // Actually, STOP_PHRASES are like " is a ", " for ".
        const idx = lower.indexOf(phrase);
        if (idx !== -1 && idx < bestIndex) {
            bestIndex = idx;
        }
    }

    const candidate = stopAtPunct.slice(0, bestIndex).trim();

    // 4. Strip quotes (if they wrap the ENTIRE candidate or just parts)
    // We want to be careful. If the user wrote: called "My App" -> My App
    // If they wrote: called "My App" v2 -> "My App" v2 -> My App v2 (maybe?)
    // Our logic: remove all quotes? Or just surrounding?
    // User requirement: "stripping quotes"
    // Let's safe-strip all quotes for simplicity in product names
    const clean = candidate.replace(/['"]+/g, '').trim();

    if (!clean) return null;

    // 5. Cap at 4 words
    const words = clean.split(/\s+/);
    if (words.length > 4) {
        return words.slice(0, 4).join(' ');
    }

    return clean;
}

export function normalizeProductName(raw: string): string {
    if (!raw) return "Your Product";
    let s = raw.trim();
    if (!s) return "Your Product";

    // 1. "called X" extraction (Safe, deterministic)
    const calledName = extractCalledName(s);
    if (calledName) return calledName;

    // 2. Quotes fallback (if no "called")
    const quoteMatch = s.match(/["']([^"']+)["']/);
    if (quoteMatch) return (quoteMatch[1] || "").trim();

    // 3. Fallback: Take up to 4 words from start
    const stopAtPunct = s.split(/[.,;:\!\?\n]/)[0] || "";
    const words = stopAtPunct.trim().split(/\s+/);
    const candidate = words.slice(0, 4).join(" ");

    // SAFETY CHECK: If the candidate starts with "A " or "An " (e.g. "A deterministic compiler...")
    // AND it wasn't explicitly "called X" or quoted, assume it's a description, not a name.
    if (candidate.match(/^(a|an)\s/i)) {
        return "Your Product";
    }

    return candidate;
}

export function normalizeCategory(raw: string): string {
    // Simple cap
    const s = (raw.split(/[.,]/)[0] || "").trim(); // Stop at punctuation
    const words = s.split(/\s+/);
    return words.slice(0, 6).join(" ");
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

export function normalizeBannedWords(raw: string): string[] {
    const defaults = ["synergy", "10x", "disruptive", "AI-powered", "crush it", "hustle"];
    const max = 8;

    // If empty input, return explicit default cap
    if (!raw || !raw.trim()) {
        return defaults.slice(0, max);
    }

    let list = raw.split(/[,.\n;]+|\bbut\b|\bexcept\b/i)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    list = [...list, ...defaults];

    // Dedupe and cap at 8
    return dedupePreserveOrder(list, 8);
}
