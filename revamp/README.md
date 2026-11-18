# Revamped site (staging folder)

New versions of the menu pages, ready to drop into `content/`.
Nothing here is live until you run `apply.sh` and push.

## What changed

- **One shared sidebar** on every page (`hh-site.css` + `hh-site.js`), with the
  blue HH logo kept on the Art page. Menu labels wrap instead of overflowing.
- **Phone:** a black top bar with the logo and a ☰ button; the menu drops down
  under it. Closes on link tap, Escape or a tap outside.
- **Blog** is now in the menu as a small, muted link under the main items.
- **Dark mode** follows the device setting on every page. Sidebar stays black.
- **Economic Outλook:** the dark-mode button is gone; it follows the device theme.
  Nothing else on that page changed.
- **Image placeholders:** every image has its real width/height, so space is
  reserved and nothing jumps; a soft grey pulse shows until it loads.
  The blog shows three skeleton cards while posts load.
- No gradients: accent links are one solid blue.
- Smaller fixes: stray `<thead>` removed from every page, real JSON-LD,
  "Copied ✓" instead of an alert popup, a 3 KB logo (`logo3-256.png`)
  instead of the 4000×4000 one, a broken class on the Art page.

## Files

| File | Goes to |
|---|---|
| `index.html`, `LambdaSim.html`, `art.html`, `CV.html`, `Blogg.html`, `economicOutlook.html` | replace the same files in `content/` |
| `hh-site.css`, `hh-site.js`, `logo3-256.png` | new files in `content/` |
| `README.md`, `SITE-MAP.md`, `preview.sh`, `apply.sh` | stay here |

## Try it locally

    cd ~/Documents/personalWebsite
    bash revamp/preview.sh        # then open http://localhost:8000

## Ship it

    bash revamp/apply.sh         # copies the files into content/
    git add -A content && git commit -m "Revamp layout, mobile menu, dark mode" && git push

Netlify publishes on push as usual. To undo before pushing: `git checkout -- content`.

`SITE-MAP.md` lists which files the live site actually uses and what can be cleaned up.
