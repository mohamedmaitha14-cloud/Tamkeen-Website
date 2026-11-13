(() => {
  "use strict";
  const catalog = window.TAMKEEN_CATALOG || [];
  const rawId = new URLSearchParams(location.search).get("catalog");
  const id = rawId !== null && /^\d+$/.test(rawId) ? Number(rawId) : null;
  const x =
    id !== null ? catalog.find((course) => course.catalog_id === id) : null;
  const $ = (id) => document.getElementById(id);
  const set = (id, value) => {
    if ($(id)) $(id).textContent = value || "";
  };
  if (!x) {
    set("cdTitle", "Program not found");
    return;
  }
  const name = x.title_en || x.title;
  document.title = name + " | Tamkeen Training";
  set("cdTitle", name);
  set("cdShortTitle", name);
  set(
    "cdIntro",
    x.description_en ||
      x.description ||
      "Explore the skills, learning opportunities and details of this training program.",
  );
  set(
    "cdOverview",
    x.description_en ||
      x.description ||
      "Discover " +
        name +
        ". For the full current syllabus, please contact our training team.",
  );
  const departments = x.departments || [x.category];
  set("cdFactCategory", departments.join(", "));
  for (const target of ["dvDepartments", "dvSideTags"])
    departments.forEach((d) => {
      const b = document.createElement("span");
      b.textContent = d;
      $(target).append(b);
    });
  const price =
    x.price != null
      ? Number(x.price).toLocaleString("en-AE") + " AED"
      : "Price on request";
  set("cdPrice", price);
  set("dvSidePrice", price);
  const bookingImage = $("dvBookingImage");
  if (bookingImage) {
    bookingImage.src = x.image || "";
    bookingImage.alt = name + " course image";
    bookingImage.onerror = () => {
      bookingImage.style.display = "none";
    };
  }
  const image = $("cdImage");
  if (x.image) {
    image.src = x.image;
    image.alt = name + " course illustration";
    image.onerror = () => {
      image.style.display = "none";
      image.parentElement.style.background =
        "linear-gradient(135deg,#1a3d63,#4a7fa7)";
    };
  } else {
    image.style.display = "none";
  }
  const statusMap = window.TAMKEEN_USER_STATUS_MAP?.[String(x.catalog_id)];
  const normalizeTitle = (v) =>
    String(v || "")
      .toLowerCase()
      .normalize("NFKC")
      .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
      .trim();
  const findNamed = (source, key) => {
    if (!source || !key) return null;
    if (source[key]) return source[key];
    const nk = normalizeTitle(key);
    const match = Object.keys(source).find((k) => normalizeTitle(k) === nk);
    return match ? source[match] : null;
  };
  const lookupKeys = [
    name,
    x.title,
    x.title_en,
    x.url,
    x.source_url,
    x.original_url,
    statusMap?.key,
    statusMap?.fallback,
  ].filter(Boolean);
  const lookup = (source) => {
    for (const key of lookupKeys) {
      const found = findNamed(source, key);
      if (found) return found;
    }
    return null;
  };
  // Prefer previously sourced course information; never hide content merely because a review status says Yes.
  // Stable-ID mapping for the seven specifically requested courses. Other course lookups are untouched.
  const sevenSourceKeys = {
    1: "Using Artificial Intelligence in Cybersecurity",
    22: "AI-Powered Healthcare and Quality Management",
    24: "AI-Powered Hospital Management",
    17: "Project Management Using Artificial Intelligence",
    26: "AI-Powered Procurement Management",
    29: "Sustainability and Digital Transformation",
  };
  const sevenDetail = Object.prototype.hasOwnProperty.call(
    sevenSourceKeys,
    x.catalog_id,
  )
    ? window.TAMKEEN_USER_URL_DETAILS?.[sevenSourceKeys[x.catalog_id]]
    : null;
  const detail =
    sevenDetail ||
    lookup(window.TAMKEEN_USER_URL_DETAILS) ||
    lookup(window.TAMKEEN_VERIFIED_DETAILS) ||
    window.TAMKEEN_ADDITIONAL_SOURCED_DETAILS?.[String(x.catalog_id)] ||
    lookup(window.TAMKEEN_EDITORIAL_PREVIEWS) ||
    null;
  if (detail?.language) set("dvHeroLanguage", detail.language);
  if (detail?.editorial_draft) {
    set(
      "cdIntro",
      "Course-specific editorial preview — course syllabus pending verification.",
    );
    set("cdOverview", detail.overview);
  }
  const ai = name.toLowerCase() === "advanced artificial intelligence";
  if (ai) {
    set(
      "cdIntro",
      "Build, customise and deploy advanced AI systems, from deep learning and transformers to practical applications.",
    );
    set("dvLanguage", "Arabic & English");
    set("dvHeroLanguage", "Arabic & English");
    set(
      "cdOverview",
      "This 100-hour advanced training program covers deep neural networks, computer vision, time-series models, transformers, large language models, fine-tuning, retrieval-augmented generation, generative AI, reinforcement learning, model deployment, ethics and an applied AI project.",
    );
    set("cdPrice", "3,200 AED");
    set("dvSidePrice", "3,200 AED");
    set("dvOldPrice", "Previously 5,000 AED");
  }
  const container = $("dvSections");
  const block = (id, kicker, title) => {
    const section = document.createElement("section");
    section.className = "dv-section";
    section.id = id;
    section.innerHTML = '<span class="dv-section-kicker"></span><h2></h2>';
    section.querySelector("span").textContent = kicker;
    section.querySelector("h2").textContent = title;
    container.append(section);
    return section;
  };
  const list = (s, arr) => {
    const ul = document.createElement("ul");
    ul.className = "dv-list";
    arr.forEach((v) => {
      const li = document.createElement("li");
      li.textContent = v;
      ul.append(li);
    });
    s.append(ul);
  };
  const aiTopics = [
    [
      "Neural networks and deep learning",
      [
        "Perceptrons and activation functions",
        "Backpropagation and optimisation",
        "Overfitting and regularisation",
        "Build a deep network with PyTorch",
      ],
    ],
    [
      "Convolutional networks and computer vision",
      [
        "Convolution and pooling",
        "Transfer learning",
        "Image classification, detection and segmentation",
        "Object detection exercise",
      ],
    ],
    [
      "Recurrent networks and time series",
      [
        "Recurrent networks and LSTM",
        "Time-series forecasting",
        "Limitations of recurrent models",
        "Forecasting exercise",
      ],
    ],
    [
      "Transformers and attention",
      [
        "Attention mechanisms",
        "Encoder and decoder",
        "Embeddings and tokenisation",
        "Transformer applications",
      ],
    ],
    [
      "Large language models and prompting",
      [
        "Language model training",
        "Prompt engineering methods",
        "Tool calling and structured outputs",
        "Evaluation and hallucination reduction",
      ],
    ],
    [
      "Fine-tuning language models",
      [
        "Fine-tuning versus prompting",
        "LoRA and QLoRA",
        "Training data preparation",
        "Arabic fine-tuning exercise",
      ],
    ],
    [
      "Retrieval-augmented generation",
      [
        "Organisational knowledge retrieval",
        "Chunking, embeddings and vector databases",
        "Retrieval and re-ranking",
        "Document-grounded assistant exercise",
      ],
    ],
    [
      "Generative models for images and audio",
      [
        "Diffusion models",
        "Image generation and control",
        "Audio and speech generation",
        "Rights and responsible use",
      ],
    ],
    [
      "Reinforcement learning",
      [
        "Agents, environments and rewards",
        "Core algorithms",
        "Optimisation and control",
        "Learning from human feedback",
      ],
    ],
    [
      "Deployment and MLOps",
      [
        "Serving models with APIs",
        "Containers and cloud deployment",
        "Monitoring and model drift",
        "Versioning and retraining",
      ],
    ],
    [
      "Ethics, safety and privacy",
      [
        "Bias and fairness",
        "Privacy and sensitive data",
        "Adversarial safety",
        "UAE and international frameworks",
      ],
    ],
    [
      "Integrated AI project",
      [
        "Choose a real-world problem",
        "Develop and evaluate a model",
        "Deploy a working service",
        "Present and evaluate the solution",
      ],
    ],
  ];
  const topics = ai
    ? aiTopics
    : detail?.topicDetails?.length
      ? detail.topicDetails
      : (detail?.topics || []).map((t) => [t, []]);
  if (topics.length) {
    const s = block("dv-topics", "WHAT YOU WILL LEARN", "Training topics");
    const p = document.createElement("p");
    p.textContent =
      topics.length + " learning modules · Select a topic to explore";
    s.append(p);
    topics.forEach(([title, items], i) => {
      const d = document.createElement("details");
      d.className = "dv-topic";
      if (i === 0) d.open = true;
      const summary = document.createElement("summary");
      const num = document.createElement("span");
      num.className = "dv-number";
      num.textContent = String(i + 1).padStart(2, "0");
      const txt = document.createElement("span");
      txt.textContent = title;
      const plus = document.createElement("span");
      plus.className = "dv-plus";
      plus.textContent = "+";
      summary.append(num, txt, plus);
      d.append(summary);
      if (items.length) {
        const body = document.createElement("div");
        body.className = "dv-topic-body";
        const ul = document.createElement("ul");
        items.forEach((v) => {
          const li = document.createElement("li");
          li.textContent = v;
          ul.append(li);
        });
        body.append(ul);
        d.append(body);
      }
      s.append(d);
    });
  } else {
    const s = block("dv-topics", "TRAINING CONTENT", "Training topics");
    const p = document.createElement("p");
    p.textContent =
      "The detailed curriculum for this course is being verified. Please enquire for the latest outline.";
    s.append(p);
  }
  const objectives = detail?.objectives || [];
  {
    const s = block("dv-objectives", "LEARNING GOALS", "Program objectives");
    if (objectives.length) list(s, objectives);
    else {
      const p = document.createElement("p");
      p.textContent =
        "Course-specific objectives are being confirmed. Contact our team for the learning objectives.";
      s.append(p);
    }
  }
  const outcomes = detail?.outcomes || [];
  if (outcomes.length) {
    const s = block("dv-outcomes", "YOUR NEXT STEP", "What you will gain");
    list(s, outcomes);
  }
  const audience = detail?.audience || [];
  {
    const s = block("dv-audience", "WHO SHOULD JOIN", "Who is it for?");
    if (audience.length) list(s, audience);
    else {
      const p = document.createElement("p");
      p.textContent =
        "Eligibility and intended audience for this course are being confirmed. Please enquire for guidance.";
      s.append(p);
    }
  }
  const cert = [
    "Tamkeen Training Centre certificate",
    "Dubai branch certificate",
    "Cambridge College certificate",
    "Cambridge College membership card",
  ];
  {
    const s = block("dv-certificates", "RECOGNITION", "Certificates");
    if (cert.length) list(s, cert);
    else {
      const p = document.createElement("p");
      p.textContent =
        "Certificate types and requirements for this course are being confirmed. Please enquire for details.";
      s.append(p);
    }
  }
  {
    const s = block("dv-faq", "COMMON QUESTIONS", "Frequently asked questions");
    const faqEntries = detail?.faq?.length
      ? detail.faq
      : window.TAMKEEN_FAQ_SUPPLEMENTS?.[name] || [];
    if (faqEntries.length) {
      faqEntries.forEach(([q, a]) => {
        const d = document.createElement("details");
        d.className = "dv-faq";
        const summary = document.createElement("summary");
        summary.textContent = q + "  +";
        const p = document.createElement("p");
        p.textContent = a;
        d.append(summary, p);
        s.append(d);
      });
    } else {
      const questions = [
        [
          "How can I enrol in this program?",
          "Select Book Now to continue to checkout, or use Inquiry to contact our team.",
        ],
        [
          "Where can I attend this program?",
          "Online and in-person learning options are listed for this program. Contact our team to confirm the next available session and location.",
        ],
        [
          "How can I confirm the full curriculum and certificate details?",
          "Use the Inquiry button to request the latest course outline and certificate requirements.",
        ],
      ];
      questions.forEach(([q, a]) => {
        const d = document.createElement("details");
        d.className = "dv-faq";
        const summary = document.createElement("summary");
        summary.textContent = q + "  +";
        const p = document.createElement("p");
        p.textContent = a;
        d.append(summary, p);
        s.append(d);
      });
    }
  }
  const links = [...document.querySelectorAll(".dv-tabs a")];
  links.forEach((a) => {
    if (!document.querySelector(a.getAttribute("href"))) a.remove();
    else
      a.addEventListener("click", () => {
        links.forEach((l) => l.classList.remove("active"));
        a.classList.add("active");
      });
  });
  if (links[0]) links[0].classList.add("active");
  const enquiry = "contact.html?program=" + encodeURIComponent(name);
  for (const linkId of ["cdOfficial", "dvBottomButton"]) {
    if ($(linkId)) $(linkId).href = enquiry;
  }
  if ($("dvBook")) $("dvBook").href = "checkout.html";
  const book = $("dvBookNow");
  if (book) {
    book.addEventListener("click", (event) => {
      event.preventDefault();
      const slug = "catalog-" + x.catalog_id;
      let ids = [];
      try {
        ids = JSON.parse(localStorage.getItem("tamkeenBlueSaved") || "[]");
        if (!Array.isArray(ids)) ids = [];
      } catch (e) {}
      if (!ids.includes(slug)) ids.push(slug);
      localStorage.setItem("tamkeenBlueSaved", JSON.stringify(ids));
      window.location.href = "checkout.html";
    });
  }
  set(
    "cdSourceNote",
    detail?.editorial_draft
      ? "Editorial course preview, not an course syllabus. Confirm the curriculum with the training team."
      : detail
        ? "Program information based on the available course description. Confirm current enrollment terms with our team."
        : "Detailed course information is being verified. Contact our team for the latest syllabus.",
  );
})();
