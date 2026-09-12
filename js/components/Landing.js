// CAREERQUEST AI - Landing Page View Component

(function() {
  function renderLanding(state = {}) {
    const logoHtml = window.CQ_LOGO ? window.CQ_LOGO.renderLogo({ size: "large", showText: false }) : "";

    const streamsList = window.STREAMS || [];

    const streamCardsHtml = streamsList.map(s => `
      <div class="stream-card-mini card-tilt" data-stream-select="${s.id}">
        <div class="stream-card-icon">${s.icon}</div>
        <h4 class="stream-card-title">${s.title}</h4>
        <p class="stream-card-desc">${s.description}</p>
        <span class="stream-card-action">Select & Start →</span>
      </div>
    `).join("");

    return `
      <div class="landing-page-wrapper">
        <!-- Hero Section -->
        <section class="hero-section text-center relative overflow-hidden">
          <div class="hero-bg-glow"></div>

          <div class="container hero-content">
            <!-- 3D Logo Showcase -->
            <div class="hero-logo-badge">
              ${logoHtml}
            </div>

            <div class="badge-pill hero-pill mb-4">
              <span class="pulse-dot"></span>
              <span>AI-POWERED EXPLORATION FOR CLASS 12 STUDENTS IN INDIA</span>
            </div>

            <h1 class="hero-headline">
              You don't need to know your future.<br />
              <span class="hero-headline-highlight">You just need to discover where to start.</span>
            </h1>

            <p class="hero-supporting-text">
              Explore your strengths, interests and possibilities — then build a path worth exploring.
            </p>

            <div class="hero-cta-group">
              <button class="primary-btn hero-cta-primary" data-view="assessment">
                <span class="btn-glow"></span>
                <span>Start Exploring</span>
                <span class="btn-arrow">→</span>
              </button>

              <a href="#how-it-works" class="secondary-btn hero-cta-secondary">
                <span>How It Works</span>
              </a>
            </div>

            <!-- 5-Step Process Bar -->
            <div class="process-flow-bar mt-12" id="how-it-works">
              <div class="process-step">
                <span class="step-num">01</span>
                <span class="step-name">ASSESS</span>
                <span class="step-desc">Class 12 Stream & Signals</span>
              </div>
              <div class="process-arrow">→</div>
              <div class="process-step">
                <span class="step-num">02</span>
                <span class="step-name">ANALYSE</span>
                <span class="step-desc">Strengths & Preferences</span>
              </div>
              <div class="process-arrow">→</div>
              <div class="process-step">
                <span class="step-num">03</span>
                <span class="step-name">EXPLORE</span>
                <span class="step-desc">3–5 Recommended Paths</span>
              </div>
              <div class="process-arrow">→</div>
              <div class="process-step">
                <span class="step-num">04</span>
                <span class="step-name">EXPERIENCE</span>
                <span class="step-desc">Interactive Mini-Challenges</span>
              </div>
              <div class="process-arrow">→</div>
              <div class="process-step">
                <span class="step-num">05</span>
                <span class="step-name">ROADMAP</span>
                <span class="step-desc">Actionable Class 12+ Plan</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Streams Section -->
        <section class="section-padding streams-section">
          <div class="container">
            <div class="section-header text-center">
              <h2 class="section-title">Select Your Class 12 Stream</h2>
              <p class="section-subtitle">
                Your stream is your starting point, not your boundary. CareerQuest AI tailors questions specifically for your academic background.
              </p>
            </div>

            <div class="streams-grid">
              ${streamCardsHtml}
            </div>
          </div>
        </section>

        <!-- Philosophy Section -->
        <section class="section-padding philosophy-section">
          <div class="container">
            <div class="philosophy-card glass-panel">
              <div class="philosophy-grid">
                <div class="philosophy-text">
                  <span class="badge-pill mb-3">OUR PHILOSOPHY</span>
                  <h3 class="philosophy-title">Beyond The Stream</h3>
                  <p class="philosophy-body">
                    Traditional career tests attempt to lock 17-year-olds into a single "perfect" box. We believe Class 12 students deserve **possibilities, not predictions**.
                  </p>
                  <ul class="philosophy-list">
                    <li><span class="check-icon">✓</span> Multi-dimensional matching beyond single answers</li>
                    <li><span class="check-icon">✓</span> Detects interdisciplinary fields (e.g. Bio + Coding = Bioinformatics)</li>
                    <li><span class="check-icon">✓</span> Identifies specialized teaching & educator pathways</li>
                    <li><span class="check-icon">✓</span> Practical mini-challenges to experience careers hands-on</li>
                  </ul>
                </div>
                <div class="philosophy-visual">
                  <div class="floating-3d-box">
                    <div class="3d-orbit-circle circle-1"></div>
                    <div class="3d-orbit-circle circle-2"></div>
                    <div class="orbit-center">
                      <span class="orbit-center-icon">🚀</span>
                      <span class="orbit-center-text">3–5 Paths To Explore</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function initLandingEvents(onNavigate, onSelectStream) {
    document.querySelectorAll('[data-stream-select]').forEach(card => {
      card.addEventListener('click', (e) => {
        const streamId = e.currentTarget.getAttribute('data-stream-select');
        if (streamId && onSelectStream) {
          onSelectStream(streamId);
        }
      });
    });
  }

  window.CQ_LANDING = {
    renderLanding,
    initLandingEvents
  };
})();
