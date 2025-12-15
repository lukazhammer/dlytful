import type { DiscoveryInput, ContradictionWarning } from '../../app/types';

export const validateInput = (input: Partial<DiscoveryInput>): { flags: string[], warnings: ContradictionWarning[] } => {
    const flags: string[] = [];
    const warnings: ContradictionWarning[] = [];

    // 1. Positioning Vague
    if (input.q1_core_what && input.q1_core_what.length < 10) {
        flags.push('positioningVague');
    }

    // 2. Promise Undeliverable
    const riskyWords = ['guaranteed', 'instant', '100%', 'best world', 'perfect'];
    const joinedText = JSON.stringify(input).toLowerCase();
    if (riskyWords.some(w => joinedText.includes(w))) {
        flags.push('promiseUndeliverable');
    }

    // 3. Archetype Tension (Example: Sage vs "Silly" vibe)
    if (input.q4_archetype_primary === 'The Sage' && input.q3_vibe_adjectives?.includes('silly')) {
        warnings.push({
            id: 'sage-silly-mismatch',
            message: 'The Sage archetype typically avoids being "silly". Consider "The Jester" or redefining the vibe.',
            field: 'q3_vibe_adjectives',
            severity: 'medium'
        });
    }

    return { flags, warnings };
}
