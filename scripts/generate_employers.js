const fs = require('fs');
const path = require('path');
const { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } = require('@google/genai');

const INS_FILE = path.join(__dirname, '..', 'src', 'data', 'institutions.json');
const OUT_FILE = path.join(__dirname, '..', 'src', 'data', 'employers.json');

async function main() {
    const key = process.env.BLT_GEMINI_KEY;
    if (!key) {
        console.error("Security Alert: BLT_GEMINI_KEY environment variable is not set.");
        process.exit(1);
    }

    // Load current institutions to use as context
    let institutionsCtx = "";
    if (fs.existsSync(INS_FILE)) {
        const rawData = fs.readFileSync(INS_FILE, 'utf8');
        const parsed = JSON.parse(rawData);
        // Map down to just essentials to save tokens and focus the AI
        institutionsCtx = JSON.stringify(parsed.map(i => ({
            name: i.name,
            region: i.region,
            topMajors: i.topMajors,
            type: i.type
        })), null, 2);
    } else {
        console.warn("Warning: institutions.json not found for context.");
    }

    const ai = new GoogleGenAI({ apiKey: key });

    console.log(`Generating 250 diverse Indiana employers using Gemini...`);

    const prompt = `
    You are an expert labor market analyst for the state of Indiana. 
    Your task is to generate a diverse, highly realistic JSON array of EXACTLY 250 top employers in Indiana.

    INSTRUCTIONS:
    1. Output EXACTLY 250 employer objects.
    2. Do NOT constrain yourself to a small list of sectors. Include a wide variety of industries (e.g., Advanced Manufacturing, Healthcare, Life Sciences, Pharmaceuticals, Education (K-12 and Higher Ed systems), Technology, Agriculture, Logistics & Supply Chain, Finance & Insurance, Government, Non-profits, Retail Management).
    3. Include massive Fortune 500s (e.g., Eli Lilly, Cummins, Salesforce, Cook Medical, Anthem/Elevance), large hospital systems (IU Health, Ascension St. Vincent), school corporations, regional manufacturers, and prominent mid-sized companies across the state.
    4. Ensure geographic diversity across Indiana (Indianapolis, Fort Wayne, Evansville, South Bend, West Lafayette, Bloomington, Columbus, Terre Haute, etc.).
    5. The "hiringNeeds" and "requiredSkills" arrays should be realistic for the respective company and industry.
    6. For context, here are the major institutions, their regions, and top majors currently in our dataset. Try to construct companies that might logically recruit from these talent pools:
    
    INSTITUTION CONTEXT:
    ${institutionsCtx}
    `;

    try {
        const responseSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique slug, e.g. 'eli-lilly' or 'evansville-vanderburgh-schools'" },
                    name: { type: Type.STRING, description: "Full company or organization name" },
                    industry: { type: Type.STRING, description: "The specific sector, unconstrained. E.g., 'Life Sciences', 'K-12 Education', 'Advanced Manufacturing'" },
                    hiringNeeds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 3-5 roles or degree areas they hire for" },
                    location: { type: Type.STRING, description: "Primary Indiana city/headquarters" },
                    requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 3-5 specific technical or soft skills" }
                },
                required: ["id", "name", "industry", "hiringNeeds", "location", "requiredSkills"]
            }
        };

        console.log("Waiting for Gemini response. This may take a minute for 250 records...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using pro to reliably generate 250 items without dropping context
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

        const updatedEmployers = JSON.parse(response.text);

        if (!Array.isArray(updatedEmployers)) {
            console.error("Gemini returned invalid structure.");
            process.exit(1);
        }

        fs.writeFileSync(OUT_FILE, JSON.stringify(updatedEmployers, null, 4));
        console.log("\nSuccess! Wrote " + updatedEmployers.length + " employers to " + OUT_FILE + ".");

    } catch (e) {
        console.error("Error generating employers: ", e);
    }
}

main().catch(console.error);
