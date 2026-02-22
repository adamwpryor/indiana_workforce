import { EmployerSchema, InstitutionSchema, IntermediarySchema } from '@/types';
import institutionsData from './institutions.json';

export const mockInstitutions: InstitutionSchema[] = institutionsData as InstitutionSchema[];

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
