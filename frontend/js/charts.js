/**
 * GrowGov AI – High Fidelity Chart Renderers (SVG / Canvas)
 * Works standalone offline or alongside Chart.js
 * iGOT Karmayogi Competency Platform
 */

window.GrowGovCharts = {
  // 1. Donut Gauge for Employee Dashboard (Learning Progress)
  renderDonutGauge: function (containerId, percentage, label, subtext) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const size = 180;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    el.innerHTML = `
      <div style="position: relative; width: ${size}px; height: ${size}px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg);">
          <circle
            cx="${size / 2}" cy="${size / 2}" r="${radius}"
            fill="transparent"
            stroke="#e2e8f0"
            stroke-width="${strokeWidth}"
          />
          <circle
            cx="${size / 2}" cy="${size / 2}" r="${radius}"
            fill="transparent"
            stroke="url(#donutGradient)"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
            stroke-linecap="round"
            style="transition: stroke-dashoffset 1s ease;"
          />
          <defs>
            <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1d4ed8" />
              <stop offset="100%" stop-color="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
        <div style="position: absolute; text-align: center; pointer-events: none;">
          <div style="font-size: 32px; font-weight: 800; color: #0f172a; line-height: 1;">${percentage}%</div>
          <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 4px; letter-spacing: 0.04em;">${label}</div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 14px; font-size: 12.5px; color: #64748b; font-weight: 500;">
        ${subtext || "Target: 100% Annual MoSPI Competency Benchmark"}
      </div>
    `;
  },

  // 2. Dual Comparison Bar Chart for Skill Gap Analysis (Current vs Required)
  renderGapComparisonChart: function (containerId, competencies) {
    const el = document.getElementById(containerId);
    if (!el) return;

    let itemsHtml = "";
    competencies.forEach(comp => {
      const isCritical = comp.gap >= 30;
      const curColor = isCritical ? "#ef4444" : "#2563eb";

      itemsHtml += `
        <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #0f172a;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${comp.name}</span>
              ${isCritical ? '<span style="font-size: 10px; background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px;">CRITICAL GAP</span>' : ''}
            </div>
            <div style="font-size: 12px; color: #475569;">
              Current: <strong style="color: ${curColor};">${comp.current}%</strong> | Required: <strong style="color: #0f172a;">${comp.required}%</strong>
            </div>
          </div>
          
          <div style="position: relative; height: 26px; background: #f1f5f9; border-radius: 6px; overflow: hidden; display: flex; align-items: center;">
            <!-- Required Benchmark Line/Bar -->
            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${comp.required}%; background: rgba(148, 163, 184, 0.25); border-right: 2px dashed #475569; z-index: 1;"></div>
            
            <!-- Current Bar -->
            <div style="position: absolute; left: 0; top: 3px; bottom: 3px; width: ${comp.current}%; background: ${curColor}; border-radius: 4px; z-index: 2; transition: width 0.8s ease; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px;">
              <span style="color: #fff; font-size: 10.5px; font-weight: 800;">${comp.current}%</span>
            </div>
            
            <!-- Required Marker Label -->
            <div style="position: absolute; left: calc(${comp.required}% + 6px); font-size: 10px; font-weight: 700; color: #475569; z-index: 3;">
              Target ${comp.required}%
            </div>
          </div>
        </div>
      `;
    });

    el.innerHTML = `
      <div style="padding: 10px 0;">
        <div style="display: flex; justify-content: flex-end; gap: 16px; margin-bottom: 16px; font-size: 12px; font-weight: 600;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 12px; height: 12px; background: #2563eb; border-radius: 3px; display: inline-block;"></span>
            <span>Current Competency</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 12px; height: 12px; background: #ef4444; border-radius: 3px; display: inline-block;"></span>
            <span>Critical Deficit (&ge;30%)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 12px; height: 12px; border-right: 2px dashed #475569; background: #e2e8f0; display: inline-block;"></span>
            <span>Target Benchmark</span>
          </div>
        </div>
        ${itemsHtml}
      </div>
    `;
  },

  // 3. Before vs After Progress Comparison (My Progress Page)
  renderProgressComparisonChart: function (containerId, historyItems) {
    const el = document.getElementById(containerId);
    if (!el) return;

    let rowsHtml = "";
    historyItems.forEach(item => {
      const delta = item.after - item.before;
      const isPositive = delta > 0;

      rowsHtml += `
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
              <div style="font-size: 14.5px; font-weight: 800; color: #0f172a;">${item.competency}</div>
              <div style="font-size: 11.5px; color: #64748b;">${item.date} • Required: ${item.required}%</div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 13px; font-weight: 700; color: #64748b;">${item.before}%</span>
              <span style="font-size: 16px; color: #94a3b8;">&rarr;</span>
              <span style="font-size: 16px; font-weight: 800; color: ${item.after >= item.required ? '#059669' : '#0284c7'};">${item.after}%</span>
              ${isPositive ? `<span style="font-size: 11px; font-weight: 800; background: #ecfdf5; color: #059669; padding: 3px 8px; border-radius: 999px; border: 1px solid #a7f3d0;">+${delta}% Leap</span>` : '<span style="font-size: 11px; background: #f1f5f9; color: #64748b; padding: 3px 8px; border-radius: 999px;">Baseline</span>'}
            </div>
          </div>
          
          <!-- Stacked visual bar -->
          <div style="height: 12px; width: 100%; background: #f1f5f9; border-radius: 999px; overflow: hidden; position: relative;">
            <!-- Before bar -->
            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${item.before}%; background: #94a3b8; border-radius: 999px; z-index: 1;"></div>
            <!-- After improved extension -->
            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${item.after}%; background: linear-gradient(90deg, #1d4ed8, #059669); border-radius: 999px; z-index: 2; transition: width 0.8s ease;"></div>
          </div>
        </div>
      `;
    });

    el.innerHTML = rowsHtml;
  },

  // 4. Admin Department-wise Gaps Bar Chart
  renderAdminDeptChart: function (containerId, departments) {
    const el = document.getElementById(containerId);
    if (!el) return;

    let barsHtml = "";
    departments.forEach(dept => {
      const critPct = Math.round((dept.criticalGaps / dept.total) * 100);
      const highPct = Math.round((dept.highGaps / dept.total) * 100);

      barsHtml += `
        <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 700;">
            <span style="color: #0f172a;">${dept.name} <span style="font-size: 11px; color: #64748b; font-weight: 500;">(${dept.total} Officers)</span></span>
            <span style="color: #b91c1c; font-size: 11.5px;">${dept.criticalGaps} Critical Gaps</span>
          </div>
          <div style="height: 14px; background: #f1f5f9; border-radius: 4px; display: flex; overflow: hidden;">
            <div style="width: ${critPct * 2}%; background: #ef4444;" title="Critical Gaps: ${dept.criticalGaps}"></div>
            <div style="width: ${highPct * 1.5}%; background: #f59e0b;" title="High Gaps: ${dept.highGaps}"></div>
            <div style="flex: 1; background: #10b981;" title="Competent/Meeting Standards"></div>
          </div>
        </div>
      `;
    });

    el.innerHTML = `
      <div style="padding: 6px 0;">
        <div style="display: flex; justify-content: flex-end; gap: 14px; margin-bottom: 14px; font-size: 11.5px; font-weight: 600;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 10px; height: 10px; background: #ef4444; border-radius: 2px;"></span>
            <span>Critical Deficit</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 10px; height: 10px; background: #f59e0b; border-radius: 2px;"></span>
            <span>High Priority</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 10px; height: 10px; background: #10b981; border-radius: 2px;"></span>
            <span>Proficient</span>
          </div>
        </div>
        ${barsHtml}
      </div>
    `;
  },

  // 5. Admin Competency Distribution (Doughnut breakdown)
  renderAdminDistributionChart: function (containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 16px; padding: 12px 0;">
        <div style="position: relative; width: 140px; height: 140px;">
          <svg width="140" height="140" viewBox="0 0 140 140" style="transform: rotate(-90deg);">
            <!-- High: 48% (stroke-dasharray="169 352") -->
            <circle cx="70" cy="70" r="56" fill="none" stroke="#10b981" stroke-width="16" stroke-dasharray="169 352" stroke-dashoffset="0" />
            <!-- Moderate: 38% (stroke-dasharray="133 352") -->
            <circle cx="70" cy="70" r="56" fill="none" stroke="#0284c7" stroke-width="16" stroke-dasharray="133 352" stroke-dashoffset="-169" />
            <!-- Developing: 14% (stroke-dasharray="50 352") -->
            <circle cx="70" cy="70" r="56" fill="none" stroke="#ef4444" stroke-width="16" stroke-dasharray="50 352" stroke-dashoffset="-302" />
          </svg>
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <span style="font-size: 20px; font-weight: 800; color: #0f172a;">1,420</span>
            <span style="font-size: 10px; color: #64748b; font-weight: 600;">OFFICERS</span>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 10px; height: 10px; background: #10b981; border-radius: 50%;"></span>
            <span style="font-weight: 600; color: #0f172a;">Proficient (&gt;75%):</span>
            <strong style="margin-left: auto;">48% (681)</strong>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 10px; height: 10px; background: #0284c7; border-radius: 50%;"></span>
            <span style="font-weight: 600; color: #0f172a;">Competent (50–75%):</span>
            <strong style="margin-left: auto;">38% (540)</strong>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%;"></span>
            <span style="font-weight: 600; color: #0f172a;">Needs Support (&lt;50%):</span>
            <strong style="margin-left: auto;">14% (199)</strong>
          </div>
        </div>
      </div>
    `;
  }
};
