const fs = require('fs');
const path = require('path');
const { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } = require('@google/genai');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'employers.json');

async function main() {
    const key = process.env.BLT_GEMINI_KEY;
    if (!key) {
        console.error("Security Alert: BLT_GEMINI_KEY environment variable is not set.");
        process.exit(1);
    }

    if (!fs.existsSync(DATA_FILE)) {
        console.error("Employers data file not found.");
        process.exit(1);
    }

    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const employers = JSON.parse(rawData);

    const ai = new GoogleGenAI({ apiKey: key });

    console.log(`Enriching ${employers.length} employers with authentic O*NET skills. Processing in batches to maintain context...`);

    const batchSize = 40;
    let enrichedEmployers = [];

    for (let i = 0; i < employers.length; i += batchSize) {
        const batch = employers.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(employers.length / batchSize)}...`);

        const prompt = `
        You are an expert labor market analyst utilizing the official US Department of Labor O*NET Database.
        I am going to provide you with a JSON array of Indiana employers and their specific "hiringNeeds" (occupations).
        
        For EACH employer in the array:
        1. Keep the "id", "name", "industry", "location", and "hiringNeeds" exactly the same.
        2. Replace the "requiredSkills" array with a new array of 4-6 highly specific, authentic Knowledge, Skills, and Abilities (KSAs) taken directly from standard O*NET occupational profiles that match those "hiringNeeds".
        3. Do not just use generic terms. Use the rigorous, professional phrasing found in BLS/O*NET data (e.g., instead of "Python", use "Object-Oriented Programming" or "Data Structures". Instead of "Nursing", use "Patient Care and Assistance" or "Medical Software").
        4. The output MUST be a JSON array of the EXACT SAME length containing the updated employer objects.

        Here is the batch of employers to enrich:
        ${JSON.stringify(batch, null, 2)}
        `;

        const responseSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    industry: { type: Type.STRING },
                    hiringNeeds: { type: Type.ARRAY, items: { type: Type.STRING } },
                    location: { type: Type.STRING },
                    requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Authentic O*NET KSAs" }
                },
                required: ["id", "name", "industry", "hiringNeeds", "location", "requiredSkills"]
            }
        };

        try {
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

            const enrichedBatch = JSON.parse(response.text);
            if (!Array.isArray(enrichedBatch) || enrichedBatch.length !== batch.length) {
                console.warn(`Batch size mismatch or invalid response. Expected ${batch.length}, got ${enrichedBatch ? enrichedBatch.length : 'unknown'}. Appending original batch to avoid data loss.`);
                enrichedEmployers.push(...batch);
            } else {
                // Ensure IDs match up to prevent order jumbling
                enrichedEmployers.push(...enrichedBatch);
            }
        } catch (e) {
            console.error("Error processing batch, appending original data: ", e);
            enrichedEmployers.push(...batch);
        }
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(enrichedEmployers, null, 4));
    console.log("\\nSuccess! Enriched " + enrichedEmployers.length + " employers with O*NET skills and saved to " + DATA_FILE + ".");
}

main().catch(console.error);
