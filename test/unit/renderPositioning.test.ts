
import { describe, it, expect, vi } from 'vitest';
import { renderPositioningDeclaration } from '../../server/utils/renderPositioning';

describe('renderPositioningDeclaration', () => {
    it('renders a full statement correctly', () => {
        const parts = {
            target: 'developers',
            product: 'SuperTool',
            category: 'compiler',
            value: 'automates builds',
            alternative: 'manual scripts',
            differentiator: 'is instant',
            proof: 'zero config'
        };
        const result = renderPositioningDeclaration(parts);
        expect(result).toBe('For developers, SuperTool is a compiler that automates builds. Unlike manual scripts, it is instant. Proof: zero config.');
    });

    it('handles missing alternative with default', () => {
        const parts = {
            target: 'users',
            product: 'Thing',
            category: 'widget',
            value: 'does stuff',
            differentiator: 'is better',
            proof: 'trust me'
        };
        const result = renderPositioningDeclaration(parts as any);
        expect(result).toContain('Unlike alternatives, it is better.');
    });
});
