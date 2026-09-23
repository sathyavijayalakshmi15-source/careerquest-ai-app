import json
import re

# Read JS source files
careers_js = open('js/data/careers.js', encoding='utf-8').read()
questions_js = open('js/data/questions.js', encoding='utf-8').read()
matcher_js = open('js/engine/matcher.js', encoding='utf-8').read()

print("Loaded files successfully:")
print("careers.js:", len(careers_js), "bytes")
print("questions.js:", len(questions_js), "bytes")
print("matcher.js:", len(matcher_js), "bytes")

# Extract CAREERS_DATABASE array
arr_match = re.search(r'window\.CAREERS_DATABASE\s*=\s*(\[.*?\]);', careers_js, flags=re.DOTALL)
if arr_match:
    clean_careers = arr_match.group(1)
    clean_careers = re.sub(r'//.*', '', clean_careers)
    clean_careers = re.sub(r'/\*.*?\*/', '', clean_careers, flags=re.DOTALL)
else:
    raise ValueError("Could not find window.CAREERS_DATABASE array")

def js_to_json(js_str):
    js_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', js_str)
    js_str = re.sub(r',\s*([}\]])', r'\1', js_str)
    return js_str

try:
    careers_data = json.loads(js_to_json(clean_careers))
    print(f"Parsed {len(careers_data)} careers successfully.")
except Exception as e:
    print("Error parsing careers JS:", e)
    raise e

