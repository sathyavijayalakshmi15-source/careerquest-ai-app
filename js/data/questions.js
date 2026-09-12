// CAREERQUEST AI - Dynamic Assessment Question Database

window.STREAMS = [
  {
    id: "pcm",
    title: "Science – PCM",
    subtitle: "Physics, Chemistry & Mathematics",
    description: "Focus on mathematical reasoning, physical laws, engineering logic, and quantitative analysis.",
    icon: "📐"
  },
  {
    id: "pcb",
    title: "Science – PCB",
    subtitle: "Physics, Chemistry & Biology",
    description: "Focus on living organisms, medical science, biological systems, and healthcare research.",
    icon: "🧬"
  },
  {
    id: "pcmb",
    title: "Science – PCMB / Bio-Maths",
    subtitle: "Physics, Chemistry, Maths & Biology",
    description: "Dual focus on biological life sciences AND quantitative mathematical/engineering principles.",
    icon: "🔬"
  },
  {
    id: "cs_maths",
    title: "Science – Computer Science + Maths",
    subtitle: "CS, Maths, Physics & Tech",
    description: "Specialized focus on software coding, algorithmic logic, computation, and technological innovation.",
    icon: "💻"
  },
  {
    id: "commerce",
    title: "Commerce",
    subtitle: "Accountancy, Business, Finance & Economics",
    description: "Focus on corporate financial systems, markets, trade economics, business strategy, and taxation.",
    icon: "📊"
  },
  {
    id: "arts",
    title: "Humanities / Arts",
    subtitle: "History, Political Science, Psychology, Literature & Law",
    description: "Focus on human society, literature, governance, psychological behavior, law, and creative expression.",
    icon: "⚖️"
  },
  {
    id: "vocational",
    title: "Vocational / Other",
    subtitle: "Applied Technical, Creative & Practical Skills",
    description: "Focus on practical trades, hands-on building, design tools, applied entrepreneurship, and specialized skills.",
    icon: "🛠️"
  }
];

// Extracurricular Activities Options
window.EXTRACURRICULAR_OPTIONS = [
  { id: "ncc", label: "NCC (National Cadet Corps)", icon: "🎖️", tag: "leadership_discipline" },
  { id: "nss", label: "NSS (National Service Scheme)", icon: "🤝", tag: "social_service" },
  { id: "coding_clubs", label: "Coding Clubs / Hackathons", icon: "⌨️", tag: "tech_building" },
  { id: "robotics", label: "Robotics & Hardware Labs", icon: "🤖", tag: "hardware_engineering" },
  { id: "science_exhibitions", label: "Science Exhibitions & Fairs", icon: "🔬", tag: "scientific_inquiry" },
  { id: "projects", label: "Independent Projects / Building", icon: "🔨", tag: "hands_on_building" },
  { id: "competitions", label: "Academic / Olympiad Competitions", icon: "🏆", tag: "problem_solving" },
  { id: "leadership", label: "Student Leadership / Prefect Council", icon: "👑", tag: "leadership" },
  { id: "teaching_tutoring", label: "Teaching / Tutoring Classmates", icon: "🎓", tag: "teaching_mentoring" },
  { id: "peer_mentoring", label: "Peer Mentoring & Guidance", icon: "💡", tag: "teaching_mentoring" },
  { id: "sports", label: "Sports & Athletics", icon: "⚽", tag: "teamwork_discipline" },
  { id: "swimming", label: "Swimming & Fitness", icon: "🏊", tag: "discipline_endurance" },
  { id: "music", label: "Music / Singing / Instruments", icon: "🎵", tag: "creative_arts" },
  { id: "dance", label: "Dance & Performing Arts", icon: "💃", tag: "creative_performance" },
  { id: "art_drawing", label: "Art / Drawing / Sketching", icon: "🎨", tag: "visual_creativity" },
  { id: "photography", label: "Photography & Videography", icon: "📷", tag: "visual_media" },
  { id: "content_creation", label: "Video / Content Creation / Blogging", icon: "🎬", tag: "media_communication" },
  { id: "gaming", label: "Gaming & Esports / Strategy Games", icon: "🎮", tag: "strategy_logic" },
  { id: "reading", label: "Reading Non-Fiction / Literature", icon: "📚", tag: "analytical_inquiry" },
  { id: "writing", label: "Creative Writing / Debating / Essays", icon: "✍️", tag: "verbal_expression" },
  { id: "volunteering", label: "Volunteering / Community Service", icon: "❤️", tag: "empathy_service" },
  { id: "travel", label: "Travel / Cultural Exploration", icon: "✈️", tag: "curiosity_adaptability" },
  { id: "fitness", label: "Fitness & Gym Training", icon: "🏋️", tag: "discipline_health" },
  { id: "other", label: "Other Personal Pursuits", icon: "🌟", tag: "general_interest" }
];

