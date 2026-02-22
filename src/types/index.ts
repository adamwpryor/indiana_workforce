export interface InstitutionSchema {
  id: string;
  name: string;
  region: string;
  topMajors: string[];
  studentDemographics: {
    totalStudents: number;
    underrepresentedMinorityPercentage?: number;
    firstGenerationPercentage?: number;
  };
  type: string; // Carnegie Classification
}

export interface EmployerSchema {
  id: string;
  name: string;
  industry: string;
  hiringNeeds: string[];
  location: string;
  requiredSkills: string[];
}

export interface MatchSchema {
  id: string;
  sourceId: string; // ID of the Institution
  targetId: string; // ID of Employer or Intermediary
  matchStrengthScore: number; // 0 to 100
  scoreBreakdown?: { category: string; score: number }[];
  aiReasoning: string;
  recommendedPathway?: string;
}

export interface NetworkGraphData {
  nodes: Array<{
    id: string;
    name: string;
    group: 'institution' | 'employer' | 'intermediary';
    val: number; // For node sizing
    subType?: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    value: number; // Match strength
  }>;
}
