# Verification report

Validated November 16, 2026 against the production build for the cohesive homepage redesign.

## Automated checks

- Astro diagnostics: 0 errors, 0 warnings, 0 hints.
- Vitest: all 8 tests passed across 2 files.
- Root and `/portfolio/` builds: 3 pages generated, internal links and assets verified.
- No PDFs are included in the output. The optional résumé link is absent until the cleaned PDF is supplied; only the exact future `resume.pdf` path is permitted by the build checker.
- The retired navigation feature and its configuration/styles are removed. Repeated hobby descriptions, photo captions, and the duplicate biography are removed.

## Lighthouse mobile

| Page | Date | Performance | Accessibility | Best practices | SEO |
| --- | --- | ---: | ---: | ---: | ---: |
| Homepage | November 16, 2026 | 100 | 100 | 100 | 100 |
| NASA case study | November 16, 2026 | 100 | 100 | 100 | 100 |

Measured against the local production preview in headless Chrome. Scores can vary with hosting conditions. Raw reports and the score summary are in `verification/`.

## Browser checks

- Homepage, NASA case study, and 404 checked at 375, 768, and 1440 pixels, with no horizontal overflow or JavaScript errors.
- Education → Experience → Projects → Outside of work, with one heading per section.
- All four photos load at each viewport width, using four columns on desktop/tablet and two on mobile. The full images are contained within portrait frames; no people are cropped.
- Desktop, tablet, mobile, and demo screenshots were visually inspected. Existing optimized WebP assets retain their orientation and metadata removal.
- All five navigation targets, keyboard skip navigation, and reduced motion work. Lighthouse accessibility checks, including contrast, pass.
- NASA confirmed warning, reset/first-cycle boundary, previous/next, slider boundaries, and engine selection passed. Without JavaScript, the controls are disabled and the accessible 176-row table opens correctly.
- Current check results are recorded in `verification/browser-checks.json`. `photo-checks.json` is the historical November 15 photo-import check.

## Screenshots

![Desktop homepage](verification/desktop-home.png)
![Mobile homepage](verification/mobile-home.png)
![Tablet homepage](verification/tablet-home.png)
![Photo gallery](verification/desktop-photos.png)

## Deployment

Repository: https://github.com/shaury04/shaury04.github.io

Production: https://shaury04.github.io/

Pushes to `main` validate and deploy through GitHub Actions. See [deployment history](https://github.com/shaury04/shaury04.github.io/actions) for current status.
