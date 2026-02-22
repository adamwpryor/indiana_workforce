import { EmployerSchema, InstitutionSchema, IntermediarySchema } from '@/types';
import institutionsData from './institutions.json';

import employersData from './employers.json';

export const mockInstitutions: InstitutionSchema[] = institutionsData as InstitutionSchema[];
export const mockEmployers: EmployerSchema[] = employersData as EmployerSchema[];

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
