// CAREERQUEST AI - Simplified & Student-Friendly Assessment Question Database

window.STREAMS = [
  {
    id: "pcm",
    title: "Science – PCM",
    subtitle: "Physics, Chemistry & Mathematics",
    description: "Focus on math logic, physical laws, engineering, and problem solving.",
    icon: "📐"
  },
  {
    id: "pcb",
    title: "Science – PCB",
    subtitle: "Physics, Chemistry & Biology",
    description: "Focus on human biology, medical science, life sciences, and healthcare.",
    icon: "🧬"
  },
  {
    id: "pcmb",
    title: "Science – PCMB / Bio-Maths",
    subtitle: "Physics, Chemistry, Maths & Biology",
    description: "Dual focus on biological sciences and quantitative engineering.",
    icon: "🔬"
  },
  {
    id: "cs_maths",
    title: "Science – Computer Science + Maths",
    subtitle: "Computer Science & Mathematics",
    description: "Focus on software coding, logic, computers, and digital tech.",
    icon: "💻"
  },
  {
    id: "commerce",
    title: "Commerce",
    subtitle: "Accounts, Finance & Business",
    description: "Focus on business, financial markets, accountancy, and economics.",
    icon: "📊"
  },
  {
    id: "arts",
    title: "Humanities / Arts",
    subtitle: "Law, History, Psychology & Policy",
    description: "Focus on human society, literature, law, governance, and creative arts.",
    icon: "⚖️"
  },
  {
    id: "vocational",
    title: "Vocational / Other",
    subtitle: "Applied Technical & Practical Skills",
    description: "Focus on practical trades, applied tech, design, and hands-on skills.",
    icon: "🛠️"
  }
];

// Extracurricular Activities Options (SUPPORTING Signals Only)
window.EXTRACURRICULAR_OPTIONS = [
  { id: "ncc", label: "NCC Cadet", icon: "🎖️", tag: "leadership_discipline" },
  { id: "nss", label: "NSS Volunteer", icon: "🤝", tag: "social_service" },
  { id: "coding_clubs", label: "Coding Clubs / Hackathons", icon: "⌨️", tag: "tech_building" },
  { id: "robotics", label: "Robotics & Hardware Labs", icon: "🤖", tag: "hardware_engineering" },
  { id: "science_exhibitions", label: "Science Fairs & Exhibitions", icon: "🔬", tag: "scientific_inquiry" },
  { id: "projects", label: "Building Personal Projects", icon: "🔨", tag: "hands_on_building" },
  { id: "competitions", label: "Academic Competitions", icon: "🏆", tag: "problem_solving" },
  { id: "leadership", label: "Student Leadership / Prefects", icon: "👑", tag: "leadership" },
  { id: "teaching_tutoring", label: "Tutoring Classmates", icon: "🎓", tag: "teaching_mentoring" },
  { id: "peer_mentoring", label: "Peer Mentoring", icon: "💡", tag: "teaching_mentoring" },
  { id: "sports", label: "Sports & Athletics", icon: "⚽", tag: "teamwork_discipline" },
  { id: "swimming", label: "Swimming & Fitness", icon: "🏊", tag: "discipline_endurance" },
  { id: "music", label: "Music & Singing", icon: "🎵", tag: "creative_arts" },
  { id: "dance", label: "Dance & Performing Arts", icon: "💃", tag: "creative_performance" },
  { id: "art_drawing", label: "Art & Sketching", icon: "🎨", tag: "visual_creativity" },
  { id: "photography", label: "Photography & Video", icon: "📷", tag: "visual_media" },
  { id: "content_creation", label: "Blogging & Content Creation", icon: "🎬", tag: "media_communication" },
  { id: "gaming", label: "Gaming & Strategy Games", icon: "🎮", tag: "strategy_logic" },
  { id: "reading", label: "Reading Books & Literature", icon: "📚", tag: "analytical_inquiry" },
  { id: "writing", label: "Writing & Debating", icon: "✍️", tag: "verbal_expression" },
  { id: "volunteering", label: "Community Service", icon: "❤️", tag: "empathy_service" },
  { id: "travel", label: "Travel & Cultural Exploration", icon: "✈️", tag: "curiosity_adaptability" },
  { id: "fitness", label: "Gym & Fitness Training", icon: "🏋️", tag: "discipline_health" },
  { id: "other", label: "Other Personal Hobbies", icon: "🌟", tag: "general_interest" }
];

