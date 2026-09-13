// CAREERQUEST AI - Student Dashboard Component with Animated Logo Banner & Mobile Optimizations

(function() {
  function renderDashboard(state = {}) {
    const hasProfile = state.assessmentCompleted && state.recommendations;

    const streamObj = (window.STREAMS || []).find(s => s.id === state.stream);

    const strengthsList = (state.strengths || []).map(sId => {
      const sObj = (window.STRENGTHS_OPTIONS || []).find(o => o.id === sId);
      return sObj ? sObj.label : sId;
    });

    const extrasList = (state.extracurriculars || []).map(eId => {
      const eObj = (window.EXTRACURRICULAR_OPTIONS || []).find(o => o.id === eId);
      return eObj ? eObj.label : eId;
    });

    const topMatches = (state.recommendations && state.recommendations.topMatches) ? state.recommendations.topMatches : [];
    const completedChallenges = state.completedChallenges || [];
    const roadmapProgress = state.roadmapProgress || {};

    const completedRoadmapCount = Object.keys(roadmapProgress).filter(k => roadmapProgress[k]).length;

    const logoHtml = window.CQ_LOGO ? window.CQ_LOGO.renderLogo({ size: "large", showText: true, animated: true }) : "";

    const topMatchesHtml = topMatches.map((m, idx) => `
      <div class="dash-career-row glass-panel mb-3">
        <div class="dash-career-info">
          <span class="rank-tag">#0${idx + 1}</span>
          <div class="dash-career-text">
            <h4 class="dash-career-title">${m.career.name}</h4>
            <span class="dash-career-cat">${m.career.category} • <strong class="text-red-glow">${m.matchPercent}% Match Fit</strong></span>
          </div>
        </div>

        <div class="dash-career-actions mt-2-mobile">
          <button class="tertiary-btn btn-sm" data-dash-experience="${m.career.id}">
            <span>⚡ Challenge</span>
          </button>
          <button class="secondary-btn btn-sm" data-dash-roadmap="${m.career.id}">
            <span>🗺️ Roadmap</span>
          </button>
        </div>
      </div>
    `).join("");

    return `
      <div class="dashboard-page-wrapper container section-padding dash-animated-entrance">
        <!-- Elegant Animated C+Q Logo Hero Banner -->
        <div class="dash-hero-banner glass-panel mb-8 text-center relative overflow-hidden">
          <div class="dash-banner-glow"></div>
          <div class="dash-logo-assembly">
            ${logoHtml}
          </div>
          <div class="badge-pill mt-3 mb-2">
            <span class="pulse-dot"></span>
            <span>STUDENT COMMAND CENTER</span>
          </div>
          <h1 class="dash-banner-title">Career Exploration Dashboard</h1>
          <p class="dash-subtitle max-w-xl mx-auto">Track your assessment profile, top career matches, mini-challenge badges, and roadmap progress.</p>
        </div>

        <div class="dash-top-actions flex justify-between items-center mb-6">
          <h2 class="dash-section-heading">Overview & Metrics</h2>
          <button class="secondary-btn btn-sm" id="dashResetBtn">
            <span>Reset All Progress</span>
          </button>
        </div>

        ${!hasProfile ? `
          <div class="dash-no-profile-box glass-panel text-center py-12 mb-8">
            <span class="dash-empty-icon">📝</span>
            <h3 class="mt-4">Assessment Not Yet Completed</h3>
            <p class="text-muted max-w-md mx-auto mt-2">Take the Class 12 stream assessment to generate your personalized 3–5 Careers Worth Exploring.</p>
            <button class="primary-btn mt-6" data-view="assessment" id="dashStartExploringBtn">Start Exploring →</button>
          </div>
        ` : ''}

        <!-- Top Metrics Cards Grid -->
        <div class="dash-metrics-grid col-3 mb-8">
          <div class="metric-card glass-panel text-center card-tilt">
            <span class="metric-icon">🎓</span>
            <span class="metric-val text-ellipsis">${streamObj ? streamObj.title : 'Not Set'}</span>
            <span class="metric-label">Class 12 Stream</span>
          </div>

          <div class="metric-card glass-panel text-center card-tilt">
            <span class="metric-icon">🏆</span>
            <span class="metric-val">${completedChallenges.length} Badges</span>
            <span class="metric-label">Completed Mini-Challenges</span>
          </div>

          <div class="metric-card glass-panel text-center card-tilt">
            <span class="metric-icon">🗺️</span>
            <span class="metric-val">${completedRoadmapCount} Milestones</span>
            <span class="metric-label">Roadmap Steps Completed</span>
          </div>
        </div>

        ${hasProfile ? `
          <div class="dash-main-grid col-2 mb-8">
            <!-- Left: Profile Summary -->
            <div class="dash-profile-panel glass-panel">
              <div class="panel-header flex justify-between items-center mb-4">
                <h3><span class="panel-icon">👤</span> Profile Summary</h3>
                <button class="tertiary-btn btn-sm" data-view="assessment">Edit Quiz</button>
              </div>

              <div class="dash-field-group mb-4">
                <label class="dash-label">Selected Stream:</label>
                <p class="dash-val-text">${streamObj ? streamObj.title : state.stream} - ${streamObj ? streamObj.subtitle : ''}</p>
              </div>

              <div class="dash-field-group mb-4">
                <label class="dash-label">Top Natural Strengths:</label>
                <div class="chips-flex mt-1">
                  ${strengthsList.length > 0 ? strengthsList.map(s => `<span class="summary-chip strength">${s}</span>`).join('') : '<span class="text-muted">None</span>'}
                </div>
              </div>

              <div class="dash-field-group mb-4">
                <label class="dash-label">Activities & Supporting Signals:</label>
                <div class="chips-flex mt-1">
                  ${extrasList.length > 0 ? extrasList.map(e => `<span class="summary-chip extra">${e}</span>`).join('') : '<span class="text-muted">None</span>'}
                </div>
              </div>
            </div>

            <!-- Right: Recommended Careers Quick List -->
            <div class="dash-careers-panel glass-panel">
              <div class="panel-header flex justify-between items-center mb-4">
                <h3><span class="panel-icon">🚀</span> Top Recommended Pathways</h3>
                <button class="tertiary-btn btn-sm" data-view="results">View Full Profile</button>
              </div>

              <div class="dash-careers-list">
                ${topMatchesHtml}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Navigation Quick Shortcuts -->
        <div class="dash-shortcuts-panel glass-panel p-6 mb-6">
          <h3 class="mb-4">Quick Navigation Shortcuts</h3>
          <div class="shortcuts-grid col-4">
            <button class="shortcut-btn glass-panel" data-view="explorer">
              <span class="sc-icon">🔍</span>
              <span class="sc-label">Career Explorer</span>
            </button>
            <button class="shortcut-btn glass-panel" data-view="experience">
              <span class="sc-icon">⚡</span>
              <span class="sc-label">Experience Challenges</span>
            </button>
            <button class="shortcut-btn glass-panel" data-view="roadmap">
              <span class="sc-icon">🗺️</span>
              <span class="sc-label">Personalized Roadmap</span>
            </button>
            <button class="shortcut-btn glass-panel" data-view="assessment">
              <span class="sc-icon">📝</span>
              <span class="sc-label">Retake Assessment</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function initDashboardEvents(callbacks) {
    const { onNavigate, onReset } = callbacks;

    const resetBtn = document.getElementById('dashResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your CareerQuest assessment data and challenge badges?')) {
          if (onReset) onReset();
        }
      });
    }

    // Attach listeners for all data-view navigation buttons inside Dashboard
    document.querySelectorAll('#mainAppContainer [data-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        if (view && onNavigate) {
          onNavigate(view);
        }
      });
    });

    document.querySelectorAll('[data-dash-experience]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-dash-experience');
        if (window.CQ_EXPERIENCE && window.CQ_EXPERIENCE.setSelectId) {
          window.CQ_EXPERIENCE.setSelectId(id === 'cs_software' ? 'programming' : id);
        }
        if (onNavigate) onNavigate('experience');
      });
    });

    document.querySelectorAll('[data-dash-roadmap]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-dash-roadmap');
        if (window.CQ_ROADMAP && window.CQ_ROADMAP.setSelectId) {
          window.CQ_ROADMAP.setSelectId(id);
        }
        if (onNavigate) onNavigate('roadmap');
      });
    });
  }

  window.CQ_DASHBOARD = {
    renderDashboard,
    initDashboardEvents
  };
})();
