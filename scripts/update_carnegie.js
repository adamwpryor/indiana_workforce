const fs = require('fs');
const path = require('path');
const { GoogleGenAI, Type } = require('@google/genai');

const INPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'institutions.json');

async function main() {
    const key = process.env.BLT_GEMINI_KEY;
    if (!key) {
        console.error("Security Alert: BLT_GEMINI_KEY environment variable is not set.");
        process.exit(1);
    }

    // Load current institutions
    const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
    const institutions = JSON.parse(rawData);

    // Prepare ai
    const ai = new GoogleGenAI({ apiKey: key });

    console.log(`Sending ${institutions.length} institutions to Gemini to determine their exact Carnegie Basic Classification...`);

    const prompt = `
    You are an expert higher-education classification assistant. I am providing you with a JSON array of 34 Indiana institutions.
    
    Your task is to output an EXACT copy of this JSON array. Do not change any fields except for "type".
    
    For the "type" field, you must replace the current value with the official "Carnegie Basic Classification" for that specific institution. 
    Examples of valid Carnegie Classifications include, but are not limited to:
    - "Doctoral Universities: Very High Research Activity"
    - "Master's Colleges & Universities: Larger Programs"
    - "Baccalaureate Colleges: Arts & Sciences Focus"
    - "Baccalaureate Colleges: Diverse Fields"
    - "Associate's Colleges: High Transfer-High Traditional"
    - "Special Focus Four-Year"
    
    Please be as accurate as possible for the 2021 Update (or latest known) classification.
    
    INPUT DATA:
    ${rawData}
    `;

    try {
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
                            totalStudents: { type: Type.INTEGER },
                            underrepresentedMinorityPercentage: { type: Type.INTEGER },
                            firstGenerationPercentage: { type: Type.INTEGER }
                        }
                    },
                    type: { type: Type.STRING, description: "The official Carnegie classification" }
                }
            }
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema
            }
        });

        const updatedInstitutions = JSON.parse(response.text);

        // Sanity check
        if (!Array.isArray(updatedInstitutions) || updatedInstitutions.length === 0) {
            console.error("Gemini returned invalid structure.");
            process.exit(1);
        }

        fs.writeFileSync(INPUT_FILE, JSON.stringify(updatedInstitutions, null, 4));
        console.log(`\nSuccess! Updated ${updatedInstitutions.length} institutions in ${INPUT_FILE} with Carnegie Classifications.`);

    } catch (e) {
        console.error("Error updating classifications: ", e);
    }
}

main().catch(console.error);
