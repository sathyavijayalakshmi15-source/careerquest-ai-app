// CAREERQUEST AI - Redesigned Student-Friendly Career Detail Modal Component

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

    return `
      <div class="career-modal-backdrop open" id="careerDetailModalOverlay">
        <div class="glass-panel career-modal-box">
          <button type="button" class="modal-close-btn" id="closeCareerModalBtn" aria-label="Close modal">✕</button>

          <!-- Modal Header -->
          <div class="modal-header mb-5">
            <span class="category-pill">${career.category}</span>
            <h2 class="career-title mt-2">${career.name}</h2>
            <p class="modal-header-subtitle text-muted mt-1" style="font-size: 0.92rem;">Comprehensive Career Exploration & Pathway Guide</p>
          </div>

          <div class="modal-body flex flex-col gap-4">
            <!-- 1. Career Overview -->
            <div class="modal-section-card">
              <h4 class="modal-section-title"><span>📌</span> 1. Career Overview</h4>
              <p class="modal-text text-muted">${career.description}</p>
              ${career.whySuited ? `<div class="why-suited-box mt-3 p-3" style="background: rgba(255, 42, 42, 0.08); border-left: 3px solid var(--fiery-red); border-radius: 8px;"><p class="text-sm text-red-glow"><strong>Key Suitability:</strong> ${career.whySuited}</p></div>` : ''}
            </div>

            <!-- 2. Class 12 Eligibility -->
            <div class="modal-section-card">
              <h4 class="modal-section-title"><span>🎓</span> 2. Class 12 Eligibility</h4>
              <p class="modal-text mb-2"><strong>Eligible Class 12 Streams:</strong> ${streamNames}</p>
              <h5 class="sub-label mt-3 mb-1">Key Entrance Exams:</h5>
              <div class="chips-flex mt-1">${examChips || '<span class="text-muted">Merit-based / Direct Admission</span>'}</div>
            </div>

            <!-- 3. CAREER PATHWAY (Main Visual Stepper Timeline) -->
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
                    <h5 class="timeline-step-title">Relevant Bachelor's Degree</h5>
                    <p class="timeline-step-desc">Enroll in ${primaryDegreeText}. Build strong core fundamentals.</p>
                    <div class="chips-flex mt-2">${degreeChips}</div>
                  </div>
                </div>

                <div class="career-timeline-connector"></div>

                <!-- Step 3: Higher Study / Specialization -->
                <div class="career-timeline-step">
                  <div class="timeline-step-badge">3</div>
                  <div class="timeline-step-content">
                    <h5 class="timeline-step-title">Higher Study / Specialization</h5>
                    <p class="timeline-step-desc">Pursue Master's degrees (M.Tech / M.Sc / MS / MBA) or specialized certifications (CFA / ICAI / USMLE / Bar / PhD).</p>
                  </div>
                </div>

                <div class="career-timeline-connector"></div>

                <!-- Step 4: Skills & Experience -->
                <div class="career-timeline-step">
                  <div class="timeline-step-badge">4</div>
                  <div class="timeline-step-content">
                    <h5 class="timeline-step-title">Skills & Experience</h5>
                    <p class="timeline-step-desc">Develop key skills: ${primarySkillsText}. Complete hands-on projects and industry internships.</p>
                  </div>
                </div>

                <div class="career-timeline-connector"></div>

                <!-- Step 5: Possible Job Roles -->
                <div class="career-timeline-step">
                  <div class="timeline-step-badge">5</div>
                  <div class="timeline-step-content">
                    <h5 class="timeline-step-title">Possible Job Roles</h5>
                    <p class="timeline-step-desc">Enter the workforce and advance across industry career stages.</p>
                    <div class="chips-flex mt-2">${jobRoleChips}</div>
                  </div>
                </div>
              </div>

              <h5 class="sub-label mt-4 mb-2">Stage-by-Stage Advancement:</h5>
              <ul class="why-appeared-list mt-2">${progressionList}</ul>
            </div>

            <!-- 4. Skills to Develop -->
            <div class="modal-section-card">
              <h4 class="modal-section-title"><span>🛠️</span> 4. Skills to Develop</h4>
              <h5 class="sub-label mb-1">Technical & Core Skills:</h5>
              <div class="chips-flex mt-1 mb-3">${skillChips}</div>
              <h5 class="sub-label mb-1">Relevant Subjects:</h5>
              <div class="chips-flex mt-1">${subjectChips}</div>
            </div>

            <!-- 5. Beginner Exploration -->
            <div class="modal-section-card">
              <h4 class="modal-section-title"><span>💡</span> 5. Beginner Exploration</h4>
              <p class="text-sm text-muted mb-2">Simple activities and projects to start today:</p>
              <ul class="projects-list mt-2">${projectItems}</ul>
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
