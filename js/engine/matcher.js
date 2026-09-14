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
                         tagSet.has("nursing_interest") ||
                         tagSet.has("dentistry_interest") ||
                         tagSet.has("physio_interest") ||
                         tagSet.has("public_health_interest") ||
                         ["pcb", "pcmb"].includes(stream);

    // Mathematics signals
    const hasMathSignal = tagSet.has("pure_maths") ||
                          tagSet.has("applied_physics") ||
                          tagSet.has("software_coding_interest") ||
                          tagSet.has("ai_ml_interest") ||
                          tagSet.has("data_science_interest") ||
                          tagSet.has("actuarial_interest") ||
                          tagSet.has("ca_accounting_interest") ||
                          ["pcm", "cs_maths", "pcmb"].includes(stream);

    // Defense Signals
    const hasArmyInterest = tagSet.has("defence_army_interest");
    const hasNavyInterest = tagSet.has("navy_interest");
    const hasAirForceInterest = tagSet.has("airforce_interest");
    const hasDefenceTechInterest = tagSet.has("defence_tech_interest");
    const hasGeneralDefenceInterest = prefSet.has("defence_service_pref") || extraSet.has("ncc") || hasArmyInterest || hasNavyInterest || hasAirForceInterest || hasDefenceTechInterest;

    // Aviation Signals
    const hasPilotInterest = tagSet.has("pilot_interest") || prefSet.has("aviation_pilot_pref");
    const hasAircraftMaintInterest = tagSet.has("aircraft_maint_interest");
    const hasAvionicsInterest = tagSet.has("avionics_interest");
    const hasGeneralAviationInterest = hasPilotInterest || hasAircraftMaintInterest || hasAvionicsInterest || prefSet.has("aviation_pilot_pref");

    careers.forEach(career => {
      let score = 0;
      const reasons = [];
      const signalsFound = [];

      // -----------------------------------------------------------------
      // 1. HARD CLASS 12 ELIGIBILITY FILTER
      // -----------------------------------------------------------------
      let isStreamCompatible = false;
      if (career.streamCompatibility && (career.streamCompatibility.includes(stream) || career.streamCompatibility.includes("all"))) {
        isStreamCompatible = true;
      }

      // Hard eligibility penalties for clear mismatch streams
      if (!isStreamCompatible) {
        // Clinical medical careers (Medicine, Dental, Nursing, Physiotherapy, Pathology) REQUIRE Biology
        if (["medicine", "dentistry", "nursing", "physiotherapy", "allied_health_lab"].includes(career.id) && !hasBioSignal) {
          score -= 100; // Hard Ineligible
        }
        // Heavy engineering requiring Core Class 12 Math (Aerospace, Mechanical, Civil, Pure Math) REQUIRE Math
        else if (["aerospace", "aeronautical_eng", "mechanical", "civil_structural", "pure_science_maths"].includes(career.id) && !hasMathSignal) {
          score -= 100; // Hard Ineligible
        } else {
          score -= 40; // Academic incompatibility penalty
        }
      } else {
        score += 15;
        signalsFound.push(`studied **${streamName}** in Class 12`);
      }

      // -----------------------------------------------------------------
      // 2. VERY HIGH: EXPLICIT CAREER INTEREST (+50 PTS BASE SCORE)
      // Explicit selection of a career area MUST be the strongest driver!
      // -----------------------------------------------------------------
      let hasExplicitMatch = false;

      // Technology
      if (career.id === "cybersecurity" && (tagSet.has("cybersecurity_interest") || tagSet.has("ethical_hacking"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Cybersecurity & Ethical Hacking as a primary career interest");
      }
      if (career.id === "ai_ml" && (tagSet.has("ai_ml_interest") || tagSet.has("ai_python"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Artificial Intelligence & Machine Learning as a career interest");
      }
      if (career.id === "cs_software" && (tagSet.has("software_coding_interest") || tagSet.has("software_coding"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Software Engineering & Systems Development as a career interest");
      }
      if (career.id === "web_app_developer" && (tagSet.has("web_app_dev_interest") || tagSet.has("web_dev"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Web & Mobile App Development as a career interest");
      }
      if (career.id === "cloud_devops" && tagSet.has("cloud_devops_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Cloud Engineering & DevOps as a career interest");
      }
      if (career.id === "data_science" && (tagSet.has("data_science_interest") || tagSet.has("data_analysis"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Data Science & Big Analytics as a career interest");
      }
      if (career.id === "robotics_automation" && (tagSet.has("robotics_automation_interest") || tagSet.has("robotics_mechatronics"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Robotics & Autonomous Systems Engineering");
      }

      // Engineering
      if (career.id === "aerospace" && tagSet.has("aerospace_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Aerospace & Space Systems Engineering");
      }
      if (career.id === "aeronautical_eng" && tagSet.has("aeronautical_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Aeronautical Engineering & Aircraft Design");
      }
      if (career.id === "mechanical" && tagSet.has("mechanical_machinery_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Mechanical & Automotive Engineering");
      }
      if (career.id === "civil_structural" && tagSet.has("civil_struct_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Civil & Smart Infrastructure Engineering");
      }
      if (career.id === "biomedical_eng" && tagSet.has("biomedical_eng_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Biomedical Engineering & Healthcare Devices");
      }

      // Medical & Healthcare
      if (career.id === "medicine" && (tagSet.has("medicine_interest") || tagSet.has("clinical_medicine"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Medicine & Surgery (MBBS) as a career goal");
      }
      if (career.id === "biotechnology" && (tagSet.has("biotech_interest") || tagSet.has("biotech_genetics"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Biotechnology & Genetic Engineering");
      }
      if (career.id === "pharmacy" && tagSet.has("pharmacy_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Pharmaceutical Sciences & Drug Research");
      }
      if (career.id === "bioinformatics" && tagSet.has("bioinfo_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Bioinformatics & Computational Biology");
      }
      if (career.id === "physiotherapy" && tagSet.has("physio_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Physiotherapy & Sports Rehabilitation");
      }
      if (career.id === "nursing" && tagSet.has("nursing_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Nursing & Clinical Patient Care");
      }
      if (career.id === "dentistry" && tagSet.has("dentistry_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Dental Surgery & Oral Healthcare (BDS)");
      }
      if (career.id === "public_health" && tagSet.has("public_health_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Public Health & Epidemiology");
      }
      if (career.id === "psychology_counselling" && (tagSet.has("psychology_interest") || tagSet.has("counselling_interest"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Psychology & Behavioral Counselling");
      }
      if (career.id === "allied_health_lab" && tagSet.has("pathology_lab_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Medical Laboratory Science & Pathology Diagnostics");
      }

      // Defence
      if (career.id === "defence_army" && hasArmyInterest) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Indian Army Officer (Combat & Tactical Command)");
      }
      if (career.id === "defence_navy" && hasNavyInterest) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Indian Navy Officer (Executive & Marine)");
      }
      if (career.id === "defence_airforce" && hasAirForceInterest) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Indian Air Force Flying & Technical Officer");
      }
      if (career.id === "defence_tech" && hasDefenceTechInterest) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Defence Electronics & Cyber Warfare Specialist");
      }

      // Aviation
      if (career.id === "commercial_pilot" && hasPilotInterest) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Commercial Aviation Pilot");
      }
      if (career.id === "aircraft_maintenance" && hasAircraftMaintInterest) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Aircraft Maintenance Engineering (AME)");
      }
      if (career.id === "avionics" && hasAvionicsInterest) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Avionics & Flight Electronics");
      }

      // Commerce & Finance
      if (career.id === "ca_auditing" && tagSet.has("ca_accounting_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Chartered Accountancy & Financial Auditing");
      }
      if (career.id === "financial_analyst" && tagSet.has("finance_stock_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Investment Banking & Financial Analysis");
      }
      if (career.id === "actuarial_science" && tagSet.has("actuarial_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Actuarial Science & Risk Analytics");
      }
      if (career.id === "company_secretary" && tagSet.has("company_sec_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Company Secretary & Corporate Governance");
      }
      if (career.id === "marketing_digital" && tagSet.has("marketing_digital_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Digital Marketing & Brand Strategy");
      }
      if (career.id === "fintech_entrepreneurship" && tagSet.has("fintech_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected FinTech & Digital Business");
      }

      // Law & Government
      if (career.id === "corporate_law" && (tagSet.has("corporate_law_interest") || tagSet.has("law_interest"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Law & Corporate Legal Practice");
      }
      if (career.id === "civil_services" && tagSet.has("civils_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Civil Services & Public Administration (IAS/IPS)");
      }
      if (career.id === "public_policy" && tagSet.has("policy_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Public Policy & International Relations");
      }

      // Education & Teaching
      if (career.id === "maths_educator" && tagSet.has("maths_teaching_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Mathematics Education & Academic Career");
      }
      if (career.id === "cs_educator" && tagSet.has("cs_teaching_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Computer Science Education & EdTech");
      }
      if (career.id === "biology_educator" && tagSet.has("bio_teaching_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Biology Education & Life Sciences Teaching");
      }

      // Creative & Performing Arts
      if (career.id === "actor_performer" && (tagSet.has("acting_performance_interest") || tagSet.has("acting_interest"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Acting, Theatre & Performance Arts");
      }
      if (career.id === "film_director" && (tagSet.has("film_directing_interest") || tagSet.has("filmmaking_interest"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Film Direction & Screenwriting");
      }
      if (career.id === "cinematographer_camera" && (tagSet.has("cinematography_camera_interest") || tagSet.has("photography_video_interest") || tagSet.has("camera_interest"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Cinematography, Photography & Camera Work");
      }
      if (career.id === "musician_singer" && (tagSet.has("musician_singing_interest") || tagSet.has("music_interest"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Music Performance, Singing & Sound Production");
      }
      if (career.id === "ui_ux_design" && (tagSet.has("design_uiux_interest") || tagSet.has("ui_ux_interest"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected UI/UX & Digital Product Design");
      }
      if (career.id === "journalism_media" && tagSet.has("journalism_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Journalism & Digital Media");
      }
      if (career.id === "content_creation" && tagSet.has("content_creator_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Digital Content Creation & Video Production");
      }

      // Sports & Fitness
      if (career.id === "professional_athlete" && tagSet.has("sports_athlete_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Professional Athletics & Competitive Sports");
      }
      if (career.id === "sports_coach_mgmt" && tagSet.has("sports_coaching_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Sports Coaching & Sports Management");
      }

      // Maritime
      if (career.id === "marine_engineering" && tagSet.has("marine_eng_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Marine Engineering & Ship Machinery");
      }
      if (career.id === "merchant_navy_deck" && tagSet.has("merchant_navy_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Merchant Navy Deck Officer & Navigation");
      }

      // Science & Research
      if (career.id === "astrophysics" && tagSet.has("astrophysics_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Astrophysics & Space Science Research");
      }
      if (career.id === "pure_science_maths" && tagSet.has("pure_maths_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Pure Mathematics & Cryptographic Research");
      }

      // Emerging & Agriculture
      if (career.id === "healthtech_manager" && tagSet.has("healthtech_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected HealthTech & Telemedicine Innovation");
      }
      if (career.id === "product_mgmt" && tagSet.has("product_mgmt_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Technology Product Management");
      }
      if (career.id === "climate_tech" && tagSet.has("climate_tech_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Climate Tech & Renewable Energy");
      }
      if (career.id === "agri_food_science" && tagSet.has("agri_tech_interest")) {
        score += 50; hasExplicitMatch = true; signalsFound.push("specifically selected Agricultural Science & Sustainable Food Tech");
      }

      // -----------------------------------------------------------------
      // 3. HIGH: SUBJECT OVERLAP EVALUATION (+20 PTS)
      // -----------------------------------------------------------------
      if (career.relevantSubjects) {
        let subjectMatches = 0;
        career.relevantSubjects.forEach(subj => {
          const lowerSubj = subj.toLowerCase();
          streamAnswers.forEach(ans => {
            if (ans.toLowerCase().includes(lowerSubj) || lowerSubj.includes(ans.toLowerCase())) {
              subjectMatches++;
            }
          });
        });
        if (subjectMatches > 0) {
          score += Math.min(20, subjectMatches * 10);
        }
      }

      // -----------------------------------------------------------------
      // 4. HIGH: WORK PREFERENCES & ENVIRONMENT (+15 PTS)
      // -----------------------------------------------------------------
      if (prefSet.has("working_tech") && ["Technology", "Engineering"].includes(career.category)) {
        score += 15;
        if (signalsFound.length < 3) signalsFound.push("enjoys working with software & technology");
      }
      if (prefSet.has("creativity_art") && ["Creative & Media", "Education"].includes(career.category)) {
        score += 15;
        if (signalsFound.length < 3) signalsFound.push("enjoys artistic design & creative expression");
      }
      if (prefSet.has("working_machines") && ["applied_mechanics_tech", "mechanical", "aircraft_maintenance", "marine_engineering", "robotics_automation"].includes(career.id)) {
        score += 15;
        if (signalsFound.length < 3) signalsFound.push("enjoys hands-on work with machines & equipment");
      }
      if (prefSet.has("working_data") && ["data_science", "financial_analyst", "ca_auditing", "actuarial_science"].includes(career.id)) {
        score += 15;
        if (signalsFound.length < 3) signalsFound.push("enjoys working with data, numbers & statistics");
      }
      if (prefSet.has("research_investigation") && (career.category === "Science & Research" || ["biotechnology", "astrophysics", "bioinformatics", "public_health", "psychology_counselling"].includes(career.id))) {
        score += 15;
        if (signalsFound.length < 3) signalsFound.push("prefers deep research & scientific investigation");
      }
      if (prefSet.has("working_people") && (career.category === "Medical & Healthcare" || career.category === "Education" || ["corporate_law", "actor_performer", "civil_services", "psychology_counselling"].includes(career.id))) {
        score += 15;
        if (signalsFound.length < 3) signalsFound.push("enjoys working directly with people & communities");
      }
      if (prefSet.has("business_entrepreneurship") && (career.category === "Commerce & Finance" || ["fintech_entrepreneurship", "product_mgmt", "marketing_digital"].includes(career.id))) {
        score += 15;
        if (signalsFound.length < 3) signalsFound.push("interested in business, entrepreneurship & strategy");
      }

      // -----------------------------------------------------------------
      // 5. HIGH: NATURAL STRENGTHS (+10 PTS)
      // -----------------------------------------------------------------
      if (strengthSet.has("problem_solving") && ["cs_software", "ai_ml", "cybersecurity", "mechanical", "aerospace", "web_app_developer", "cloud_devops"].includes(career.id)) {
        score += 10;
        if (signalsFound.length < 3) signalsFound.push("demonstrates strong Problem Solving aptitude");
      }
      if (strengthSet.has("analytical_thinking") && ["data_science", "financial_analyst", "ca_auditing", "astrophysics", "pure_science_maths", "actuarial_science"].includes(career.id)) {
        score += 10;
        if (signalsFound.length < 3) signalsFound.push("has natural strength in Analytical Thinking");
      }
      if (strengthSet.has("creative_expression") && (career.category === "Creative & Media" || ["ui_ux_design", "content_creation", "actor_performer", "film_director", "cinematographer_camera", "musician_singer"].includes(career.id))) {
        score += 10;
        if (signalsFound.length < 3) signalsFound.push("possesses Creative Expression talent");
      }
      if (strengthSet.has("public_speaking") && ["actor_performer", "corporate_law", "journalism_media", "civil_services", "maths_educator", "cs_educator"].includes(career.id)) {
        score += 10;
        if (signalsFound.length < 3) signalsFound.push("demonstrates Public Speaking & Communication confidence");
      }
      if (strengthSet.has("spatial_thinking") && ["aerospace", "aeronautical_eng", "commercial_pilot", "architecture", "civil_structural", "cinematographer_camera"].includes(career.id)) {
        score += 10;
        if (signalsFound.length < 3) signalsFound.push("exhibits high Spatial Reasoning & Visual Thinking");
      }
      if (strengthSet.has("attention_detail") && ["ca_auditing", "cybersecurity", "aircraft_maintenance", "pharmacy", "company_secretary"].includes(career.id)) {
        score += 10;
        if (signalsFound.length < 3) signalsFound.push("demonstrates high Attention to Detail");
      }
      if ((strengthSet.has("leadership") || strengthSet.has("discipline")) && (career.category === "Defence" || ["merchant_navy_deck", "film_director", "sports_coach_mgmt", "civil_services"].includes(career.id))) {
        score += 10;
        if (signalsFound.length < 3) signalsFound.push("demonstrates Leadership & Discipline");
      }
      if ((strengthSet.has("explaining_concepts") || strengthSet.has("patience")) && career.category === "Education") {
        score += 10;
        if (signalsFound.length < 3) signalsFound.push("talented at Explaining Concepts & Mentoring");
      }

      // -----------------------------------------------------------------
      // 6. MEDIUM: EXTRACURRICULAR ACTIVITIES (+5 PTS)
      // -----------------------------------------------------------------
      if (extraSet.has("coding_clubs") && career.category === "Technology") score += 5;
      if (extraSet.has("robotics") && ["robotics_automation", "mechanical", "avionics"].includes(career.id)) score += 5;
      if (extraSet.has("theatre_acting") && ["actor_performer", "film_director"].includes(career.id)) score += 5;
      if (extraSet.has("photography_club") && ["cinematographer_camera", "content_creation"].includes(career.id)) score += 5;
      if (extraSet.has("music_band") && career.id === "musician_singer") score += 5;
      if (extraSet.has("sports_teams") && (career.category === "Sports & Fitness" || career.id === "physiotherapy")) score += 5;
      if (extraSet.has("ncc") && career.category === "Defence") score += 5;
      if (extraSet.has("teaching_tutoring") && career.category === "Education") score += 5;

      // -----------------------------------------------------------------
      // 7. MISMATCH & AVOIDANCE PENALTIES (-40 to -80 PTS)
      // -----------------------------------------------------------------
      if (career.id === "bioinformatics" && !hasBioSignal && !tagSet.has("bioinfo_interest")) {
        score -= 80;
      }
      if (career.id === "commercial_pilot" && !hasPilotInterest) {
        score -= 80;
      }
      if (career.category === "Defence" && !hasGeneralDefenceInterest && !extraSet.has("ncc")) {
        score -= 80;
      }
      if (["medicine", "nursing", "dentistry", "physiotherapy"].includes(career.id)) {
        if (!hasBioSignal || avoidSet.has("avoid_patient_care")) {
          score -= 80;
        }
      }
      if (career.category === "Education" && !tagSet.has("teaching_interest") && !tagSet.has("maths_teaching_interest") && !tagSet.has("cs_teaching_interest") && !tagSet.has("bio_teaching_interest") && !extraSet.has("teaching_tutoring") && !strengthSet.has("explaining_concepts")) {
        score -= 40;
      }
      if (career.id === "professional_athlete" && !tagSet.has("sports_athlete_interest") && !extraSet.has("sports_teams")) {
        score -= 60;
      }
      if (avoidSet.has("avoid_desk_computer") && (career.category === "Technology" || career.id === "ca_auditing")) {
        score -= 50;
      }
      if (avoidSet.has("avoid_public_speaking") && ["actor_performer", "corporate_law", "journalism_media"].includes(career.id)) {
        score -= 60;
      }

      // -----------------------------------------------------------------
      // 8. RATIONALE STATEMENT GENERATION
      // -----------------------------------------------------------------
      if (signalsFound.length > 0) {
        const uniqueSignals = Array.from(new Set(signalsFound));
        const signalText = uniqueSignals.slice(0, 3).join(", ");
        reasons.push(`Appeared because you ${signalText}.`);
      } else {
        reasons.push(`Appeared based on broad compatibility with your reported academic preferences.`);
      }

      // Score normalization for encouraging display (capped 95%, baseline 60%)
      let matchScore = 60;
      if (score > 0) {
        matchScore = Math.max(60, Math.min(95, 60 + Math.round(score * 0.4)));
      } else if (score < -50) {
        matchScore = 35;
      }

      let matchLabel = "Good Pathway to Explore";
      if (matchScore >= 80) {
        matchLabel = "Strong Match to Explore";
      } else if (matchScore >= 60) {
        matchLabel = "Good Pathway to Explore";
      } else {
        matchLabel = "Another Pathway to Consider";
      }

      scoredCareers.push({
        career,
        matchScore,
        matchPercent: `${matchScore}%`,
        matchLabel,
        reasons
      });
    });

    // -----------------------------------------------------------------
    // 9. CONFIDENCE THRESHOLDING & TOP 3–5 SELECTION
    // -----------------------------------------------------------------
    scoredCareers.sort((a, b) => b.matchScore - a.matchScore);

    // Pick top 3 to 5 relevant careers
    let topMatches = scoredCareers.slice(0, 5);

    // Guarantee non-empty results fallback
    if (topMatches.length === 0 || topMatches[0].matchScore < 10) {
      topMatches = scoredCareers.slice(0, 5).map(item => ({
        ...item,
        matchScore: Math.max(item.matchScore, 65),
        matchPercent: `${Math.max(item.matchScore, 65)}%`,
        matchLabel: "Good Pathway to Explore"
      }));
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
