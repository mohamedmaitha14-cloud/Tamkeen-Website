/* Read-only purchase history. Purchases must be written by a trusted payment webhook. */
(() => {
  "use strict";
  const cart = window.TamkeenCart;
  const feedback = document.getElementById("purchase-history-feedback");
  const list = document.getElementById("purchase-history-list");
  if (!cart || !feedback || !list) return;
  function text(tag, value) { const node = document.createElement(tag); node.textContent = String(value ?? ""); return node; }
  async function render() {
    await cart.ready;
    list.replaceChildren();
    if (!cart.user()) {
      feedback.textContent = "Please sign in to view your purchase history.";
      const link = text("a", "Sign in ↗"); link.href = "login.html"; list.append(link);
      return;
    }
    feedback.textContent = "Loading your purchases…";
    try {
      const purchases = await cart.getPurchaseHistory();
      if (!purchases?.length) { feedback.textContent = "You have no confirmed purchases yet. Your programs will appear here after a successful payment."; return; }
      feedback.textContent = `${purchases.length} purchase${purchases.length === 1 ? "" : "s"} found.`;
      for (const item of purchases) {
        const card = document.createElement("article"); card.className = "purchase-history-card";
        card.append(text("h2", item.course_title || item.course_id));
        card.append(text("p", `Purchased: ${new Date(item.purchased_at).toLocaleDateString()}`));
        card.append(text("p", `Amount paid: ${item.currency || "AED"} ${Number(item.amount || 0).toFixed(2)}`));
        card.append(text("p", `Status: ${item.payment_status}`));
        list.append(card);
      }
    } catch (error) { feedback.textContent = `Unable to load purchase history: ${error.message || "Please try again."}`; }
  }
  window.addEventListener("tamkeen-auth-changed", render);
  render();
})();
