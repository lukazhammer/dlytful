export function validateAndFill(str: string, missingLabel: string, maxWords?: number): string {
    if (!str || str.trim().length === 0) {
        return `Missing: ${missingLabel}. Answer the discovery questions.`;
    }

    let cleaned = str.trim();
    if (maxWords) {
        cleaned = cleaned.split(/\s+/).slice(0, maxWords).join(" ");
    }
    return cleaned;
}

export function validateList(list: string[], requiredCount: number, defaultItem: string): string[] {
    const valid = list.filter(s => s && s.trim().length > 0);
    while (valid.length < requiredCount) {
        valid.push(defaultItem);
    }
    return valid.slice(0, requiredCount);
}

// Ensure unique sentences
export function uniqueSentences(text: string): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const unique = [...new Set(sentences.map(s => s.trim()))];
    return unique.join(" ");
}
