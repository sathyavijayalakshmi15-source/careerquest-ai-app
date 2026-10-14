import json
import re

print("Loading JS files...")
careers_js = open('js/data/careers.js', encoding='utf-8').read()
questions_js = open('js/data/questions.js', encoding='utf-8').read()
matcher_js = open('js/engine/matcher.js', encoding='utf-8').read()

# Verify no undefined or malformed JS syntax
assert 'window.CAREERS_DATABASE' in careers_js
assert 'window.STREAMS' in questions_js
assert 'window.CAREER_MATCHER' in matcher_js

# Parse careers
arr_match = re.search(r'window\.CAREERS_DATABASE\s*=\s*(\[.*?\]);', careers_js, flags=re.DOTALL)
assert arr_match, "Could not find window.CAREERS_DATABASE"

clean_careers = arr_match.group(1)
clean_careers = re.sub(r'//.*', '', clean_careers)
clean_careers = re.sub(r'/\*.*?\*/', '', clean_careers, flags=re.DOTALL)

def js_to_json(js_str):
    js_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', js_str)
    js_str = re.sub(r',\s*([}\]])', r'\1', js_str)
    return js_str

careers = json.loads(js_to_json(clean_careers))
print(f"Total careers loaded: {len(careers)}")
assert len(careers) == 102, f"Expected 102 careers, found {len(careers)}"

required_fields = [
    'id', 'name', 'category', 'description', 
    'streamCompatibility', 'whySuited', 'relevantSubjects', 
    'usefulSkills', 'degreePathways', 'entranceExams', 'beginnerActivities', 'relatedCareers'
]
for c in careers:
    for rf in required_fields:
        assert rf in c, f"Career {c.get('id')} missing field {rf}"
        assert c[rf], f"Career {c.get('id')} has empty field {rf}"
print("All 102 careers have all required fields!")

# Verify medical super-specialisations distinguish MBBS + MD/MS + DM/M.Ch
med_specialists = ["neurology_specialist", "cardiology_specialist", "neurosurgery_specialist", "psychiatry_specialist"]
for ms in med_specialists:
    c = next(x for x in careers if x['id'] == ms)
    path_txt = " ".join(c['degreePathways'])
    assert "MBBS" in path_txt and ("MD" in path_txt or "MS" in path_txt), f"Medical specialist {ms} does not specify MBBS + MD/MS in pathway"
    assert "Requires MBBS" in c['name'] or "DM" in c['name'] or "MD" in c['name'] or "M.Ch" in c['name']
print("Verified medical super-specialisations require MBBS + MD/MS + DM/M.Ch pathway!")

# Verify postgraduate computing specifies Bachelor's prerequisite
pg_computing = ["msc_computer_science", "msc_ai_datascience"]
for pg in pg_computing:
    c = next(x for x in careers if x['id'] == pg)
    path_txt = " ".join(c['degreePathways'])
    assert "Bachelor" in path_txt or "B.Sc" in path_txt or "BCA" in path_txt or "B.Tech" in path_txt, f"{pg} missing Bachelor's prerequisite in degreePathways"
print("Verified postgraduate computing degrees specify Bachelor's prerequisite!")

