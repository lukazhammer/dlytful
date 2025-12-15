/**
 * Dedupes tokens case-insensitively while preserving original order and casing of first occurrence.
 * Enforces max length.
 */
export function dedupePreserveOrder(items: unknown[], max: number): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const item of items) {
        if (result.length >= max) break;
        if (typeof item !== 'string') continue;

        const normalized = item.trim().toLowerCase();
        if (!normalized) continue;

        if (!seen.has(normalized)) {
            seen.add(normalized);
            result.push(item.trim());
        }
    }
    return result;
}
