(() => {
  "use strict";
  const all = window.TAMKEEN_CATALOG || [];
  const q = document.getElementById("tc-search"),
    cat = document.getElementById("tc-category"),
    dept = document.getElementById("tc-department"),
    location = document.getElementById("tc-location"),
    budget = document.getElementById("tc-budget"),
    sort = document.getElementById("tc-sort"),
    grid = document.getElementById("tc-grid"),
    pages = document.getElementById("tc-pages"),
    count = document.getElementById("tc-count");
  if (!grid) return;
  const escape = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const fmt = (n) => Number(n).toLocaleString("en-AE") + " AED";
  const cats = [...new Set(all.map((x) => x.category))].sort();
  const departments = [
    "Languages",
    "Financial",
    "Human Resources",
    "Graphics and Design",
    "Psychology",
    "Technical",
    "AI",
    "Marketing",
    "Educational",
    "Management",
    "Law",
  ];
  function buildMulti(container, values) {
    values.forEach((value) => {
      const label = document.createElement("label");
      label.className = "tc-multi-option";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = value;
      label.append(input, document.createTextNode(value));
      container.append(label);
    });
  }
  buildMulti(cat, cats);
  buildMulti(dept, departments);
  const selected = (el) =>
    [...el.querySelectorAll("input:checked")].map((x) => x.value);
  function setSelected(el, values) {
    el.querySelectorAll("input").forEach(
      (x) => (x.checked = values.includes(x.value)),
    );
    updateMultiLabel(el);
  }
  function updateMultiLabel(el) {
    const values = selected(el),
      summary = el.parentElement.querySelector("summary");
    summary.textContent =
      values.length === 0
        ? el === cat
          ? "All categories"
          : "All departments"
        : values.length === 1
          ? values[0]
          : values.length + " selected";
    summary.title = values.join(", ");
  }
  const branches = ["Dubai", "Ajman"];
  let page = 1;
  const pageSize = 10;
  const storageKey = "tamkeen-programs-navigation-v1";
  const filterControls = { q, location, budget, sort };
  function savePosition() {
    try {
      const filters = {};
      for (const [name, el] of Object.entries(filterControls))
        filters[name] = el.value;
      filters.cat = selected(cat);
      filters.dept = selected(dept);
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          page,
          filters,
          scrollY: window.scrollY,
          time: Date.now(),
        }),
      );
    } catch (e) {}
  }
  function restorePosition() {
    try {
      const state = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (!state || Date.now() - state.time > 86400000) return null;
      for (const [name, el] of Object.entries(filterControls))
        if (typeof state.filters?.[name] === "string")
          el.value = state.filters[name];
      setSelected(
        cat,
        Array.isArray(state.filters?.cat)
          ? state.filters.cat
          : state.filters?.cat
            ? [state.filters.cat]
            : [],
      );
      setSelected(
        dept,
        Array.isArray(state.filters?.dept)
          ? state.filters.dept
          : state.filters?.dept
            ? [state.filters.dept]
            : [],
      );
      page = Number.isInteger(state.page) && state.page > 0 ? state.page : 1;
      return state;
    } catch (e) {
      return null;
    }
  }
  const params = new URLSearchParams(window.location.search);
  const hasUrlFilters =
    params.has("departments") ||
    params.has("categories") ||
    params.has("category");
  const explicitReset =
    sessionStorage.getItem("tamkeen-programs-explicit-reset") === "1";
  if (explicitReset) {
    sessionStorage.removeItem("tamkeen-programs-explicit-reset");
    sessionStorage.removeItem(storageKey);
  }
  const restored = hasUrlFilters || explicitReset ? null : restorePosition();
  if (hasUrlFilters) {
    const split = (k) =>
      (params.get(k) || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    setSelected(dept, split("departments"));
    setSelected(cat, split("categories").concat(split("category")));
    page = 1;
  }
  window.addEventListener("pagehide", savePosition);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      const reset =
        sessionStorage.getItem("tamkeen-programs-explicit-reset") === "1";
      if (reset) {
        sessionStorage.removeItem("tamkeen-programs-explicit-reset");
        sessionStorage.removeItem(storageKey);
        q.value = "";
        setSelected(cat, []);
        setSelected(dept, []);
        location.value = "";
        budget.value = "";
        sort.value = "default";
        page = 1;
        render();
        window.scrollTo(0, 0);
        return;
      }
      const state = restorePosition();
      if (state) {
        render();
        window.scrollTo(0, state.scrollY || 0);
      }
    }
  });
  function button(label, n, active = false, disabled = false) {
    const b = document.createElement("button");
    b.textContent = label;
    b.disabled = disabled;
    if (active) b.setAttribute("aria-current", "page");
    b.addEventListener("click", () => {
      page = n;
      render();
      savePosition();
      document
        .querySelector(".tc-result-head")
        ?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
    return b;
  }
  function render() {
    const term = q.value.trim().toLocaleLowerCase();
    let found = all.filter(
      (x) =>
        (!term ||
          (x.title_en + " " + x.title + " " + x.category)
            .toLocaleLowerCase()
            .includes(term)) &&
        (!selected(cat).length || selected(cat).includes(x.category)) &&
        (!selected(dept).length ||
          selected(dept).some((d) => (x.departments || []).includes(d))) &&
        (!location.value ||
          (location.value === "Online"
            ? x.online === true
            : branches.includes(location.value))) &&
        (!budget.value || x.price === null || x.price <= Number(budget.value)),
    );
    if (budget.value) found = found.filter((x) => x.price !== null);
    if (sort.value === "az")
      found.sort((a, b) =>
        (a.title_en || a.title).localeCompare(b.title_en || b.title),
      );
    if (sort.value === "price")
      found.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    const total = Math.max(1, Math.ceil(found.length / pageSize));
    page = Math.min(page, total);
    const start = (page - 1) * pageSize;
    count.textContent =
      found.length +
      " programs · showing " +
      (found.length ? start + 1 : 0) +
      "–" +
      Math.min(start + pageSize, found.length);
    grid.innerHTML = found.length
      ? found
          .slice(start, start + pageSize)
          .map((x) => {
            const url = [1, 22, 24, 17, 26, 29, 4].includes(
              Number(x.catalog_id),
            )
              ? "course-featured-" + x.catalog_id + ".html"
              : "course-details.html?catalog=" +
                encodeURIComponent(x.catalog_id);
            const safe = /^(https:\/\/|[\w-]+\.html(?:\?.*)?$)/.test(url)
              ? url
              : "contact.html";
            const image =
              x.image && /^(https:\/\/|assets\/|images\/)/.test(x.image)
                ? `<img src="${escape(x.image)}" alt="${escape(x.title_en || x.title)} course illustration" loading="lazy" onerror="this.style.display='none'">`
                : '<span class="tc-symbol" aria-hidden="true">✳</span>';
            return `<article class="tc-card"><div class="tc-image">${image}</div><div class="tc-card-body"><div class="tc-dept-badges">${(x.departments || []).map((d) => `<span class="tc-dept-badge">${escape(d)}</span>`).join("")}</div><h3 dir="auto">${escape(x.title_en || x.title)}</h3><div class="tc-card-meta"><span class="tc-meta-item"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20V9l6-4 6 4v11M15 20V6l6-3v17M6 12h1m-1 4h1m5-4h1m-1 4h1m6-8h1m-1 4h1"/></svg>Dubai · Ajman</span>${x.online === true ? '<span class="tc-meta-item">◉ Online</span>' : ""}</div><div class="tc-price">${x.price !== null ? fmt(x.price) : "Price on request"}${x.original && x.original > x.price ? ` <del>${fmt(x.original)}</del>` : ""}</div><div class="tc-actions"><a href="${escape(safe)}" ${safe.startsWith("https://") ? 'target="_blank" rel="noopener noreferrer"' : ""}>View program ↗</a><button type="button" class="tc-add-cart" data-catalog-add="${escape(x.catalog_id)}" aria-label="Add ${escape(x.title_en || x.title)} to cart">Add to Cart <span aria-hidden="true">＋</span></button></div></div></article>`;
          })
          .join("")
      : '<div class="tc-empty"><h3>No matching programs</h3><p>Try a different search or reset the filters.</p></div>';
    pages.replaceChildren();
    if (total > 1) {
      pages.append(button("← Previous", page - 1, false, page === 1));
      const visible = new Set([1, total]);
      if (page <= 3) {
        for (let i = 1; i <= Math.min(3, total); i++) visible.add(i);
      } else if (page >= total - 2) {
        for (let i = Math.max(1, total - 2); i <= total; i++) visible.add(i);
      } else {
        for (let i = page - 1; i <= page + 1; i++) visible.add(i);
      }
      let previous = 0;
      for (const i of [...visible].sort((a, b) => a - b)) {
        if (i - previous > 1) {
          const dots = document.createElement("span");
          dots.className = "tc-page-ellipsis";
          dots.textContent = "…";
          dots.setAttribute("aria-hidden", "true");
          pages.append(dots);
        }
        pages.append(button(String(i), i, i === page));
        previous = i;
      }
      pages.append(button("Next →", page + 1, false, page === total));
    }
  }
  [q, location, budget, sort].forEach((el) =>
    el.addEventListener(el === q ? "input" : "change", () => {
      page = 1;
      render();
      savePosition();
    }),
  );
  [cat, dept].forEach((el) =>
    el.addEventListener("change", () => {
      updateMultiLabel(el);
      page = 1;
      render();
      savePosition();
    }),
  );
  document.getElementById("tc-reset").addEventListener("click", () => {
    q.value = "";
    setSelected(cat, []);
    setSelected(dept, []);
    location.value = "";
    budget.value = "";
    sort.value = "default";
    page = 1;
    render();
    savePosition();
  });
  render();
  if (restored) {
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        window.scrollTo({ top: restored.scrollY || 0, behavior: "instant" }),
      ),
    );
  }
  grid.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-catalog-add]");
    if (btn) {
      const id = "catalog-" + btn.dataset.catalogAdd;
      let ids = [];
      try {
        ids = JSON.parse(localStorage.getItem("tamkeenBlueSaved") || "[]");
        if (!Array.isArray(ids)) ids = [];
      } catch (e) {}
      if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem("tamkeenBlueSaved", JSON.stringify(ids));
      }
      window.TamkeenRefreshCart?.();
      document.getElementById("cartBtn")?.click();
      btn.innerHTML = "Added to Cart ✓";
      return;
    }
    if (event.target.closest("a[href]")) savePosition();
  });
})();
