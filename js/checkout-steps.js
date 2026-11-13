(() => {
  const stages = [...document.querySelectorAll("[data-checkout-stage]")];
  const progress = [...document.querySelectorAll("[data-checkout-progress]")];
  const review = document.getElementById("checkoutCartItems");
  const message = document.getElementById("checkoutCartMessage");
  const form = document.getElementById("tamkeenCheckoutForm");
  const readIds = () => {
    try {
      return JSON.parse(localStorage.getItem("tamkeenBlueSaved") || "[]");
    } catch {
      return [];
    }
  };
  const hasItems = () => readIds().length > 0;
  const scrollTop = () =>
    document
      .querySelector(".checkout-progress")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  function show(n) {
    stages.forEach((el) => {
      el.hidden = Number(el.dataset.checkoutStage) !== n;
    });
    progress.forEach((el) => {
      const step = Number(el.dataset.checkoutProgress);
      el.classList.toggle("current", step === n);
      el.classList.toggle("done", step < n);
    });
    scrollTop();
  }
  document.getElementById("confirmCartStep")?.addEventListener("click", () => {
    if (!hasItems()) {
      message.textContent =
        "Please add at least one program to your cart before continuing.";
      return;
    }
    message.textContent = "";
    show(2);
  });
  document
    .getElementById("backToCartStep")
    ?.addEventListener("click", () => show(1));
  document
    .getElementById("backToDetailsStep")
    ?.addEventListener("click", () => show(2));
  // Capture the valid form submission before the legacy prototype handler.
  form?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const feedback = document.getElementById("checkoutFeedback");
      if (!hasItems()) {
        show(1);
        message.textContent = "Your cart is empty. Add a program to continue.";
        return;
      }
      if (!form.reportValidity()) {
        feedback.textContent =
          "Please complete all required fields and acknowledge the prototype notice.";
        feedback.classList.add("error");
        return;
      }
      feedback.textContent = "";
      feedback.classList.remove("error");
      const data = new FormData(form);
      const summary = document.getElementById("checkoutFinalSummary");
      const selected = document.getElementById("checkoutSummary");
      summary.replaceChildren();
      const heading = document.createElement("h3");
      heading.textContent = "Selected programs";
      summary.append(heading);
      const lines = document.createElement("div");
      lines.className = "checkout-final-lines";
      lines.innerHTML = selected?.innerHTML || "";
      summary.append(lines);
      const details = document.createElement("div");
      details.className = "checkout-final-details";
      [
        ["Name", `${data.get("firstName")} ${data.get("lastName")}`],
        ["Email", data.get("email")],
        ["Phone", data.get("phone")],
        ["City", data.get("city")],
        ["Emirate", data.get("state")],
        ["Address", data.get("address")],
      ].forEach(([key, value]) => {
        const row = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = key + ": ";
        row.append(strong, document.createTextNode(String(value || "")));
        details.append(row);
      });
      summary.append(details);
      show(3);
    },
    true,
  );
  document
    .getElementById("finishCheckoutPreview")
    ?.addEventListener("click", () => {
      document.getElementById("checkoutFinalMessage").textContent =
        "Preview confirmed. No payment or registration has been submitted. Please contact Tamkeen to complete enrollment.";
    });
  // Keep the cart review synchronized when the user changes quantity or removes an item.
  const observer = new MutationObserver(() => {
    const button = document.getElementById("confirmCartStep");
    if (button) button.disabled = !hasItems();
  });
  if (review) observer.observe(review, { childList: true, subtree: true });
  const button = document.getElementById("confirmCartStep");
  if (button) button.disabled = !hasItems();
  show(1);
})();
