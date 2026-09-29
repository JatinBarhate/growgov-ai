/**
 * GrowGov AI – Application Logic, Router & Interactive Controllers
 * iGOT Karmayogi Competency Platform
 */

(function () {
  // Global Toast Notification Helper
  window.showToast = function (message, type = "info") {
    let toast = document.getElementById("app-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "warning") icon = "⚠️";
    if (type === "ai") icon = "✨";

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3800);
  };

  // State reference
  const store = window.GrowGovStore;

  // Active route tracking
  let currentPage = "dashboard";

  // Assessment runtime state
  let assessmentTimerInterval = null;
  let timeRemaining = 900; // 15 mins

  // --- ROLE-BASED ACCESS CONTROL (RBAC) ---
  function applyRoleAccessControl(state) {
    const role = state.currentRole || "employee";
    const isAdmin = role === "admin";

    // 1. Sidebar Administration Section and Admin Dashboard Link
    const adminSection = document.getElementById("sidebar-admin-section");
    if (adminSection) {
      adminSection.style.display = isAdmin ? "block" : "none";
    }

    const adminNav = document.getElementById("nav-admin");
    if (adminNav) {
      adminNav.style.display = isAdmin ? "flex" : "none";
    }

    const adminNavTitle = document.getElementById("nav-title-admin");
    if (adminNavTitle) {
      adminNavTitle.style.display = isAdmin ? "block" : "none";
    }

    // 2. Hide any other admin-only elements across DOM
    document.querySelectorAll(".admin-only").forEach(el => {
      el.style.display = isAdmin ? "" : "none";
    });

    // 3. Update User Profile Card in Sidebar & Header
    const user = state.currentUser || (isAdmin ? window.GROWGOV_DATA.users.admin : window.GROWGOV_DATA.users.employee);

    // Sidebar User
    const sidebarAvatar = document.getElementById("sidebar-user-avatar");
    const sidebarName = document.getElementById("sidebar-user-name");
    const sidebarRole = document.getElementById("sidebar-user-role");

    if (sidebarAvatar) {
      sidebarAvatar.innerHTML = `${user.avatarInitials || (isAdmin ? "SR" : "RS")}<div class="online-indicator"></div>`;
    }
    if (sidebarName) sidebarName.textContent = user.name;
    if (sidebarRole) sidebarRole.textContent = isAdmin ? `${user.role}, CBC` : `${user.role}, MoSPI`;

    // Header User
    const headerAvatar = document.querySelector(".header-profile-avatar");
    const headerName = document.querySelector(".header-profile-name");
    const headerRole = document.querySelector(".header-profile-role");

    if (headerAvatar) {
      headerAvatar.textContent = user.avatarInitials || (isAdmin ? "SR" : "RS");
    }
    if (headerName) headerName.textContent = user.name;
    if (headerRole) headerRole.textContent = user.role;
  }

  // --- ROUTING ENGINE ---
  function navigateTo(pageId) {
    const state = store.getState();

    // Strip leading slash if provided (e.g., /admin-dashboard -> admin-dashboard)
    if (typeof pageId === "string") {
      pageId = pageId.replace(/^\//, "");
    }

    // Normalize admin aliases
    if (pageId === "admin") {
      pageId = "admin-dashboard";
    }

    // Check login guard
    if (!state.isLoggedIn && pageId !== "login") {
      pageId = "login";
    }

    // Role-based route guard: protect admin routes from employee access
    if (pageId === "admin-dashboard") {
      const role = state.currentRole || "employee";
      if (role !== "admin") {
        if (window.showToast) {
          window.showToast("Admin access required.", "warning");
        }
        pageId = "dashboard";
      }
    }

    // Direct assessment guard: only accessible through AI MCQ Generator -> Start Assessment
    if (pageId === "assessment") {
      if (!state.mcqGenerated || !state.assessmentStarted) {
        if (window.showToast) {
          window.showToast("Please generate an assessment first.", "warning");
        }
        pageId = "mcq-generator";
      }
    }

    // Direct assessment-result guard: only accessible after completing assessment
    if (pageId === "assessment-result") {
      if (!state.assessmentCompleted && !state.latestResult) {
        if (window.showToast) {
          window.showToast("Please generate an assessment first.", "warning");
        }
        pageId = "mcq-generator";
      }
    }

    currentPage = pageId;

    // Apply role-based visibility to navigation and profile
    applyRoleAccessControl(state);

    // Toggle container views
    const isLogin = pageId === "login";
    const loginContainer = document.getElementById("login-page-view");
    const appContainer = document.getElementById("authenticated-app-view");

    if (loginContainer && appContainer) {
      if (isLogin) {
        loginContainer.style.display = "flex";
        appContainer.style.display = "none";
      } else {
        loginContainer.style.display = "none";
        appContainer.style.display = "flex";
      }
    }

    // Hide all pages, show target page
    document.querySelectorAll(".page-view").forEach(el => {
      el.classList.remove("active");
    });
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
      targetPage.classList.add("active");
    }

    // Update sidebar navigation active links
    document.querySelectorAll(".sidebar .nav-item").forEach(item => {
      if (item.getAttribute("data-page") === pageId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update Top Header Breadcrumb
    const breadcrumbCurrent = document.getElementById("breadcrumb-current-page");
    if (breadcrumbCurrent) {
      const pageTitles = {
        "dashboard": "Employee Dashboard",
        "profile-analysis": "AI Profile Analysis",
        "competency-mapping": "Role & Competency Mapping",
        "skill-gap": "Skill Gap Analysis",
        "recommendations": "AI Learning Recommendations",
        "mcq-generator": "AI MCQ Generator",
        "assessment": "Adaptive Assessment",
        "assessment-result": "Assessment Result & Competency Update",
        "my-progress": "My Progress & Trajectory",
        "admin-dashboard": "Administrator Dashboard"
      };
      breadcrumbCurrent.textContent = pageTitles[pageId] || "Dashboard";
    }

    // Trigger page-specific re-renders
    renderPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- PAGE RENDER DISPATCHER ---
  function renderPage(pageId) {
    const state = store.getState();

    switch (pageId) {
      case "dashboard":
        renderEmployeeDashboard(state);
        break;
      case "profile-analysis":
        renderProfileAnalysis(state);
        break;
      case "competency-mapping":
        renderCompetencyMapping(state);
        break;
      case "skill-gap":
        renderSkillGapAnalysis(state);
        break;
      case "recommendations":
        renderRecommendations(state);
        break;
      case "mcq-generator":
        renderMCQGenerator(state);
        break;
      case "assessment":
        renderAssessmentInterface(state);
        break;
      case "assessment-result":
        renderAssessmentResult(state);
        break;
      case "my-progress":
        renderMyProgress(state);
        break;
      case "admin-dashboard":
        renderAdminDashboard(state);
        break;
    }
  }

  // =========================================================================
  // PAGE 2: EMPLOYEE DASHBOARD
  // =========================================================================
  function renderEmployeeDashboard(state) {
    // 1. Metric Cards
    document.getElementById("dash-overall-comp").textContent = `${state.overallCompetency}%`;
    document.getElementById("dash-critical-gaps").textContent = String(state.criticalGapsCount).padStart(2, '0');
    document.getElementById("dash-recommended-courses").textContent = String(state.recommendedCount).padStart(2, '0');
    document.getElementById("dash-completed-courses").textContent = String(state.completedCoursesCount).padStart(2, '0');
    document.getElementById("dash-assessment-score").textContent = `${state.averageAssessmentScore}%`;

    // 2. Competencies Progress Bars
    const listEl = document.getElementById("dashboard-competencies-list");
    if (listEl) {
      let html = "";
      state.competencies.forEach(comp => {
        let badgeClass = "badge-nogap";
        let fillClass = "fill-success";
        if (comp.priority === "Critical") {
          badgeClass = "badge-critical";
          fillClass = "fill-critical";
        } else if (comp.priority === "High") {
          badgeClass = "badge-high";
          fillClass = "fill-warning";
        } else if (comp.priority === "Medium") {
          badgeClass = "badge-medium";
          fillClass = "";
        }

        html += `
          <div class="competency-item">
            <div class="competency-header">
              <span class="competency-title">
                ${comp.name}
                <span class="badge ${badgeClass}">${comp.priority}</span>
              </span>
              <span class="competency-score">
                ${comp.current}% <span style="font-size: 11px; color: #64748b; font-weight: normal;">/ Target: ${comp.required}%</span>
              </span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill ${fillClass}" style="width: ${comp.current}%;"></div>
            </div>
          </div>
        `;
      });
      listEl.innerHTML = html;
    }

    // 3. Learning Progress Donut Chart
    if (window.GrowGovCharts) {
      window.GrowGovCharts.renderDonutGauge(
        "dash-donut-chart-container",
        state.learningProgressPercent,
        "Target Met",
        `Logged: ${state.learningHours} hrs • ${state.learningStreak} Day Streak`
      );
    }

    // 4. Critical Gap Focus Card
    const criticalFocusCard = document.getElementById("dash-critical-focus-card");
    if (criticalFocusCard) {
      const dataViz = state.competencies.find(c => c.name === "Data Visualization");
      if (dataViz && dataViz.gap > 20) {
        criticalFocusCard.style.display = "block";
        criticalFocusCard.innerHTML = `
          <div class="urgent-gap-card">
            <div class="urgent-gap-title">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
              Critical Competency Deficit Detected
            </div>
            <p class="urgent-gap-desc">
              Your <strong>Data Visualization</strong> capability is currently evaluated at <strong>${dataViz.current}%</strong>, while your role benchmark is <strong>${dataViz.required}%</strong> (<strong>${dataViz.gap}% Deficit</strong>).
            </p>
            <button class="btn btn-primary btn-sm" id="btn-dash-start-critical-path">
              <span>Start Recommended Learning Path &rarr;</span>
            </button>
          </div>
        `;
        document.getElementById("btn-dash-start-critical-path")?.addEventListener("click", () => {
          navigateTo("recommendations");
        });
      } else {
        criticalFocusCard.style.display = "block";
        criticalFocusCard.innerHTML = `
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; color: #065f46;">
            <div style="font-weight: 800; font-size: 15px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              ✅ Critical Deficit Closed!
            </div>
            <p style="font-size: 13px; line-height: 1.5;">
              Data Visualization improved from <strong>40% to ${dataViz ? dataViz.current : 62}%</strong> (+22% leap). Keep building modules to reach full 80% benchmark.
            </p>
            <button class="btn btn-secondary btn-sm" style="margin-top: 10px;" id="btn-view-progress-direct">
              View Updated Trajectory
            </button>
          </div>
        `;
        document.getElementById("btn-view-progress-direct")?.addEventListener("click", () => {
          navigateTo("my-progress");
        });
      }
    }
  }

  // =========================================================================
  // PAGE 3: AI PROFILE ANALYSIS
  // =========================================================================
  function renderProfileAnalysis(state) {
    const profile = state.employeeProfile;
    // Populate form fields
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || "";
    };

    setVal("profile-name", profile.name);
    setVal("profile-empid", profile.id);
    setVal("profile-dept", profile.department);
    setVal("profile-role", profile.role);
    setVal("profile-exp", profile.experience);
    setVal("profile-qual", profile.qualification);
    setVal("profile-responsibilities", profile.responsibilities);
    setVal("profile-skills", profile.skills);
    setVal("profile-training", profile.previousTraining);
  }

  // Handle Profile Analysis Run
  window.runAIProfileAnalysis = function () {
    const btn = document.getElementById("btn-run-profile-analysis");
    const aiOutput = document.getElementById("ai-profile-analysis-output");
    const aiStepper = document.getElementById("ai-analysis-stepper");

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="pulse-dot"></span> AI Analyzing Profile...`;
    }

    if (aiStepper) aiStepper.style.display = "block";
    if (aiOutput) aiOutput.style.opacity = "0.5";

    // Simulate multi-step AI reasoning pipeline
    const steps = [
      "1/4 Parsing employee task vectors & qualifications...",
      "2/4 Cross-referencing MoSPI Cadre Competency Matrix...",
      "3/4 Benchmarking against 1,200 peer Statistical Officers...",
      "4/4 Synthesizing potential skill gaps & recommendations..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      const stepText = document.getElementById("ai-step-text");
      if (stepText) stepText.textContent = steps[currentStep];
      currentStep++;

      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          if (aiStepper) aiStepper.style.display = "none";
          if (aiOutput) {
            aiOutput.style.opacity = "1";
            aiOutput.style.display = "block";
          }
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>✨ Re-Analyze Profile</span>`;
          }
          window.showToast("AI Profile Analysis Complete! Gaps Identified.", "ai");
        }, 600);
      }
    }, 450);
  };

  // =========================================================================
  // PAGE 4: COMPETENCY MAPPING
  // =========================================================================
  function renderCompetencyMapping(state) {
    const mapping = state.competencyMapping;
    const container = document.getElementById("competency-mapping-columns");
    if (!container) return;

    let rolesCol = `
      <div class="mapping-col">
        <div class="mapping-col-header">
          <span>🏛️</span> ROLE
        </div>
        <div class="mapping-node highlighted" data-chain="all">
          <div class="node-title">${mapping.role}</div>
          <div class="node-desc">${mapping.ministry}</div>
          <div style="margin-top: 8px; font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 4px; font-weight: 700; width: fit-content;">Group 'B' Gazetted</div>
        </div>
      </div>
    `;

    let tasksCol = `<div class="mapping-col"><div class="mapping-col-header"><span>📋</span> TASKS</div>`;
    let compsCol = `<div class="mapping-col"><div class="mapping-col-header"><span>🎯</span> COMPETENCIES</div>`;
    let skillsCol = `<div class="mapping-col"><div class="mapping-col-header"><span>⚡</span> SKILLS</div>`;

    mapping.mappings.forEach((m, idx) => {
      const isCritical = m.competency === "Data Visualization";
      tasksCol += `
        <div class="mapping-node ${isCritical ? 'highlighted' : ''}" data-idx="${idx}">
          <div class="node-title">${m.task}</div>
          <div class="node-desc">${m.taskDesc}</div>
        </div>
      `;

      compsCol += `
        <div class="mapping-node ${isCritical ? 'highlighted' : ''}" data-idx="${idx}">
          <div class="node-title" style="display: flex; justify-content: space-between; align-items: center;">
            ${m.competency}
            ${isCritical ? '<span class="badge badge-critical" style="font-size: 9px;">CRITICAL</span>' : ''}
          </div>
          <div class="node-desc">${m.competencyDesc}</div>
        </div>
      `;

      let skillsBadges = m.skills.map(s => `<span class="task-chip" style="font-size: 11px; padding: 3px 8px;">${s}</span>`).join(" ");
      skillsCol += `
        <div class="mapping-node ${isCritical ? 'highlighted' : ''}" data-idx="${idx}">
          <div class="node-title">Associated Skills</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px;">
            ${skillsBadges}
          </div>
        </div>
      `;
    });

    tasksCol += `</div>`;
    compsCol += `</div>`;
    skillsCol += `</div>`;

    container.innerHTML = rolesCol + tasksCol + compsCol + skillsCol;

    // Interactive Hover/Click Highlighting
    container.querySelectorAll(".mapping-node[data-idx]").forEach(node => {
      node.addEventListener("mouseenter", function () {
        const targetIdx = this.getAttribute("data-idx");
        container.querySelectorAll(".mapping-node[data-idx]").forEach(other => {
          if (other.getAttribute("data-idx") === targetIdx) {
            other.classList.add("highlighted");
          } else {
            other.classList.remove("highlighted");
          }
        });
      });
    });
  }

  // =========================================================================
  // PAGE 5: SKILL GAP ANALYSIS
  // =========================================================================
  function renderSkillGapAnalysis(state) {
    const tbody = document.getElementById("skill-gap-tbody");
    if (!tbody) return;

    let rowsHtml = "";
    state.competencies.forEach(comp => {
      let badgeClass = "badge-nogap";
      if (comp.priority === "Critical") badgeClass = "badge-critical";
      else if (comp.priority === "High") badgeClass = "badge-high";
      else if (comp.priority === "Medium") badgeClass = "badge-medium";
      else if (comp.priority === "Future") badgeClass = "badge-future";

      rowsHtml += `
        <tr>
          <td>
            <div style="font-weight: 700; color: #0f172a; font-size: 14px;">${comp.name}</div>
            <div style="font-size: 11.5px; color: #64748b;">${comp.category}</div>
          </td>
          <td>
            <span style="font-size: 14px; font-weight: 700; color: #0f172a;">${comp.current}%</span>
            <div class="progress-bar-container" style="width: 80px; height: 6px; margin-top: 4px;">
              <div class="progress-bar-fill" style="width: ${comp.current}%;"></div>
            </div>
          </td>
          <td>
            <span style="font-size: 14px; font-weight: 700; color: #475569;">${comp.required}%</span>
          </td>
          <td>
            <strong style="color: ${comp.gap > 20 ? '#dc2626' : (comp.gap > 0 ? '#d97706' : '#059669')}; font-size: 15px;">
              ${comp.gap}%
            </strong>
          </td>
          <td>
            <span class="badge ${badgeClass}">${comp.priority}</span>
          </td>
          <td>
            ${comp.gap > 0 ? `
              <button class="btn btn-secondary btn-sm" onclick="GrowGovApp.handleTargetRecommendation('${comp.name}')">
                Recommended Actions &rarr;
              </button>
            ` : `
              <span style="font-size: 12px; color: #059669; font-weight: 700;">✓ Met Target</span>
            `}
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = rowsHtml;

    // Render Dual Comparison Chart
    if (window.GrowGovCharts) {
      window.GrowGovCharts.renderGapComparisonChart("skill-gap-chart-container", state.competencies);
    }
  }

  // =========================================================================
  // PAGE 6: AI LEARNING RECOMMENDATIONS
  // =========================================================================
  function renderRecommendations(state) {
    const grid = document.getElementById("recommendations-cards-grid");
    if (!grid) return;

    let html = "";
    state.recommendations.forEach(rec => {
      const isCritical = rec.priority === "Critical";

      html += `
        <div class="recommendation-card ${isCritical ? 'is-critical' : ''}">
          <div>
            <div class="course-meta">
              <span class="badge ${isCritical ? 'badge-critical' : (rec.priority === 'High' ? 'badge-high' : 'badge-medium')}">${rec.priority} Priority</span>
              <span>•</span>
              <span>${rec.duration}</span>
              <span>•</span>
              <span>${rec.difficulty}</span>
            </div>

            <div class="course-name">${rec.courseName}</div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">
              Provider: <strong style="color: #0f172a;">${rec.provider}</strong>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 12.5px; background: #f8fafc; padding: 8px 12px; border-radius: 8px; margin: 10px 0;">
              <span>Current Level: <strong>${rec.currentLevel}%</strong></span>
              <span>Target Benchmark: <strong>${rec.targetLevel}%</strong></span>
            </div>

            <!-- WHY THIS IS RECOMMENDED (CRITICAL REQUIREMENT) -->
            <div class="why-recommended-box ${isCritical ? 'critical-why' : ''}">
              <div class="why-recommended-title">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                Why is this recommended?
              </div>
              <p>${rec.reason}</p>
            </div>

            <div style="font-size: 12px; color: #475569; margin-bottom: 16px;">
              <strong>Recommended Module:</strong> ${rec.recommendedModule}
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 14px; border-top: 1px solid #f1f5f9; padding-top: 14px;">
            <button class="btn btn-primary" style="flex: 1;" onclick="GrowGovApp.startLearningFlow('${rec.competency}', '${rec.courseName}')">
              ⚡ START LEARNING
            </button>
            <button class="btn btn-secondary btn-sm" onclick="GrowGovApp.viewCourseModal('${rec.courseName}')">
              VIEW SYLLABUS
            </button>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;
  }

  // =========================================================================
  // PAGE 7: AI MCQ GENERATOR
  // =========================================================================
  function renderMCQGenerator(state) {
    const inputView = document.getElementById("mcq-input-view");
    const readyView = document.getElementById("mcq-ready-view");
    const details = state.generatedAssessmentDetails || {
      competency: "Data Visualization",
      topic: "Charts & Executive Ministry Dashboards",
      difficulty: "Medium",
      questionsCount: 10,
      estimatedTime: "10 Minutes"
    };

    if (state.mcqGenerated) {
      if (inputView) inputView.style.display = "none";
      if (readyView) {
        readyView.style.display = "block";
        const compEl = document.getElementById("ready-competency-val");
        const topicEl = document.getElementById("ready-topic-val");
        const diffEl = document.getElementById("ready-difficulty-val");
        const qCountEl = document.getElementById("ready-questions-val");
        const timeEl = document.getElementById("ready-time-val");

        if (compEl) compEl.textContent = details.competency;
        if (topicEl) topicEl.textContent = details.topic;
        if (diffEl) diffEl.textContent = details.difficulty;
        if (qCountEl) qCountEl.textContent = `${details.questionsCount}`;
        if (timeEl) timeEl.textContent = details.estimatedTime;
      }
    } else {
      if (inputView) inputView.style.display = "grid";
      if (readyView) readyView.style.display = "none";
    }
  }

  window.runAIMCQGeneration = function () {
    const btn = document.getElementById("btn-generate-mcqs-trigger");
    const modal = document.getElementById("ai-generating-modal");

    // Read selected parameters from form
    const compSelect = document.getElementById("mcq-competency-select");
    const topicSelect = document.getElementById("mcq-topic-select");
    const diffRadio = document.querySelector('input[name="mcq-diff"]:checked');
    const countRadio = document.querySelector('input[name="mcq-count"]:checked');

    const competency = compSelect ? compSelect.value.split(" (")[0] : "Data Visualization";
    const topic = topicSelect ? topicSelect.value : "Charts & Executive Ministry Dashboards";
    const difficulty = diffRadio ? diffRadio.value : "Medium";
    const questionsCount = countRadio ? parseInt(countRadio.value, 10) : 10;
    const estimatedTime = `${questionsCount} Minutes`;

    if (btn) btn.disabled = true;
    if (modal) modal.classList.add("active");

    const docNameEl = document.getElementById("uploaded-doc-name");
    const docName = docNameEl ? docNameEl.textContent : "learning material";

    const steps = [
      `Parsing ${docName}...`,
      `Extracting key concepts for ${competency}...`,
      `Synthesizing Bloom's Taxonomy MCQs (${difficulty})...`,
      "Finalizing calibrated assessment questions..."
    ];

    let step = 0;
    const stepEl = document.getElementById("mcq-gen-step-text");
    if (stepEl) stepEl.textContent = steps[0];

    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        if (stepEl) stepEl.textContent = steps[step];
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (modal) modal.classList.remove("active");
          if (btn) btn.disabled = false;

          const state = store.getState();
          state.mcqGenerated = true;
          state.assessmentStarted = false;
          state.assessmentCompleted = false;
          state.generatedAssessmentDetails = {
            competency: competency,
            topic: topic,
            difficulty: difficulty,
            questionsCount: questionsCount,
            estimatedTime: estimatedTime
          };

          window.showToast("Assessment Ready", "ai");
          renderMCQGenerator(state);
        }, 500);
      }
    }, 600);
  };

  // =========================================================================
  // PAGE 8: ADAPTIVE ASSESSMENT
  // =========================================================================
  function renderAssessmentInterface(state) {
    const qIndex = state.activeAssessment.currentQuestionIndex || 0;
    const questions = window.GROWGOV_DATA.questions;
    const q = questions[qIndex];
    if (!q) return;

    // Header counter and progress
    document.getElementById("assessment-q-counter").textContent = `Question ${qIndex + 1} of ${questions.length}`;
    const progressPct = Math.round(((qIndex + 1) / questions.length) * 100);
    document.getElementById("assessment-progress-fill").style.width = `${progressPct}%`;

    // Render Question Navigator Dots
    const dotsContainer = document.getElementById("assessment-nav-dots");
    if (dotsContainer) {
      let dotsHtml = "";
      questions.forEach((_, idx) => {
        const isCurrent = idx === qIndex;
        const isAnswered = state.activeAssessment.answers[idx] !== undefined;
        dotsHtml += `
          <div class="q-dot ${isCurrent ? 'active' : ''} ${isAnswered ? 'answered' : ''}" onclick="GrowGovApp.jumpToQuestion(${idx})">
            ${idx + 1}
          </div>
        `;
      });
      dotsContainer.innerHTML = dotsHtml;
    }

    // Adaptive Engine Badge
    const adaptiveBadge = document.getElementById("assessment-adaptive-tag");
    if (adaptiveBadge) {
      adaptiveBadge.textContent = `Adaptive Level: ${q.difficulty.toUpperCase()}`;
    }

    // Question content
    document.getElementById("assessment-question-text").textContent = `Q${qIndex + 1}. ${q.text}`;

    // Options List
    const optionsContainer = document.getElementById("assessment-options-list");
    if (optionsContainer) {
      let optsHtml = "";
      const selectedOpt = state.activeAssessment.answers[qIndex];

      q.options.forEach((optText, optIdx) => {
        const isSelected = selectedOpt === optIdx;
        const optLetter = String.fromCharCode(65 + optIdx);
        const cleanText = optText.replace(/^[A-D]\.\s*/, '');
        optsHtml += `
          <div class="option-item ${isSelected ? 'selected' : ''}" onclick="GrowGovApp.selectAnswer(${qIndex}, ${optIdx})">
            <div class="option-radio"><strong>${optLetter}</strong></div>
            <div class="option-text"><strong style="color: #334155; margin-right: 6px;">Option ${optLetter}:</strong> ${cleanText}</div>
          </div>
        `;
      });
      optionsContainer.innerHTML = optsHtml;
    }

    // Prev / Next button states
    const prevBtn = document.getElementById("btn-assessment-prev");
    const nextBtn = document.getElementById("btn-assessment-next");
    const submitBtn = document.getElementById("btn-assessment-submit");

    if (prevBtn) prevBtn.disabled = qIndex === 0;

    if (qIndex === questions.length - 1) {
      if (nextBtn) nextBtn.style.display = "none";
      if (submitBtn) submitBtn.style.display = "inline-flex";
    } else {
      if (nextBtn) nextBtn.style.display = "inline-flex";
      if (submitBtn) submitBtn.style.display = "none";
    }

    // Start timer if not running
    if (!assessmentTimerInterval) {
      startAssessmentTimer();
    }
  }

  function startAssessmentTimer() {
    const timerEl = document.getElementById("assessment-timer-display");
    timeRemaining = 880; // ~14m 40s

    assessmentTimerInterval = setInterval(() => {
      timeRemaining--;
      if (timeRemaining <= 0) {
        clearInterval(assessmentTimerInterval);
        assessmentTimerInterval = null;
        GrowGovApp.submitAssessmentForm();
        return;
      }
      const mins = Math.floor(timeRemaining / 60);
      const secs = timeRemaining % 60;
      if (timerEl) {
        timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    }, 1000);
  }

  // =========================================================================
  // PAGE 9: ASSESSMENT RESULT
  // =========================================================================
  function renderAssessmentResult(state) {
    const res = state.latestResult || {
      score: 8,
      correctAnswers: 8,
      total: 10,
      totalQuestions: 10,
      accuracy: 80,
      status: "Passed with Merit",
      previousCompetency: 40,
      updatedCompetency: 62,
      gain: 22,
      competency: "Data Visualization"
    };

    const score = res.correctAnswers !== undefined ? res.correctAnswers : res.score;
    const total = res.totalQuestions !== undefined ? res.totalQuestions : res.total;
    const accuracy = res.accuracy !== undefined ? res.accuracy : (total > 0 ? Math.round((score / total) * 100) : 0);

    let status = res.status;
    if (!status) {
      if (accuracy >= 90) status = "Excellent";
      else if (accuracy >= 75) status = "Passed with Merit";
      else if (accuracy >= 50) status = "Passed";
      else status = "Needs Improvement";
    }

    const scoreEl = document.getElementById("res-score-display");
    const scoreSubtextEl = document.getElementById("res-score-subtext");
    const accEl = document.getElementById("res-accuracy-display");
    const statusEl = document.getElementById("res-status-display");
    const prevEl = document.getElementById("res-prev-comp");
    const updEl = document.getElementById("res-updated-comp");
    const gainEl = document.getElementById("res-gain-pill");
    const compEl = document.getElementById("res-competency-display");

    if (scoreEl) scoreEl.textContent = `${score}/${total}`;
    if (scoreSubtextEl) scoreSubtextEl.textContent = `${accuracy}% Accuracy`;
    if (accEl) accEl.textContent = `${accuracy}%`;
    if (statusEl) {
      statusEl.textContent = status;
      if (status === "Needs Improvement") {
        statusEl.style.color = "#dc2626";
      } else if (status === "Passed") {
        statusEl.style.color = "#0284c7";
      } else {
        statusEl.style.color = "#059669";
      }
    }
    if (prevEl) prevEl.textContent = `${res.previousCompetency}%`;
    if (updEl) updEl.textContent = `${res.updatedCompetency}%`;
    if (gainEl) gainEl.textContent = `+${res.gain}% Competency Gain!`;
    if (compEl) compEl.textContent = res.competency || "Data Visualization";
  }

  // =========================================================================
  // PAGE 10: MY PROGRESS
  // =========================================================================
  function renderMyProgress(state) {
    document.getElementById("prog-courses-completed").textContent = state.completedCoursesCount;
    document.getElementById("prog-assessments-completed").textContent = state.assessmentsCount;
    document.getElementById("prog-learning-hours").textContent = `${state.learningHours} hrs`;
    document.getElementById("prog-learning-streak").textContent = `${state.learningStreak} Days`;

    const recentBadgeEl = document.getElementById("prog-recent-badge-score");
    if (recentBadgeEl && state.latestResult) {
      recentBadgeEl.textContent = `Score: ${state.latestResult.accuracy}% • Issued Just Now`;
    }

    if (window.GrowGovCharts) {
      window.GrowGovCharts.renderProgressComparisonChart("progress-comparison-chart-container", state.progressHistory);
    }
  }

  // =========================================================================
  // PAGE 11: ADMIN DASHBOARD
  // =========================================================================
  function renderAdminDashboard(state) {
    const admin = state.adminStats;
    document.getElementById("admin-total-emp").textContent = admin.totalEmployees.toLocaleString();
    document.getElementById("admin-total-dept").textContent = admin.departmentsCount;
    document.getElementById("admin-crit-gaps").textContent = admin.criticalSkillGaps;
    document.getElementById("admin-programs").textContent = admin.activePrograms;
    document.getElementById("admin-assessments").textContent = admin.assessmentsCompleted.toLocaleString();

    // Render Admin Charts
    if (window.GrowGovCharts) {
      window.GrowGovCharts.renderAdminDeptChart("admin-dept-chart-container", admin.departments);
      window.GrowGovCharts.renderAdminDistributionChart("admin-dist-chart-container");
    }

    // Render Admin Table
    const tbody = document.getElementById("admin-employees-tbody");
    if (tbody) {
      let rowsHtml = "";
      admin.employeesList.forEach(emp => {
        rowsHtml += `
          <tr>
            <td>
              <div style="font-weight: 700; color: #0f172a;">${emp.name}</div>
              <div style="font-size: 11px; color: #64748b;">${emp.id}</div>
            </td>
            <td>${emp.department}</td>
            <td>${emp.role}</td>
            <td>
              <strong style="color: #1d4ed8; font-size: 14px;">${emp.competencyScore}%</strong>
              <div class="progress-bar-container" style="width: 60px; height: 5px; margin-top: 2px;">
                <div class="progress-bar-fill" style="width: ${emp.competencyScore}%;"></div>
              </div>
            </td>
            <td>
              <span class="badge ${emp.criticalGaps > 2 ? 'badge-critical' : (emp.criticalGaps > 0 ? 'badge-high' : 'badge-nogap')}">
                ${emp.criticalGaps} Gaps
              </span>
            </td>
            <td>
              <div style="font-size: 12px; font-weight: 600;">${emp.trainingProgress}%</div>
              <div class="progress-bar-container" style="width: 70px; height: 5px; margin-top: 2px;">
                <div class="progress-bar-fill fill-success" style="width: ${emp.trainingProgress}%;"></div>
              </div>
            </td>
            <td>
              <span style="font-size: 11.5px; font-weight: 700; color: ${emp.status === 'Certified' ? '#059669' : '#0284c7'};">
                ${emp.status}
              </span>
            </td>
          </tr>
        `;
      });
      tbody.innerHTML = rowsHtml;
    }
  }

  // =========================================================================
  // PUBLIC CONTROLLER EXPORTS
  // =========================================================================
  window.GrowGovApp = {
    navigateTo: navigateTo,

    // Login Controller
    handleLogin: function (e) {
      if (e) e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const pass = document.getElementById("login-password").value;
      const role = document.getElementById("login-role-hidden").value || "employee";

      store.login(role, email, pass);
      window.showToast(`Welcome, ${role === 'admin' ? 'Dr. Sunita Rao' : 'Rahul Sharma'}!`, "success");
      
      if (role === "admin") {
        navigateTo("admin-dashboard");
      } else {
        navigateTo("dashboard");
      }
    },

    quickFillDemo: function (roleType) {
      const emailInput = document.getElementById("login-email");
      const passInput = document.getElementById("login-password");
      const roleHidden = document.getElementById("login-role-hidden");

      if (roleType === "admin") {
        emailInput.value = "admin.karmayogi@gov.in";
        passInput.value = "adminpassword";
        roleHidden.value = "admin";
        document.querySelectorAll(".role-tab-btn").forEach(b => b.classList.remove("active"));
        document.getElementById("role-tab-admin").classList.add("active");
      } else {
        emailInput.value = "rahul.sharma@mospi.gov.in";
        passInput.value = "password123";
        roleHidden.value = "employee";
        document.querySelectorAll(".role-tab-btn").forEach(b => b.classList.remove("active"));
        document.getElementById("role-tab-emp").classList.add("active");
      }
      this.handleLogin();
    },

    selectRoleTab: function (role) {
      document.getElementById("login-role-hidden").value = role;
      document.querySelectorAll(".role-tab-btn").forEach(b => b.classList.remove("active"));
      if (role === "admin") {
        document.getElementById("role-tab-admin").classList.add("active");
        document.getElementById("login-email").value = "admin.karmayogi@gov.in";
      } else {
        document.getElementById("role-tab-emp").classList.add("active");
        document.getElementById("login-email").value = "rahul.sharma@mospi.gov.in";
      }
    },

    // Recommendations & Start Learning
    startLearningFlow: function (competency, courseName) {
      window.showToast(`Starting learning module: ${courseName}`, "ai");
      navigateTo("mcq-generator");
    },

    viewCourseModal: function (courseName) {
      const modal = document.getElementById("course-syllabus-modal");
      if (modal) {
        document.getElementById("syllabus-course-title").textContent = courseName;
        modal.classList.add("active");
      }
    },

    closeCourseModal: function () {
      const modal = document.getElementById("course-syllabus-modal");
      if (modal) modal.classList.remove("active");
    },

    handleTargetRecommendation: function (compName) {
      navigateTo("recommendations");
    },

    // Assessment Interactions
    selectAnswer: function (qIndex, optIndex) {
      const state = store.getState();
      state.activeAssessment.answers[qIndex] = optIndex;
      renderAssessmentInterface(state);
    },

    jumpToQuestion: function (qIndex) {
      const state = store.getState();
      state.activeAssessment.currentQuestionIndex = qIndex;
      renderAssessmentInterface(state);
    },

    nextQuestion: function () {
      const state = store.getState();
      const questions = window.GROWGOV_DATA.questions;
      if (state.activeAssessment.currentQuestionIndex < questions.length - 1) {
        state.activeAssessment.currentQuestionIndex++;
        renderAssessmentInterface(state);
      }
    },

    prevQuestion: function () {
      const state = store.getState();
      if (state.activeAssessment.currentQuestionIndex > 0) {
        state.activeAssessment.currentQuestionIndex--;
        renderAssessmentInterface(state);
      }
    },

    // Hackathon demo shortcut: auto fills answers to achieve exact 8/10 score!
    autoFillDemoAnswers: function () {
      const state = store.getState();
      const questions = window.GROWGOV_DATA.questions;
      // Answer 8 correct, 2 incorrect
      questions.forEach((q, idx) => {
        if (idx === 3 || idx === 7) {
          // Intentionally choose wrong distractor
          state.activeAssessment.answers[idx] = (q.correctIndex + 1) % 4;
        } else {
          state.activeAssessment.answers[idx] = q.correctIndex;
        }
      });
      window.showToast("Answers benchmarked for evaluation (80% Accuracy)", "ai");
      renderAssessmentInterface(state);
    },

    submitAssessmentForm: function () {
      if (assessmentTimerInterval) {
        clearInterval(assessmentTimerInterval);
        assessmentTimerInterval = null;
      }

      const state = store.getState();
      const questions = window.GROWGOV_DATA.questions;
      let score = 0;

      questions.forEach((q, idx) => {
        if (state.activeAssessment.answers[idx] === q.correctIndex) {
          score++;
        }
      });

      const result = store.submitAssessment(score, questions.length, state.activeAssessment.answers);
      window.showToast(`Assessment submitted! Score: ${result.score}/${result.total} (${result.accuracy}%) - ${result.status}`, "success");
      navigateTo("assessment-result");
    },

    // Apply & Update Profile Action (from results page)
    applyUpdateAndProceed: function () {
      window.showToast("Competency Profile Updated! Dashboard & Progress Synced.", "success");
      navigateTo("my-progress");
    },

    // AI MCQ Generator Assessment Flow Controllers
    startGeneratedAssessment: function () {
      const state = store.getState();
      state.assessmentStarted = true;
      state.activeAssessment.currentQuestionIndex = 0;
      state.activeAssessment.answers = {};
      navigateTo("assessment");
    },

    // File Upload Handler for AI MCQ Generator (PDF, PPT, PPTX)
    handleFileUpload: function (event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const validExts = [".pdf", ".ppt", ".pptx"];
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!validExts.includes(ext)) {
        window.showToast("Unsupported file type. Please upload a PDF, PPT, or PPTX file.", "warning");
        return;
      }

      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const nameEl = document.getElementById("uploaded-doc-name");
      const metaEl = document.getElementById("uploaded-doc-meta");
      const iconEl = document.getElementById("uploaded-doc-icon");
      const statusEl = document.getElementById("uploaded-doc-status");

      if (nameEl) nameEl.textContent = file.name;
      if (metaEl) metaEl.textContent = `${sizeMB} MB • ${ext.toUpperCase().replace('.', '')} Document • Parsed & Vector Indexed`;
      if (iconEl) iconEl.textContent = ext.includes("ppt") ? "📊" : "📑";
      if (statusEl) {
        statusEl.textContent = "Indexed";
        statusEl.className = "badge badge-nogap";
      }

      window.showToast(`Learning material indexed: ${file.name} (${sizeMB} MB)`, "success");
    },

    resetMCQGenerator: function () {
      const state = store.getState();
      state.mcqGenerated = false;
      state.assessmentStarted = false;
      renderMCQGenerator(state);
    },

    viewLearningRecommendation: function () {
      window.showToast("Navigating to AI Learning Recommendations based on assessment results.", "ai");
      navigateTo("recommendations");
    },

    // =========================================================================
    // SIH 2026 JUDGE GUIDED DEMO WORKFLOW CONTROLLER
    // =========================================================================
    runGuidedDemoStep: function (stepIndex) {
      const tourModal = document.getElementById("sih-demo-tour-modal");
      if (tourModal) tourModal.classList.add("active");
      this.updateDemoTourStep(stepIndex);
    },

    closeDemoTour: function () {
      const tourModal = document.getElementById("sih-demo-tour-modal");
      if (tourModal) tourModal.classList.remove("active");
    },

    updateDemoTourStep: function (step) {
      const stepsData = [
        {
          title: "Step 1: Employee Dashboard Overview",
          desc: "Judge inspects Rahul Sharma's baseline profile. Notice Data Visualization is at 40% with 3 Critical Gaps.",
          page: "dashboard",
          actionText: "Proceed to AI Profile Analysis &rarr;"
        },
        {
          title: "Step 2: AI Profile Analysis",
          desc: "AI scans Rahul's job responsibilities, skills, and qualifications against the MoSPI Cadre Framework.",
          page: "profile-analysis",
          actionText: "View Competency Mapping &rarr;"
        },
        {
          title: "Step 3: Role -> Task -> Competency -> Skill Mapping",
          desc: "Visual hierarchical breakdown showing how Statistical Officer roles link to competencies like Data Visualization and tools like Power BI / Tableau.",
          page: "competency-mapping",
          actionText: "Inspect Skill Gap Analysis &rarr;"
        },
        {
          title: "Step 4: Skill Gap Analysis (Gap = 40%)",
          desc: "Formula: Gap = Required (80%) - Current (40%) = 40% Deficit. Flagged as CRITICAL priority with dual bar chart comparison.",
          page: "skill-gap",
          actionText: "View AI Recommendations &rarr;"
        },
        {
          title: "Step 5: Personalized Recommendations",
          desc: "AI course recommendation card explicitly explains: 'Why is this recommended?' based on the 40% gap.",
          page: "recommendations",
          actionText: "Generate AI MCQs &rarr;"
        },
        {
          title: "Step 6: AI MCQ Generator",
          desc: "Upload MoSPI PDF/PPT or generate directly. Click 'Generate MCQs with AI' to trigger the Bloom's taxonomy synthesizer.",
          page: "mcq-generator",
          actionText: "Start Adaptive Assessment &rarr;"
        },
        {
          title: "Step 7: Adaptive Assessment (8/10 Score)",
          desc: "Adaptive questions adjust dynamically based on candidate responses. Use 1-Click Auto Fill (8/10) for instant demo evaluation.",
          page: "assessment",
          actionText: "Submit & View Leap &rarr;"
        },
        {
          title: "Step 8: Competency Leap (40% &rarr; 62%)",
          desc: "Real-time evaluation: Score 8/10 triggers a +22% leap from 40% to 62%! Overall score jumps to 83% and critical gaps drop to 2.",
          page: "assessment-result",
          actionText: "View My Progress Trajectory &rarr;"
        },
        {
          title: "Step 9: My Progress & Before/After Trajectory",
          desc: "Demonstrates longitudinal before vs after growth charts and verified Karmayogi badges.",
          page: "my-progress",
          actionText: "View Admin Ministry Portal &rarr;"
        },
        {
          title: "Step 10: Cadre Admin Analytics",
          desc: "Ministry dashboard aggregating 1,420 officers, department-wise gaps, and live capability distribution.",
          page: "admin-dashboard",
          actionText: "Finish Tour & Return to Dashboard"
        }
      ];

      const s = stepsData[step];
      if (!s) {
        this.closeDemoTour();
        navigateTo("dashboard");
        return;
      }

      navigateTo(s.page);

      document.getElementById("tour-step-counter").textContent = `Step ${step + 1} of ${stepsData.length}`;
      document.getElementById("tour-step-title").textContent = s.title;
      document.getElementById("tour-step-desc").textContent = s.desc;
      const nextBtn = document.getElementById("tour-next-btn");
      if (nextBtn) {
        nextBtn.innerHTML = s.actionText;
        nextBtn.onclick = () => {
          if (step === 6) {
            // Assessment step: auto fill 8/10 and submit
            this.autoFillDemoAnswers();
            setTimeout(() => {
              this.submitAssessmentForm();
              this.updateDemoTourStep(step + 1);
            }, 600);
          } else {
            this.updateDemoTourStep(step + 1);
          }
        };
      }
    }
  };

  // --- INIT APPLICATION ON DOM LOAD ---
  document.addEventListener("DOMContentLoaded", () => {
    // Initial role access control sync
    applyRoleAccessControl(store.getState());

    // Subscribe store changes
    store.subscribe((state) => {
      applyRoleAccessControl(state);
      renderPage(currentPage);
    });

    // Check query params or defaults
    const state = store.getState();
    let startPage = "login";
    if (state.isLoggedIn) {
      startPage = state.currentRole === "admin" ? "admin-dashboard" : "dashboard";
    }
    navigateTo(startPage);

    // Listen to window hash changes for routing
    window.addEventListener("hashchange", () => {
      const rawHash = window.location.hash.replace(/^#\/?/, "");
      if (rawHash) {
        navigateTo(rawHash);
      }
    });

    // Sidebar navigation click binding
    document.querySelectorAll(".sidebar .nav-item[data-page]").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const p = item.getAttribute("data-page");
        navigateTo(p);
      });
    });

    // Mobile sidebar toggle
    const menuBtn = document.getElementById("mobile-menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    if (menuBtn && sidebar) {
      menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
      });
    }
  });
})();
