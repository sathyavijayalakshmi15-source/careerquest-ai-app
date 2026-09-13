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
    avoidances = set(assessment_data.get('avoidances', []))

    # Biological science signals
    has_bio_signal = "genetics_dna" in stream_answers or "human_anatomy" in stream_answers or "microbiology" in stream_answers or "biotech_genetics" in stream_answers or "clinical_medicine" in stream_answers or stream in ["pcb", "pcmb"]

    # Specific interest signals
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

        # 1. Explicit Interest (+45)
        if c_id == "commercial_pilot" and has_pilot: score += 45
        if c_id == "defence_army" and (has_army or (has_gen_def and "leadership" in strengths)): score += 45
        if c_id == "defence_navy" and (has_navy or (has_gen_def and ("working_outdoors" in preferences or "teamwork" in strengths))): score += 45
        if c_id == "defence_airforce" and (has_airforce or (has_gen_def and ("aerospace_interest" in stream_answers or "aeronautical_interest" in stream_answers))): score += 45
        if c_id == "defence_tech" and has_def_tech: score += 45

        if c_id in ["cs_software", "ai_ml", "data_science", "cybersecurity"] and has_software: score += 40
        if c_id in ["applied_mechanics_tech", "mechanical", "robotics_automation"] and has_mech: score += 40
        if c_id in ["ca_auditing", "financial_analyst", "actuarial_science"] and (has_ca or has_finance): score += 40
        if c_id in ["medicine", "biotechnology", "pharmacy", "physiotherapy"] and (has_medicine or has_biotech or has_pharmacy or has_physio): score += 40
        if cat == "Education" and has_teaching and (has_software or "pure_maths" in stream_answers or has_bio_signal or "communication" in strengths or "explaining_concepts" in strengths): score += 40
        if c_id in ["corporate_law", "civil_services", "public_policy"] and (has_law or has_civils): score += 40

        # 2. Stream Filter (+15 pts for compatibility, NOT main reason)
        if stream != "vocational":
            if stream in compat: score += 15
            else: score -= 25
        else:
            if c_id in ["applied_mechanics_tech", "vocational_tech_it", "vocational_biz_mgmt", "applied_design_media"]: score += 20
            elif "vocational" in compat: score += 10
            else: score -= 15

        # 3. Strengths (+12)
        if "problem_solving" in strengths and c_id in ["cs_software", "ai_ml", "cybersecurity", "mechanical", "applied_mechanics_tech"]: score += 12
        if "analytical_thinking" in strengths and c_id in ["data_science", "financial_analyst", "ca_auditing", "astrophysics"]: score += 12
        if "spatial_thinking" in strengths and c_id in ["aerospace", "aeronautical_eng", "commercial_pilot", "architecture"]: score += 12
        if "attention_detail" in strengths and c_id in ["ca_auditing", "cybersecurity", "aircraft_maintenance"]: score += 10
        if ("leadership" in strengths or "discipline" in strengths) and c_id in ["defence_army", "defence_navy", "defence_airforce", "civil_services"]: score += 12
        if ("explaining_concepts" in strengths or "patience" in strengths) and cat == "Education": score += 12

        # 4. Preferences (+15)
        if "working_tech" in preferences and cat == "Technology": score += 15
        if "working_machines" in preferences and c_id in ["applied_mechanics_tech", "mechanical", "aircraft_maintenance"]: score += 15
        if "working_data" in preferences and c_id in ["data_science", "financial_analyst", "ca_auditing"]: score += 15
        if "research_investigation" in preferences and cat == "Science & Research": score += 15
        if "working_people" in preferences and (cat == "Medical & Healthcare" or c_id in ["physiotherapy", "medicine", "corporate_law"]): score += 15

        # 5. Extracurriculars (+8)
        if "ncc" in extracurriculars and c_id in ["defence_army", "defence_navy", "defence_airforce", "civil_services"]: score += 8
        if "coding_clubs" in extracurriculars and cat == "Technology": score += 8

        # 6. HARD MISMATCH & AVOIDANCE PENALTIES (-80 to -100)
        # Bug 1 Fix: Bioinformatics requires biological science signal!
        if c_id == "bioinformatics" and not has_bio_signal and "bioinfo_interest" not in stream_answers:
            score -= 80

        if c_id == "commercial_pilot" and not has_pilot: score -= 80
        if c_id == "defence_army" and not has_army and not has_gen_def: score -= 80
        if c_id == "defence_navy" and not has_navy and not (has_gen_def and "working_outdoors" in preferences): score -= 80
        if c_id == "defence_airforce" and not has_airforce and not (has_gen_def and ("aerospace_interest" in stream_answers or "aeronautical_interest" in stream_answers)): score -= 80
        if c_id == "defence_tech" and not has_def_tech and not has_gen_def: score -= 80
        if c_id == "medicine" and (stream not in ["pcb", "pcmb"] or "avoid_patient_care" in avoidances): score -= 100
        if c_id in ["nursing", "dentistry", "physiotherapy"] and "avoid_patient_care" in avoidances: score -= 100
        if cat == "Education" and not has_teaching and "explaining_concepts" not in strengths and "teaching_tutoring" not in extracurriculars: score -= 50

        # Avoidances penalties
        if "avoid_patient_care" in avoidances and cat == "Medical & Healthcare" and c_id != "biotechnology":
            score -= 100
        if "avoid_desk_computer" in avoidances and cat == "Technology":
            score -= 60

        final_score = max(0, min(100, score))
        scored.append({'id': c_id, 'name': c['name'], 'score': final_score})

    scored.sort(key=lambda x: x['score'], reverse=True)
    top = [s for s in scored if s['score'] >= 30][:6]
    if len(top) < 3:
        top = scored[:5]
    return top

