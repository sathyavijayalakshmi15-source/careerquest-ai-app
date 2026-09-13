// CAREERQUEST AI - Enhanced Multi-Factor Recommendation Engine with Mismatch Penalties

(function() {
  function matchCareers(assessmentData) {
    const {
      stream = "",
      streamAnswers = [],
      extracurriculars = [],
      strengths = [],
      preferences = []
    } = assessmentData;

    const careers = window.CAREERS_DATABASE || [];
    const scoredCareers = [];

    // Helper lookup sets
    const extraSet = new Set(extracurriculars);
    const strengthSet = new Set(strengths);
    const prefSet = new Set(preferences);
    const tagSet = new Set(streamAnswers);

    // Human readable mappings for dynamic rationale generation
    const streamObj = (window.STREAMS || []).find(s => s.id === stream);
    const streamName = streamObj ? streamObj.title : stream;

    const strengthNames = strengths.map(id => {
      const sObj = (window.STRENGTHS_OPTIONS || []).find(o => o.id === id);
      return sObj ? sObj.label : id;
    });

    const extraNames = extracurriculars.map(id => {
      const eObj = (window.EXTRACURRICULAR_OPTIONS || []).find(o => o.id === id);
      return eObj ? eObj.label : id;
    });

    // Helper flags for combinations
    const hasMaths = tagSet.has("calc_alg") || tagSet.has("spatial_geom") || stream === "pcm" || stream === "cs_maths" || stream === "pcmb";
    const hasPhysics = tagSet.has("phys_mech") || tagSet.has("optics_astronomy") || tagSet.has("elec_circuits") || stream === "pcm" || stream === "cs_maths" || stream === "pcmb";
    const hasBio = tagSet.has("human_anatomy") || tagSet.has("genetics_dna") || tagSet.has("microbiology") || stream === "pcb" || stream === "pcmb";
    const hasChemistry = tagSet.has("chem_structures") || tagSet.has("organic_chem") || stream === "pcb" || stream === "pcmb" || stream === "pcm";
    const hasCodingTech = tagSet.has("software_code") || tagSet.has("software_apps") || tagSet.has("ai_algorithms") || tagSet.has("cyber_security") || extraSet.has("coding_clubs") || extraSet.has("robotics") || prefSet.has("working_tech");
    const hasLogicProb = strengthSet.has("problem_solving") || strengthSet.has("analytical_thinking") || strengthSet.has("critical_thinking");
    const hasCommExpl = strengthSet.has("communication") || strengthSet.has("explaining_concepts") || strengthSet.has("public_speaking") || strengthSet.has("mentoring_others");
    const hasPatienceMentoring = strengthSet.has("patience") || strengthSet.has("mentoring_others") || extraSet.has("teaching_tutoring") || extraSet.has("peer_mentoring");
    const hasLeadershipDiscipline = strengthSet.has("leadership") || strengthSet.has("discipline") || strengthSet.has("decision_making") || extraSet.has("ncc") || extraSet.has("leadership");
    const hasResearchInquiry = prefSet.has("research_investigation") || tagSet.has("lab_research") || tagSet.has("pure_theorems") || extraSet.has("science_exhibitions");

    careers.forEach(career => {
      let score = 0;
      const matchReasons = [];

      // ----------------------------------------------------
      // 1. BASE STREAM COMPATIBILITY & WEIGHTING
      // ----------------------------------------------------
      if (career.streamCompatibility.includes(stream)) {
        score += 25;
        matchReasons.push(`Provides a strong foundation aligned with your **${streamName}** Class 12 stream.`);
      } else {
        // Interdisciplinary check vs penalty
        if (stream === "pcb" && career.streamCompatibility.includes("pcmb") && hasCodingTech) {
          score += 15; // Interdisciplinary bioinformatics / healthtech
          matchReasons.push(`Connects your **${streamName}** background with digital technology interests.`);
        } else if (stream === "arts" && career.streamCompatibility.includes("commerce")) {
          score += 10;
        } else {
          score -= 15; // Mismatch penalty for stream incompatibility
        }
      }

      // ----------------------------------------------------
      // 2. SIGNAL COMBINATIONS & SYNERGY BONUSES
      // ----------------------------------------------------

      // Combination A: Maths + Coding + Logic + Tech -> CS / AI / Data / Software
      if (hasMaths && hasCodingTech && hasLogicProb) {
        if (["cs_software", "ai_ml", "data_science", "cybersecurity", "robotics_automation"].includes(career.id)) {
          score += 35;
          const techReason = extraNames.find(n => n.includes("Coding") || n.includes("Robotics")) || "technology preferences";
          matchReasons.push(`Combines your quantitative **Maths & Logic** abilities with your involvement in **${techReason}**.`);
        }
      }

      // Combination B: Physics + Maths + Spatial + Aviation -> Aerospace / Aeronautical / Pilot
      if (hasPhysics && hasMaths && (tagSet.has("aerospace_flight") || tagSet.has("spatial_geom") || tagSet.has("phys_mech"))) {
        if (["aerospace", "commercial_pilot", "military_aviation", "defence_tech"].includes(career.id)) {
          score += 35;
          matchReasons.push("Resonates with your combined interest in flight dynamics, spatial reasoning, and physical mechanics.");
        }
      }

      // Combination C: Biology + Healthcare + Research -> Medical / Biotech / Biomedical
      if (hasBio && (prefSet.has("working_people") || prefSet.has("helping_others") || hasResearchInquiry)) {
        if (["medicine", "biotechnology", "pharmacy", "biomedical_eng", "physiotherapy"].includes(career.id)) {
          score += 35;
          matchReasons.push(`Integrates your **Life Sciences** curiosity with your preference for **${prefSet.has("helping_others") ? "Helping & Healing Others" : "Scientific Investigation"}**.`);
        }
      }

      // Combination D: Commerce + Accounting + Numbers + Attention to Detail -> CA / Finance / Actuarial
      if ((stream === "commerce" || hasMaths) && (tagSet.has("accounting_audit") || tagSet.has("stock_markets")) && strengthSet.has("attention_detail")) {
        if (["ca_auditing", "financial_analyst", "actuarial_science", "fintech_entrepreneurship"].includes(career.id)) {
          score += 35;
          matchReasons.push("Leverages your numerical precision, attention to detail, and interest in corporate financial structures.");
        }
      }

      // Combination E: Subject Knowledge + Communication + Patience + Explaining -> Teaching / Education
      if (hasCommExpl && hasPatienceMentoring && (prefSet.has("teaching_explaining") || extraSet.has("teaching_tutoring") || extraSet.has("peer_mentoring"))) {
        if (career.category === "Education") {
          score += 40; // High synergy bonus for teaching!
          if (career.id === "maths_educator" && hasMaths) {
            score += 15;
            matchReasons.push(`Combines your **Mathematics** mastery with your reported natural strengths in **Explaining Concepts** and **Mentoring**.`);
          } else if (career.id === "cs_educator" && hasCodingTech) {
            score += 15;
            matchReasons.push(`Bridges your **Coding/Tech** interest with your enjoyment in **Helping Others Learn**.`);
          } else if (career.id === "biology_educator" && hasBio) {
            score += 15;
            matchReasons.push(`Unites your **Biological Science** foundation with **Patience** and student guidance.`);
          } else {
            matchReasons.push(`Directly reflects your combination of **Communication**, **Patience**, and passion for **Sharing Knowledge**.`);
          }
        }
      }

      // Combination F: NCC / Leadership + Discipline + Teamwork + Defence -> Defence Officer / Military
      if (hasLeadershipDiscipline && (extraSet.has("ncc") || extraSet.has("nss") || prefSet.has("high_responsibility") || prefSet.has("working_outdoors"))) {
        if (["defence_officer", "military_aviation", "defence_tech", "civil_services"].includes(career.id)) {
          score += 35;
          const leadReason = extraNames.find(n => n.includes("NCC") || n.includes("Leadership")) || "Leadership & Discipline";
          matchReasons.push(`Supported by your **${leadReason}** experience and high-responsibility decision making.`);
        }
      }

      // Combination G: Bio + Maths + Coding + Data -> Bioinformatics / Health Data Science
      if (hasBio && hasMaths && (hasCodingTech || tagSet.has("data_analytics") || tagSet.has("bio_maths_intersection"))) {
        if (["bioinformatics", "healthtech_manager", "data_science"].includes(career.id)) {
          score += 35;
          matchReasons.push("Capitalizes on your interdisciplinary synergy across **Biological Sciences**, **Mathematics**, and **Data Analytics**.");
        }
      }

      // ----------------------------------------------------
      // 3. SPECIFIC STRENGTH & PREFERENCE MATCHING
      // ----------------------------------------------------
      if (strengthSet.has("problem_solving") && ["cs_software", "ai_ml", "actuarial_science", "cybersecurity", "aerospace", "mechanical"].includes(career.id)) {
        score += 12;
      }
      if (strengthSet.has("analytical_thinking") && ["data_science", "financial_analyst", "bioinformatics", "astrophysics", "ca_auditing"].includes(career.id)) {
        score += 12;
      }
      if (strengthSet.has("creativity") && ["ui_ux_design", "content_creation", "architecture", "edtech_designer"].includes(career.id)) {
        score += 12;
        matchReasons.push("Taps directly into your reported natural strength in **Creativity & Originality**.");
      }
      if (strengthSet.has("empathy") && ["medicine", "physiotherapy", "edtech_designer", "public_policy"].includes(career.id)) {
        score += 12;
      }

      // Work style preferences
      if (prefSet.has("working_tech") && career.category === "Technology") score += 10;
      if (prefSet.has("working_people") && (career.category === "Medical & Healthcare" || career.category === "Education")) score += 10;
      if (prefSet.has("working_outdoors") && (career.category === "Defence" || career.category === "Aviation" || career.category === "Maritime")) score += 12;
      if (prefSet.has("business_entrepreneurship") && (career.category === "Commerce & Finance" || career.category === "Emerging")) score += 10;

      // ----------------------------------------------------
      // 4. MISMATCH PENALTIES (To avoid false positives)
      // ----------------------------------------------------
      // Penalty: Heavy coding career without tech/maths interest
      if (["cs_software", "ai_ml", "cybersecurity"].includes(career.id) && !hasCodingTech && !hasMaths) {
        score -= 25;
      }
      // Penalty: Clinical MBBS without Bio background
      if (career.id === "medicine" && !hasBio) {
        score -= 30;
      }
      // Penalty: Teaching career if student has zero communication/explaining/patience signals and dislikes teaching
      if (career.category === "Education" && !hasCommExpl && !hasPatienceMentoring && !prefSet.has("teaching_explaining")) {
        score -= 20;
      }
      // Penalty: Defence officer if student dislikes outdoor/high-responsibility work and has no leadership signals
      if (career.id === "defence_officer" && !hasLeadershipDiscipline && !prefSet.has("working_outdoors") && !prefSet.has("high_responsibility")) {
        score -= 15;
      }

      // Collect top unique rationale statements using actual user selections
      const dynamicReasons = Array.from(new Set(matchReasons)).slice(0, 3);
      if (dynamicReasons.length === 0) {
        if (strengthNames.length > 0) {
          dynamicReasons.push(`Complements your key strengths in **${strengthNames.slice(0, 2).join(" & ")}**.`);
        } else {
          dynamicReasons.push(`Aligns with your Class 12 **${streamName}** subject profile.`);
        }
      }

      scoredCareers.push({
        career,
        score,
        matchPercent: Math.min(Math.max(score, 62), 98), // Realistic exploration match percentage
        reasons: dynamicReasons
      });
    });

    // Sort by score descending
    scoredCareers.sort((a, b) => b.score - a.score);

    // Pick top 4 matches (3 to 5 range)
    const topMatches = scoredCareers.slice(0, 4);

    return {
      topMatches,
      evaluatedCount: careers.length,
      stream,
      strengths,
      extracurriculars,
      preferences
    };
  }

  window.CAREER_MATCHER = {
    matchCareers
  };
})();