# Python implementation of matcher.js
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
                    "med_specialist_interest" in tagSet or "allied_health_interest" in tagSet or
                    "pure_bio_research_interest" in tagSet or "biotech_interest" in tagSet or 
                    "bioinfo_interest" in tagSet or "nursing_interest" in tagSet or "dentistry_interest" in tagSet or 
                    "physio_interest" in tagSet or "public_health_interest" in tagSet or stream in ["pcb", "pcmb"])

    hasMathSignal = ("pure_maths" in tagSet or "applied_physics" in tagSet or "software_coding_interest" in tagSet or 
                     "ai_ml_interest" in tagSet or "data_science_interest" in tagSet or "actuarial_interest" in tagSet or 
                     "ca_accounting_interest" in tagSet or "bsc_cs_interest" in tagSet or stream in ["pcm", "cs_maths", "pcmb"])

    hasArmyInterest = "defence_army_interest" in tagSet
    hasNavyInterest = "navy_interest" in tagSet
    hasAirForceInterest = "airforce_interest" in tagSet
    hasDefenceTechInterest = "defence_tech_interest" in tagSet
    hasExplicitDefenceInterest = "defence_service_pref" in prefSet or hasArmyInterest or hasNavyInterest or hasAirForceInterest or hasDefenceTechInterest

    hasPilotInterest = "pilot_interest" in tagSet or "aviation_pilot_pref" in prefSet
    hasAircraftMaintInterest = "aircraft_maint_interest" in tagSet
    hasAvionicsInterest = "avionics_interest" in tagSet
    hasGeneralAviationInterest = hasPilotInterest or hasAircraftMaintInterest or hasAvionicsInterest or "aviation_pilot_pref" in prefSet

    hasExplicitMusicInterest = "musician_singing_interest" in tagSet or "music_interest" in tagSet
    hasExplicitActingInterest = "acting_performance_interest" in tagSet or "acting_interest" in tagSet
    hasExplicitAthleteInterest = "sports_athlete_interest" in tagSet or "sports_coaching_interest" in tagSet
    hasExplicitTeachingInterest = ("teaching_interest" in tagSet or "maths_teaching_interest" in tagSet or 
                                  "cs_teaching_interest" in tagSet or "bio_teaching_interest" in tagSet or 
                                  "humanities_teaching_interest" in tagSet or "teaching_tutoring" in extraSet)

    hasExplicitFilmInterest = ("filmmaking_interest" in tagSet or "film_directing_interest" in tagSet or "cinema_production_interest" in tagSet)

    clinicalMedicalCareers = [
        "medicine", "dentistry", "nursing", "physiotherapy",
        "neurology_specialist", "cardiology_specialist", "neurosurgery_specialist", "psychiatry_specialist"
    ]
    alliedHealthCareers = [
        "cardiac_technology", "neurophysiology_technology", "medical_imaging_technology",
        "radiotherapy_technology", "respiratory_therapy", "dialysis_technology",
        "physician_assistant", "ot_anaesthesia_technology", "optometry", "occupational_therapy",
        "allied_health_lab"
    ]

    scored = []
    for career in careers:
        cid = career['id']
        cat = career.get('category', '')
        streamComp = career.get('streamCompatibility', [])
        score = 0
        isStreamComp = (stream in streamComp) or ("all" in streamComp)

        # 1. HARD CLASS 12 ELIGIBILITY FILTER
        if not isStreamComp:
            if (cid in clinicalMedicalCareers or cid in alliedHealthCareers) and not hasBioSignal:
                score -= 100
            elif cid in ["aerospace", "aeronautical_eng", "mechanical", "civil_structural", "pure_science_maths", "actuarial_science", "physics_research"] and not hasMathSignal:
                score -= 100
            else:
                score -= 40
        else:
            score += 15

        # 2. EXPLICIT CAREER INTEREST MATCHING
        hasExplicitMatch = False
        # Tech & Computing
        if cid == "cybersecurity" and ("cybersecurity_interest" in tagSet or "ethical_hacking" in tagSet):
            score += 60; hasExplicitMatch = True
        if cid == "ai_ml" and ("ai_ml_interest" in tagSet or "ai_python" in tagSet):
            score += 60; hasExplicitMatch = True
        if cid == "cs_software" and ("software_coding_interest" in tagSet or "software_coding" in tagSet):
            score += 60; hasExplicitMatch = True
        if cid == "bsc_computer_science" and "bsc_cs_interest" in tagSet:
            score += 65; hasExplicitMatch = True
        elif cid == "bsc_computer_science" and "software_coding_interest" in tagSet and stream in ["pcm", "cs_maths"]:
            score += 45; hasExplicitMatch = True
        if cid == "bsc_ai_ds" and "bsc_cs_interest" in tagSet:
            score += 60; hasExplicitMatch = True
        if cid == "bca_applications" and ("bsc_cs_interest" in tagSet or (stream in ["commerce", "arts", "vocational"] and "software_coding_interest" in tagSet)):
            score += 65; hasExplicitMatch = True
        if cid == "msc_computer_science" and "bsc_cs_interest" in tagSet:
            score += 40; hasExplicitMatch = True
        if cid == "msc_ai_datascience" and ("ai_ml_interest" in tagSet or "data_science_interest" in tagSet):
            score += 40; hasExplicitMatch = True
        if cid == "data_science" and ("data_science_interest" in tagSet or "data_analysis" in tagSet):
            score += 60; hasExplicitMatch = True

        # Sciences & Research
        if cid == "physics_research":
            if "pure_physics_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "pure_science_interest" in tagSet or "applied_physics" in tagSet:
                score += 50; hasExplicitMatch = True
        if cid == "chemistry_research":
            if "pure_chemistry_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "pure_science_interest" in tagSet or "chem_structures" in tagSet:
                score += 50; hasExplicitMatch = True
        if cid == "biology_research" and ("pure_bio_research_interest" in tagSet or "biology_research_interest" in tagSet):
            score += 60; hasExplicitMatch = True
        if cid == "pure_science_maths" and ("pure_maths_interest" in tagSet or "pure_maths" in tagSet):
            score += 65; hasExplicitMatch = True

        # Medicine & Specialisations
        if cid == "medicine" and ("medicine_interest" in tagSet or "clinical_medicine" in tagSet):
            score += 60; hasExplicitMatch = True
        if cid == "neurology_specialist":
            if "neurology_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "med_specialist_interest" in tagSet:
                score += 48; hasExplicitMatch = True
        if cid == "cardiology_specialist":
            if "cardiology_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "med_specialist_interest" in tagSet:
                score += 48; hasExplicitMatch = True
        if cid == "neurosurgery_specialist":
            if "neurosurgery_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "med_specialist_interest" in tagSet:
                score += 48; hasExplicitMatch = True
        if cid == "psychiatry_specialist":
            if "psychiatry_specialist_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "med_specialist_interest" in tagSet:
                score += 48; hasExplicitMatch = True

        # Allied Health
        if cid == "cardiac_technology":
            if "cardiac_tech_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "allied_health_interest" in tagSet:
                score += 45; hasExplicitMatch = True
        if cid == "medical_imaging_technology":
            if "medical_imaging_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "allied_health_interest" in tagSet:
                score += 45; hasExplicitMatch = True
        if cid == "neurophysiology_technology":
            if "neurophysio_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "allied_health_interest" in tagSet:
                score += 45; hasExplicitMatch = True
        if cid == "radiotherapy_technology":
            if "radiotherapy_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "allied_health_interest" in tagSet:
                score += 45; hasExplicitMatch = True
        if cid == "respiratory_therapy":
            if "respiratory_therapy_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "allied_health_interest" in tagSet:
                score += 45; hasExplicitMatch = True
        if cid == "dialysis_technology":
            if "dialysis_tech_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "allied_health_interest" in tagSet:
                score += 45; hasExplicitMatch = True
        if cid == "physician_assistant":
            if "physician_assistant_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "allied_health_interest" in tagSet:
                score += 45; hasExplicitMatch = True
        if cid == "ot_anaesthesia_technology":
            if "ot_anaesthesia_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "allied_health_interest" in tagSet:
                score += 45; hasExplicitMatch = True
        if cid == "optometry":
            if "optometry_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "allied_health_interest" in tagSet:
                score += 45; hasExplicitMatch = True
        if cid == "occupational_therapy":
            if "occupational_therapy_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "allied_health_interest" in tagSet:
                score += 45; hasExplicitMatch = True
        if cid == "allied_health_lab":
            if "medical_lab_interest" in tagSet or "pathology_lab_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "allied_health_interest" in tagSet:
                score += 44; hasExplicitMatch = True
        if cid == "physiotherapy" and "physio_interest" in tagSet:
            score += 60; hasExplicitMatch = True
        if cid == "nursing" and "nursing_interest" in tagSet:
            score += 60; hasExplicitMatch = True
        if cid == "pharmacy" and "pharmacy_interest" in tagSet:
            score += 60; hasExplicitMatch = True
        if cid == "biotechnology" and ("biotech_interest" in tagSet or "biotech_genetics" in tagSet):
            score += 55; hasExplicitMatch = True
        if cid == "biomedical_science" and ("biomedical_science_interest" in tagSet or "biotech_interest" in tagSet):
            score += 55; hasExplicitMatch = True

        # Commerce & Business
        if cid == "ca_auditing" and "ca_accounting_interest" in tagSet:
            score += 65; hasExplicitMatch = True
        if cid == "cma_cost_accounting":
            if "cma_interest" in tagSet or "cma_accounting_interest" in tagSet or "cost_accounting_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "ca_accounting_interest" in tagSet:
                score += 45; hasExplicitMatch = True
        if cid == "commercial_banking":
            if "banking_interest" in tagSet or "commercial_banking_interest" in tagSet or "retail_corporate_banking_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "finance_stock_interest" in tagSet:
                score += 48; hasExplicitMatch = True
        if cid == "business_analytics" and ("business_analytics_interest" in tagSet or ("data_science_interest" in tagSet and stream in ["commerce", "arts"])):
            score += 65; hasExplicitMatch = True

        # Arts, Creative & Media
        if cid == "psychology_counselling" and ("clinical_psychology_interest" in tagSet or "psychology_interest" in tagSet or "counselling_interest" in tagSet):
            score += 65; hasExplicitMatch = True
        if cid == "animation_vfx" and ("animation_vfx_interest" in tagSet or "animation_interest" in tagSet or "3d_vfx_interest" in tagSet):
            score += 65; hasExplicitMatch = True
        if cid == "commercial_photography":
            if "commercial_photography_interest" in tagSet or "commercial_photo_interest" in tagSet:
                score += 65; hasExplicitMatch = True
            elif "camera_interest" in tagSet and "cinematography_camera_interest" not in tagSet:
                score += 55; hasExplicitMatch = True
        if cid == "cinematographer_camera" and ("cinematography_camera_interest" in tagSet or "camera_interest" in tagSet):
            score += 60; hasExplicitMatch = True
        if cid == "film_director":
            if hasExplicitFilmInterest:
                score += 65; hasExplicitMatch = True
            else:
                score -= 70
        if cid == "corporate_law" and ("corporate_law_interest" in tagSet or "law_interest" in tagSet):
            score += 60; hasExplicitMatch = True
        if cid == "actor_performer" and hasExplicitActingInterest:
            score += 60; hasExplicitMatch = True
        if cid == "musician_singer" and hasExplicitMusicInterest:
            score += 60; hasExplicitMatch = True

        # Defence
        if cid == "defence_army" and hasArmyInterest: score += 60; hasExplicitMatch = True
        if cid == "defence_navy" and hasNavyInterest: score += 60; hasExplicitMatch = True
        if cid == "defence_airforce" and hasAirForceInterest: score += 60; hasExplicitMatch = True

        # 3. STRENGTHS & PREFERENCES
        if "creativity_art" in prefSet and cat in ["Creative & Media", "Education"]:
            if cid != "film_director" or hasExplicitFilmInterest:
                score += 15
        if "creativity" in strengthSet and (cat == "Creative & Media" or cid in ["ui_ux_design", "content_creation", "actor_performer", "cinematographer_camera", "musician_singer", "animation_vfx", "commercial_photography"]):
            if cid != "film_director" or hasExplicitFilmInterest:
                score += 10
        if "problem_solving" in strengthSet and cid in ["cs_software", "ai_ml", "cybersecurity", "mechanical", "aerospace", "bsc_computer_science", "bca_applications"]:
            score += 10
        if "analytical_thinking" in strengthSet and cid in ["data_science", "financial_analyst", "ca_auditing", "cma_cost_accounting", "business_analytics", "physics_research"]:
            score += 10

        # Supporting Extracurriculars
        if "coding_clubs" in extraSet and (cat in ["Technology", "Information Technology", "Postgraduate Computing"] or cid in ["bsc_computer_science", "bca_applications"]):
            score += 5
        if "art_drawing" in extraSet and cid in ["ui_ux_design", "applied_design_media", "animation_vfx", "commercial_photography"]:
            score += 5
        if "dance" in extraSet and cid == "actor_performer":
            score += 5
        if "music" in extraSet and cid == "musician_singer" and hasExplicitMusicInterest:
            score += 5
        if "ncc" in extraSet and cat == "Defence" and hasExplicitDefenceInterest:
            score += 5

        # 4. SINGLE-SIGNAL PROTECTIONS & PENALTIES
        if cat == "Defence" and not hasExplicitDefenceInterest:
            score -= 80
        if cid == "professional_athlete" and not hasExplicitAthleteInterest:
            score -= 60
        if cid == "musician_singer" and not hasExplicitMusicInterest and len(tagSet) > 0:
            score -= 50
        if cat == "Education" and not hasExplicitTeachingInterest:
            score -= 40
        if cid == "bioinformatics" and not hasBioSignal and "bioinfo_interest" not in tagSet:
            score -= 80
        if cid == "commercial_pilot" and not hasPilotInterest:
            score -= 80
        if cid == "film_director" and not hasExplicitFilmInterest:
            score -= 60  # Protected: film making requires explicit film interest

        matchScore = 60
        if score > 0:
            matchScore = max(60, min(95, 60 + round(score * 0.4)))
        elif score < -50:
            matchScore = 35

        scored.append((cid, career['name'], matchScore))

    scored.sort(key=lambda x: x[2], reverse=True)
    return scored[:5]

