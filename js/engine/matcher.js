// CAREERQUEST AI - Weighted Multi-Signal Career Recommendation Engine

(function() {
  function matchCareers(assessmentData = {}) {
    const {
      stream = "",
      streamAnswers = [],
      extracurriculars = [],
      strengths = [],
      preferences = [],
      avoidances = []
    } = assessmentData;

    const careers = window.CAREERS_DATABASE || [];
    const scoredCareers = [];

    // Helper lookup sets
    const tagSet = new Set(streamAnswers || []);
    const extraSet = new Set(extracurriculars || []);
    const strengthSet = new Set(strengths || []);
    const prefSet = new Set(preferences || []);
    const avoidSet = new Set(avoidances || []);

    const streamObj = (window.STREAMS || []).find(s => s.id === stream);
    const streamName = streamObj ? streamObj.title : (stream || "Selected");

    // Biological science signals
    const hasBioSignal = tagSet.has("genetics_dna") ||
                         tagSet.has("human_anatomy") ||
                         tagSet.has("microbiology") ||
                         tagSet.has("biotech_genetics") ||
                         tagSet.has("clinical_medicine") ||
                         tagSet.has("medicine_interest") ||
                         tagSet.has("biotech_interest") ||
                         tagSet.has("bioinfo_interest") ||
                         ["pcb", "pcmb"].includes(stream);

    // Specific interest signals
    const hasPilotInterest = tagSet.has("pilot_interest") || prefSet.has("aviation_pilot_pref");
    const hasArmyInterest = tagSet.has("defence_army_interest") || (prefSet.has("defence_service_pref") && extraSet.has("ncc"));
    const hasNavyInterest = tagSet.has("navy_interest");
    const hasAirForceInterest = tagSet.has("airforce_interest") || (prefSet.has("defence_service_pref") && (tagSet.has("aerospace_interest") || tagSet.has("aeronautical_interest")));
    const hasDefenceTechInterest = tagSet.has("defence_tech_interest") || (prefSet.has("defence_service_pref") && tagSet.has("electronics"));
    const hasGeneralDefenceInterest = prefSet.has("defence_service_pref") || hasArmyInterest || hasNavyInterest || hasAirForceInterest || hasDefenceTechInterest;

    const hasSoftwareCoding = tagSet.has("software_coding_interest") || extraSet.has("coding_clubs") || prefSet.has("working_tech");
    const hasMechanicalMachinery = tagSet.has("mechanical_machinery_interest") || prefSet.has("working_machines") || extraSet.has("robotics");
    const hasCivilStruct = tagSet.has("civil_struct_interest");
    const hasAerospace = tagSet.has("aerospace_interest");
    const hasAeronautical = tagSet.has("aeronautical_interest");
    const hasMedicine = tagSet.has("medicine_interest") || tagSet.has("clinical_medicine");
    const hasBiotech = tagSet.has("biotech_interest") || tagSet.has("biotech_genetics");
    const hasPharmacy = tagSet.has("pharmacy_interest") || tagSet.has("pharmacy");
    const hasPhysio = tagSet.has("physio_interest") || tagSet.has("physiotherapy");
    const hasTeaching = tagSet.has("teaching_interest") || prefSet.has("teaching_explaining") || extraSet.has("teaching_tutoring") || extraSet.has("peer_mentoring");
    const hasCA = tagSet.has("ca_accounting_interest");
    const hasFinance = tagSet.has("finance_stock_interest");
    const hasBusinessSales = tagSet.has("business_sales_interest") || prefSet.has("business_entrepreneurship");
    const hasLaw = tagSet.has("law_interest") || tagSet.has("corporate_law_interest");
    const hasCivils = tagSet.has("civils_interest");
    const hasJournalism = tagSet.has("journalism_interest");
    const hasUIUX = tagSet.has("ui_ux_interest") || prefSet.has("creativity_art");

    careers.forEach(career => {
      let score = 0;
      const reasons = [];
      const signalsFound = [];

      // -----------------------------------------------------------------
      // 1. SPECIFIC CAREER INTEREST SIGNALS (+45 PTS - HIGHEST WEIGHT)
      // -----------------------------------------------------------------
      if (career.id === "commercial_pilot" && hasPilotInterest) {
        score += 45;
        signalsFound.push("specifically expressed interest in commercial aviation piloting");
      }
      if (career.id === "defence_army" && (hasArmyInterest || (hasGeneralDefenceInterest && strengthSet.has("leadership")))) {
        score += 45;
        signalsFound.push("specifically expressed interest in Indian Army command & tactical service");
      }
      if (career.id === "defence_navy" && (hasNavyInterest || (hasGeneralDefenceInterest && (prefSet.has("working_outdoors") || strengthSet.has("teamwork"))))) {
        score += 45;
        signalsFound.push("specifically expressed interest in Indian Navy maritime defense");
      }
      if (career.id === "defence_airforce" && (hasAirForceInterest || (hasGeneralDefenceInterest && (hasAerospace || hasAeronautical)))) {
        score += 45;
        signalsFound.push("specifically expressed interest in Indian Air Force aerial & technical operations");
      }
      if (career.id === "defence_tech" && hasDefenceTechInterest) {
        score += 45;
        signalsFound.push("specifically expressed interest in defence electronics & cyber warfare");
      }
      if (["cs_software", "ai_ml", "data_science", "cybersecurity"].includes(career.id) && hasSoftwareCoding) {
        score += 40;
        signalsFound.push("highlighted strong interest in software engineering & computer programming");
      }
      if (["applied_mechanics_tech", "mechanical", "robotics_automation"].includes(career.id) && hasMechanicalMachinery) {
        score += 40;
        signalsFound.push("demonstrated practical hands-on interest in machinery, tools, and mechanical systems");
      }
      if (["ca_auditing", "financial_analyst", "actuarial_science"].includes(career.id) && (hasCA || hasFinance)) {
        score += 40;
        signalsFound.push("showed keen interest in financial accounting, auditing, and corporate finance");
      }
      if (["medicine", "biotechnology", "pharmacy", "physiotherapy", "nursing", "dentistry"].includes(career.id) && (hasMedicine || hasBiotech || hasPharmacy || hasPhysio)) {
        score += 40;
        signalsFound.push("expressed dedicated passion for medical care, life sciences, and healthcare");
      }
      if (career.category === "Education" && (hasTeaching || strengthSet.has("explaining_concepts") || strengthSet.has("mentoring_others"))) {
        score += 40;
        signalsFound.push("demonstrated strong interest in teaching, lecturing, and sharing knowledge");
      }
      if (["corporate_law", "civil_services", "public_policy"].includes(career.id) && (hasLaw || hasCivils)) {
        score += 40;
        signalsFound.push("showed strong orientation towards law, public governance, and legal analysis");
      }

      // -----------------------------------------------------------------
      // 2. RELEVANT ACADEMIC STREAM & SUBJECT SIGNALS (+15 PTS FILTER)
      // Stream is a COMPATIBILITY FILTER, NOT the primary reason!
      // -----------------------------------------------------------------
      if (stream !== "vocational") {
        if (career.streamCompatibility.includes(stream)) {
          score += 15;
          signalsFound.push(`studied the **${streamName}** Class 12 stream`);
        } else {
          score -= 25; // Incompatible stream penalty
        }
      } else {
        // Vocational Stream Scoping:
        if (["applied_mechanics_tech", "vocational_tech_it", "vocational_biz_mgmt", "applied_design_media"].includes(career.id)) {
          score += 20;
          signalsFound.push(`selected **Vocational / Applied Skills** stream`);
        } else if (career.streamCompatibility.includes("vocational")) {
          score += 10;
        } else {
          score -= 15;
        }
      }

      // -----------------------------------------------------------------
      // 3. NATURAL STRENGTHS & APTITUDES (+12 PTS)
      // -----------------------------------------------------------------
      if (strengthSet.has("problem_solving") && ["cs_software", "ai_ml", "cybersecurity", "mechanical", "aerospace", "applied_mechanics_tech"].includes(career.id)) {
        score += 12;
        signalsFound.push("possesses natural strength in Problem Solving");
      }
      if (strengthSet.has("analytical_thinking") && ["data_science", "financial_analyst", "ca_auditing", "astrophysics", "pure_science_maths"].includes(career.id)) {
        score += 12;
        signalsFound.push("possesses strong Analytical Thinking aptitude");
      }
      if (strengthSet.has("spatial_thinking") && ["aerospace", "aeronautical_eng", "commercial_pilot", "architecture", "civil_structural"].includes(career.id)) {
        score += 12;
        signalsFound.push("exhibits high Spatial Reasoning & 3D Thinking");
      }
      if (strengthSet.has("attention_detail") && ["ca_auditing", "cybersecurity", "aircraft_maintenance", "pharmacy"].includes(career.id)) {
        score += 10;
        signalsFound.push("demonstrates keen Attention to Detail");
      }
      if ((strengthSet.has("leadership") || strengthSet.has("discipline")) && ["defence_army", "defence_navy", "defence_airforce", "civil_services", "merchant_navy_deck"].includes(career.id)) {
        score += 12;
        signalsFound.push("demonstrates strong Leadership & Discipline under pressure");
      }
      if ((strengthSet.has("explaining_concepts") || strengthSet.has("patience")) && career.category === "Education") {
        score += 12;
        signalsFound.push("reported natural talent in Explaining Concepts & Patience");
      }

      // -----------------------------------------------------------------
      // 4. WORK PREFERENCES & ENVIRONMENT (+15 PTS)
      // -----------------------------------------------------------------
      if (prefSet.has("working_tech") && career.category === "Technology") score += 15;
      if (prefSet.has("working_machines") && ["applied_mechanics_tech", "mechanical", "aircraft_maintenance", "marine_engineering"].includes(career.id)) score += 15;
      if (prefSet.has("working_data") && ["data_science", "financial_analyst", "ca_auditing", "actuarial_science"].includes(career.id)) score += 15;
      if (prefSet.has("research_investigation") && (career.category === "Science & Research" || ["biotechnology", "astrophysics", "bioinformatics"].includes(career.id))) score += 15;
      if (prefSet.has("working_people") && (career.category === "Medical & Healthcare" || ["physiotherapy", "medicine", "corporate_law"].includes(career.id))) score += 15;

      // -----------------------------------------------------------------
      // 5. EXTRACURRICULAR ACTIVITIES (SUPPORTING ONLY, +8 PTS - NEVER ALONE)
      // -----------------------------------------------------------------
      if (extraSet.has("ncc") && ["defence_army", "defence_navy", "defence_airforce", "civil_services"].includes(career.id)) {
        score += 8;
        signalsFound.push("supported by NCC cadet experience");
      }
      if (extraSet.has("coding_clubs") && career.category === "Technology") {
        score += 8;
        signalsFound.push("supported by active participation in Coding Clubs/Hackathons");
      }
      if (extraSet.has("robotics") && ["robotics_automation", "mechanical", "avionics"].includes(career.id)) {
        score += 8;
        signalsFound.push("supported by hands-on Robotics lab involvement");
      }
      if (extraSet.has("teaching_tutoring") && career.category === "Education") {
        score += 8;
        signalsFound.push("supported by tutoring & peer mentoring experience");
      }

      // -----------------------------------------------------------------
      // 6. HARD MISMATCH & AVOIDANCE PENALTIES (-80 to -100 PTS)
      // -----------------------------------------------------------------

      // Bug 1 Fix: Bioinformatics requires explicit Biological Science signal!
      if (career.id === "bioinformatics" && !hasBioSignal && !tagSet.has("bioinfo_interest")) {
        score -= 80;
      }

      // Hard penalty for unevidenced Commercial Pilot
      if (career.id === "commercial_pilot" && !hasPilotInterest) {
        score -= 80;
      }

      // Hard penalty for unevidenced Defence careers
      if (career.id === "defence_army" && !hasArmyInterest && !hasGeneralDefenceInterest) {
        score -= 80;
      }
      if (career.id === "defence_navy" && !hasNavyInterest && !(hasGeneralDefenceInterest && (tagSet.has("maritime_ocean") || prefSet.has("working_outdoors")))) {
        score -= 80;
      }
      if (career.id === "defence_airforce" && !hasAirForceInterest && !(hasGeneralDefenceInterest && (hasAerospace || hasAeronautical))) {
        score -= 80;
      }
      if (career.id === "defence_tech" && !hasDefenceTechInterest && !hasGeneralDefenceInterest) {
        score -= 80;
      }

      // Hard penalty for Medicine/Nursing/Dentistry without stream/interests
      if (career.id === "medicine" && (!["pcb", "pcmb"].includes(stream) || avoidSet.has("avoid_patient_care"))) {
        score -= 100;
      }
      if (["nursing", "dentistry", "physiotherapy"].includes(career.id) && avoidSet.has("avoid_patient_care")) {
        score -= 100;
      }

      // Dislike Patient Care penalty for all clinical healthcare
      if (avoidSet.has("avoid_patient_care") && career.category === "Medical & Healthcare" && career.id !== "biotechnology") {
        score -= 100;
      }

      // Dislike Desk/Computer penalty for Technology
      if (avoidSet.has("avoid_desk_computer") && career.category === "Technology") {
        score -= 60;
      }

      // Teaching penalty if no teaching/explaining signals
      if (career.category === "Education" && !hasTeaching && !strengthSet.has("explaining_concepts") && !extraSet.has("teaching_tutoring")) {
        score -= 50;
      }

      // -----------------------------------------------------------------
      // 7. RATIONALE STATEMENT GENERATION
      // -----------------------------------------------------------------
      if (signalsFound.length > 0) {
        const signalText = signalsFound.slice(0, 3).join(", ");
        reasons.push(`Appeared because you ${signalText}.`);
      } else {
        reasons.push(`Appeared based on broad compatibility with your reported academic preferences.`);
      }

      // Final score normalization (capped 100%)
      const matchScore = Math.max(0, Math.min(100, Math.round(score)));

      scoredCareers.push({
        career,
        matchScore,
        matchPercent: `${matchScore}%`,
        reasons
      });
    });

    // -----------------------------------------------------------------
    // 8. CONFIDENCE THRESHOLDING & SORTING
    // -----------------------------------------------------------------
    scoredCareers.sort((a, b) => b.matchScore - a.matchScore);

    let topMatches = scoredCareers.filter(item => item.matchScore >= 30);

    if (topMatches.length < 3) {
      topMatches = scoredCareers.slice(0, 5);
    } else if (topMatches.length > 6) {
      topMatches = topMatches.slice(0, 6);
    }

    return {
      topMatches,
      stream,
      totalEvaluated: careers.length
    };
  }

  window.CAREER_MATCHER = {
    matchCareers
  };
})();
