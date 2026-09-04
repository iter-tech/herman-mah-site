# Herman Mah — campaign site (concept)

A single-page site for Councillor Herman Mah, District of North Vancouver.
Static HTML, CSS and vanilla JavaScript. No build step, no dependencies.

```
index.html      all markup and content
css/styles.css  design tokens, layout, motion
js/main.js      nav state, scroll reveals, countdown, counters
```

## Content

Every line of copy, and every photograph, comes from the existing site at
hermanmah.ca. Nothing has been invented, paraphrased into new claims, or
added as filler. Placeholders are not used anywhere — if something is not
on this page, it was not on the original site.

## Photographs

Images are currently loaded from the existing Wix media host. Before this
goes anywhere public, download the four photos into an `img/` folder and
change the `src` attributes in `index.html` so the site owns its own assets.

## Election details in the code

- General voting day: Saturday, October 17, 2026
- Advance voting: October 7, 10 and 12
- The hero countdown targets `2026-10-17T08:00:00-07:00` in `js/main.js`

## Notes

- Responsive from 320px up.
- Keyboard focus is visible throughout; skip link included.
- `prefers-reduced-motion` disables all animation.
- Without JavaScript the page renders fully; only the countdown is missing.