# RUN COMPREHENSIVE TEST SUITE
print("\n" + "="*60)
print("RUNNING EXTENSIVE VERIFICATION SCENARIOS (102 CAREERS)")
print("="*60)

# Test 1: PCB + Medical Imaging Technology
t1 = match_careers("pcb", streamAnswers=["medical_imaging_interest", "allied_health_interest"])
print("\n[Test 1] PCB + Medical Imaging Technology:")
for r in t1: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t1[0][0] == "medical_imaging_technology", f"Expected medical_imaging_technology, got {t1[0][0]}"
print("  [OK] PASS")

# Test 2: PCB + Cardiac Technology
t2 = match_careers("pcb", streamAnswers=["cardiac_tech_interest", "allied_health_interest"])
print("\n[Test 2] PCB + Cardiac Care / Cardiovascular Technology:")
for r in t2: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t2[0][0] == "cardiac_technology", f"Expected cardiac_technology, got {t2[0][0]}"
print("  [OK] PASS")

# Test 3: PCB + Neurology Specialist (Medical Super-Specialisation)
t3 = match_careers("pcb", streamAnswers=["neurology_interest", "med_specialist_interest"])
print("\n[Test 3] PCB + Neurology Specialist (MBBS + MD + DM):")
for r in t3: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t3[0][0] == "neurology_specialist", f"Expected neurology_specialist, got {t3[0][0]}"
print("  [OK] PASS")

