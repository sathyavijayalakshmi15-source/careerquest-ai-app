// CAREERQUEST AI - Weighted Multi-Signal Career Recommendation Engine
// Fully expanded for 102 diverse careers across Science, Medicine, Allied Health, Computing, Business & Humanities

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
                         tagSet.has("med_specialist_interest") ||
                         tagSet.has("neurology_interest") ||
                         tagSet.has("cardiology_interest") ||
                         tagSet.has("neurosurgery_interest") ||
                         tagSet.has("psychiatry_specialist_interest") ||
                         tagSet.has("allied_health_interest") ||
                         tagSet.has("cardiac_tech_interest") ||
                         tagSet.has("medical_imaging_interest") ||
                         tagSet.has("neurophysio_interest") ||
                         tagSet.has("radiotherapy_interest") ||
                         tagSet.has("dialysis_tech_interest") ||
                         tagSet.has("respiratory_therapy_interest") ||
                         tagSet.has("physician_assistant_interest") ||
                         tagSet.has("ot_anaesthesia_interest") ||
                         tagSet.has("pure_bio_research_interest") ||
                         tagSet.has("biotech_interest") ||
                         tagSet.has("bioinfo_interest") ||
                         tagSet.has("nursing_interest") ||
                         tagSet.has("dentistry_interest") ||
                         tagSet.has("physio_interest") ||
                         tagSet.has("public_health_interest") ||
                         ["pcb", "pcmb"].includes(stream);

    // Mathematics signals
    const hasMathSignal = tagSet.has("pure_maths") ||
                          tagSet.has("pure_maths_interest") ||
                          tagSet.has("applied_physics") ||
                          tagSet.has("pure_physics_interest") ||
                          tagSet.has("software_coding_interest") ||
                          tagSet.has("ai_ml_interest") ||
                          tagSet.has("data_science_interest") ||
                          tagSet.has("actuarial_interest") ||
                          tagSet.has("ca_accounting_interest") ||
                          tagSet.has("cma_interest") ||
                          tagSet.has("bsc_cs_interest") ||
                          ["pcm", "cs_maths", "pcmb"].includes(stream);

    // Defense Signals - Requires Explicit Defence Interest / Preference
    const hasArmyInterest = tagSet.has("defence_army_interest");
    const hasNavyInterest = tagSet.has("navy_interest");
    const hasAirForceInterest = tagSet.has("airforce_interest");
    const hasDefenceTechInterest = tagSet.has("defence_tech_interest");
    const hasExplicitDefenceInterest = prefSet.has("defence_service_pref") || hasArmyInterest || hasNavyInterest || hasAirForceInterest || hasDefenceTechInterest;

    // Aviation Signals
    const hasPilotInterest = tagSet.has("pilot_interest") || prefSet.has("aviation_pilot_pref");
    const hasAircraftMaintInterest = tagSet.has("aircraft_maint_interest");
    const hasAvionicsInterest = tagSet.has("avionics_interest");
    const hasGeneralAviationInterest = hasPilotInterest || hasAircraftMaintInterest || hasAvionicsInterest || prefSet.has("aviation_pilot_pref");

    // Single-Signal Activity Protections
    const hasExplicitMusicInterest = tagSet.has("musician_singing_interest") || tagSet.has("music_interest");
    const hasExplicitActingInterest = tagSet.has("acting_performance_interest") || tagSet.has("acting_interest");
    const hasExplicitAthleteInterest = tagSet.has("sports_athlete_interest") || tagSet.has("sports_coaching_interest");
    const hasExplicitTeachingInterest = tagSet.has("teaching_interest") || tagSet.has("maths_teaching_interest") ||
                                        tagSet.has("cs_teaching_interest") || tagSet.has("bio_teaching_interest") ||
                                        tagSet.has("humanities_teaching_interest") ||
                                        extraSet.has("teaching_tutoring");
    // FILM MAKING EXPLICIT PROTECTION: General creativity, video or art must NEVER recommend Film Making alone
    const hasExplicitFilmInterest = tagSet.has("filmmaking_interest") || 
                                    tagSet.has("film_directing_interest") || 
                                    tagSet.has("cinema_production_interest");

    // Clinical Medical & Allied Health career sets
    const clinicalMedicalCareers = [
      "medicine", "dentistry", "nursing", "physiotherapy",
      "neurology_specialist", "cardiology_specialist", "neurosurgery_specialist", "psychiatry_specialist"
    ];
    const alliedHealthCareers = [
      "cardiac_technology", "neurophysiology_technology", "medical_imaging_technology",
      "radiotherapy_technology", "respiratory_therapy", "dialysis_technology",
      "physician_assistant", "ot_anaesthesia_technology", "optometry", "occupational_therapy",
      "allied_health_lab"
    ];

    careers.forEach(career => {
      let score = 0;
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
        // Clinical medical & Allied health careers REQUIRE Biology in Class 12
        if ((clinicalMedicalCareers.includes(career.id) || alliedHealthCareers.includes(career.id)) && !hasBioSignal) {
          score -= 100; // Hard Ineligible without Biology
        }
        // Heavy engineering requiring Core Class 12 Math REQUIRE Math
        else if (["aerospace", "aeronautical_eng", "mechanical", "civil_structural", "pure_science_maths", "actuarial_science", "physics_research"].includes(career.id) && !hasMathSignal) {
          score -= 100; // Hard Ineligible without Math
        } else {
          score -= 40; // Academic incompatibility penalty
        }
      } else {
        score += 15;
        signalsFound.push(`Studied **${streamName}** in Class 12`);
      }

      // -----------------------------------------------------------------
      // 2. EXPLICIT CAREER INTEREST MATCHING (PRIMARY RANKING SIGNALS)
      // -----------------------------------------------------------------
      let hasExplicitMatch = false;

      // Technology & Computing
      if (career.id === "cybersecurity" && (tagSet.has("cybersecurity_interest") || tagSet.has("ethical_hacking"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Cybersecurity & Ethical Hacking as a primary career interest");
      }
      if (career.id === "ai_ml" && (tagSet.has("ai_ml_interest") || tagSet.has("ai_python"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Artificial Intelligence & Machine Learning as a career interest");
      }
      if (career.id === "cs_software" && (tagSet.has("software_coding_interest") || tagSet.has("software_coding"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Software Engineering & Systems Development as a career interest");
      }
      if (career.id === "bsc_computer_science" && tagSet.has("bsc_cs_interest")) {
        score += 65; hasExplicitMatch = true; signalsFound.push("Selected B.Sc Computer Science & Computing Theory");
      } else if (career.id === "bsc_computer_science" && tagSet.has("software_coding_interest") && ["pcm", "cs_maths"].includes(stream)) {
        score += 45; hasExplicitMatch = true; signalsFound.push("Studied Mathematics & interested in Computing Theory");
      }
      if (career.id === "bsc_ai_ds" && tagSet.has("bsc_cs_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected B.Sc Artificial Intelligence & Data Science");
      }
      if (career.id === "bca_applications" && (tagSet.has("bsc_cs_interest") || (["commerce", "arts", "vocational"].includes(stream) && tagSet.has("software_coding_interest")))) {
        score += 65; hasExplicitMatch = true; signalsFound.push("Selected Bachelor of Computer Applications (BCA)");
      }
      if (career.id === "msc_computer_science" && tagSet.has("bsc_cs_interest")) {
        score += 40; hasExplicitMatch = true; signalsFound.push("Identified Postgraduate Specialisation in Computer Science (M.Sc)");
      }
      if (career.id === "msc_ai_datascience" && (tagSet.has("ai_ml_interest") || tagSet.has("data_science_interest"))) {
        score += 40; hasExplicitMatch = true; signalsFound.push("Identified Postgraduate Specialisation in AI & Data Science (M.Sc)");
      }
      if (career.id === "msc_cybersecurity" && tagSet.has("cybersecurity_interest")) {
        score += 40; hasExplicitMatch = true; signalsFound.push("Identified Postgraduate Specialisation in Cybersecurity (M.Sc)");
      }
      if (career.id === "web_app_developer" && (tagSet.has("web_app_dev_interest") || tagSet.has("web_dev"))) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Web & Mobile App Development as a career interest");
      }
      if (career.id === "cloud_devops" && tagSet.has("cloud_devops_interest")) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Cloud Engineering & DevOps as a career interest");
      }
      if (career.id === "data_science" && (tagSet.has("data_science_interest") || tagSet.has("data_analysis"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Data Science & Big Analytics as a career interest");
      }
      if (career.id === "robotics_automation" && (tagSet.has("robotics_automation_interest") || tagSet.has("robotics_mechatronics"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Robotics & Autonomous Systems Engineering");
      }

      // Engineering
      if (career.id === "aerospace" && tagSet.has("aerospace_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Aerospace & Space Systems Engineering");
      }
      if (career.id === "aeronautical_eng" && tagSet.has("aeronautical_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Aeronautical Engineering & Aircraft Design");
      }
      if (career.id === "mechanical" && tagSet.has("mechanical_machinery_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Mechanical & Automotive Engineering");
      }
      if (career.id === "civil_structural" && tagSet.has("civil_struct_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Civil & Smart Infrastructure Engineering");
      }
      if (career.id === "biomedical_eng" && (tagSet.has("biomedical_eng_interest") || tagSet.has("biomedical_interest"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Biomedical Engineering & Healthcare Devices");
      }

      // Medicine & Medical Super-Specialisations (MBBS + MD/MS + DM/M.Ch)
      if (career.id === "medicine" && (tagSet.has("medicine_interest") || tagSet.has("clinical_medicine"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Medicine & Surgery (MBBS) as a career goal");
      }
      if (career.id === "neurology_specialist") {
        if (tagSet.has("neurology_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Specialisation in Neurology (DM Neurology)");
        } else if (tagSet.has("med_specialist_interest")) {
          score += 48; hasExplicitMatch = true; signalsFound.push("Interested in Medical Super-Specialisation (DM Neurology)");
        }
      }
      if (career.id === "cardiology_specialist") {
        if (tagSet.has("cardiology_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Specialisation in Cardiology (DM Cardiology)");
        } else if (tagSet.has("med_specialist_interest")) {
          score += 48; hasExplicitMatch = true; signalsFound.push("Interested in Medical Super-Specialisation (DM Cardiology)");
        }
      }
      if (career.id === "neurosurgery_specialist") {
        if (tagSet.has("neurosurgery_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Specialisation in Neurosurgery (M.Ch Neurosurgery)");
        } else if (tagSet.has("med_specialist_interest")) {
          score += 48; hasExplicitMatch = true; signalsFound.push("Interested in Medical Super-Specialisation (M.Ch Neurosurgery)");
        }
      }
      if (career.id === "psychiatry_specialist") {
        if (tagSet.has("psychiatry_specialist_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Specialisation in Psychiatry (MD Psychiatry)");
        } else if (tagSet.has("med_specialist_interest")) {
          score += 48; hasExplicitMatch = true; signalsFound.push("Interested in Medical Super-Specialisation (MD Psychiatry)");
        }
      }

      // Healthcare & Allied Health Sciences
      if (career.id === "cardiac_technology") {
        if (tagSet.has("cardiac_tech_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Cardiovascular & Cardiac Care Technology (B.Sc)");
        } else if (tagSet.has("allied_health_interest")) {
          score += 45; hasExplicitMatch = true; signalsFound.push("Interested in Allied Health Sciences");
        }
      }
      if (career.id === "medical_imaging_technology") {
        if (tagSet.has("medical_imaging_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Medical Imaging Technology & Radiology (B.Sc / BMIT)");
        } else if (tagSet.has("allied_health_interest")) {
          score += 45; hasExplicitMatch = true; signalsFound.push("Interested in Allied Health Sciences");
        }
      }
      if (career.id === "neurophysiology_technology") {
        if (tagSet.has("neurophysio_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Neurophysiology Technology & Diagnostics (B.Sc)");
        } else if (tagSet.has("allied_health_interest")) {
          score += 45; hasExplicitMatch = true; signalsFound.push("Interested in Allied Health Sciences");
        }
      }
      if (career.id === "radiotherapy_technology") {
        if (tagSet.has("radiotherapy_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Radiotherapy & Radiation Oncology Technology (B.Sc)");
        } else if (tagSet.has("allied_health_interest")) {
          score += 45; hasExplicitMatch = true; signalsFound.push("Interested in Allied Health Sciences");
        }
      }
      if (career.id === "respiratory_therapy") {
        if (tagSet.has("respiratory_therapy_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Respiratory Therapy & Critical Care (B.Sc)");
        } else if (tagSet.has("allied_health_interest")) {
          score += 45; hasExplicitMatch = true; signalsFound.push("Interested in Allied Health Sciences");
        }
      }
      if (career.id === "dialysis_technology") {
        if (tagSet.has("dialysis_tech_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Renal Dialysis Technology (B.Sc Dialysis)");
        } else if (tagSet.has("allied_health_interest")) {
          score += 45; hasExplicitMatch = true; signalsFound.push("Interested in Allied Health Sciences");
        }
      }
      if (career.id === "physician_assistant") {
        if (tagSet.has("physician_assistant_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Physician Assistant Studies (B.Sc PA)");
        } else if (tagSet.has("allied_health_interest")) {
          score += 45; hasExplicitMatch = true; signalsFound.push("Interested in Allied Health Sciences");
        }
      }
      if (career.id === "ot_anaesthesia_technology") {
        if (tagSet.has("ot_anaesthesia_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Operation Theatre & Anaesthesia Technology (B.Sc OTT)");
        } else if (tagSet.has("allied_health_interest")) {
          score += 45; hasExplicitMatch = true; signalsFound.push("Interested in Allied Health Sciences");
        }
      }
      if (career.id === "optometry") {
        if (tagSet.has("optometry_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Optometry & Vision Science (B.Optom)");
        } else if (tagSet.has("allied_health_interest")) {
          score += 45; hasExplicitMatch = true; signalsFound.push("Interested in Allied Health Sciences");
        }
      }
      if (career.id === "occupational_therapy") {
        if (tagSet.has("occupational_therapy_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Occupational Therapy & Functional Rehab (BOT)");
        } else if (tagSet.has("allied_health_interest")) {
          score += 45; hasExplicitMatch = true; signalsFound.push("Interested in Allied Health Sciences");
        }
      }
      if (career.id === "allied_health_lab") {
        if (tagSet.has("medical_lab_interest") || tagSet.has("pathology_lab_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Medical Laboratory Science & Allied Diagnostics");
        } else if (tagSet.has("allied_health_interest")) {
          score += 44; hasExplicitMatch = true; signalsFound.push("Interested in Allied Health Sciences");
        }
      }
      if (career.id === "biomedical_science" && (tagSet.has("pure_bio_research_interest") || tagSet.has("biotech_interest"))) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Biomedical Science & Molecular Pathology (B.Sc)");
      }
      if (career.id === "biotechnology" && (tagSet.has("biotech_interest") || tagSet.has("biotech_genetics"))) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Biotechnology & Genetic Engineering");
      }
      if (career.id === "pharmacy" && tagSet.has("pharmacy_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Pharmaceutical Sciences & Drug Research");
      }
      if (career.id === "bioinformatics" && tagSet.has("bioinfo_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Bioinformatics & Computational Biology");
      }
      if (career.id === "physiotherapy" && tagSet.has("physio_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Physiotherapy & Sports Rehabilitation (BPT)");
      }
      if (career.id === "nursing" && tagSet.has("nursing_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Nursing & Clinical Patient Care");
      }
      if (career.id === "dentistry" && tagSet.has("dentistry_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Dental Surgery & Oral Healthcare (BDS)");
      }
      if (career.id === "public_health" && tagSet.has("public_health_interest")) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Public Health & Epidemiology");
      }

      // Science & Research (Pure Sciences - No Engineering Bias)
      if (career.id === "physics_research") {
        if (tagSet.has("pure_physics_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Pure Physics & Quantum Material Research");
        } else if (tagSet.has("pure_science_interest") || tagSet.has("applied_physics")) {
          score += 50; hasExplicitMatch = true; signalsFound.push("Selected Core Physics & Fundamental Science Research");
        }
      }
      if (career.id === "chemistry_research") {
        if (tagSet.has("pure_chemistry_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Pure Chemical Sciences & Material Research");
        } else if (tagSet.has("pure_science_interest") || tagSet.has("chem_structures")) {
          score += 50; hasExplicitMatch = true; signalsFound.push("Selected Chemical Sciences & Material Research");
        }
      }
      if (career.id === "pure_science_maths") {
        if (tagSet.has("pure_maths_interest") || tagSet.has("pure_maths")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Pure Mathematics & Theoretical Research");
        }
      }
      if (career.id === "biology_research" && (tagSet.has("pure_bio_research_interest") || tagSet.has("biology_research_interest"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Biological Sciences & Cellular Research");
      }
      if (career.id === "neuroscience_research" && tagSet.has("pure_bio_research_interest")) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Neuroscience & Brain Biology Research");
      }
      if (career.id === "microbiology_research" && (tagSet.has("pure_bio_research_interest") || tagSet.has("life_sciences") || tagSet.has("microbiology"))) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Microbiology & Infectious Disease Research");
      }
      if (career.id === "biochemistry_research" && (tagSet.has("pure_bio_research_interest") || tagSet.has("pharmacy") || tagSet.has("organic_chem"))) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Biochemistry & Molecular Biology");
      }
      if (career.id === "genetics_genomics" && (tagSet.has("pure_bio_research_interest") || tagSet.has("biotech_genetics") || tagSet.has("genetics_dna"))) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Genetics, Genomics & CRISPR Research");
      }
      if (career.id === "zoology_wildlife" && (tagSet.has("pure_bio_research_interest") || tagSet.has("environmental") || tagSet.has("ecology_env"))) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Zoology & Wildlife Biology");
      }
      if (career.id === "botany_plant_science" && (tagSet.has("pure_bio_research_interest") || tagSet.has("environmental") || tagSet.has("ecology_env"))) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Botany & Plant Molecular Biology");
      }
      if (career.id === "astrophysics" && (tagSet.has("astrophysics_interest") || tagSet.has("astrophysics") || tagSet.has("optics_astronomy"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Astrophysics & Space Science Research");
      }

      // Commerce & Business
      if (career.id === "ca_auditing" && tagSet.has("ca_accounting_interest")) {
        score += 65; hasExplicitMatch = true; signalsFound.push("Selected Chartered Accountancy (CA) & Financial Auditing");
      }
      if (career.id === "cma_cost_accounting" && (tagSet.has("cma_interest") || tagSet.has("cma_accounting_interest") || tagSet.has("cost_accounting_interest"))) {
        score += 65; hasExplicitMatch = true; signalsFound.push("Selected Cost & Management Accountancy (CMA)");
      } else if (career.id === "cma_cost_accounting" && tagSet.has("ca_accounting_interest")) {
        score += 45; hasExplicitMatch = true; signalsFound.push("Interested in Accounting & Financial Management");
      }
      if (career.id === "accounting_taxation" && (tagSet.has("ca_accounting_interest") || tagSet.has("cma_interest") || tagSet.has("cma_accounting_interest"))) {
        score += 50; hasExplicitMatch = true; signalsFound.push("Selected Professional Accounting & Taxation (CPA)");
      }
      if (career.id === "commercial_banking" && (tagSet.has("banking_interest") || tagSet.has("commercial_banking_interest") || tagSet.has("retail_corporate_banking_interest"))) {
        score += 65; hasExplicitMatch = true; signalsFound.push("Selected Commercial Banking & Wealth Management");
      } else if (career.id === "commercial_banking" && tagSet.has("finance_stock_interest")) {
        score += 48; hasExplicitMatch = true; signalsFound.push("Interested in Banking & Financial Services");
      }
      if (career.id === "financial_analyst" && tagSet.has("finance_stock_interest")) {
        score += 65; hasExplicitMatch = true; signalsFound.push("Selected Investment Banking & Financial Analysis");
      }
      if (career.id === "business_analytics" && (tagSet.has("business_analytics_interest") || (tagSet.has("data_science_interest") && ["commerce", "arts"].includes(stream)))) {
        score += 65; hasExplicitMatch = true; signalsFound.push("Selected Business Analytics & Enterprise Intelligence");
      }
      if (career.id === "economics_analyst" && (tagSet.has("economics_interest") || tagSet.has("policy_interest"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Economics & Quantitative Policy Analysis");
      }
      if (career.id === "actuarial_science" && tagSet.has("actuarial_interest")) {
        score += 65; hasExplicitMatch = true; signalsFound.push("Selected Actuarial Science & Risk Analytics");
      }
      if (career.id === "business_management_bba" && tagSet.has("business_sales_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Business Administration & Management (BBA)");
      }
      if (career.id === "company_secretary" && tagSet.has("company_sec_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Company Secretary & Corporate Governance");
      }
      if (career.id === "marketing_digital" && tagSet.has("marketing_digital_interest")) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Digital Marketing & Brand Strategy");
      }
      if (career.id === "fintech_entrepreneurship" && tagSet.has("fintech_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected FinTech & Digital Business Management");
      }

      // Arts, Humanities & Creative
      if (career.id === "corporate_law" && (tagSet.has("corporate_law_interest") || tagSet.has("law_interest"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Corporate Law & Legal Practice");
      }
      if (career.id === "litigation_law" && tagSet.has("law_interest")) {
        score += 58; hasExplicitMatch = true; signalsFound.push("Selected Constitutional Law & Courtroom Litigation");
      }
      if (career.id === "psychology_counselling" && (tagSet.has("psychology_interest") || tagSet.has("clinical_psychology_interest") || tagSet.has("counselling_interest"))) {
        score += 65; hasExplicitMatch = true; signalsFound.push("Selected Psychology & Behavioral Counselling");
      }
      if (career.id === "civil_services" && tagSet.has("civils_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Civil Services Examination (IAS/IPS/IFS)");
      }
      if (career.id === "public_policy" && tagSet.has("policy_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Public Policy & Governance Analysis");
      }
      if (career.id === "journalism" && tagSet.has("journalism_interest")) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Investigative Journalism & News Media");
      }
      if (career.id === "commercial_photography") {
        if (tagSet.has("commercial_photography_interest") || tagSet.has("commercial_photo_interest")) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Professional & Commercial Photography");
        } else if (tagSet.has("camera_interest") && !tagSet.has("cinematography_camera_interest")) {
          score += 55; hasExplicitMatch = true; signalsFound.push("Selected Camera, Photography & Visual Arts");
        }
      }
      if (career.id === "cinematographer_camera" && (tagSet.has("cinematography_camera_interest") || tagSet.has("camera_interest"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Cinematography & Video Camera Operation");
      }
      if (career.id === "film_director") {
        if (hasExplicitFilmInterest) {
          score += 65; hasExplicitMatch = true; signalsFound.push("Selected Film Direction, Screenwriting & Cinema Production");
        } else {
          // Hard Single-Signal Protection: creativity, art or photography MUST NEVER recommend Film Director alone
          score -= 70;
        }
      }
      if (career.id === "animation_vfx" && (tagSet.has("animation_interest") || tagSet.has("animation_vfx_interest") || tagSet.has("3d_vfx_interest"))) {
        score += 65; hasExplicitMatch = true; signalsFound.push("Selected 3D Animation, CGI & VFX Production");
      }
      if (career.id === "actor_performer" && hasExplicitActingInterest) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Acting & Theatrical Performance");
      }
      if (career.id === "musician_singer" && hasExplicitMusicInterest) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Music Production & Vocal Performance");
      }
      if (career.id === "ui_ux_design" && (tagSet.has("ui_ux_interest") || tagSet.has("graphic_design_interest"))) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected UI/UX & Digital Product Design");
      }

      // Defence
      if (career.id === "defence_army" && hasArmyInterest) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Indian Army Officer (Combat & Tactical Command)");
      }
      if (career.id === "defence_navy" && hasNavyInterest) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Indian Navy Officer (Executive & Marine Operations)");
      }
      if (career.id === "defence_airforce" && hasAirForceInterest) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Indian Air Force Flying & Technical Officer");
      }
      if (career.id === "defence_tech" && hasDefenceTechInterest) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Defence Electronics & Military Tech");
      }

      // Aviation
      if (career.id === "commercial_pilot" && hasPilotInterest) {
        score += 65; hasExplicitMatch = true; signalsFound.push("Selected Commercial Aviation Pilot & Flight Operations");
      }
      if (career.id === "aircraft_maintenance_eng" && hasAircraftMaintInterest) {
        score += 60; hasExplicitMatch = true; signalsFound.push("Selected Aircraft Maintenance Engineering (AME)");
      }

      // Education & Teaching
      if (career.id === "cs_educator" && (tagSet.has("cs_teaching_interest") || (tagSet.has("teaching_interest") && hasMathSignal))) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected Computer Science Education & EdTech");
      }
      if (career.id === "science_stem_educator" && (tagSet.has("teaching_interest") || tagSet.has("stem_teaching_interest"))) {
        score += 55; hasExplicitMatch = true; signalsFound.push("Selected STEM Education & Academic Lecturing");
      }

      // -----------------------------------------------------------------
      // 3. SECONDARY SIGNALS: NATURAL STRENGTHS (+10 PTS)
      // -----------------------------------------------------------------
      if (strengthSet.has("problem_solving") && ["cs_software", "ai_ml", "cybersecurity", "mechanical", "aerospace", "bsc_computer_science", "bca_applications"].includes(career.id)) {
        score += 10; signalsFound.push("Problem Solving matches core engineering & algorithmic demands");
      }
      if (strengthSet.has("analytical_thinking") && ["data_science", "financial_analyst", "ca_auditing", "cma_cost_accounting", "business_analytics", "physics_research", "economics_analyst", "pure_science_maths"].includes(career.id)) {
        score += 10; signalsFound.push("Analytical Thinking aligns with rigorous data and quantitative analysis");
      }
      if (strengthSet.has("creativity") && ["ui_ux_design", "content_creation", "actor_performer", "cinematographer_camera", "musician_singer", "animation_vfx", "commercial_photography"].includes(career.id)) {
        score += 10; signalsFound.push("Creativity & Originality empowers artistic and media creation");
      }
      if (strengthSet.has("attention_detail") && ["neurophysiology_technology", "medical_imaging_technology", "radiotherapy_technology", "cardiac_technology", "dialysis_technology", "cma_cost_accounting", "ca_auditing"].includes(career.id)) {
        score += 10; signalsFound.push("Attention to Detail ensures high precision diagnostic and technical standards");
      }
      if (strengthSet.has("empathy") && ["psychology_clinical", "psychiatry_specialist", "nursing", "physiotherapy", "occupational_therapy", "respiratory_therapy"].includes(career.id)) {
        score += 10; signalsFound.push("High Empathy aligns with compassionate patient and counseling care");
      }
      if (strengthSet.has("spatial_thinking") && ["neurosurgery_specialist", "aerospace", "aeronautical_eng", "commercial_pilot", "animation_vfx"].includes(career.id)) {
        score += 10; signalsFound.push("3D Spatial Thinking provides natural aptitude for surgical/aerospace navigation");
      }

      // -----------------------------------------------------------------
      // 4. SECONDARY SIGNALS: PREFERENCES & ENVIRONMENT (+10 PTS)
      // -----------------------------------------------------------------
      if (prefSet.has("research_investigation") && ["physics_research", "chemistry_research", "biology_research", "neuroscience_research", "biomedical_science", "pure_science_maths"].includes(career.id)) {
        score += 10; signalsFound.push("Preference for scientific investigation and laboratory discovery");
      }
      if (prefSet.has("working_tech") && (career.category === "Technology" || alliedHealthCareers.includes(career.id))) {
        score += 8; signalsFound.push("Preference for working with advanced technology and clinical instrumentation");
      }
      if (prefSet.has("helping_others") && (career.category === "Medical & Healthcare" || career.category === "Education")) {
        score += 8; signalsFound.push("Commitment to helping and healing individuals");
      }
      if (prefSet.has("creativity_art") && career.category === "Creative & Media" && career.id !== "film_director") {
        score += 10; signalsFound.push("Thrives in imaginative, creative and aesthetic design environments");
      }

      // -----------------------------------------------------------------
      // 5. SUPPORTING SIGNALS: EXTRACURRICULAR ACTIVITIES (+5 PTS)
      // -----------------------------------------------------------------
      if (extraSet.has("coding_clubs") && (career.category === "Technology" || ["bsc_computer_science", "bca_applications"].includes(career.id))) {
        score += 5; signalsFound.push("Active participation in coding clubs demonstrates hands-on programming drive");
      }
      if (extraSet.has("robotics") && ["robotics_automation", "mechanical", "aerospace"].includes(career.id)) {
        score += 5; signalsFound.push("Robotics lab experience provides applied electro-mechanical foundations");
      }
      if (extraSet.has("art_drawing") && ["ui_ux_design", "animation_vfx", "commercial_photography"].includes(career.id)) {
        score += 5; signalsFound.push("Sketching and visual art hobby enriches creative workflows");
      }
      if (extraSet.has("music") && career.id === "musician_singer" && hasExplicitMusicInterest) {
        score += 5; signalsFound.push("Musical practice validates dedicated performing ability");
      }
      if (extraSet.has("dance") && career.id === "actor_performer" && hasExplicitActingInterest) {
        score += 5; signalsFound.push("Dance discipline provides physical stage presence");
      }
      if (extraSet.has("ncc") && career.category === "Defence" && hasExplicitDefenceInterest) {
        score += 5; signalsFound.push("NCC cadet background instills military parade discipline");
      }
      if (extraSet.has("teaching_tutoring") && career.category === "Education" && hasExplicitTeachingInterest) {
        score += 5; signalsFound.push("Peer tutoring experience confirms instructional empathy");
      }

      // -----------------------------------------------------------------
      // 6. NEGATIVE SIGNALS & SINGLE-SIGNAL DEFENSE FILTERS
      // -----------------------------------------------------------------
      if (career.category === "Defence" && !hasExplicitDefenceInterest) {
        score -= 80;
      }
      if (career.id === "commercial_pilot" && !hasPilotInterest) {
        score -= 80;
      }
      if (career.id === "professional_athlete" && !hasExplicitAthleteInterest) {
        score -= 60;
      }
      if (career.id === "musician_singer" && !hasExplicitMusicInterest && tagSet.size > 0) {
        score -= 50;
      }
      if (career.category === "Education" && !hasExplicitTeachingInterest) {
        score -= 40;
      }
      if (career.id === "bioinformatics" && !hasBioSignal && !tagSet.has("bioinfo_interest")) {
        score -= 80;
      }

      // Avoidance Deductions
      if (avoidSet.has("avoid_patient_care") && clinicalMedicalCareers.includes(career.id)) {
        score -= 50;
      }
      if (avoidSet.has("avoid_desk_computer") && (career.category === "Technology" || career.id === "data_science")) {
        score -= 40;
      }
      if (avoidSet.has("avoid_numbers") && ["actuarial_science", "data_science", "ca_auditing", "cma_cost_accounting", "pure_science_maths"].includes(career.id)) {
        score -= 60;
      }

      // Compute student-friendly Match Percentage (60% to 95%)
      let matchScore = 60;
      if (score > 0) {
        matchScore = Math.max(60, Math.min(95, 60 + Math.round(score * 0.4)));
      } else if (score < -50) {
        matchScore = 35;
      } else {
        matchScore = Math.max(40, 60 + Math.round(score * 0.3));
      }

      // Fallback signals if empty
      if (signalsFound.length === 0) {
        if (isStreamCompatible) {
          signalsFound.push(`Standard eligible pathway for **${streamName}** stream`);
        } else {
          signalsFound.push("Exploratory career pathway");
        }
      }

      scoredCareers.push({
        ...career,
        matchScore,
        matchReasonList: signalsFound,
        rawScore: score
      });
    });

    // Sort descending by matchScore, then by rawScore
    scoredCareers.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return b.rawScore - a.rawScore;
    });

    const topMatches = scoredCareers.slice(0, 5);

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
