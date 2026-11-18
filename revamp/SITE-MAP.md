# What's in `personalWebsite/` vs. what's on halvorhansen.no

`content/` is the folder Netlify publishes (it holds `index.html`, and the live
homepage matches it). **Everything inside `content/` is public** at
`halvorhansen.no/<path>`, whether or not a page links to it. Files outside
`content/` (`notInUse/`, `toBeDeployed/`, `admin/`, `node_modules/`, this
`revamp/` folder) are in git but not published.

## 1. Pages in the menu, and the files they use

| Page | File | Uses |
|---|---|---|
| About (home) | `index.html` | `logo3.png`, `pb2.png`, favicons, `site.webmanifest`, formsubmit.co contact form |
| Lambdasim | `LambdaSim.html` | `logo3.png`, `lambdaLogoCrop52.png`, `litenhh.png` (favicon) |
| Art | `art.html` | `logo3art.png`, `art/art0–44` (41 shown; `art3`, `art9`, `art11`, `art12` are commented out or unused) |
| Economic Outλook | `economicOutlook.html` | `eo/eo.webp`, newsletter archive loaded from a Google Sheet |
| CV | `CV.html` | `cv/LarsHalvorHansen_english_CV.pdf`, `cv/LarsHalvorHansen_norsk_CV.pdf` |
| Blog | `Blogg.html` | `blogger'n.png`, posts loaded from a Google Sheet |

Shared: `favicon*.png`, `favicon.ico`, `apple-touch-icon.png`,
`android-chrome-*.png`, `site.webmanifest`, `sw.js`.

## 2. Public but not linked from the menu (reachable if you know the URL)

These look like separate projects that share the domain on purpose:

- **Wedding / save-the-date site:** `kajaoglarshalvor.html` (+ `2`, `4`, `gammel` versions), `save-the-date.html`, `om-oss.html`, `assets/` (its own `style.css`, `site.js`, images, `videoIntro.mp4`), `kajaoglarshalvor/`, `k_og_lh_Pages/`, `std*.jpg`, `savethedate*.jpg`, `Savethedateforside*.jpg`
- **Info screen:** `infoskjerm/` (about 100 antenna PNGs and 118 periodic-table PNGs, memes, globe-time images)
- **Small tools / demos:** `cubesatInfo/`, `spectrum/`, `harmonizedemo.html`, `everlongstk_mockup.html`, `gdpb-by-country.html`, `mattehjelp.html` (+ `Oppgaveark_Standardform.pdf`), `julekalender.html`, `knightsandbox.html`, `dj.html`, `demoside.html`, `LambdaSimRoadmap.html`, `economicOutlookSignup.html`, `brevo-frame.html`
- **Someone else's draft:** `adrianVin/`

## 3. Leftovers that are probably safe to move out of `content/`

- Backups and old versions: every `*.bak`, `index2.html`, `art2.html`, `main.html`, `t.html`, `OLDeconomicOutlook.html`, `economicOutlookOld.html`, `oldEO.html` (empty), `economicOutlook3.html` (1.9 MB), `BloldContactPage.html`, `other/` (test pages, `main2–43.html`, two party videos ~21 MB), `.history/`
- Working files: `eo/2025/**` and `eo/2026/**` (SQLite `.db` files, `shell.nix`, `flake.nix`, notes like `noteToSelf.md`, `.env.example`), `eo/temp.txt`, `eo/eoPlan.md`, `temp.md`, `fetch_old_eo.sh`, `save_csv.php` (Netlify doesn't run PHP), `package.json`, csv files (`flagg*.csv`, `2fisk2.csv`), `burns.txt`, `quotes.txt`, `cv/*(old).*`, `cv/oldCVs/`, `std5b.pxd`, `Teo.hiec`
- Big source images nothing links to: `eo/eo.png` (17 MB), `eo/eoLogo.png` (7 MB), `spectrum/wall.png` (15 MB, check spectrum first), `imageDB/burmester/BurmesterSystem.png` (30 MB), `faviconEconomicOutlook/eit.jpg` (7.5 MB), `Teo2.png` (5 MB), `assets.zip` (9.6 MB), `profil2.png`, `pang.png`, `logo1*.png`, duplicate `denne314/315.jpg`, `remarkable_Idea*.JPG`

Note: `imageDB/` images may be used by old newsletter issues; check before moving.

## 4. Worth knowing

- `art/art44.png` is **14.8 MB** and `art42.jpg` is 2.8 MB; they're the first images on the Art page. Saving them as ~1600 px wide JPG/WebP would make that page load many times faster.
- The Google Sheets API key in `Blogg.html` is visible to anyone (that's unavoidable for a client-side fetch). Restrict it to `halvorhansen.no` under "Website restrictions" in Google Cloud Console so nobody else can use it.
- The `/about → /` redirect in `netlify.toml` has a typo (`statys` instead of `status`), so it silently uses the default.
