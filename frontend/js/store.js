/**
 * GrowGov AI – Central Reactive State Store
 * iGOT Karmayogi Competency Platform
 */

(function () {
  const STORAGE_KEY = "GROWGOV_AI_STATE_V2";

  // Create initial state
  function getInitialState() {
    const rawData = window.GROWGOV_DATA;
    return {
      currentUser: rawData.users.employee,
      isLoggedIn: true,
      currentRole: "employee", // 'employee' | 'admin'
      employeeProfile: { ...rawData.users.employee },
      competencies: JSON.parse(JSON.stringify(rawData.competencies)),
      competencyMapping: JSON.parse(JSON.stringify(rawData.competencyMapping)),
      recommendations: JSON.parse(JSON.stringify(rawData.recommendations)),
      adminStats: JSON.parse(JSON.stringify(rawData.adminStats)),
      // Progression and demo metrics
      overallCompetency: 78,
      criticalGapsCount: 3,
      recommendedCount: 5,
      completedCoursesCount: 2,
      averageAssessmentScore: 82,
      learningProgressPercent: 60,
      learningHours: 24.5,
      learningStreak: 12,
      assessmentsCount: 3,
      // Assessment flow state management
      mcqGenerated: false,
      assessmentStarted: false,
      assessmentCompleted: false,
      generatedAssessmentDetails: {
        competency: "Data Visualization",
        topic: "Charts & Executive Ministry Dashboards",
        difficulty: "Medium",
        questionsCount: 10,
        estimatedTime: "10 Minutes"
      },
      // Active assessment runtime
      activeAssessment: {
        inProgress: false,
        competencyId: "comp_2",
        competencyName: "Data Visualization",
        currentQuestionIndex: 0,
        answers: {}, // { questionId: selectedIndex }
        timeSpentSeconds: 0,
        difficultyLevel: "Medium",
        isAdaptive: true
      },
      // Last assessment result
      latestResult: null,
      // Flag if user has completed the demo flow
      demoCompleted: false,
      // Progress history
      progressHistory: [
        {
          competency: "Data Visualization",
          before: 40,
          after: 40,
          required: 80,
          date: "Current Baseline",
          improved: false
        },
        {
          competency: "Statistical Analysis",
          before: 70,
          after: 82,
          required: 80,
          date: "Completed 14 Sep 2026",
          improved: true
        },
        {
          competency: "Digital Governance",
          before: 55,
          after: 65,
          required: 75,
          date: "Completed 28 Aug 2026",
          improved: true
        }
      ]
    };
  }

  // Load state from localStorage or default
  let state = (function () {
    const defaults = getInitialState();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaults, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not load stored state, using defaults", e);
    }
    return defaults;
  })();

  const listeners = [];

  window.GrowGovStore = {
    getState: function () {
      return state;
    },

    subscribe: function (fn) {
      listeners.push(fn);
      return function unsubscribe() {
        const idx = listeners.indexOf(fn);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    },

    notify: function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn("Error saving to localStorage", e);
      }
      listeners.forEach(function (fn) {
        try {
          fn(state);
        } catch (err) {
          console.error("Store listener error:", err);
        }
      });
    },

    // Login action
    login: function (userType, email, password) {
      if (userType === "admin") {
        state.currentUser = window.GROWGOV_DATA.users.admin;
        state.currentRole = "admin";
      } else {
        state.currentUser = state.employeeProfile;
        state.currentRole = "employee";
      }
      state.isLoggedIn = true;
      this.notify();
      return true;
    },

    logout: function () {
      state.isLoggedIn = false;
      this.notify();
    },

    // Reset whole state to fresh demo baseline
    resetToDemoBaseline: function () {
      state = getInitialState();
      this.notify();
      if (window.showToast) {
        window.showToast("Competency state reset to initial baseline (Data Visualization: 40%)");
      }
    },

    // Update Employee Profile
    updateProfile: function (newProfile) {
      state.employeeProfile = { ...state.employeeProfile, ...newProfile };
      state.currentUser = { ...state.currentUser, ...newProfile };
      this.notify();
    },

    // Submit Assessment and Apply Competency Leap
    submitAssessment: function (score, total, answers) {
      const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

      // Dynamic Performance Status
      let status = "Needs Improvement";
      if (accuracy >= 90) {
        status = "Excellent";
      } else if (accuracy >= 75) {
        status = "Passed with Merit";
      } else if (accuracy >= 50) {
        status = "Passed";
      } else {
        status = "Needs Improvement";
      }

      const prevComp = 40; // baseline for Data Visualization
      const updatedComp = 62; // The core SIH demo scenario value
      const gain = updatedComp - prevComp;

      state.latestResult = {
        score: score,
        correctAnswers: score,
        total: total,
        totalQuestions: total,
        accuracy: accuracy,
        status: status,
        competency: "Data Visualization",
        previousCompetency: prevComp,
        updatedCompetency: updatedComp,
        gain: gain,
        strongTopics: ["Chart Selection Principles", "Public Visualizations", "Dashboard Layouts"],
        weakTopics: ["Data-Ink Ratio Nuances", "Outlier Scaling in Survey Maps"],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedNextStep: "Continue with Advanced Data Visualization Level 2 to reach the 80% benchmark.",
        recommendedCourse: "Advanced Data Visualization & Ministry Dashboards"
      };

      // Update Data Visualization in competencies list
      const dataVizComp = state.competencies.find(c => c.name === "Data Visualization" || c.id === "comp_2");
      if (dataVizComp) {
        dataVizComp.current = updatedComp;
        dataVizComp.gap = dataVizComp.required - updatedComp; // 80 - 62 = 18%
        dataVizComp.priority = dataVizComp.gap > 20 ? "Critical" : (dataVizComp.gap > 0 ? "High" : "No Gap");
      }

      // Update Overall metrics
      state.overallCompetency = 83; // +5% jump
      state.criticalGapsCount = 2; // Reduced from 3
      state.completedCoursesCount = 3; // Increased
      state.averageAssessmentScore = accuracy; // Direct latest calculated accuracy
      state.learningProgressPercent = 78;
      state.learningHours = 27.5;
      state.learningStreak = 13;
      state.assessmentsCount += 1;
      state.assessmentCompleted = true;
      state.demoCompleted = true;

      // Update progress history item
      const histItem = state.progressHistory.find(h => h.competency === "Data Visualization");
      if (histItem) {
        histItem.after = updatedComp;
        histItem.improved = true;
        histItem.date = `Completed Just Now (${accuracy}% Accuracy • ${status})`;
      }

      // Update admin table entry for Rahul Sharma
      const adminEmp = state.adminStats.employeesList.find(e => e.id === state.employeeProfile.id);
      if (adminEmp) {
        adminEmp.competencyScore = 83;
        adminEmp.criticalGaps = 2;
        adminEmp.trainingProgress = 78;
      }

      // Update recommendations
      const rec = state.recommendations.find(r => r.competency === "Data Visualization");
      if (rec) {
        rec.currentLevel = updatedComp;
        rec.gap = rec.targetLevel - updatedComp;
        rec.priority = "High"; // downgraded from Critical
        rec.reason = `Your current Data Visualization competency is now ${updatedComp}%, making rapid progress towards the 80% benchmark. Remaining Gap: 18%. Priority: High.`;
      }

      this.notify();
      return state.latestResult;
    }
  };
})();
