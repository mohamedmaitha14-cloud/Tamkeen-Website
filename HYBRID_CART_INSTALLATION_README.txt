TAMKEEN HYBRID CART + CUSTOMER LOGIN — CHANGED FILES ONLY
=========================================================
1. Back up your current website folder.
2. Extract this ZIP and copy all contents into C:\Tamkeen_Website (preserve paths).
3. Supabase Dashboard > SQL Editor: run SUPABASE_CUSTOMER_CART_SETUP.sql ONCE.
4. Supabase Dashboard > Authentication > Providers > Email: enable email/password.
5. Authentication > URL Configuration: set your live Vercel Site URL and add your website URL to allowed redirects.
6. Existing js/supabase-inquiry-config.js MUST contain your correct public Supabase project URL and publishable/anon key. This ZIP does not replace that file.
7. In VS Code run: git add . ; git commit -m "Add private hybrid carts and customer authentication" ; git push origin main
8. Test in an incognito window: guest add / navigate / refresh; then register / confirm email / sign in; test second account; sign out; verify no prior customer's cart appears.

SECURITY / BEHAVIOR
- Guest cart: sessionStorage only; not guaranteed to clear when a browser restores a tab. Use private windows on shared devices.
- Old localStorage cart is deliberately erased, NOT imported, to avoid exposing a previous customer's selections.
- Account cart: Supabase Auth + RLS; only the signed-in account may read/write its rows.
- Signing out clears local session and guest cart. Account cart remains in Supabase for next login.
- Customer access tokens are stored in sessionStorage (not localStorage).
- Existing checkout remains a PREVIEW; it does not process payment or create enrollment.
- Password reset emails require configuring Supabase Auth email templates/redirects; password update screen is not included in this patch.
- If Supabase sync fails, changes may not persist to the account. Check browser console and RLS/SQL setup.
- No changes are made to your Edge Function or chatbot secrets.

FILES: 36 HTML pages, css/style.css, js/script.js, js/program-catalog.js, js/course-catalog-detail.js, js/book-now-choice.js,
js/checkout-steps.js, js/tamkeen-customer-cart.js, js/tamkeen-auth-page.js,
SUPABASE_CUSTOMER_CART_SETUP.sql and this README.
