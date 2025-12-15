import { describe, it, expect } from 'vitest';
import { extractVoice } from '../lib/brand/extract';

describe('Extract Exports Regression Guard', () => {
    it('should export extractVoice function', () => {
        expect(typeof extractVoice).toBe('function');
    });
});
