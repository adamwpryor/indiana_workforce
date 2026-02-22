import { InstitutionSchema, EmployerSchema } from '@/types';

/**
 * Utility to parse the JSON output from `scripts/data_crawler.py`
 * and validate/transform it into our strict TypeScript schemas.
 */
export function ingestInstitutionData(rawJsonString: string): InstitutionSchema[] {
    try {
        const data = JSON.parse(rawJsonString);
        if (!Array.isArray(data)) return [];

        return data.map((item, index) => ({
            id: item.id || `inst-crawled-${index}`,
            name: item.name || 'Unknown Institution',
            region: item.region || 'Unknown Region',
            topMajors: Array.isArray(item.topMajors) ? item.topMajors : [],
            studentDemographics: item.studentDemographics || { totalStudents: 0 },
            type: item.type || 'Other'
        }));
    } catch (e) {
        console.error("Failed to parse institution data:", e);
        return [];
    }
}

export function ingestEmployerData(rawJsonString: string): EmployerSchema[] {
    try {
        const data = JSON.parse(rawJsonString);
        if (!Array.isArray(data)) return [];

        return data.map((item, index) => ({
            id: item.id || `emp-crawled-${index}`,
            name: item.name || 'Unknown Employer',
            industry: item.industry || 'Unknown Industry',
            hiringNeeds: Array.isArray(item.hiringNeeds) ? item.hiringNeeds : [],
            location: item.location || 'Unknown Location',
            requiredSkills: Array.isArray(item.requiredSkills) ? item.requiredSkills : []
        }));
    } catch (e) {
        console.error("Failed to parse employer data:", e);
        return [];
    }
}