// Natural Strengths Options
window.STRENGTHS_OPTIONS = [
  { id: "problem_solving", label: "Problem Solving", icon: "🧩" },
  { id: "creativity", label: "Creativity & Originality", icon: "💡" },
  { id: "leadership", label: "Leadership & Vision", icon: "👑" },
  { id: "communication", label: "Communication & Expression", icon: "🗣️" },
  { id: "teamwork", label: "Teamwork & Collaboration", icon: "👥" },
  { id: "analytical_thinking", label: "Analytical Thinking", icon: "🔍" },
  { id: "attention_detail", label: "Attention to Detail", icon: "🎯" },
  { id: "discipline", label: "Discipline & Consistency", icon: "⚙️" },
  { id: "organization", label: "Organization & Planning", icon: "📋" },
  { id: "empathy", label: "Empathy & Compassion", icon: "❤️" },
  { id: "learning_quickly", label: "Learning Quickly", icon: "⚡" },
  { id: "critical_thinking", label: "Critical Thinking", icon: "🧠" },
  { id: "decision_making", label: "Decision Making Under Pressure", icon: "⚖️" },
  { id: "working_under_pressure", label: "Working Under Pressure", icon: "🛡️" },
  { id: "patience", label: "Patience & Perseverance", icon: "⏳" },
  { id: "explaining_concepts", label: "Explaining Concepts Clearly", icon: "📢" },
  { id: "public_speaking", label: "Public Speaking & Debating", icon: "🎙️" },
  { id: "mentoring_others", label: "Mentoring & Guiding Others", icon: "🌱" }
];

// Career Preferences Options
window.PREFERENCES_OPTIONS = [
  { id: "working_tech", label: "Working with cutting-edge technology & software", icon: "💻" },
  { id: "working_people", label: "Working closely with people, patients, or communities", icon: "🤝" },
  { id: "research_investigation", label: "Deep scientific research & investigation", icon: "🔬" },
  { id: "building_things", label: "Building physical or digital products & structures", icon: "🏗️" },
  { id: "solving_complex_problems", label: "Solving complex, high-stakes mathematical or logical problems", icon: "🧩" },
  { id: "creativity_art", label: "Expressing visual design, writing, or creative arts", icon: "🎨" },
  { id: "leadership_mgmt", label: "Leading teams, projects, and organizational vision", icon: "👔" },
  { id: "helping_others", label: "Directly helping others grow, heal, or learn", icon: "🌿" },
  { id: "working_outdoors", label: "Working outdoors, in aviation, at sea, or in the field", icon: "🏔️" },
  { id: "structured_envs", label: "Structured, predictable, and rule-based environments", icon: "🏛️" },
  { id: "business_entrepreneurship", label: "Business growth, finance, markets & entrepreneurship", icon: "📈" },
  { id: "teaching_explaining", label: "Teaching, lecturing, and sharing knowledge with others", icon: "📚" },
  { id: "high_responsibility", label: "High-responsibility roles with critical real-world impact", icon: "🚀" }
];

