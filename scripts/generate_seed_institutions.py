import json
import os
import re

institutions = [
    "Anderson University", "Ball State University", "Bethel University", "Butler University", 
    "Calumet College of St. Joseph", "DePauw University", "Franklin College", "Goshen College", 
    "Grace College (includes Grace College and Seminary)", "Hanover College", "Holy Cross College", 
    "Huntington University", "Indiana State University", "Indiana Tech", "Indiana University", 
    "Indiana University Indianapolis", "Indiana Wesleyan University", "Ivy Tech Community College", 
    "Manchester University", "Marian University", "Purdue University", "Rose-Hulman Institute of Technology", 
    "St. Mary of the Woods College", "Taylor University", "Trine University", "University of Evansville", 
    "University of Indianapolis", "University of Notre Dame", "University of Saint Francis", 
    "University of Southern Indiana", "Valparaiso University", "Vincennes University", "Wabash College", 
    "Western Governors University (WGU)"
]

def generate_id(name):
    # Remove things in parens
    name = re.sub(r'\(.*?\)', '', name)
    # lowercase, replace spaces with hyphens, remove special characters
    return re.sub(r'[^a-z0-9-]', '', name.lower().strip().replace(' ', '-'))

seed_data = []
for name in institutions:
    seed_data.append({
        "id": generate_id(name),
        "name": name,
        "region": "Indiana",
        "topMajors": ["Pending Data Crawler Scan"],
        "studentDemographics": { "totalStudents": 0 },
        "type": "Pending Classification"
    })

out_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'institutions.json')

with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(seed_data, f, indent=4)

print(f"Generated {len(seed_data)} seed institutions at {out_path}")
