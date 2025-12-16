
import { ToneStyleSheet } from './schema';

export function normalizeToneSheet(raw: any): ToneStyleSheet {
    // Clone to avoid mutation
    const t = JSON.parse(JSON.stringify(raw));

    // Normalize Evidence Requirement (Schema: optional|preferred|required)
    // Legacy data might have: low|medium|high
    const evidenceMap: Record<string, string> = {
        'low': 'optional',
        'medium': 'preferred',
        'high': 'required'
    };
    if (evidenceMap[t.stance.evidence_requirement]) {
        t.stance.evidence_requirement = evidenceMap[t.stance.evidence_requirement];
    }

    // Sanity check other enums if needed (currently minimal/low are mapped 1:1 usually, but let's be safe)
    // ClaimPrefs: measured|confident|strong. 
    // Legacy might be mixed? Assuming okay for now based on visual inspection of previous JSON.

    // Contractions: no|some|yes.
    // Emojis: never|rare|some|frequent.
    // Numbers: avoid|use.
    // Passive: avoid|rare|allow.
    // Hedging: none|low|medium|high.

    // Ensure arrays are arrays
    if (!Array.isArray(t.lexicon.preferred_verbs)) t.lexicon.preferred_verbs = [];
    if (!Array.isArray(t.lexicon.preferred_phrases)) t.lexicon.preferred_phrases = [];
    if (!Array.isArray(t.lexicon.banned_words)) t.lexicon.banned_words = [];
    if (!Array.isArray(t.lexicon.banned_phrases)) t.lexicon.banned_phrases = [];

    return t as ToneStyleSheet;
}

export function normalizeToneSheets(list: any[]): ToneStyleSheet[] {
    return list.map(normalizeToneSheet);
}
