# Connect Contact Us inquiry form to Supabase

1. Create/open your Supabase project and run `SUPABASE_SETUP.sql` in SQL Editor.
2. Open `js/supabase-inquiry-config.js`. Replace the placeholders with your project URL and **public anon/publishable key** from Supabase Project Settings > API. NEVER use the service_role/secret key in website code.
3. Serve the website using VS Code Live Server or deploy it to GitHub Pages (rather than opening the HTML directly as file://).
4. Submit a test inquiry from `contact.html`, then verify it appears in Supabase Table Editor > `contact_inquiries`.
5. For production, add CAPTCHA/rate limiting, and restrict database access to trusted administrators. Do not add a public SELECT policy.

Until the project URL and public key are entered, the form displays a configuration message instead of pretending to submit. The rest of the website remains unchanged.
