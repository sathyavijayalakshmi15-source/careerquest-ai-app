// CAREERQUEST AI - Premium Assessment Questionnaire View Component

(function() {
  function renderAssessment(currentStep, assessmentState = {}) {
    const totalSteps = 5;
    const progressPercent = Math.round((currentStep / totalSteps) * 100);

    const {
      stream = "",
      streamAnswers = [],
      extracurriculars = [],
      strengths = [],
      preferences = [],
      showValidation = false,
      navDirection = "next"
    } = assessmentState;

    // Check validity of current step
    let isCurrentStepValid = false;
    if (currentStep === 1) isCurrentStepValid = !!stream;
    else if (currentStep === 2) isCurrentStepValid = (streamAnswers || []).length >= 1;
    else if (currentStep === 3) isCurrentStepValid = (extracurriculars || []).length >= 1;
    else if (currentStep === 4) isCurrentStepValid = (strengths || []).length >= 1;
    else if (currentStep === 5) isCurrentStepValid = (preferences || []).length >= 1;

    // Section context badges & labels
    const sectionBadges = [
      "1. ACADEMIC STREAM FOUNDATION",
      "2. SUBJECT INTERESTS & SPECIFIC FIELDS",
      "3. EXTRACURRICULAR & SUPPORTING ACTIVITIES",
      "4. NATURAL STRENGTHS & APTITUDES",
      "5. CAREER & WORK PREFERENCES"
    ];

    const contextLabels = [
      "Let's start with your Class 12 academic foundation.",
      "Let's understand your subject interests and academic focus.",
      "Now let's explore your activities and supporting pursuits.",
      "Next, let's look at your natural strengths and problem-solving style.",
      "Finally, let's explore the work environment and impact you want to make."
    ];

    const currentSectionBadge = sectionBadges[currentStep - 1] || `STEP ${currentStep}`;
    const currentContextLabel = contextLabels[currentStep - 1] || "Guide your career discovery.";

    let stepTitle = "";
    let stepSubtitle = "";
    let stepContentHtml = "";

    // -------------------------------------------------------------
    // STEP 1: CLASS 12 ACADEMIC STREAM
    // -------------------------------------------------------------
    if (currentStep === 1) {
      stepTitle = "What stream did you study in Class 12?";
      stepSubtitle = "Select your Class 12 academic background. Subsequent questions will dynamically adjust to your stream.";

      const streamOptionsHtml = (window.STREAMS || []).map((s, idx) => {
        const isSelected = stream === s.id;
        return `
          <button type="button" 
                  class="quiz-option-btn stream-quiz-option stagger-item ${isSelected ? 'selected' : ''}" 
                  data-stream-choice="${s.id}" 
                  aria-pressed="${isSelected}"
                  style="animation-delay: ${idx * 0.05}s">
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
        <div class="quiz-options-grid stream-options-grid col-2" id="quizOptionsContainer">
          ${streamOptionsHtml}
        </div>
      `;
    }

    // -------------------------------------------------------------
    // STEP 2: STREAM-SPECIFIC SUBJECT INTERESTS
    // -------------------------------------------------------------
    else if (currentStep === 2) {
      const streamObj = (window.STREAMS || []).find(s => s.id === stream);
      const streamTitle = streamObj ? streamObj.title : 'Stream';
      stepTitle = `Academic & Subject Interests (${streamTitle})`;
      stepSubtitle = "Select at least one specific topic or problem-solving direction that excites you most.";

      const questionsList = (window.STREAM_QUESTIONS && window.STREAM_QUESTIONS[stream]) || [];

      if (questionsList.length === 0) {
        stepContentHtml = `
          <div class="glass-panel p-6 text-center text-muted" id="quizOptionsContainer">
            General assessment questions tailored for your selected stream.
          </div>
        `;
      } else {
        stepContentHtml = `
          <div id="quizOptionsContainer" class="quiz-questions-wrapper">
            ${questionsList.map((q, qIndex) => {
              const optionsHtml = q.options.map((opt, oIdx) => {
                const isSelected = streamAnswers.includes(opt.id);
                return `
                  <button type="button" 
                          class="quiz-option-btn multi-quiz-option stagger-item ${isSelected ? 'selected' : ''}" 
                          data-stream-ans="${opt.id}" 
                          aria-pressed="${isSelected}"
                          style="animation-delay: ${(qIndex * 4 + oIdx) * 0.04}s">
                    <div class="quiz-option-content flex-1 text-left">
                      <span class="quiz-option-title">${opt.label}</span>
                    </div>
                    <div class="quiz-check-indicator">${isSelected ? '✓' : '+'}</div>
                  </button>
                `;
              }).join("");

              return `
                <div class="quiz-question-block mb-6">
                  <h4 class="quiz-question-text mb-3">
                    <span class="q-num-badge">${qIndex + 1}</span> ${q.question}
                  </h4>
                  <div class="quiz-options-grid col-2">
                    ${optionsHtml}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `;
      }
    }

    // -------------------------------------------------------------
    // STEP 3: EXTRACURRICULAR ACTIVITIES & PURSUITS
    // -------------------------------------------------------------
    else if (currentStep === 3) {
      stepTitle = "Other Interests & Activities";
      stepSubtitle = "Select at least one activity or hobby. These act as supporting signals for your exploration profile.";

      const optionsHtml = (window.EXTRACURRICULAR_OPTIONS || []).map((item, idx) => {
        const isSelected = extracurriculars.includes(item.id);
        return `
          <button type="button" 
                  class="pill-quiz-option stagger-item ${isSelected ? 'selected' : ''}" 
                  data-extra-ans="${item.id}" 
                  aria-pressed="${isSelected}"
                  style="animation-delay: ${idx * 0.03}s">
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
    // STEP 4: NATURAL STRENGTHS & APTITUDES
    // -------------------------------------------------------------
    else if (currentStep === 4) {
      stepTitle = "What are your natural strengths?";
      stepSubtitle = "Select at least 1 key strength that describes your problem-solving style and abilities.";

      const optionsHtml = (window.STRENGTHS_OPTIONS || []).map((item, idx) => {
        const isSelected = strengths.includes(item.id);
        return `
          <button type="button" 
                  class="pill-quiz-option strength-pill stagger-item ${isSelected ? 'selected' : ''}" 
                  data-strength-ans="${item.id}" 
                  aria-pressed="${isSelected}"
                  style="animation-delay: ${idx * 0.03}s">
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
    // STEP 5: CAREER & WORK PREFERENCES
    // -------------------------------------------------------------
    else if (currentStep === 5) {
      stepTitle = "Career & Work Preferences";
      stepSubtitle = "What type of work environment or purpose appeals most to your ideal future?";

      const optionsHtml = (window.PREFERENCES_OPTIONS || []).map((item, idx) => {
        const isSelected = preferences.includes(item.id);
        return `
          <button type="button" 
                  class="quiz-option-btn multi-quiz-option pref-quiz-option stagger-item ${isSelected ? 'selected' : ''}" 
                  data-pref-ans="${item.id}" 
                  aria-pressed="${isSelected}"
                  style="animation-delay: ${idx * 0.04}s">
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

    // Directional transition animation class
    const slideAnimClass = navDirection === "back" ? "quiz-slide-back" : "quiz-slide-next";

    return `
      <div class="assessment-container container section-padding">
        <div class="assessment-card glass-panel ${slideAnimClass}" id="quizCardPanel">
          <!-- TOP: Brand Bar & Progress Tracker -->
          <div class="quiz-header">
            <div class="quiz-top-bar flex justify-between items-center mb-3">
              <div class="section-pill-badge">
                <span class="pulse-spark">✨</span>
                <span>${currentSectionBadge}</span>
              </div>
              <div class="quiz-step-percent">${progressPercent}% Completed</div>
            </div>

            <div class="progress-info-row flex justify-between items-center mb-2">
              <span class="quiz-step-counter">Question ${currentStep} of ${totalSteps}</span>
              <span class="quiz-context-label">${currentContextLabel}</span>
            </div>

            <!-- Animated Progress Bar -->
            <div class="progress-track mt-1">
              <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>

            <h2 class="quiz-step-title mt-5">${stepTitle}</h2>
            <p class="quiz-step-subtitle">${stepSubtitle}</p>
          </div>

          <!-- CENTER: Inline Validation Alert Banner -->
          <div class="quiz-validation-banner ${showValidation ? '' : 'hidden'} mt-4" id="quizValidationBanner">
            <span class="val-icon">⚠️</span>
            <span>Please select an answer to continue.</span>
          </div>

          <!-- CENTER: Question Options Content Body -->
          <div class="quiz-body mt-6">
            ${stepContentHtml}
          </div>

          <!-- BOTTOM: Navigation Footer Controls -->
          <div class="quiz-footer mt-8">
            <button class="secondary-btn quiz-back-btn" ${currentStep === 1 ? 'disabled' : ''} id="quizBackBtn" aria-label="Previous question">
              ← Back
            </button>

            <button class="tertiary-btn quiz-clear-btn" id="quizClearBtn" aria-label="Clear current selection">
              Clear Selection
            </button>

            <button class="primary-btn quiz-next-btn ${isCurrentStepValid ? 'valid' : 'disabled-state'}" id="quizNextBtn" aria-label="Next question">
              <span>${currentStep === totalSteps ? 'Analyze Profile ✨' : 'Next Step'}</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function hideValidationBanner() {
    const banner = document.getElementById('quizValidationBanner');
    const container = document.getElementById('quizOptionsContainer');
    if (banner) banner.classList.add('hidden');
    if (container) container.classList.remove('validation-highlight');
  }

  function initAssessmentEvents(currentStep, assessmentState, callbacks) {
    const { onSelectStream, onToggleAnswer, onNext, onBack, onClear } = callbacks;

    // Step 1 Stream Selection
    document.querySelectorAll('[data-stream-choice]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hideValidationBanner();
        const streamId = e.currentTarget.getAttribute('data-stream-choice');
        if (onSelectStream) onSelectStream(streamId);
      });
    });

    // Step 2 Stream Answer Toggles
    document.querySelectorAll('[data-stream-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hideValidationBanner();
        const ansId = e.currentTarget.getAttribute('data-stream-ans');
        if (onToggleAnswer) onToggleAnswer('streamAnswers', ansId);
      });
    });

    // Step 3 Extracurricular Toggles
    document.querySelectorAll('[data-extra-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hideValidationBanner();
        const ansId = e.currentTarget.getAttribute('data-extra-ans');
        if (onToggleAnswer) onToggleAnswer('extracurriculars', ansId);
      });
    });

    // Step 4 Strength Toggles
    document.querySelectorAll('[data-strength-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hideValidationBanner();
        const ansId = e.currentTarget.getAttribute('data-strength-ans');
        if (onToggleAnswer) onToggleAnswer('strengths', ansId);
      });
    });

    // Step 5 Preference Toggles
    document.querySelectorAll('[data-pref-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hideValidationBanner();
        const ansId = e.currentTarget.getAttribute('data-pref-ans');
        if (onToggleAnswer) onToggleAnswer('preferences', ansId);
      });
    });

    // Back Button
    const backBtn = document.getElementById('quizBackBtn');
    if (backBtn) backBtn.addEventListener('click', onBack);

    // Next Button
    const nextBtn = document.getElementById('quizNextBtn');
    if (nextBtn) nextBtn.addEventListener('click', onNext);

    // Clear Button
    const clearBtn = document.getElementById('quizClearBtn');
    if (clearBtn) clearBtn.addEventListener('click', onClear);
  }

  window.CQ_ASSESSMENT = {
    renderAssessment,
    initAssessmentEvents
  };
})();
