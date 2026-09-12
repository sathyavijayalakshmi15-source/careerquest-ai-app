// CAREERQUEST AI - Results Page View Component

(function() {
  function renderResults(recommendationsData, state = {}) {
    if (!recommendationsData || !recommendationsData.topMatches) {
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

    const { topMatches = [], stream = "" } = recommendationsData;
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

    const careerCardsHtml = topMatches.map((item, index) => {
      const { career, matchPercent, reasons } = item;

      const reasonsHtml = reasons.map(r => `
        <li><span class="reason-bullet">✦</span> ${r}</li>
      `).join("");

      const pathwaysHtml = career.degreePathways.map(p => `
        <span class="pathway-chip">${p}</span>
      `).join("");

      const examsHtml = career.entranceExams.map(e => `
        <span class="exam-chip">${e}</span>
      `).join("");

      const skillsHtml = career.usefulSkills.map(sk => `
        <span class="skill-chip">${sk}</span>
      `).join("");

      const projectsHtml = career.beginnerActivities.map(act => `
        <li class="project-item"><span class="proj-icon">💡</span> ${act}</li>
      `).join("");

      return `
        <div class="career-match-card glass-panel card-tilt" id="careerMatch_${career.id}">
          <div class="match-card-header">
            <div class="match-badge-group">
              <span class="rank-num">#0${index + 1}</span>
              <span class="match-type-pill">Strong Match to Explore</span>
              <span class="match-score-tag">${matchPercent}% Match Fit</span>
            </div>
            <span class="career-category-tag">${career.category}</span>
          </div>

          <div class="match-card-body mt-4">
            <h3 class="career-title">${career.name}</h3>
            <p class="career-desc">${career.description}</p>

            <!-- Why This Appeared -->
            <div class="why-appeared-box mt-4">
              <h4 class="why-appeared-title">Why This Appeared:</h4>
              <ul class="why-appeared-list">
                ${reasonsHtml}
              </ul>
            </div>

            <!-- Relevant Pathways & Exams -->
            <div class="pathways-section mt-5">
              <h5 class="sub-label">College & Degree Pathways:</h5>
              <div class="chips-flex mt-2">${pathwaysHtml}</div>

              <h5 class="sub-label mt-3">Key Entrance Exams:</h5>
              <div class="chips-flex mt-2">${examsHtml}</div>
            </div>

            <!-- Skills to Develop -->
            <div class="skills-section mt-4">
              <h5 class="sub-label">Skills To Develop:</h5>
              <div class="chips-flex mt-2">${skillsHtml}</div>
            </div>

            <!-- Beginner Projects -->
            <div class="projects-section mt-4">
              <h5 class="sub-label">Beginner Exploration Projects:</h5>
              <ul class="projects-list mt-2">${projectsHtml}</ul>
            </div>
          </div>

          <!-- Card Action Buttons -->
          <div class="match-card-footer mt-6">
            <button class="primary-btn card-action-btn" data-action="experience" data-career-id="${career.id}">
              <span>Experience Career Challenge</span>
              <span class="btn-arrow">⚡</span>
            </button>

            <button class="secondary-btn card-action-btn" data-action="roadmap" data-career-id="${career.id}">
              <span>View Personalized Roadmap</span>
              <span class="btn-arrow">🗺️</span>
            </button>
          </div>
        </div>
      `;
    }).join("");

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
    `;
  }

  function initResultsEvents(onNavigateToChallenge, onNavigateToRoadmap) {
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
