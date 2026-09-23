import json
import re

careers_js = open('js/data/careers.js', encoding='utf-8').read()

arr_match = re.search(r'window\.CAREERS_DATABASE\s*=\s*(\[.*?\]);', careers_js, flags=re.DOTALL)
clean_careers = arr_match.group(1)
clean_careers = re.sub(r'//.*', '', clean_careers)
clean_careers = re.sub(r'/\*.*?\*/', '', clean_careers, flags=re.DOTALL)

def js_to_json(js_str):
    js_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', js_str)
    js_str = re.sub(r',\s*([}\]])', r'\1', js_str)
    return js_str

careers_data = json.loads(js_to_json(clean_careers))

# Update creative/performing/media/law/civil services streamCompatibility to ["all"]
universal_careers = [
    "actor_performer", "film_director", "cinematographer_camera", "musician_singer",
    "content_creation", "ui_ux_design", "applied_design_media", "journalism_media",
    "corporate_law", "civil_services", "public_policy", "psychology_counselling",
    "marketing_digital", "fintech_entrepreneurship", "edtech_designer"
]

for c in careers_data:
    if c['id'] in universal_careers:
        c['streamCompatibility'] = ["all"]

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
    
    # EXPLICIT Defence Interest (NCC alone does NOT trigger defence interest!)
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
        reasons = []

        if not isStreamComp:
            if cid in ["medicine", "dentistry", "nursing", "physiotherapy", "allied_health_lab"] and not hasBioSignal:
                score -= 100
            elif cid in ["aerospace", "aeronautical_eng", "mechanical", "civil_structural", "pure_science_maths", "actuarial_science"] and not hasMathSignal:
                score -= 100
            else:
                score -= 40
        else:
            score += 15
            reasons.append(f"Compatible with your {stream.upper()} Class 12 stream")

        # Explicit interest matches (+50)
        hasExplicitMatch = False
        if cid == "cybersecurity" and ("cybersecurity_interest" in tagSet or "ethical_hacking" in tagSet):
            score += 50; hasExplicitMatch = True; reasons.append("Selected Cybersecurity & Ethical Hacking as a primary interest")
        if cid == "ai_ml" and ("ai_ml_interest" in tagSet or "ai_python" in tagSet):
            score += 50; hasExplicitMatch = True; reasons.append("Selected Artificial Intelligence & Machine Learning interest")
        if cid == "cs_software" and ("software_coding_interest" in tagSet or "software_coding" in tagSet):
            score += 50; hasExplicitMatch = True; reasons.append("Selected Software Engineering & Coding interest")
        if cid == "data_science" and ("data_science_interest" in tagSet or "data_analysis" in tagSet):
            score += 50; hasExplicitMatch = True; reasons.append("Selected Data Science & Analytics interest")
        if cid == "medicine" and ("medicine_interest" in tagSet or "clinical_medicine" in tagSet):
            score += 50; hasExplicitMatch = True; reasons.append("Selected Medicine & Clinical Surgery (MBBS) interest")
        if cid == "ca_auditing" and "ca_accounting_interest" in tagSet:
            score += 50; hasExplicitMatch = True; reasons.append("Selected Chartered Accountancy & Auditing interest")
        if cid == "corporate_law" and ("corporate_law_interest" in tagSet or "law_interest" in tagSet):
            score += 50; hasExplicitMatch = True; reasons.append("Selected Law & Legal Advocacy interest")
        if cid == "actor_performer" and hasExplicitActingInterest:
            score += 50; hasExplicitMatch = True; reasons.append("Selected Acting, Theatre & Performance Arts interest")
        if cid == "cinematographer_camera" and ("cinematography_camera_interest" in tagSet or "photography_video_interest" in tagSet or "camera_interest" in tagSet):
            score += 50; hasExplicitMatch = True; reasons.append("Selected Cinematography, Photography & Camera Work interest")
        if cid == "musician_singer" and hasExplicitMusicInterest:
            score += 50; hasExplicitMatch = True; reasons.append("Selected Music Performance, Singing & Sound Production interest")
        if cid == "ui_ux_design" and ("design_uiux_interest" in tagSet or "ui_ux_interest" in tagSet):
            score += 50; hasExplicitMatch = True; reasons.append("Selected UI/UX & Product Design interest")
        if cid == "film_director" and ("film_directing_interest" in tagSet or "filmmaking_interest" in tagSet):
            score += 50; hasExplicitMatch = True; reasons.append("Selected Film Direction & Screenwriting interest")

        if cid == "defence_army" and hasArmyInterest:
            score += 50; hasExplicitMatch = True; reasons.append("Selected Indian Army Combat & Command Officer interest")
        if cid == "defence_navy" and hasNavyInterest:
            score += 50; hasExplicitMatch = True; reasons.append("Selected Indian Navy Maritime Command Officer interest")
        if cid == "defence_airforce" and hasAirForceInterest:
            score += 50; hasExplicitMatch = True; reasons.append("Selected Indian Air Force Flying Officer interest")

        # Preferences & Strengths (+10 to +15)
        if "creativity_art" in prefSet and cat in ["Creative & Media", "Education"]:
            score += 15; reasons.append("Matches preference for creative design & expression")
        if "creativity" in strengthSet and (cat == "Creative & Media" or cid in ["ui_ux_design", "content_creation", "actor_performer", "film_director", "cinematographer_camera", "musician_singer"]):
            score += 10; reasons.append("Supported by your natural Strength in Creativity & Originality")
        if "problem_solving" in strengthSet and cid in ["cs_software", "ai_ml", "cybersecurity", "mechanical", "aerospace"]:
            score += 10; reasons.append("Supported by your natural Strength in Problem Solving")
        if "analytical_thinking" in strengthSet and cid in ["data_science", "financial_analyst", "ca_auditing", "pure_science_maths"]:
            score += 10; reasons.append("Supported by your natural Strength in Analytical Thinking")

        # Supporting Extracurriculars (+5)
        if "coding_clubs" in extraSet and cat == "Technology":
            score += 5; reasons.append("Supported by Coding Club / Hackathon participation")
        if "art_drawing" in extraSet and cid in ["ui_ux_design", "applied_design_media"]:
            score += 5; reasons.append("Supported by Art & Sketching activity")
        if "dance" in extraSet and cid == "actor_performer":
            score += 5; reasons.append("Supported by Dance & Performing Arts activity")
        if "music" in extraSet and cid == "musician_singer" and hasExplicitMusicInterest:
            score += 5; reasons.append("Supported by Music & Singing activity")
        if "ncc" in extraSet and cat == "Defence" and hasExplicitDefenceInterest:
            score += 5; reasons.append("Supported by NCC Cadet leadership & discipline")

        # Penalties for single-signal traps & mismatches
        if cat == "Defence" and not hasExplicitDefenceInterest:
            score -= 80
        if cid == "professional_athlete" and not hasExplicitAthleteInterest:
            score -= 60
        if cid == "musician_singer" and not hasExplicitMusicInterest and len(tagSet) > 0:
            score -= 50
        if cat == "Education" and not hasExplicitTeachingInterest:
            score -= 40
        if cid == "commercial_pilot" and not hasPilotInterest:
            score -= 80
        if cid == "bioinformatics" and not hasBioSignal and "bioinfo_interest" not in tagSet:
            score -= 80

        matchScore = 60
        if score > 0:
            matchScore = max(60, min(95, 60 + round(score * 0.4)))
        elif score < -50:
            matchScore = 35

        scored.append((cid, career['name'], matchScore, reasons))

    scored.sort(key=lambda x: x[2], reverse=True)
    return scored[:5]

