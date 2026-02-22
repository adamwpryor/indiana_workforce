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
                const score = Math.min(98, 65 + overlap.length * 15);

                // Find a relevant intermediary if one exists
                const bestIntermediary = intermediaries.find((int) =>
                    int.availablePrograms.some((prog) =>
                        overlap.some((ov) => prog.toLowerCase().includes(ov))
                    )
                );

                const aiReasoning = `The Insight Engine detected strong alignment between ${inst.name}'s robust talent pool in ${overlap.map(v => v.toUpperCase()).join(', ')} and ${emp.name}'s critical hiring needs. The geographical proximity and shared strategic focus make this a high-yield opportunity.`;

                matches.push({
                    id: `match-${inst.id}-${emp.id}`,
                    sourceId: inst.id,
                    targetId: emp.id,
                    matchStrengthScore: score,
                    aiReasoning: aiReasoning,
                    recommendedPathway: bestIntermediary ? `Leverage ${bestIntermediary.name} programs` : 'Direct Hiring Pipeline',
                });
            }
        }
    }

    return matches;
}
