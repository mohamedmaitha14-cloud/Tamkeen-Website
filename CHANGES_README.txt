TAMKEEN: FAVICON + RESPONSIVE CHATBOT FIX (CHANGED FILES ONLY)

SOURCE: Your uploaded Tamkeen_Website(1).zip

WHAT CHANGED
- All 36 root-level HTML pages: added favicon links inside <head>.
- assets/tamkeen-favicon.png and assets/favicon.ico: browser tab logo made from the Tamkeen image you supplied.
- js/tamkeen-chatbot.js: detect menu/cart drawer open state; shift left if space, otherwise hide; restore on close.
- css/tamkeen-chatbot.css: responsive drawer states and reduced-motion support.

INSTALL
1. Extract this ZIP.
2. Copy the HTML files and assets/, css/, js/ folders into C:\Tamkeen_Website, allowing replacement of matching files.
3. Keep your existing .git directory and Supabase configuration files unchanged.
4. Hard-refresh browser (Ctrl+Shift+R). Favicons may require closing and reopening the tab.
5. Push website changes to GitHub; Vercel auto-deploys if linked.

NOT INCLUDED: Supabase configuration, Edge Functions, API keys, Git metadata.
