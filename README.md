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

The static website is generated in `dist/client`.

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

Main content lives in `app/page.tsx`; design tokens and responsive styling live
in `app/globals.css`. The current CV is `public/Yuwei_Chuai_CV.pdf`, the portrait
is `public/yuwei-chuai.jpg`, and the small paper thumbnail is
`public/request-a-note.jpg`. Publication badges are venue abbreviations, not
official journal logos. The website is a selection; the downloadable CV contains
the full publication list.

## Content checks and downloadable preview

After building, run the static content and local-link checks:

```bash
node --test tests/academic-content.test.mjs tests/analytics.test.mjs
```

To export a self-contained HTML preview and a GitHub-ready source ZIP, commit
your changes, then run this command with an absolute output directory:

```bash
node scripts/export-deliverables.mjs /absolute/path/to/output
```

Open the generated HTML in a browser. Its styles, portrait, thumbnail, and CV are
embedded; its network animation also runs offline. External scholarly links
still require an internet connection. The graph is a conceptual illustration,
not research data. Its pause button stops the animation; reduced-motion settings
show a static network. Animation work also pauses offscreen and in hidden tabs.
The ZIP exports the committed source and substitutes a portable hosting manifest
without the private Sites project ID. Unzip it, upload all files (including
`.github` and `.openai`) to your GitHub repository, and configure Pages as above.
