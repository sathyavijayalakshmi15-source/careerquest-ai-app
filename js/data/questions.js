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

// Extracurricular Activities Options (SUPPORTING Signals Only)
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
  { id: "spatial_thinking", label: "Spatial & 3D Thinking", icon: "📐" },
  { id: "numerical_ability", label: "Numerical & Quantitative Ability", icon: "🔢" },
  { id: "explaining_concepts", label: "Explaining Concepts Clearly", icon: "📢" },
  { id: "public_speaking", label: "Public Speaking & Debating", icon: "🎙️" },
  { id: "mentoring_others", label: "Mentoring & Guiding Others", icon: "🌱" }
];

// Career Preferences & Environment Options
window.PREFERENCES_OPTIONS = [
  { id: "working_tech", label: "Working with cutting-edge technology & software", icon: "💻" },
  { id: "working_people", label: "Working closely with people, patients, or communities", icon: "🤝" },
  { id: "working_machines", label: "Working hands-on with machines, tools, & industrial equipment", icon: "⚙️" },
  { id: "working_data", label: "Working with structured data, statistics, & financial models", icon: "📊" },
  { id: "research_investigation", label: "Deep scientific research & laboratory investigation", icon: "🔬" },
  { id: "building_things", label: "Building physical or digital products & structures", icon: "🏗️" },
  { id: "solving_complex_problems", label: "Solving complex, high-stakes mathematical or logical problems", icon: "🧩" },
  { id: "creativity_art", label: "Expressing visual design, writing, or creative media", icon: "🎨" },
  { id: "leadership_mgmt", label: "Leading teams, projects, and organizational vision", icon: "👔" },
  { id: "helping_others", label: "Directly helping others grow, heal, or learn", icon: "🌿" },
  { id: "working_outdoors", label: "Working outdoors, in field operations, or environmental sites", icon: "🏔️" },
  { id: "defence_service_pref", label: "Structured uniformed defense or armed forces service", icon: "🎖️" },
  { id: "aviation_pilot_pref", label: "Commercial flight operations & piloting aircraft", icon: "✈️" },
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
        { id: "calc_alg", label: "Pure Mathematics (Calculus, Algebra, Number Theory)", tag: "pure_maths" },
        { id: "phys_mech", label: "Applied Physics (Mechanics, Forces, Thermodynamics)", tag: "applied_physics" },
        { id: "elec_circuits", label: "Electricity, Magnetism & Electronic Circuits", tag: "electronics" },
        { id: "optics_astronomy", label: "Optics, Modern Physics & Cosmology / Space Physics", tag: "astrophysics" },
        { id: "chem_structures", label: "Chemical Thermodynamics & Material Reactions", tag: "chemistry" },
        { id: "spatial_geom", label: "Geometry, 3D Coordinates & Spatial Modeling", tag: "spatial_design" }
      ]
    },
    {
      id: "pcm_problem_style",
      question: "Which career direction or application area aligns with your goals?",
      type: "multi",
      options: [
        { id: "software_code", label: "Software Engineering & Computer Programming", tag: "software_coding_interest" },
        { id: "mechanical_machinery", label: "Mechanical Systems, Engines, Robotics & Industrial Machinery", tag: "mechanical_machinery_interest" },
        { id: "civil_construction", label: "Civil Engineering, Structural Blueprints & Smart Cities", tag: "civil_struct_interest" },
        { id: "aerospace_space", label: "Aerospace Rockets, Satellites & Space Physics Research", tag: "aerospace_interest" },
        { id: "aeronautical_aircraft", label: "Aeronautical Aircraft Engineering & Jet Engine Dynamics", tag: "aeronautical_interest" },
        { id: "commercial_pilot_spec", label: "Becoming a Commercial Aviation Pilot (Passenger/Cargo Jets)", tag: "pilot_interest" },
        { id: "defence_tech_iaf", label: "Defence Electronics, Radar Warfare or IAF Flying/Tech Officer", tag: "defence_tech_interest" },
        { id: "teaching_pcm", label: "Teaching Physics/Maths or Academic Research in STEM", tag: "teaching_interest" }
      ]
    }
  ],

  pcb: [
    {
      id: "pcb_subject_depth",
      question: "Which areas of Biology and Chemistry engage you the most?",
      type: "multi",
      options: [
        { id: "human_anatomy", label: "Human Anatomy, Physiology & Clinical Medical Science", tag: "clinical_medicine" },
        { id: "genetics_dna", label: "Genetics, Molecular Biology & Gene Editing (CRISPR)", tag: "biotech_genetics" },
        { id: "organic_chem", label: "Organic Chemistry & Pharmaceutical Drug Development", tag: "pharmacy" },
        { id: "muscular_rehab", label: "Muscular Kinesiology & Physical Therapy Recovery", tag: "physiotherapy" },
        { id: "microbiology", label: "Microbiology, Immunology & Vaccine Research", tag: "life_sciences" },
        { id: "ecology_env", label: "Ecology, Plant Biology & Environmental Ecosystems", tag: "environmental" }
      ]
    },
    {
      id: "pcb_career_direction",
      question: "What specific healthcare or life science pathway interests you?",
      type: "multi",
      options: [
        { id: "doctor_mbbs", label: "Becoming a Medical Doctor (MBBS) for clinical diagnosis & surgery", tag: "medicine_interest" },
        { id: "biotech_research", label: "Biotechnology & genetic lab research for vaccines and therapies", tag: "biotech_interest" },
        { id: "pharma_drug", label: "Pharmaceutical research, drug formulation & clinical testing", tag: "pharmacy_interest" },
        { id: "physio_rehab", label: "Physiotherapy & sports injury rehabilitation", tag: "physio_interest" },
        { id: "teaching_bio", label: "Teaching Biology or Academic Lecturing in Life Sciences", tag: "teaching_interest" },
        { id: "healthtech_digital", label: "HealthTech app management & digital telemedicine", tag: "healthtech_interest" }
      ]
    }
  ],

  pcmb: [
    {
      id: "pcmb_balance",
      question: "Since you studied both Bio and Maths, where does your focus lean?",
      type: "multi",
      options: [
        { id: "pcmb_medicine", label: "Clinical Medicine & Surgery (MBBS / Healthcare Focus)", tag: "medicine_interest" },
        { id: "pcmb_engineering", label: "Engineering, Software & Technology (JEE / Applied Physics Focus)", tag: "engineering_interest" },
        { id: "pcmb_bioinfo", label: "Bioinformatics, Computational Genomics & DNA Data Analysis", tag: "bioinfo_interest" },
        { id: "pcmb_biomed", label: "Biomedical Engineering, Artificial Organs & Prosthetics", tag: "biomedical_interest" },
        { id: "pcmb_aviation_pilot", label: "Commercial Aviation Pilot or Aerospace Engineering", tag: "pilot_interest" },
        { id: "pcmb_teaching", label: "STEM Educator, Maths/Bio Teacher, or Academic Researcher", tag: "teaching_interest" }
      ]
    }
  ],

  cs_maths: [
    {
      id: "cs_tech_depth",
      question: "What specific field in Computer Science and Technology attracts you?",
      type: "multi",
      options: [
        { id: "software_apps", label: "Software Engineering & System Architecture (Web, Mobile, Cloud)", tag: "software_coding_interest" },
        { id: "ai_algorithms", label: "Artificial Intelligence, Neural Networks & Machine Learning", tag: "ai_ml_interest" },
        { id: "data_analytics", label: "Data Science, Big Analytics & Predictive Modeling", tag: "data_science_interest" },
        { id: "cyber_security", label: "Cybersecurity, Ethical Hacking & Defensive Networking", tag: "cybersecurity_interest" },
        { id: "game_ui", label: "UI/UX & Interactive Product Design", tag: "ui_ux_interest" },
        { id: "teaching_coding", label: "Computer Science Educator, Coding Instructor & EdTech Specialist", tag: "teaching_interest" },
        { id: "defence_cyber", label: "Cyber Defence & Military Technology Specialist", tag: "defence_tech_interest" }
      ]
    }
  ],

  commerce: [
    {
      id: "commerce_subject_depth",
      question: "Which Commerce and Financial domain fits your ambition best?",
      type: "multi",
      options: [
        { id: "accounting_audit", label: "Chartered Accountancy (CA), Auditing & Corporate Taxation", tag: "ca_accounting_interest" },
        { id: "stock_markets", label: "Investment Banking, Stock Valuation & Equity Research", tag: "finance_stock_interest" },
        { id: "actuarial_risk", label: "Actuarial Science, Probability & Financial Risk Analytics", tag: "actuarial_interest" },
        { id: "business_mgmt", label: "Applied Business Operations, Retail Management & Logistics", tag: "business_sales_interest" },
        { id: "fintech_startups", label: "FinTech, Digital Payments & Technology Entrepreneurship", tag: "fintech_interest" },
        { id: "law_governance", label: "Corporate Law, Business Regulations & Intellectual Property", tag: "corporate_law_interest" }
      ]
    }
  ],

  arts: [
    {
      id: "arts_subject_depth",
      question: "Which Humanities and Social Science pathway interests you most?",
      type: "multi",
      options: [
        { id: "arts_law", label: "Corporate Law, Constitutional Rights & Legal Advocacy", tag: "law_interest" },
        { id: "arts_civils", label: "Civil Services (IAS / IPS / IFS) & Public Administration", tag: "civils_interest" },
        { id: "arts_policy", label: "Public Policy, International Relations & Diplomacy", tag: "policy_interest" },
        { id: "arts_journalism", label: "Investigative Journalism, Digital Media & Broadcasting", tag: "journalism_interest" },
        { id: "arts_ui_ux", label: "UI/UX Product Design & Visual Graphic Arts", tag: "ui_ux_interest" },
        { id: "arts_teaching", label: "Teaching History, Literature, Humanities or Academic Research", tag: "teaching_interest" }
      ]
    }
  ],

  vocational: [
    {
      id: "vocational_focus",
      question: "Which practical, applied, or technical field aligns with your skills?",
      type: "multi",
      options: [
        { id: "voc_mechanical", label: "Mechanical Systems, Machinery Repair & Workshop Practice", tag: "mechanical_machinery_interest" },
        { id: "voc_coding_it", label: "Applied Information Technology, Computer Maintenance & Web Support", tag: "software_coding_interest" },
        { id: "voc_business_sales", label: "Applied Business Operations, Store Management & Retail Sales", tag: "business_sales_interest" },
        { id: "voc_design_graphics", label: "Digital Media, Applied Graphic Design & Video Editing", tag: "ui_ux_interest" },
        { id: "voc_healthcare_support", label: "Physical Rehabilitation Support, Fitness & Health Services", tag: "physio_interest" },
        { id: "voc_defence_explicit", label: "Explicit interest in joining Armed Forces (Army/Navy/Air Force)", tag: "defence_army_interest" },
        { id: "voc_pilot_explicit", label: "Explicit interest in becoming a Commercial Aviation Pilot", tag: "pilot_interest" }
      ]
    }
  ]
};
