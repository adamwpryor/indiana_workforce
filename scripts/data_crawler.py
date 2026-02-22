import os
import sys
import json
import requests
from bs4 import BeautifulSoup
from typing import List, Optional
from pydantic import BaseModel, Field
import google.generativeai as genai

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

def scrape_homepage(url: str) -> str:
    """Fetches the homepage and extracts visible text."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.extract()
        
    # Get text
    text = soup.get_text(separator=' ', strip=True)
    return text[:20000] # Limit tokens to reasonable amount for Google GenAI

def main():
    try:
        api_key = load_secure_key("GEMINI_API_KEY")
    except ValueError as e:
        print(f"ERROR: {e}")
        print("Please set your GEMINI_API_KEY in your OS environment variables before running this Zero-Trust script.")
        return

    # Initialize Google GenAI SDK
    genai.configure(api_key=api_key)
    # Instantiate the model with JSON structured output configuration
    model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json", "response_schema": InstitutionExtractSchema})
    
    extracted_data = []

    print(f"Starting Gemini Custom Extraction for {len(TARGET_INSTITUTIONS)} Institutions...")
    
    for name, url in TARGET_INSTITUTIONS.items():
        print(f"Crawling {name}: {url}...")
        try:
            # 1. Scrape the homepage text
            homepage_text = scrape_homepage(url)
            
            # 2. Use Gemini to extract structural data
            prompt = f"""
            You are a data extraction research assistant. Review the following text scraped from {name}'s homepage:
            {url}
            
            EXTRACTED TEXT:
            {homepage_text}
            
            Extract detailed profile information based on the text. 
            Identify their top majors, overall student enrollment numeric figure, 
            and classify their institution type strictly as one of: 'R1', 'Liberal Arts', 'Community College', or 'Other'.
            Ensure you output valid JSON matching the exact schema requested.
            """
            
            response = model.generate_content(prompt)
            
            result = json.loads(response.text)
            
            # Merge the correct name from our index to maintain consistency
            result['name'] = name
            extracted_data.append(result)
            print(f"  [+] Success: Parsed {name}")
                
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
