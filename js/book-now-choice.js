(() => {
  "use strict";
  const button = document.getElementById("dvBookNow");
  if (!button) return;
  const style = document.createElement("style");
  style.textContent = `
.booking-choice-backdrop{position:fixed;inset:0;z-index:3000;background:rgba(8,25,49,.64);display:none;align-items:center;justify-content:center;padding:18px}
.booking-choice-backdrop.is-open{display:flex}
.booking-choice-dialog{background:#fff;color:#0a1931;border-radius:20px;max-width:490px;width:100%;padding:30px;box-shadow:0 20px 80px #061a3555;text-align:center}
.booking-choice-dialog h2{font-size:clamp(22px,3vw,28px);margin:8px 0 12px;color:#0a1931}
.booking-choice-dialog p{color:#45617d;margin:0 0 23px;line-height:1.55}
.booking-choice-actions{display:flex;gap:12px;flex-wrap:wrap}
.booking-choice-actions button{flex:1 1 170px;min-height:49px;border-radius:10px;padding:12px 15px;font:inherit;font-weight:700;cursor:pointer}
.booking-choice-continue{border:1px solid #4a7fa7;color:#1a3d63;background:white}
.booking-choice-checkout{border:1px solid #1a3d63;background:#1a3d63;color:white}
.booking-choice-actions button:focus-visible,.booking-choice-close:focus-visible{outline:3px solid #4a7fa7;outline-offset:3px}
.booking-choice-close{float:right;border:0;background:transparent;color:#1a3d63;font-size:25px;cursor:pointer}
@media(max-width:420px){.booking-choice-dialog{padding:20px}}`;
  document.head.append(style);
  const overlay = document.createElement("div");
  overlay.className = "booking-choice-backdrop";
  overlay.innerHTML = `<section class="booking-choice-dialog" role="dialog" aria-modal="true" aria-labelledby="bookingChoiceTitle" aria-describedby="bookingChoiceDescription"><button class="booking-choice-close" type="button" aria-label="Close dialog">×</button><h2 id="bookingChoiceTitle">Your course has been added to the cart</h2><p id="bookingChoiceDescription">Do you want to continue shopping or go to checkout?</p><div class="booking-choice-actions"><button class="booking-choice-continue" type="button">Continue shopping</button><button class="booking-choice-checkout" type="button">Go to checkout →</button></div></section>`;
  document.body.append(overlay);
  const close = () => {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    button.focus();
  };
  const courseId = () => {
    const params = new URLSearchParams(location.search);
    const n = params.get("catalog");
    if (n && /^\d+$/.test(n)) return "catalog-" + n;
    const match = location.pathname.match(/course-featured-(\d+)\.html$/);
    return match ? "catalog-" + match[1] : null;
  };
  button.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const id = courseId();
      if (!id) return;
      let ids = [];
      try {
        ids = JSON.parse(localStorage.getItem("tamkeenBlueSaved") || "[]");
        if (!Array.isArray(ids)) ids = [];
      } catch (e) {}
      if (!ids.includes(id)) ids.push(id);
      try {
        localStorage.setItem("tamkeenBlueSaved", JSON.stringify(ids));
      } catch (e) {}
      window.TamkeenRefreshCart?.();
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      overlay.querySelector(".booking-choice-continue").focus();
    },
    true,
  );
  overlay
    .querySelector(".booking-choice-close")
    .addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
  });
  overlay
    .querySelector(".booking-choice-continue")
    .addEventListener("click", close);
  overlay
    .querySelector(".booking-choice-checkout")
    .addEventListener("click", () => {
      location.href = "checkout.html";
    });
})();
