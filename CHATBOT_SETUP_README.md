# Tamkeen conversational AI assistant — setup

## What is already included
- A redesigned interactive chatbot on **all website pages**, using the existing navy/light-blue theme.
- A **multi-turn course discovery flow**: goals, interests, experience, learning style, location and budget; recommends actual course pages.
- A secure Supabase Edge Function which calls OpenAI, uses a packaged **221-course catalog**, and returns approved course IDs rather than fabricated links.
- Location offers with Ajman and Dubai Google Maps links; Contact Us escalation for staff-only questions.
- Graceful offline/unconfigured fallback (basic rule-based guide, **not** equivalent to full AI).

## REQUIRED: enable the live AI
1. Create or open your Supabase project. Install Supabase CLI and log in: `supabase login`.
2. Run `SUPABASE_CHAT_RATE_LIMIT.sql` in **Supabase > SQL Editor**.
3. In a terminal in the website root, run `supabase link --project-ref YOUR_PROJECT_REF`.
4. Generate a random rate-limit salt. Add the following **Supabase Edge Function secrets** using the dashboard or CLI:
   - `OPENAI_API_KEY` — your OpenAI API key (NEVER place it in website JavaScript).
   - `CHAT_RATE_LIMIT_SALT` — a long random secret for hashing visitor IPs.
   - `ALLOWED_ORIGINS` — comma-separated *exact* site origins, e.g. `https://your-domain.com,https://www.your-domain.com,http://localhost:5500` (include your VS Code Live Server origin for local testing).
   - `SUPABASE_SERVICE_ROLE_KEY` is normally available automatically to Supabase functions; verify that it is configured. **Never put it in frontend code**.
   - `SUPABASE_URL` is normally available automatically to Supabase functions.
   - Optional: `OPENAI_MODEL` (default `gpt-4o-mini`).
5. Deploy the function: `supabase functions deploy tamkeen-chat --no-verify-jwt`. Anonymous visitors must be able to access the chatbot; the function enforces exact-origin checks and a basic per-IP hourly limit. **Origin restrictions alone are not authentication.**
6. Edit `js/tamkeen-chatbot-config.js`: set `endpoint` to `https://YOUR_PROJECT_REF.supabase.co/functions/v1/tamkeen-chat`.
7. Ensure the `js/supabase-inquiry-config.js` file contains your project's **public publishable/anon key** and URL (required for the inquiry form, and optionally used in chat requests).
8. Test on your HTTPS website (or VS Code Live Server with its origin added to `ALLOWED_ORIGINS`). Ask the bot: “I have no idea what course to take”, answer its questions, request the Dubai branch map, and ask for a specific certificate status.

## Important production notes
- **Not live until steps 1–8 are completed.** No API credentials were included.
- The AI is grounded in course names, departments, online availability and listed prices from the website catalog. It does **not** have verified live schedules, enrollments, certificate records or private data.
- The function rate-limits to approximately **30 messages per IP per hour**, backed by Supabase. High-concurrency requests can exceed the threshold because the count/insert is not atomic; for high traffic, replace it with an atomic database RPC or gateway limit and add CAPTCHA/bot protection.
- Use an OpenAI API project budget, monitor usage and set alerts. Limit CORS to your actual domain.
- Browser chat history is held only in memory for the open page; no conversations are persisted.
- Contact form integration is independent; the chatbot only **links** to Contact Us, it does not submit inquiries itself.
- The English-only site and existing course/cart/checkout pages are retained.
