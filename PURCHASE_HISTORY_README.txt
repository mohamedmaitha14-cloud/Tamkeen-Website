Tamkeen changed-files-only update
1. Copy the changed files and new purchase-history.html into your website root, preserving folder paths.
2. In Supabase SQL Editor, run ONLY SUPABASE_PURCHASE_HISTORY_SETUP.sql once.
3. Push the changed files to GitHub; Vercel will deploy as configured.
4. Sign in and visit Purchase History via the footer or account page.
5. Purchase History stays empty until a future payment provider confirms payment via a secure server-side webhook.
6. Do not insert purchases on checkout click. Existing checkout remains a preview.
7. Existing inquiry, chatbot, cart SQL and Supabase settings are not changed.
