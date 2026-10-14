import json
import re

print("Testing end-to-end matchCareers and renderResults simulation...")

careers_js = open('js/data/careers.js', encoding='utf-8').read()
arr_match = re.search(r'window\.CAREERS_DATABASE\s*=\s*(\[.*?\]);', careers_js, flags=re.DOTALL)
clean_careers = arr_match.group(1)
clean_careers = re.sub(r'//.*', '', clean_careers)
clean_careers = re.sub(r'/\*.*?\*/', '', clean_careers, flags=re.DOTALL)

def js_to_json(js_str):
    js_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', js_str)
    js_str = re.sub(r',\s*([}\]])', r'\1', js_str)
    return js_str

careers = json.loads(js_to_json(clean_careers))

# Test the failing profile:
# Science – Computer Science + Maths (cs_maths)
# Strengths: Teamwork, Mentoring Others
# Extracurriculars: Art & Sketching, Music & Singing, Tutoring Classmates
from test_diagnose_fix import match_careers_fixed

profiles_to_test = [
    {
        "name": "Failing User Profile: CS/Maths + Teamwork/Mentoring + Art/Music/Tutoring",
        "state": {
            "stream": "cs_maths",
            "streamAnswers": ["software_coding_interest"],
            "strengths": ["teamwork", "mentoring_others"],
            "extracurriculars": ["art_drawing", "music", "teaching_tutoring"],
            "preferences": [],
            "avoidances": []
        }
    },
    {
        "name": "Failing User Profile with EMPTY streamAnswers",
        "state": {
            "stream": "cs_maths",
            "streamAnswers": [],
            "strengths": ["teamwork", "mentoring_others"],
            "extracurriculars": ["art_drawing", "music", "teaching_tutoring"],
            "preferences": [],
            "avoidances": []
        }
    },
    {
        "name": "Science PCM Profile (Physics & Research)",
        "state": {
            "stream": "pcm",
            "streamAnswers": ["pure_physics_interest"],
            "strengths": ["analytical_thinking"],
            "extracurriculars": ["science_exhibitions"],
            "preferences": ["research_investigation"],
            "avoidances": []
        }
    },
    {
        "name": "Science PCB Profile (Medical Imaging & Healthcare)",
        "state": {
            "stream": "pcb",
            "streamAnswers": ["medical_imaging_interest", "allied_health_interest"],
            "strengths": ["attention_detail"],
            "extracurriculars": ["volunteering"],
            "preferences": ["working_tech"],
            "avoidances": []
        }
    },
    {
        "name": "Commerce Profile (CMA & Finance)",
        "state": {
            "stream": "commerce",
            "streamAnswers": ["cma_interest"],
            "strengths": ["analytical_thinking"],
            "extracurriculars": ["reading"],
            "preferences": ["working_data"],
            "avoidances": []
        }
    },
    {
        "name": "Humanities / Arts Profile (Clinical Psychology)",
        "state": {
            "stream": "arts",
            "streamAnswers": ["psychology_interest"],
            "strengths": ["empathy"],
            "extracurriculars": ["writing"],
            "preferences": ["helping_others"],
            "avoidances": []
        }
    },
    {
        "name": "Vocational Profile (Applied IT & Mechanical)",
        "state": {
            "stream": "vocational",
            "streamAnswers": ["software_coding_interest"],
            "strengths": ["problem_solving"],
            "extracurriculars": ["projects"],
            "preferences": ["building_things"],
            "avoidances": []
        }
    }
]

# Simulate Results.js card rendering
def simulate_render_results(recommendations, state):
    topMatches = recommendations.get('topMatches', [])
    cards = []
    for idx, item in enumerate(topMatches):
        career = item.get('career') or item
        if not career or not career.get('id'):
            continue
        matchPercent = item.get('matchPercent') or f"{item.get('matchScore', 65)}%"
        matchLabel = item.get('matchLabel', 'Good Pathway to Explore')
        reasons = item.get('reasons') or item.get('matchReasonList') or []
        cards.append({
            "id": career['id'],
            "name": career['name'],
            "category": career.get('category', ''),
            "matchPercent": matchPercent,
            "matchLabel": matchLabel,
            "reasons": reasons
        })
    return cards

for p in profiles_to_test:
    print("\n" + "="*60)
    print("Testing:", p["name"])
    print("="*60)
    recs = match_careers_fixed(p["state"])
    cards = simulate_render_results(recs, p["state"])
    print(f"Generated {len(cards)} career exploration cards:")
    assert len(cards) >= 3, f"Expected at least 3 cards, got {len(cards)}"
    for idx, c in enumerate(cards):
        print(f"  Card #{idx+1}: {c['name']} ({c['category']}) - {c['matchPercent']} [{c['matchLabel']}]")
        print(f"     Why appeared: {c['reasons'][:2]}")
    print("  [OK] PASS")

print("\n" + "="*60)
print("ALL REPRESENTATIVE PROFILES SUCCESSFULLY RENDERED VALID RECOMMENDATION CARDS!")
print("="*60)
