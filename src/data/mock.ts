import { EmployerSchema, InstitutionSchema } from '@/types';
import institutionsData from './institutions.json';

import employersData from './employers.json';

export const mockInstitutions: InstitutionSchema[] = institutionsData as InstitutionSchema[];
export const mockEmployers: EmployerSchema[] = employersData as EmployerSchema[];


