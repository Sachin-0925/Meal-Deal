# PrimeTime Hollick Kenyon — Meal Deal TV

Dependency-free static digital signage using the approved Meal Deal poster, preserved in `assets/approved-meal-deals.png`. Food photographs and the logo are displayed directly from that artwork through SVG viewports; no menu imagery is generated.

## TV
Open https://sachin-0925.github.io/Meal-Deal/ and use the browser's fullscreen / kiosk mode. The website cannot bypass browser restrictions to enter fullscreen automatically. Disable the TV/computer sleep timer for continuous operation.

The 1920×1080 presentation scales proportionally to the viewport, with black margins if its aspect ratio differs. It starts with the complete approved poster for 22 seconds, then shows five pairs of enlarged meals for 14 seconds each. The 92-second loop repeats indefinitely. Deal restrictions remain visible. Reduced-motion preferences disable crossfades. The approved overview remains visible if JavaScript is disabled.

No fonts, libraries, analytics, APIs, or other external resources are loaded. Once loaded, rotation needs no network requests. A fresh page load requires access to the hosted files. No backend or build step is needed.

## GitHub Pages
Repository Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch: **main** → Folder: **/ (root)** → Save.

## Files
- `index.html`: semantic page and approved-poster fallback
- `styles.css`: TV layout and subtle transitions
- `signage.js`: exact approved menu text, image viewports, scaling and bounded looping
- `assets/approved-meal-deals.png`: unmodified source artwork
- `.nojekyll`: serve the static files directly

To preview locally, run `python3 -m http.server 8000` from this directory and visit http://localhost:8000.
