import json
import re

with open('js/data/careers.js', 'r', encoding='utf-8') as f:
    careers_js = f.read()

pattern = r'{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*streamCompatibility:\s*\[([^\]]+)\]'
matches = re.findall(pattern, careers_js)

careers = []
for m in matches:
    c_id, name, cat, streams_raw = m
    streams = [s.strip().replace('"', '') for s in streams_raw.split(',')]
    careers.append({
        'id': c_id,
        'name': name,
        'category': cat,
        'streamCompatibility': streams
    })

def match_careers(assessment_data):
    stream = assessment_data.get('stream', '')
    stream_answers = set(assessment_data.get('streamAnswers', []))
    extracurriculars = set(assessment_data.get('extracurriculars', []))
    strengths = set(assessment_data.get('strengths', []))
    preferences = set(assessment_data.get('preferences', []))

    has_pilot = "pilot_interest" in stream_answers or "aviation_pilot_pref" in preferences
    has_army = "defence_army_interest" in stream_answers or ("defence_service_pref" in preferences and "ncc" in extracurriculars)
    has_navy = "navy_interest" in stream_answers
    has_airforce = "airforce_interest" in stream_answers or ("defence_service_pref" in preferences and ("aerospace_interest" in stream_answers or "aeronautical_interest" in stream_answers))
    has_def_tech = "defence_tech_interest" in stream_answers or ("defence_service_pref" in preferences and "electronics" in stream_answers)
    has_gen_def = "defence_service_pref" in preferences or has_army or has_navy or has_airforce or has_def_tech

    has_software = "software_coding_interest" in stream_answers or "coding_clubs" in extracurriculars or "working_tech" in preferences
    has_mech = "mechanical_machinery_interest" in stream_answers or "working_machines" in preferences or "robotics" in extracurriculars
    has_ca = "ca_accounting_interest" in stream_answers
    has_finance = "finance_stock_interest" in stream_answers
    has_medicine = "medicine_interest" in stream_answers or "clinical_medicine" in stream_answers
    has_biotech = "biotech_interest" in stream_answers or "biotech_genetics" in stream_answers
    has_pharmacy = "pharmacy_interest" in stream_answers or "pharmacy" in stream_answers
    has_physio = "physio_interest" in stream_answers or "physiotherapy" in stream_answers
    has_teaching = "teaching_interest" in stream_answers or "teaching_explaining" in preferences or "teaching_tutoring" in extracurriculars or "peer_mentoring" in extracurriculars
    has_law = "law_interest" in stream_answers or "corporate_law_interest" in stream_answers
    has_civils = "civils_interest" in stream_answers

    scored = []
    for c in careers:
        score = 0
        c_id = c['id']
        cat = c['category']
        compat = c['streamCompatibility']

        # 1. Interests (+40)
        if c_id == "commercial_pilot" and has_pilot: score += 40
        if c_id == "defence_army" and (has_army or (has_gen_def and "leadership" in strengths)): score += 40
        if c_id == "defence_navy" and (has_navy or (has_gen_def and ("working_outdoors" in preferences or "teamwork" in strengths))): score += 40
        if c_id == "defence_airforce" and (has_airforce or (has_gen_def and ("aerospace_interest" in stream_answers or "aeronautical_interest" in stream_answers))): score += 40
        if c_id == "defence_tech" and has_def_tech: score += 40

        if c_id in ["cs_software", "ai_ml", "data_science", "cybersecurity"] and has_software: score += 35
        if c_id in ["applied_mechanics_tech", "mechanical", "robotics_automation"] and has_mech: score += 35
        if c_id in ["ca_auditing", "financial_analyst", "actuarial_science"] and (has_ca or has_finance): score += 35
        if c_id in ["medicine", "biotechnology", "pharmacy", "physiotherapy"] and (has_medicine or has_biotech or has_pharmacy or has_physio): score += 35
        if cat == "Education" and has_teaching: score += 35
        if c_id in ["corporate_law", "civil_services", "public_policy"] and (has_law or has_civils): score += 35

        # 2. Stream
        if stream != "vocational":
            if stream in compat: score += 25
            else: score -= 20
        else:
            if c_id in ["applied_mechanics_tech", "vocational_tech_it", "vocational_biz_mgmt", "applied_design_media"]: score += 25
            elif "vocational" in compat: score += 15
            else: score -= 15

        # 3. Strengths
        if "problem_solving" in strengths and c_id in ["cs_software", "ai_ml", "cybersecurity", "mechanical", "applied_mechanics_tech"]: score += 15
        if "analytical_thinking" in strengths and c_id in ["data_science", "financial_analyst", "ca_auditing", "astrophysics"]: score += 15
        if "spatial_thinking" in strengths and c_id in ["aerospace", "aeronautical_eng", "commercial_pilot", "architecture"]: score += 15
        if "attention_detail" in strengths and c_id in ["ca_auditing", "cybersecurity", "aircraft_maintenance"]: score += 12
        if ("leadership" in strengths or "discipline" in strengths) and c_id in ["defence_army", "defence_navy", "defence_airforce", "civil_services"]: score += 15
        if ("explaining_concepts" in strengths or "patience" in strengths) and cat == "Education": score += 15

        # 4. Preferences
        if "working_tech" in preferences and cat == "Technology": score += 12
        if "working_machines" in preferences and c_id in ["applied_mechanics_tech", "mechanical", "aircraft_maintenance"]: score += 12
        if "working_data" in preferences and c_id in ["data_science", "financial_analyst", "ca_auditing"]: score += 12
        if "research_investigation" in preferences and cat == "Science & Research": score += 12

        # 5. Extracurriculars
        if "ncc" in extracurriculars and c_id in ["defence_army", "defence_navy", "defence_airforce", "civil_services"]: score += 8
        if "coding_clubs" in extracurriculars and cat == "Technology": score += 8

        # 6. Hard Filters
        if c_id == "commercial_pilot" and not has_pilot: score -= 60
        if c_id == "defence_army" and not has_army and not has_gen_def: score -= 60
        if c_id == "defence_navy" and not has_navy and not (has_gen_def and "working_outdoors" in preferences): score -= 60
        if c_id == "defence_airforce" and not has_airforce and not (has_gen_def and ("aerospace_interest" in stream_answers or "aeronautical_interest" in stream_answers)): score -= 60
        if c_id == "defence_tech" and not has_def_tech and not has_gen_def: score -= 60
        if c_id == "medicine" and stream not in ["pcb", "pcmb"]: score -= 60

        final_score = max(0, min(100, score))
        scored.append({'id': c_id, 'name': c['name'], 'score': final_score})

    scored.sort(key=lambda x: x['score'], reverse=True)
    top = [s for s in scored if s['score'] >= 35][:5]
    if len(top) < 3:
        top = scored[:4]
    return top

