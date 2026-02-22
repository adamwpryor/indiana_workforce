import { EmployerSchema, InstitutionSchema } from '@/types';
import institutionsData from './institutions.json';

import employersData from './employers.json';

export const mockInstitutions: InstitutionSchema[] = institutionsData as InstitutionSchema[];

const rawEmployers = employersData as EmployerSchema[];
export const mockEmployers: EmployerSchema[] = rawEmployers.filter(emp => {
    const nameLower = emp.name.toLowerCase();
    const industryLower = emp.industry.toLowerCase();
    const isEducation = industryLower.includes('education');
    const isUniversity = nameLower.includes('university') || nameLower.includes('college') || nameLower.includes('institute');
    return !isEducation && !isUniversity;
});


