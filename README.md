# Yuwei Chuai — Academic Website

Personal academic website for Yuwei Chuai, a computational social scientist
studying misinformation, community fact-checking, and platform governance.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The static website is generated in `dist/client`. The build removes client-side
framework routing and hydration from the final HTML. Only the small network
animation and, when configured, the opt-in analytics runtime remain. Navigation
is plain HTML anchors: no scripted scrolling or section entrance effects.

## GitHub Pages

The included workflow publishes the site whenever `main` or `master` changes.
In the repository settings, set **Pages → Build and deployment → Source** to
**GitHub Actions**. The build supports both a `username.github.io` repository
and a project site hosted below `username.github.io/repository-name`.

If no workflow appears under **Actions**, first check that the repository
contains `.github/workflows/deploy-pages.yml` at its root, alongside
`package.json`. Upload the unzipped **contents**, not the ZIP or an extra enclosing
folder. On macOS, press **Command + Shift + .** in Finder to show `.github`
before selecting files. GitHub only discovers workflow YAML files inside that
exact directory. The exported standalone `deploy-pages.yml` can also be pasted
using **Add file → Create new file**, naming it
`.github/workflows/deploy-pages.yml`.

After choosing **Settings → Pages → GitHub Actions**, open **Actions → Deploy
academic website → Run workflow** to start the first build. If Actions is
disabled, check **Settings → Actions → General**; an organization policy may
require an administrator. A GitHub Pages user site should use a repository named
`YOUR-USERNAME.github.io`. See [GitHub's publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Google Analytics (GA4)

Analytics is implemented but **disabled until you supply your own measurement
ID**. Find the `G-...` ID in Google Analytics under **Admin → Data streams → your
web stream**. Do not use a numeric property ID or a `GTM-...` container ID.

Choose one configuration method:

- Edit `googleAnalyticsId` in `site.config.json` from an empty string to your ID.
- Or add the repository variable `NEXT_PUBLIC_GA_ID` under **Settings → Secrets
  and variables → Actions → Variables**. The workflow passes it into the build.
  This takes precedence over `site.config.json` when non-empty.

Commit the configuration change or manually rerun the workflow after adding a
repository variable. This is a static site: analytics settings are applied at
**build time**, not when the deployed page starts. No secret is needed for a GA4
measurement ID. An empty or invalid ID leaves tracking and consent controls off.

The Google tag is loaded only after an explicit analytics opt-in, or a previously
saved opt-in. Declining sends no initial request to Google. Preferences expire
after six months; visitors can change them via **Analytics preferences** at the
bottom of the page. Advertising consent, personalization, and Google signals
remain off. Withdrawing consent disables the tag, clears this site's prefixed
analytics cookies, and reloads the page to unload the third-party script.

Local HTML previews and HTTP development pages do not load analytics. To verify
real collection after deployment, accept analytics on the HTTPS website and
check your property's **Realtime** report; ad blockers may prevent collection.
The implementation uses [Google's basic consent approach](https://developers.google.com/tag-platform/security/concepts/consent-mode),
not cookieless tracking before permission. This technical setup is not a claim
of legal compliance; review your public privacy notice and GA retention settings
before activating production collection.

## Updating content

**Selected publications:** edit `publications.bib` at the repository root. The
build imports entries in file order, highlights Yuwei Chuai automatically, and
adds † to explicitly listed corresponding authors. See **[PUBLICATIONS.md](PUBLICATIONS.md)**
for a Chinese editing guide and examples. Official venue logos are stored in
`public/logos`; mapping and optional annual variants are in `data/venues.json`.

Other content lives in `app/page.tsx`; design tokens and responsive styling live
in `app/globals.css`. The CV is `public/Yuwei_Chuai_CV.pdf` and the portrait is
`public/yuwei-chuai.jpg`. The website is a selection; the CV contains the full list.

## Content checks and downloadable preview

After building, run the static content and local-link checks:

```bash
npm run test:site
```

There are no section entrance effects, animated link movements or smooth
scrolling. Native anchors work even with JavaScript disabled. The network still
animates, pausing during scroll, offscreen and in hidden tabs. It uses fewer
updates on touch devices and respects reduced-motion and the pause button.

`test:site` runs the academic website's production checks. The unused starter
catalog / development-metadata smoke tests remain separate from this static
website's deployment gate.

To export a self-contained HTML preview and a GitHub-ready source ZIP, commit
your changes, then run this command with an absolute output directory:

```bash
node scripts/export-deliverables.mjs /absolute/path/to/output
```

Open the generated HTML in a browser. Its styles, portrait, venue logos, and CV are
embedded; its network animation also runs offline. External scholarly links
still require an internet connection. The graph is a conceptual illustration,
not research data. Its pause button stops the animation; reduced-motion settings
show a static network. Animation work also pauses offscreen and in hidden tabs.
The ZIP exports the committed source and substitutes a portable hosting manifest
without the private Sites project ID. Unzip it, upload all files (including
`.github` and `.openai`) to your GitHub repository, and configure Pages as above.
When updating an existing repository, preserve your configured GA4 ID in
`site.config.json` (or keep the existing Actions variable). The distributed
example intentionally does not contain a measurement ID.

## Preview / production parity

The downloadable preview is derived from the **final deployment HTML**, with
the same native anchors and identical network script. It only embeds assets
and removes analytics. GitHub Actions runs the same build and regression checks.
Do not upload only the preview HTML into an old source tree.

If a live page still looks old, confirm the latest Actions deployment succeeded.
Open `build-info.json` under the website root to check its content ID and build
time. The new build identifies itself as `static-html-native-anchors`. The HTML
also includes that content ID in its `site-build` meta tag. A cached old version
or a failed workflow is not evidence the new files have deployed.

For internal browser QA after a build, the Vite development server exposes
`/__production__/index.html` (exact deployment bytes) and `/__mobile-check`
(a 390px-wide same-origin iframe). These are development-only endpoints and
are not published with the website. The iframe checks responsive layout; it is
not a substitute for testing Safari or Android on a physical device.
