export const INSTITUTION_COLORS: Record<string, string> = {
    'R1: Doctoral Universities - Very High Research Activity': '#1D4ED8', // blue-700
    'R2: Doctoral Universities - High Research Activity': '#2563EB', // blue-600
    'Master\'s Colleges & Universities': '#3B82F6', // blue-500
    'Baccalaureate Colleges': '#60A5FA', // blue-400
    'Associates Colleges': '#93C5FD', // blue-300
    DEFAULT: '#BFDBFE', // blue-200
};

export const SECTOR_PALETTE = [
    '#10B981', // emerald-500
    '#8B5CF6', // violet-500
    '#F59E0B', // amber-500
    '#F43F5E', // rose-500
    '#06B6D4', // cyan-500
    '#D946EF', // fuchsia-500
    '#84CC16', // lime-500
    '#F97316', // orange-500
    '#EC4899', // pink-500
    '#14B8A6', // teal-500
    '#6366F1', // indigo-500
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
