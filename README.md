# Shaury Gautam — Portfolio

A warm, personal Astro portfolio for software engineering and applied ML roles. Built as a static site for `https://shaury04.github.io/`.

## Development

Requires Node.js 22.19+; deployment uses Node 24.

```sh
npm ci
npm run dev -- --background
```

Manage the development server with `npx astro dev status`, `npx astro dev logs`, and `npx astro dev stop`.

```sh
npm run verify
npm run preview
```

Verification includes Astro diagnostics, unit tests, a `/portfolio/` prefix build, and a final root build. Both builds check internal links and assets and reject PDFs or references to removed pages.

## Content and photos

- Edit professional details, education, contact links, and interests in `src/data/profile.ts`.
- Edit the NASA case study in `src/content/work/turbofan.md`.
- Adjust shared design tokens and responsive styles in `src/styles/global.css`.

Set `boredLink` in the profile to a game, video, or another destination when ready. The “Click here if you’re bored” navigation link stays hidden while the value is unset.

Photos are optional. Add optimized images under `public/images/`, then set `portrait` or an interest’s `photo` to `{ src: "/images/filename.webp", alt: "Descriptive alternative text", width: 800, height: 1000 }`, using the image’s actual dimensions. Images render only when configured, with lazy loading and explicit dimensions. Interest photos use a 4:3 crop.

The original résumé and phone number are intentionally excluded. PDF files are ignored by Git, and the build refuses to publish any PDF. Employer work appears only in Experience; do not add private code, internal screenshots, or unsupported production or revenue claims.

## NASA data

The interactive demo contains three recorded XGBoost test trajectories; no model runs in the browser. Its source repository and commit are included in `src/data/nasa-demo.json` and displayed on the case study. With JavaScript disabled, the initial chart, narrative, and accessible data table remain available.

To regenerate from the original NASA checkout:

```sh
python3 scripts/export_nasa_demo.py --source /path/to/nasa
npm test
```

The exporter checks the source revision and requires locally generated prediction artifacts. Do not substitute illustrative or fabricated records.

## GitHub Pages

The public repository is `shaury04/shaury04.github.io`. In Settings → Pages, the source must be **GitHub Actions**. Pushes to `main` and manual workflow dispatches validate and deploy; pull requests validate without publishing. Failed checks prevent deployment.

For a project-site deployment, configure `BASE_PATH` consistently for the final build and its link check. The default deployment is the account root, with no custom domain, analytics, or backend.

See `VERIFICATION.md` for the latest checks and screenshots.