// Natural Strengths Options
window.STRENGTHS_OPTIONS = [
  { id: "problem_solving", label: "Problem Solving", icon: "🧩" },
  { id: "creativity", label: "Creativity & Originality", icon: "💡" },
  { id: "leadership", label: "Leadership", icon: "👑" },
  { id: "communication", label: "Communication", icon: "🗣️" },
  { id: "teamwork", label: "Teamwork", icon: "👥" },
  { id: "analytical_thinking", label: "Analytical Thinking", icon: "🔍" },
  { id: "attention_detail", label: "Attention to Detail", icon: "🎯" },
  { id: "discipline", label: "Discipline", icon: "⚙️" },
  { id: "organization", label: "Organization & Planning", icon: "📋" },
  { id: "empathy", label: "Empathy & Compassion", icon: "❤️" },
  { id: "learning_quickly", label: "Learning Quickly", icon: "⚡" },
  { id: "critical_thinking", label: "Critical Thinking", icon: "🧠" },
  { id: "decision_making", label: "Decision Making Under Pressure", icon: "⚖️" },
  { id: "working_under_pressure", label: "Working Under Pressure", icon: "🛡️" },
  { id: "patience", label: "Patience & Perseverance", icon: "⏳" },
  { id: "spatial_thinking", label: "Spatial & 3D Thinking", icon: "📐" },
  { id: "numerical_ability", label: "Numerical Ability", icon: "🔢" },
  { id: "explaining_concepts", label: "Explaining Concepts Clearly", icon: "📢" },
  { id: "public_speaking", label: "Public Speaking", icon: "🎙️" },
  { id: "mentoring_others", label: "Mentoring Others", icon: "🌱" }
];

// Career Preferences & Environment Options
window.PREFERENCES_OPTIONS = [
  { id: "working_tech", label: "Working with tech & software", icon: "💻" },
  { id: "working_people", label: "Working with people & patients", icon: "🤝" },
  { id: "working_machines", label: "Working with machines & tools", icon: "⚙️" },
  { id: "working_data", label: "Working with data & numbers", icon: "📊" },
  { id: "research_investigation", label: "Scientific research & lab work", icon: "🔬" },
  { id: "building_things", label: "Building physical or digital products", icon: "🏗️" },
  { id: "solving_complex_problems", label: "Solving complex logic puzzles", icon: "🧩" },
  { id: "creativity_art", label: "Expressing creative design & writing", icon: "🎨" },
  { id: "leadership_mgmt", label: "Leading teams & projects", icon: "👔" },
  { id: "helping_others", label: "Helping others learn or heal", icon: "🌿" },
  { id: "working_outdoors", label: "Working outdoors & field sites", icon: "🏔️" },
  { id: "defence_service_pref", label: "Uniformed defence service", icon: "🎖️" },
  { id: "aviation_pilot_pref", label: "Flying commercial aircraft", icon: "✈️" },
  { id: "business_entrepreneurship", label: "Business, markets & startups", icon: "📈" },
  { id: "teaching_explaining", label: "Teaching & sharing knowledge", icon: "📚" },
  { id: "high_responsibility", label: "High-responsibility roles", icon: "🚀" }
];

// Avoidance Options (Negative / Dislike Signals)
window.AVOIDANCE_OPTIONS = [
  { id: "avoid_patient_care", label: "Patient-facing work", icon: "🚫" },
  { id: "avoid_field_outdoor", label: "Heavy field/outdoor work", icon: "🚫" },
  { id: "avoid_desk_computer", label: "Mostly desk/computer work", icon: "🚫" },
  { id: "avoid_repetitive", label: "Highly repetitive work", icon: "🚫" },
  { id: "avoid_public_speaking", label: "Public speaking", icon: "🚫" },
  { id: "avoid_high_pressure", label: "High-pressure environments", icon: "🚫" },
  { id: "avoid_numbers", label: "Working with numbers", icon: "🚫" },
  { id: "avoid_machines", label: "Working with machines", icon: "🚫" },
  { id: "no_avoidance_pref", label: "No strong preference", icon: "✅" }
];


