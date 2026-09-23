import json
import re

careers_js = open('js/data/careers.js', encoding='utf-8').read()
matcher_js = open('js/engine/matcher.js', encoding='utf-8').read()

arr_match = re.search(r'window\.CAREERS_DATABASE\s*=\s*(\[.*?\]);', careers_js, flags=re.DOTALL)
clean_careers = arr_match.group(1)
clean_careers = re.sub(r'//.*', '', clean_careers)
clean_careers = re.sub(r'/\*.*?\*/', '', clean_careers, flags=re.DOTALL)

def js_to_json(js_str):
    js_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', js_str)
    js_str = re.sub(r',\s*([}\]])', r'\1', js_str)
    return js_str

careers_data = json.loads(js_to_json(clean_careers))

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
    hasGeneralDefenceInterest = ("defence_service_pref" in prefSet or "ncc" in extraSet or 
                                 hasArmyInterest or hasNavyInterest or hasAirForceInterest or hasDefenceTechInterest)

    hasPilotInterest = "pilot_interest" in tagSet or "aviation_pilot_pref" in prefSet
    hasAircraftMaintInterest = "aircraft_maint_interest" in tagSet
    hasAvionicsInterest = "avionics_interest" in tagSet
    hasGeneralAviationInterest = (hasPilotInterest or hasAircraftMaintInterest or hasAvionicsInterest or "aviation_pilot_pref" in prefSet)

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
            elif cid in ["aerospace", "aeronautical_eng", "mechanical", "civil_structural", "pure_science_maths"] and not hasMathSignal:
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
        if cid == "actor_performer" and ("acting_performance_interest" in tagSet or "acting_interest" in tagSet): score += 50
        if cid == "cinematographer_camera" and ("cinematography_camera_interest" in tagSet or "photography_video_interest" in tagSet or "camera_interest" in tagSet): score += 50
        if cid == "musician_singer" and ("musician_singing_interest" in tagSet or "music_interest" in tagSet): score += 50
        if cid == "ui_ux_design" and ("design_uiux_interest" in tagSet or "ui_ux_interest" in tagSet): score += 50
        if cid == "film_director" and ("film_directing_interest" in tagSet or "filmmaking_interest" in tagSet): score += 50

        # Preferences & Strengths
        if "creativity_art" in prefSet and cat in ["Creative & Media", "Education"]: score += 15
        if "creativity" in strengthSet and (cat == "Creative & Media" or cid in ["ui_ux_design", "content_creation", "actor_performer", "film_director", "cinematographer_camera", "musician_singer"]): score += 10
        if "problem_solving" in strengthSet and cid in ["cs_software", "ai_ml", "cybersecurity"]: score += 10
        if "analytical_thinking" in strengthSet and cid in ["data_science", "financial_analyst"]: score += 10

        # Extracurriculars
        if "art_drawing" in extraSet and cid in ["ui_ux_design", "applied_design_media"]: score += 5
        if "dance" in extraSet and cid == "actor_performer": score += 5
        if "music" in extraSet and cid == "musician_singer": score += 5
        if "ncc" in extraSet and cat == "Defence": score += 5

        # Penalties
        if cid == "bioinformatics" and not hasBioSignal and "bioinfo_interest" not in tagSet: score -= 80
        if cid == "commercial_pilot" and not hasPilotInterest: score -= 80
        if cat == "Defence" and not hasGeneralDefenceInterest: score -= 80

        matchScore = 60
        if score > 0:
            matchScore = max(60, min(95, 60 + round(score * 0.4)))
        elif score < -50:
            matchScore = 35

        scored.append((cid, career['name'], matchScore))

    scored.sort(key=lambda x: x[2], reverse=True)
    return scored[:5]

# TEST SCENARIOS
print("\n1. PCM + Programming + Logic:")
sc1 = match_careers("pcm", streamAnswers=["software_coding_interest"], strengths=["problem_solving"])
for r in sc1: print(f"   #{r[0]}: {r[1]} ({r[2]}%)")

print("\n2. PCM + Creativity + Art + Dance/Music + Acting Interest:")
sc2 = match_careers("pcm", streamAnswers=["acting_interest"], extracurriculars=["art_drawing", "dance", "music"], strengths=["creativity"], preferences=["creativity_art"])
for r in sc2: print(f"   #{r[0]}: {r[1]} ({r[2]}%)")

print("\n3. CS + Cybersecurity Interest:")
sc3 = match_careers("cs_maths", streamAnswers=["cybersecurity_interest"])
for r in sc3: print(f"   #{r[0]}: {r[1]} ({r[2]}%)")

print("\n4. PCB + Biology + Healthcare:")
sc4 = match_careers("pcb", streamAnswers=["medicine_interest", "clinical_medicine"])
for r in sc4: print(f"   #{r[0]}: {r[1]} ({r[2]}%)")

print("\n5. Commerce + Accounting + Finance:")
sc5 = match_careers("commerce", streamAnswers=["ca_accounting_interest", "finance_stock_interest"])
for r in sc5: print(f"   #{r[0]}: {r[1]} ({r[2]}%)")

print("\n6. NCC + Leadership + Defence Interest:")
sc6 = match_careers("pcm", streamAnswers=["defence_army_interest"], extracurriculars=["ncc"], strengths=["leadership", "discipline"])
for r in sc6: print(f"   #{r[0]}: {r[1]} ({r[2]}%)")

print("\n7. SINGLE SIGNAL TEST: NCC ALONE (NO Defence Interest):")
sc7 = match_careers("pcm", streamAnswers=["software_coding_interest"], extracurriculars=["ncc"], strengths=["problem_solving"])
for r in sc7: print(f"   #{r[0]}: {r[1]} ({r[2]}%)")

print("\n8. SINGLE SIGNAL TEST: Sports Alone (NO Athlete Interest):")
sc8 = match_careers("pcm", streamAnswers=["software_coding_interest"], extracurriculars=["sports"], strengths=["teamwork"])
for r in sc8: print(f"   #{r[0]}: {r[1]} ({r[2]}%)")

print("\n9. SINGLE SIGNAL TEST: Music Alone (NO Musician Interest):")
sc9 = match_careers("pcm", streamAnswers=["software_coding_interest"], extracurriculars=["music"], strengths=["creativity"])
for r in sc9: print(f"   #{r[0]}: {r[1]} ({r[2]}%)")

print("\n10. SINGLE SIGNAL TEST: Helping Others Alone (NO Teaching/Medical Interest):")
sc10 = match_careers("pcm", streamAnswers=["software_coding_interest"], preferences=["helping_others"])
for r in sc10: print(f"   #{r[0]}: {r[1]} ({r[2]}%)")
