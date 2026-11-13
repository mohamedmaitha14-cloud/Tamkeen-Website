(() => {
  "use strict";
  const courses = [
    ...(window.COURSES || []),
    ...(window.TAMKEEN_CATALOG || []).map((c) => ({
      slug: "catalog-" + c.catalog_id,
      title: c.title_en || c.title,
      category: (c.departments || []).join(", ") || c.category,
      price: c.price ?? 0,
      image: c.image,
      duration: "Online · Dubai · Ajman",
      local_page: "course-details.html?catalog=" + c.catalog_id,
    })),
  ];
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const page = document.body.dataset.page;
  $$("[data-nav]").forEach((a) => {
    if (a.dataset.nav === (page === "index" ? "home" : page))
      a.classList.add("active");
  });
  const getSaved = () => {
    try {
      return JSON.parse(localStorage.getItem("tamkeenBlueSaved") || "[]");
    } catch {
      return [];
    }
  };
  const save = (arr) => {
    localStorage.setItem("tamkeenBlueSaved", JSON.stringify(arr));
    renderCart();
  };
  const href = (c) =>
    c.local_page || "course-details.html?course=" + encodeURIComponent(c.slug);
  const cartQtyKey = "tamkeenBlueCartQty";
  const getQty = () => {
    try {
      return JSON.parse(localStorage.getItem(cartQtyKey) || "{}");
    } catch {
      return {};
    }
  };
  const money = (n) =>
    "AED " +
    n.toLocaleString("en-AE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const priceOf = (c) =>
    Number(String(c.price || "").replace(/[^0-9.]/g, "")) || 0;
  const esc = (t) =>
    String(t || "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  function renderCart() {
    const ids = getSaved().filter((id) => courses.some((c) => c.slug === id));
    const qty = getQty();
    const count = ids.reduce(
      (n, id) => n + Math.max(1, Number(qty[id]) || 1),
      0,
    );
    const total = ids.reduce((n, id) => {
      const c = courses.find((x) => x.slug === id);
      return n + priceOf(c) * Math.max(1, Number(qty[id]) || 1);
    }, 0);
    if ($("#cartCount")) $("#cartCount").textContent = count;
    if ($("#cartHeadingCount"))
      $("#cartHeadingCount").textContent = `(items: ${count})`;
    if ($("#cartSubtotal")) $("#cartSubtotal").textContent = money(total);
    const el = $("#cartItems");
    if (el)
      el.innerHTML = ids.length
        ? ids
            .map((id) => {
              const c = courses.find((x) => x.slug === id),
                q = Math.max(1, Number(qty[id]) || 1);
              return `<div class="cart-product"><a href="${href(c)}" class="cart-product-image"><img src="${esc(c.image)}" alt="${esc(c.title)}" loading="lazy"></a><div class="cart-product-main"><a class="cart-product-title" href="${href(c)}">${esc(c.title)}</a><span class="cart-product-category">${esc(c.category)}</span><div class="cart-product-controls"><div class="cart-qty"><button data-qty-action="minus" data-qty-id="${encodeURIComponent(id)}" aria-label="Decrease quantity of ${esc(c.title)}">−</button><span>${q}</span><button data-qty-action="plus" data-qty-id="${encodeURIComponent(id)}" aria-label="Increase quantity of ${esc(c.title)}">+</button></div><button class="cart-remove" data-remove="${encodeURIComponent(id)}" aria-label="Remove ${esc(c.title)}" title="Remove">♧</button></div></div><div class="cart-product-price">${priceOf(c) ? money(priceOf(c) * q) : "Price on request"}</div></div>`;
            })
            .join("")
        : '<div class="cart-empty"><strong>Your cart is empty</strong><p>Explore training programs and add courses to your cart.</p><a href="programs.html">Browse programs ↗</a></div>';
    const checkoutItems = $("#checkoutCartItems");
    if (checkoutItems && el) checkoutItems.innerHTML = el.innerHTML;
    const reviewSubtotal = $("#checkoutReviewSubtotal");
    if (reviewSubtotal) reviewSubtotal.textContent = money(total);
    $$("[data-remove]").forEach(
      (b) =>
        (b.onclick = () =>
          save(
            getSaved().filter(
              (x) => x !== decodeURIComponent(b.dataset.remove),
            ),
          )),
    );
    $$("[data-qty-action]").forEach(
      (b) =>
        (b.onclick = () => {
          const id = decodeURIComponent(b.dataset.qtyId),
            obj = getQty(),
            v = Math.max(1, Number(obj[id]) || 1);
          obj[id] =
            b.dataset.qtyAction === "plus"
              ? Math.min(99, v + 1)
              : Math.max(1, v - 1);
          localStorage.setItem(cartQtyKey, JSON.stringify(obj));
          renderCart();
        }),
    );
    const summary = $("#cartPageSummary");
    if (summary)
      summary.innerHTML = `<strong>${count} course${count === 1 ? "" : "s"}</strong><strong>${money(total)}</strong>`;
    const checkout = $("#checkoutSummary");
    if (checkout)
      checkout.innerHTML = ids.length
        ? ids
            .map((id) => {
              const c = courses.find((x) => x.slug === id);
              return `<div class="checkout-line"><span>${esc(c.title)} × ${Math.max(1, Number(qty[id]) || 1)}</span><strong>${priceOf(c) ? money(priceOf(c) * Math.max(1, Number(qty[id]) || 1)) : "Price on request"}</strong></div>`;
            })
            .join("") +
          `<div class="checkout-line checkout-grand"><span>Estimated subtotal</span><strong>${money(total)}</strong></div>`
        : '<p>Your cart is empty. <a href="programs.html">Browse programs</a></p>';
  }
  window.TamkeenRefreshCart = renderCart;
  renderCart();
  $("#menuBtn")?.addEventListener("click", () =>
    $("#mobileMenu").classList.toggle("open"),
  );
  $("#searchBtn")?.addEventListener("click", () => {
    $("#searchLayer").classList.add("open");
    $("#searchLayer").setAttribute("aria-hidden", "false");
    $("#globalSearch").focus();
  });
  $("#closeSearch")?.addEventListener("click", () => {
    $("#searchLayer").classList.remove("open");
    $("#searchLayer").setAttribute("aria-hidden", "true");
  });
  $("#cartBtn")?.addEventListener("click", () => {
    $("#cartDrawer").classList.add("open");
    $("#cartOverlay")?.classList.add("open");
  });
  $("#closeCart")?.addEventListener("click", () => {
    $("#cartDrawer").classList.remove("open");
    $("#cartOverlay")?.classList.remove("open");
  });
  $("#cartOverlay")?.addEventListener("click", () => {
    $("#cartDrawer").classList.remove("open");
    $("#cartOverlay").classList.remove("open");
  });
  function courseRow(c) {
    return `<a class="search-result" href="${href(c)}"><span>${c.category}</span><strong>${c.title}</strong><b>↗</b></a>`;
  }
  $("#globalSearch")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    $("#searchResults").innerHTML = q
      ? courses
          .filter((c) => (c.title + " " + c.category).toLowerCase().includes(q))
          .slice(0, 6)
          .map(courseRow)
          .join("") || "<p>No matching programs found.</p>"
      : "";
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      $("#searchLayer")?.classList.remove("open");
      $("#cartDrawer")?.classList.remove("open");
      $("#cartOverlay")?.classList.remove("open");
      $("#mobileMenu")?.classList.remove("open");
    }
  });
  const feature = $("#featuredCourses");
  if (feature)
    feature.innerHTML = courses
      .slice(0, 3)
      .map(
        (c, i) =>
          `<a href="${href(c)}" class="feature-row"><span class="feature-num">0${i + 1}</span><span class="feature-name">${c.title}<small>${c.category}</small></span><span class="feature-img" style="background-image:url('${c.image}')"></span><span class="feature-go">↗</span></a>`,
      )
      .join("");
  const gallery = $("#courseGallery");
  if (gallery) {
    let category =
      new URLSearchParams(location.search).get("category") || "All";
    let query = "";
    const cats = ["All", ...new Set(courses.map((c) => c.category))];
    function render() {
      let filtered = courses.filter(
        (c) =>
          (category === "All" || c.category === category) &&
          (c.title + " " + c.category).toLowerCase().includes(query),
      );
      $("#filters").innerHTML = cats
        .map(
          (c) =>
            `<button class="filter ${category === c ? "selected" : ""}" data-category="${encodeURIComponent(c)}">${c}</button>`,
        )
        .join("");
      $$("[data-category]").forEach(
        (b) =>
          (b.onclick = () => {
            category = decodeURIComponent(b.dataset.category);
            render();
          }),
      );
      $("#resultCount").textContent = `${filtered.length} programs to discover`;
      gallery.innerHTML =
        filtered
          .map(
            (c, i) =>
              `<a class="course-tile" href="${href(c)}"><div class="tile-image"><img src="${c.image}" alt="Professional learning environment" loading="lazy"><span class="tile-index">${String(i + 1).padStart(2, "0")}</span></div><div class="tile-copy"><span>${c.category}</span><h3>${c.title}</h3><p>${c.duration} · AED ${c.price}</p><b>EXPLORE ↗</b></div></a>`,
          )
          .join("") || "<p>No programs match your search.</p>";
    }
    $("#courseSearch").addEventListener("input", (e) => {
      query = e.target.value.toLowerCase().trim();
      render();
    });
    render();
  }
  if (page === "course-details" && $("#detailPhoto")) {
    let slug = new URLSearchParams(location.search).get("course");
    let c = courses.find((x) => x.slug === slug) || courses[0];
    if (c) {
      $("#detailPhoto").style.backgroundImage = `url('${c.image}')`;
      $("#detailCategory").textContent = c.category;
      $("#detailTitle").textContent = c.title;
      $("#detailDesc").textContent = c.desc;
      $("#detailPrice").textContent = "AED " + c.price;
      $("#detailDuration").textContent = c.duration;
      $("#officialCourse").href = c.url;
      $("#saveCourse").onclick = () => {
        let ids = getSaved();
        if (!ids.includes(c.slug)) save([...ids, c.slug]);
        $("#saveCourse").textContent = "Saved ✓";
      };
    }
  }
  $$(".demo-form").forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.querySelector(".form-feedback").textContent =
        "Preview only — no information was submitted. Please use the Tamkeen team.";
    }),
  );
  $$("[data-placeholder]").forEach(
    (a) =>
      (a.onclick = (e) => {
        e.preventDefault();
        alert(a.dataset.placeholder);
      }),
  );
  const obs = new IntersectionObserver(
    (entries) =>
      entries.forEach((x) => {
        if (x.isIntersecting) {
          x.target.classList.add("in-view");
          obs.unobserve(x.target);
        }
      }),
    { threshold: 0.08 },
  );
  $$(
    ".intro-text,.intro-photo,.pathway-title,.shape,.showcase-copy,.spotlight-heading,.feature-row,.course-tile,.story-quote,.story-collage,.catalog-intro",
  ).forEach((el) => obs.observe(el));
})();
// Keep the active page highlighted, including the new Departments page.
(() => {
  const page = location.pathname.split("/").pop() || "index.html";
  const current =
    page === "index.html"
      ? "home"
      : page === "about.html"
        ? "about"
        : page === "programs.html" || page === "course-details.html"
          ? "programs"
          : page === "certificate.html"
            ? "certificate"
            : "";
  document.querySelectorAll(".main-nav a[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === current);
  });
  document
    .querySelectorAll(".mobile-menu a")
    .forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === page),
    );
  const menu = document.getElementById("menuBtn");
  if (menu)
    menu.addEventListener("click", () =>
      menu.setAttribute(
        "aria-expanded",
        String(
          document.getElementById("mobileMenu")?.classList.contains("open") ||
            false,
        ),
      ),
    );
})();