// Stream-Specific Assessment Questionnaire Modules
window.STREAM_QUESTIONS = {
  pcm: [
    {
      id: "pcm_subject_depth",
      question: "What topics do you enjoy most?",
      subtitle: "Select subjects or topics that spark your interest.",
      type: "multi",
      options: [
        { id: "calc_alg", label: "Pure Maths (Calculus & Algebra)", tag: "pure_maths" },
        { id: "phys_mech", label: "Applied Physics (Mechanics & Energy)", tag: "applied_physics" },
        { id: "elec_circuits", label: "Electronics & Circuits", tag: "electronics" },
        { id: "optics_astronomy", label: "Space, Optics & Astronomy", tag: "astrophysics" },
        { id: "chem_structures", label: "Chemistry & Material Science", tag: "chemistry" },
        { id: "spatial_geom", label: "3D Geometry & Spatial Design", tag: "spatial_design" }
      ]
    },
    {
      id: "pcm_problem_style",
      question: "Which career direction interests you?",
      subtitle: "Select practical fields you want to explore.",
      type: "multi",
      options: [
        { id: "software_code", label: "Software & App Development", tag: "software_coding_interest" },
        { id: "bsc_computing_degree", label: "B.Sc Computer Science, AI & Data Science", tag: "bsc_cs_interest" },
        { id: "pure_physics_res", label: "Pure Physics & Quantum Material Research", tag: "pure_physics_interest" },
        { id: "pure_chem_res", label: "Pure Chemistry & Chemical Research", tag: "pure_chemistry_interest" },
        { id: "pure_maths_res", label: "Pure Mathematics & Quantitative Analytics", tag: "pure_maths_interest" },
        { id: "mechanical_machinery", label: "Machinery, Engines & Robotics", tag: "mechanical_machinery_interest" },
        { id: "civil_construction", label: "Civil Construction & Smart Cities", tag: "civil_struct_interest" },
        { id: "aerospace_space", label: "Rockets & Space Technology", tag: "aerospace_interest" },
        { id: "aeronautical_aircraft", label: "Aircraft & Aeronautical Design", tag: "aeronautical_interest" },
        { id: "commercial_pilot_spec", label: "Commercial Aviation Pilot", tag: "pilot_interest" },
        { id: "defence_tech_iaf", label: "Defence Electronics & IAF Tech", tag: "defence_tech_interest" },
        { id: "teaching_pcm", label: "Teaching STEM or Academic Lecturing", tag: "teaching_interest" }
      ]
    }
  ],

  pcb: [
    {
      id: "pcb_subject_depth",
      question: "What topics do you enjoy most?",
      subtitle: "Select biology and chemistry topics you like.",
      type: "multi",
      options: [
        { id: "human_anatomy", label: "Human Anatomy & Medical Science", tag: "clinical_medicine" },
        { id: "genetics_dna", label: "Genetics & DNA Editing", tag: "biotech_genetics" },
        { id: "organic_chem", label: "Chemistry & Medicines", tag: "pharmacy" },
        { id: "muscular_rehab", label: "Physical Therapy & Movement", tag: "physiotherapy" },
        { id: "microbiology", label: "Microbiology & Vaccines", tag: "life_sciences" },
        { id: "ecology_env", label: "Ecology & Wildlife Science", tag: "environmental" }
      ]
    },
    {
      id: "pcb_career_direction",
      question: "Which healthcare or life science direction interests you?",
      subtitle: "Select healthcare, medicine, allied health and research pathways.",
      type: "multi",
      options: [
        { id: "doctor_mbbs", label: "Medical Doctor (MBBS) & Clinical Surgery", tag: "medicine_interest" },
        { id: "med_super_neuro", label: "Neurology Specialisation (DM Neurology / Neurosurgery)", tag: "neurology_interest" },
        { id: "med_super_cardio", label: "Cardiology Specialisation (DM Cardiology)", tag: "cardiology_interest" },
        { id: "med_super_psych", label: "Psychiatry Specialisation (MD Psychiatry)", tag: "psychiatry_specialist_interest" },
        { id: "allied_cardiac_tech", label: "Cardiac Care & Cardiovascular Technology (B.Sc)", tag: "cardiac_tech_interest" },
        { id: "allied_medical_imaging", label: "Medical Imaging Technology & Radiology (B.Sc)", tag: "medical_imaging_interest" },
        { id: "allied_neuro_tech", label: "Neurophysiology Technology & Diagnostics (B.Sc)", tag: "neurophysio_interest" },
        { id: "allied_general_tech", label: "Allied Health Sciences (Dialysis, OT/Anaesthesia, PA, Optometry, MLT)", tag: "allied_health_interest" },
        { id: "biotech_research", label: "Biotech & Genetic Lab Research", tag: "biotech_interest" },
        { id: "pure_bio_research", label: "Biological Sciences Research (Neuroscience, Microbiology, Genetics)", tag: "pure_bio_research_interest" },
        { id: "pharma_drug", label: "Pharmacy & Drug Development (B.Pharm)", tag: "pharmacy_interest" },
        { id: "physio_rehab", label: "Physiotherapy & Sports Recovery (BPT)", tag: "physio_interest" },
        { id: "teaching_bio", label: "Teaching Biology & Lecturing", tag: "teaching_interest" },
        { id: "healthtech_digital", label: "HealthTech Apps & Telemedicine", tag: "healthtech_interest" }
      ]
    }
  ],

  pcmb: [
    {
      id: "pcmb_balance",
      question: "Where does your focus lean?",
      subtitle: "Select interdisciplinary or focused science paths.",
      type: "multi",
      options: [
        { id: "pcmb_medicine", label: "Clinical Medicine & Doctor Focus (MBBS / Specialisations)", tag: "medicine_interest" },
        { id: "pcmb_allied_health", label: "Allied Health Sciences (Cardiac, Imaging, Dialysis Tech, PA)", tag: "allied_health_interest" },
        { id: "pcmb_engineering", label: "Engineering & Applied Tech Focus", tag: "engineering_interest" },
        { id: "pcmb_bioinfo", label: "Bioinformatics & DNA Data Analysis", tag: "bioinfo_interest" },
        { id: "pcmb_biomed", label: "Medical Devices & Artificial Organs", tag: "biomedical_interest" },
        { id: "pcmb_pure_science", label: "Pure Physics, Chemistry or Biological Research", tag: "pure_science_interest" },
        { id: "pcmb_aviation_pilot", label: "Commercial Pilot or Aerospace", tag: "pilot_interest" },
        { id: "pcmb_teaching", label: "STEM Teacher or Researcher", tag: "teaching_interest" }
      ]
    }
  ],

  cs_maths: [
    {
      id: "cs_tech_depth",
      question: "Which tech field interests you most?",
      subtitle: "Select computing areas you want to build with.",
      type: "multi",
      options: [
        { id: "software_apps", label: "Software Engineering & Cloud Apps (B.Tech / B.Sc / BCA)", tag: "software_coding_interest" },
        { id: "ai_algorithms", label: "AI & Machine Learning", tag: "ai_ml_interest" },
        { id: "data_analytics", label: "Data Science & Big Data", tag: "data_science_interest" },
        { id: "cyber_security", label: "Cybersecurity & Ethical Hacking", tag: "cybersecurity_interest" },
        { id: "bsc_bca_pathway", label: "B.Sc Computer Science / BCA & Systems Architecture", tag: "bsc_cs_interest" },
        { id: "game_ui", label: "UI/UX & Product Design", tag: "ui_ux_interest" },
        { id: "teaching_coding", label: "Teaching Coding & EdTech", tag: "teaching_interest" },
        { id: "defence_cyber", label: "Defence Cyber & Military Encryption", tag: "defence_tech_interest" }
      ]
    }
  ],

  commerce: [
    {
      id: "commerce_subject_depth",
      question: "Which business field fits your goal?",
      subtitle: "Select financial, accounting or management domains.",
      type: "multi",
      options: [
        { id: "accounting_audit", label: "Chartered Accountancy (CA) & Audit", tag: "ca_accounting_interest" },
        { id: "cma_costing", label: "Cost & Management Accountancy (CMA) - ICMAI", tag: "cma_interest" },
        { id: "stock_markets", label: "Investment Banking & Stocks", tag: "finance_stock_interest" },
        { id: "banking_wealth", label: "Commercial Banking & Wealth Management", tag: "banking_interest" },
        { id: "economics_analyst_opt", label: "Economics & Public Policy Analysis", tag: "economics_interest" },
        { id: "business_analytics_opt", label: "Business Analytics & Enterprise Intelligence", tag: "business_analytics_interest" },
        { id: "actuarial_risk", label: "Actuarial Science & Risk Math", tag: "actuarial_interest" },
        { id: "business_mgmt", label: "Business Administration & Management (BBA)", tag: "business_sales_interest" },
        { id: "fintech_startups", label: "FinTech & Tech Startups", tag: "fintech_interest" },
        { id: "law_governance", label: "Corporate Law & Business Rules", tag: "corporate_law_interest" }
      ]
    }
  ],

  arts: [
    {
      id: "arts_subject_depth",
      question: "Which humanities or creative field interests you most?",
      subtitle: "Select legal, media, social science or creative arts pathways.",
      type: "multi",
      options: [
        { id: "arts_law", label: "Law & Legal Advocacy", tag: "law_interest" },
        { id: "arts_psychology", label: "Psychology & Behavioral Counselling", tag: "psychology_interest" },
        { id: "arts_civils", label: "Civil Services (IAS/IPS) & Polity", tag: "civils_interest" },
        { id: "arts_policy", label: "Public Policy & International Diplomacy", tag: "policy_interest" },
        { id: "arts_journalism", label: "Journalism & News Reporting", tag: "journalism_interest" },
        { id: "arts_acting", label: "Acting, Theatre & Performance Arts", tag: "acting_interest" },
        { id: "arts_photography", label: "Professional Photography & Visual Media", tag: "commercial_photography_interest" },
        { id: "arts_camera", label: "Cinematography & Video Camera Operation", tag: "camera_interest" },
        { id: "arts_filmmaking", label: "Film Direction, Screenwriting & Cinema Production", tag: "filmmaking_interest" },
        { id: "arts_animation", label: "3D Animation, VFX & Visual Arts", tag: "animation_interest" },
        { id: "arts_music", label: "Music, Singing & Sound Production", tag: "music_interest" },
        { id: "arts_ui_ux", label: "Graphic Design, Branding & UI/UX", tag: "ui_ux_interest" },
        { id: "arts_teaching", label: "Teaching History, Literature or Social Science", tag: "teaching_interest" }
      ]
    }
  ],

  vocational: [
    {
      id: "vocational_focus",
      question: "Which practical skill or creative field fits you best?",
      subtitle: "Select applied technical, media or hands-on domains.",
      type: "multi",
      options: [
        { id: "voc_mechanical", label: "Machinery & Workshop Mechanics", tag: "mechanical_machinery_interest" },
        { id: "voc_coding_it", label: "Applied IT & Computer Maintenance", tag: "software_coding_interest" },
        { id: "voc_business_sales", label: "Business Operations & Retail", tag: "business_sales_interest" },
        { id: "voc_design_graphics", label: "Digital Design & Video Editing", tag: "ui_ux_interest" },
        { id: "voc_camera", label: "Photography, Video Shooting & Camera Work", tag: "camera_interest" },
        { id: "voc_acting", label: "Acting & Performing Arts", tag: "acting_interest" },
        { id: "voc_healthcare_support", label: "Physical Rehab & Health Support", tag: "physio_interest" },
        { id: "voc_defence_explicit", label: "Explicit interest in Armed Forces", tag: "defence_army_interest" },
        { id: "voc_pilot_explicit", label: "Explicit interest in Commercial Pilot", tag: "pilot_interest" }
      ]
    }
  ]
};
