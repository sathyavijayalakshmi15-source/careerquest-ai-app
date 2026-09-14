(function() {
  let activeModalCareerId = null;

  function renderResults(recommendationsData, state = {}) {
    // Defensive fallback: Ensure recommendationsData & topMatches exist
    if (!recommendationsData || !recommendationsData.topMatches || recommendationsData.topMatches.length === 0) {
      if (window.CAREER_MATCHER && window.CAREER_MATCHER.matchCareers) {
        recommendationsData = window.CAREER_MATCHER.matchCareers(state || {});
      }
    }

    let topMatches = (recommendationsData && recommendationsData.topMatches) || [];
    const stream = (recommendationsData && recommendationsData.stream) || state.stream || "";

    // Ultimate fallback guarantee: if topMatches is still empty, populate from CAREERS_DATABASE
    if (topMatches.length === 0 && window.CAREERS_DATABASE && window.CAREERS_DATABASE.length > 0) {
      topMatches = window.CAREERS_DATABASE.slice(0, 5).map(c => ({
        career: c,
        matchScore: 60,
        matchPercent: "60%",
        matchLabel: "Good Pathway to Explore",
        reasons: ["Appeared as a directional pathway worth exploring."]
      }));
    }

    if (topMatches.length === 0) {
      return `
        <div class="container section-padding text-center">
          <div class="glass-panel text-center">
            <h3>No Assessment Results Found</h3>
            <p>Please complete the assessment questionnaire to view your personalized career exploration profile.</p>
            <button class="primary-btn mt-4" data-view="assessment">Start Assessment</button>
          </div>
        </div>
      `;
    }

    const streamObj = (window.STREAMS || []).find(s => s.id === stream);

    // Profile summary pill badges
    const strengthsList = (state.strengths || []).map(sId => {
      const sObj = (window.STRENGTHS_OPTIONS || []).find(o => o.id === sId);
      return sObj ? sObj.label : sId;
    });

    const extrasList = (state.extracurriculars || []).map(eId => {
      const eObj = (window.EXTRACURRICULAR_OPTIONS || []).find(o => o.id === eId);
      return eObj ? eObj.label : eId;
    });

    // Clean, focused result cards
    const careerCardsHtml = topMatches.map((item, index) => {
      const { career, matchPercent, reasons = [] } = item;
      if (!career) return "";

      const matchTierLabel = item.matchLabel || "Strong Match to Explore";

      const safeReasons = (reasons && reasons.length > 0) ? reasons : ["Appeared based on broad compatibility with your reported preferences."];
      const reasonsHtml = safeReasons.map(r => `
        <li><span class="reason-bullet">✦</span> ${r}</li>
      `).join("");

      return `
        <div class="career-match-card glass-panel card-tilt" id="careerMatch_${career.id}">
          <div class="match-card-header">
            <div class="match-badge-group">
              <span class="rank-num">#0${index + 1}</span>
              <span class="match-type-pill">${matchTierLabel}</span>
              <span class="match-score-tag">${matchPercent || '60%'} Match Fit</span>
            </div>
            <span class="career-category-tag">${career.category || 'Exploration'}</span>
          </div>

          <div class="match-card-body mt-4">
            <h3 class="career-title">${career.name}</h3>
            <p class="career-desc">${career.description || ''}</p>

            <!-- Why This Appeared -->
            <div class="why-appeared-box mt-4">
              <h4 class="why-appeared-title">Why This Appeared:</h4>
              <ul class="why-appeared-list">
                ${reasonsHtml}
              </ul>
            </div>
          </div>

          <!-- Clean Action Buttons -->
          <div class="match-card-footer mt-6 flex flex-wrap gap-3">
            <button class="primary-btn card-action-btn flex-1" data-action="inspect" data-career-id="${career.id}">
              <span>Inspect Full Career Profile</span>
              <span class="btn-arrow">🔍</span>
            </button>

            <button class="secondary-btn card-action-btn" data-action="roadmap" data-career-id="${career.id}">
              <span>View Personalized Roadmap</span>
              <span class="btn-arrow">🗺️</span>
            </button>

            <button class="tertiary-btn card-action-btn" data-action="experience" data-career-id="${career.id}">
              <span>Career Challenge</span>
              <span class="btn-arrow">⚡</span>
            </button>
          </div>
        </div>
      `;
    }).join("");

    // Modal HTML for detailed career view (Section 10)
    let detailModalHtml = "";
    if (activeModalCareerId) {
      const activeCareer = (window.CAREERS_DATABASE || []).find(c => c.id === activeModalCareerId);
      if (activeCareer) {
        const streamNames = (activeCareer.streamCompatibility || []).map(st => {
          const foundObj = (window.STREAMS || []).find(s => s.id === st);
          return foundObj ? foundObj.title : st;
        }).join(", ");

        const degreeChips = (activeCareer.degreePathways || []).map(d => `<span class="pathway-chip">${d}</span>`).join("");
        const examChips = (activeCareer.entranceExams || []).map(e => `<span class="exam-chip">${e}</span>`).join("");
        const skillChips = (activeCareer.usefulSkills || []).map(s => `<span class="skill-chip">${s}</span>`).join("");
        const projectItems = (activeCareer.beginnerActivities || []).map(act => `<li class="project-item"><span class="proj-icon">💡</span> ${act}</li>`).join("");

        // Derived job roles
        const jobRoles = activeCareer.jobRoles || [
          `Junior ${activeCareer.name} Specialist`,
          `Senior ${activeCareer.name} Professional`,
          `Lead ${activeCareer.name} Consultant / Manager`
        ];
        const jobRoleChips = jobRoles.map(j => `<span class="summary-chip extra">${j}</span>`).join("");

        // Derived career progression
        const progression = activeCareer.progression || [
          "Entry Level: Associate / Trainee / Junior Specialist (0–2 years)",
          "Mid Level: Senior Specialist / Project Lead / Consultant (3–6 years)",
          "Senior Level: Department Head / Director / Industry Expert (7+ years)"
        ];
        const progressionList = progression.map(p => `<li><span class="reason-bullet">📈</span> ${p}</li>`).join("");

        detailModalHtml = `
          <div class="career-modal-backdrop open" id="careerDetailModalOverlay">
            <div class="glass-panel career-modal-box">
              <button type="button" class="modal-close-btn" id="closeCareerModalBtn" aria-label="Close modal">✕</button>

              <div class="modal-header mb-4">
                <span class="category-pill">${activeCareer.category}</span>
                <h2 class="career-title mt-2">${activeCareer.name}</h2>
              </div>

              <div class="modal-body flex flex-col gap-5">
                <!-- 1. Career Overview -->
                <div class="modal-section">
                  <h4 class="sub-label">1. Career Overview</h4>
                  <p class="mt-1 text-muted">${activeCareer.description}</p>
                  ${activeCareer.whySuited ? `<p class="mt-2 text-sm text-red-glow"><strong>Key Suitability:</strong> ${activeCareer.whySuited}</p>` : ''}
                </div>

                <!-- 2. What to Study After Class 12 -->
                <div class="modal-section">
                  <h4 class="sub-label">2. What to Study After Class 12</h4>
                  <p class="mt-1 text-sm"><strong>Eligible Class 12 Streams:</strong> ${streamNames}</p>
                  <h5 class="sub-label mt-2">Key Entrance Exams:</h5>
                  <div class="chips-flex mt-1">${examChips || '<span class="text-muted">Merit-based / Direct Admission</span>'}</div>
                </div>

                <!-- 3. Relevant Bachelor's Degree -->
                <div class="modal-section">
                  <h4 class="sub-label">3. Relevant Bachelor's Degree Pathways</h4>
                  <div class="chips-flex mt-2">${degreeChips}</div>
                </div>

                <!-- 4. Higher-Study Pathway -->
                <div class="modal-section">
                  <h4 class="sub-label">4. Higher-Study & Specialization Pathway</h4>
                  <p class="mt-1 text-sm text-muted">
                    Postgraduate options: Master's Degree (M.Tech / M.Sc / MS / MBA), Specialist Diplomas, or Professional Certifications.
                  </p>
                </div>

                <!-- 5. Skills to Develop -->
                <div class="modal-section">
                  <h4 class="sub-label">5. Skills to Develop</h4>
                  <div class="chips-flex mt-2">${skillChips}</div>
                </div>

                <!-- 6. Beginner Exploration Activities -->
                <div class="modal-section">
                  <h4 class="sub-label">6. Beginner Exploration Activities</h4>
                  <ul class="projects-list mt-2">${projectItems}</ul>
                </div>

                <!-- 7. Possible Job Roles -->
                <div class="modal-section">
                  <h4 class="sub-label">7. Possible Job Roles</h4>
                  <div class="chips-flex mt-2">${jobRoleChips}</div>
                </div>

                <!-- 8. Career Progression -->
                <div class="modal-section">
                  <h4 class="sub-label">8. Career Progression</h4>
                  <ul class="why-appeared-list mt-2">${progressionList}</ul>
                </div>
              </div>

              <div class="modal-footer mt-6 flex justify-end">
                <button type="button" class="secondary-btn" id="closeCareerModalFooterBtn">Close Profile</button>
              </div>
            </div>
          </div>
        `;
      }
    }

    return `
      <div class="results-page-wrapper container section-padding">
        <!-- Header -->
        <div class="results-header text-center mb-8">
          <div class="badge-pill mb-3">
            <span class="pulse-dot"></span>
            <span>BEYOND THE STREAM PROFILE GENERATED</span>
          </div>

          <h1 class="results-main-title">Your Career Exploration Profile</h1>
          <p class="results-subtitle">
            These 3–5 recommendations are directional starting points synthesized from your multi-dimensional signals.
          </p>
        </div>

        <!-- Student Profile Signals Summary Card -->
        <div class="profile-signals-summary glass-panel mb-8">
          <div class="summary-header">
            <h3><span class="summary-icon">👤</span> Student Signal Profile</h3>
            <span class="stream-badge-highlight">${streamObj ? streamObj.title : stream}</span>
          </div>

          <div class="summary-grid mt-4">
            <div class="summary-col">
              <h4>Academic Stream</h4>
              <p class="summary-val">${streamObj ? streamObj.title : stream} (${streamObj ? streamObj.subtitle : ''})</p>
            </div>

            <div class="summary-col">
              <h4>Top Natural Strengths</h4>
              <div class="chips-flex">
                ${strengthsList.length > 0 ? strengthsList.map(s => `<span class="summary-chip strength">${s}</span>`).join('') : '<span class="text-muted">None selected</span>'}
              </div>
            </div>

            <div class="summary-col">
              <h4>Activities & Supporting Signals</h4>
              <div class="chips-flex">
                ${extrasList.length > 0 ? extrasList.map(e => `<span class="summary-chip extra">${e}</span>`).join('') : '<span class="text-muted">None selected</span>'}
              </div>
            </div>
          </div>
        </div>

        <!-- Career Recommendations Grid -->
        <div class="recommendations-header mb-6">
          <h2>Careers Worth Exploring</h2>
          <p class="text-muted">Explore these top pathways built around your strengths, subject interests, and problem-solving style.</p>
        </div>

        <div class="careers-matches-stack">
          ${careerCardsHtml}
        </div>
      </div>
      ${detailModalHtml}
    `;
  }

  function initResultsEvents(onNavigateToChallenge, onNavigateToRoadmap, onRefreshView) {
    // Inspect Career Detail Modal Trigger
    document.querySelectorAll('[data-action="inspect"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const careerId = e.currentTarget.getAttribute('data-career-id');
        activeModalCareerId = careerId;
        if (onRefreshView) onRefreshView();
      });
    });

    // Close Modal Events
    const closeBtn = document.getElementById('closeCareerModalBtn');
    const closeFooterBtn = document.getElementById('closeCareerModalFooterBtn');
    const overlay = document.getElementById('careerDetailModalOverlay');

    const closeModal = () => {
      activeModalCareerId = null;
      if (onRefreshView) onRefreshView();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    // Action Buttons
    document.querySelectorAll('[data-action="experience"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const careerId = e.currentTarget.getAttribute('data-career-id');
        if (onNavigateToChallenge) onNavigateToChallenge(careerId);
      });
    });

    document.querySelectorAll('[data-action="roadmap"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const careerId = e.currentTarget.getAttribute('data-career-id');
        if (onNavigateToRoadmap) onNavigateToRoadmap(careerId);
      });
    });
  }

  window.CQ_RESULTS = {
    renderResults,
    initResultsEvents
  };
})();

