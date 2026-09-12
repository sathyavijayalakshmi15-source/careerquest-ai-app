// CAREERQUEST AI - Animated Analysis Loading Sequence Component

(function() {
  function renderAnalysisLoading() {
    return `
      <div class="analysis-loading-wrapper container section-padding text-center">
        <div class="analysis-card glass-panel text-center">
          <div class="analysis-hud-circle">
            <div class="hud-outer-ring"></div>
            <div class="hud-inner-pulse"></div>
            <div class="hud-core-icon">
              <span class="pulse-spark">✨</span>
            </div>
          </div>

          <div class="badge-pill mt-6 mb-3">
            <span class="pulse-dot"></span>
            <span>MULTI-SIGNAL MATCHING ENGINE</span>
          </div>

          <h2 class="analysis-title">Analyzing Your Profile</h2>
          <p class="analysis-status-text" id="analysisStatusText">Evaluating Academic Signals...</p>

          <div class="analysis-progress-container mt-6">
            <div class="analysis-progress-track">
              <div class="analysis-progress-fill" id="analysisProgressFill"></div>
            </div>
            <span class="analysis-percent" id="analysisPercentText">0%</span>
          </div>

          <div class="analysis-steps-preview mt-8">
            <div class="analysis-step-item active" id="stepCheck1">
              <span class="step-icon">✓</span>
              <span>Class 12 Stream & Academic Interests</span>
            </div>
            <div class="analysis-step-item" id="stepCheck2">
              <span class="step-icon">⚡</span>
              <span>Natural Strengths & Problem Solving</span>
            </div>
            <div class="analysis-step-item" id="stepCheck3">
              <span class="step-icon">🔬</span>
              <span>Cross-referencing Interdisciplinary Careers</span>
            </div>
            <div class="analysis-step-item" id="stepCheck4">
              <span class="step-icon">🚀</span>
              <span>Generating Top 3–5 Paths Worth Exploring</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function startAnalysisAnimation(onComplete) {
    const fill = document.getElementById('analysisProgressFill');
    const percentText = document.getElementById('analysisPercentText');
    const statusText = document.getElementById('analysisStatusText');

    const check1 = document.getElementById('stepCheck1');
    const check2 = document.getElementById('stepCheck2');
    const check3 = document.getElementById('stepCheck3');
    const check4 = document.getElementById('stepCheck4');

    const stages = [
      { pct: 25, status: "Evaluating Academic Signals & Stream Priorities...", step: 1 },
      { pct: 55, status: "Analyzing Natural Strengths & Extracurricular Activities...", step: 2 },
      { pct: 85, status: "Cross-referencing 50+ Career Pathways & Educator Possibilities...", step: 3 },
      { pct: 100, status: "Synthesizing Beyond-The-Stream Career Recommendations!", step: 4 }
    ];

    let currentStageIndex = 0;

    const interval = setInterval(() => {
      if (currentStageIndex >= stages.length) {
        clearInterval(interval);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
        return;
      }

      const stage = stages[currentStageIndex];
      if (fill) fill.style.width = `${stage.pct}%`;
      if (percentText) percentText.innerText = `${stage.pct}%`;
      if (statusText) statusText.innerText = stage.status;

      if (stage.step === 2 && check2) check2.classList.add('active');
      if (stage.step === 3 && check3) check3.classList.add('active');
      if (stage.step === 4 && check4) check4.classList.add('active');

      currentStageIndex++;
    }, 700);
  }

  window.CQ_ANALYSIS_LOADING = {
    renderAnalysisLoading,
    startAnalysisAnimation
  };
})();
