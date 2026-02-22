import { EmployerSchema, InstitutionSchema, IntermediarySchema } from '@/types';

export const mockInstitutions: InstitutionSchema[] = [
    {
        id: 'inst-1',
        name: 'Purdue University',
        region: 'West Lafayette',
        topMajors: ['Engineering', 'Computer Science', 'Agriculture'],
        studentDemographics: { totalStudents: 50000, firstGenerationPercentage: 20 },
        type: 'R1'
    },
    {
        id: 'inst-2',
        name: 'Ivy Tech Community College',
        region: 'Statewide',
        topMajors: ['Nursing', 'Advanced Manufacturing', 'IT Support'],
        studentDemographics: { totalStudents: 100000, firstGenerationPercentage: 45 },
        type: 'Community College'
    },
    {
        id: 'inst-3',
        name: 'Rose-Hulman Institute of Technology',
        region: 'Terre Haute',
        topMajors: ['Software Engineering', 'Mechanical Engineering', 'Physics'],
        studentDemographics: { totalStudents: 2200 },
        type: 'Other'
    }
];

export const mockEmployers: EmployerSchema[] = [
    {
        id: 'emp-1',
        name: 'Eli Lilly and Company',
        industry: 'Pharmaceuticals',
        hiringNeeds: ['Chemical Engineering', 'Data Science', 'Clinical Research'],
        location: 'Indianapolis',
        requiredSkills: ['python', 'chemistry', 'machine learning']
    },
    {
        id: 'emp-2',
        name: 'Cummins Inc.',
        industry: 'Manufacturing',
        hiringNeeds: ['Mechanical Engineering', 'Advanced Manufacturing', 'Supply Chain'],
        location: 'Columbus',
        requiredSkills: ['cad', 'logistics', 'engineering']
    },
    {
        id: 'emp-3',
        name: 'Salesforce',
        industry: 'Technology',
        hiringNeeds: ['Software Engineering', 'Computer Science', 'Cloud Computing'],
        location: 'Indianapolis',
        requiredSkills: ['react', 'aws', 'software engineering']
    }
];

export const mockIntermediaries: IntermediarySchema[] = [
    {
        id: 'int-1',
        name: 'Ascend Indiana',
        focusArea: 'Workforce Development',
        availablePrograms: ['Ascend Network Pathway', 'Manufacturing Apprenticeship']
    },
    {
        id: 'int-2',
        name: 'TechPoint',
        focusArea: 'Technology Ecosystem',
        availablePrograms: ['Xtern Program', 'Tech Skills Bootcamp']
    }
];
