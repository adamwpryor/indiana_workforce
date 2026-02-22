import os
import sys
import json
from typing import List, Optional
from pydantic import BaseModel, Field
from firecrawl import FirecrawlApp

# Add the src structure to the python path so we can import the zero trust module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.utils.security import load_secure_key

# Define the precise schema to match the TypeScript interface `InstitutionSchema`
class StudentDemographics(BaseModel):
    totalStudents: int = Field(description="Total number of enrolled students")
    underrepresentedMinorityPercentage: Optional[int] = Field(None, description="Percentage of underrepresented minority students if available (0-100)")
    firstGenerationPercentage: Optional[int] = Field(None, description="Percentage of first-generation students if available (0-100)")

class InstitutionExtractSchema(BaseModel):
    id: str = Field(description="A unique lowercase slug identifier, e.g. 'purdue-university'")
    name: str = Field(description="The full name of the institution")
    region: str = Field(description="The city or primary region in Indiana where the campus is located")
    topMajors: List[str] = Field(description="Top 3-5 most popular or notable degree programs")
    studentDemographics: StudentDemographics
    type: str = Field(description="One of: 'R1', 'Liberal Arts', 'Community College', or 'Other'")

# 34 specific Indiana institutions target list mapped to base URLs for scraping
TARGET_INSTITUTIONS = {
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
}

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'institutions.json')

def main():
    try:
        api_key = load_secure_key("FIRECRAWL_API_KEY")
    except ValueError as e:
        print(f"ERROR: {e}")
        print("Please set your API key in your OS environment variables before running this Zero-Trust script.")
        return

    # Initialize Firecrawl SDK
    app = FirecrawlApp(api_key=api_key)
    
    extracted_data = []

    print(f"Starting Firecrawl Extraction for {len(TARGET_INSTITUTIONS)} Institutions...")
    
    for name, url in TARGET_INSTITUTIONS.items():
        print(f"Crawling {name}: {url}...")
        try:
            # We use Firecrawl's extract endpoint with pydantic schema to force structured JSON output
            data = app.scrape(
                url,
                params={
                    'formats': ['extract'],
                    'extract': {
                        'schema': InstitutionExtractSchema.model_json_schema(),
                        'prompt': f"Extract detailed profile information for {name} from their homepage. Identify their top majors, overall student enrollment numeric figure, and classify their institution type strictly as one of: 'R1', 'Liberal Arts', 'Community College', or 'Other'."
                    }
                }
            )
            
            if 'extract' in data:
                result = data['extract']
                # Merge the correct name from our index in case the LLM wanders
                result['name'] = name
                extracted_data.append(result)
                print(f"  [+] Success: Parsed {name}")
            else:
                print(f"  [-] Failed: No 'extract' object returned for {name}.")
                
        except Exception as e:
            print(f"  [!] Error crawling {name}: {e}")

    # Ensure target directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    # Dump to JSON to be parsed into the app schema
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=4)
        
    print(f"\nExtraction complete! Saved {len(extracted_data)} institutions to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
