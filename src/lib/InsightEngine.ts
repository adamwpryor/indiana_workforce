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
    const MIN_CONNECTIONS_PER_INSTITUTION = 8;

    const liberalArtsKeywords = ['english', 'history', 'philosophy', 'sociology', 'psychology', 'political', 'anthropology', 'communications', 'liberal arts', 'humanities', 'theology', 'fine arts', 'music', 'literature', 'design'];

    const getPathway = (score: number, overlap: string[], isStem: boolean, isLiberalArts: boolean, industry: string) => {
        const highIntensity = [
            "Direct Hiring Pipeline Formulation: Immediate integration via dedicated campus recruiting and fast-track interviews.",
            "Establish Specialized Cooperative Education: Multi-semester co-op blocks embedding students in core business units.",
            "Joint Innovation Lab Co-development: Shared regional R&D space where students and employees tackle emerging industry problems.",
            "Executive Leadership Fellows Program: Fast-tracking top graduates directly into management via rigorous mentorship."
        ];
        const techApprenticeship = [
            "Specialized Technical Apprenticeship: Earn-and-learn models specifically designed for emerging tech and data stacks.",
            "AI & Systems Integration Co-op: Focused pipeline for deploying advanced algorithmic systems and digital infrastructure.",
            "Data Architecture Fellowship: A specialized track converting capstone projects directly into enterprise data models."
        ];
        const liberalArtsFocus = [
            "Human-in-the-Loop Operations Residency: Utilizing critical thinking and ethics to manage complex automated or scaled systems.",
            "Corporate Communications & Policy Externship: Applying humanities frameworks to external relations and internal corporate strategy.",
            "Ethical AI Frameworks Fellowship: Bridging philosophy and sociology with product development to ensure responsible scaling.",
            "Cross-Disciplinary Capstone Integration: Bringing diverse analytical perspectives to solve multifaceted corporate challenges."
        ];
        const moderateDevelopment = [
            "Develop Joint Upskilling Curriculum: Employer and faculty collaborate to align degree tracks with immediate workforce tools.",
            "Remote Digital Transformation Internship: Scalable, off-site project work modernizing legacy systems and processes.",
            "Industry-Sponsored Capstone Sprints: Semester-long projects where students solve specific, low-risk corporate problems.",
            "Micro-Credential & Certificate Boot-camp: Short, intense skill sprints bridging the gap between general degrees and specific roles."
        ];
        const exploratory = [
            "Strategic Exploratory Partnership: Initial cross-pollination to discover hidden alignments between academic theory and practice.",
            "Regional Economic Integration Taskforce: Joint committee to map out long-term mutual investments in the local workforce ecosystem.",
            "Campus-to-Corporate Shadowing Pilot: Short-term observation periods to help faculty and students understand emerging industry contexts.",
            "Non-Traditional Talent Pathway Design: Reimagining hiring criteria to value cognitive flexibility over direct technical translation."
        ];

        if (score >= 70) {
            if (isStem && (industry.includes('Tech') || industry.includes('Engineering') || industry.includes('Manufacturing'))) return techApprenticeship[Math.floor(Math.random() * techApprenticeship.length)];
            return highIntensity[Math.floor(Math.random() * highIntensity.length)];
        } else if (score >= 50) {
            if (isLiberalArts && !isStem) return liberalArtsFocus[Math.floor(Math.random() * liberalArtsFocus.length)];
            return moderateDevelopment[Math.floor(Math.random() * moderateDevelopment.length)];
        } else {
            return exploratory[Math.floor(Math.random() * exploratory.length)];
        }
    };

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

            const baseScore = 30; // Lowered baseline to compensate for remote/digital trends and broader geography
            const keywordBonus = Math.min(45, overlap.length * 15); // Powerful weight for exact keyword alignment
            let ipedsBonus = 0;
            let liberalArtsBonus = 0;
            let scaleBonus = 0;

            const scoreBreakdown = [
                { category: 'Baseline Regional Alignment', score: baseScore }
            ];

            if (overlap.length > 0) {
                scoreBreakdown.push({ category: `Skill/Major Overlap (${overlap.length} matched)`, score: keywordBonus });
            }

            const hasLiberalArts = instKeywords.some(m => liberalArtsKeywords.some(kw => m.includes(kw))) || inst.type.toLowerCase().includes('baccalaureate');
            let isStemHeavy = false;

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
                if (inst.ipedsMetrics.stemDegreePercentage > 15) {
                    isStemHeavy = true;
                    if (isTechOrMfg) {
                        const stemBonus = Math.min(10, (inst.ipedsMetrics.stemDegreePercentage - 15) / 2);
                        ipedsBonus += stemBonus;
                        scoreBreakdown.push({ category: 'STEM Alignment Focus', score: Math.round(stemBonus) });
                        ipedsNarrative += `With a strong ${inst.ipedsMetrics.stemDegreePercentage.toFixed(1)}% concentration in STEM degrees, the institution is uniquely positioned to fulfill ${emp.name}'s technical demands. `;
                    }
                }

                if (inst.ipedsMetrics.institutionalEndowmentMillion > 200) {
                    ipedsBonus += 4;
                    scoreBreakdown.push({ category: 'Institutional Resources', score: 4 });
                    ipedsNarrative += `Supported by substantial endowment resources, joint innovation labs or specialized training centers could be co-developed. `;
                }
            }

            // Enterprise Scale & Research Pipeline (R1 / Massive Enrollment)
            let scaleNarrative = '';
            const isR1 = inst.type.toLowerCase().includes('very high research');

            if (isR1) {
                scaleBonus += 12;
                scoreBreakdown.push({ category: 'Phase 5 Ecosystem Integration (R1 Scale)', score: 12 });
                scaleNarrative += `As an R1 research institution, ${inst.name} operates at the enterprise scale necessary to achieve Phase 5 Ecosystem Integration, partnering on cutting-edge ${emp.industry} innovation. `;
            }

            if ((inst.studentDemographics.totalStudents || 0) > 25000) {
                scaleBonus += 8;
                scoreBreakdown.push({ category: 'High-Volume Workflow Pipeline', score: 8 });
                scaleNarrative += `The massive student body ensures a reliable, high-volume flow of entry-level talent for scaled Phase 3 operations. `;
            } else if ((inst.studentDemographics.totalStudents || 0) > 10000) {
                scaleBonus += 4;
                scoreBreakdown.push({ category: 'Moderate-Volume Workflow Pipeline', score: 4 });
            }

            // Liberal Arts Counterweight Bonus
            let liberalArtsNarrative = '';
            if (hasLiberalArts) {
                const employerValuesHumanities = empKeywords.some(s => s.includes('communication') || s.includes('writing') || s.includes('critical thinking') || s.includes('analysis') || s.includes('management') || s.includes('design') || s.includes('strategy'));
                if (employerValuesHumanities) {
                    liberalArtsBonus = 15;
                    scoreBreakdown.push({ category: 'Connective Labor & Evaluative Judgement', score: 15 });
                    liberalArtsNarrative = `The institution's robust liberal arts framework protects against the 'Connective Labor Deficit,' providing the crucial evaluative judgement and communication skills explicitly required for ${emp.name}'s strategic roles. `;
                } else {
                    liberalArtsBonus = 7;
                    scoreBreakdown.push({ category: 'Systemic Workflow Design & Metacognition', score: 7 });
                    liberalArtsNarrative = `Furthermore, the institution's liberal arts core ensures cognitive flexibility and tolerance for ambiguity—essential traits for navigating complex AI workflows and avoiding the 'Productivity Tax' in modern ${emp.industry} environments. `;
                }
            }

            const variance = Math.floor(Math.random() * 4);
            const totalScore = Math.min(99, Math.round(baseScore + keywordBonus + ipedsBonus + scaleBonus + liberalArtsBonus + variance));

            // Generate Bespoke, Creative AI Reasoning connecting O*NET to IPEDS and Curriculum
            const topSkills = emp.requiredSkills.slice(0, 3).join(', ');
            let aiReasoning = `Strategic Partnership Analysis: ${inst.name} & ${emp.name}.\n`;

            if (overlap.length > 0) {
                aiReasoning += `This connection is driven by direct alignment between the university's academic output in [${overlap.join(', ').toUpperCase()}] and the employer's need for O*NET-validated skills such as ${topSkills}. `;
                aiReasoning += ipedsNarrative;
                aiReasoning += scaleNarrative;
                aiReasoning += liberalArtsNarrative;
                aiReasoning += `Creatively, this partnership could evolve into a specialized cooperative education program where students apply these exact foundational elements in real-world ${emp.industry} environments before graduation.`;
            } else {
                aiReasoning += `While direct program overlap is not immediately obvious, the critical workforce need for O*NET skills like ${topSkills} presents an opportunity for cross-disciplinary training. `;
                aiReasoning += ipedsNarrative;
                aiReasoning += scaleNarrative;
                aiReasoning += liberalArtsNarrative;
                aiReasoning += `A creative approach would involve ${inst.name} developing a micro-credential or boot-camp tailored specifically to upskill the local workforce for ${emp.name}'s emerging roles in ${emp.industry}.`;
            }

            potentialMatches.push({
                id: `match-${inst.id}-${emp.id}`,
                sourceId: inst.id,
                targetId: emp.id,
                matchStrengthScore: totalScore,
                scoreBreakdown,
                aiReasoning: aiReasoning.trim(),
                recommendedPathway: getPathway(totalScore, overlap, isStemHeavy, hasLiberalArts, emp.industry),
            });
        }

        // Sort potential matches by score descending
        potentialMatches.sort((a, b) => b.matchStrengthScore - a.matchStrengthScore);

        // Filter for "natural" matches meeting a threshold based on institution size/output
        const isMassiveNode = inst.type.toLowerCase().includes('very high research') || (inst.studentDemographics.totalStudents || 0) > 25000;
        const dynamicThreshold = isMassiveNode ? 75 : 60;

        let acceptedMatches = potentialMatches.filter(m => m.matchStrengthScore >= dynamicThreshold);

        // GUARANTEE BASELINE CONNECTIONS:
        if (acceptedMatches.length < MIN_CONNECTIONS_PER_INSTITUTION) {
            acceptedMatches = potentialMatches.slice(0, MIN_CONNECTIONS_PER_INSTITUTION);

            // Adjust reasoning for stretch assignments without artificially inflating the actual score integer
            acceptedMatches.forEach(m => {
                if (m.matchStrengthScore < 65) {
                    m.aiReasoning = `Strategic Exploratory Focus: Although traditional academic alignment might be developing, the Insight Engine identifies ${employers.find(e => e.id === m.targetId)?.name} as a vital regional partner for ${inst.name}. By bridging the employer's need for skills like ${employers.find(e => e.id === m.targetId)?.requiredSkills.slice(0, 2).join(' and ')} with the institution's distinct student demographic, a high-impact, non-traditional workforce pipeline can be forged.`;
                }
            });
        }

        matches.push(...acceptedMatches);
    }

    return matches;
}
