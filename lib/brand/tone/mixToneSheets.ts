import type { ToneStyleSheet, MixedStyleSpec } from './schema';
import { sanitizeLexicon } from './sanitizeLexicon';
import {
    ContractionPrefs,
    EmojiPrefs,
    NumberPrefs,
    PassiveVoicePrefs,
    HedgingPrefs,
    EvidencePrefs,
    ClaimPrefs,
    StructureLikelihood
} from './schema';

// --- HELPERS ---

function weightedAvg(values: number[], weights: number[]): number {
    let sum = 0;
    let totalWeight = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i] * weights[i];
        totalWeight += weights[i];
    }
    return totalWeight === 0 ? 0 : sum / totalWeight;
}

// Resolve by Weighted Vote (Sum weights per option, winner takes all, tie -> tieBreaker)
function resolveWeightedVote<T extends string>(
    values: T[],
    weights: number[],
    options: readonly T[],
    tieBreaker: T = 'medium' as T
): T {
    const scores: Record<string, number> = {};
    options.forEach(o => scores[o] = 0);

    for (let i = 0; i < values.length; i++) {
        const val = values[i];
        if (scores[val] !== undefined) {
            scores[val] += weights[i];
        }
    }

    let maxScore = -1;
    let winners: T[] = [];

    for (const opt of options) {
        const score = scores[opt];
        if (score > maxScore) {
            maxScore = score;
            winners = [opt];
        } else if (score === maxScore) {
            winners.push(opt);
        }
    }

    if (winners.length > 1) {
        if (winners.includes(tieBreaker)) return tieBreaker;
        return winners[0];
    }
    return winners[0];
}

// Pick LOWEST index (Skip unknown values)
function pickStrictestLow<T extends string>(vals: T[], levelMap: readonly T[]): T {
    // Default to first valid value found or levelMap[0] if completely weird? 
    // Requirement said: "pickStrictestHigh/Low ignore unknown values"
    // We start with a conservative default? Or filter strictly.
    // Let's filter first.
    const validVals = vals.filter(v => levelMap.includes(v));
    if (validVals.length === 0) return levelMap[0]; // Fallback to lowest possible

    let minIdx = levelMap.length;
    let result = validVals[0];

    for (const v of validVals) {
        const idx = levelMap.indexOf(v);
        // We know idx != -1 because we filtered.
        if (idx < minIdx) {
            minIdx = idx;
            result = v;
        }
    }
    return result;
}

// Pick HIGHEST index (Skip unknown values)
function pickStrictestHigh<T extends string>(vals: T[], levelMap: readonly T[]): T {
    const validVals = vals.filter(v => levelMap.includes(v));
    if (validVals.length === 0) return levelMap[levelMap.length - 1]; // Fallback to highest? Or lowest default? Usually highest index implies strictness so fallback to strict. But if data invalid, maybe default/middle?
    // Let's stick to valid inputs finding.

    let maxIdx = -1;
    let result = validVals[0];

    for (const v of validVals) {
        const idx = levelMap.indexOf(v);
        if (idx > maxIdx) {
            maxIdx = idx;
            result = v;
        }
    }
    return result;
}

function dedupSort(arr: string[]): string[] {
    return Array.from(new Set(arr)).sort();
}


// --- MAIN MIXER ---