print("=== PROFILE TESTING REPORT ===")

# Profile A
resA = match_careers({
    'stream': 'vocational',
    'streamAnswers': ['mechanical_machinery_interest'],
    'extracurriculars': ['projects'],
    'strengths': ['problem_solving'],
    'preferences': ['working_machines']
})
print("\nProfile A (Vocational + Machinery):")
for r in resA: print(f"  {r['score']}% - {r['name']} ({r['id']})")
has_def_pilot_A = any(r['id'] in ['defence_army', 'defence_navy', 'defence_airforce', 'commercial_pilot'] for r in resA)
print(f"Profile A contains Defence/Pilot: {has_def_pilot_A} -> {'FAIL' if has_def_pilot_A else 'PASS SUCCESS'}")

# Profile B
resB = match_careers({
    'stream': 'vocational',
    'streamAnswers': ['software_coding_interest'],
    'extracurriculars': ['coding_clubs'],
    'strengths': ['problem_solving'],
    'preferences': ['working_tech']
})
print("\nProfile B (Vocational + Coding):")
for r in resB: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Profile C
resC = match_careers({
    'stream': 'pcm',
    'streamAnswers': ['phys_mech', 'spatial_geom', 'aerospace_interest', 'pilot_interest'],
    'extracurriculars': ['projects'],
    'strengths': ['spatial_thinking', 'problem_solving'],
    'preferences': ['aviation_pilot_pref']
})
print("\nProfile C (PCM + Pilot/Aviation):")
for r in resC: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Profile D
resD = match_careers({
    'stream': 'pcm',
    'streamAnswers': ['defence_tech_interest'],
    'extracurriculars': ['ncc', 'leadership'],
    'strengths': ['leadership', 'discipline', 'teamwork'],
    'preferences': ['defence_service_pref']
})
print("\nProfile D (PCM + NCC + Defence Interest):")
for r in resD: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Profile E
resE = match_careers({
    'stream': 'pcb',
    'streamAnswers': ['clinical_medicine', 'medicine_interest'],
    'extracurriculars': ['science_exhibitions'],
    'strengths': ['empathy', 'problem_solving'],
    'preferences': ['research_investigation', 'working_people']
})
print("\nProfile E (PCB + Medical):")
for r in resE: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Profile F
resF = match_careers({
    'stream': 'commerce',
    'streamAnswers': ['ca_accounting_interest'],
    'extracurriculars': ['competitions'],
    'strengths': ['attention_detail', 'numerical_ability'],
    'preferences': ['working_data']
})
print("\nProfile F (Commerce + CA/Finance):")
for r in resF: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Profile G
resG = match_careers({
    'stream': 'cs_maths',
    'streamAnswers': ['teaching_interest', 'software_coding_interest'],
    'extracurriculars': ['teaching_tutoring', 'peer_mentoring'],
    'strengths': ['communication', 'explaining_concepts', 'patience'],
    'preferences': ['teaching_explaining']
})
print("\nProfile G (CS + Teaching):")
for r in resG: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Profile H
resH = match_careers({
    'stream': 'arts',
    'streamAnswers': ['law_interest', 'civils_interest'],
    'extracurriculars': ['writing'],
    'strengths': ['communication', 'critical_thinking'],
    'preferences': ['working_people']
})
print("\nProfile H (Humanities + Law/Civils):")
for r in resH: print(f"  {r['score']}% - {r['name']} ({r['id']})")
