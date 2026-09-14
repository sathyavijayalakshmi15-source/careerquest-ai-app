// CAREERQUEST AI - Career Explorer Component

(function() {
  let currentCategoryFilter = "all";
  let currentSearchQuery = "";

  function renderExplorer() {
    const categories = [
      { id: "all", label: "All Sectors" },
      { id: "Technology", label: "Technology" },
      { id: "Engineering", label: "Engineering" },
      { id: "Medical & Healthcare", label: "Medical & Healthcare" },
      { id: "Defence", label: "Defence & Military" },
      { id: "Aviation", label: "Aviation" },
      { id: "Science & Research", label: "Science & Research" },
      { id: "Commerce & Finance", label: "Commerce & Finance" },
      { id: "Law & Government", label: "Law & Governance" },
      { id: "Education", label: "Education & Teaching" },
      { id: "Creative & Media", label: "Creative & Media" },
      { id: "Maritime", label: "Maritime & Ocean" },
      { id: "Emerging", label: "Emerging & Interdisciplinary" }
    ];

    const categoryTabsHtml = categories.map(cat => `
      <button class="filter-tab-btn ${currentCategoryFilter === cat.id ? 'active' : ''}" data-cat-filter="${cat.id}">
        ${cat.label}
      </button>
    `).join("");

    return `
      <div class="explorer-page-wrapper container section-padding">
        <div class="explorer-header text-center mb-8">
          <span class="badge-pill mb-3">50+ CAREER PATHWAYS DATABASE</span>
          <h1 class="explorer-title">Career Explorer</h1>
          <p class="explorer-subtitle">
            Search, filter, and inspect detailed career profiles across 13 major Indian and global industries.
          </p>
        </div>

        <!-- Search Bar & Controls -->
        <div class="explorer-controls glass-panel mb-6">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" id="explorerSearchInput" class="search-input" placeholder="Search by career name, subject, or skill (e.g. Coding, Physics, AI, Teaching, Law)..." value="${currentSearchQuery}" />
          </div>

          <div class="filter-tabs-scroll mt-4">
            ${categoryTabsHtml}
          </div>
        </div>

        <!-- Career Cards Grid Container -->
        <div class="explorer-grid" id="explorerGridContainer">
          <!-- Dynamically populated via renderFilteredCards -->
        </div>

        <!-- Modal Drawer Container -->
        <div id="explorerModalWrapper"></div>
      </div>
    `;
  }

  function getFilteredCareers() {
    const careers = window.CAREERS_DATABASE || [];
    return careers.filter(c => {
      const matchesCategory = currentCategoryFilter === "all" || c.category === currentCategoryFilter;
      const q = currentSearchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesName = c.name.toLowerCase().includes(q);
      const matchesDesc = c.description.toLowerCase().includes(q);
      const matchesSubjects = c.relevantSubjects.some(s => s.toLowerCase().includes(q));
      const matchesSkills = c.usefulSkills.some(s => s.toLowerCase().includes(q));

      return matchesCategory && (matchesName || matchesDesc || matchesSubjects || matchesSkills);
    });
  }

  function renderFilteredCards() {
    const container = document.getElementById('explorerGridContainer');
    if (!container) return;

    const filtered = getFilteredCareers();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="no-results-box text-center w-full py-12 glass-panel">
          <h4>No Careers Match Your Search</h4>
          <p class="text-muted">Try searching with a different keyword or select another category filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(c => `
      <div class="explorer-card glass-panel card-tilt" data-inspect-career="${c.id}">
        <div class="explorer-card-header">
          <span class="category-pill">${c.category}</span>
        </div>
        <h3 class="explorer-card-title mt-2">${c.name}</h3>
        <p class="explorer-card-desc mt-2">${c.description.substring(0, 110)}...</p>

        <div class="explorer-card-chips mt-3">
          ${c.relevantSubjects.slice(0, 3).map(s => `<span class="subj-chip">${s}</span>`).join('')}
        </div>

        <button class="tertiary-btn inspect-btn mt-4 w-full" data-inspect-career="${c.id}">
          <span>Inspect Career Profile</span>
          <span>→</span>
        </button>
      </div>
    `).join("");

    // Add click listeners to cards
    container.querySelectorAll('[data-inspect-career]').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-inspect-career');
        openCareerModal(id);
      });
    });
  }

  function openCareerModal(careerId) {
    const career = window.getCareerById ? window.getCareerById(careerId) : null;
    const wrapper = document.getElementById('explorerModalWrapper');

    if (!career || !wrapper || !window.CQ_CAREER_MODAL) return;

    wrapper.innerHTML = window.CQ_CAREER_MODAL.renderCareerModalHtml(career);

    const closeBtns = [document.getElementById('closeCareerModalBtn'), document.getElementById('closeCareerModalFooterBtn')];
    const closeModal = () => { wrapper.innerHTML = ""; };

    closeBtns.forEach(btn => {
      if (btn) btn.addEventListener('click', closeModal);
    });

    const backdrop = document.getElementById('careerDetailModalOverlay');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }
  }

  function initExplorerEvents() {
    renderFilteredCards();

    // Category filter tab clicks
    document.querySelectorAll('[data-cat-filter]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        currentCategoryFilter = e.currentTarget.getAttribute('data-cat-filter');
        document.querySelectorAll('[data-cat-filter]').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        renderFilteredCards();
      });
    });

    // Search input
    const searchInput = document.getElementById('explorerSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderFilteredCards();
      });
    }
  }

  window.CQ_EXPLORER = {
    renderExplorer,
    initExplorerEvents
  };
})();
