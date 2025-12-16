
const STOPWORDS = new Set([
    'and', 'or', 'the', 'a', 'an', 'to', 'of', 'in', 'on', 'for', 'with', 'from',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'but', 'at', 'by', 'up', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
]);

export function sanitizeLexicon(words: string[]): string[] {
    if (!words) return [];

    return words.filter(w => {
        const lower = w.toLowerCase().trim();
        // Remove short words <= 2 chars
        if (lower.length <= 2) return false;
        // Remove stopwords
        if (STOPWORDS.has(lower)) return false;
        return true;
    });
}
