// CAREERQUEST AI - Main Application Router & Controller

(function() {
  let appState = {
    currentView: "home",
    assessmentStep: 1,
    stream: "",
    streamAnswers: [],
    extracurriculars: [],
    strengths: [],
    preferences: [],
    recommendations: null,
    assessmentCompleted: false,
    completedChallenges: [],
    roadmapProgress: {}
  };

  function initApp() {
    // 1. Load saved state from LocalStorage
    const saved = window.CAREER_STORAGE ? window.CAREER_STORAGE.loadState() : {};
    appState = { ...appState, ...saved };

    // 2. Init Canvas Particles
    if (window.CQ_PARTICLES && window.CQ_PARTICLES.initParticlesCanvas) {
      window.CQ_PARTICLES.initParticlesCanvas();
    }

    // 3. Render initial view
    renderApp();
  }

  function navigateTo(viewName) {
    appState.currentView = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderApp();
  }

  function renderApp() {
    const headerContainer = document.getElementById('headerAppContainer');
    const mainContainer = document.getElementById('mainAppContainer');

    if (!headerContainer || !mainContainer) return;

    // Render Navigation Bar
    if (window.CQ_NAVBAR) {
      headerContainer.innerHTML = window.CQ_NAVBAR.renderNavbar(appState.currentView, appState);
      window.CQ_NAVBAR.initNavbarEvents((view) => navigateTo(view));
    }

    // Render Target Main View
    let contentHtml = "";

    switch (appState.currentView) {
      case "home":
        contentHtml = window.CQ_LANDING ? window.CQ_LANDING.renderLanding(appState) : "";
        mainContainer.innerHTML = contentHtml;
        if (window.CQ_LANDING) {
          window.CQ_LANDING.initLandingEvents(
            (view) => navigateTo(view),
            (selectedStreamId) => {
              appState.stream = selectedStreamId;
              appState.assessmentStep = 2; // Jump directly to step 2 questions!
              navigateTo("assessment");
            }
          );
        }
        break;

      case "assessment":
        contentHtml = window.CQ_ASSESSMENT ? window.CQ_ASSESSMENT.renderAssessment(appState.assessmentStep, appState) : "";
        mainContainer.innerHTML = contentHtml;
        if (window.CQ_ASSESSMENT) {
          window.CQ_ASSESSMENT.initAssessmentEvents(appState.assessmentStep, appState, {
            onSelectStream: (streamId) => {
              appState.stream = streamId;
              appState.streamAnswers = [];
              renderApp();
            },
            onToggleAnswer: (key, id) => {
              const list = new Set(appState[key] || []);
              if (list.has(id)) list.delete(id);
              else list.add(id);
              appState[key] = Array.from(list);
              renderApp();
            },
            onNext: () => {
              // Validation
              if (appState.assessmentStep === 1 && !appState.stream) {
                alert("Please select a Class 12 stream to continue.");
                return;
              }
              if (appState.assessmentStep < 5) {
                appState.assessmentStep++;
                renderApp();
              } else {
                // Step 5 Complete -> Trigger Analysis Loading
                runAnalysisSequence();
              }
            },
            onBack: () => {
              if (appState.assessmentStep > 1) {
                appState.assessmentStep--;
                renderApp();
              }
            },
            onClear: () => {
              if (appState.assessmentStep === 1) appState.stream = "";
              if (appState.assessmentStep === 2) appState.streamAnswers = [];
              if (appState.assessmentStep === 3) appState.extracurriculars = [];
              if (appState.assessmentStep === 4) appState.strengths = [];
              if (appState.assessmentStep === 5) appState.preferences = [];
              renderApp();
            }
          });
        }
        break;

      case "analysis":
        contentHtml = window.CQ_ANALYSIS_LOADING ? window.CQ_ANALYSIS_LOADING.renderAnalysisLoading() : "";
        mainContainer.innerHTML = contentHtml;
        break;

      case "results":
        contentHtml = window.CQ_RESULTS ? window.CQ_RESULTS.renderResults(appState.recommendations, appState) : "";
        mainContainer.innerHTML = contentHtml;
        if (window.CQ_RESULTS) {
          window.CQ_RESULTS.initResultsEvents(
            (careerId) => {
              if (window.CQ_EXPERIENCE && window.CQ_EXPERIENCE.setSelectId) {
                window.CQ_EXPERIENCE.setSelectId(careerId === 'cs_software' ? 'programming' : careerId);
              }
              navigateTo("experience");
            },
            (careerId) => {
              if (window.CQ_ROADMAP && window.CQ_ROADMAP.setSelectId) {
                window.CQ_ROADMAP.setSelectId(careerId);
              }
              navigateTo("roadmap");
            }
          );
        }
        break;

      case "explorer":
        contentHtml = window.CQ_EXPLORER ? window.CQ_EXPLORER.renderExplorer() : "";
        mainContainer.innerHTML = contentHtml;
        if (window.CQ_EXPLORER) {
          window.CQ_EXPLORER.initExplorerEvents();
        }
        break;

      case "experience":
        contentHtml = window.CQ_EXPERIENCE ? window.CQ_EXPERIENCE.renderExperience(appState) : "";
        mainContainer.innerHTML = contentHtml;
        if (window.CQ_EXPERIENCE) {
          window.CQ_EXPERIENCE.initExperienceEvents(appState, (completedId) => {
            if (completedId) {
              const updated = window.CAREER_STORAGE.loadState();
              appState.completedChallenges = updated.completedChallenges || [];
            }
            renderApp();
          });
        }
        break;

      case "roadmap":
        contentHtml = window.CQ_ROADMAP ? window.CQ_ROADMAP.renderRoadmap(appState.recommendations, appState) : "";
        mainContainer.innerHTML = contentHtml;
        if (window.CQ_ROADMAP) {
          window.CQ_ROADMAP.initRoadmapEvents(appState, () => {
            const updated = window.CAREER_STORAGE.loadState();
            appState.roadmapProgress = updated.roadmapProgress || {};
            renderApp();
          });
        }
        break;

      case "dashboard":
        contentHtml = window.CQ_DASHBOARD ? window.CQ_DASHBOARD.renderDashboard(appState) : "";
        mainContainer.innerHTML = contentHtml;
        if (window.CQ_DASHBOARD) {
          window.CQ_DASHBOARD.initDashboardEvents({
            onNavigate: (view) => navigateTo(view),
            onReset: () => {
              appState = window.CAREER_STORAGE.resetState();
              appState.currentView = "home";
              appState.assessmentStep = 1;
              renderApp();
            }
          });
        }
        break;

      default:
        navigateTo("home");
        break;
    }
  }

  function runAnalysisSequence() {
    navigateTo("analysis");

    // Perform Career Matching algorithm
    if (window.CAREER_MATCHER) {
      const recommendations = window.CAREER_MATCHER.matchCareers({
        stream: appState.stream,
        streamAnswers: appState.streamAnswers,
        extracurriculars: appState.extracurriculars,
        strengths: appState.strengths,
        preferences: appState.preferences
      });

      appState.recommendations = recommendations;
      appState.assessmentCompleted = true;

      // Save to localStorage
      window.CAREER_STORAGE.saveState({
        stream: appState.stream,
        streamAnswers: appState.streamAnswers,
        extracurriculars: appState.extracurriculars,
        strengths: appState.strengths,
        preferences: appState.preferences,
        recommendations,
        assessmentCompleted: true
      });
    }

    // Animate AI scanner HUD
    if (window.CQ_ANALYSIS_LOADING && window.CQ_ANALYSIS_LOADING.startAnalysisAnimation) {
      window.CQ_ANALYSIS_LOADING.startAnalysisAnimation(() => {
        navigateTo("results");
      });
    } else {
      setTimeout(() => navigateTo("results"), 2500);
    }
  }

  // Boot Application on DOM Ready
  document.addEventListener('DOMContentLoaded', initApp);
})();
