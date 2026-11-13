/* Optional AI backend. The chatbot works in catalog-guidance mode without this URL.
   Deploy the included Supabase Edge Function, then replace the endpoint below.
   NEVER put an OpenAI API key in browser JavaScript. */
window.TAMKEEN_CHATBOT = {
  endpoint:
    "https://kaoaiavzeketgjprmhtv.supabase.co/functions/v1/tamkeen-chat",
};
