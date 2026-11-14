TAMKEEN - CHANGED FILES ONLY

Included:
assets/favicon.ico
assets/tamkeen-favicon.png
css/tamkeen-chatbot.css
js/tamkeen-chatbot.js

Copy these into your existing C:\Tamkeen_Website folder, preserving subfolders.
The responsive chatbot code moves or hides the launcher when cart/menu drawers are open.

FAVICON IMPORTANT: The icon files alone do not activate the browser tab icon. Add these lines to the <head> of each HTML page (or replace existing favicon links):
<link rel="icon" type="image/png" href="assets/tamkeen-favicon.png" />
<link rel="shortcut icon" href="assets/favicon.ico" />

These HTML edits are NOT included because the prior favicon fix supplied only image assets.

To publish changes after updating HTML pages:
git add .
git commit -m "Update favicon and responsive chatbot positioning"
git push origin main

No Supabase redeployment is required.
