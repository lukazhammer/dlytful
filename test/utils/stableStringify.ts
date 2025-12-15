/**
 * Deterministic JSON stringify that sorts object keys recursively.
 * Crucial for snapshot testing where key order must not cause diffs.
 */
export function stableStringify(obj: unknown): string {
    if (obj === null || typeof obj !== 'object') {
        return JSON.stringify(obj);
    }

    if (Array.isArray(obj)) {
        return JSON.stringify(obj.map(item => JSON.parse(stableStringify(item))));
    }

    const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
    const result: Record<string, unknown> = {};

    sortedKeys.forEach(key => {
        const val = (obj as Record<string, unknown>)[key];
        // Parse back to object to allow recursive structure when stringified at the end
        result[key] = JSON.parse(stableStringify(val));
    });

    return JSON.stringify(result, null, 2);
}
