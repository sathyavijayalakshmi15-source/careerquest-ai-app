// CAREERQUEST AI - Multi-Factor Recommendation Engine

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

    // Helper sets for quick lookup
    const extraSet = new Set(extracurriculars);
    const strengthSet = new Set(strengths);
    const prefSet = new Set(preferences);
    const tagSet = new Set(streamAnswers);

    // Check Teaching Signals
    const hasTeachingStrength = strengthSet.has("explaining_concepts") || strengthSet.has("mentoring_others") || strengthSet.has("patience");
    const hasCommunicationStrength = strengthSet.has("communication") || strengthSet.has("public_speaking");
    const hasTeachingActivity = extraSet.has("teaching_tutoring") || extraSet.has("peer_mentoring");
    const hasTeachingPref = prefSet.has("teaching_explaining") || prefSet.has("helping_others");

    const teachingSignalCount = (hasTeachingStrength ? 2 : 0) + (hasCommunicationStrength ? 1 : 0) + (hasTeachingActivity ? 2 : 0) + (hasTeachingPref ? 2 : 0);

    careers.forEach(career => {
      let score = 0;
      const matchReasons = [];

      // 1. Stream Compatibility (Base Score)
      if (career.streamCompatibility.includes(stream)) {
        score += 30;
        const streamObj = window.STREAMS.find(s => s.id === stream);
        matchReasons.push(`Aligns directly with your background in **${streamObj ? streamObj.title : stream}**.`);
      } else {
        score += 5; // Interdisciplinary possibility
      }

      // 2. Stream-Specific Interest Tag Matches
      if (stream === "pcm" || stream === "pcmb" || stream === "cs_maths") {
        if (tagSet.has("software_code") || tagSet.has("software_apps")) {
          if (["cs_software", "ai_ml", "cybersecurity", "product_mgmt"].includes(career.id)) {
            score += 25;
            matchReasons.push("Your interest in coding and software logic matches key requirements.");
          }
        }
        if (tagSet.has("ai_algorithms") && ["ai_ml", "data_science", "bioinformatics"].includes(career.id)) {
          score += 25;
          matchReasons.push("High correlation with your affinity for AI models and machine learning algorithms.");
        }
        if (tagSet.has("calc_alg") || tagSet.has("pure_theorems")) {
          if (["pure_science_maths", "actuarial_science", "maths_educator", "data_science"].includes(career.id)) {
            score += 25;
            matchReasons.push("Resonates with your deep affinity for pure mathematics and abstract reasoning.");
          }
        }
        if (tagSet.has("phys_mech") || tagSet.has("hardware_machines")) {
          if (["mechanical", "robotics_automation", "aerospace", "marine_engineering"].includes(career.id)) {
            score += 25;
            matchReasons.push("Matches your interest in physical mechanics, machinery, and forces.");
          }
        }
        if (tagSet.has("aerospace_flight") && ["aerospace", "commercial_pilot", "military_aviation"].includes(career.id)) {
          score += 30;
          matchReasons.push("Directly reflects your fascination with flight dynamics, aerospace systems, or aviation.");
        }
        if (tagSet.has("elec_circuits") && ["defence_tech", "robotics_automation", "biomedical_eng"].includes(career.id)) {
          score += 25;
          matchReasons.push("Connects with your interest in electronic circuits and signal systems.");
        }
        if (tagSet.has("structures_buildings") && ["civil_structural", "architecture", "climate_tech"].includes(career.id)) {
          score += 25;
          matchReasons.push("Aligns with your visual-spatial interest in structural design and smart infrastructure.");
        }
      }

      if (stream === "pcb" || stream === "pcmb") {
        if (tagSet.has("human_anatomy") || tagSet.has("direct_patient")) {
          if (["medicine", "physiotherapy"].includes(career.id)) {
            score += 25;
            matchReasons.push("Matches your commitment to clinical diagnosis, anatomy, and patient care.");
          }
        }
        if (tagSet.has("genetics_dna") || tagSet.has("lab_research")) {
          if (["biotechnology", "bioinformatics", "pharmacy"].includes(career.id)) {
            score += 25;
            matchReasons.push("Strong fit with your passion for molecular biology, genetic research, and laboratory science.");
          }
        }
        if (tagSet.has("tech_bio_devices") || tagSet.has("medical_devices")) {
          if (["biomedical_eng", "healthtech_manager"].includes(career.id)) {
            score += 25;
            matchReasons.push("Bridges your dual interest in healthcare systems and technological devices.");
          }
        }
        if (tagSet.has("bio_maths_intersection") && ["bioinformatics", "data_science", "ai_ml"].includes(career.id)) {
          score += 25;
          matchReasons.push("Highlights your interdisciplinary strength at the crossroads of biology and computing.");
        }
      }

      if (stream === "commerce") {
        if (tagSet.has("accounting_audit") && ["ca_auditing", "financial_analyst"].includes(career.id)) {
          score += 25;
          matchReasons.push("Reflects your numerical accuracy, accounting aptitude, and financial auditing interest.");
        }
        if (tagSet.has("stock_markets") && ["financial_analyst", "actuarial_science", "fintech_entrepreneurship"].includes(career.id)) {
          score += 25;
          matchReasons.push("Matches your analytical interest in stock valuation, capital markets, and investment strategy.");
        }
        if (tagSet.has("fintech_startups") && ["fintech_entrepreneurship", "product_mgmt"].includes(career.id)) {
          score += 25;
          matchReasons.push("Resonates with your drive for digital business models and fintech innovation.");
        }
      }

      if (stream === "arts") {
        if (tagSet.has("law_justice") && ["corporate_law", "public_policy", "civil_services"].includes(career.id)) {
          score += 25;
          matchReasons.push("Strong alignment with your logical argumentation, legal reasoning, and justice system interest.");
        }
        if (tagSet.has("civils_governance") && ["civil_services", "public_policy", "defence_officer"].includes(career.id)) {
          score += 25;
          matchReasons.push("Reflects your vision for public governance, administrative policy, and social impact.");
        }
        if (tagSet.has("writing_journalism") && ["journalism_media", "content_creation"].includes(career.id)) {
          score += 25;
          matchReasons.push("Matches your creative writing, media reporting, and storytelling skills.");
        }
        if (tagSet.has("visual_design") && ["ui_ux_design", "content_creation", "architecture"].includes(career.id)) {
          score += 25;
          matchReasons.push("Fits your aesthetic sense, visual composition, and digital design passion.");
        }
      }

      // 3. Natural Strengths Matching
      if (strengthSet.has("problem_solving") && ["cs_software", "ai_ml", "actuarial_science", "cybersecurity", "aerospace"].includes(career.id)) {
        score += 15;
        matchReasons.push("Leverages your core natural strength in **Problem Solving**.");
      }
      if (strengthSet.has("analytical_thinking") && ["data_science", "financial_analyst", "bioinformatics", "astrophysics"].includes(career.id)) {
        score += 15;
        matchReasons.push("Utilizes your **Analytical Thinking** and logical deduction capabilities.");
      }
      if (strengthSet.has("creativity") && ["ui_ux_design", "content_creation", "architecture", "edtech_designer"].includes(career.id)) {
        score += 15;
        matchReasons.push("Capitalizes on your visual and conceptual **Creativity**.");
      }
      if (strengthSet.has("leadership") || strengthSet.has("decision_making")) {
        if (["defence_officer", "civil_services", "product_mgmt", "fintech_entrepreneurship"].includes(career.id)) {
          score += 15;
          matchReasons.push("Complements your **Leadership & High-Stakes Decision Making** skills.");
        }
      }
      if (strengthSet.has("empathy") && ["medicine", "physiotherapy", "edtech_designer", "public_policy"].includes(career.id)) {
        score += 15;
        matchReasons.push("Draws on your deep sense of **Empathy** and patient/user care.");
      }

      // 4. Education & Teaching Special Detector
      if (career.category === "Education") {
        if (teachingSignalCount >= 3) {
          score += 35; // Significant boost!
          if (career.id === "maths_educator" && (stream === "pcm" || stream === "cs_maths" || stream === "pcmb")) {
            score += 20;
            matchReasons.push("Detected strong **Mathematics Teaching Potential**: High subject affinity combined with explaining concepts, patience, and mentoring.");
          } else if (career.id === "cs_educator" && (stream === "cs_maths" || stream === "pcm")) {
            score += 20;
            matchReasons.push("Detected strong **CS Educator / EdTech Potential**: Passion for tech combined with peer tutoring and helping others learn.");
          } else if (career.id === "biology_educator" && (stream === "pcb" || stream === "pcmb")) {
            score += 20;
            matchReasons.push("Detected **Biology Educator Potential**: Deep biological interest paired with communication and mentoring attributes.");
          } else if (career.id === "edtech_designer") {
            score += 15;
            matchReasons.push("Detected **EdTech / Instructional Design Fit**: Combines learning design, empathy, and technological delivery.");
          }
        }
      }

      // 5. Extracurricular & Supporting Signals
      if (extraSet.has("ncc") || extraSet.has("nss")) {
        if (["defence_officer", "civil_services", "merchant_navy_deck"].includes(career.id)) {
          score += 15;
          matchReasons.push("Supported by your active involvement in **NCC / NSS discipline & social leadership**.");
        }
      }
      if (extraSet.has("coding_clubs") || extraSet.has("robotics")) {
        if (["cs_software", "robotics_automation", "ai_ml", "cybersecurity", "cs_educator"].includes(career.id)) {
          score += 15;
          matchReasons.push("Reinforced by your hands-on participation in **Coding Clubs / Robotics**.");
        }
      }
      if (extraSet.has("science_exhibitions") && ["biotechnology", "astrophysics", "pure_science_maths", "biomedical_eng"].includes(career.id)) {
        score += 15;
        matchReasons.push("Backed by your history of competing in **Science Exhibitions & Research Fairs**.");
      }

      // 6. Career Work Environment Preferences
      if (prefSet.has("working_tech") && ["Technology", "Engineering"].includes(career.category)) {
        score += 10;
        matchReasons.push("Matches your preference for working in cutting-edge tech environments.");
      }
      if (prefSet.has("helping_others") && ["Medical & Healthcare", "Education"].includes(career.category)) {
        score += 10;
        matchReasons.push("Fulfills your preference for directly helping and empowering others.");
      }
      if (prefSet.has("working_outdoors") && ["Defence", "Aviation", "Maritime"].includes(career.category)) {
        score += 15;
        matchReasons.push("Resonates with your desire for dynamic, high-action outdoor or field environments.");
      }
      if (prefSet.has("business_entrepreneurship") && ["Commerce & Finance", "Emerging"].includes(career.category)) {
        score += 10;
        matchReasons.push("Aligns with your preference for business growth, markets, and entrepreneurship.");
      }

      // De-dupe match reasons
      const uniqueReasons = Array.from(new Set(matchReasons)).slice(0, 4);

      scoredCareers.push({
        career,
        score,
        matchPercent: Math.min(Math.max(score, 65), 98), // Realistic high exploration score range
        reasons: uniqueReasons.length > 0 ? uniqueReasons : ["Combines your academic stream profile with your reported problem-solving style."]
      });
    });

    // Sort by score descending
    scoredCareers.sort((a, b) => b.score - a.score);

    // Pick top 4 distinct careers (3 to 5 range)
    const topMatches = scoredCareers.slice(0, 4);

    return {
      topMatches,
      evaluatedCount: careers.length,
      stream,
      strengths,
      extracurriculars
    };
  }

  window.CAREER_MATCHER = {
    matchCareers
  };
})();
