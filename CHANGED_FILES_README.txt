TAMKEEN - CART + SEARCH FIXES (CHANGED FILES ONLY)

Copy the contents of this ZIP into your existing C:\Tamkeen_Website folder, preserving relative paths.
Do NOT delete the existing .git folder.
No Supabase SQL migration or Edge Function deployment is required for these frontend changes.
Your existing js/supabase-inquiry-config.js and js/tamkeen-chatbot-config.js are NOT included.

Changes compared with the original user-uploaded Tamkeen_Website - Copy.zip:

CART FIX: All 36 HTML pages, js/book-now-choice.js, and js/script.js were changed.
SEARCH FIX: js/script.js was subsequently changed again. This ZIP includes its latest version.
ADDED DOCUMENTATION: CART_FIX_README.md.

FILES IN THIS ZIP:
CART_FIX_README.md
about.html
cart.html
certificate.html
checkout.html
contact.html
course-details.html
course-featured-1.html
course-featured-17.html
course-featured-22.html
course-featured-24.html
course-featured-26.html
course-featured-29.html
course-featured-4.html
family.html
gallery.html
index.html
js/book-now-choice.js
js/script.js
login.html
media.html
news-criminal-law.html
news-entrepreneurship.html
news-human-rights.html
news-labour-law.html
program-advanced-artificial-intelligence.html
program-ai-applications.html
program-ai-in-business.html
program-ai-powered-interior-design.html
program-communication-skills.html
program-english-language-training.html
program-nursery-management.html
program-self-elearning-skills.html
program-smart-city-planning-ai.html
program-teaching-ai-children.html
program-training-of-trainers-tot.html
program-training-programme-in-content-creation-using-artificial-intelligence.html
programs.html
refund-policy.html

After copying, in VS Code terminal:
  git status
  git add .
  git commit -m "Fix cart persistence and course search navigation"
  git push origin main
