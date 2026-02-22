export const INSTITUTION_COLORS: Record<string, string> = {
    'R1: Doctoral Universities - Very High Research Activity': '#87CEEB', // Sky Blue
    'R2: Doctoral Universities - High Research Activity': '#87CEEB',
    'Master\'s Colleges & Universities': '#87CEEB',
    'Baccalaureate Colleges': '#87CEEB',
    'Associates Colleges': '#87CEEB',
    DEFAULT: '#87CEEB', // All institutions are Sky Blue
};

export const SECTOR_PALETTE = [
    '#10B981', // emerald-500
    '#8B5CF6', // violet-500
    '#F59E0B', // amber-500
    '#F43F5E', // rose-500
    '#D946EF', // fuchsia-500
    '#84CC16', // lime-500
    '#F97316', // orange-500
    '#EC4899', // pink-500
    '#EAB308', // yellow-500
];

export function getSectorColorMapping(sectors: string[]): Record<string, string> {
    const mapping: Record<string, string> = {};
    sectors.forEach((sector, i) => {
        mapping[sector] = SECTOR_PALETTE[i % SECTOR_PALETTE.length];
    });
    return mapping;
}

// Parses potentially combined industries into an array to support multi-sector filtering and coloring fallback
export function parseIndustries(industryString: string): string[] {
    if (!industryString) return ['Unknown'];
    // Split on commas, "&", "and", etc. if multiple exist, though dataset mostly has singular or "A & B".
    // Actually, splitting on " & " or " and " might break "Logistics & Transportation" into two.
    // Given the prompt: "If an entity is in more than one sector give it the color of the predominant sector..."
    // We will treat combinations like "Logistics & Supply Chain" as one sector, but if there's a comma we split.
    if (industryString.includes(',')) {
        return industryString.split(',').map(s => s.trim());
    }
    return [industryString.trim()];
}
