import { InstitutionSchema, EmployerSchema, IntermediarySchema, MatchSchema } from '@/types';

/**
 * Simulates an AI-driven matching algorithm that connects Institutions
 * with Employers based on skills, majors, and hiring needs, demonstrating "AI Discernment."
 */
export function generateMatches(
    institutions: InstitutionSchema[],
    employers: EmployerSchema[],
    intermediaries: IntermediarySchema[]
): MatchSchema[] {
    const matches: MatchSchema[] = [];

    for (const inst of institutions) {
        for (const emp of employers) {
            // Normalize text for basic keyword matching
            const instKeywords = inst.topMajors.map((m) => m.toLowerCase());
            const empKeywords = [...emp.hiringNeeds, ...emp.requiredSkills].map((k) => k.toLowerCase());

            // Detect skill overlap
            const overlap = instKeywords.filter((k) =>
                empKeywords.some((ek) => ek.includes(k) || k.includes(ek))
            );

            // If there is any overlap, generate a match
            if (overlap.length > 0) {
                // Base score plus bonus for more overlap
                const baseScore = 65;
                const keywordBonus = Math.min(30, overlap.length * 15);
                const score = Math.min(98, baseScore + keywordBonus);

                const scoreBreakdown = [
                    { category: 'Baseline Regional Alignment', score: baseScore },
                    { category: `Keyword Overlap (${overlap.length} matched)`, score: keywordBonus }
                ];

                // Find a relevant intermediary if one exists
                const bestIntermediary = intermediaries.find((int) =>
                    int.availablePrograms.some((prog) =>
                        overlap.some((ov) => prog.toLowerCase().includes(ov))
                    )
                );

                const aiReasoning = `The Insight Engine detected strong alignment between ${inst.name}'s robust talent pool in ${overlap.map(v => v.toUpperCase()).join(', ')} and ${emp.name}'s critical hiring needs. The geographical proximity and shared strategic focus make this a high-yield opportunity.`;

                // Generate varied recommended pathways
                let pathway = 'Direct Hiring Pipeline';
                if (bestIntermediary) {
                    pathway = `Leverage ${bestIntermediary.name} programs`;
                    scoreBreakdown.push({ category: 'Intermediary Bridge Available', score: 3 });
                } else if (score < 80) {
                    pathway = 'Develop Joint Upskilling Curriculum';
                } else if (overlap.includes('data') || overlap.includes('technology')) {
                    pathway = 'Establish Specialized Tech Apprenticeship';
                }

                matches.push({
                    id: `match-${inst.id}-${emp.id}`,
                    sourceId: inst.id,
                    targetId: emp.id,
                    matchStrengthScore: score + (bestIntermediary ? 3 : 0),
                    scoreBreakdown,
                    aiReasoning: aiReasoning,
                    recommendedPathway: pathway,
                });
            }
        }
    }

    return matches;
}