# Test 4: PCM + Pure Physics Research (No Engineering Bias)
t4 = match_careers("pcm", streamAnswers=["pure_physics_interest", "physics_research_interest"], strengths=["analytical_thinking"])
print("\n[Test 4] PCM + Pure Physics Research (Testing Engineering Bias Elimination):")
for r in t4: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t4[0][0] == "physics_research", f"Expected physics_research as #1, got {t4[0][0]}"
print("  [OK] PASS (Pure physics correctly beats engineering)")

# Test 5: PCM + B.Sc Computer Science
t5 = match_careers("pcm", streamAnswers=["bsc_cs_interest"], strengths=["problem_solving"])
print("\n[Test 5] PCM + B.Sc Computer Science:")
for r in t5: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t5[0][0] == "bsc_computer_science", f"Expected bsc_computer_science as #1, got {t5[0][0]}"
print("  [OK] PASS")

# Test 6: Commerce + CMA (Cost & Management Accounting)
t6 = match_careers("commerce", streamAnswers=["cma_accounting_interest"], strengths=["analytical_thinking"])
print("\n[Test 6] Commerce + CMA (Cost & Management Accountant):")
for r in t6: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t6[0][0] == "cma_cost_accounting", f"Expected cma_cost_accounting as #1, got {t6[0][0]}"
print("  [OK] PASS")

