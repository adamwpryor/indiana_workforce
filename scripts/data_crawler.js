const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { GoogleGenAI, Type } = require('@google/genai');

const TARGET_INSTITUTIONS = {
    "Anderson University": "https://anderson.edu",
    "Ball State University": "https://www.bsu.edu",
    "Bethel University": "https://www.betheluniversity.edu",
    "Butler University": "https://www.butler.edu",
    "Calumet College of St. Joseph": "https://www.ccsj.edu",
    "DePauw University": "https://www.depauw.edu",
    "Franklin College": "https://franklincollege.edu",
    "Goshen College": "https://www.goshen.edu",
    "Grace College (includes Grace College and Seminary)": "https://www.grace.edu",
    "Hanover College": "https://www.hanover.edu",
    "Holy Cross College": "https://www.hcc-nd.edu",
    "Huntington University": "https://www.huntington.edu",
    "Indiana State University": "https://www.indstate.edu",
    "Indiana Tech": "https://indianatech.edu",
    "Indiana University": "https://www.iu.edu",
    "Indiana University Indianapolis": "https://indianapolis.iu.edu",
    "Indiana Wesleyan University": "https://www.indwes.edu",
    "Ivy Tech Community College": "https://www.ivytech.edu",
    "Manchester University": "https://www.manchester.edu",
    "Marian University": "https://www.marian.edu",
    "Purdue University": "https://www.purdue.edu",
    "Rose-Hulman Institute of Technology": "https://www.rose-hulman.edu",
    "St. Mary of the Woods College": "https://www.smwc.edu",
    "Taylor University": "https://www.taylor.edu",
    "Trine University": "https://www.trine.edu",
    "University of Evansville": "https://www.evansville.edu",
    "University of Indianapolis": "https://www.uindy.edu",
    "University of Notre Dame": "https://www.nd.edu",
    "University of Saint Francis": "https://www.sf.edu",
    "University of Southern Indiana": "https://www.usi.edu",
    "Valparaiso University": "https://www.valpo.edu",
    "Vincennes University": "https://www.vinu.edu",
    "Wabash College": "https://www.wabash.edu",
    "Western Governors University (WGU)": "https://www.wgu.edu"
};

const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'institutions.json');

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique lowercase slug identifier, e.g. 'purdue-university'" },
        name: { type: Type.STRING, description: "The full name of the institution" },
        region: { type: Type.STRING, description: "The city or primary region in Indiana where the campus is located" },
        topMajors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3-5 most popular or notable degree programs" },
        studentDemographics: {
            type: Type.OBJECT,
            properties: {
                totalStudents: { type: Type.INTEGER, description: "Total number of enrolled students (numeric)" },
                underrepresentedMinorityPercentage: { type: Type.INTEGER, description: "Percentage of underrepresented minority students if available (0-100)" },
                firstGenerationPercentage: { type: Type.INTEGER, description: "Percentage of first-generation students if available (0-100)" }
            },
            required: ["totalStudents"]
        },
        type: { type: Type.STRING, description: "One of: 'R1', 'Liberal Arts', 'Community College', or 'Other'" }
    },
    required: ["id", "name", "region", "topMajors", "studentDemographics", "type"]
};

async function scrapeHomepage(url) {
    const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts and styles
    $('script, style, noscript').remove();

    let text = $('body').text().replace(/\s+/g, ' ').trim();
    // Truncate to avoid massive payloads
    if (text.length > 20000) text = text.substring(0, 20000);
    return text;
}

async function loadSecureKey() {
    // Custom Node.js Zero-Trust Implementation
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        throw new Error("Security Alert: GEMINI_API_KEY environment variable is not set.");
    }
    return key;
}

async function main() {
    let apiKey;
    try {
        apiKey = await loadSecureKey();
    } catch (e) {
        console.error(`ERROR: ${e.message}`);
        console.error("Please set your GEMINI_API_KEY in your OS environment variables before running this Zero-Trust script.");
        process.exit(1);
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const extractedData = [];
    console.log(`Starting Node.js Gemini Custom Extraction for ${Object.keys(TARGET_INSTITUTIONS).length} Institutions...`);

    for (const [name, url] of Object.entries(TARGET_INSTITUTIONS)) {
        console.log(`Crawling ${name}: ${url}...`);
        try {
            const homepageText = await scrapeHomepage(url);

            const prompt = `
            You are a data extraction research assistant. Review the following text scraped from ${name}'s homepage:
            ${url}
            
            EXTRACTED TEXT:
            ${homepageText}
            
            Extract detailed profile information based on the text. 
            Identify their top majors, overall student enrollment numeric figure, 
            and classify their institution type strictly as one of: 'R1', 'Liberal Arts', 'Community College', or 'Other'.
            Ensure you output valid JSON matching the exact schema requested.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema
                }
            });

            const result = JSON.parse(response.text);
            result.name = name; // Force correct name
            extractedData.push(result);
            console.log(`  [+] Success: Parsed ${name}`);

        } catch (e) {
            console.error(`  [!] Error crawling ${name}: ${e.message}`);
        }

        // Anti-rate-limit sleep for GenAI API and target servers
        await new Promise(r => setTimeout(r, 2000));
    }

    const targetDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(extractedData, null, 4));
    console.log(`\nExtraction complete! Saved ${extractedData.length} institutions to ${OUTPUT_FILE}`);
}

main().catch(console.error);
