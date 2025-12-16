
import { describe, it, expect } from 'vitest';

// Naive re-implementation for testing (should match server logic structure)
function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function pickRandomUnique(list: any[], count: number, seed: number) {
    const result = [];
    const clone = [...list];
    for (let i = 0; i < count; i++) {
        if (clone.length === 0) break;
        const idx = Math.floor(seededRandom(seed + i) * clone.length);
        result.push(clone.splice(idx, 1)[0]);
    }
    return result;
}

describe('pickRandomUnique', () => {
    it('should return unique items', () => {
        const list = [1, 2, 3, 4, 5];
        const res = pickRandomUnique(list, 3, 123);
        expect(res).toHaveLength(3);
        expect(new Set(res).size).toBe(3);
    });

    it('should not mutate original list', () => {
        const list = ['a', 'b', 'c'];
        pickRandomUnique(list, 2, 123);
        expect(list).toEqual(['a', 'b', 'c']);
    });

    it('should be deterministic with seed', () => {
        const list = ['a', 'b', 'c', 'd', 'e'];
        const res1 = pickRandomUnique(list, 3, 999);
        const res2 = pickRandomUnique(list, 3, 999);
        expect(res1).toEqual(res2);
    });
});
