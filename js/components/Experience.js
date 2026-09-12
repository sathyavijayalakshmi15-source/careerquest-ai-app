// CAREERQUEST AI - Interactive Career Mini-Challenges Component

(function() {
  const CHALLENGES = [
    {
      id: "programming",
      title: "Software Bug Debugger",
      category: "Technology",
      icon: "⌨️",
      description: "Identify the logical bug in an algorithm designed to calculate student grade averages.",
      scenario: "Code Snippet: <br/><code>function getAverage(scores) { <br/> &nbsp;&nbsp;let total = 0;<br/> &nbsp;&nbsp;for (let i = 0; i <= scores.length; i++) { total += scores[i]; }<br/> &nbsp;&nbsp;return total / scores.length;<br/>}</code>",
      question: "Why is this code throwing an NaN or Index Error on execution?",
      options: [
        { id: "opt1", text: "Loop condition should be `i < scores.length` instead of `<=`, causing off-by-one index out of bounds.", correct: true, feedback: "Correct! In 0-indexed arrays, `i <= length` tries to access `scores[length]` which is undefined, producing NaN." },
        { id: "opt2", text: "The total variable should be initialized to 1 instead of 0.", correct: false, feedback: "Incorrect. Initializing total to 1 would skew the sum addition." },
        { id: "opt3", text: "Division by `scores.length` is invalid in JavaScript.", correct: false, feedback: "Incorrect. Dividing total by array length is valid math." }
      ]
    },
    {
      id: "data_science",
      title: "Data Pattern & Insight Spotter",
      category: "Technology",
      icon: "📊",
      description: "Analyze a sales dataset trend and diagnose the root cause of an unexpected drop.",
      scenario: "Dataset Trend: <br/>• Mobile Traffic: +45% Up<br/>• Desktop Traffic: Constant<br/>• Mobile Checkout Conversion: Drop from 4.2% to 0.8% immediately following Thursday's v2.1 app update release.",
      question: "What is the most likely data hypothesis?",
      options: [
        { id: "opt1", text: "A bug was introduced in the mobile checkout button layout during Thursday's v2.1 update.", correct: true, feedback: "Spot on! The sudden drop in conversion rate specifically on mobile after Thursday's app deployment points directly to a mobile UI/checkout bug." },
        { id: "opt2", text: "Desktop users suddenly stopped buying items.", correct: false, feedback: "Incorrect. Data shows desktop traffic stayed constant." },
        { id: "opt3", text: "Prices of products increased globally across all devices.", correct: false, feedback: "Incorrect. If prices increased globally, desktop conversion would also drop equally." }
      ]
    },
    {
      id: "engineering",
      title: "Bridge Structural Load Balancing",
      category: "Engineering",
      icon: "🌉",
      description: "Select structural truss materials and joint angles for maximum weight capacity under wind resistance.",
      scenario: "Challenge: A river span bridge of 80 meters experiences high gust winds (90 km/h) and heavy truck traffic.",
      question: "Which engineering design choice provides maximum torsional stability and safety?",
      options: [
        { id: "opt1", text: "Triangular Pratt steel truss geometry with aerodynamic wind deflection vents.", correct: true, feedback: "Engineered to perfection! Triangular trusses distribute compression and tension forces efficiently while vents reduce wind resistance." },
        { id: "opt2", text: "Solid unvented rectangular concrete slab without truss support.", correct: false, feedback: "High risk! Solid unvented slabs catch heavy wind load like a sail, inducing high bending torque." },
        { id: "opt3", text: "Thin single cable suspension without cross-bracing.", correct: false, feedback: "Unsafe! Lacks cross-bracing to handle heavy truck vibration." }
      ]
    },
    {
      id: "teaching",
      title: "Virtual Classroom Concept Explainer",
      category: "Education",
      icon: "🎓",
      description: "A student asks: 'Why doesn't heavy gravity make light bend if light has no mass?'",
      scenario: "Student Query: 'In physics class, you said light has no mass, but massive black holes trap light. How is that possible?'",
      question: "As an educator, which explanation is the clearest pedagogical approach?",
      options: [
        { id: "opt1", text: "Use Einstein's Trampoline Analogy: Heavy mass curves the fabric of Spacetime itself; light follows the straightest path through curved space.", correct: true, feedback: "Outstanding teaching methodology! Visual analogies break down complex General Relativity into intuitive mental models." },
        { id: "opt2", text: "Tell the student to memorize the equation E = mc^2 without explaining curvature.", correct: false, feedback: "Ineffective teaching! Memorizing equations without physical intuition demotivates student curiosity." },
        { id: "opt3", text: "Say light secretly has heavy mass inside black holes.", correct: false, feedback: "Factually incorrect! Light photons remain massless." }
      ]
    },
    {
      id: "finance",
      title: "Startup Capital Allocation & Risk Simulator",
      category: "Commerce & Finance",
      icon: "📈",
      description: "Allocate ₹50 Lakhs budget for a growing retail firm facing high inventory holding costs.",
      scenario: "Financial Health: <br/>Cash Reserves: ₹50 Lakhs | High Warehousing Costs | Manual Inventory Tracking causes 20% stock decay.",
      question: "What is the optimal capital deployment strategy to maximize ROI?",
      options: [
        { id: "opt1", text: "Invest ₹15 Lakhs in Automated Inventory Software + ₹25 Lakhs in High-Yield Short Term Treasury + ₹10 Lakhs Emergency Liquidity.", correct: true, feedback: "Brilliant financial allocation! Eliminating inventory decay saves 20% margin while keeping capital liquid and earning treasury yield." },
        { id: "opt2", text: "Spend all ₹50 Lakhs on aggressive celebrity billboard advertisements.", correct: false, feedback: "High risk! Spending cash reserves on ads while inventory leaks 20% stock will exacerbate cash flow distress." },
        { id: "opt3", text: "Keep ₹50 Lakhs cash in non-interest checking account without fixing inventory leakage.", correct: false, feedback: "Inefficient capital management!" }
      ]
    },
    {
      id: "creative_ui",
      title: "App Color Psychology & Contrast Audit",
      category: "Creative & Media",
      icon: "🎨",
      description: "Review a mobile healthcare app's emergency CTA button styling for color contrast accessibility.",
      scenario: "Current UI: Emergency SOS Call Button uses Light Yellow text `#FFFF99` on a Light Red background `#FF8888`.",
      question: "What design flaw violates WCAG accessibility guidelines?",
      options: [
        { id: "opt1", text: "Severe low contrast ratio (< 3:1) making text illegible for elderly users in high sunlight.", correct: true, feedback: "Design spot on! High contrast (4.5:1+) dark/white text on deep fiery red background is essential for accessible medical UX." },
        { id: "opt2", text: "The button is shaped as a rounded rectangle instead of a circle.", correct: false, feedback: "Incorrect. Button shape is aesthetic; color contrast ratio is the critical accessibility flaw." },
        { id: "opt3", text: "Yellow text is always forbidden in digital design.", correct: false, feedback: "Incorrect. Yellow on dark backdrops works well; yellow on light red fails contrast." }
      ]
    },
    {
      id: "defence",
      title: "Tactical Relief Command Decision",
      category: "Defence",
      icon: "🎖️",
      description: "As an Officer in Command, lead a tactical flood rescue team with broken communication links.",
      scenario: "Situation: Flash flood cuts off 400 villagers in sector B. Helicopter landing is restricted by high wind. Main bridge is submerged.",
      question: "Which command decision demonstrates Officer-Like Qualities (OLQ)?",
      options: [
        { id: "opt1", text: "Dispatch amphibious rescue boats via river bend while setting up high-frequency radio relay on ridge.", correct: true, feedback: "Outstanding military leadership! Demonstrates rapid situational adaptation, safety protocol, and initiative under pressure." },
        { id: "opt2", text: "Order team to wait 24 hours until weather clears completely.", correct: false, feedback: "Lacks initiative in high-risk emergency rescue." },
        { id: "opt3", text: "Attempt helicopter hover drop despite gale-force wind warnings.", correct: false, feedback: "Violates safety limits, endangering flight crew and helicopter asset." }
      ]
    },
    {
      id: "healthcare",
      title: "Diagnostic Reasoning Challenge",
      category: "Medical & Healthcare",
      icon: "🩺",
      description: "A 45-year-old patient presents with acute fatigue, high thirst, and slow-healing skin cuts.",
      scenario: "Clinical Symptoms: Polydipsia (excessive thirst), Polyuria (frequent urination), Fasting Blood Glucose = 195 mg/dL (Normal < 100 mg/dL).",
      question: "What primary diagnostic condition requires clinical evaluation?",
      options: [
        { id: "opt1", text: "Type-2 Diabetes Mellitus requiring blood glucose management and lifestyle counseling.", correct: true, feedback: "Accurate clinical reasoning! Elevated fasting blood glucose paired with classical polydipsia/polyuria confirms Diabetes evaluation." },
        { id: "opt2", text: "Acute Iron-Deficiency Anemia.", correct: false, feedback: "Incorrect. Anemia is characterized by low hemoglobin, not high fasting blood glucose." },
        { id: "opt3", text: "Common Viral Cold.", correct: false, feedback: "Incorrect. Fasting blood glucose 195 mg/dL is unrelated to viral upper respiratory infection." }
      ]
    },
    {
      id: "aviation",
      title: "Flight Cockpit Instrument Orientation",
      category: "Aviation",
      icon: "✈️",
      description: "Cross-check cockpit instruments during cloud instrument flying (IFR).",
      scenario: "Instrument Readout: <br/>• Artificial Horizon: Nose 5° pitch down, right wing 15° bank<br/>• Altimeter: Losing 400 ft/min<br/>• Airspeed: Increasing slowly",
      question: "What immediate flight control correction recovers steady level flight?",
      options: [
        { id: "opt1", text: "Level the wings first (roll left), then smoothly ease back pressure on stick to raise pitch.", correct: true, feedback: "Perfect pilot technique! In spiral dives, leveling wings first prevents over-stressing structural airframe load." },
        { id: "opt2", text: "Pull back hard on control stick while keeping right wing banked.", correct: false, feedback: "Dangerous! Pulling back hard in a banked turn tightens the dive spiral." },
        { id: "opt3", text: "Increase engine throttle to maximum.", correct: false, feedback: "Incorrect. Increasing power while nose is pitched down increases airspeed dangerously." }
      ]
    }
  ];

  let selectedChallengeId = "programming";

  function renderExperience(state = {}) {
    const completedList = state.completedChallenges || [];
    const activeChallenge = CHALLENGES.find(c => c.id === selectedChallengeId) || CHALLENGES[0];

    const challengeTabsHtml = CHALLENGES.map(ch => {
      const isCompleted = completedList.includes(ch.id);
      const isActive = ch.id === selectedChallengeId;
      return `
        <button class="challenge-tab-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-select-challenge="${ch.id}">
          <span class="ch-icon">${ch.icon}</span>
          <span class="ch-title">${ch.title}</span>
          ${isCompleted ? '<span class="ch-badge">Completed ✓</span>' : ''}
        </button>
      `;
    }).join("");

    const isCompleted = completedList.includes(activeChallenge.id);

    const optionsHtml = activeChallenge.options.map((opt, idx) => `
      <div class="challenge-option-card glass-panel" data-opt-id="${opt.id}">
        <label class="opt-label-radio">
          <input type="radio" name="challengeOption" value="${opt.id}" />
          <span class="opt-num">Option ${String.fromCharCode(65 + idx)}</span>
        </label>
        <p class="opt-text mt-1">${opt.text}</p>
        <div class="opt-feedback-box hidden" id="feedback_${opt.id}"></div>
      </div>
    `).join("");

    return `
      <div class="experience-page-wrapper container section-padding">
        <div class="experience-header text-center mb-8">
          <span class="badge-pill mb-3">INTERACTIVE MICRO-SIMULATIONS</span>
          <h1 class="experience-title">Experience a Career</h1>
          <p class="experience-subtitle">
            Try hands-on beginner challenges for different career fields. Gain practical context beyond textbook theory.
          </p>
        </div>

        <div class="experience-layout-grid col-2">
          <!-- Left Column: Challenge Selector -->
          <div class="challenge-sidebar glass-panel">
            <h3 class="sidebar-title">Select Challenge Domain (${completedList.length}/${CHALLENGES.length} Done)</h3>
            <div class="challenge-tabs-stack mt-4">
              ${challengeTabsHtml}
            </div>
          </div>

          <!-- Right Column: Active Challenge Arena -->
          <div class="challenge-arena glass-panel" id="challengeArena">
            <div class="arena-header">
              <span class="category-pill">${activeChallenge.category}</span>
              ${isCompleted ? '<span class="completed-pill">Badge Earned ✓</span>' : ''}
              <h2 class="arena-title mt-2">${activeChallenge.title}</h2>
              <p class="arena-desc">${activeChallenge.description}</p>
            </div>

            <!-- Scenario Box -->
            <div class="scenario-box mt-4">
              <h4 class="scenario-label">Scenario & Context:</h4>
              <div class="scenario-content mt-2">${activeChallenge.scenario}</div>
            </div>

            <!-- Question & Interactive Choices -->
            <div class="question-box mt-6">
              <h3 class="question-title">${activeChallenge.question}</h3>

              <div class="options-stack mt-4">
                ${optionsHtml}
              </div>

              <div class="arena-actions mt-6">
                <button class="primary-btn submit-ch-btn" id="submitChallengeBtn">
                  <span>Submit Solution</span>
                  <span class="btn-arrow">✓</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function initExperienceEvents(state = {}, onChallengeComplete) {
    // Challenge Tab Clicks
    document.querySelectorAll('[data-select-challenge]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedChallengeId = e.currentTarget.getAttribute('data-select-challenge');
        if (onChallengeComplete) onChallengeComplete(null); // Re-render container
      });
    });

    // Submit Challenge Solution
    const submitBtn = document.getElementById('submitChallengeBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const activeChallenge = CHALLENGES.find(c => c.id === selectedChallengeId);
        if (!activeChallenge) return;

        const selectedRadio = document.querySelector('input[name="challengeOption"]:checked');
        if (!selectedRadio) {
          alert('Please select an option before submitting!');
          return;
        }

        const selectedOptId = selectedRadio.value;
        const optionObj = activeChallenge.options.find(o => o.id === selectedOptId);

        // Hide previous feedbacks
        activeChallenge.options.forEach(o => {
          const fb = document.getElementById(`feedback_${o.id}`);
          if (fb) fb.classList.add('hidden');
        });

        const targetFb = document.getElementById(`feedback_${selectedOptId}`);
        if (targetFb && optionObj) {
          targetFb.classList.remove('hidden');
          targetFb.className = `opt-feedback-box mt-2 ${optionObj.correct ? 'success' : 'error'}`;
          targetFb.innerHTML = `<strong>${optionObj.correct ? '🎉 Correct!' : '⚠️ Needs Revision'}</strong> ${optionObj.feedback}`;

          if (optionObj.correct) {
            window.CAREER_STORAGE.markChallengeComplete(activeChallenge.id);
            if (onChallengeComplete) onChallengeComplete(activeChallenge.id);
          }
        }
      });
    }
  }

  window.CQ_EXPERIENCE = {
    renderExperience,
    initExperienceEvents,
    setSelectId: (id) => { selectedChallengeId = id; }
  };
})();
