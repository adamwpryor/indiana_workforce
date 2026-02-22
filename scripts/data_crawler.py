import os
import json
import requests
import argparse

# Zero-Trust/Conda-First principle: using Env Variables
FIRECRAWL_API_KEY = os.environ.get("FIRECRAWL_API_KEY")

INSTITUTION_PROMPT = """
You are an AI extracting higher education data. Extract the following from the provided URL:
1. Institution Name
2. Region (City)
3. Top 3 Majors or Programs
4. Student Demographics (total students, underrepresented minority %, first generation %)
5. Type (R1, Liberal Arts, Community College, or Other)

Return strictly as JSON matching the InstitutionSchema.
"""

EMPLOYER_PROMPT = """
You are an AI extracting employer data from a career page. Extract the following:
1. Employer Name
2. Industry
3. Top 3 Hiring Needs (e.g. Roles)
4. Location (HQ or Primary)
5. Required Skills (list of 3-5 technical or durable skills)

Return strictly as JSON matching the EmployerSchema.
"""

def extract_data(url: str, prompt: str):
    if not FIRECRAWL_API_KEY:
        print("WARNING: FIRECRAWL_API_KEY is not set. Data cannot be crawled.")
        return None

    headers = {
        "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "url": url,
        "prompt": prompt
    }

    try:
        print(f"Submitting extraction request to Firecrawl for: {url}")
        res = requests.post("https://api.firecrawl.dev/v1/extract", headers=headers, json=payload)
        res.raise_for_status()
        return res.json().get("data")
    except Exception as e:
        print(f"Error extracting data from {url}: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="AI Partner-Matching Crawler using Firecrawl")
    parser.add_argument("--url", type=str, required=True, help="URL to crawl")
    parser.add_argument("--type", choices=["institution", "employer"], required=True, help="Type of entity to extract")
    parser.add_argument("--output", type=str, default="crawled_data.json", help="Output JSON file path")
    
    args = parser.parse_args()

    prompt = INSTITUTION_PROMPT if args.type == "institution" else EMPLOYER_PROMPT
    
    data = extract_data(args.url, prompt)
    
    if data:
        # Append to or create output file
        existing_data = []
        if os.path.exists(args.output):
            with open(args.output, "r") as f:
                try:
                    existing_data = json.load(f)
                except json.JSONDecodeError:
                    existing_data = []
        
        # Ensure we just append the structured object
        existing_data.append(data)
        
        with open(args.output, "w") as f:
            json.dump(existing_data, f, indent=2)
        print(f"Successfully appended {args.type} data to {args.output}")

if __name__ == "__main__":
    main()
