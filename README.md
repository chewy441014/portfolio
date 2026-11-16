# Preston Hill — personal services website

Four static pages built with Astro and TypeScript, ready for Netlify:

| Page | URL | Source |
| --- | --- | --- |
| Home | `/` | `src/pages/index.astro` |
| Tutoring | `/tutoring/` | `src/pages/tutoring/index.astro` |
| Web development | `/web-development/` | `src/pages/web-development/index.astro` |
| Private chef | `/private-chef/` | `src/pages/private-chef/index.astro` |

## Local setup

Use Node 24 LTS. `.nvmrc` records the agreed version, `24.22.3`. npm is included with Node. From the repository folder:

```sh
git pull --ff-only
npm ci
npm run dev
```

Open the address printed by Astro, normally http://localhost:4321/. The development server runs in the background, following the repository's `AGENTS.md`. You can close the terminal and keep viewing the site. Changes to source files update the development preview.

```sh
npm run dev:status
npm run dev:logs
npm run dev:stop
```

If an older foreground server is still running, stop it with Ctrl+C before starting the new background server. If port 4321 is occupied, use the address Astro prints.

## Check and test

```sh
npm run check
npm test
```

`check` checks Astro and TypeScript files. `test` checks types, builds the production site, and checks all four generated pages for navigation, correct active links, distinct titles, valid local links/assets/anchors, and Netlify form markup.

To view the production build:

```sh
npm run dev:stop
npm run build
npm run preview
```

Open the address printed by the preview command. Production preview uses the most recent build; rebuild after source changes. Ctrl+C stops the production preview.

Manually review all four pages at phone and desktop sizes. Check the main navigation, keyboard Tab/Enter use, skip link, inquiry anchors, required fields, and email validation. All navigation stays visible on small screens, including without JavaScript.

## Design and editing

The shared stylesheet is `src/styles/global.css`. Its CSS variables contain the palette:

| Variable | Color | Use |
| --- | --- | --- |
| `--color-beige` | `#D3D2C5` | Base background |
| `--color-pink` | `#DBA9C0` | Accent surfaces |
| `--color-orange` | `#EEB472` | Accent surfaces and highlights |
| `--color-green` | `#32533E` | Dark surfaces and buttons |
| `--color-ink` | `#161616` | Black text on light surfaces |
| `--color-white` | `#FFFFFF` | White text on dark surfaces |

`src/layouts/SiteLayout.astro` owns the page shell and metadata. Shared navigation, footer, illustrations, and forms live in `src/components/`. Service titles and homepage summaries live in `src/data/services.ts`.

The first version uses system fonts and original inline SVG illustrations. React can be added when a specific interactive feature warrants it.

Copy is an initial draft for review. Before public launch, confirm service scope, subjects/student levels, qualifications, service area, availability, rates, and any photos or additional project examples. The site does not invent testimonials, credentials, client names, or prices.

## Contact forms

Each service page has its own form name and a hidden service identifier. Forms include required name/email/message fields, an optional context field, and a honeypot. Without JavaScript, the HTML form can submit through Netlify's normal form handling. With JavaScript, it displays submission feedback on the current page.

Development mode and production previews on localhost prevent submissions and show a clear preview message. No local test inquiry is sent. Without JavaScript, local servers do not process form submissions.

The forms are prepared for Netlify; delivery is not configured by simply running Astro. On Netlify, enable form detection **before a fresh deploy**, verify all three forms appear, and configure email notifications to your chosen address. Send a test inquiry on the deployed site and verify both the stored submission and the email before treating the forms as ready. No recipient email address is embedded in the source.

## Eventual Netlify deployment

Connect this repository as one Netlify project. The tracked `netlify.toml` supplies:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: read from `.nvmrc`

All four pages are generated as HTML. No server adapter is required. Review feature branches in Deploy Previews and merge finished changes to the production branch when ready. Final form delivery needs a deployed-site check as described above.

After choosing the final public domain, add Astro's `site` configuration and domain-specific canonical URLs/sitemap. GitHub source changes alone do not create or configure a Netlify account/project.
