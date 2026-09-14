// CAREERQUEST AI - 3-Column Responsive Career Detail Modal Component

(function() {
  function renderCareerModalHtml(career) {
    if (!career) return "";

    const streamNames = (career.streamCompatibility || []).map(st => {
      const foundObj = (window.STREAMS || []).find(s => s.id === st);
      return foundObj ? foundObj.title : st;
    }).join(", ");

    const degreeChips = (career.degreePathways || []).map(d => `<span class="pathway-chip">${d}</span>`).join("");
    const examChips = (career.entranceExams || []).map(e => `<span class="exam-chip">${e}</span>`).join("");
    const skillChips = (career.usefulSkills || []).map(s => `<span class="skill-chip">${s}</span>`).join("");
    const subjectChips = (career.relevantSubjects || []).map(s => `<span class="subj-chip">${s}</span>`).join("");
    const projectItems = (career.beginnerActivities || []).map(act => `<li class="project-item"><span class="proj-icon">💡</span> ${act}</li>`).join("");

    const jobRoles = career.jobRoles || [
      `Junior ${career.name} Specialist`,
      `Senior ${career.name} Professional`,
      `Lead ${career.name} Consultant / Manager`
    ];
    const jobRoleChips = jobRoles.map(j => `<span class="summary-chip extra">${j}</span>`).join("");

    const progression = career.progression || [
      "Entry Level: Associate / Trainee / Junior Specialist (0–2 years)",
      "Mid Level: Senior Specialist / Project Lead / Consultant (3–6 years)",
      "Senior Level: Department Head / Director / Industry Expert (7+ years)"
    ];
    const progressionList = progression.map(p => `<li><span class="reason-bullet">📈</span> ${p}</li>`).join("");

    const primaryDegreeText = (career.degreePathways && career.degreePathways.length > 0) ? career.degreePathways.join(" or ") : "Relevant Bachelor's Degree";
    const primaryExamsText = (career.entranceExams && career.entranceExams.length > 0) ? career.entranceExams.join(", ") : "Merit-based / Direct Entrance";
    const primarySkillsText = (career.usefulSkills && career.usefulSkills.length > 0) ? career.usefulSkills.slice(0, 3).join(", ") : "Domain & Analytical Skills";

    // Category icon mapping
    const categoryIcons = {
      "Technology": "💻",
      "Engineering": "⚙️",
      "Medical & Healthcare": "🧬",
      "Defence": "🎖️",
      "Aviation": "✈️",
      "Commerce & Finance": "📊",
      "Law & Government": "⚖️",
      "Education": "📚",
      "Creative & Media": "🎨",
      "Maritime": "⚓",
      "Science & Research": "🔬"
    };
    const icon = categoryIcons[career.category] || "🧭";

    return `
      <div class="career-modal-backdrop open" id="careerDetailModalOverlay">
        <div class="glass-panel career-modal-box">
          <button type="button" class="modal-close-btn" id="closeCareerModalBtn" aria-label="Close modal">✕</button>

          <!-- HEADER -->
          <div class="modal-header-wrapper mb-5">
            <div class="flex items-center gap-3">
              <span class="modal-header-icon-badge">${icon}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="category-pill">${career.category}</span>
                  <span class="match-type-pill">Exploration Pathway</span>
                </div>
                <h2 class="career-title mt-1 text-ellipsis">${career.name}</h2>
              </div>
            </div>
            <p class="modal-header-desc text-muted mt-3">${career.description}</p>
          </div>

          <!-- MAIN CONTENT 3-COLUMN RESPONSIVE LAYOUT -->
          <div class="modal-layout-3col">
            
            <!-- LEFT COLUMN: Overview & Eligibility -->
            <div class="modal-col-left flex flex-col gap-4">
              <!-- 1. Career Overview -->
              <div class="modal-section-card">
                <h4 class="modal-section-title"><span>📌</span> 1. Career Overview</h4>
                <p class="modal-text text-muted">${career.description}</p>
                ${career.whySuited ? `
                  <div class="why-suited-box mt-3 p-3">
                    <p class="text-sm text-red-glow"><strong>Key Suitability:</strong> ${career.whySuited}</p>
                  </div>
                ` : ''}
              </div>

              <!-- 2. Class 12 Eligibility -->
              <div class="modal-section-card">
                <h4 class="modal-section-title"><span>🎓</span> 2. Class 12 Eligibility</h4>
                <p class="modal-text mb-2"><strong>Streams:</strong> ${streamNames}</p>
                <h5 class="sub-label mt-3 mb-1">Key Entrance Exams:</h5>
                <div class="chips-flex mt-1">${examChips || '<span class="text-muted">Merit-based / Direct Admission</span>'}</div>
              </div>
            </div>

            <!-- CENTER COLUMN: MAIN FOCUS - Career Pathway Stepper -->
            <div class="modal-col-center">
              <div class="modal-section-card highlight-pathway-card">
                <h4 class="modal-section-title"><span>🗺️</span> 3. CAREER PATHWAY</h4>
                <p class="text-sm text-muted mb-3">Step-by-step roadmap from Class 12 to professional success:</p>

                <div class="career-timeline-wrapper">
                  <!-- Step 1: Class 12 -->
                  <div class="career-timeline-step">
                    <div class="timeline-step-badge">1</div>
                    <div class="timeline-step-content">
                      <h5 class="timeline-step-title">Class 12 Preparation</h5>
                      <p class="timeline-step-desc">Focus on ${streamNames}. Prepare for entrance exams: ${primaryExamsText}.</p>
                    </div>
                  </div>

                  <div class="career-timeline-connector"></div>

                  <!-- Step 2: Relevant Bachelor's Degree -->
                  <div class="career-timeline-step">
                    <div class="timeline-step-badge">2</div>
                    <div class="timeline-step-content">
                      <h5 class="timeline-step-title">Bachelor's Degree</h5>
                      <p class="timeline-step-desc">Enroll in ${primaryDegreeText}. Build core domain fundamentals.</p>
                    </div>
                  </div>

                  <div class="career-timeline-connector"></div>

                  <!-- Step 3: Higher Study / Specialization -->
                  <div class="career-timeline-step">
                    <div class="timeline-step-badge">3</div>
                    <div class="timeline-step-content">
                      <h5 class="timeline-step-title">Higher Study / Specialization</h5>
                      <p class="timeline-step-desc">Pursue Master's degrees (M.Tech / M.Sc / MS / MBA) or certifications.</p>
                    </div>
                  </div>

                  <div class="career-timeline-connector"></div>

                  <!-- Step 4: Skills & Experience -->
                  <div class="career-timeline-step">
                    <div class="timeline-step-badge">4</div>
                    <div class="timeline-step-content">
                      <h5 class="timeline-step-title">Skills & Experience</h5>
                      <p class="timeline-step-desc">Master skills: ${primarySkillsText}. Complete projects & internships.</p>
                    </div>
                  </div>

                  <div class="career-timeline-connector"></div>

                  <!-- Step 5: Possible Job Roles -->
                  <div class="career-timeline-step">
                    <div class="timeline-step-badge">5</div>
                    <div class="timeline-step-content">
                      <h5 class="timeline-step-title">Possible Job Roles</h5>
                      <p class="timeline-step-desc">Enter industry and advance across career stages.</p>
                    </div>
                  </div>
                </div>

                <h5 class="sub-label mt-4 mb-2">Stage-by-Stage Advancement:</h5>
                <ul class="why-appeared-list mt-2">${progressionList}</ul>
              </div>
            </div>

            <!-- RIGHT COLUMN: Pathways, Skills, Projects, Job Roles -->
            <div class="modal-col-right flex flex-col gap-4">
              <!-- 4. College & Degree Pathways -->
              <div class="modal-section-card">
                <h4 class="modal-section-title"><span>📜</span> 4. Degree Pathways</h4>
                <div class="chips-flex mt-2">${degreeChips}</div>
              </div>

              <!-- 5. Skills to Develop -->
              <div class="modal-section-card">
                <h4 class="modal-section-title"><span>🛠️</span> 5. Skills to Develop</h4>
                <h5 class="sub-label mb-1">Technical Skills:</h5>
                <div class="chips-flex mt-1 mb-2">${skillChips}</div>
                <h5 class="sub-label mb-1">Relevant Subjects:</h5>
                <div class="chips-flex mt-1">${subjectChips}</div>
              </div>

              <!-- 6. Beginner Exploration Projects -->
              <div class="modal-section-card">
                <h4 class="modal-section-title"><span>💡</span> 6. Beginner Projects</h4>
                <ul class="projects-list mt-2">${projectItems}</ul>
              </div>

              <!-- 7. Possible Job Roles -->
              <div class="modal-section-card">
                <h4 class="modal-section-title"><span>💼</span> 7. Possible Job Roles</h4>
                <div class="chips-flex mt-2">${jobRoleChips}</div>
              </div>
            </div>
          </div>

          <div class="modal-footer mt-6 flex justify-end">
            <button type="button" class="secondary-btn w-full-mobile" id="closeCareerModalFooterBtn">Close Profile</button>
          </div>
        </div>
      </div>
    `;
  }

  window.CQ_CAREER_MODAL = {
    renderCareerModalHtml
  };
})();