def match_careers(stream, streamAnswers=None, extracurriculars=None, strengths=None, preferences=None, avoidances=None):
    if streamAnswers is None: streamAnswers = []
    if extracurriculars is None: extracurriculars = []
    if strengths is None: strengths = []
    if preferences is None: preferences = []
    if avoidances is None: avoidances = []

    tagSet = set(streamAnswers)
    extraSet = set(extracurriculars)
    strengthSet = set(strengths)
    prefSet = set(preferences)
    avoidSet = set(avoidances)

    hasBioSignal = ("genetics_dna" in tagSet or "human_anatomy" in tagSet or "microbiology" in tagSet or 
                    "biotech_genetics" in tagSet or "clinical_medicine" in tagSet or "medicine_interest" in tagSet or 
                    "biotech_interest" in tagSet or "bioinfo_interest" in tagSet or "nursing_interest" in tagSet or 
                    "dentistry_interest" in tagSet or "physio_interest" in tagSet or "public_health_interest" in tagSet or 
                    stream in ["pcb", "pcmb"])

    hasMathSignal = ("pure_maths" in tagSet or "applied_physics" in tagSet or "software_coding_interest" in tagSet or 
                     "ai_ml_interest" in tagSet or "data_science_interest" in tagSet or "actuarial_interest" in tagSet or 
                     "ca_accounting_interest" in tagSet or stream in ["pcm", "cs_maths", "pcmb"])

    hasArmyInterest = "defence_army_interest" in tagSet
    hasNavyInterest = "navy_interest" in tagSet
    hasAirForceInterest = "airforce_interest" in tagSet
    hasDefenceTechInterest = "defence_tech_interest" in tagSet
    hasExplicitDefenceInterest = ("defence_service_pref" in prefSet or hasArmyInterest or hasNavyInterest or hasAirForceInterest or hasDefenceTechInterest)

    hasPilotInterest = "pilot_interest" in tagSet or "aviation_pilot_pref" in prefSet
    hasAircraftMaintInterest = "aircraft_maint_interest" in tagSet
    hasAvionicsInterest = "avionics_interest" in tagSet
    hasGeneralAviationInterest = (hasPilotInterest or hasAircraftMaintInterest or hasAvionicsInterest)

    hasExplicitMusicInterest = "musician_singing_interest" in tagSet or "music_interest" in tagSet
    hasExplicitActingInterest = "acting_performance_interest" in tagSet or "acting_interest" in tagSet
    hasExplicitAthleteInterest = "sports_athlete_interest" in tagSet or "sports_coaching_interest" in tagSet
    hasExplicitTeachingInterest = ("teaching_interest" in tagSet or "maths_teaching_interest" in tagSet or 
                                  "cs_teaching_interest" in tagSet or "bio_teaching_interest" in tagSet or 
                                  "teaching_tutoring" in extraSet)

    scored = []
    for career in careers_data:
        cid = career['id']
        cat = career.get('category', '')
        streamComp = career.get('streamCompatibility', [])

        score = 0
        isStreamComp = (stream in streamComp) or ("all" in streamComp)

        if not isStreamComp:
            if cid in ["medicine", "dentistry", "nursing", "physiotherapy", "allied_health_lab"] and not hasBioSignal:
                score -= 100
            elif cid in ["aerospace", "aeronautical_eng", "mechanical", "civil_structural", "pure_science_maths", "actuarial_science"] and not hasMathSignal:
                score -= 100
            else:
                score -= 40
        else:
            score += 15

        # Explicit interest matches (+50)
        if cid == "cybersecurity" and ("cybersecurity_interest" in tagSet or "ethical_hacking" in tagSet): score += 50
        if cid == "ai_ml" and ("ai_ml_interest" in tagSet or "ai_python" in tagSet): score += 50
        if cid == "cs_software" and ("software_coding_interest" in tagSet or "software_coding" in tagSet): score += 50
        if cid == "data_science" and ("data_science_interest" in tagSet or "data_analysis" in tagSet): score += 50
        if cid == "medicine" and ("medicine_interest" in tagSet or "clinical_medicine" in tagSet): score += 50
        if cid == "ca_auditing" and "ca_accounting_interest" in tagSet: score += 50
        if cid == "corporate_law" and ("corporate_law_interest" in tagSet or "law_interest" in tagSet): score += 50
        if cid == "actor_performer" and hasExplicitActingInterest: score += 50
        if cid == "cinematographer_camera" and ("cinematography_camera_interest" in tagSet or "photography_video_interest" in tagSet or "camera_interest" in tagSet): score += 50
        if cid == "musician_singer" and hasExplicitMusicInterest: score += 50

        if cid == "defence_army" and hasArmyInterest: score += 50
        if cid == "defence_navy" and hasNavyInterest: score += 50
        if cid == "defence_airforce" and hasAirForceInterest: score += 50

        # Strengths & Preferences
        if "creativity_art" in prefSet and cat in ["Creative & Media", "Education"]: score += 15
        if "creativity" in strengthSet and (cat == "Creative & Media" or cid in ["ui_ux_design", "content_creation", "actor_performer", "film_director", "cinematographer_camera", "musician_singer"]): score += 10
        if "problem_solving" in strengthSet and cid in ["cs_software", "ai_ml", "cybersecurity", "mechanical", "aerospace"]: score += 10
        if "analytical_thinking" in strengthSet and cid in ["data_science", "financial_analyst", "ca_auditing"]: score += 10

        # Supporting Extracurriculars
        if "coding_clubs" in extraSet and cat == "Technology": score += 5
        if "art_drawing" in extraSet and cid in ["ui_ux_design", "applied_design_media"]: score += 5
        if "dance" in extraSet and cid == "actor_performer": score += 5
        if "music" in extraSet and cid == "musician_singer" and hasExplicitMusicInterest: score += 5
        if "ncc" in extraSet and cat == "Defence" and hasExplicitDefenceInterest: score += 5

        # Penalties
        if cat == "Defence" and not hasExplicitDefenceInterest: score -= 80
        if cid == "professional_athlete" and not hasExplicitAthleteInterest: score -= 60
        if cid == "musician_singer" and not hasExplicitMusicInterest and len(tagSet) > 0: score -= 50
        if cat == "Education" and not hasExplicitTeachingInterest: score -= 40
        if cid == "bioinformatics" and not hasBioSignal and "bioinfo_interest" not in tagSet: score -= 80
        if cid == "commercial_pilot" and not hasPilotInterest: score -= 80

        matchScore = 60
        if score > 0:
            matchScore = max(60, min(95, 60 + round(score * 0.4)))
        elif score < -50:
            matchScore = 35

        scored.append((cid, career['name'], matchScore))

    scored.sort(key=lambda x: x[2], reverse=True)
    return scored[:5]

# RUN ALL VERIFICATION SCENARIOS
print("\n" + "="*50)
print("RUNNING VERIFICATION TEST SCENARIOS")
print("="*50)