print("\n==================================================")
print("TESTING ALL PROMPT SCENARIOS WITH UPDATED ENGINE")
print("==================================================")

print("\n1. PCM + Programming + Logic:")
sc1 = match_careers("pcm", streamAnswers=["software_coding_interest"], strengths=["problem_solving"])
for r in sc1: print(f"   #{r[0]}: {r[1]} ({r[2]}%) -> {r[3][:2]}")

print("\n2. PCM + Creativity + Art + Dance/Music + Acting Interest:")
sc2 = match_careers("pcm", streamAnswers=["acting_interest"], extracurriculars=["art_drawing", "dance", "music"], strengths=["creativity"], preferences=["creativity_art"])
for r in sc2: print(f"   #{r[0]}: {r[1]} ({r[2]}%) -> {r[3][:2]}")

print("\n3. CS + Cybersecurity Interest:")
sc3 = match_careers("cs_maths", streamAnswers=["cybersecurity_interest"])
for r in sc3: print(f"   #{r[0]}: {r[1]} ({r[2]}%) -> {r[3][:2]}")

print("\n4. PCB + Biology + Healthcare:")
sc4 = match_careers("pcb", streamAnswers=["medicine_interest", "clinical_medicine"])
for r in sc4: print(f"   #{r[0]}: {r[1]} ({r[2]}%) -> {r[3][:2]}")

print("\n5. Commerce + Accounting + Finance:")
sc5 = match_careers("commerce", streamAnswers=["ca_accounting_interest", "finance_stock_interest"])
for r in sc5: print(f"   #{r[0]}: {r[1]} ({r[2]}%) -> {r[3][:2]}")

print("\n6. NCC + Leadership + Defence Interest:")
sc6 = match_careers("pcm", streamAnswers=["defence_army_interest"], extracurriculars=["ncc"], strengths=["leadership", "discipline"])
for r in sc6: print(f"   #{r[0]}: {r[1]} ({r[2]}%) -> {r[3][:2]}")

print("\n7. SINGLE SIGNAL TEST: NCC ALONE (NO Defence Interest):")
sc7 = match_careers("pcm", streamAnswers=["software_coding_interest"], extracurriculars=["ncc"], strengths=["problem_solving"])
for r in sc7: print(f"   #{r[0]}: {r[1]} ({r[2]}%) -> {r[3][:2]}")

print("\n8. SINGLE SIGNAL TEST: Sports Alone (NO Athlete Interest):")
sc8 = match_careers("pcm", streamAnswers=["software_coding_interest"], extracurriculars=["sports"], strengths=["teamwork"])
for r in sc8: print(f"   #{r[0]}: {r[1]} ({r[2]}%) -> {r[3][:2]}")

print("\n9. SINGLE SIGNAL TEST: Music Alone (NO Musician Interest):")
sc9 = match_careers("pcm", streamAnswers=["software_coding_interest"], extracurriculars=["music"], strengths=["creativity"])
for r in sc9: print(f"   #{r[0]}: {r[1]} ({r[2]}%) -> {r[3][:2]}")

print("\n10. SINGLE SIGNAL TEST: Helping Others Alone (NO Teaching/Medical Interest):")
sc10 = match_careers("pcm", streamAnswers=["software_coding_interest"], preferences=["helping_others"])
for r in sc10: print(f"   #{r[0]}: {r[1]} ({r[2]}%) -> {r[3][:2]}")
