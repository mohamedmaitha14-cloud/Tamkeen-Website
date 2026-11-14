/* Visually distinguish authenticated customers from guests on every page. */
(() => {
  "use strict";
  const cart = window.TamkeenCart;
  if (!cart) return;
  function render() {
    document.querySelectorAll('a[href="login.html"].tool').forEach((link) => {
      const signedIn = Boolean(cart.user());
      link.classList.toggle("tamkeen-account-signed-in", signedIn);
      link.setAttribute("aria-label", signedIn ? "My account (signed in)" : "Login");
      link.title = signedIn ? "My account" : "Login";
      const svg = link.querySelector("svg");
      if (svg) svg.style.fill = signedIn ? "currentColor" : "none";
    });
  }
  window.addEventListener("tamkeen-auth-changed", render);
  document.addEventListener("DOMContentLoaded", render);
  cart.ready.finally(render);
  render();
})();