/* Reference-style drawer controls */
(() => {
  const drawer = document.getElementById("mobileMenu"),
    backdrop = document.getElementById("menuBackdrop"),
    btn = document.getElementById("menuBtn");
  if (!drawer) return;
  const sync = () => {
    const open = drawer.classList.contains("open");
    backdrop?.classList.toggle("open", open);
    document.body.classList.toggle("drawer-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    btn?.setAttribute("aria-expanded", String(open));
    if (open) document.getElementById("menuClose")?.focus();
  };
  btn?.addEventListener("click", () => requestAnimationFrame(sync));
  document.getElementById("menuClose")?.addEventListener("click", () => {
    drawer.classList.remove("open");
    sync();
    btn?.focus();
  });
  backdrop?.addEventListener("click", () => {
    drawer.classList.remove("open");
    sync();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      drawer.classList.remove("open");
      sync();
    }
  });
  const page = location.pathname.split("/").pop() || "index.html";
  drawer.querySelectorAll("[data-menu-page]").forEach((a) => {
    const h = a.getAttribute("href");
    if (h === page || (page === "course-details.html" && h === "programs.html"))
      a.classList.add("active");
  });
  document
    .getElementById("drawerSearchForm")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = document.getElementById("drawerSearchInput").value.trim();
      drawer.classList.remove("open");
      sync();
      document.getElementById("searchBtn")?.click();
      const inp = document.getElementById("globalSearch");
      if (inp) {
        inp.value = query;
        inp.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  drawer.querySelector("[data-drawer-cart]")?.addEventListener("click", (e) => {
    e.preventDefault();
    drawer.classList.remove("open");
    sync();
    document.getElementById("cartBtn")?.click();
  });
  drawer.querySelectorAll("[data-lang]").forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.lang === "ar")
        alert("Arabic version is not available in this prototype yet.");
      else
        drawer
          .querySelectorAll("[data-lang]")
          .forEach((x) => x.classList.toggle("selected", x === b));
    }),
  );
})();

/* Add-to-cart controls on each internal course page */
(() => {
  document.querySelectorAll("[data-add-course]").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.addCourse;
      let ids;
      try {
        ids = JSON.parse(localStorage.getItem("tamkeenBlueSaved") || "[]");
      } catch {
        ids = [];
      }
      if (!ids.includes(id)) ids.push(id);
      localStorage.setItem("tamkeenBlueSaved", JSON.stringify(ids));
      b.textContent = "Added to cart ✓";
      document.getElementById("cartBtn")?.click();
      location.hash = "";
    }),
  );
})();

/* Local checkout form: validates fields without collecting or sending personal data. */
(() => {
  const form = document.getElementById("tamkeenCheckoutForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const feedback = document.getElementById("checkoutFeedback");
    feedback.classList.remove("error");
    if (!form.reportValidity()) {
      feedback.textContent =
        "Please complete the required fields and acknowledge the prototype notice.";
      feedback.classList.add("error");
      return;
    }
    feedback.textContent =
      "Your details are complete for this preview. No enquiry, enrollment, or payment has been sent. Please contact Tamkeen to complete registration.";
  });
})();