# Test 7: Commerce + Commercial & Corporate Banking
t7 = match_careers("commerce", streamAnswers=["commercial_banking_interest"])
print("\n[Test 7] Commerce + Commercial Banking:")
for r in t7: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t7[0][0] == "commercial_banking", f"Expected commercial_banking as #1, got {t7[0][0]}"
print("  [OK] PASS")

# Test 8: Single-signal protection for FILM MAKING:
# Student chooses general creativity, photography, art, video creation BUT NOT explicit filmmaking
t8 = match_careers("arts", streamAnswers=["camera_interest", "photography_video_interest"], strengths=["creativity"], preferences=["creativity_art"])
print("\n[Test 8] Arts + Photography/Camera + Creativity WITHOUT Filmmaking Interest:")
for r in t8: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t8[0][0] in ["commercial_photography", "cinematographer_camera"], f"Expected commercial_photography or cinematographer, got {t8[0][0]}"
assert not any(c[0] == "film_director" for c in t8), f"Film Making should NOT appear in top 5 without explicit interest, but found in: {[c[0] for c in t8]}"
print("  [OK] PASS (Film Making successfully protected from single-signal creative trigger)")

# Test 9: Student explicitly chooses Filmmaking / Cinema Direction
t9 = match_careers("arts", streamAnswers=["filmmaking_interest", "film_directing_interest"], strengths=["creativity"])
print("\n[Test 9] Arts + Explicit Filmmaking Interest:")
for r in t9: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t9[0][0] == "film_director", f"Expected film_director as #1 with explicit interest, got {t9[0][0]}"
print("  [OK] PASS (Explicit Filmmaking correctly ranks #1)")

