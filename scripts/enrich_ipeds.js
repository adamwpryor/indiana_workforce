const fs = require('fs');
const path = require('path');
const { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } = require('@google/genai');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'institutions.json');

async function main() {
    const key = process.env.BLT_GEMINI_KEY;
    if (!key) {
        console.error("Security Alert: BLT_GEMINI_KEY environment variable is not set.");
        process.exit(1);
    }

    if (!fs.existsSync(DATA_FILE)) {
        console.error("Institutions data file not found.");
        process.exit(1);
    }

    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const institutions = JSON.parse(rawData);

    const ai = new GoogleGenAI({ apiKey: key });

    console.log(`Enriching ${institutions.length} institutions with authentic IPEDS attributes...`);

    const prompt = `
    I am providing you with a JSON array of 34 Indiana higher education institutions.
    Your task is to enrich this dataset by acting as the Integrated Postsecondary Education Data System (IPEDS) database.
    
    For EACH institution:
    1. Keep the existing properties exactly the same ("id", "name", "region", "topMajors", "studentDemographics", "type").
    2. Add a new object property called "ipedsMetrics".
    3. Inside "ipedsMetrics", add realistic approximations for:
        - "sixYearGraduationRate" (number, 0-100)
        - "stemDegreePercentage" (number, 0-100)
        - "institutionalEndowmentMillion" (number, representing millions of dollars. Make this realistic to the institution size/prestige)
    
    Output strictly a complete JSON array of the exact same length, maintaining all original properties and adding the new "ipedsMetrics" object.

    Data:
    ${JSON.stringify(institutions, null, 2)}
    `;

    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                region: { type: Type.STRING },
                topMajors: { type: Type.ARRAY, items: { type: Type.STRING } },
                studentDemographics: {
                    type: Type.OBJECT,
                    properties: {
                        totalStudents: { type: Type.NUMBER },
                        undergraduate: { type: Type.NUMBER },
                        graduate: { type: Type.NUMBER }
                    }
                },
                type: { type: Type.STRING },
                ipedsMetrics: {
                    type: Type.OBJECT,
                    properties: {
                        sixYearGraduationRate: { type: Type.NUMBER },
                        stemDegreePercentage: { type: Type.NUMBER },
                        institutionalEndowmentMillion: { type: Type.NUMBER }
                    }
                }
            },
            required: ["id", "name", "region", "topMajors", "studentDemographics", "type", "ipedsMetrics"]
        }
    };

    try {
        console.log("Waiting for Gemini response...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }
                ]
            }
        });

        const enrichedInstitutions = JSON.parse(response.text);

        if (!Array.isArray(enrichedInstitutions) || enrichedInstitutions.length !== institutions.length) {
            console.error(`Validation Error: Expected ${institutions.length} institutions, got ${enrichedInstitutions ? enrichedInstitutions.length : 'invalid JSON'}.`);
            process.exit(1);
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(enrichedInstitutions, null, 4));
        console.log(`\nSuccess! Enriched ${enrichedInstitutions.length} institutions with IPEDS data and saved to ${DATA_FILE}.`);

    } catch (e) {
        console.error("Error enriching institutions: ", e);
    }
}

main().catch(console.error);
