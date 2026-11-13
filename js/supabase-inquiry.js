(function () {
  "use strict";
  const form = document.getElementById("tamkeen-contact-inquiry");
  if (!form) return;
  const feedback = document.getElementById("tamkeen-inquiry-feedback");
  const button = form.querySelector('button[type="submit"]');
  let sending = false;
  function notify(message, success) {
    feedback.hidden = false;
    feedback.textContent = message;
    feedback.classList.toggle("is-success", success);
    feedback.classList.toggle("is-error", !success);
  }
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const config = window.TAMKEEN_SUPABASE || {};
    if (
      !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(
        (config.url || "").trim(),
      ) ||
      !config.anonKey ||
      config.anonKey.includes("PASTE_YOUR_")
    ) {
      notify(
        "The inquiry form is not connected yet. Please configure the Supabase project URL and public key.",
        false,
      );
      return;
    }
    const data = new FormData(form);
    const inquiry = {
      full_name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      help_type: String(data.get("help_type") || "").trim(),
      program_topic: String(data.get("topic") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    if (
      !inquiry.full_name ||
      !inquiry.email ||
      !inquiry.help_type ||
      !inquiry.message
    ) {
      notify("Please complete the required fields.", false);
      return;
    }
    sending = true;
    button.disabled = true;
    const oldLabel = button.innerHTML;
    button.textContent = "Sending…";
    notify("Sending your inquiry…", true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      let response;
      try {
        response = await fetch(
          config.url.replace(/\/$/, "") + "/rest/v1/contact_inquiries",
          {
            method: "POST",
            headers: {
              apikey: config.anonKey,
              Authorization: "Bearer " + config.anonKey,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify(inquiry),
            signal: controller.signal,
          },
        );
      } finally {
        clearTimeout(timeout);
      }
      if (!response.ok)
        throw new Error("Supabase returned HTTP " + response.status);
      form.reset();
      notify("Thank you! Your inquiry has been submitted successfully.", true);
    } catch (error) {
      console.error("Inquiry submission failed:", error);
      notify(
        "Your inquiry could not be sent. Please try again or contact us on WhatsApp.",
        false,
      );
    } finally {
      sending = false;
      button.disabled = false;
      button.innerHTML = oldLabel;
    }
  });
})();
