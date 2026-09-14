// CAREERQUEST AI - Single-Question Assessment View Component with Restart Modal

(function() {
  function getAssessmentTotalSteps(stream) {
    const streamQuestions = (window.STREAM_QUESTIONS && stream && window.STREAM_QUESTIONS[stream]) || [];
    return 1 + streamQuestions.length + 4; // Stream + Stream Questions + Extras + Strengths + Prefs + Avoidances
  }

  function renderAssessment(currentStep, assessmentState = {}) {
    const {
      stream = "",
      streamAnswers = [],
      extracurriculars = [],
      strengths = [],
      preferences = [],
      avoidances = [],
      showValidation = false,
      showRestartModal = false,
      navDirection = "next"
    } = assessmentState;

    const streamQuestions = (window.STREAM_QUESTIONS && stream && window.STREAM_QUESTIONS[stream]) || [];
    const totalSteps = getAssessmentTotalSteps(stream);
    const safeStep = Math.min(currentStep, totalSteps);
    const progressPercent = Math.round((safeStep / totalSteps) * 100);

    // Determine current question type & data
    let currentQType = "stream"; // "stream", "stream_q", "extras", "strengths", "prefs", "avoidances"
    let currentStreamQ = null;
    let isCurrentStepValid = false;

    if (safeStep === 1) {
      currentQType = "stream";
      isCurrentStepValid = !!stream;
    } else if (safeStep >= 2 && safeStep <= 1 + streamQuestions.length) {
      currentQType = "stream_q";
      currentStreamQ = streamQuestions[safeStep - 2];
      isCurrentStepValid = (streamAnswers || []).length >= 1;
    } else if (safeStep === 2 + streamQuestions.length) {
      currentQType = "extras";
      isCurrentStepValid = (extracurriculars || []).length >= 1;
    } else if (safeStep === 3 + streamQuestions.length) {
      currentQType = "strengths";
      isCurrentStepValid = (strengths || []).length >= 1;
    } else if (safeStep === 4 + streamQuestions.length) {
      currentQType = "prefs";
      isCurrentStepValid = (preferences || []).length >= 1;
    } else if (safeStep === 5 + streamQuestions.length) {
      currentQType = "avoidances";
      isCurrentStepValid = (avoidances || []).length >= 1;
    }

    let stepTitle = "";
    let stepSubtitle = "";
    let stepContentHtml = "";

    // -------------------------------------------------------------
    // QUESTION 1: STREAM SELECTION
    // -------------------------------------------------------------
    if (currentQType === "stream") {
      stepTitle = "What stream did you study in Class 12?";
      stepSubtitle = "Choose the one that fits you best.";

      const streamOptionsHtml = (window.STREAMS || []).map((s, idx) => {
        const isSelected = stream === s.id;
        return `
          <button type="button" 
                  class="quiz-option-btn stream-quiz-option stagger-item ${isSelected ? 'selected' : ''}" 
                  data-stream-choice="${s.id}" 
                  aria-pressed="${isSelected}"
                  style="animation-delay: ${idx * 0.04}s">
            <div class="quiz-option-icon-badge">${s.icon}</div>
            <div class="quiz-option-content flex-1 text-left">
              <div class="quiz-option-title">${s.title}</div>
              <div class="quiz-option-sub">${s.subtitle}</div>
            </div>
            <div class="quiz-check-indicator">${isSelected ? '✓' : '+'}</div>
          </button>
        `;
      }).join("");

      stepContentHtml = `
        <div class="quiz-options-grid col-2" id="quizOptionsContainer">
          ${streamOptionsHtml}
        </div>
      `;
    }

    // -------------------------------------------------------------
    // STREAM-SPECIFIC INDIVIDUAL QUESTION (1 AT A TIME)
    // -------------------------------------------------------------
    else if (currentQType === "stream_q" && currentStreamQ) {
      stepTitle = currentStreamQ.question;
      stepSubtitle = "Select all that interest you.";

      const optionsHtml = currentStreamQ.options.map((opt, idx) => {
        const isSelected = (streamAnswers || []).includes(opt.id);
        return `
          <button type="button" 
                  class="quiz-option-btn multi-quiz-option stagger-item ${isSelected ? 'selected' : ''}" 
                  data-stream-ans="${opt.id}" 
                  aria-pressed="${isSelected}"
                  style="animation-delay: ${idx * 0.04}s">
            <div class="quiz-option-content flex-1 text-left">
              <div class="quiz-option-title">${opt.label}</div>
            </div>
            <div class="quiz-check-indicator">${isSelected ? '✓' : '+'}</div>
          </button>
        `;
      }).join("");

      stepContentHtml = `
        <div class="quiz-options-grid col-2" id="quizOptionsContainer">
          ${optionsHtml}
        </div>
      `;
    }

    // -------------------------------------------------------------
    // EXTRACURRICULAR ACTIVITIES
    // -------------------------------------------------------------
    else if (currentQType === "extras") {
      stepTitle = "What activities do you enjoy?";
      stepSubtitle = "Select all that interest you.";

      const optionsHtml = (window.EXTRACURRICULAR_OPTIONS || []).map((item, idx) => {
        const isSelected = (extracurriculars || []).includes(item.id);
        return `
          <button type="button" 
                  class="pill-quiz-option stagger-item ${isSelected ? 'selected' : ''}" 
                  data-extra-ans="${item.id}" 
                  aria-pressed="${isSelected}"
                  style="animation-delay: ${idx * 0.025}s">
            <span class="pill-icon">${item.icon}</span>
            <span class="pill-label">${item.label}</span>
            <span class="pill-check">${isSelected ? '✓' : '+'}</span>
          </button>
        `;
      }).join("");

      stepContentHtml = `
        <div class="quiz-pills-grid" id="quizOptionsContainer">
          ${optionsHtml}
        </div>
      `;
    }

    // -------------------------------------------------------------
    // NATURAL STRENGTHS
    // -------------------------------------------------------------
    else if (currentQType === "strengths") {
      stepTitle = "What are your top strengths?";
      stepSubtitle = "Select all that interest you.";

      const optionsHtml = (window.STRENGTHS_OPTIONS || []).map((item, idx) => {
        const isSelected = (strengths || []).includes(item.id);
        return `
          <button type="button" 
                  class="pill-quiz-option strength-pill stagger-item ${isSelected ? 'selected' : ''}" 
                  data-strength-ans="${item.id}" 
                  aria-pressed="${isSelected}"
                  style="animation-delay: ${idx * 0.025}s">
            <span class="pill-icon">${item.icon}</span>
            <span class="pill-label">${item.label}</span>
            <span class="pill-check">${isSelected ? '✓' : '+'}</span>
          </button>
        `;
      }).join("");

      stepContentHtml = `
        <div class="quiz-pills-grid" id="quizOptionsContainer">
          ${optionsHtml}
        </div>
      `;
    }

    // -------------------------------------------------------------
    // CAREER & WORK PREFERENCES
    // -------------------------------------------------------------
    else if (currentQType === "prefs") {
      stepTitle = "What work style appeals to you?";
      stepSubtitle = "Select all that interest you.";

      const optionsHtml = (window.PREFERENCES_OPTIONS || []).map((item, idx) => {
        const isSelected = (preferences || []).includes(item.id);
        return `
          <button type="button" 
                  class="quiz-option-btn multi-quiz-option pref-quiz-option stagger-item ${isSelected ? 'selected' : ''}" 
                  data-pref-ans="${item.id}" 
                  aria-pressed="${isSelected}"
                  style="animation-delay: ${idx * 0.035}s">
            <div class="quiz-option-icon-badge">${item.icon}</div>
            <div class="quiz-option-content flex-1 text-left">
              <span class="quiz-option-title">${item.label}</span>
            </div>
            <div class="quiz-check-indicator">${isSelected ? '✓' : '+'}</div>
          </button>
        `;
      }).join("");

      stepContentHtml = `
        <div class="quiz-options-grid col-2" id="quizOptionsContainer">
          ${optionsHtml}
        </div>
      `;
    }

    // -------------------------------------------------------------
    // WHAT WOULD YOU RATHER AVOID?
    // -------------------------------------------------------------
    else if (currentQType === "avoidances") {
      stepTitle = "What would you rather avoid?";
      stepSubtitle = "Select all that interest you.";

      const optionsHtml = (window.AVOIDANCE_OPTIONS || []).map((item, idx) => {
        const isSelected = (avoidances || []).includes(item.id);
        return `
          <button type="button" 
                  class="quiz-option-btn multi-quiz-option pref-quiz-option stagger-item ${isSelected ? 'selected' : ''}" 
                  data-avoid-ans="${item.id}" 
                  aria-pressed="${isSelected}"
                  style="animation-delay: ${idx * 0.035}s">
            <div class="quiz-option-icon-badge">${item.icon}</div>
            <div class="quiz-option-content flex-1 text-left">
              <span class="quiz-option-title">${item.label}</span>
            </div>
            <div class="quiz-check-indicator">${isSelected ? '✓' : '+'}</div>
          </button>
        `;
      }).join("");

      stepContentHtml = `
        <div class="quiz-options-grid col-2" id="quizOptionsContainer">
          ${optionsHtml}
        </div>
      `;
    }

    // Fallback Safety Protection (Requirement 4: Never render empty options)
    if (!stepContentHtml || stepContentHtml.trim() === "") {
      const fallbackStreams = (window.STREAMS && window.STREAMS.length > 0) ? window.STREAMS : [
        { id: "pcm", title: "Science – PCM", subtitle: "Physics, Chemistry & Mathematics", icon: "📐" },
        { id: "pcb", title: "Science – PCB", subtitle: "Physics, Chemistry & Biology", icon: "🧬" },
        { id: "pcmb", title: "Science – PCMB / Bio-Maths", subtitle: "Physics, Chemistry, Maths & Biology", icon: "🔬" },
        { id: "cs_maths", title: "Science – Computer Science + Maths", subtitle: "Computer Science & Mathematics", icon: "💻" },
        { id: "commerce", title: "Commerce", subtitle: "Accounts, Finance & Business", icon: "📊" },
        { id: "arts", title: "Humanities / Arts", subtitle: "Law, History, Psychology & Policy", icon: "⚖️" },
        { id: "vocational", title: "Vocational / Other", subtitle: "Applied Technical & Practical Skills", icon: "🛠️" }
      ];

      stepTitle = "What stream did you study in Class 12?";
      stepSubtitle = "Select your academic stream to personalize the assessment.";
      stepContentHtml = `
        <div class="quiz-options-grid col-2" id="quizOptionsContainer">
          ${fallbackStreams.map(s => `
            <button type="button" 
                    class="quiz-option-btn stream-quiz-option stagger-item ${stream === s.id ? 'selected' : ''}" 
                    data-stream-choice="${s.id}">
              <div class="quiz-option-icon-badge">${s.icon}</div>
              <div class="quiz-option-content flex-1 text-left">
                <div class="quiz-option-title">${s.title}</div>
                <div class="quiz-option-sub">${s.subtitle}</div>
              </div>
              <div class="quiz-check-indicator">${stream === s.id ? '✓' : '+'}</div>
            </button>
          `).join('')}
        </div>
      `;
    }

    // Slide transition animation
    const slideAnimClass = navDirection === "back" ? "quiz-slide-back" : "quiz-slide-next";

    // Restart Modal HTML
    const restartModalHtml = showRestartModal ? `
      <div class="modal-overlay active" id="restartModalOverlay">
        <div class="glass-panel restart-modal-card">
          <div class="restart-modal-icon">🔄</div>
          <h3 class="restart-modal-title mt-2">Restart the assessment?</h3>
          <p class="restart-modal-text mt-2">Your current answers will be cleared and you will start over from Question 1.</p>
          <div class="restart-modal-actions mt-6 flex justify-center gap-3">
            <button type="button" class="secondary-btn" id="cancelRestartBtn">Cancel</button>
            <button type="button" class="primary-btn danger-btn" id="confirmRestartBtn">Restart Test</button>
          </div>
        </div>
      </div>
    ` : '';

    return `
      <div class="assessment-container container section-padding">
        <div class="assessment-card glass-panel ${slideAnimClass}" id="quizCardPanel">
          <!-- TOP HEADER BAR: Step tracker, Restart, Progress Bar -->
          <div class="quiz-header">
            <div class="quiz-top-nav-bar flex justify-between items-center mb-3">
              <div class="quiz-counter-pill">
                <span class="pulse-spark">✨</span>
                <span>Question ${safeStep} of ${totalSteps}</span>
              </div>
              <button type="button" class="restart-test-btn" id="triggerRestartModalBtn" title="Restart Assessment">
                <span>🔄</span>
                <span>Restart Test</span>
              </button>
            </div>

            <!-- Compact Animated Progress Bar -->
            <div class="progress-track mt-1 mb-4">
              <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>

            <h2 class="quiz-step-title mt-2">${stepTitle}</h2>
            ${stepSubtitle ? `<p class="quiz-step-subtitle mt-1">${stepSubtitle}</p>` : ''}
          </div>

          <!-- CENTER: Inline Validation Alert -->
          <div class="quiz-validation-banner ${showValidation ? '' : 'hidden'} mt-4" id="quizValidationBanner">
            <span class="val-icon">⚠️</span>
            <span>Choose an option to continue.</span>
          </div>

          <!-- CENTER: Question Options Area -->
          <div class="quiz-body mt-5">
            ${stepContentHtml}
          </div>

          <!-- BOTTOM: Navigation Footer Controls -->
          <div class="quiz-footer mt-8">
            <button type="button" class="secondary-btn quiz-back-btn" ${safeStep === 1 ? 'disabled' : ''} id="quizBackBtn" aria-label="Previous question">
              ← Back
            </button>

            <button type="button" class="primary-btn quiz-next-btn ${isCurrentStepValid ? 'valid' : 'disabled-state'}" id="quizNextBtn" aria-label="Next question">
              <span>${safeStep === totalSteps ? 'Analyze Profile ✨' : 'Next Step'}</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
      ${restartModalHtml}
    `;
  }

  function hideValidationBanner() {
    const banner = document.getElementById('quizValidationBanner');
    const container = document.getElementById('quizOptionsContainer');
    if (banner) banner.classList.add('hidden');
    if (container) container.classList.remove('validation-highlight');
  }

  function initAssessmentEvents(currentStep, assessmentState, callbacks) {
    const { onSelectStream, onToggleAnswer, onNext, onBack, onRequestRestart, onCancelRestart, onConfirmRestart } = callbacks;

    // Step 1 Stream Choice
    document.querySelectorAll('[data-stream-choice]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hideValidationBanner();
        const streamId = e.currentTarget.getAttribute('data-stream-choice');
        if (onSelectStream) onSelectStream(streamId);
      });
    });

    // Stream Answer Choice
    document.querySelectorAll('[data-stream-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hideValidationBanner();
        const ansId = e.currentTarget.getAttribute('data-stream-ans');
        if (onToggleAnswer) onToggleAnswer('streamAnswers', ansId);
      });
    });

    // Extracurricular Choice
    document.querySelectorAll('[data-extra-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hideValidationBanner();
        const ansId = e.currentTarget.getAttribute('data-extra-ans');
        if (onToggleAnswer) onToggleAnswer('extracurriculars', ansId);
      });
    });

    // Strength Choice
    document.querySelectorAll('[data-strength-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hideValidationBanner();
        const ansId = e.currentTarget.getAttribute('data-strength-ans');
        if (onToggleAnswer) onToggleAnswer('strengths', ansId);
      });
    });

    // Preference Choice
    document.querySelectorAll('[data-pref-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hideValidationBanner();
        const ansId = e.currentTarget.getAttribute('data-pref-ans');
        if (onToggleAnswer) onToggleAnswer('preferences', ansId);
      });
    });

    // Avoidance Choice
    document.querySelectorAll('[data-avoid-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hideValidationBanner();
        const ansId = e.currentTarget.getAttribute('data-avoid-ans');
        if (onToggleAnswer) onToggleAnswer('avoidances', ansId);
      });
    });

    // Back Button
    const backBtn = document.getElementById('quizBackBtn');
    if (backBtn) backBtn.addEventListener('click', onBack);

    // Next Button
    const nextBtn = document.getElementById('quizNextBtn');
    if (nextBtn) nextBtn.addEventListener('click', onNext);

    // Trigger Restart Modal Button
    const restartBtn = document.getElementById('triggerRestartModalBtn');
    if (restartBtn) restartBtn.addEventListener('click', onRequestRestart);

    // Cancel Restart Button
    const cancelRestartBtn = document.getElementById('cancelRestartBtn');
    if (cancelRestartBtn) cancelRestartBtn.addEventListener('click', onCancelRestart);

    // Confirm Restart Button
    const confirmRestartBtn = document.getElementById('confirmRestartBtn');
    if (confirmRestartBtn) confirmRestartBtn.addEventListener('click', onConfirmRestart);

    // Click outside modal overlay to cancel
    const overlay = document.getElementById('restartModalOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay && onCancelRestart) onCancelRestart();
      });
    }
  }

  window.CQ_ASSESSMENT = {
    getAssessmentTotalSteps,
    renderAssessment,
    initAssessmentEvents
  };
})();