export function mixToneSheets(
    tones: ToneStyleSheet[],
    weights: number[]
): MixedStyleSpec {
    if (tones.length !== weights.length) throw new Error("Length mismatch");
    if (tones.length === 0) throw new Error("No tones provided");

    // SLIDERS
    const formality = Number(weightedAvg(tones.map(t => t.sliders.formality), weights).toFixed(2));
    const authority = Number(weightedAvg(tones.map(t => t.sliders.authority), weights).toFixed(2));

    // NUMERIC RULES (Strictness)
    const maxWords = Math.min(...tones.map(t => t.sentence_rules.max_words));
    const maxClauses = Math.min(...tones.map(t => t.sentence_rules.max_clauses));
    const maxSentencesPara = Math.min(...tones.map(t => t.paragraph_rules.max_sentences));
    const avgWords = Math.round(weightedAvg(tones.map(t => t.sentence_rules.avg_words), weights));

    // Rhythm
    const exclamationsLimit = Math.min(...tones.map(t => t.rhythm.exclamations_per_100)); // MIN
    const questionsTarget = Math.round(weightedAvg(tones.map(t => t.rhythm.questions_per_100), weights)); // Avg

    // MICRO STYLE
    const contraction = pickStrictestLow(tones.map(t => t.micro_style.contractions), ContractionPrefs);
    const emoji = pickStrictestLow(tones.map(t => t.micro_style.emojis), EmojiPrefs);
    const numberStyle = pickStrictestLow(tones.map(t => t.micro_style.numbers), NumberPrefs);
    const passiveStyle = pickStrictestLow(tones.map(t => t.micro_style.passive_voice), PassiveVoicePrefs);

    // STANCE
    const hedging = pickStrictestLow(tones.map(t => t.stance.hedging), HedgingPrefs);
    const evidence = pickStrictestHigh(tones.map(t => t.stance.evidence_requirement), EvidencePrefs);
    const claims = pickStrictestHigh(tones.map(t => t.stance.claims), ClaimPrefs);

    // STRUCTURE (Vote)
    const lists = resolveWeightedVote(
        tones.map(t => t.paragraph_rules.prefer_lists), weights, StructureLikelihood, 'medium'
    );
    const headings = resolveWeightedVote(
        tones.map(t => t.paragraph_rules.prefer_headings), weights, StructureLikelihood, 'medium'
    );

    // LEXICON (Union)
    const bannedWords = new Set<string>();
    const preferredWords = new Set<string>(); // Actually maybe intersection? Or union with weight?
    // Let's do union for now, but limit total count in prompt generator.

    tones.forEach(sheet => {
        sheet.lexicon.banned_words.forEach(w => bannedWords.add(w));
        sheet.lexicon.banned_phrases.forEach(p => bannedWords.add(p));
        // Preferred:
        sheet.lexicon.preferred_verbs.forEach(v => preferredWords.add(v));
        sheet.lexicon.preferred_phrases.forEach(p => preferredWords.add(p));
    });

    const finalBanned = sanitizeLexicon(Array.from(bannedWords));
    const finalPreferred = sanitizeLexicon(Array.from(preferredWords));

    // HARD BANS (Always strict list, NOT added to banned_lexicon)
    const punctuationBans = ['!', '—', '–', '--'];

    // INSTRUCTION GENERATION
    const inst: string[] = [];
    inst.push(`Sentences: max ${maxWords} words (aim for ${avgWords}). Max ${maxClauses} clauses.`);
    inst.push(`Paragraphs: max ${maxSentencesPara} sentences.`);
    inst.push(`Banned punctuation: ${punctuationBans.join(' ')}`);
    inst.push(`Rhythm: Approx ${questionsTarget} questions per 100 sentences.`);

    if (exclamationsLimit === 0) inst.push(`No exclamation marks.`);
    else inst.push(`Max ${exclamationsLimit} exclamations per 100 sentences.`);

    if (contraction === 'no') inst.push('No contractions.');
    else if (contraction === 'some') inst.push('Use contractions sparingly.');
    else inst.push('Contractions allowed.');

    if (emoji === 'never') inst.push('No emojis.');

    if (passiveStyle === 'avoid') inst.push('Active voice only.');
    if (numberStyle === 'avoid') inst.push('Spell out numbers.');

    if (lists === 'high') inst.push('Use lists often.');
    else if (lists === 'low') inst.push('Avoid lists; use paragraphs.');

    if (headings === 'high') inst.push('Use subheadings often.');

    if (hedging === 'none') inst.push('State facts decisively (no hedging).');
    if (evidence === 'required') inst.push('Support all claims with proof.');

    if (finalBanned.length) inst.push(`Banned words: ${finalBanned.join(', ')}`);
    if (finalPreferred.length) inst.push(`Preferred vocabulary: ${finalPreferred.join(', ')}`);

    return {
        sliders: {
            formality,
            authority
        },
        constraints: {
            min_avg_words_per_sentence: avgWords,
            max_words_per_sentence: maxWords,
            max_clauses_per_sentence: maxClauses,
            max_sentences_para: maxSentencesPara,

            questions_per_100: questionsTarget,
            exclamations_per_100: exclamationsLimit,

            punctuation_bans: punctuationBans,

            allow_contractions: contraction !== 'no',
            allow_emojis: emoji !== 'never',
            allow_numbers: numberStyle !== 'avoid',
            allow_passive: passiveStyle !== 'avoid',
            hedging,
            evidence,
            claims
        },
        structure: {
            prefer_lists: lists === 'high',
            prefer_headings: headings === 'high'
        },
        banned_lexicon: finalBanned,
        preferred_lexicon: finalPreferred,
        instructions: inst
    };
}
