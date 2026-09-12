// CAREERQUEST AI - Interactive Personalized Roadmap Component

(function() {
  let selectedRoadmapCareerId = null;

  function renderRoadmap(recommendationsData, state = {}) {
    const topMatches = (recommendationsData && recommendationsData.topMatches) ? recommendationsData.topMatches : [];
    const savedProgress = state.roadmapProgress || {};

    // Default to first match if available, or default career
    if (!selectedRoadmapCareerId) {
      selectedRoadmapCareerId = topMatches.length > 0 ? topMatches[0].career.id : "cs_software";
    }

    const currentCareer = window.getCareerById ? window.getCareerById(selectedRoadmapCareerId) : null;
    const careerObj = currentCareer || (topMatches[0] ? topMatches[0].career : window.CAREERS_DATABASE[0]);

    // Dropdown options
    const dropdownOptionsHtml = (topMatches.length > 0 ? topMatches.map(m => m.career) : window.CAREERS_DATABASE.slice(0, 10)).map(c => `
      <option value="${c.id}" ${c.id === careerObj.id ? 'selected' : ''}>${c.name} (${c.category})</option>
    `).join("");

    // Generate Roadmap Phases
    const phases = [
      {
        id: "phase1",
        title: "Phase 1: Class 12 Focus & Subject Mastery",
        icon: "📚",
        items: [
          `Focus on core Class 12 subject fundamentals: ${careerObj.relevantSubjects.join(", ")}.`,
          `Maintain minimum 60-75% aggregate to satisfy admission eligibility cutoffs.`,
          `Explore foundational concepts through online videos and interactive problem solving.`
        ]
      },
      {
        id: "phase2",
        title: "Phase 2: Entrance Exams & Admission Preparation",
        icon: "🎯",
        items: careerObj.entranceExams.map(exam => `Prepare target syllabus for **${exam}** entrance examination.`).concat([
          `Solve past 5 years' question papers and take regular mock test series.`,
          `Track application form release dates and counseling schedules.`
        ])
      },
      {
        id: "phase3",
        title: "Phase 3: College Degree & Academic Foundation",
        icon: "🎓",
        items: careerObj.degreePathways.map(deg => `Enroll in **${deg}** or equivalent recognized university program.`).concat([
          `Maintain strong CGPA during early semesters while joining student technical/cultural clubs.`
        ])
      },
      {
        id: "phase4",
        title: "Phase 4: Foundational Skills & Technical Certifications",
        icon: "⚙️",
        items: careerObj.usefulSkills.map(sk => `Master essential competency: **${sk}**.`).concat([
          `Complete online certification courses (e.g. Coursera, NPTEL, Udemy) during semester breaks.`
        ])
      },
      {
        id: "phase5",
        title: "Phase 5: Beginner Projects & Competitions",
        icon: "💡",
        items: careerObj.beginnerActivities.map(act => `Build hands-on project: **${act}**.`).concat([
          `Participate in college hackathons, competitions, paper presentations, or case studies.`
        ])
      },
      {
        id: "phase6",
        title: "Phase 6: Practical Experience & Internships",
        icon: "💼",
        items: [
          `Apply for summer internships, research assistantships, or industry projects after 2nd/3rd year.`,
          `Build a clean LinkedIn profile and digital portfolio showcasing completed projects.`,
          `Seek mentorship from alumni and industry professionals in ${careerObj.name}.`
        ]
      },
      {
        id: "phase7",
        title: "Phase 7: Career Launch & Advanced Specialization",
        icon: "🚀",
        items: [
          `Participate in campus placement drives or apply for entry-level roles / higher research studies.`,
          `Continuously upgrade skills with industry trends and interdisciplinary technologies.`
        ]
      }
    ];

    let totalSteps = 0;
    let completedSteps = 0;

    const phasesHtml = phases.map((phase, pIdx) => {
      const itemsHtml = phase.items.map((itemText, iIdx) => {
        totalSteps++;
        const stepKey = `${careerObj.id}_${phase.id}_${iIdx}`;
        const isDone = !!savedProgress[stepKey];
        if (isDone) completedSteps++;

        return `
          <li class="roadmap-step-item ${isDone ? 'done' : ''}">
            <label class="step-check-label">
              <input type="checkbox" data-roadmap-toggle="${stepKey}" ${isDone ? 'checked' : ''} />
              <span class="custom-checkbox"></span>
              <span class="step-text">${itemText}</span>
            </label>
          </li>
        `;
      }).join("");

      return `
        <div class="roadmap-phase-node glass-panel mb-6">
          <div class="phase-node-header">
            <span class="phase-num-badge">0${pIdx + 1}</span>
            <span class="phase-icon">${phase.icon}</span>
            <h3 class="phase-title">${phase.title}</h3>
          </div>
          <ul class="roadmap-steps-list mt-4">
            ${itemsHtml}
          </ul>
        </div>
      `;
    }).join("");

    const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return `
      <div class="roadmap-page-wrapper container section-padding">
        <div class="roadmap-header text-center mb-8">
          <span class="badge-pill mb-3">ACTIONABLE STEP-BY-STEP PLAN</span>
          <h1 class="roadmap-title">Personalized Career Roadmap</h1>
          <p class="roadmap-subtitle">
            From Class 12 preparation to college entrance, foundational skills, internships, and career launch.
          </p>

          <!-- Career Selector Dropdown -->
          <div class="roadmap-career-selector mt-6 inline-flex items-center gap-3">
            <label class="selector-label">Viewing Roadmap for:</label>
            <select id="roadmapCareerSelect" class="roadmap-select-input">
              ${dropdownOptionsHtml}
            </select>
          </div>

          <!-- Overall Roadmap Progress -->
          <div class="roadmap-progress-bar-card glass-panel mt-6 max-w-lg mx-auto">
            <div class="flex justify-between items-center mb-2">
              <span class="progress-label">Milestone Progress:</span>
              <span class="progress-count">${completedSteps} / ${totalSteps} Completed (${progressPercent}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
        </div>

        <!-- Visual Timeline Path Container -->
        <div class="roadmap-timeline-container max-w-3xl mx-auto relative">
          <div class="timeline-vertical-line"></div>
          ${phasesHtml}
        </div>
      </div>
    `;
  }

  function initRoadmapEvents(state = {}, onToggleStep) {
    const select = document.getElementById('roadmapCareerSelect');
    if (select) {
      select.addEventListener('change', (e) => {
        selectedRoadmapCareerId = e.target.value;
        if (onToggleStep) onToggleStep(); // Trigger re-render
      });
    }

    document.querySelectorAll('[data-roadmap-toggle]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const fullKey = e.currentTarget.getAttribute('data-roadmap-toggle');
        const parts = fullKey.split('_');
        const careerId = parts[0];
        const stepKey = parts.slice(1).join('_');

        window.CAREER_STORAGE.toggleRoadmapStep(careerId, stepKey);
        if (onToggleStep) onToggleStep();
      });
    });
  }

  window.CQ_ROADMAP = {
    renderRoadmap,
    initRoadmapEvents,
    setSelectId: (id) => { selectedRoadmapCareerId = id; }
  };
})();
