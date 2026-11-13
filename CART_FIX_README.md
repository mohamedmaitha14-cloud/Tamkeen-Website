# Persistent cart fix

- The course catalog now loads before `js/script.js` on all 36 HTML pages, so saved catalog courses are recognized throughout the website.
- The cart badge counts saved quantities on every page.
- Cart drawer, cart page and checkout read the same browser `localStorage` keys (`tamkeenBlueSaved` and `tamkeenBlueCartQty`).
- The cart refreshes when another browser tab changes storage and when a page is restored from browser history.
- Unknown saved program IDs are shown as placeholders rather than silently hidden.
- Course booking dialogs refresh the shared cart display immediately.
- No `.prettierrc.json` was added.

Test with Live Server or your GitHub Pages URL; the same origin is required for shared localStorage. `file://` previews may behave differently.
