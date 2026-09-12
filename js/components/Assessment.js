// CAREERQUEST AI - Dynamic Assessment Questionnaire Component

(function() {
  function renderAssessment(currentStep, assessmentState) {
    const totalSteps = 5;
    const progressPercent = Math.round((currentStep / totalSteps) * 100);

    const {
      stream = "",
      streamAnswers = [],
      extracurriculars = [],
      strengths = [],
      preferences = []
    } = assessmentState;

    let stepTitle = "";
    let stepSubtitle = "";
    let stepContentHtml = "";

    // Step 1: Stream Selection (STRICT FIRST QUESTION)
    if (currentStep === 1) {
      stepTitle = "What stream did you study in Class 12?";
      stepSubtitle = "Select your academic background. Subsequent questions will dynamically adjust to your stream.";

      const streamOptionsHtml = (window.STREAMS || []).map(s => {
        const isSelected = stream === s.id;
        return `
          <button class="quiz-option-btn stream-quiz-option ${isSelected ? 'selected' : ''}" data-stream-choice="${s.id}">
            <div class="quiz-option-icon">${s.icon}</div>
            <div class="quiz-option-content text-left">
              <div class="quiz-option-title">${s.title}</div>
              <div class="quiz-option-sub">${s.subtitle}</div>
            </div>
            <div class="quiz-check-indicator">${isSelected ? '✓' : ''}</div>
          </button>
        `;
      }).join("");

      stepContentHtml = `
        <div class="quiz-options-grid stream-options-grid">
          ${streamOptionsHtml}
        </div>
      `;
    }

    // Step 2: Stream-Specific Questions
    else if (currentStep === 2) {
      const streamObj = (window.STREAMS || []).find(s => s.id === stream);
      stepTitle = `Academic & Subject Interests (${streamObj ? streamObj.title : 'Stream'})`;
      stepSubtitle = "Select the specific topics, problem styles, and scientific domains that excite you most.";

      const questionsList = (window.STREAM_QUESTIONS && window.STREAM_QUESTIONS[stream]) || [];

      if (questionsList.length === 0) {
        stepContentHtml = `<p class="text-muted">General assessment questions tailored for your selected stream.</p>`;
      } else {
        stepContentHtml = questionsList.map((q, qIndex) => {
          const optionsHtml = q.options.map(opt => {
            const isSelected = streamAnswers.includes(opt.id);
            return `
              <button class="quiz-option-btn multi-quiz-option ${isSelected ? 'selected' : ''}" data-stream-ans="${opt.id}">
                <span class="quiz-option-title">${opt.label}</span>
                <span class="quiz-check-indicator">${isSelected ? '✓' : '+'}</span>
              </button>
            `;
          }).join("");

          return `
            <div class="quiz-question-block mb-6">
              <h4 class="quiz-question-text">${qIndex + 1}. ${q.question}</h4>
              <div class="quiz-options-grid col-2">
                ${optionsHtml}
              </div>
            </div>
          `;
        }).join("");
      }
    }

    // Step 3: Other Interests & Activities (Supporting Signals)
    else if (currentStep === 3) {
      stepTitle = "Other Interests & Activities";
      stepSubtitle = "Select any extracurricular pursuits, clubs, or hobbies. These act as supporting signals, not direct career predictors.";

      const optionsHtml = (window.EXTRACURRICULAR_OPTIONS || []).map(item => {
        const isSelected = extracurriculars.includes(item.id);
        return `
          <button class="quiz-option-btn pill-quiz-option ${isSelected ? 'selected' : ''}" data-extra-ans="${item.id}">
            <span class="pill-icon">${item.icon}</span>
            <span class="pill-label">${item.label}</span>
            <span class="pill-check">${isSelected ? '✓' : '+'}</span>
          </button>
        `;
      }).join("");

      stepContentHtml = `
        <div class="quiz-pills-grid">
          ${optionsHtml}
        </div>
      `;
    }

    // Step 4: Natural Strengths
    else if (currentStep === 4) {
      stepTitle = "What are your natural strengths?";
      stepSubtitle = "Select 3 to 6 key strengths that describe your natural abilities and working style.";

      const optionsHtml = (window.STRENGTHS_OPTIONS || []).map(item => {
        const isSelected = strengths.includes(item.id);
        return `
          <button class="quiz-option-btn pill-quiz-option strength-pill ${isSelected ? 'selected' : ''}" data-strength-ans="${item.id}">
            <span class="pill-icon">${item.icon}</span>
            <span class="pill-label">${item.label}</span>
            <span class="pill-check">${isSelected ? '✓' : '+'}</span>
          </button>
        `;
      }).join("");

      stepContentHtml = `
        <div class="quiz-pills-grid">
          ${optionsHtml}
        </div>
      `;
    }

    // Step 5: Career Preferences & Work Environment
    else if (currentStep === 5) {
      stepTitle = "Career & Work Preferences";
      stepSubtitle = "What type of work environment and purpose appeals most to your ideal future?";

      const optionsHtml = (window.PREFERENCES_OPTIONS || []).map(item => {
        const isSelected = preferences.includes(item.id);
        return `
          <button class="quiz-option-btn multi-quiz-option pref-quiz-option ${isSelected ? 'selected' : ''}" data-pref-ans="${item.id}">
            <span class="quiz-option-icon">${item.icon}</span>
            <span class="quiz-option-title">${item.label}</span>
            <span class="quiz-check-indicator">${isSelected ? '✓' : '+'}</span>
          </button>
        `;
      }).join("");

      stepContentHtml = `
        <div class="quiz-options-grid col-2">
          ${optionsHtml}
        </div>
      `;
    }

    return `
      <div class="assessment-container container section-padding">
        <div class="assessment-card glass-panel">
          <!-- Quiz Header & Progress -->
          <div class="quiz-header">
            <div class="quiz-step-badge">
              <span>Question ${currentStep} of ${totalSteps}</span>
              <span class="quiz-step-percent">${progressPercent}% Completed</span>
            </div>

            <!-- Animated Progress Bar -->
            <div class="progress-track">
              <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>

            <h2 class="quiz-step-title mt-4">${stepTitle}</h2>
            <p class="quiz-step-subtitle">${stepSubtitle}</p>
          </div>

          <!-- Question Content Body -->
          <div class="quiz-body mt-6">
            ${stepContentHtml}
          </div>

          <!-- Navigation Footer -->
          <div class="quiz-footer mt-8">
            <button class="secondary-btn quiz-back-btn" ${currentStep === 1 ? 'disabled' : ''} id="quizBackBtn">
              ← Back
            </button>

            <button class="tertiary-btn quiz-clear-btn" id="quizClearBtn">
              Clear Selection
            </button>

            <button class="primary-btn quiz-next-btn" id="quizNextBtn">
              <span>${currentStep === totalSteps ? 'Analyze Profile' : 'Next Step'}</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function initAssessmentEvents(currentStep, assessmentState, callbacks) {
    const { onSelectStream, onToggleAnswer, onNext, onBack, onClear } = callbacks;

    // Step 1 stream selection
    document.querySelectorAll('[data-stream-choice]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const streamId = e.currentTarget.getAttribute('data-stream-choice');
        if (onSelectStream) onSelectStream(streamId);
      });
    });

    // Step 2 stream answer toggles
    document.querySelectorAll('[data-stream-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ansId = e.currentTarget.getAttribute('data-stream-ans');
        if (onToggleAnswer) onToggleAnswer('streamAnswers', ansId);
      });
    });

    // Step 3 extracurricular toggles
    document.querySelectorAll('[data-extra-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ansId = e.currentTarget.getAttribute('data-extra-ans');
        if (onToggleAnswer) onToggleAnswer('extracurriculars', ansId);
      });
    });

    // Step 4 strength toggles
    document.querySelectorAll('[data-strength-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ansId = e.currentTarget.getAttribute('data-strength-ans');
        if (onToggleAnswer) onToggleAnswer('strengths', ansId);
      });
    });

    // Step 5 preference toggles
    document.querySelectorAll('[data-pref-ans]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ansId = e.currentTarget.getAttribute('data-pref-ans');
        if (onToggleAnswer) onToggleAnswer('preferences', ansId);
      });
    });

    // Back button
    const backBtn = document.getElementById('quizBackBtn');
    if (backBtn) backBtn.addEventListener('click', onBack);

    // Next button
    const nextBtn = document.getElementById('quizNextBtn');
    if (nextBtn) nextBtn.addEventListener('click', onNext);

    // Clear button
    const clearBtn = document.getElementById('quizClearBtn');
    if (clearBtn) clearBtn.addEventListener('click', onClear);
  }

  window.CQ_ASSESSMENT = {
    renderAssessment,
    initAssessmentEvents
  };
})();
