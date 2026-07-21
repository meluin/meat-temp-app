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
    stovetop: {
      label: "Stovetop / Pan",
      glyph: '<svg viewBox="0 0 24 24" class="method-glyph"><ellipse cx="12" cy="11" rx="8" ry="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="4" y1="11" x2="4" y2="14" stroke="currentColor" stroke-width="2"/><line x1="20" y1="11" x2="20" y2="14" stroke="currentColor" stroke-width="2"/><path d="M4 14 Q12 19 20 14" fill="none" stroke="currentColor" stroke-width="2"/><line x1="2" y1="7.5" x2="6" y2="7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    }
  };
  const METHOD_ORDER = ["oven", "smoker", "grill", "stovetop"];

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
  // Which cooking method the detail view is currently showing, and for which
  // cut — so the choice survives a re-render but resets when you open another.
  let detailMethod = { cutId: null, method: null };

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

  /* True when a cut should be listed under the active method filter. */
  function cutMatchesFilter(cut) {
    if (currentFilter === "all") return true;
    return !!(cut.methods && cut.methods[currentFilter]);
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

  // Fade photos in once loaded (or immediately if already cached), so the
  // inline LQIP blur behind them is only visible for a moment on cold load.
  function hydratePhotos(root) {
    root.querySelectorAll("img.card-photo, img.hero-photo").forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add("loaded");
      } else {
        const done = () => img.classList.add("loaded");
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
  }

  // Photographic hero banner used at the top of category and detail views.
  function heroHtml(category, title, eyebrow) {
    const blur = (typeof MEAT_PHOTO_BLUR !== "undefined" && MEAT_PHOTO_BLUR[category.id]) || "";
    return `
      <div class="hero" style="background-image:url('${blur}');">
        <img class="hero-photo" src="${category.photo}" alt="" decoding="async">
        <div class="hero-overlay"></div>
        <div class="hero-text">
          <span class="hero-eyebrow">${renderIcon(category.icon)}${escapeHtml(eyebrow)}</span>
          <h2 class="hero-title">${escapeHtml(title)}</h2>
        </div>
      </div>
    `;
  }

  // ---------------- Views ----------------
  function renderHome() {
    applyTheme(null);
    setHeader({ title: "Meat Temp", icon: null, showBack: false });

    // Only show categories that actually have a cut matching the active filter.
    const categories = MEAT_DATA.categories.filter((cat) => cat.cuts.some(cutMatchesFilter));

    const cards = categories.map((cat) => {
      const blur = (typeof MEAT_PHOTO_BLUR !== "undefined" && MEAT_PHOTO_BLUR[cat.id]) || "";
      return `
      <div class="category-card" data-cat-id="${cat.id}" role="button" tabindex="0"
           style="--card-accent:${cat.theme.accent}; background-image:url('${blur}');">
        <img class="card-photo" src="${cat.photo}" alt="" loading="lazy" decoding="async">
        <div class="card-overlay"></div>
        <span class="card-badge">${renderIcon(cat.icon)}</span>
        <div class="card-text">
          <span class="card-name">${escapeHtml(cat.name)}</span>
          <span class="card-tagline">${escapeHtml(cat.tagline)}</span>
        </div>
      </div>`;
    }).join("");

    const heading = currentFilter === "all"
      ? "Pick a category"
      : `Categories with ${METHOD_META[currentFilter].label} guidance`;

    $view.innerHTML = `
      <div class="section-title">${escapeHtml(heading)}</div>
      ${categories.length
        ? `<div class="category-grid">${cards}</div>`
        : `<div class="empty-state">No cuts have ${escapeHtml(METHOD_META[currentFilter].label)} guidance yet. Tap "All" below to see everything.</div>`}
    `;

    hydratePhotos($view);

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

    const cuts = category.cuts.filter(cutMatchesFilter);
    const rows = cuts.map((cut) => cutRowHtml(cut, category, false)).join("");
    $view.innerHTML = `
      ${heroHtml(category, category.name, category.tagline)}
      ${cuts.length
        ? `<div class="cut-list">${rows}</div>`
        : `<div class="empty-state">No ${escapeHtml(METHOD_META[currentFilter].label)} guidance for any ${escapeHtml(category.name)} cut. Tap "All" below to see everything.</div>`}
    `;
    bindCutRows($view);
    hydratePhotos($view);
  }

  /* `showHeading` is false when the method picker above already names the
     method — repeating it verbatim inside the card just reads as a stutter. */
  function methodSectionHtml(methodKey, methodData, showHeading) {
    const meta = METHOD_META[methodKey];
    const heading = methodData.label || meta.label;
    const rows = [];
    if (methodData.temp) rows.push(`<dt>Temp</dt><dd>${escapeHtml(methodData.temp)}</dd>`);
    if (methodData.time) rows.push(`<dt>Time</dt><dd>${escapeHtml(methodData.time)}</dd>`);
    if (methodData.pull) rows.push(`<dt>Pull at</dt><dd>${escapeHtml(methodData.pull)}</dd>`);
    return `
      <div class="card">
        ${showHeading ? `<div class="card-heading">${meta.glyph}<span>${escapeHtml(heading)}</span></div>` : ""}
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

    let html = heroHtml(category, cut.name, category.name);

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

    if (availableMethods.length === 0) {
      html += `<div class="no-method-note">No cooking-method guidance recorded for this cut.</div>`;
    } else {
      // Keep the reader's own pick while they stay on this cut; otherwise
      // default to whatever the bottom filter is set to, if this cut has it.
      const keepChoice = detailMethod.cutId === cut.id && availableMethods.includes(detailMethod.method);
      const selected = keepChoice
        ? detailMethod.method
        : (availableMethods.includes(currentFilter) ? currentFilter : availableMethods[0]);
      detailMethod = { cutId: cut.id, method: selected };

      // A single-option <select> would be a dead control, so only show the
      // picker when there's actually a choice to make.
      if (availableMethods.length > 1) {
        const options = availableMethods.map((m) => {
          const label = cut.methods[m].label || METHOD_META[m].label;
          return `<option value="${m}"${m === selected ? " selected" : ""}>${escapeHtml(label)}</option>`;
        }).join("");
        html += `
          <div class="method-picker">
            <label class="method-picker-label" for="methodSelect">Cooking method</label>
            <div class="select-wrap">
              <select id="methodSelect" class="method-select" aria-label="Cooking method">${options}</select>
              <svg viewBox="0 0 24 24" class="select-chevron" aria-hidden="true"><path d="M6 9 L12 15 L18 9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
        `;
      }
      html += `<div id="methodSection"></div>`;
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
    hydratePhotos($view);

    // Swap only the guidance block when the method changes, so the hero and
    // the temperature cards above it don't flicker or lose scroll position.
    const $section = document.getElementById("methodSection");
    if ($section) {
      const paint = (method) => {
        detailMethod = { cutId: cut.id, method: method };
        $section.innerHTML = methodSectionHtml(method, cut.methods[method], availableMethods.length === 1);
      };
      paint(detailMethod.method);
      const $select = document.getElementById("methodSelect");
      if ($select) $select.addEventListener("change", () => paint($select.value));
    }
  }

  function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    let html = "";

    if (!q) {
      html = `<div class="empty-state">Start typing to search every cut across all categories — e.g. "brisket", "chicken breast", "salmon".</div>`;
    } else {
      const matches = allCutsFlat().filter(({ cut, category }) =>
        cutMatchesFilter(cut) &&
        (cut.name.toLowerCase().includes(q) || category.name.toLowerCase().includes(q))
      );
      if (matches.length === 0) {
        const suffix = currentFilter === "all"
          ? ""
          : ` with ${METHOD_META[currentFilter].label} guidance`;
        html = `<div class="empty-state">No matches for "${escapeHtml(query)}"${escapeHtml(suffix)}. Try a shorter or different term.</div>`;
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

    // Changing the filter is an explicit request for that method, so let it
    // override whatever the detail dropdown was last set to.
    detailMethod = { cutId: null, method: null };

    if (inSearchMode) {
      renderSearchResults($searchInput.value);
    } else {
      route(location.hash);
    }
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
