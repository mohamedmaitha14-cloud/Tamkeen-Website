# Tamkeen Training — Blue Current concept

A new standalone seven-page responsive HTML/CSS/JavaScript design. Extract the ZIP and open `index.html` in a browser. No build tools required. Images load from Unsplash and require an internet connection.

## Design palette
- Navy `#0A1931`
- Pale blue `#B3CFE5`
- Steel blue `#4A7FA7`
- Deep blue `#1A3D63`
- Ice white `#F6FAFD`

## Pages
Home, About, Programs, Course Details, Contact, Login, Certificates. The Programs page has search and category filters. The shortlist is stored in localStorage and is a demonstration, not a real shopping cart.

## Important integration notes
- The original Tamkeen logo has **not** been sourced: the header uses a clearly temporary typographic brand treatment. Replace the `.brand` markup in all HTML files with the original logo asset before publication.
- Course data in `js/data.js` was carried from previously gathered official-site program examples. Recheck every title, price, duration and link against the live official site before production. No claim is made that this is the complete live catalog.
- Login, certificate verification, cart checkout and contact submissions are **not connected** to Tamkeen's backend. Demo forms do not send data.
- Social media placeholders are in the footer of each HTML page, with `data-placeholder="ADD YOUR ... LINK HERE"`. Replace each `href="#"` with the official profile URL.
- Photos are externally hosted from Unsplash and must be reviewed for suitability/licensing before commercial use.
- For GitHub Pages upload the complete folder contents, preserving `css/` and `js/` paths.

## Header update
The header is sticky across all pages. It includes Home, About, Programs, Departments, Search, Login, Cart, Menu and Contact Us. Departments is a prototype browsing page; replace its categories with the official department list when confirmed. Certificates remains accessible from the menu.

Footer update: Home retains its full original footer. All other pages use a compact footer with the brand, navigation/social links, and bottom note only.

Interior pages retain the decorative blue spiral background in their compact footers. The homepage footer remains unchanged.


Menu update: slide-out full-height navigation inspired by supplied screenshot. Tamkeen family, Media center, Photo gallery, WhatsApp, and Arabic version need official destinations/content. No contact phone number has been invented.

Menu update: all drawer elements now use the official Blue Current palette (#0A1931, #B3CFE5, #4A7FA7, #1A3D63, #F6FAFD). Language controls show UAE and US flags. Arabic translation is not yet implemented.


## November 4 menu update
- Added real local SVG assets for UAE and US flags in `assets/flag-uae.svg` and `assets/flag-us.svg` (avoids missing emoji on Windows).
- Added complete, navigable `family.html`, `media.html`, and `gallery.html` concept pages.
- Menu entries now link to these pages; all existing pages, sticky header, footer and spiral motif retained.
- Photos on new pages are illustrative third-party Unsplash imagery, not claimed to show Tamkeen. Replace with approved Tamkeen imagery before publication.
- Official family stories, media releases and gallery assets were not supplied; these pages deliberately avoid invented institutional claims.
- Arabic content is still not translated; language button is a visual selector pending localization.


## Home page update (November 2026)
- Ajman and Dubai branch buttons use the user-provided exact Google Maps place-ID URLs. Abu Dhabi is labeled Coming Soon and intentionally has no map link.
- Why Us text is provided by the user; its photo is illustrative and may be replaced.
- Four requested programs link to their official Tamkeen course pages. No unverified price was added.
- Certification Integrity CTA points to the existing local `certificate.html` preview; actual certificate verification needs Tamkeen backend integration.
- Homepage footer and all other pages are unchanged.


Four new local course pages: program-nursery-management.html, program-teaching-ai-children.html, program-ai-in-business.html, program-ai-applications.html. Homepage featured programs link to these local pages. Course information is summarized from official Tamkeen listings; prices are snapshots and booking is not integrated.


Nine catalog course cards now link to individual local pages. These pages contain illustrative curriculum topics only, not verified official syllabi; contact Tamkeen for current fees and schedules.


PROGRAM CATALOG: Imported uploaded dark-luxury sidebar/filter/grid concept, restyled blue. 91 unique catalog entries from verified official listing pages 1-5, existing uploaded reference catalog and existing local course listings. Second reference site exposed category labels but not course listings in accessible content; full 22-page official catalog NOT exhaustively imported. Catalog page size 10.

Catalog metadata: course cards display Dubai and Ajman as Tamkeen center branch locations, not confirmed availability of each individual course at both branches. Durations are shown as “Duration on request” where no verified course-specific duration was available. Filters do not invent course-specific durations.

Catalog updated with accessible official listing pages 10, 11, 17. Added 48 new entries; updated 0 existing entries. Total 227. Other unprocessed pages remain pending. Newly added entries link to the official listing page where individual program URL was not extracted.


2026-11-05: All 227 catalog entries have English display titles, subject-matched illustrative images, and their own course-details.html?catalog=N pages. Only confirmed individual official URLs are linked as such; other listings link to the official catalog. No unverified syllabi, durations or outcomes are invented.


Course detail update: all 227 catalog View program links stay on local course-details.html pages. External official-site button removed. Verified detailed source-based content is presently included for Advanced Artificial Intelligence; other course details are pending verification and must not be presented as complete official syllabi.


## Course booking cards
All 227 catalog course detail pages use the same image-led booking card with Book Now and Inquiry. Book Now adds the course to the local cart and navigates to checkout.html. Inquiry opens contact.html with the program name. Checkout remains a frontend-only preview; no payments are processed. No discount or installment claims are displayed unless independently verified.

All 227 dynamic course pages show the same six navigation sections. Where verified individual content is missing, a transparent information placeholder is shown instead of removing the section.

All 227 catalog program pages now display the same four certificate items in the Certificates section.

Booking card: desktop sidebar stays visible while scrolling, fits shorter screens with its own internal scroll; mobile displays full card in normal page flow. Applies to all 227 catalog pages.


Verified content progress: added locally paraphrased information for Human Resource Management Using Artificial Intelligence, AI-Powered Business Management and E-Commerce Management Training Program based on their official pages. The other 223 courses (excluding the previously completed Advanced Artificial Intelligence) remain pending verification. No external course links added.


Additional verified-source summaries added for Training of Trainers, Self E-Learning Skills, Comprehensive Pedagogical Teaching Skills, English Language Training, Professional Video Editing Skills and Digital Transformation in Business Administration. These are selective summaries of available official information, not complete transcripts. Remaining catalog entries still require individual verification.


## 150 expanded course information pages

150 of 227 catalog courses now contain expanded sections. 137 additional pages are clearly marked **editorial course previews**, not official Tamkeen curricula. 13 existing course entries with previously sourced information are retained. The shared certificate section is unchanged. See `COURSE_CONTENT_STATUS.csv` for per-course classification.


## Course content expansion
All 227 catalog entries now have populated detail content. Previously sourced course details are preserved without modification. Other course descriptions, topics, objectives, audiences, outcomes and FAQs are independently drafted editorial previews, not official Tamkeen syllabi. See COURSE_CONTENT_STATUS.csv for per-course classification.


## Training topics and FAQ expansion
Expanded all editorial course entries with detailed expandable subtopics and eight course-specific FAQs. Previously sourced details in js/verified-course-details.js are unchanged. Some previously sourced entries lacking FAQs receive administrative FAQs in js/course-faq-supplements.js. **Most new training topic text is independently authored, not extracted from Tamkeen’s official site**. The official site was consulted but does not provide reliable bulk extraction in this environment. Advanced Artificial Intelligence is unchanged.
