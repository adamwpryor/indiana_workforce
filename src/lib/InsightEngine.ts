import { InstitutionSchema, EmployerSchema, MatchSchema } from '@/types';

/**
 * Simulates an AI-driven matching algorithm that connects Institutions
 * with Employers based on skills, majors, and hiring needs, demonstrating "AI Discernment."
 */
export function generateMatches(
    institutions: InstitutionSchema[],
    employers: EmployerSchema[]
): MatchSchema[] {
    const matches: MatchSchema[] = [];
    const MIN_CONNECTIONS_PER_INSTITUTION = 3;

    for (const inst of institutions) {
        const potentialMatches: MatchSchema[] = [];

        for (const emp of employers) {
            // Normalize text for basic keyword matching
            const instKeywords = inst.topMajors.map((m) => m.toLowerCase());
            const empKeywords = [...emp.hiringNeeds, ...emp.requiredSkills].map((k) => k.toLowerCase());

            // Detect skill overlap
            const overlap = instKeywords.filter((k) =>
                empKeywords.some((ek) => ek.includes(k) || k.includes(ek))
            );

            const baseScore = 40; // Lower base score to require actual alignment or IPEDS boost
            const keywordBonus = Math.min(30, overlap.length * 10);
            let ipedsBonus = 0;

            const scoreBreakdown = [
                { category: 'Baseline Regional Alignment', score: baseScore }
            ];

            if (overlap.length > 0) {
                scoreBreakdown.push({ category: `Skill/Major Overlap (${overlap.length} matched)`, score: keywordBonus });
            }

            // IPEDS Data Integration
            if (inst.ipedsMetrics) {
                // High graduation rate signals reliable talent pipeline
                if (inst.ipedsMetrics.sixYearGraduationRate > 60) {
                    const gradBonus = Math.min(10, (inst.ipedsMetrics.sixYearGraduationRate - 60) / 3);
                    ipedsBonus += gradBonus;
                    scoreBreakdown.push({ category: 'High Graduation Rate (Pipeline Reliability)', score: Math.round(gradBonus) });
                }

                // STEM focus aligns heavily with certain industries
                const isTechOrMfg = emp.industry.toLowerCase().includes('tech') || emp.industry.toLowerCase().includes('manufacturing') || emp.industry.toLowerCase().includes('engineering');
                if (isTechOrMfg && inst.ipedsMetrics.stemDegreePercentage > 20) {
                    const stemBonus = Math.min(15, (inst.ipedsMetrics.stemDegreePercentage - 20) / 2);
                    ipedsBonus += stemBonus;
                    scoreBreakdown.push({ category: 'Strong STEM Alignment', score: Math.round(stemBonus) });
                }

                // High endowment implies resources for specialized partnerships
                if (inst.ipedsMetrics.institutionalEndowmentMillion > 500) {
                    ipedsBonus += 5;
                    scoreBreakdown.push({ category: 'Significant Institutional Resources', score: 5 });
                }
            }

            // Add a slight randomization (0-5) to prevent identical scores and clustering
            const variance = Math.floor(Math.random() * 6);

            const totalScore = Math.min(99, Math.round(baseScore + keywordBonus + ipedsBonus + variance));

            // Generate nuanced AI Reasoning
            let aiReasoning = `The Insight Engine evaluation indicates a strategic partnership opportunity between ${inst.name} and ${emp.name}. `;

            if (overlap.length > 0) {
                aiReasoning += `There is direct alignment between the institution's output in ${overlap.map(v => v.toUpperCase()).join(', ')} and the employer's immediate workforce demands. `;
            } else {
                aiReasoning += `While direct program overlap is lower, geographic proximity and general workforce readiness present a viable foundation for a relationship. `;
            }

            if (inst.ipedsMetrics) {
                if (inst.ipedsMetrics.sixYearGraduationRate > 65) {
                    aiReasoning += `Furthermore, the institution's strong ${inst.ipedsMetrics.sixYearGraduationRate.toFixed(1)}% graduation rate offers a highly reliable and consistent talent pipeline. `;
                }
                if (inst.ipedsMetrics.stemDegreePercentage > 25 && (emp.industry.includes('Technology') || emp.industry.includes('Engineering'))) {
                    aiReasoning += `The exceptional STEM focus (${inst.ipedsMetrics.stemDegreePercentage.toFixed(1)}% of degrees) makes this an ideal match for ${emp.industry} sector requirements. `;
                }
            }

            // Generate varied recommended pathways
            let pathway = 'Direct Hiring Pipeline & Career Fairs';
            if (totalScore < 60) {
                pathway = 'Exploratory Discussions & Internship Pilot';
            } else if (totalScore < 75) {
                pathway = 'Develop Joint Upskilling Curriculum';
            } else if (overlap.includes('data') || overlap.includes('technology') || overlap.includes('engineering')) {
                pathway = 'Establish Specialized Technical Apprenticeship';
            }

            potentialMatches.push({
                id: `match-${inst.id}-${emp.id}`,
                sourceId: inst.id,
                targetId: emp.id,
                matchStrengthScore: totalScore,
                scoreBreakdown,
                aiReasoning: aiReasoning.trim(),
                recommendedPathway: pathway,
            });
        }

        // Sort potential matches by score descending
        potentialMatches.sort((a, b) => b.matchStrengthScore - a.matchStrengthScore);

        // Filter for "natural" matches meeting a threshold
        let acceptedMatches = potentialMatches.filter(m => m.matchStrengthScore >= 68);

        // GUARANTEE BASELINE CONNECTIONS:
        // If the institution has too few natural connections, explicitly pull in the top N to prevent isolated nodes
        if (acceptedMatches.length < MIN_CONNECTIONS_PER_INSTITUTION) {
            acceptedMatches = potentialMatches.slice(0, MIN_CONNECTIONS_PER_INSTITUTION);

            // Retroactively update reasoning for "forced" matches to explain the AI's "stretch" logic
            acceptedMatches.forEach(m => {
                if (m.matchStrengthScore < 68) {
                    m.aiReasoning = `While not a statistically dominant match (Score: ${m.matchStrengthScore}), the Insight Engine identifies ${employers.find(e => e.id === m.targetId)?.name} as the most viable strategic partner for ${inst.name} to cultivate regional economic integration.`;
                    m.scoreBreakdown?.push({ category: 'Algorithmic Fallback Allocation', score: 0 });
                }
            });
        }

        // Add to global match array
        matches.push(...acceptedMatches);
    }

    return matches;
}
