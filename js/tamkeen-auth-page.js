/* Supabase email/password account page. */
(() => {
  "use strict";
  const cart = window.TamkeenCart;
  const form = document.getElementById("tamkeen-auth-form");
  if (!cart || !form) return;

  const tabs = [...document.querySelectorAll("[data-auth-mode]")];
  const feedback = document.getElementById("tamkeen-auth-feedback");
  const account = document.getElementById("tamkeen-account-panel");
  const password = form.querySelector("[data-auth-password]");
  const submit = form.querySelector("[data-auth-submit]");
  let mode = "login";

  function setMode(next) {
    mode = next;
    tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.authMode === mode));
    password.hidden = mode === "reset";
    password.querySelector("input").required = mode !== "reset";
    submit.textContent = { login: "Sign in ↗", register: "Create account ↗", reset: "Send reset email ↗" }[mode];
    feedback.textContent = "";
  }

  function render() {
    const user = cart.user();
    account.hidden = !user;
    form.hidden = Boolean(user);
    document.querySelector(".tamkeen-auth-tabs").hidden = Boolean(user);
    if (user) document.getElementById("tamkeen-account-email").textContent = user.email || "Customer";
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => setMode(tab.dataset.authMode)));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const email = form.elements.email.value.trim();
    const secret = form.elements.password.value;
    submit.disabled = true;
    feedback.textContent = "Please wait…";
    try {
      if (mode === "login") {
        await cart.login(email, secret);
        feedback.textContent = "Signed in successfully.";
        render();
      } else if (mode === "register") {
        const result = await cart.register(email, secret);
        feedback.textContent = result?.session
          ? "Account created. You can now sign in."
          : "Check your email to confirm your account, then sign in.";
        setMode("login");
        feedback.textContent = "Check your email to confirm your account, then sign in.";
      } else {
        await cart.resetPassword(email);
        feedback.textContent = "If an account exists, a password-reset email will be sent.";
      }
    } catch (error) {
      feedback.textContent = error.message || "Please try again.";
    } finally {
      submit.disabled = false;
    }
  });

  document.getElementById("tamkeen-signout")?.addEventListener("click", async () => {
    await cart.logout();
    form.reset();
    setMode("login");
    render();
  });
  window.addEventListener("tamkeen-auth-changed", render);
  cart.ready.finally(render);
  render();
})();
