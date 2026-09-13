// Automated verification script for Profiles A through H

const fs = require('fs');

// Mock window object
global.window = {};

// Load careers, questions, matcher
eval(fs.readFileSync('js/data/careers.js', 'utf8'));
eval(fs.readFileSync('js/data/questions.js', 'utf8'));
eval(fs.readFileSync('js/engine/matcher.js', 'utf8'));

console.log("Loaded CAREERS_DATABASE count:", window.CAREERS_DATABASE.length);

// Profile A: Vocational + mechanical + hands-on + machinery
const profileA = window.CAREER_MATCHER.matchCareers({
  stream: "vocational",
  streamAnswers: ["mechanical_machinery_interest"],
  extracurriculars: ["projects"],
  strengths: ["problem_solving"],
  preferences: ["working_machines"]
});

console.log("\n--- PROFILE A RESULTS ---");
profileA.topMatches.forEach(m => console.log(`${m.matchPercent} - ${m.career.name} (${m.career.id})`));
const profileADefenceOrPilot = profileA.topMatches.some(m => ['defence_army', 'defence_navy', 'defence_airforce', 'commercial_pilot'].includes(m.career.id));
console.log("Profile A contains Defence/Pilot?", profileADefenceOrPilot ? "FAIL ❌" : "PASS ✅");

// Profile B: Vocational + coding + programming + technology + logic
const profileB = window.CAREER_MATCHER.matchCareers({
  stream: "vocational",
  streamAnswers: ["software_coding_interest"],
  extracurriculars: ["coding_clubs"],
  strengths: ["problem_solving"],
  preferences: ["working_tech"]
});
console.log("\n--- PROFILE B RESULTS ---");
profileB.topMatches.forEach(m => console.log(`${m.matchPercent} - ${m.career.name} (${m.career.id})`));

// Profile C: Physics + Maths + aircraft interest + spatial thinking + aviation
const profileC = window.CAREER_MATCHER.matchCareers({
  stream: "pcm",
  streamAnswers: ["phys_mech", "spatial_geom", "aerospace_interest", "pilot_interest"],
  extracurriculars: ["projects"],
  strengths: ["spatial_thinking", "problem_solving"],
  preferences: ["aviation_pilot_pref"]
});
console.log("\n--- PROFILE C RESULTS ---");
profileC.topMatches.forEach(m => console.log(`${m.matchPercent} - ${m.career.name} (${m.career.id})`));

// Profile D: NCC + leadership + discipline + teamwork + explicit Defence interest
const profileD = window.CAREER_MATCHER.matchCareers({
  stream: "pcm",
  streamAnswers: ["defence_tech_interest"],
  extracurriculars: ["ncc", "leadership"],
  strengths: ["leadership", "discipline", "teamwork"],
  preferences: ["defence_service_pref"]
});
console.log("\n--- PROFILE D RESULTS ---");
profileD.topMatches.forEach(m => console.log(`${m.matchPercent} - ${m.career.name} (${m.career.id})`));

// Profile E: Biology + healthcare + research
const profileE = window.CAREER_MATCHER.matchCareers({
  stream: "pcb",
  streamAnswers: ["clinical_medicine", "medicine_interest"],
  extracurriculars: ["science_exhibitions"],
  strengths: ["empathy", "problem_solving"],
  preferences: ["research_investigation", "working_people"]
});
console.log("\n--- PROFILE E RESULTS ---");
profileE.topMatches.forEach(m => console.log(`${m.matchPercent} - ${m.career.name} (${m.career.id})`));

// Profile F: Commerce + accounting + numbers + attention to detail
const profileF = window.CAREER_MATCHER.matchCareers({
  stream: "commerce",
  streamAnswers: ["ca_accounting_interest"],
  extracurriculars: ["competitions"],
  strengths: ["attention_detail", "numerical_ability"],
  preferences: ["working_data"]
});
console.log("\n--- PROFILE F RESULTS ---");
profileF.topMatches.forEach(m => console.log(`${m.matchPercent} - ${m.career.name} (${m.career.id})`));

// Profile G: CS + programming + communication + explaining + mentoring
const profileG = window.CAREER_MATCHER.matchCareers({
  stream: "cs_maths",
  streamAnswers: ["teaching_interest", "software_coding_interest"],
  extracurriculars: ["teaching_tutoring", "peer_mentoring"],
  strengths: ["communication", "explaining_concepts", "patience"],
  preferences: ["teaching_explaining"]
});
console.log("\n--- PROFILE G RESULTS ---");
profileG.topMatches.forEach(m => console.log(`${m.matchPercent} - ${m.career.name} (${m.career.id})`));

// Profile H: Humanities + writing + communication + social issues
const profileH = window.CAREER_MATCHER.matchCareers({
  stream: "arts",
  streamAnswers: ["law_interest", "civils_interest"],
  extracurriculars: ["writing"],
  strengths: ["communication", "critical_thinking"],
  preferences: ["working_people"]
});
console.log("\n--- PROFILE H RESULTS ---");
profileH.topMatches.forEach(m => console.log(`${m.matchPercent} - ${m.career.name} (${m.career.id})`));
