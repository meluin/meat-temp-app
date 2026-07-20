/*
 * app.js — router, rendering and interaction logic for the Meat Temp app.
 * Plain vanilla JS, no framework, no build step. Relies on MEAT_DATA
 * (data.js) and ICONS/renderIcon (icons.js) being loaded first.
 */

(function () {
  "use strict";

  // ---------------- Small glyphs for cooking methods (not animal icons) ----------------
  const METHOD_META = {
    oven: {
      label: "Oven",
      glyph: '<svg viewBox="0 0 24 24" class="method-glyph"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="14" r="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="6" y1="7.2" x2="18" y2="7.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    smoker: {
      label: "Smoker",
      glyph: '<svg viewBox="0 0 24 24" class="method-glyph"><rect x="4" y="9" width="16" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 9 Q6 4 9 2 Q8 6 11 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M15 9 Q17 5 15 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="4" y1="14.5" x2="20" y2="14.5" stroke="currentColor" stroke-width="1.4" opacity="0.6"/></svg>'
    },
    grill: {
      label: "Grill",
      glyph: '<svg viewBox="0 0 24 24" class="method-glyph"><ellipse cx="12" cy="18" rx="9" ry="2.4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="7" y1="16" x2="7" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="17" y1="16" x2="17" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 10 Q12 3 15 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
    },
    other: {
      label: "Stovetop / Other",
      glyph: '<svg viewBox="0 0 24 24" class="method-glyph"><ellipse cx="12" cy="11" rx="8" ry="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="4" y1="11" x2="4" y2="14" stroke="currentColor" stroke-width="2"/><line x1="20" y1="11" x2="20" y2="14" stroke="currentColor" stroke-width="2"/><path d="M4 14 Q12 19 20 14" fill="none" stroke="currentColor" stroke-width="2"/><line x1="2" y1="7.5" x2="6" y2="7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    }
  };
  const METHOD_ORDER = ["oven", "smoker", "grill", "other"];

  const DEFAULT_THEME = {
    accent: "#8a2635",
    accentDark: "#5c1521",
    accentLight: "#c1495a",
    bg1: "#201412",
    bg2: "#100a09"
  };

  // ---------------- DOM refs ----------------
  const $view = document.getElementById("view");
  const $headerTitle = document.getElementById("headerTitle");
  const $headerIcon = document.getElementById("headerIcon");
  const $backBtn = document.getElementById("backBtn");
  const $searchToggle = document.getElementById("searchToggle");
  const $searchBar = document.getElementById("searchBar");
  const $searchInput = document.getElementById("searchInput");
  const $searchClear = document.getElementById("searchClear");
  const $methodFilter = document.getElementById("methodFilter");
  const $disclaimerStrip = document.getElementById("disclaimerStrip");
  const $infoModal = document.getElementById("infoModal");
  const $infoModalClose = document.getElementById("infoModalClose");

  // ---------------- State ----------------
  let currentFilter = localStorage.getItem("meatTempMethodFilter") || "all";
  let inSearchMode = false;

  // ---------------- Data helpers ----------------
  function getCategory(id) {
    return MEAT_DATA.categories.find((c) => c.id === id);
  }

  function findCutById(cutId) {
    for (const category of MEAT_DATA.categories) {
      const cut = category.cuts.find((c) => c.id === cutId);
      if (cut) return { cut, category };
    }
    return null;
  }

  function allCutsFlat() {
    const out = [];
    for (const category of MEAT_DATA.categories) {
      for (const cut of category.cuts) {
        out.push({ cut, category });
      }
    }
    return out;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ---------------- Theming ----------------
  function applyTheme(theme) {
    const t = theme || DEFAULT_THEME;
    const el = document.body;
    el.style.setProperty("--accent", t.accent);
    el.style.setProperty("--accent-dark", t.accentDark);
    el.style.setProperty("--accent-light", t.accentLight);
    el.style.setProperty("--bg1", t.bg1);
    el.style.setProperty("--bg2", t.bg2);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t.accent);
  }

  // ---------------- Header helpers ----------------
  function setHeader({ title, icon, showBack }) {
    $headerTitle.textContent = title;
    $headerIcon.innerHTML = icon ? renderIcon(icon) : "";
    $backBtn.hidden = !showBack;
  }

  // ---------------- Cut row rendering ----------------
  function cutRowHtml(cut, category, showCategoryLabel) {
    const methods = cut.methods ? Object.keys(cut.methods) : [];
    const badges = METHOD_ORDER.filter((m) => methods.includes(m))
      .map((m) => `<span class="badge">${METHOD_META[m].label.split(" / ")[0]}</span>`)
      .join("");
    const safeMin = cut.safeMinTemp != null ? `<span class="badge">${cut.safeMinTemp}°C min</span>` : "";
    return `
      <div class="cut-row" data-cut-id="${cut.id}" role="button" tabindex="0">
        <span class="cut-icon">${renderIcon(category.icon)}</span>
        <div class="cut-info">
          <div class="cut-name">${escapeHtml(cut.name)}</div>
          ${showCategoryLabel ? `<div class="cut-category-label">${escapeHtml(category.name)}</div>` : ""}
          <div class="cut-badges">${safeMin}${badges}</div>
        </div>
        <svg viewBox="0 0 24 24" class="chevron"><path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
    `;
  }

  function bindCutRows(root) {
    root.querySelectorAll(".cut-row").forEach((row) => {
      const go = () => { location.hash = `#/item/${row.dataset.cutId}`; };
      row.addEventListener("click", go);
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });
  }

  // ---------------- Views ----------------
  function renderHome() {
    applyTheme(null);
    setHeader({ title: "Meat Temp", icon: null, showBack: false });

    const cards = MEAT_DATA.categories.map((cat) => `
      <div class="category-card" data-cat-id="${cat.id}" role="button" tabindex="0"
           style="--card-accent:${cat.theme.accent}; --card-bg1:${cat.theme.bg1}; --card-bg2:${cat.theme.bg2};">
        <span class="card-icon">${renderIcon(cat.icon)}</span>
        <span class="card-name">${escapeHtml(cat.name)}</span>
        <span class="card-tagline">${escapeHtml(cat.tagline)}</span>
      </div>
    `).join("");

    $view.innerHTML = `
      <div class="section-title">Pick a category</div>
      <div class="category-grid">${cards}</div>
    `;

    $view.querySelectorAll(".category-card").forEach((card) => {
      const go = () => { location.hash = `#/category/${card.dataset.catId}`; };
      card.addEventListener("click", go);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });
  }

  function renderCategory(catId) {
    const category = getCategory(catId);
    if (!category) { location.hash = "#/"; return; }

    applyTheme(category.theme);
    setHeader({ title: category.name, icon: category.icon, showBack: true });

    const rows = category.cuts.map((cut) => cutRowHtml(cut, category, false)).join("");
    $view.innerHTML = `
      <div class="page-tagline">${escapeHtml(category.tagline)}</div>
      <div class="cut-list">${rows}</div>
    `;
    bindCutRows($view);
  }

  function methodSectionHtml(methodKey, methodData) {
    const meta = METHOD_META[methodKey];
    const heading = methodKey === "other" && methodData.label ? methodData.label : meta.label;
    const rows = [];
    if (methodData.temp) rows.push(`<dt>Temp</dt><dd>${escapeHtml(methodData.temp)}</dd>`);
    if (methodData.time) rows.push(`<dt>Time</dt><dd>${escapeHtml(methodData.time)}</dd>`);
    if (methodData.pull) rows.push(`<dt>Pull at</dt><dd>${escapeHtml(methodData.pull)}</dd>`);
    return `
      <div class="card">
        <div class="card-heading">${meta.glyph}<span>${escapeHtml(heading)}</span></div>
        <dl class="method-grid">${rows.join("")}</dl>
        ${methodData.notes ? `<div class="method-notes">${escapeHtml(methodData.notes)}</div>` : ""}
      </div>
    `;
  }

  function renderDetail(cutId) {
    const found = findCutById(cutId);
    if (!found) { location.hash = "#/"; return; }
    const { cut, category } = found;

    applyTheme(category.theme);
    setHeader({ title: cut.name, icon: category.icon, showBack: true });

    let html = `
      <div class="detail-header">
        <div class="detail-category-label">${escapeHtml(category.name)}</div>
        <div class="detail-title">${escapeHtml(cut.name)}</div>
      </div>
    `;

    if (cut.safeMinTemp != null) {
      html += `
        <div class="safe-min-card">
          <div class="safe-min-value">${cut.safeMinTemp}°C</div>
          <div class="safe-min-text">
            <div class="safe-min-label">USDA Safe Minimum</div>
            <div class="safe-min-note">${escapeHtml(cut.safeMinNote || "")}</div>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="card">
          <div class="card-heading"><span>Visual Doneness Cues</span></div>
          <div class="method-notes" style="margin-top:0; padding-top:0; border-top:none;">${escapeHtml(cut.safeMinNote || "")}</div>
        </div>
      `;
    }

    if (cut.doneness && cut.doneness.length) {
      const rows = cut.doneness.map((d) => `
        <div class="doneness-row">
          <span class="doneness-label">${escapeHtml(d.label)}</span>
          <span class="doneness-temp">${d.temp}°C</span>
        </div>
      `).join("");
      html += `
        <div class="card">
          <div class="card-heading"><span>Doneness Levels</span></div>
          <div class="doneness-table">${rows}</div>
        </div>
      `;
    }

    const availableMethods = cut.methods ? METHOD_ORDER.filter((m) => cut.methods[m]) : [];
    const methodsToShow = currentFilter === "all" ? availableMethods : availableMethods.filter((m) => m === currentFilter);

    if (currentFilter !== "all" && methodsToShow.length === 0) {
      const label = METHOD_META[currentFilter].label;
      html += `<div class="no-method-note">No ${escapeHtml(label)} guidance for this cut — try "All" in the filter below.</div>`;
    } else {
      methodsToShow.forEach((m) => { html += methodSectionHtml(m, cut.methods[m]); });
    }

    if (cut.rest) {
      html += `
        <div class="card rest-card">
          <svg viewBox="0 0 24 24" class="rest-glyph"><circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8 L12 13 L16 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 2 L15 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <div><div class="card-heading" style="margin-bottom:2px;">Rest Time</div><div>${escapeHtml(cut.rest)}</div></div>
        </div>
      `;
    }

    if (cut.notes) {
      html += `<div class="detail-notes">${escapeHtml(cut.notes)}</div>`;
    }

    $view.innerHTML = html;
  }

  function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    let html = "";

    if (!q) {
      html = `<div class="empty-state">Start typing to search every cut across all categories — e.g. "brisket", "chicken breast", "salmon".</div>`;
    } else {
      const matches = allCutsFlat().filter(({ cut, category }) =>
        cut.name.toLowerCase().includes(q) || category.name.toLowerCase().includes(q)
      );
      if (matches.length === 0) {
        html = `<div class="empty-state">No matches for "${escapeHtml(query)}". Try a shorter or different term.</div>`;
      } else {
        html = `<div class="cut-list">${matches.map(({ cut, category }) => cutRowHtml(cut, category, true)).join("")}</div>`;
      }
    }

    $view.innerHTML = html;
    bindCutRows($view);
  }

  // ---------------- Search UI ----------------
  function openSearch() {
    inSearchMode = true;
    applyTheme(null);
    setHeader({ title: "Search", icon: null, showBack: true });
    $searchBar.hidden = false;
    $searchInput.value = "";
    $searchClear.hidden = true;
    renderSearchResults("");
    setTimeout(() => $searchInput.focus(), 30);
  }

  function resetSearchUI() {
    inSearchMode = false;
    $searchBar.hidden = true;
    $searchInput.value = "";
    $searchClear.hidden = true;
  }

  function closeSearch() {
    resetSearchUI();
    route(location.hash);
  }

  // ---------------- Router ----------------
  function route(hash) {
    const h = hash || "#/";
    const catMatch = h.match(/^#\/category\/(.+)$/);
    const itemMatch = h.match(/^#\/item\/(.+)$/);

    if (catMatch) {
      renderCategory(decodeURIComponent(catMatch[1]));
    } else if (itemMatch) {
      renderDetail(decodeURIComponent(itemMatch[1]));
    } else {
      renderHome();
    }
    $view.scrollTop = 0;
    $view.focus({ preventScroll: true });
  }

  window.addEventListener("hashchange", () => {
    if (inSearchMode) resetSearchUI();
    route(location.hash);
  });

  // ---------------- Event wiring ----------------
  $backBtn.addEventListener("click", () => {
    if (inSearchMode) {
      closeSearch();
    } else {
      history.back();
    }
  });

  $searchToggle.addEventListener("click", () => {
    if (inSearchMode) { closeSearch(); } else { openSearch(); }
  });

  $searchInput.addEventListener("input", (e) => {
    const val = e.target.value;
    $searchClear.hidden = !val;
    renderSearchResults(val);
  });

  $searchClear.addEventListener("click", () => {
    $searchInput.value = "";
    $searchClear.hidden = true;
    renderSearchResults("");
    $searchInput.focus();
  });

  $methodFilter.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-chip");
    if (!btn) return;
    currentFilter = btn.dataset.method;
    localStorage.setItem("meatTempMethodFilter", currentFilter);
    $methodFilter.querySelectorAll(".filter-chip").forEach((c) => c.classList.toggle("active", c === btn));
    const itemMatch = location.hash.match(/^#\/item\/(.+)$/);
    if (itemMatch && !inSearchMode) renderDetail(decodeURIComponent(itemMatch[1]));
  });

  $disclaimerStrip.addEventListener("click", () => { $infoModal.hidden = false; });
  $disclaimerStrip.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $infoModal.hidden = false; }
  });
  $infoModalClose.addEventListener("click", () => { $infoModal.hidden = true; });
  $infoModal.addEventListener("click", (e) => { if (e.target === $infoModal) $infoModal.hidden = true; });

  // ---------------- Init ----------------
  $methodFilter.querySelectorAll(".filter-chip").forEach((c) => {
    c.classList.toggle("active", c.dataset.method === currentFilter);
  });

  route(location.hash);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
    });
  }
})();
