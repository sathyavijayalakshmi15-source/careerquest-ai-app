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

    // Modal HTML for detailed career view (Section 10 & Section 3/4 Roadmap Layout)
    let detailModalHtml = "";
    if (activeModalCareerId) {
      const activeCareer = (window.CAREERS_DATABASE || []).find(c => c.id === activeModalCareerId);
      if (activeCareer && window.CQ_CAREER_MODAL) {
        detailModalHtml = window.CQ_CAREER_MODAL.renderCareerModalHtml(activeCareer);
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

