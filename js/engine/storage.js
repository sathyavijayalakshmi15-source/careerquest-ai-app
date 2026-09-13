// CAREERQUEST AI - LocalStorage State Persistence Engine

(function() {
  const STORAGE_KEY = 'careerquest_ai_v1_profile';

  const defaultState = {
    stream: "",
    streamAnswers: [],
    extracurriculars: [],
    strengths: [],
    preferences: [],
    avoidances: [],
    recommendations: null,
    assessmentCompleted: false,
    completedChallenges: [],
    roadmapProgress: {},
    lastUpdated: null
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    } catch (e) {
      console.warn('Failed to parse CareerQuest state from localStorage:', e);
      return { ...defaultState };
    }
  }

  function saveState(partialState) {
    try {
      const current = loadState();
      const updated = {
        ...current,
        ...partialState,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save CareerQuest state to localStorage:', e);
      return null;
    }
  }

  function resetState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return { ...defaultState };
    } catch (e) {
      console.error('Failed to reset CareerQuest state:', e);
      return { ...defaultState };
    }
  }

  function toggleRoadmapStep(careerId, stepKey) {
    const state = loadState();
    const roadmapProgress = { ...(state.roadmapProgress || {}) };
    const fullKey = `${careerId}_${stepKey}`;
    roadmapProgress[fullKey] = !roadmapProgress[fullKey];
    saveState({ roadmapProgress });
    return roadmapProgress[fullKey];
  }

  function markChallengeComplete(challengeId) {
    const state = loadState();
    const completed = new Set(state.completedChallenges || []);
    completed.add(challengeId);
    const updatedList = Array.from(completed);
    saveState({ completedChallenges: updatedList });
    return updatedList;
  }

  window.CAREER_STORAGE = {
    loadState,
    saveState,
    resetState,
    toggleRoadmapStep,
    markChallengeComplete
  };
})();