print("=== SCENARIO TESTING REPORT ===")

# Scenario A: CS + Maths + Programming + Tech + Logic
resA = match_careers({
    'stream': 'cs_maths',
    'streamAnswers': ['software_coding_interest', 'ai_ml_interest'],
    'extracurriculars': ['coding_clubs'],
    'strengths': ['problem_solving'],
    'preferences': ['working_tech']
})
print("\nScenario A (CS + Maths + Programming + Tech + Logic):")
for r in resA: print(f"  {r['score']}% - {r['name']} ({r['id']})")
has_bioinfo_A = any(r['id'] in ['bioinformatics', 'medicine'] for r in resA)
print(f"Scenario A contains Bioinformatics/Medicine: {has_bioinfo_A} -> {'FAIL' if has_bioinfo_A else 'PASS SUCCESS'}")

# Scenario B: CS + Maths + Biology + Programming + Research
resB = match_careers({
    'stream': 'pcmb',
    'streamAnswers': ['bioinfo_interest', 'genetics_dna'],
    'extracurriculars': ['coding_clubs', 'science_exhibitions'],
    'strengths': ['analytical_thinking'],
    'preferences': ['research_investigation', 'working_tech']
})
print("\nScenario B (CS/PCMB + Bio + Tech + Research):")
for r in resB: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Scenario C: PCB + Biology + Healthcare + Patient Care
resC = match_careers({
    'stream': 'pcb',
    'streamAnswers': ['clinical_medicine', 'medicine_interest'],
    'extracurriculars': ['volunteering'],
    'strengths': ['empathy', 'problem_solving'],
    'preferences': ['working_people', 'helping_others']
})
print("\nScenario C (PCB + Medical + Patient Care):")
for r in resC: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Scenario D: Commerce + Accounting + Numbers + Detail
resD = match_careers({
    'stream': 'commerce',
    'streamAnswers': ['ca_accounting_interest'],
    'extracurriculars': ['competitions'],
    'strengths': ['attention_detail', 'numerical_ability'],
    'preferences': ['working_data']
})
print("\nScenario D (Commerce + CA/Finance):")
for r in resD: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Scenario E: Humanities + Writing + Communication + Social Issues
resE = match_careers({
    'stream': 'arts',
    'streamAnswers': ['law_interest', 'journalism_interest'],
    'extracurriculars': ['writing'],
    'strengths': ['communication', 'critical_thinking'],
    'preferences': ['working_people']
})
print("\nScenario E (Humanities + Law/Journalism):")
for r in resE: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Scenario F: Vocational + Practical + Machines + Building + Hands-on
resF = match_careers({
    'stream': 'vocational',
    'streamAnswers': ['mechanical_machinery_interest'],
    'extracurriculars': ['projects'],
    'strengths': ['problem_solving'],
    'preferences': ['working_machines']
})
print("\nScenario F (Vocational + Machinery):")
for r in resF: print(f"  {r['score']}% - {r['name']} ({r['id']})")
has_def_F = any(r['id'] in ['defence_army', 'defence_navy', 'defence_airforce', 'commercial_pilot'] for r in resF)
print(f"Scenario F contains Defence/Pilot: {has_def_F} -> {'FAIL' if has_def_F else 'PASS SUCCESS'}")

# Scenario G: Any stream + Defence interest + Leadership + Discipline + Teamwork
resG = match_careers({
    'stream': 'pcm',
    'streamAnswers': ['defence_tech_interest'],
    'extracurriculars': ['ncc', 'leadership'],
    'strengths': ['leadership', 'discipline', 'teamwork'],
    'preferences': ['defence_service_pref']
})
print("\nScenario G (PCM + NCC + Defence Interest):")
for r in resG: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Scenario H: Any stream + Aviation/Pilot interest + Spatial/Decision-making
resH = match_careers({
    'stream': 'pcm',
    'streamAnswers': ['pilot_interest'],
    'extracurriculars': ['projects'],
    'strengths': ['spatial_thinking', 'decision_making'],
    'preferences': ['aviation_pilot_pref']
})
print("\nScenario H (PCM + Aviation/Pilot Interest):")
for r in resH: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Scenario I: Few selected interests (e.g. only stream Commerce selected)
resI = match_careers({
    'stream': 'commerce',
    'streamAnswers': [],
    'extracurriculars': [],
    'strengths': [],
    'preferences': []
})
print("\nScenario I (Limited signals - Commerce stream only):")
for r in resI: print(f"  {r['score']}% - {r['name']} ({r['id']})")

# Scenario J: Dislikes patient-facing work
resJ = match_careers({
    'stream': 'pcb',
    'streamAnswers': ['biotech_interest', 'genetics_dna'],
    'extracurriculars': ['science_exhibitions'],
    'strengths': ['analytical_thinking'],
    'preferences': ['research_investigation'],
    'avoidances': ['avoid_patient_care']
})
print("\nScenario J (PCB + Dislikes Patient-Facing Work):")
for r in resJ: print(f"  {r['score']}% - {r['name']} ({r['id']})")
has_med_J = any(r['id'] in ['medicine', 'nursing', 'dentistry'] for r in resJ)
print(f"Scenario J contains Patient Care (Medicine/Nursing): {has_med_J} -> {'FAIL' if has_med_J else 'PASS SUCCESS'}")
