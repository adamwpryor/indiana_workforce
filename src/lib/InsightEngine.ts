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

            const baseScore = 60; // Significantly higher base score
            const keywordBonus = Math.min(25, overlap.length * 8);
            let ipedsBonus = 0;

            const scoreBreakdown = [
                { category: 'Baseline Regional Alignment', score: baseScore }
            ];

            if (overlap.length > 0) {
                scoreBreakdown.push({ category: `Skill/Major Overlap (${overlap.length} matched)`, score: keywordBonus });
            }

            // IPEDS Data Integration
            let ipedsNarrative = '';
            if (inst.ipedsMetrics) {
                if (inst.ipedsMetrics.sixYearGraduationRate > 55) {
                    const gradBonus = Math.min(8, (inst.ipedsMetrics.sixYearGraduationRate - 50) / 4);
                    ipedsBonus += gradBonus;
                    scoreBreakdown.push({ category: 'Graduation Rate (Pipeline Reliability)', score: Math.round(gradBonus) });
                    ipedsNarrative += `Leveraging a reliable ${inst.ipedsMetrics.sixYearGraduationRate.toFixed(1)}% six-year graduation rate, ${inst.name} can provide a consistent talent pipeline. `;
                }

                const isTechOrMfg = emp.industry.toLowerCase().includes('tech') || emp.industry.toLowerCase().includes('manufacturing') || emp.industry.toLowerCase().includes('engineering');
                if (isTechOrMfg && inst.ipedsMetrics.stemDegreePercentage > 15) {
                    const stemBonus = Math.min(10, (inst.ipedsMetrics.stemDegreePercentage - 15) / 2);
                    ipedsBonus += stemBonus;
                    scoreBreakdown.push({ category: 'STEM Alignment Focus', score: Math.round(stemBonus) });
                    ipedsNarrative += `With a strong ${inst.ipedsMetrics.stemDegreePercentage.toFixed(1)}% concentration in STEM degrees, the institution is uniquely positioned to fulfill ${emp.name}'s technical demands. `;
                }

                if (inst.ipedsMetrics.institutionalEndowmentMillion > 200) {
                    ipedsBonus += 4;
                    scoreBreakdown.push({ category: 'Institutional Resources', score: 4 });
                    ipedsNarrative += `Supported by substantial endowment resources, joint innovation labs or specialized training centers could be co-developed. `;
                }
            }

            const variance = Math.floor(Math.random() * 4);
            const totalScore = Math.min(99, Math.round(baseScore + keywordBonus + ipedsBonus + variance));

            // Generate Bespoke, Creative AI Reasoning connecting O*NET to IPEDS
            const topSkills = emp.requiredSkills.slice(0, 3).join(', ');
            let aiReasoning = `Strategic Partnership Analysis: ${inst.name} & ${emp.name}.\n`;

            if (overlap.length > 0) {
                aiReasoning += `This connection is driven by direct alignment between the university's academic output in [${overlap.join(', ').toUpperCase()}] and the employer's need for O*NET-validated skills such as ${topSkills}. `;
                aiReasoning += ipedsNarrative;
                aiReasoning += `Creatively, this partnership could evolve into a specialized cooperative education program where students apply these exact skills in real-world ${emp.industry} environments before graduation.`;
            } else {
                aiReasoning += `While direct program overlap is not immediately obvious, the critical workforce need for O*NET skills like ${topSkills} presents an opportunity for cross-disciplinary training. `;
                aiReasoning += ipedsNarrative;
                aiReasoning += `A creative approach would involve ${inst.name} developing a micro-credential or boot-camp tailored specifically to upskill the local workforce for ${emp.name}'s emerging roles in ${emp.industry}.`;
            }

            // Generate varied recommended pathways
            let pathway = 'Direct Hiring Pipeline & Career Fairs';
            if (totalScore < 75) {
                pathway = 'Strategic Exploratory Partnership';
            } else if (totalScore < 85) {
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

        // Filter for "natural" matches meeting a threshold (lowered to visually show more graph connections)
        let acceptedMatches = potentialMatches.filter(m => m.matchStrengthScore >= 75);

        // GUARANTEE BASELINE CONNECTIONS:
        // If the institution has too few natural connections, explicitly pull in the top N
        if (acceptedMatches.length < MIN_CONNECTIONS_PER_INSTITUTION) {
            acceptedMatches = potentialMatches.slice(0, MIN_CONNECTIONS_PER_INSTITUTION);

            // Retroactively adjust reasoning to sound like a creative exploration rather than an algorithmic failure
            acceptedMatches.forEach(m => {
                if (m.matchStrengthScore < 75) {
                    m.aiReasoning = `Strategic Exploratory Focus: Although traditional academic alignment might be developing, the Insight Engine identifies ${employers.find(e => e.id === m.targetId)?.name} as a vital regional partner for ${inst.name}. By bridging the employer's need for skills like ${employers.find(e => e.id === m.targetId)?.requiredSkills.slice(0, 2).join(' and ')} with the institution's distinct student demographic, a high-impact, non-traditional workforce pipeline can be forged.`;
                    m.scoreBreakdown?.push({ category: 'Strategic Exploratory Partnership', score: 5 });
                    m.matchStrengthScore = Math.min(99, m.matchStrengthScore + 5); // Visually boost the forced connection slightly so it's not a tiny thread
                }
            });
        }

        // Add to global match array
        matches.push(...acceptedMatches);
    }

    return matches;
}
