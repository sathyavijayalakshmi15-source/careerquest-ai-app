// CAREERQUEST AI - Navigation Bar Component

(function() {
  function renderNavbar(currentView, state = {}) {
    const hasProfile = state.assessmentCompleted && state.recommendations;
    
    const navItems = [
      { id: "home", label: "Home", icon: "🏠" },
      { id: "assessment", label: "Assessment", icon: "📝" },
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "explorer", label: "Career Explorer", icon: "🔍" },
      { id: "experience", label: "Experience a Career", icon: "⚡" },
      { id: "roadmap", label: "Roadmap", icon: "🗺️" }
    ];

    const navLinksHtml = navItems.map(item => {
      const isActive = currentView === item.id;
      return `
        <button class="nav-link-btn ${isActive ? 'active' : ''}" data-view="${item.id}">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
          ${isActive ? '<span class="active-indicator"></span>' : ''}
        </button>
      `;
    }).join("");

    const logoHtml = window.CQ_LOGO ? window.CQ_LOGO.renderLogo({ size: "small", showText: true }) : "CAREERQUEST AI";

    return `
      <header class="main-header navbar-glass">
        <div class="header-inner container">
          <!-- Logo Brand -->
          <div class="header-brand" data-view="home" style="cursor: pointer;">
            ${logoHtml}
          </div>

          <!-- Desktop Navigation Links -->
          <nav class="desktop-nav">
            ${navLinksHtml}
          </nav>

          <!-- Right Action Bar -->
          <div class="header-actions">
            ${hasProfile ? `
              <button class="badge-profile-btn" data-view="results">
                <span class="badge-dot"></span>
                <span>Profile Ready</span>
              </button>
            ` : ''}

            <button class="primary-btn header-cta-btn" data-view="assessment">
              <span>${hasProfile ? 'Retake Quiz' : 'Start Exploring'}</span>
              <span class="btn-arrow">→</span>
            </button>

            <!-- Mobile Hamburger Menu Button -->
            <button class="mobile-menu-toggle" id="mobileMenuBtn" aria-label="Toggle Navigation">
              <span class="menu-bar"></span>
              <span class="menu-bar"></span>
              <span class="menu-bar"></span>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Drawer -->
        <div class="mobile-nav-drawer" id="mobileDrawer">
          <div class="mobile-drawer-inner container">
            ${navLinksHtml}
            <div class="mobile-drawer-footer">
              <button class="primary-btn w-full" data-view="assessment">
                <span>Start Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  function initNavbarEvents(onNavigate) {
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        if (view) {
          onNavigate(view);
          // Close mobile menu if open
          const drawer = document.getElementById('mobileDrawer');
          if (drawer) drawer.classList.remove('open');
        }
      });
    });

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
        mobileMenuBtn.classList.toggle('active');
      });
    }
  }

  window.CQ_NAVBAR = {
    renderNavbar,
    initNavbarEvents
  };
})();
