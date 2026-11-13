/* Tamkeen website assistant: local catalog guidance + optional secure AI backend. */
(() => {
  "use strict";
  if (document.getElementById("tamkeen-chat-launcher")) return;
  const cfg = window.TAMKEEN_CHATBOT || {};
  const courses = Array.isArray(window.TAMKEEN_CATALOG)
    ? window.TAMKEEN_CATALOG
    : [];
  const root = document.createElement("div");
  root.className = "tk-chat";
  root.innerHTML = `<button id="tamkeen-chat-launcher" class="tk-chat-launcher" aria-label="Open Tamkeen assistant" aria-expanded="false" aria-controls="tk-chat-panel"><span aria-hidden="true">✦</span> Ask Tamkeen</button>
    <section id="tk-chat-panel" class="tk-chat-panel" role="dialog" aria-label="Tamkeen training assistant" hidden>
      <header class="tk-chat-header"><div><strong>Tamkeen Assistant</strong><small>Programs, training and support</small></div><button class="tk-chat-close" type="button" aria-label="Close chatbot">×</button></header>
      <div class="tk-chat-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div class="tk-chat-suggestions"><button type="button" data-ask="Help me choose a course">Find my course</button><button type="button" data-ask="Tell me about Tamkeen">About Tamkeen</button><button type="button" data-ask="Where are your branches?">Locations</button></div>
      <form class="tk-chat-form"><label class="tk-sr-only" for="tk-chat-input">Ask a question</label><input id="tk-chat-input" type="text" placeholder="Ask me anything about Tamkeen..." maxlength="900" autocomplete="off" required><button type="submit" aria-label="Send message">➤</button></form>
      <p class="tk-chat-disclaimer">Course information may change. Confirm details with Tamkeen.</p>
    </section>`;
  document.body.appendChild(root);
  const launcher = root.querySelector(".tk-chat-launcher"),
    panel = root.querySelector(".tk-chat-panel"),
    close = root.querySelector(".tk-chat-close");
  const log = root.querySelector(".tk-chat-messages"),
    input = root.querySelector("#tk-chat-input"),
    form = root.querySelector("form");
  let pending = false;
  const history = [];
  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  const stop = new Set(
    "the a an for and or of in on with using use course courses program programs training what which how can i me do you have tell about want need find show interested learn to is are at your".split(
      " ",
    ),
  );
  function append(text, kind, links = []) {
    const bubble = document.createElement("div");
    bubble.className = "tk-chat-message " + kind;
    const p = document.createElement("p");
    p.textContent = text;
    bubble.appendChild(p);
    if (links.length) {
      const actions = document.createElement("div");
      actions.className = "tk-chat-links";
      links.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.label + " ↗";
        actions.appendChild(a);
      });
      bubble.appendChild(actions);
    }
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }
  function courseLink(c) {
    return "course-details.html?catalog=" + encodeURIComponent(c.catalog_id);
  }
  function searchCourses(question) {
    const words = normalize(question)
      .split(" ")
      .filter((w) => w.length > 2 && !stop.has(w));
    if (!words.length) return [];
    const alias = {
      cybersecurity: ["cyber", "security"],
      graphic: ["graphics", "design"],
      nursery: ["nursery", "management"],
      artificial: ["artificial", "intelligence"],
      ai: ["artificial", "intelligence"],
      technical: ["technical", "technology"],
    };
    const queryWords = [
      ...new Set(words.flatMap((w) => [w, ...(alias[w] || [])])),
    ];
    return courses
      .map((c) => {
        const title = normalize(c.title_en || c.title);
        const deps = normalize(
          (c.departments || []).join(" ") + " " + (c.category || ""),
        );
        let score = 0;
        queryWords.forEach((w) => {
          if (title.split(" ").includes(w)) score += 4;
          else if (title.includes(w)) score += 2;
          if (deps.split(" ").includes(w)) score += 1;
        });
        if (normalize(question).includes(title) && title.length > 8)
          score += 25;
        return { c, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((x) => x.c);
  }
  const contact = { label: "Contact Us", href: "contact.html" };
  const maps = [
    {
      label: "Ajman branch map",
      href: "https://www.google.com/maps/search/?api=1&query=Tamkeen+Training+Center&query_place_id=ChIJBw5qYQBXXz4RmcrV3X4FQwQ",
    },
    {
      label: "Dubai branch map",
      href: "https://www.google.com/maps/search/?api=1&query=Tamkeen+Training+Center&query_place_id=ChIJv3UVWY1dXz4RvVgDl8Itoxg",
    },
  ];
  const allPrograms = { label: "Browse all programs", href: "programs.html" };
  const quick = root.querySelector(".tk-chat-suggestions");
  function suggestions(items) {
    quick.replaceChildren();
    (items || []).slice(0, 3).forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = t;
      b.addEventListener("click", () => send(t));
      quick.appendChild(b);
    });
  }
  const discovery = { active: false, step: 0, answers: [] };
  const questions = [
    "What is your main goal: getting a new job, growing in your current role, starting a business, or learning for personal interest?",
    "Which subjects interest you most? For example: AI, technology, design, business, teaching, languages, or healthcare.",
    "What is your experience level: beginner, some experience, or advanced?",
    "Would you prefer hands-on practical learning, or a broader theoretical foundation?",
    "Do you prefer online learning or attending a branch? Do you have a budget range in AED?",
  ];
  function localAnswer(q) {
    const s = normalize(q);
    if (/^(start over|restart|reset chat|new chat)$/.test(s)) {
      discovery.active = false;
      discovery.step = 0;
      discovery.answers = [];
      return {
        text: "Of course! What would you like help with today?",
        links: [],
        follow_ups: [
          "Help me choose a course",
          "Explore AI courses",
          "Where are your branches?",
        ],
      };
    }
    if (
      /^(yes|yes please|sure|show me|send them|show locations|show maps)$/.test(
        s,
      ) &&
      /location|branch|map/.test(history.slice(-1)[0]?.content || "")
    )
      return {
        text: "Here are the Ajman and Dubai branch maps. Would you like help choosing a course offered online or at a branch?",
        links: [...maps, contact],
        follow_ups: ["Help me choose a course", "Browse all programs"],
      };
    if (/location|branch|direction|map|dubai|ajman/.test(s))
      return {
        text: "Tamkeen has branches in Ajman and Dubai. Would you like me to show you their Google Maps locations?",
        links: [...maps, { label: "Contact Us", href: "contact.html" }],
        follow_ups: ["Yes, show the locations", "Help me choose a course"],
      };
    if (
      /refund|payment dispute|accredit|official certificate|schedule|start date|custom training|corporate|enrollment status/.test(
        s,
      )
    )
      return {
        text: "This needs confirmation from a Tamkeen employee. Please send an inquiry through Contact Us so the team can provide the correct details.",
        links: [contact],
        follow_ups: ["Browse programs"],
      };
    if (/contact|human|employee|advisor|inquiry|enquiry/.test(s))
      return {
        text: "You can send a detailed inquiry to the Tamkeen team on the Contact Us page.",
        links: [contact],
      };
    if (/certificate|verify/.test(s))
      return {
        text: "You can use the Verify a Certificate page. For questions about a particular certificate, please contact the team.",
        links: [
          { label: "Verify a certificate", href: "certificate.html" },
          contact,
        ],
      };
    if (/refund|cancel/.test(s))
      return {
        text: "Please review the Refund Policy. For your specific case, Tamkeen staff can help through the inquiry form.",
        links: [
          { label: "Refund policy", href: "refund-policy.html" },
          contact,
        ],
      };
    if (
      /^(help me choose a course|recommend a course|not sure|i don t know|help me find a program|find my course)$/.test(
        s,
      ) ||
      (/recommend|choose|unsure|don t know/.test(s) &&
        /course|program|study|learn/.test(s))
    ) {
      discovery.active = true;
      discovery.step = 0;
      discovery.answers = [];
      return {
        text:
          "I would love to help you find the right training! I will ask a few short questions, then recommend programs based on your answers.\n\n" +
          questions[0],
        links: [],
        follow_ups: [
          "Getting a new job",
          "Growing in my current role",
          "Starting a business",
        ],
      };
    }
    if (discovery.active) {
      discovery.answers.push(q);
      discovery.step++;
      if (discovery.step < questions.length)
        return {
          text: "Thanks, that helps! " + questions[discovery.step],
          links: [],
          follow_ups:
            discovery.step === 2
              ? ["Beginner", "Some experience", "Advanced"]
              : [],
        };
      discovery.active = false;
      const combined = discovery.answers.join(" ");
      const matches = searchCourses(combined);
      return {
        text: matches.length
          ? "Based on your interests and goals, these programs may be worth exploring. Please check each program page for its details. For a more personalized recommendation, connect the AI service or contact Tamkeen."
          : "Thanks for sharing your goals. I could not identify a reliable match from the catalog, so the Tamkeen team can help you choose.",
        links: matches.length
          ? [
              ...matches.slice(0, 4).map((c) => ({
                label: c.title_en || c.title,
                href: courseLink(c),
              })),
              contact,
            ]
          : [allPrograms, contact],
        follow_ups: ["Tell me about these courses", "Browse all programs"],
      };
    }
    if (
      /about tamkeen|what is tamkeen|who are you|training center|training centre/.test(
        s,
      )
    )
      return {
        text: "Tamkeen Training Center provides professional training and development programs across areas such as technology, management, education and more. You can explore its story on the About page and browse courses in Programs. What would you like to learn?",
        links: [{ label: "About Tamkeen", href: "about.html" }, allPrograms],
        follow_ups: ["Help me choose a course", "Where are your branches?"],
      };
    const matches = searchCourses(q);
    if (matches.length)
      return {
        text: "Here are some matching Tamkeen courses. You can open each program information page, or tell me more about your goals for a better recommendation.",
        links: matches
          .slice(0, 4)
          .map((c) => ({ label: c.title_en || c.title, href: courseLink(c) }))
          .concat([allPrograms]),
        follow_ups: ["Help me choose a course", "Browse all programs"],
      };
    return {
      text: "I can help you explore training options, or you can send an inquiry to the Tamkeen team for more specific information. Would you like me to ask a few questions to find a suitable course?",
      links: [contact, allPrograms],
      follow_ups: ["Help me choose a course", "Where are your branches?"],
    };
  }
  function validEndpoint() {
    const u = String(cfg.endpoint || "");
    if (!/^https:\/\//.test(u) || u.includes("PASTE_")) return "";
    try {
      return new URL(u).href;
    } catch {
      return "";
    }
  }
  async function askAI(question) {
    const endpoint = validEndpoint();
    if (!endpoint) return null;
    const supabase = window.TAMKEEN_SUPABASE || {};
    const key = cfg.publishableKey || supabase.anonKey || "";
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const headers = { "Content-Type": "application/json" };
      if (key && !key.startsWith("PASTE_")) {
        headers.apikey = key;
        headers.Authorization = "Bearer " + key;
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: question,
          history: history.slice(-12),
        }),
        signal: controller.signal,
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || typeof data.answer !== "string" || !data.answer.trim())
        return null;
      const links = [];
      (Array.isArray(data.course_ids) ? data.course_ids : [])
        .slice(0, 4)
        .forEach((id) => {
          const c = courses.find((c) => Number(c.catalog_id) === Number(id));
          if (c)
            links.push({ label: c.title_en || c.title, href: courseLink(c) });
        });
      if (data.show_locations) links.push(...maps);
      if (data.needs_contact) links.push(contact);
      if (/browse (all )?programs/i.test(data.answer)) links.push(allPrograms);
      return {
        text: data.answer.slice(0, 1600),
        links,
        follow_ups: data.follow_ups,
      };
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }
  async function send(q) {
    if (pending || !q.trim()) return;
    const question = q.trim().slice(0, 900);
    pending = true;
    input.value = "";
    form.querySelector("button").disabled = true;
    append(question, "user");
    const loading = append(
      "Thinking about the best way to help…",
      "bot tk-chat-loading",
    );
    const result = (await askAI(question)) || localAnswer(question);
    loading.remove();
    append(result.text, "bot", result.links);
    suggestions(result.follow_ups || []);
    history.push(
      { role: "user", content: question },
      { role: "assistant", content: result.text },
    );
    if (history.length > 14) history.splice(0, history.length - 14);
    pending = false;
    form.querySelector("button").disabled = false;
    input.focus();
  }
  function toggle(open) {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
    else launcher.focus();
  }
  launcher.addEventListener("click", () => toggle(panel.hidden));
  close.addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) toggle(false);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    send(input.value);
  });
  root
    .querySelectorAll("[data-ask]")
    .forEach((b) => b.addEventListener("click", () => send(b.dataset.ask)));
  if (validEndpoint())
    root.querySelector(".tk-chat-header small").textContent =
      "Your AI training advisor";
  else
    root.querySelector(".tk-chat-header small").textContent =
      "Course guide · AI setup pending";
  append(
    "Hi! 👋 I’m the Tamkeen training assistant. Not sure what to study? I can ask you a few questions and recommend programs. I can also help with courses, our center, branch locations, and connecting you with our team. What would you like to explore?",
    "bot",
  );
})();
