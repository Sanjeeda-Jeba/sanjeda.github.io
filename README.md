# sanjeda.github.io

A React-based futuristic kawaii academic portfolio for **Sanjeda Akter** with a clean editorial layout (inspired by modern personal portfolio patterns) and an easy update workflow.

## What makes it dynamic
- Animated neural-network background canvas
- Rotating role text in the hero
- Interactive research track tabs
- Searchable publications/projects
- Expand/collapse lab log entries
- Social links in hero + footer

## Easy update system (single source of truth)
Most updates happen in one file:
- `content.js` ← update text, links, social URLs, sections, stats, tracks, publications, and lab log.

Core UI code:
- `app.jsx` renders everything from `content.js`.
- `style.css` controls visuals and layout only.

## Typical updates
1. Add publication items in `content.js > publications`.
2. Update social links in `content.js > socials`.
3. Edit hero/about text in `content.js > site` and `aboutText`.
4. Update values and research tracks in `content.js > values` and `researchTracks`.
5. Replace profile image and CV file paths in `content.js > site`.

## Local preview
```bash
python3 -m http.server 4173
```
