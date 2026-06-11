# IndoAm Foods — Scroll Journey Site

A scroll-driven 3D landing page for **IndoAm Foods**, a Southern California
distributor of Indian ethnic food brands for grocery stores and retailers.

Inspired by vectrfl.com: a pale isometric 3D world rendered with **Three.js**,
scrubbed by **GSAP ScrollTrigger**. A glowing supply path draws itself across
the scene as you scroll — from the Port of LA, through the IndoAm distribution
center, along SoCal delivery routes, to a grocery storefront — while a pinned
four-step process list tracks the journey. Below the fold: feature sections,
brand categories, an FAQ, and a dark CTA footer.

## Run locally

No build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Three.js and GSAP are vendored in `vendor/` so the site works offline.

## Structure

- `index.html` — markup: loader, hero, journey (pinned step UI), content sections
- `css/style.css` — styling, loader orbits, step-list states
- `js/main.js` — Three.js scene (port, warehouse, highway, store zones),
  glowing path shaders, camera choreography, ScrollTrigger wiring
- `vendor/` — three.module.min.js, gsap.min.js, ScrollTrigger.min.js