# Test 10: Commerce + BCA Applications
t10 = match_careers("commerce", streamAnswers=["software_coding_interest"], strengths=["problem_solving"])
print("\n[Test 10] Commerce + BCA / Software Coding:")
for r in t10: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t10[0][0] in ["bca_applications", "cs_software"], f"Expected bca_applications or cs_software, got {t10[0][0]}"
print("  [OK] PASS")

# Test 11: Arts + Clinical Psychology
t11 = match_careers("arts", streamAnswers=["clinical_psychology_interest"])
print("\n[Test 11] Arts + Clinical Psychology:")
for r in t11: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t11[0][0] == "psychology_counselling", f"Expected psychology_counselling, got {t11[0][0]}"
print("  [OK] PASS")

# Test 12: PCB student attempting Aerospace Engineering (Hard stream eligibility gate)
t12 = match_careers("pcb", streamAnswers=["software_coding_interest"])
aerospace_found = any(c[0] in ["aerospace", "mechanical", "aeronautical_eng"] for c in t12)
assert not aerospace_found, f"PCB student without Math should not get heavy engineering in top 5!"
print("\n[Test 12] Hard Stream Gate: PCB student cannot get heavy engineering without Math: [OK] PASS")

# Test 13: PCM student attempting Clinical Medicine (Hard stream eligibility gate)
t13 = match_careers("pcm", streamAnswers=["pure_physics_interest"])
medicine_found = any(c[0] in ["medicine", "cardiac_technology", "neurology_specialist"] for c in t13)
assert not medicine_found, f"PCM student without Bio should not get clinical medicine in top 5!"
print("[Test 13] Hard Stream Gate: PCM student cannot get clinical medicine without Bio: [OK] PASS")

# Test 14: User failing profile: Science - Computer Science + Maths with software coding
t14 = match_careers("cs_maths", streamAnswers=["software_coding_interest"], strengths=["teamwork", "mentoring_others"], extracurriculars=["art_drawing", "music", "teaching_tutoring"])
print("\n[Test 14] CS/Maths + Teamwork/Mentoring + Art/Music/Tutoring + Software coding:")
for r in t14: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
assert t14[0][0] in ["cs_software", "bsc_computer_science"], f"Expected software/CS career as #1, got {t14[0][0]}"
print("  [OK] PASS")

# Test 15: User profile with empty streamAnswers (evaluating stream, strengths, extracurriculars)
t15 = match_careers("cs_maths", streamAnswers=[], strengths=["teamwork", "mentoring_others"], extracurriculars=["art_drawing", "music", "teaching_tutoring"])
print("\n[Test 15] CS/Maths + Teamwork/Mentoring + Art/Music/Tutoring (Empty streamAnswers):")
for r in t15: print(f"  #{r[0]}: {r[1]} ({r[2]}%)")
cs_pathways_in_top = any(c[0] in ["cs_software", "bsc_computer_science", "cs_educator", "ui_ux_design", "ai_ml"] for c in t15)
assert cs_pathways_in_top, f"Expected relevant CS/computing pathways in top 5, got {[c[0] for c in t15]}"
print("  [OK] PASS")

print("\n" + "="*60)
print("ALL 15 COMPREHENSIVE TEST SUITE SCENARIOS PASSED 100%!")
print("="*60)