# Scenario 1: PCM + Cybersecurity interest
sc1 = match_careers("cs_maths", streamAnswers=["cybersecurity_interest", "software_coding_interest"])
print("\n[Scenario 1] CS/PCM + Cybersecurity Interest:")
for r in sc1: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert sc1[0][0] in ["cybersecurity", "cs_software"], f"Failed Sc1: got {sc1[0][0]}"
print("  [OK] PASS")

# Scenario 2: CS + Maths student without Bio interest -> Bioinformatics should NOT be #1
sc2 = match_careers("cs_maths", streamAnswers=["software_coding_interest", "ai_ml_interest"])
print("\n[Scenario 2] CS + Maths without Bio interest:")
for r in sc2: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert sc2[0][0] != "bioinformatics", "Failed Sc2: Bioinformatics is #1!"
print("  [OK] PASS")

# Scenario 3: PCB student + Medicine interest
sc3 = match_careers("pcb", streamAnswers=["medicine_interest", "clinical_medicine"])
print("\n[Scenario 3] PCB + Medicine Interest:")
for r in sc3: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert sc3[0][0] == "medicine", f"Failed Sc3: got {sc3[0][0]}"
print("  [OK] PASS")

# Scenario 4: Commerce + CA interest
sc4 = match_careers("commerce", streamAnswers=["ca_accounting_interest"])
print("\n[Scenario 4] Commerce + CA Interest:")
for r in sc4: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert sc4[0][0] == "ca_auditing", f"Failed Sc4: got {sc4[0][0]}"
print("  [OK] PASS")

# Scenario 5: Arts + Law interest
sc5 = match_careers("arts", streamAnswers=["law_interest"])
print("\n[Scenario 5] Arts + Law Interest:")
for r in sc5: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert sc5[0][0] == "corporate_law", f"Failed Sc5: got {sc5[0][0]}"
print("  [OK] PASS")

# Scenario 6: Arts/Vocational + Acting interest -> Acting #1
sc6 = match_careers("arts", streamAnswers=["acting_interest"])
print("\n[Scenario 6] Arts + Acting Interest:")
for r in sc6: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert sc6[0][0] == "actor_performer", f"Failed Sc6: got {sc6[0][0]}"
print("  [OK] PASS")

# Scenario 7: Vocational + Camera interest -> Cinematography #1
sc7 = match_careers("vocational", streamAnswers=["camera_interest"])
print("\n[Scenario 7] Vocational + Camera Interest:")
for r in sc7: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert sc7[0][0] == "cinematographer_camera", f"Failed Sc7: got {sc7[0][0]}"
print("  [OK] PASS")

# Scenario 8: Vocational without Defence/Pilot -> Army/Navy/Pilot should NOT rank #1
sc8 = match_careers("vocational", streamAnswers=["mechanical_machinery_interest"])
print("\n[Scenario 8] Vocational + Mechanical Interest (no Defence/Pilot):")
for r in sc8: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert sc8[0][0] not in ["defence_army", "defence_navy", "commercial_pilot"], f"Failed Sc8: got {sc8[0][0]}"
print("  [OK] PASS")

# Scenario 9: Single activity protection - NCC Alone (No defence interest)
sc9 = match_careers("pcm", streamAnswers=["software_coding_interest"], extracurriculars=["ncc"])
print("\n[Scenario 9] Single Signal: NCC alone without Defence Interest:")
for r in sc9: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert not any(c[0] in ["defence_army", "defence_navy", "defence_airforce"] for c in sc9), "Failed Sc9: Defence ranked in top 5 from NCC alone!"
print("  [OK] PASS")

# Scenario 10: PCM student + Acting interest -> Acting ranks #1
sc10 = match_careers("pcm", streamAnswers=["acting_interest"], extracurriculars=["dance", "art_drawing"], strengths=["creativity"])
print("\n[Scenario 10] PCM + Acting Interest:")
for r in sc10: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert sc10[0][0] == "actor_performer", f"Failed Sc10: got {sc10[0][0]}"
print("  [OK] PASS")

print("\n" + "="*50)
print("ALL VERIFICATION TEST SCENARIOS PASSED 100% SUCCESS!")
print("="*50)