// Stream-Specific Assessment Questionnaire Modules
window.STREAM_QUESTIONS = {
  pcm: [
    {
      id: "pcm_subject_depth",
      question: "Which aspects of Mathematics and Physics interest you most?",
      type: "multi",
      options: [
        { id: "calc_alg", label: "Pure Mathematics (Calculus, Algebra, Probability)", tag: "pure_maths" },
        { id: "phys_mech", label: "Applied Physics (Mechanics, Forces, Thermodynamics)", tag: "applied_physics" },
        { id: "elec_circuits", label: "Electricity, Magnetism & Electronic Circuits", tag: "electronics" },
        { id: "optics_astronomy", label: "Optics, Modern Physics & Cosmology / Space", tag: "astrophysics" },
        { id: "chem_structures", label: "Chemical Thermodynamics & Molecular Reactions", tag: "chemistry" },
        { id: "spatial_geom", label: "Geometry, 3D Coordinates & Spatial Modeling", tag: "spatial_design" }
      ]
    },
    {
      id: "pcm_problem_style",
      question: "How do you prefer to apply your quantitative and technical skills?",
      type: "multi",
      options: [
        { id: "software_code", label: "Writing computer code to automate tasks and build apps", tag: "tech_software" },
        { id: "hardware_machines", label: "Building machinery, engines, drones, or mechanical prototypes", tag: "mechanical_robotics" },
        { id: "structures_buildings", label: "Designing physical buildings, bridges, or urban blueprints", tag: "civil_arch" },
        { id: "aerospace_flight", label: "Understanding flight aerodynamics, rockets, or aviation systems", tag: "aviation_aerospace" },
        { id: "pure_theorems", label: "Proving abstract mathematical theorems or physics theories", tag: "research" },
        { id: "explaining_maths", label: "Explaining physics/maths concepts to help others understand easily", tag: "teaching_maths" }
      ]
    }
  ],

  pcb: [
    {
      id: "pcb_subject_depth",
      question: "Which areas of Biology and Chemistry engage you the most?",
      type: "multi",
      options: [
        { id: "human_anatomy", label: "Human Anatomy, Physiology & Pathology", tag: "clinical_medicine" },
        { id: "genetics_dna", label: "Genetics, Cell Biology & DNA Editing (CRISPR)", tag: "biotech_genetics" },
        { id: "organic_chem", label: "Organic Chemistry & Pharmaceutical Formulations", tag: "pharmacy" },
        { id: "muscular_rehab", label: "Muscular System, Kinesiology & Physical Injury Recovery", tag: "physiotherapy" },
        { id: "microbiology", label: "Microbiology, Immunology & Infectious Diseases", tag: "life_sciences" },
        { id: "ecology_env", label: "Ecology, Plant Biology & Environmental Ecosystems", tag: "environmental" }
      ]
    },
    {
      id: "pcb_career_direction",
      question: "What kind of impact do you want to make in life sciences?",
      type: "multi",
      options: [
        { id: "direct_patient", label: "Direct patient care, diagnosing illnesses, and emergency treatment", tag: "clinical_doctor" },
        { id: "lab_research", label: "Working in high-tech research labs discovering new drugs or vaccines", tag: "lab_research" },
        { id: "tech_bio_devices", label: "Combining electronics/engineering with medical tools & diagnostics", tag: "biomedical_tech" },
        { id: "public_health_mgmt", label: "Managing community health policies & hospital systems", tag: "healthcare_mgmt" },
        { id: "teaching_bio", label: "Teaching biology, lecturing in colleges, or writing scientific content", tag: "teaching_bio" }
      ]
    }
  ],

  pcmb: [
    {
      id: "pcmb_balance",
      question: "Since you studied both Bio and Maths, where does your curiosity lean?",
      type: "multi",
      options: [
        { id: "pure_healthcare", label: "Mainly towards Clinical Medicine & Healthcare (NEET focus)", tag: "medicine" },
        { id: "pure_engineering", label: "Mainly towards Engineering & Tech (JEE focus)", tag: "engineering" },
        { id: "bio_maths_intersection", label: "The intersection: Bio-computing, Genomic Data & Bio-Tech", tag: "bioinformatics" },
        { id: "medical_devices", label: "Building medical instruments, artificial organs & bio-materials", tag: "biomedical_eng" },
        { id: "health_data_ai", label: "Using AI & statistics to analyze hospital datasets and disease trends", tag: "healthtech" },
        { id: "academic_teaching", label: "Teaching STEM subjects & academic research in interdisciplinary science", tag: "teaching_science" }
      ]
    }
  ],

  cs_maths: [
    {
      id: "cs_tech_depth",
      question: "What excites you most about Computer Science and Mathematics?",
      type: "multi",
      options: [
        { id: "software_apps", label: "Building complete web, mobile, or desktop applications", tag: "software_dev" },
        { id: "ai_algorithms", label: "AI, Machine Learning models, and Neural Networks", tag: "ai_ml" },
        { id: "data_analytics", label: "Analyzing massive datasets, statistics, and trends", tag: "data_science" },
        { id: "cyber_security", label: "Ethical hacking, cryptography, and network security", tag: "cybersecurity" },
        { id: "game_graphics", label: "3D Graphics, Game Development, and Interactive UI", tag: "game_ui" },
        { id: "teaching_coding", label: "Teaching others how to code & creating EdTech learning platforms", tag: "cs_teaching" }
      ]
    }
  ],

  commerce: [
    {
      id: "commerce_subject_depth",
      question: "Which Commerce and Business domains interest you most?",
      type: "multi",
      options: [
        { id: "accounting_audit", label: "Financial Accountancy, Tax Strategy & Corporate Auditing", tag: "ca_cma" },
        { id: "stock_markets", label: "Stock Markets, Equity Valuation & Investment Banking", tag: "investment" },
        { id: "macro_economics", label: "Economic Policies, Inflation, Markets & Trade Metrics", tag: "economics" },
        { id: "business_mgmt", label: "Business Management, Leadership, Operations & HR", tag: "management" },
        { id: "fintech_startups", label: "FinTech, Digital Payments & Building Startups", tag: "fintech" },
        { id: "law_governance", label: "Corporate Law, Contracts, Business Regulations & Taxation", tag: "corporate_law" }
      ]
    }
  ],

  arts: [
    {
      id: "arts_subject_depth",
      question: "Which Humanities and Social Science fields engage you most?",
      type: "multi",
      options: [
        { id: "law_justice", label: "Law, Justice Systems, Constitutional Rights & Debate", tag: "law" },
        { id: "civils_governance", label: "Civil Services, Public Policy, IAS & Governance", tag: "civil_services" },
        { id: "psychology_mind", label: "Human Psychology, Behavioral Science & Counseling", tag: "psychology" },
        { id: "writing_journalism", label: "Investigative Journalism, Media Reporting & Creative Writing", tag: "journalism" },
        { id: "visual_design", label: "UI/UX, Graphic Design, Photography & Visual Arts", tag: "design" },
        { id: "teaching_humanities", label: "Teaching History, Literature, or Social Sciences", tag: "teaching_arts" }
      ]
    }
  ],

  vocational: [
    {
      id: "vocational_focus",
      question: "Which practical or applied skills describe your strengths best?",
      type: "multi",
      options: [
        { id: "digital_design_media", label: "Digital UI/UX, Graphic Design & Video Editing", tag: "creative_media" },
        { id: "hands_on_tech", label: "Hands-on electronics repair, networking, or computer hardware", tag: "applied_tech" },
        { id: "practical_business", label: "Small business management, sales, or trade operations", tag: "business" },
        { id: "hospitality_tourism", label: "Hospitality, Event Management, or Tourism", tag: "service_mgmt" },
        { id: "fitness_coaching", label: "Physical Fitness Training, Sports Coaching & Wellness", tag: "sports_fitness" }
      ]
    }
  ]
};
