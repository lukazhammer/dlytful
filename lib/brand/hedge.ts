export const HEDGES = [
    "maybe",
    "probably",
    "basically",
    "kind of",
    "hopefully",
    "i guess",
    "unsure",
    "sort of",
    "literally",
    "essentially",
    "like"
];

export function removeHedges(s: string): string {
    if (!s) return "";
    let clean = s;
    for (const hedge of HEDGES) {
        const regex = new RegExp(`\\b${hedge}\\b`, 'gi');
        clean = clean.replace(regex, "");
    }
    // Collapse whitespace
    return clean.replace(/\s+/g, " ").trim();
}

export function normalizePunctuation(s: string): string {
    if (!s) return "";
    // Replace em dashes and double hyphens with comma + space (or period if preferred context, but comma safer for flow)
    let clean = s.replace(/—|--/g, ", ");

    // Replace repeated punctuation
    clean = clean.replace(/\.{2,}/g, ".");
    clean = clean.replace(/!{2,}/g, "!");
    clean = clean.replace(/\?{2,}/g, "?");

    // Fix spacing around punctuation
    clean = clean.replace(/\s+([.,!?])/g, "$1");

    return clean.trim();
}
